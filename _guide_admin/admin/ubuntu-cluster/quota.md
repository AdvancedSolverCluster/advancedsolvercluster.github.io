---
title: 设置 Quota
nav_order: 5
parent: Ubuntu Cluster
---


# 设置 Quota
*Last modified: June 05, 2024*


- 确保使用的是xfs文件系统
- 在 `/etc/fstab` 里给需要设置quota的磁盘加上 `uquota,pquota` 注意没有空格

```
# /home was on /dev/centos/home during curtin installation
/dev/disk/... /home xfs defaults,uquota,pquota 0 1
# /scratch was on /dev/centos/scratch during curtin installation
/dev/disk/... /scratch xfs defaults,uquota,pquota 0 1
```

加完后重新 `mount` (需要先检查 `lsof /home` 和切断nfs), 检查 `mount` 的结果里, 应该有 `uquota,pquota` 参数

- 设置 quota

`-x` = expert mode

`-c` = command

`-u` = user quota

`-d` = default

```
xfs_quota -x -c 'enable' /software
xfs_quota -x -c 'enable' /scratch
xfs_quota -x -c 'enable' /home
xfs_quota -x -c 'limit -u bsoft=4588g bhard=4588g -d' /software
xfs_quota -x -c 'limit -u bsoft=1024g bhard=1024g -d' /scratch
xfs_quota -x -c 'limit -u bsoft=100g bhard=150g -d' /home
```

设置后即完成, 登录各账号检查quota是否正确运行中.

- 查看 quota

`-N` = ignore headers

```
xfs_quota -c 'quota -Nu' /scratch | awk '/\/software/ {print $1, $2, $3}'
xfs_quota -c 'quota -hNu' /scratch
```

