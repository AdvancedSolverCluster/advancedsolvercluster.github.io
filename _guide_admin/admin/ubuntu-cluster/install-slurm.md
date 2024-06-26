---
title: 安装SLURM
nav_order: 2
parent: Ubuntu Cluster
---

# 安装SLURM

## 第一步

先在loginNode上

```bash
sudo apt update
sudo apt install rng-tools
sudo rngd -r /dev/urandom

sudo mkdir -p /etc/munge
sudo sh -c  "dd if=/dev/urandom bs=1 count=1024 > /etc/munge/munge.key"
sudo chown munge: /etc/munge/munge.key
sudo chmod 400 /etc/munge/munge.key
sudo cp /etc/munge/munge.key /etc/share

sudo mkdir -p /var/spool/slurmctld/
sudo dd if=/dev/random of=/var/spool/slurmctld/jwt_hs256.key bs=32 count=1
sudo chown slurm:slurm /var/spool/slurmctld/jwt_hs256.key
sudo chmod 0600 /var/spool/slurmctld/jwt_hs256.key
sudo cp /var/spool/slurmctld/jwt_hs256.key /etc/share
```

```bash
# install_slurm_1.sh
# 安装slurm
sudo apt upgrade -y

# 同步时间
sudo apt install ntpdate -y
sudo timedatectl set-timezone Asia/Shanghai
sudo ntpdate -vd loginNode

# 打开防火墙
sudo apt install firewalld -y
sudo systemctl enable firewalld
sudo systemctl start firewalld
sudo firewall-cmd --zone=trusted --add-source=192.168.2.0/24 --permanent
sudo systemctl restart firewalld

# 安装munge
sudo apt install munge libmunge-dev -y
sudo systemctl start munge
sudo systemctl enable munge

# 创建munge用户和slurm用户
if id munge; then sudo userdel -r -f munge; fi
if id slurm; then sudo userdel -r -f slurm; fi
sudo groupadd -g 966 munge
sudo useradd  -m -c "MUNGE Uid and Gid Emporium" -d /var/lib/munge -u 966 -g munge -s /sbin/nologin munge
sudo groupadd -g 967 slurm
sudo useradd  -m -c "SLURM workload manager" -d /var/lib/slurm -u 967 -g slurm  -s /bin/bash slurm
id munge
id slurm

# 同步munge key
sudo mkdir -p /etc/munge
sudo cp /etc/share/munge.key /etc/munge  # assume key already exists
sudo chown -R munge: /etc/munge/ /var/log/munge/ /run/munge /var/lib/munge
sudo chmod 0700 /etc/munge/ /var/log/munge/
sudo systemctl restart munge

# 同步jwt key
sudo mkdir -p /var/spool/slurmctld/
sudo cp /etc/share/jwt_hs256.key /var/spool/slurmctld/ # assume key already exists
sudo chown slurm:slurm /var/spool/slurmctld/jwt_hs256.key
sudo chmod 0600 /var/spool/slurmctld/jwt_hs256.key

# 安装slurm prerequisites
sudo apt install bzip2 cmake libpam0g-dev libhdf5-dev hwloc libhwloc-dev libjansson4 libjansson-dev autoconf libtool g++ gfortran pkg-config libbpf-dev libdbus-1-dev libmysqlclient-dev libnuma-dev -y
mkdir -p software/slurm
cd software/slurm
git clone --depth 1 --single-branch -b json-c-0.15-20200726 https://github.com/json-c/json-c.git json-c
mkdir -p json-c-build
cd json-c-build
cmake ../json-c
make -j
sudo make install
cd ..
git clone --depth 1 --single-branch -b v2.9.4 https://github.com/nodejs/http-parser.git http_parser-c
cd http_parser-c
make -j
sudo make install
cd ..
git clone --depth 1 --single-branch -b 0.2.5 https://github.com/yaml/libyaml libyaml
cd libyaml
./bootstrap
./configure
make -j
sudo make install
cd ..
git clone --depth 1 --single-branch -b v1.12.0 https://github.com/benmcollins/libjwt.git libjwt
cd libjwt
autoreconf --force --install
./configure --prefix=/usr/local
make -j
sudo make install
sudo ldconfig -v
cd ..
```

## 第二步, 安装MySQL, 只要在ln上完成

```bash
# install_slurm_2_mysql_lnnode.sh
sudo apt install mysql-server -y
sudo mysql_secure_installation # interactive
sudo systemctl start mysql
sudo systemctl enable mysql
sudo systemctl status mysql
# sudo grep "password" /var/log/mysqld.log # 查看初始密码, 暂时没用了
sudo mysql -u root -p # 空白密码
```

