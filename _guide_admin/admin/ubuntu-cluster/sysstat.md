---
title: 设置 cluster-status sysstat, sar
nav_order: 5
parent: Ubuntu Cluster
---


# 设置 cluster-status sysstat, sar

*Last modified: March 11, 2024*

`apt` 安装包 `sysstat`

编辑开关文件 `/etc/default/sysstat` `ENABLED="TRUE"`

编辑配置文件 `/etc/sysstat/sysstat`, 主要是检查保存的文件夹 `SA_DIR`

确保文件夹是创建了的 `mkdir -p /var/log/sysstat` (默认位置)

启动服务 `systemctl restart sysstat`, `systemctl enable sysstat`

在历史数据有两天之后启动脚本 `/home/admin/script/sar.py` (需要确保loginNode home已经挂载)
  - 给ubuntu自带的python装上pandas (root身份) `/usr/bin/python3 -m pip install pandas`
  - 测试code有无 `ImportError` (root身份) `/usr/bin/python3 /home/admin/script/sar.py`
  - 在 crontab 中编辑 `*/10 * * * *  /usr/bin/python3 /home/admin/script/sar.py > /root/sar.log 2>&1` 

web0 上检查 loginNode home 挂载 `loginNode:/home on /mnt/loginNode/home`

web0 上编辑 crontab

```
*/5 * * * *  cp -a /mnt/loginNode/home/admin/cluster-status/. /home/wwwroot/cluster-status/

```

web0 上检查 nginx 是否运行 `sudo systemctl status nginx.service` (`/opt/nginx`)


```
# sysstat configuration file. See sysstat(5) manual page.

# How long to keep log files (in days).
# Used by sa2(8) script
# If value is greater than 28, then use sadc's option -D to prevent older
# data files from being overwritten. See sadc(8) and sysstat(5) manual pages.
HISTORY=7

# Compress (using xz, gzip or bzip2) sa and sar files older than (in days):
COMPRESSAFTER=10

# Parameters for the system activity data collector (see sadc(8) manual page)
# which are used for the generation of log files.
# By default contains the `-S DISK' option responsible for generating disk
# statisitcs. Use `-S XALL' to collect all available statistics.
SADC_OPTIONS="-S DISK"

# Directory where sa and sar files are saved. The directory must exist.
SA_DIR=/var/log/sysstat

# Compression program to use.
ZIP="xz"

# By default sa2 script generates yesterday's summary, since the cron job
# usually runs right after midnight. If you want sa2 to generate the summary
# of the same day (for example when cron job runs at 23:53) set this variable.
#YESTERDAY=no

# By default sa2 script generates reports files (the so called sarDD files).
# Set this variable to false to disable reports generation.
#REPORTS=false

# Tell sa2 to wait for a random delay in the range 0 .. ${DELAY_RANGE} before
# executing. This delay is expressed in seconds, and is aimed at preventing
# a massive I/O burst at the same time on VM sharing the same storage area.
# Set this variable to 0 to make sa2 generate reports files immediately.
DELAY_RANGE=0

# The sa1 and sa2 scripts generate system activity data and report files in
# the /var/log/sysstat directory. By default the files are created with umask 0022
# and are therefore readable for all users. Change this variable to restrict
# the permissions on the files (e.g. use 0027 to adhere to more strict
# security standards).
UMASK=0022
```


