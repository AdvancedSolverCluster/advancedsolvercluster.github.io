# 首次登录服务器! - 服务器基本操作: SSH & SCP

*May 27, 2022, [Jingyu Liu](mailto:381258337@qq.com), [Yuejia Zhang](mailto:yuejiazhang21@m.fudan.edu.cn), [Yidong Zhang](mailto:2308353627@qq.com), [Xiang Li](mailto:646873166@qq.com)*

## 欢迎

欢迎使用 Advanced Solver HPC! **请先确保你拥有服务器账户!**
如果还没有账户, 请按照以下步骤创建 Public Key 并发送邮件给[管理员](mailto:cash_admin@163.com).

## <a name="password"> 登录到服务器 </a>

登录服务器不是在我们的帮助界面右上角点击登录或登出完成的, 你需要使用 SS H工具来登录服务器, 期间, SSH 工具会向你索要你的 Key 作为你的身份证明. 因此首先我们需要创建一个 Key.

### <a name="public-key">创建 Public Key</a>

#### Step 1 生成 Key

创建/进入本地的 `.ssh` 目录 (对于 macOS/Linux 是 `~/.ssh/`, 对于 Windows 是 `C:\Users\<user>\.ssh\`) 查看是否已有 Key (例如, 私钥 `id_ecdsa` 和公钥 `id_ecdsa.pub`, 也可能是`id_rsa`, `id_rsa.pub`等). 如果已经有一个 Key, 这可能是以前创建的, 如果没有, 使用下面的命令生成一个Key. **无论如何, 我们推荐你再生成一个Key!** Key相当于你的身份证明: **任何获取了你Key的人都可以以你的身份登录你的账户!**

在本地的命令行里通过 `ssh-keygen -t ecdsa -b 521` 生成使用ECDSA算法加密的 521 bits Key, 使用命令如果输入的bit数不对则会得到:

``` bash
Invalid ECDSA key length: valid lengths are 256, 384 or 521 bits
```

我们推荐使用 521 bits 加密的 Key.

根据屏幕提示, 生成一个 Key Pair (包括 Public 部分和 Private 部分) 并可选择是否带密码保护你的 Key. 完成后会生成私钥 (Private Key) `id_ecdsa` 和公钥 (Public Key) `id_ecdsa.pub` (或其他自定义名字). 如果使用了带密码保护的 Key, 在每次使用 Key 的时候会需要额外验证你的密码.

一般来说, 你可以自定义私钥和公钥的名字, 只要你自己能分清. **私钥 (Private Key) 在任何时候都不能被泄露!也不应该作为网盘同步的一部分等被上传到任何其他地方!**

有效的 521 bits ECDSA 加密公钥 `id_ecdsa.pub` 应当是一整行以 `ecdsa-sha2-nistp521` 开头的字符串. 后面会提到如何验证 rsa key 的长度.

#### Step 2 将 Public key 发送给我们

将生成的 Public key `id_ecdsa.pub`的内容**复制到正文中**发送至[管理员邮箱](mailto:cash_admin@163.com)后联系管理员添加公钥至对应账号. 账号名将由管理员指定, 如果已经有帐号, 邮件内容应说明所用的账号名.
请**注意检查复制的内容是否正确**, 例如可能会出现多出空格等问题, 确保无误后再发送. 一个正确的 Public Key 格式如下:

`<key-type>[space]<public-key>[space]<comment>`

请注意比对. 我们推荐你直接将 `.pub` 文件发送给管理员.

**注:**

1. 也可以使用 RSA 算法生成 Key, 但由于速度相对慢不推荐. 如使用则至少应使用 8192 bit 的长度来保证安全性, 对应的命令是 `ssh-keygen -t rsa -b 8192`.

1. 确认已有的 Public Key 长度.

    如果你本来就是通过 SSH Key 连接到服务器的, 请在本地通过以下命令查看公钥的长度:

    ```shell
    ssh-keygen -l -f <path/to/your/public/key>
    ```

    例如, 在 Windows CMD 里运行 `ssh-keygen -l -f C:\Users\jyliu\.ssh\id_rsa.pub`. 输出的第一个数即公钥的大小, 如果小于 4096, 请重新生成, 需要指出, 这个长度限制是针对 rsa key 的.

#### Step 3 本地 SSH 配置

到本地的 `.ssh` 目录下, 创建/修改 `config` 文件, 编辑一些预存的SSH连接配置. 一个 config 文件中可以有多个 SSH 连接的配置, 每一个配置由以下几行组成: (请根据自己的情况修改, `<hostname>` 是一个服务器的代称, 可以自己指定, `<username>` 是管理员指定的你的用户名, `<path/to/your/key>` 是本地到私钥的路径, 注意除第一行外的下面几行均应有行首的 4 空格)

``` text
Host <hostname>
    HostName cluster.advancedsolver.com
    Port 20001
    User <username>
    IdentityFile <path_to_your_private_key> 
 ```

例如, 在 Windows 上的用户 winuser, 管理员指定了用户名为 aduser:

``` text
Host loginNode-aduser
    HostName cluster.advancedsolver.com
    Port 20001
    User aduser
    IdentityFile C:\Users\winuser\.ssh\id_ecdsa
 ```

完成这步后, 以后可以直接通过 `ssh <hostname>` 连接服务器,例如 `ssh loginNode-aduser`.

**注**
服务器的公网地址是 `cluster.advancedsolver.com`. 如果在复旦校园网内, 或可以通过 VPN 连接进入校园网环境, **应使用内网地址** `10.88.3.90`. 公网 ip 的连接速度**远慢于**使用 VPN 的内网环境. 使用内网时, 上述 config 文件应设置 HostName 为内网地址.

### 测试连接

通过命令行 (`ssh <username>@cluster.advancedsolver.com -p 20001`) 或者 VS Code 连接 (我们稍后介绍如何用 VS Code 连接) 时, 看到如下提示, 即成功.

```text
> ssh aduser@cluster.advancedsolver.com -p 20001
Last login: Fri May 27 01:11:35 2022 from xx.xx.xx.xx
Loading GCC/9.4.0
Loading CUDA/11.6
Loading MATLAB/R2021b
Loading texlive/2021
[aduser@loginNode ~]$
 ```

否则, 请检查以下配置是否正确:

1. 在本地的 `.ssh` 文件夹中含有私钥和公钥对, 如, 私钥 `id_ecdsa` 和公钥 `id_ecdsa.pub`. 私钥是证明自身身份的唯一依据!
2. (非首次登录) 在服务器的 `~/.ssh` 文件夹中含有文件 `authorized_keys`, 这个文件的权限是 600 (参考 <a class="one" href="basic-linux#permission"> 文件权限介绍</a>), 其中含有你的公钥信息.
3. (非首次登录) 在登录服务器时可能出现报错

```text
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

或者连接 `cluster.advancedsolver.com` 时也会有类似报错. 两种问题解决方法相同.

这是因为服务器重装后指纹变化, 而您的连接记录中没有对应改变. 解决方法为删除本地 .ssh/known_hosts 中对应服务器 IP 的内容. 使用命令

```shell
ssh-keygen -R [cluster.advancedsolver.com]:20001
```

或直接编辑 .ssh/known_hosts, 删除对应于服务器公网/内网地址的行, 形如

```text
[cluster.advancedsolver.com]:20001 ecdsa-sha2-nistp256 AAAAE2V...Vg3RQ=
```

如果以上检查都没问题仍然无法免密登录到服务器, 请联系管理员.

### 使用 VS Code 连接到服务器

#### 下载 VS Code

进入官网 <https://code.visualstudio.com/>, 下载 VS Code. 如果有需要, 在左侧扩展选项卡中搜索 chinese 安装中文语言包.

#### 安装 SSH 插件

启动 VS Code, 在左侧扩展选项卡中, 输入 remote, 选择安装  Remote-SSH 插件,  安装完成之后会在左侧新增一个选项卡 Remote Explorer (远程资源管理器).

#### 添加服务器连接配置

点击 Remote Explorer, 在 SSH Targets 中点击加号, 输入 `ssh <username>@10.88.3.90 -p 20001` (这个命令需要挂学校的 VPN) 即可进行连接. 这个时候相应的信息储存在 `C:\Users\admin\.ssh\config` 中, 你可以参考前面的教程进行修改. 当下次还想连接时, 可以直接在 SSH Targets 中选择.

#### 常用操作

你可以点击 Open Folder (打开文件夹), 比如选择 `/home/gg`, 即可看到自己家目录下的所有内容. 此时, 你就可以像操作本地文件一样进行文件的增删改查等操作啦!

## <a name="copy-files"> 上传/下载文件 </a>

在使用命令行连接到服务器的时候, 我们需要使用 scp 工具进行文件的上下传. scp 依赖于 SSH 工具, 因此首先你应该确保能登录服务器.

这里最核心的命令是 `scp`. scp 就是 secure copy, 是用来进行远程拷贝文件的命令.

- 如何将文件上传到服务器
  - 用 `scp -P <port> <local_file> <hostname>:~/<dest_file>` 复制文件到服务器指定路径 (还记得我们说过 `~` 是 home 目录).
  - 用 `scp -P <port> -r <local_dir> <hostname>:~/dest_file` 复制文件夹.
- 如何将文件下载到本地
  - 用 `scp -P <port> <hostname>:~/<src_file local_file>` 复制文件.
  - 用 `scp -P <port> -r <hostname>:~/<src_dir> <local_file>` 复制文件夹.

> **注:**
>
> (1) 以上 4 个命令都是在本地运行的, 请不要在服务器上运行. 你可以多开多个命令行窗口.
>
> (2) `-P` 必须放在最前面, 且 P 必须是大写.

## SSH 端口转发

*February 26, 2022, [Jingyu Liu](mailto:381258337@qq.com)*

 SSH 除了登录服务器, 还有一大用途, 就是作为加密通信的中介, 充当两台服务器之间的通信加密跳板, 使得原本不加密的通信变成加密通信. 这个功能称为端口转发, 又称 SSH 隧道.

端口转发有两个主要作用:

- 将不加密的数据放在 SSH 安全连接里面传输, 使得原本不安全的网络服务增加了安全性.

- 作为数据通信的加密跳板, 绕过网络防火墙.

端口转发有三种使用方法: 动态转发, 本地转发, 远程转发. 下面逐一介绍.

1. 动态转发

    动态转发指的是本机与 SSH 服务器之间创建了一个加密连接, 然后本机内部针对某个端口的通信, 都通过这个加密连接转发.

    动态转发需要把本地端口绑定到 SSH 服务器. 至于 SSH 服务器要去访问哪一个网站, 完全是动态的, 取决于原始通信, 所以叫做动态转发.

    动态转发的命令是

    `ssh -D <local-port> <tunnel-host> -N`.

    `-D` 表示动态转发; local-port 是本地端口; tunnel-host 是 SSH 服务器; `-N` 表示这个 SSH 连接只进行端口转发, 不登录远程 Shell, 不能执行远程命令, 只能充当隧道.

    需要注意, 这种转发采用了 SOCKS5 协议. 访问外部网站时, 需要把 HTTP 请求转成 SOCKS5 协议, 才能把本地端口的请求转发出去. 如

    `curl -x socks5://<local-host>:<local-port> http://www.example.com`.

    `curl` 是一个工具,用于传输来自服务器或者到服务器的数据. `-x` 参数指定代理服务器, 即通过 SOCKS5 协议的本地 local-port 端口, 访问`http://www.example.com`.

1. 本地转发

    本地转发指的是 SSH 服务器作为中介的跳板机, 建立本地计算机与特定目标网站之间的加密连接. 本地转发是在本地计算机的 SSH 客户端建立的转发规则, 它会指定一个本地端口, 所有发向那个端口的请求, 都会转发到SSH跳板机, 然后 SSH 跳板机作为中介, 将收到的请求发到目标服务器的目标端口.

    本地转发的命令是

    `ssh -L <local-port>:<target-host>:<target-port> <tunnel-host>`.

    `-L` 表示本地转发; local-port 是本地端口; target-host 是想要访问的目标服务器; target-port 是目标服务器的端口; tunnel-host 是 SSH 跳板机.

    举例来说, 现在有一台 SSH 跳板机 tunnel-host, 我们想要通过这台机器,在本地 local-port 端口与目标网站 `www.example.com` 的 target-port 端口之间建立 SSH 隧道, 就可以用上面的命令, 将 target-host 替换为 `www.example.com` 即可.

1. 远程转发

    远程转发指的是在远程 SSH 服务器建立的转发规则. 它跟本地转发正好反过来. 建立本地计算机到远程计算机的 SSH 隧道以后, 本地转发是通过本地计算机访问远程计算机, 而远程转发则是通过远程计算机访问本地计算机.

    远程转发的命令是

    `ssh -R <remote-port>:<target-host>:<target-port> -N <remote-host>`

    `-R` 表示远程端口转发; remote-port 是远程计算机的端口;  target-host 和 target-port 是目标服务器及其端口; remote-host 是远程计算机.

    看一个例子, 内网某台服务器 local-host 在 target-port 端口开了一个服务, 可以通过远程转发将这个 target-port 端口, 映射到具有公网 IP 地址的 `my.public.server` 服务器的 remote-port 端口, 使得访问 `my.public.server:remote-port` 这个地址, 就可以访问到那台内网服务器的 local-port 端口, 就可以用上面的命令, 将 remote-host 替换为 `www.example.com` 即可, 命令是在内网 local-host 服务器上执行.

## 使用密码登录服务器 (已停用)

<font color="#FF0000"> 由于服务器持续遭受攻击, 出于安全性考虑, <b><u> 2022 年 3 月 8 日起 </u></b> 禁止使用密码登录服务器. 登录服务器将必须使用 Public Key. 请参考 <a class="one" href="#public-key"> 教程</a>设置 Public Key 并测试是否已经成功配置 Public Key, 并确保所使用的的 Key 长度至少是 4096 位的. </font>

- 通过 命令行窗口(cmd)
  - `ssh <username>@<IP> -p <port>`, 例如 `ssh aduser@cluster.advancedsolver.com -p 20001`.
  - 如果是第一次连接, 会出现
    `"The authenticity of host '[cluster.advancedsolver.com]:20001 ([*.*.*.*]:20001)' can't be established ... Are you sure you want to continue connecting (yes/no)?"`
    (*.*.*.*是某个ip地址), 此时请输入 `yes`. 需要注意的是, 输入密码时, 密码并不会显示在屏幕上.

- 通过 VS Code
  - 按 `F1`, 选择 `Connect to Host`, 然后选择要连接的 Host, 如果是第一次连接, 请选择 `Add New SSH Host`.

登陆服务器后, 请输入 `passwd` 立即修改密码.
