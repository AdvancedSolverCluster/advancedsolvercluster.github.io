# NTP时钟同步

复旦提供网络时钟同步服务

参考: http://www.ecampus.fudan.edu.cn/2266/list.htm


ping其服务器`ntp.fudan.edu.cn`可得其内网ip: `10.108.68.100`.

单次同步命令: `sudo ntpdate 10.108.68.100`.

写入crontab中: `0 */4 * * * /usr/sbin/ntpdate 10.108.68.100` 每4小时同步一次.

