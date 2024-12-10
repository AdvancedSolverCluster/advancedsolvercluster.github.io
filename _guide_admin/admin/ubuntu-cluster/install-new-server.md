---
title: 安装新机
nav_order: 1
parent: Ubuntu Cluster
---

Feb 24, 2024

# 安装新机
*Last modified: June 02, 2024*

## 第一步

```bash
# 新机安装第一步，请用tmp-admin号登录
# 脚本适用于所有除了loginNode以外的新机
# 请先根据密码本重设root密码！(sudo passwd)

# add_admin: 用admin号加上xli-admin, yjzhang-admin, jyliu-admin
sudo groupadd -g 1102 Student
sudo groupadd -g 1103 Faculty
sudo groupadd -g 1104 Collaborator
sudo groupadd -g 1105 admin
sudo useradd -m -d /opt/home-admin/xli -u 1501 -g 1105 -s /bin/bash xli-admin
sudo usermod -aG sudo xli-admin
sudo useradd -m -d /opt/home-admin/yingzhouli -u 1502 -g 1105 -s /bin/bash yingzhouli-admin
sudo usermod -aG sudo yingzhouli-admin
sudo useradd -m -d /opt/home-admin/yjzhang -u 1503 -g 1105 -s /bin/bash yjzhang-admin
sudo usermod -aG sudo yjzhang-admin
sudo useradd -m -d /opt/home-admin/jyliu -u 1504 -g 1105 -s /bin/bash jyliu-admin
sudo usermod -aG sudo jyliu-admin

# 挂载磁盘, 在bm上, 可能需要先umount
# 在ln上 sudo apt-get install nfs-kernel-server -y
sudo apt install nfs-common -y
sudo mkdir -p /scratch
sudo mkdir -p /software
sudo mkdir -p /etc/share
sudo mount -t nfs loginNode:/home /home --verbose
sudo mount -t nfs loginNode:/scratch /scratch --verbose
sudo mount -t nfs loginNode:/software /software --verbose
sudo mount -t nfs loginNode:/etc/share /etc/share --verbose

sudo bash /home/admin/sync-script/syncusers_bmnode.sh

# 功成名就，可以退号了
```

防火墙的设置
``` bash
sudo firewall-cmd --add-port=10888/tcp --permanent
sudo firewall-cmd --zone=trusted --add-source=192.168.2.0/24 --permanent
sudo firewall-cmd --add-port=123/udp --permanent
sudo firewall-cmd --reload

sudo firewall-cmd  --list-all
sudo firewall-cmd --zone=trusted --list-all
```
## 第二步

Modify `/etc/fstab` and `crontab -e` manually.

`sudo vim /etc/fstab` (for bmnode) :
```
loginNode:/home /home                           nfs     defaults        0 0
loginNode:/scratch /scratch                     nfs     defaults        0 0
loginNode:/software /software                   nfs     defaults        0 0
loginNode:/etc/share /etc/share                 nfs     defaults        0 0
```

`sudo crontab -e` (for lnnode):
```
0 */4 * * *    /usr/sbin/ntpdate ntp.sjtu.edu.cn
0 0 * * *      /usr/bin/bash /home/admin/sync-script/syncusers_lnnode.sh
*/10 * * * *   /usr/bin/python3 /home/admin/script/sar.py
```

`sudo crontab -e` (for bmnode):
```
0 * * * *     /usr/sbin/ntpdate loginNode &> /root/ntp.log
0 1 * * *     /usr/bin/bash /home/admin/sync-script/syncusers_bmnode.sh
*/10 * * * *  /usr/bin/python3 /home/admin/script/sar.py
*/5 * * * *   /usr/bin/top -b -n 1 > /root/top_output.txt
```

## 确保hostname大小写正确

如不正确，使用
```
sudo vim /etc/hostname
sudo vim /etc/hosts
sudo hostnamectl set-hostname bigMemx
sudo reboot
```
