---
title: 如何科学地向管理员提问
nav_order: 6
parent: 入门教程
---

在使用服务器的过程中, 难免会遇到很多问题, 这篇 markdown 主要讲讲怎么向管理员提问.

## 我为什么用不了 sudo

Linux 中的 `sudo` 命令代表 "SuperUser DO". 这是一个功能强大的命令, 允许用户以超级用户 (`root`) 的安全权限运行程序或其他命令, 这往往发生在当某些操作需要比标准用户账户更高级别的权限时.

超级用户在 Linux 中也称为 `root` 用户，对系统拥有最高级别的访问权限. `root` 可以读取, 写入, 和修改任何文件. 这也意味着, **以超级用户身份运行命令可能会有潜在风险**, 因为如果命令被误用或出错, 可能会无意中导致整个系统的更改或数据丢失.

当你在命令前输入 `sudo` 时, 系统会检查一个名为 `sudoers` 文件的特殊文件, 查看用户是否有权限以超级用户身份运行命令. 如果有, 系统可能会提示输入密码 (取决于系统设置). 身份验证后, 系统将以超级用户权限执行命令.

我们的集群不允许普通用户使用 `sudo`, 这是因为 **绝大多数情况下, 你根本不需要 root 权限**. 一般来讲, 用户来询问 `sudo` 相关事宜都是用于安装软件, 但是, 这是因为网上绝大部分的教程为了省事, 会把软件安装在系统目录下, 所以需要 `sudo`. 遇到这种情况, 请参考下面的 **安装软件相关**, 把需要安装的软件安装在自己的目录下.

如果你确实有需要执行 `sudo` 的情况, 请发邮件联系管理员, 并在邮件中详细解释 **你打算做什么** 以及 **为什么一定需要 sudo**.

## 安装软件相关

- 先参考 [软件教程](../software/index.md) 查看服务器上有没有安装你要的软件.
- 如果我们的服务器上没有安装, 先看看可不可以不用 `sudo` 安装在自己的 HOME 下, 一般来说都可以安装在自己的目录下. 你可以在它的官网找到安装指南.
- 如果的确需要 `sudo` 权限, 可以在我们的微信群里提出需求, 或者发邮件联系管理员. 请注明需要的版本.

## 连不上服务器

- 查看服务器公告, 看看服务器是否在下线状态 (比如维护或其他原因).
- 如果在校外, 可以先看看有没有连上学校的 VPN. 具体来说, 我们可以通过 `ping 10.88.3.1` 和 `ping 10.64.130.6` 来排查问题, 前者是校园网, 后者是大数据的网关. 如果都能 ping 通, 则跳转下一步. 否则可能是校园网或者大数据机房的问题.
- 通过 `ping 10.88.3.90`, 检查能否 ping 通我们的服务器. 如果能 ping 通, 试试在命令行通过 `ssh` 连接到我们的服务器.

可能会出现下面的错误

``` text
kex exchange identification:read:Connection reset
Connection reset by 10.88.3.90 port 20001
```

这可能是因为你同时连上了其他 vpn 产生冲突, 解决方法是检查其他 vpn 的连接情况.

``` text
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
```

这是由于 host key 发生变动导致连不上, 解决方法是删除 `.ssh` 下面的 `known_hosts` 文件, 然后重新执行 `ssh` 命令.

如果不是以上原因, 请联系管理员, 并提供相应的错误信息

## 其他问题

可以先 google 或者问问 chatgpt 看看有没有类似的解决方案, 如果没有, 请私戳或者发邮件联系管理员, 请提供必要的描述或者图片, 比如

- 我做了什么操作?
- 出现了什么问题?
