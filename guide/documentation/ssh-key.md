# SSH 公钥与私钥

*June 28, 2022, [Jingyu Liu](mailto:381258337@qq.com), [Yuejia Zhang](mailto:yuejiazhang21@m.fudan.edu.cn), [Yidong Zhang](mailto:2308353627@qq.com), [Xiang Li](mailto:646873166@qq.com), [Ming Li](mailto:19300180127@fudan.edu.cn)*

# 创建 Public Key

## Step 1 生成 Key

创建/进入本地的 `.ssh` 目录 (对于 macOS/Linux 是 `~/.ssh/`, 对于 Windows 是 `C:\Users\<user>\.ssh\`, 如果无 Linux 系统, 不必为此下载 Ubuntu 等子系统, 直接在 Windows 里做下述操作即可) 查看是否已有 Key (例如, 私钥 `id_ecdsa` 和公钥 `id_ecdsa.pub`, 也可能是`id_rsa`, `id_rsa.pub`等). 如果已经有一个 Key, 这可能是以前创建的, 如果没有, 使用下面的命令生成一个Key. **无论如何, 我们推荐你再生成一个Key!** Key相当于你的身份证明: **任何获取了你Key的人都可以以你的身份登录你的账户!**

在本地的命令行里通过 `ssh-keygen -t ecdsa -b 521` 生成使用ECDSA算法加密的 521 bits Key, 使用命令如果输入的bit数不对则会得到:

``` bash
Invalid ECDSA key length: valid lengths are 256, 384 or 521 bits
```

我们推荐使用 521 bits 加密的 Key.

根据屏幕提示, 生成一个 Key Pair (包括 Public 部分和 Private 部分) 并可选择是否带密码保护你的 Key. 完成后会生成私钥 (Private Key) `id_ecdsa` 和公钥 (Public Key) `id_ecdsa.pub` (或其他自定义名字). 如果使用了带密码保护的 Key, 在每次使用 Key 的时候会需要额外验证你的密码.

一般来说, 你可以自定义私钥和公钥的名字, 只要你自己能分清. **私钥 (Private Key) 在任何时候都不能被泄露!也不应该作为网盘同步的一部分等被上传到任何其他地方!**

有效的 521 bits ECDSA 加密公钥 `id_ecdsa.pub` 应当是一整行以 `ecdsa-sha2-nistp521` 开头的字符串. 后面会提到如何验证 rsa key 的长度.

## Step 2 将 Public key 发送给我们

将生成的 Public key `id_ecdsa.pub`的内容**复制到正文中**发送至[管理员邮箱](mailto:cash_admin@163.com)后联系管理员添加公钥至对应账号. 账号名将由管理员指定, 如果已经有帐号, 邮件内容应说明所用的账号名.
请**注意检查复制的内容是否正确**, 例如可能会出现多出空格等问题, 确保无误后再发送. 一个正确的 Public Key 格式如下:

`<key-type>[space]<public-key>[space]<comment>`

请注意比对.

**注:**

1. 也可以使用 RSA 算法生成 Key, 但由于速度相对慢不推荐. 如使用则至少应使用 8192 bit 的长度来保证安全性, 对应的命令是 `ssh-keygen -t rsa -b 8192`.

1. 确认已有的 Public Key 长度.

    如果你本来就是通过 SSH Key 连接到服务器的, 请在本地通过以下命令查看公钥的长度:

    ```shell
    ssh-keygen -l -f <path/to/your/public/key>
    ```

    例如, 在 Windows CMD 里运行 `ssh-keygen -l -f C:\Users\jyliu\.ssh\id_rsa.pub`. 输出的第一个数即公钥的大小, 如果小于 4096, 请重新生成, 需要指出, 这个长度限制是针对 rsa key 的.

## Step 3 本地 SSH 配置

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
服务器的公网地址是 `cluster.advancedsolver.com`. 如果在复旦校园网内, 或可以通过 VPN 连接进入校园网环境, **应使用内网地址** `10.88.3.90`. 公网 ip 的连接速度**远慢于**使用 VPN 的内网环境 (在公网 ip 下命令行中输入存在延迟也是由于这个原因). 使用内网时, 上述 config 文件应设置 HostName 为内网地址.

# 测试连接

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
