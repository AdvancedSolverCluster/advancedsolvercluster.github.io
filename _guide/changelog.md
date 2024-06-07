---
title: Changelog
nav_order: 8
---

*Last update: June 7, 2024*

# AdvancedSolver Cluster Changelog

{: .highlight }
This page includes updates for AdvancedSolver Cluster. Use this page to keep track of upcoming changes, deprecation notices, new features, and feature updates from AdvancedSolver Cluster.

## June 7, 2024
1. 磁盘配额调整

我们对系统磁盘配额进行了调整。具体变更如下：

    原配额：quota = 100G，limit = 500G
    新配额：quota = 100G，limit = 150G

2. 新增登录界面

3. 安装 CUDA 工具包和驱动

我们已经安装了最新的 CUDA 工具包和驱动，具体版本如下：

    CUDA Toolkit：11.8 和 12.2
    CUDA Driver：12.5

## June 2, 2024
1. 硬件升级

    loginNode 增加内存到 1TB，并增加了新磁盘。
    bigMem0 更换了更高速度的内存。
    bigMem3 增加内存到 1.5TB。