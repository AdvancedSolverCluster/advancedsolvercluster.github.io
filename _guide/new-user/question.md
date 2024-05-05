---
title: 如何科学地向管理员提问
nav_order: 6
parent: 入门教程
---

在使用服务器的过程中, 难免会遇到很多问题, 这篇 markdown 主要讲讲怎么向管理员提问.

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
