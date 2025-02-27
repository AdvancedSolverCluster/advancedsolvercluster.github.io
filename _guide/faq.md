---
title: FAQ
nav_order: 7
---

# FAQ
*Last modified: February 27, 2025*

## 无法连接服务器

1. 如果请你输入密码, 那么说明你的 公钥 或者 ssh配置 不正确. 此时应先排查是否为配置问题. 输入 `ssh <username>@10.88.3.90 -p 20001 -i C:/path/to/your/public/key/id_ed25519.pub` 检查能否连通, 如果能则说明可能是配置不正确, 应检查 [SSH 配置文件](new-user/how-can-i-connect).

2. 如果报错信息是：Connection timed out/Connection refused/No route to host, 请查看服务器公告, 看看服务器是否在下线状态 (比如维护或其他原因).

    如果在校外, 可以先看看有没有连上学校的 VPN. 具体来说, 我们可以通过 `ping 10.88.3.1` 和 `ping 10.64.130.6` 来排查问题, 前者是校园网, 后者是大数据的网关. 如果都能 ping 通, 则跳转下一步. 否则可能是校园网或者大数据机房的问题.

3. 如果报错信息是：Permission denied (publickey). 请检查以下配置是否正确: 在本地的 `.ssh` 文件夹中含有私钥和公钥对, 如, 私钥 `id_ecdsa` 和公钥 `id_ecdsa.pub`.

4. 如果报错信息是：Connection reset, 可能是网络不稳定或连接被中途中断，导致 SSH 密钥交换无法成功。如果你使用了其它 VPN，尝试断开其它 VPN.

5. 当文件大小累计超过 quota 后达 1 周，或超过 limit , 可能会导致无法通过 VSCode 连接到服务器.

6. 如果报错信息是：

~~~ text
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
@    WARNING: REMOTE HOST IDENTIFICATION HAS CHANGED!     @
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
IT IS POSSIBLE THAT SOMEONE IS DOING SOMETHING NASTY!
Someone could be eavesdropping on you right now (man-in-the-middle attack)!
It is also possible that a host key has just been changed.
The fingerprint for the ECDSA key sent by the remote host is
SHA256:...
Please contact your system administrator.
Add correct host key in ...
Offending RSA key in ...
RSA host key for [cluster.advancedsolver.com]:20001 has changed and you have requested strict checking.
Host key verification failed.
~~~

当看到此类错误信息时，说明服务器的指纹已经发生了变化。请按照以下步骤操作，清除本地缓存的旧服务器指纹：

1. 使用 `ssh-keygen -R` 命令移除旧指纹：

~~~ bash
ssh-keygen -R [cluster.advancedsolver.com]:20001
~~~

2. 或者手动编辑 `.ssh/known_hosts` 文件，删除对应行。

{: .important }
> 如果以上检查都没问题仍然无法免密登录到服务器, 请联系管理员.

## 我为什么用不了 sudo

Linux 中的 `sudo` 命令代表 "SuperUser DO". 这是一个功能强大的命令, 允许用户以超级用户 (`root`) 的安全权限运行程序或其他命令, 这往往发生在当某些操作需要比标准用户账户更高级别的权限时.

超级用户在 Linux 中也称为 `root` 用户，对系统拥有最高级别的访问权限. `root` 可以读取, 写入, 和修改任何文件. 这也意味着, **以超级用户身份运行命令可能会有潜在风险**, 因为如果命令被误用或出错, 可能会无意中导致整个系统的更改或数据丢失.

当你在命令前输入 `sudo` 时, 系统会检查一个名为 `sudoers` 文件的特殊文件, 查看用户是否有权限以超级用户身份运行命令. 如果有, 系统可能会提示输入密码 (取决于系统设置). 身份验证后, 系统将以超级用户权限执行命令.

我们的集群不允许普通用户使用 `sudo`, 这是因为 **绝大多数情况下, 你根本不需要 root 权限**. 一般来讲, 用户来询问 `sudo` 相关事宜都是用于安装软件, 但是, 这是因为网上绝大部分的教程为了省事, 会把软件安装在系统目录下, 所以需要 `sudo`. 遇到这种情况, 请参考下面的 **安装软件相关**, 把需要安装的软件安装在自己的目录下.

如果你确实有需要执行 `sudo` 的情况, 请发邮件联系管理员, 并在邮件中详细解释 **你打算做什么** 以及 **为什么一定需要 sudo**.

## 安装软件相关

- 先参考 [软件环境](software/index) 查看服务器上有没有安装你要的软件.
- 如果我们的服务器上没有安装, 先看看可不可以不用 `sudo` 安装在自己的 HOME 下, 一般来说都可以安装在自己的目录下. 你可以在它的官网找到安装指南.
- 如果的确需要 `sudo` 权限, 可以在我们的微信群里提出需求, 或者发邮件联系管理员. 请注明需要的版本.

## 我想访问的位置提示 Permission denied, 怎么办？

一般来说,每个人的工作区域就在 `/home/username` . 出现 Permission denied 是因为你没有权限访问这个位置, 请不要访问它, 且一般来说你也无须访问.

## 我不小心修改了 `~/.bashrc` 文件, Linux 系统指令失效, 怎么办?

请使用 `/usr/bin/vim ~/.bashrc` 回到 `.bashrc` 文件, 把你的修改撤回到原来的样子. 如果你已经忘了自己的修改, 你可以在 `/home/admin/script/` 目录下找到一个名为 `bashrc_sample` 的文件, 删除自己目录下的 `.bashrc` 文件, 然后将 `bashrc_sample` 复制过来并重命名为 `.bashrc` (这个命令是 `cp /home/admin/script/bashrc_sample ~/.bashrc`). 最后退出重连服务器即可.