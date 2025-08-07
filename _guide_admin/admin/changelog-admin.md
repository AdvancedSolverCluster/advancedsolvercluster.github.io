---
title: Changelog for admin
---

# AdvancedSolver Cluster Changelog for Admin

*Last modified: October 15, 2024*

## Oct 14, 2024

更新了 Gitlab, 从 `16.10.1` 更新到 `17.4.2`.

## Oct 8, 2024

安装了 PyTorch, 现在我们可以在 bigMem 0~2 上使用 GPU / DCU 了.

## Sep 23, 2024
1. 将 slurm 版本更新到 24.05. 启用 slurm account management. 暂定的限制是 48核\*24小时=48核\*1440分钟=69120核分钟.
    ```bash
    sudo sacctmgr modify qos normal set MaxTRESRunMinsPerUser=cpu=69120
    sudo sacctmgr modify qos normal set MaxTRESMinsPerJob=cpu=69120
    ```

2. 新增管理员.
    ```bash
    sudo useradd -m -d /opt/home-admin/zjteng -u 1505 -g 1105 -s /bin/bash zjteng-admin
    ```

## Sep 6, 2024

1. **修改 `/etc/slurm/slurm.conf` 并重启 Slurm 服务**：
   - 修改了 Slurm 配置中的 `StateSaveLocation` （`/var/spool/slurmctld`   ->   `/etc/share/slurmctld`）。
   - 重启了 `slurmctld` 服务以使更改生效。
   - 确认重启 `slurmctld` 不会中断正在运行的作业。（只要 `StateSaveLocation` 里面保存了State）

2. **NFS 挂载权限问题与 Slurm 权限**：
   - 发现 `/etc/share` 目录通过 NFS 挂载为只读状态，导致 `bigMem` 节点上的 `slurm` 用户无法写入。
   - 修改 `LoginNode` 上的 `/etc/exports`，将其权限更改为读写（`rw,no_root_squash`）。
   - 重新导出 NFS 目录并在 `bigMem` 节点上以读写模式重新挂载。

3. **在 `loginNode` 上安装 NVIDIA 驱动：**
    ```bash
    sudo add-apt-repository ppa:graphics-drivers/ppa
    sudo apt update
    sudo apt install nvidia-driver-535
    sudo reboot
    ```
    现在所有机器上的驱动版本都是535 (CUDA 12.2).


## June 7, 2024
1. 新登录界面

我们已经上线了新的登录界面，相关脚本位于：

    脚本位置：`/home/admin/scripts/banner_v4.sh`，并在 `/etc/profile.d/` 里有一个运行这个脚本的脚本.

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

7. 在 `/etc/bash.bashrc` 中 source `/etc/profile.d/color.sh`, `/etc/profile.d/modules.sh`, `/home/admin/script/setvars.sh`.

## June 2, 2024

Replace hard disks and reinstall the ubuntu system on loginNode.

    loginNode 增加内存到 1TB，并增加了新磁盘。
    bigMem0 更换了更高速度的内存。
    bigMem3 增加内存到 1.5TB。

具体来说, 我们更换了 loginNode 上的硬盘, 由于这个操作的危险性. 我们提前把 loginNode 的 `/home`, `/scratch`, `/etc`, `/opt` 和 `/software` 备份到了 web0 (`/home/backup`) 和 bigMem2 (`/gg/backup`) 上.

在更换完硬盘后, 我们重装了系统并恢复了数据, 值得注意的是, 我们只完全恢复了 `/home`, `/scratch` 和 `/software`. 其他目录我们只把需要的内容 copy 了过来, 因此之后如果有需要, 得去备份的目录查看相应的文件.

新硬盘的参数可以查看我们的腾讯文档
<https://docs.qq.com/sheet/DT2RyR1NZT3BGUFRt?tab=seeeu8>.