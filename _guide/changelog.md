---
title: Changelog
nav_order: 8
---

*Last update: June 7, 2024*

# AdvancedSolver Cluster Changelog

{: .highlight }
This page includes updates for AdvancedSolver Cluster. Use this page to keep track of upcoming changes, deprecation notices, new features, and feature updates from AdvancedSolver Cluster.

## June 2, 2024

Replace hard disks and reinstall the ubuntu system on loginNode.

具体来说, 我们更换了 loginNode 上的硬盘, 由于这个操作的危险性. 我们提前把 loginNode 的 `/home`, `/scratch`, `/etc`, `/opt` 和 `/software` 备份到了 web0 (`/home/backup`) 和 bigMem2 (`/gg/backup`) 上.

在更换完硬盘后, 我们重装了系统并恢复了数据, 值得注意的是, 我们只完全恢复了 `/home`, `/scratch` 和 `/software`. 其他目录我们只把需要的内容 copy 了过来, 因此之后如果有需要, 得去备份的目录查看相应的文件.

新硬盘的参数可以查看我们的腾讯文档
<https://docs.qq.com/sheet/DT2RyR1NZT3BGUFRt?tab=seeeu8>.


## Mar 3, 2024

Installed CUDA 11.8.
