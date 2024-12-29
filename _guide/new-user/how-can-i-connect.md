---
title: 我得到了我的服务器账号, 我该怎么连接服务器?
nav_order: 2
parent: 快速开始
---



# 我得到了我的服务器账号, 我该怎么连接服务器?
*Last modified: December 29, 2024*

## 必做: 从内网连接

打开一个终端窗口, 输入`ssh <username>@10.88.3.90 -p 20001`.

你会看到如下提示:

~~~ text
The authenticity of host '[10.88.3.90]:20001' can't be established
...
Are you sure you want to continue connecting (yes/no)?"
~~~

(省略号处的内容可以忽略)

这是因为这是你第一次连接, 你的电脑并不认识这台服务器. 请输入 `yes`, 然后敲击 `Enter`. 以后就不会再出现这个提示了.

~~~ text
> ssh aduser@cluster.advancedsolver.com -p 20001
Last login: ... date ... from ... ip address ...
##################### Welcome to AdvancedSolver's Cluster! #####################
╭──────────────────────────────────────────────────────────────────────────────╮
│                                                                              │
│   ... welcome banner ...                                                     │
│                                                                              │
╰──────────────────────────────────────────────────────────────────────────────╯
[aduser@loginNode ~]$
~~~

当你看到这个提示, 就说明你已经连接成功了, 恭喜!

如果连接不成功，可以参考[FAQ](../faq#无法连接服务器), 或者联系管理员.

### 必做: 避免每次都输入地址, 修改本地 SSH 配置

每次登录都需输入 `ssh <username>@10.88.3.90 -p 20001`, 很冗长, 让人头大.

做以下的事情, 则可以避免每次输入这么长的命令, 只要输入 `ssh loginNode` 就能连接了.

具体做法是: 找到本地的 `.ssh` 目录 (在你的 home 目录下, 详见[生成 Key](i-have-no-account)), 创建/修改一个名为 `config` 的文件(小心Windows系统会给你添加一个隐藏的后缀! 这个文件不应该有任何后缀名, 否则无法识别), 增加四行:

~~~ text
Host loginNode
    HostName 10.88.3.90
    Port 20001
    User <username>
~~~

{: .important }
> `.ssh` 文件夹在首次[生成 Key](i-have-no-account) 的时候会被自动生成, 如果没有在该机器上生成过 Key 文件夹则可能不存在. **切勿**手动新建这个文件夹! 可能会导致权限不对从而在这个文件夹下的 Key 失效. 安全的创建文件夹的方式是在本机再次[生成 Key](i-have-no-account)(即使这个 Key 你不会使用).
>
> 如果在生成了配置文件后 `ssh loginNode` 失败, 但上一步使用  `ssh <username>@10.88.3.90 -p 20001` 是成功的, 一般来说这意味着配置文件设置的有问题.

这里 `<username>` 是管理员指定的你的用户名. 另外还要注意的是, 除第一行外的下面几行均应有行首的 4 空格.

### 可选: 从公网连接

上述 `10.88.3.90` 是校园网地址. **强烈推荐仅从校园网地址登录服务器.** 在少数情况下, 你需要使用 `cluster.advancedsolver.com` (服务器的公网地址)来登录, 即 `ssh <username>@cluster.advancedsolver.com -p 20001`. 你会发现, 在公网下命令行中输入经常存在延迟, 令人很不爽.

**建议在复旦校园网内, 或者, 通过 VPN 连接进入校园网环境, 使用内网地址** `10.88.3.90`. 即, 通过输入`ssh <username>@10.88.3.90 -p 20001`, 连接服务器.

类似的, 你可以向 `config` 文件加入以下记录

~~~ text
Host loginNode-slow
    HostName cluster.advancedsolver.com
    Port 20001
    User <username>
~~~

并使用 `ssh loginNode-slow` 登录.

## 接下来干嘛?

你已经拥有了服务器使用权限! 已经可以正常使用服务器了.

如果你想知道如何用 VS Code 连接服务器, 移步 [VS Code 教程](vscode);

如果你想知道如何上传/下载文件, 请参考[SSH 知识](../knowledge/ssh);

然后请阅读[我已经学会连接服务器了，我能在服务器上做些什么？比如，如何运行程序？](how-can-i-run-program).