进入MySQL.

```sql
ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY '<PASSWD>';
FLUSH PRIVILEGES;

CREATE USER 'slurm'@'%' IDENTIFIED WITH mysql_native_password BY 'da4jia1deTeXshi4ti3yu4lao3shi1jiao1de?';
GRANT ALL ON slurm_acct_db.* TO 'slurm'@'%';
CREATE DATABASE slurm_acct_db;
GRANT ALL ON job_comp_db.* TO 'slurm'@'%';
CREATE DATABASE job_comp_db;
SHOW ENGINES;

exit;
```

最后

```bash
sudo systemctl restart mysql
```

确认 MySQL 能通过 3306 端口连接:
```bash
telnet loginNode 3306
```

如果遇到 connection refused error, 需要修改 MySQL 的配置. 在 `/etc/mysql/mysql.conf.d/mysqld.cnf`, 修改 `bind-address = 0.0.0.0`. 最后 `sudo systemctl restart mysql`.

确认 MySQL 在 3306 上 listen:

```bash
sudo apt install net-tools
sudo netstat -plunt | grep mysqld
```

## 第三步

```bash
# install_slurm_2.sh
# 安装slurm
slurmversion=23.11.4
git clone -b slurm-23.11 https://github.com/ninotreve/slurm.git slurm-${slurmversion}
cd slurm-${slurmversion}
export PKG_CONFIG_PATH=/usr/local/lib/pkgconfig/:$PKG_CONFIG_PATH
sudo mkdir -p /lib/slurm/pam
sudo mkdir -p /etc/slurm/
sudo chown -R slurm: /etc/slurm/
./configure --prefix=/usr --sysconfdir=/etc/slurm --with-munge=/usr --enable-debug --enable-pam --with-pam_dir=/lib/slurm/pam --with-http-parser=/usr/local/ --with-yaml=/usr/local/  --with-jwt=/usr/local/ --enable-slurmrestd
make -j
sudo make install
slurmd -V
sudo cp /etc/share/slurm.conf /etc/slurm/
sudo cp /etc/share/cgroup.conf /etc/slurm/
sudo cp /etc/share/gres.$(hostname).conf /etc/slurm/gres.conf
for dir in /var/spool/slurm /var/spool/slurmd /var/spool/slurmctld /var/spool/slurm/slurmctld /etc/slurm
do
    sudo mkdir -p $dir
    sudo chown slurm: $dir
    sudo chmod 755 $dir
done

for file in /var/log/slurmctld.log /var/log/slurmd.log /var/log/slurmacct.log /var/log/slurmdbd.log /var/run/slurmdbd.pid /var/run/slurmctld.pid /var/run/slurmd.pid
do
    sudo touch $file
    sudo chown slurm: $file
done

sudo ldconfig -n /usr/lib/slurm
sudo cp etc/*.service /etc/systemd/system
sudo systemctl daemon-reload
# 在ln上先启动dbd和ctld
sudo systemctl enable slurmd
sudo systemctl start slurmd
```

## 第四步：用户禁止登陆

```bash
# 用户禁止登陆
slurmversion=23.11.4
cd slurm-${slurmversion}
cd ./contribs/pam_slurm_adopt/
make
sudo make install
sudo mkdir -p /lib/security
sudo rm -f /lib/security/pam_slurm_adopt.*
sudo ln -s /lib/slurm/pam/pam_slurm_adopt.so /lib/security/pam_slurm_adopt.so
sudo ln -s /lib/slurm/pam/pam_slurm_adopt.a /lib/security/pam_slurm_adopt.a
sudo ln -s /lib/slurm/pam/pam_slurm_adopt.la /lib/security/pam_slurm_adopt.la
```

修改 `/etc/pam.d/sshd`

~~~ text
-account    sufficient      pam_access.so
-account    required        pam_slurm_adopt.so
~~~

修改 `/etc/security/access.conf` :

~~~ text
+:root:cron crond :0 tty1 tty2 tty3 tty4 tty5 tty6
+:root:127.0.0.1
+:root:192.168.2.
+:wheel:ALL
+:admin:ALL
-:Student:ALL
-:Faculty:ALL
-:Collaborator:ALL
~~~

最后

~~~ bash
sudo systemctl stop systemd-logind
sudo systemctl mask systemd-logind
~~~

## 其它

`squeue` 等命令的格式都在 `/usr/share/modules/init/bash` 中定义.