---
title: 管理员已经帮我开好了服务器账号，我该怎么连接服务器？
---

## 必做任务: 从公网连接

打开一个终端窗口, 输入`ssh <username>@cluster.advancedsolver.com -p 20001`.

你会看到如下提示:
```text
The authenticity of host '[cluster.advancedsolver.com]:20001 ([*.*.*.*]:20001)' can't be established
...
Are you sure you want to continue connecting (yes/no)?"
```
(*.*.*.*是某个ip地址, 省略号处的内容可以忽略)

这是因为这是你第一次连接. 请输入 `yes`, 然后敲击 `Enter`. 以后就不会再出现这个提示了.

```text
> ssh <username>@cluster.advancedsolver.com -p 20001
Last login: Fri May 27 01:11:35 2022 from xx.xx.xx.xx
Loading GCC/9.4.0
Loading CUDA/11.6
Loading MATLAB/R2022b
Loading texlive/2022
[<username>@loginNode ~]$
 ```

当你看到这个提示, 就说明你已经连接成功了, 恭喜!

### 可选任务1: 提高访问速度, 从内网连接

上述 `cluster.advancedsolver.com` 是服务器的公网地址. 你会发现, 在公网下命令行中输入经常存在延迟, 令人很不爽.

如果你在复旦校园网内, 或者, 你可以通过 VPN 连接进入校园网环境, 建议**使用内网地址** `10.88.3.90`. 即, 通过输入`ssh <username>@10.88.3.90 -p 20001`, 连接服务器.

### 可选任务2: 避免每次都输入公网地址或ip地址, 修改本地 SSH 配置

无论是`ssh <username>@cluster.advancedsolver.com -p 20001`, 还是 `ssh <username>@10.88.3.90 -p 20001`, 都很冗长, 让人头大.

做以下的事情, 则可以避免每次输入这么长的命令, 只要输入 `ssh loginNode` 就能连接了.

具体做法是: 找到本地的 `.ssh` 目录 (在你的 home 目录下, 详见[生成 Key](new-user/i-have-no-account.md)), 创建/修改 `config` 文件, 增加四行:

``` text
Host loginNode
    HostName 10.88.3.90
    Port 20001
    User <username>
```

> Warning: `.ssh` 文件夹在首次[生成 Key](new-user/i-have-no-account.md) 的时候会被自动生成, 如果没有在该机器上生成过 Key 文件夹则可能不存在. **切勿**手动新建这个文件夹! 可能会导致权限不对从而在这个文件夹下的 Key 失效. 安全的创建文件夹的方式是在本机再次[生成 Key](new-user/i-have-no-account.md)(即使这个 Key 你不会使用).

这里 `<username>` 是管理员指定的你的用户名. 另外还要注意的是, 除第一行外的下面几行均应有行首的 4 空格.

## 接下来干嘛?

请移步[我已经学会连接服务器了，我能在服务器上做些什么？比如，如何运行程序？](how-can-i-run-program.md).

如果你有兴趣详细了解一下刚才自己都做了什么, 每一步都代表着什么, 如果不这么做会怎么样; 如果你想知道如何用 VS Code连接服务器, 如何上传文件到服务器, 或下载文件, 请参考[首次登录服务器! - 服务器基本操作: SSH & SCP](../connect-to-server.md).

