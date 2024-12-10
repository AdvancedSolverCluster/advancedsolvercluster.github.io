---
title: 关于服务器各用户储存空间的 Quota
nav_order: 2
parent: 使用须知
---

# 关于服务器各用户储存空间的 Quota
*Last modified: December 10, 2024*


*Created: February 28, 2022*

*[Jingyu Liu](mailto:381258337@qq.com), [Xiang Li](mailto:646873166@qq.com)*

在 Linux 系统中, 由于是多人多任务的环境, 所以会出现多人共同使用同一个硬盘空间的情况.

实际上, 在我们的服务器里, 每个用户拥有的私有空间是 (以用户名 `aduser` 为例)

1. `/home/aduser/` (quota=100G limit=150G 每日备份)
2. `/scratch/aduser/` (quota=limit=1000G 无备份)

`home` 目录用于存放常用的文档代码等; `scratch` 目录用于存放临时使用的数据等大文件.

那么如果其中几个少数用户占用了很大的硬盘空间, 留给其他人的空间就小了.

我们使用了 `xfs_quota` 进行限制, 以求达到资源的更合理分配.

{: .important }
> 文件大小累计超过 quota 后达 1 周，或超过 limit 则无法写入任何数据, 可能会导致无法保存文档, 无法获得代码运行结果等情况, 请及时注意所用空间大小. 请按下文方法确认当前已经使用的空间额度.


<!-- 你可以通过 `xfs_quota -x -c <command> <mount_point>` 来使用 xfs_quota. 这里 command 为要输入的指令, mount_point 为挂载目录(不是必须的); 参数 `-x` 表示进入专家模式, 这样后续才能够加入 `-c` 的指令参数; 参数 `-c `后面加的就是指令. 也可以先输入 `xfs_quota`, 然后再输入指令. 我们主要学习可以输入的指令. -->

<!-- `print` 列出目前主机内的文件系统参数等数据. -->

<!-- `df` 请看下面的 `free` 命令. -->

在命令行界面输入 `xfs_quota` 后, 会进入 `xfs_quota` 的交互界面中:

~~~ bash
$ xfs_quota
xfs_quota>
~~~

在交互状态下, 使用命令:

- `quota -h` 显示个人使用的配额情况. `-h` 表示以易读的方式报告所用空间大小
- `help` 显示帮助. 例如, 可以用 `help quota` 显示更详细的帮助.
- `quit` 或 `q` 退出 xfs_quota.

### 示例

~~~ bash
$ xfs_quota
xfs_quota>
xfs_quota> quota -h
Disk quotas for User aduser (1026)
Filesystem   Blocks  Quota  Limit Warn/Time    Mounted on
/dev/mapper/centos-scratch
             794.9M  1000G  1000G  00 [------] /scratch
/dev/mapper/centos-home
              64.6G   100G   150G  00 [------] /home
xfs_quota> q
~~~

查询所用 quota 的命令可以看到如上的示例结果. 其含义为

- 对于当前用户 aduser, 总共有3个文件夹下有quota限制: `/scratch, /home`.
- 以 `/home` 为例, 所有在这个文件夹下属于 aduser 的文件大小总计为 `64.6G`. aduser 在 `/home` 下的Quota为 `100G`, Limit为 `150G`.
- 即, aduser **最多可以在 `/home` 里使用 `150G` 的空间**, 且一旦**超过 `100G` (Quota), 就必须在7天之内恢复到 `100G` 以下**.
- 一旦超出 `150G`, 或是连续7天超出 `100G`, aduser 将无法在 `/home` 下保存(写入)任何数据. 会导致各种程序无法正常运行.
- 在计时状态下(超出Quota而未超出Limit)时, 示例中的 `Warn/Time` 对应列会显示剩余时间.
- 按 `q` (`quit`) 退出.

<!-- 下面是一些常用的接在 `quota` 命令后的参数: -->
<!-- - `-h` 以易读的方式报告所用空间大小 -->
<!-- - `-g` 指定用户组(名称或ID) -->
<!-- - `-p` 指定具体的项目 (名称或 ID ) -->
<!-- - `-u` 指定用户名 -->
<!-- - `-b` 展示已经使用的blocks -->
<!-- - `-i` 展示已经使用的 inodes -->
<!-- - `-r` 显示使用的实时 blocks 的数量 -->
<!-- - `-n` 跳过标识符到名称的转换, 只报告 ID -->
<!-- - `-N` 取消标题 -->
<!-- - `-v` 增加报告的长度 -->
<!-- - `-f <file>` 将输出写入到文件file. -->

<!-- `free` 报告文件系统使用情况. 下面是一些参数: `-b`; `-i`; `-r`; `-h`; `-N`; `-f <file>`. -->

## 接下来干嘛?

前往了解 [服务器上安装了哪些大家常用的软件](../software/index)
