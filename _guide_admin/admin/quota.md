
---
title: "设置 Quota"
---

# 设置 Quota


- 确保使用的是xfs文件系统
- 在 `/etc/fstab` 里给需要设置quota的磁盘加上 `usrquota,grpquota` 注意没有空格

```
# /home was on /dev/centos/home during curtin installation
/dev/disk/... /home xfs defaults,usrquota,grpquota 0 1
# /scratch was on /dev/centos/scratch during curtin installation
/dev/disk/... /scratch xfs defaults,usrquota,grpquota 0 1
```

加完后重启系统, 检查 `mount` 的结果里, 应该有 `usrquota,grpquota` 参数

- 设置 quota

```
xfs_quota -x -c 'limit -u bsoft=1000g bhard=1000g -d' /scratch
xfs_quota -x -c 'limit -u bsoft=100g bhard=500g -d' /home
```

设置后即完成, 登录各账号检查quota是否正确运行中.

