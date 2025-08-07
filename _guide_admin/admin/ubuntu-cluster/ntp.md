---
title: 设置 NTP 
nav_order: 5
parent: Ubuntu Cluster
---

# update timezone

*Last modified: June 02, 2024*

`sudo timedatectl set-timezone Asia/Shanghai`



# ntp server

`sudo apt-get install ntp` 
`sudo apt-get install ntpdate` 


之后在 `/etc/ntp.conf` 末尾加入一行

`server ntp.sjtu.edu.cn iburst minpoll 12 maxpoll 17`

然后

`sudo systemctl restart ntp`

`sudo systemctl enable ntp`

测试

`ntpq -p`

`sudo ntpdate -qu ntp.sjtu.edu.cn`
