---
title: NTP时钟同步
nav_order: 4
parent: CentOS Cluster (legacy)
---

# "NTP时钟同步"

复旦提供网络时钟同步服务

参考: http://www.ecampus.fudan.edu.cn/2266/list.htm


ping其服务器`ntp.fudan.edu.cn`可得其内网ip: `10.108.68.100`.

单次同步命令: `sudo ntpdate 10.108.68.100`.

写入crontab中: `0 * * * * /usr/sbin/ntpdate 10.108.68.100` 每小时同步一次.

如果报错 `no suitable synchronization method found` 则是因为ntp包被网络阻塞, 曲线救国.

## 当前方案

~~~
vim /etc/ntp.conf
~~~

在 `ntpd` 服务端(`loginNode`)的配置中添加

~~~
server 127.127.1.0 fudge
127.127.1.0 stratum 8 
~~~

然后

~~~
sudo systemctl restart ntpd
~~~

其他机器定期向loginNode同步时间:

~~~
sudo ntpdate -vd loginNode
~~~
