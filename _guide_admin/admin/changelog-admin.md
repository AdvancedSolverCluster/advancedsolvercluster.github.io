---
title: Changelog for admin
---

# AdvancedSolver Cluster Changelog for Admin

## June 7, 2024
1. 新登录界面

我们已经上线了新的登录界面，相关脚本位于：

    脚本位置：/home/admin/scripts/banner_v4.sh，并已链接到 /etc/profile.d/

2. 磁盘配额调整

按照新的策略，我们已经将用户磁盘配额调整为：

    原配额：quota = 100G，limit = 500G
    新配额：quota = 100G，limit = 150G

3. `/etc/fstab` 配置更新

我们在 `/etc/fstab` 中增加了选项 _netdev，其作用如下：

    作用：此选项用于标识文件系统位于需要网络访问的设备上，防止系统在网络启用前尝试挂载这些文件系统。

新增选项：添加了 soft 选项，避免了 loginNode nfs 不工作时计算节点无法登录的问题。

4. SSH 配置更新

修改了 `/etc/pam.d/sshd`，并在每次维护期间创建 `/etc/nologin` 文件（注意该文件会在重启后消失）。

5. 系统配置更新

    `/etc/update-motd.d` 目录下的内容全部被禁用了 (`chmod -x`)。

    禁用了 `systemd-networkd-wait-online.service` 服务，希望可以加速重启速度

6. 安装 CUDA 工具包和驱动

`loginNode` 安装了最新的 CUDA 工具包和驱动，具体版本如下：

    CUDA Toolkit：11.8 和 12.2
    CUDA Driver：12.5



## June 2, 2024

Replace hard disks and reinstall the ubuntu system on loginNode.

    loginNode 增加内存到 1TB，并增加了新磁盘。
    bigMem0 更换了更高速度的内存。
    bigMem3 增加内存到 1.5TB。

具体来说, 我们更换了 loginNode 上的硬盘, 由于这个操作的危险性. 我们提前把 loginNode 的 `/home`, `/scratch`, `/etc`, `/opt` 和 `/software` 备份到了 web0 (`/home/backup`) 和 bigMem2 (`/gg/backup`) 上.

在更换完硬盘后, 我们重装了系统并恢复了数据, 值得注意的是, 我们只完全恢复了 `/home`, `/scratch` 和 `/software`. 其他目录我们只把需要的内容 copy 了过来, 因此之后如果有需要, 得去备份的目录查看相应的文件.

新硬盘的参数可以查看我们的腾讯文档
<https://docs.qq.com/sheet/DT2RyR1NZT3BGUFRt?tab=seeeu8>.