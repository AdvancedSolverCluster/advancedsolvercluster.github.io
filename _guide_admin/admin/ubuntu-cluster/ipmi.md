---
title: IPMI备忘
nav_order: 4
parent: Ubuntu Cluster
---

# IPMI备忘

*Last modified: February 26, 2024*

## bigMem0上IPMI的修改工具

下载IPMICFG，解压到服务器上 (已在repo中)

root运行下列命令获取IPMI用户名ID

```bash
ipmicfg -user list
```

运行重置密码命令

```bash
ipmicfg -user setpwd <USER ID> <password>
```

