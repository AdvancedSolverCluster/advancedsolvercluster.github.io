---
title: 数据备份
nav_order: 6
parent: Ubuntu Cluster
---

# 数据备份

*Last modified: February 26, 2024*

用户信息搬迁的参考链接: https://www.cyberciti.biz/faq/howto-move-migrate-user-accounts-old-to-new-server/

在确保用户信息一致的情况下(否则在新机器上会显示用户的UID, GID)

`sudo rsync -av /home bigMem1:/home`

备份 (must be in root to preserve permissions).

You should start many rsync processes syncing different parts to speed up.

Only use `-z` compression option if you are in low bandwith.

Use `sudo restorecon -r -p /` to reset all security contexts (for SELinux).

So `sshd` will be able to read `.ssh/authorized_keys` when running as service.

## 在web0上定期备份loginNode:/home

在web0上的/mnt/loginNode/home以read only方式挂载了loginNode:/home, 使用了rsnapshot进行备份(yum安装)

参考文档: https://github.com/rsnapshot/rsnapshot

几乎所有的配置都在`/etc/rsnapshot.conf`中.

更新计划根据conf文件写入了crontab中:

- 每天2点半备份一次，保存3个历史版本
- 每周第4天4点备份一次，保存2个历史版本
- 每月1号6点备份一次，保存1个历史版本

见web0 root帐号的crontab.
