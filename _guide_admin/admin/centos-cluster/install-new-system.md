---
title: Install new system
nav_order: 2
parent: CentOS Cluster (legacy)
---

# "Install new system"

### 重装系统

开root账号

同步时钟 `/usr/sbin/ntpdate loginNode`, ubuntu 需要安装 `sudo apt install ntpdate`
ubuntu切换时区 `sudo dpkg-reconfigure tzdata`

### NFS + 挂载

挂载: `sudo systemctl enable+start nfs`; 修改 `/etc/fstab`; 手动挂载

### crontab

crontab -e 和bigMem同步

sar.py依赖 `pandas matplotlib`, `sudo apt install sysstat`, `sudo vim /etc/default/sysstat`, `sudo systemctl enable+start sysstat`, 切换保存的文件夹(创建soft link `/var/log/sysstat->/var/log/sa`)
参考[链接](https://tecadmin.net/how-to-install-sysstat-on-ubuntu-20-04)

### 账户

自动同步账户信息, 手动同步group信息, 为admin号创建home目录

~~~ bash
cp -r /etc/skel /opt/home-admin/yingzhouli
chown -R yingzhouli-admin: /opt/home-admin/yingzhouli
~~~

### 切换yum/apt源

**yum**:

~~~ bash
sudo mv /etc/yum.repos.d/CentOS-Base.repo /etc/yum.repos.d/CentOS-Base.repo.backup
sudo wget -O /etc/yum.repos.d/CentOS-Base.repo http://mirrors.aliyun.com/repo/Centos-7.repo
sudo yum clean all
sudo yum makecache
~~~

**apt**:

~~~ bash
sudo vim /etc/apt/sources.list
~~~

edit: (focal is the version name of 20.04, 22.04 is jammy (`lsb_release -a`, `:%s/focal/jammy/g
`))
~~~ bash
deb https://mirrors.tuna.tsinghua.edu.cn/ubuntu/ focal main restricted universe multiverse
deb-src https://mirrors.tuna.tsinghua.edu.cn/ubuntu/ focal main restricted universe multiverse

deb https://mirrors.tuna.tsinghua.edu.cn/ubuntu/ focal-updates main restricted universe multiverse
deb-src https://mirrors.tuna.tsinghua.edu.cn/ubuntu/ focal-updates main restricted universe multiverse

deb https://mirrors.tuna.tsinghua.edu.cn/ubuntu/ focal-backports main restricted universe multiverse
deb-src https://mirrors.tuna.tsinghua.edu.cn/ubuntu/ focal-backports main restricted universe multiverse

deb https://mirrors.tuna.tsinghua.edu.cn/ubuntu/ focal-security main restricted universe multiverse
deb-src https://mirrors.tuna.tsinghua.edu.cn/ubuntu/ focal-security main restricted universe multiverse

~~~

~~~ bash
sudo apt-get update
~~~

### 开启10888端口
ssh连接新服务器非22端口报错
ssh_exchange_identification: Connection closed by remote host

排查:
1. 检查`/etc/ssh/sshd_config`有无明显问题
2. 检查`iptables`, `firewall-cmd`有无明显问题
3. 重启`sudo systemctl restart sshd`
4. 检查日志`journalctl -xe`
5. 发现22端口正常, 10888端口异常, 排查原因

https://stackoverflow.com/questions/11672525/centos-6-3-ssh-bind-to-port-xxx-on-0-0-0-0-failed-permission-denied

CentOS使用SELinux来增加额外的security. 参考:
https://blog.tinned-software.net/change-ssh-port-in-centos-with-selinux/

6. 发现服务器没有命令semanage, 查找`yum provides /usr/sbin/semanage`得到包`policycoreutils-python`, 安装`yum -y install policycoreutils-python`

允许10888端口

~~~ bash
sudo semanage port -a -t ssh_port_t -p tcp 10888
sudo semanage port -l | grep ssh
sudo firewall-cmd --add-port=10888/tcp --permanent
sudo firewall-cmd --add-port=10888/udp --permanent
sudo firewall-cmd --reload
sudo vim /etc/ssh/sshd_config
sudo systemctl restart sshd
~~~
配合路由器端口转发 可外网直连 关闭root远程登陆

信任其他机器

~~~ bash
sudo firewall-cmd --add-source=192.168.2.100 --zone=trusted --permanent
sudo firewall-cmd --add-source=192.168.2.0/26 --zone=trusted --permanent
~~~

### 安装slurm

参考[现有教程](/guide/admin/slurm-on-cluster/Installation.md)

### 解决bigMem2上lspci看不懂的解决办法

参考[答案](https://github.com/dylanaraps/neofetch/wiki/Frequently-Asked-Questions#linuxfreebsd-why-does-getgpu-doesnt-show-my-exact-video-card-name). 运行命令`sudo update-pciids`update一下device id和名字的映射表, 然后再运行`lspci | grep VGA`就能看到GPU型号.
