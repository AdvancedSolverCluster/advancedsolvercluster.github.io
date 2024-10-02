---
title: SSH 基础知识：公钥与私钥/传输文件/端口转发
nav_order: 2
parent: 其他知识
---

# SSH 基础知识：密钥加密算法介绍/传输文件/端口转发

*June 28, 2022, [Jingyu Liu](mailto:381258337@qq.com), [Yuejia Zhang](mailto:yuejiazhang21@m.fudan.edu.cn), [Yidong Zhang](mailto:2308353627@qq.com), [Xiang Li](mailto:646873166@qq.com), [Ming Li](mailto:19300180127@fudan.edu.cn)*

Last update: *Sept 9, 2024*

## 常用的加密算法

在使用 SSH 连接服务器时，不同的加密算法提供了不同的安全性和性能表现。选择合适的加密算法至关重要，因为它不仅影响你的连接速度，也决定了连接的安全性。本文将介绍几种常用的 SSH 密钥加密算法，并解释何时需要检查密钥长度，以及不同长度对性能的影响。

### 1. **Ed25519**

`Ed25519` 是一种基于椭圆曲线的现代加密算法，近年来被广泛推荐用于 SSH 密钥。它具备以下特点：

- **安全性**：Ed25519 被认为非常安全，并且具有抗量子攻击的潜力。
- **固定长度**：Ed25519 密钥的长度是固定的，不需要检查或调整。它使用 256 位的公钥和 512 位的私钥。
- **高效性**：它的签名速度非常快，比 RSA 和 ECDSA 更加高效，适合在各种场景下使用。

**推荐场景**：
- 适合大多数用户，特别是需要高效安全的连接时。

**生成命令**：

```bash
ssh-keygen -t ed25519
```

### 2. **ECDSA (Elliptic Curve Digital Signature Algorithm)**

`ECDSA` 是另一种基于椭圆曲线的加密算法，与 Ed25519 类似，但稍微老一些。它的主要特点如下：

- **安全性**：相对安全，常用于 SSH 密钥，但由于 Ed25519 的兴起，ECDSA 的使用逐渐减少。
- **可变长度**：ECDSA 支持 256 位、384 位和 521 位的密钥长度。一般来说，521 位密钥提供了更高的安全性，但生成和使用时稍慢。
- **性能**：ECDSA 的签名速度比 RSA 快，但比 Ed25519 慢。

**推荐场景**：
- 如果你需要支持特定的椭圆曲线加密，并且对 Ed25519 不熟悉，可以使用 ECDSA。

**生成命令**：

```bash
ssh-keygen -t ecdsa -b 521
```

{: .important }
> 如果你选择了 ECDSA，建议使用 521 位长度的密钥，以确保更高的安全性。

### 3. **RSA (Rivest–Shamir–Adleman)**

`RSA` 是历史最悠久、应用最广泛的加密算法之一。虽然 RSA 依然安全，但相比椭圆曲线加密算法，它需要更长的密钥长度来提供同样级别的安全性。其特点包括：

- **安全性**：使用较长的密钥（如 4096 位）时，RSA 依然非常安全。
- **可变长度**：RSA 密钥可以为 2048 位、4096 位或更长。为了确保足够的安全性，建议至少使用 4096 位的密钥。
- **性能**：RSA 的签名和验证过程相对较慢，特别是当密钥长度超过 4096 位时，性能影响更加明显。密钥越长，速度越慢。

**推荐场景**：
- 如果你需要兼容性良好、广泛支持的算法，或者你使用的环境不支持椭圆曲线加密算法。

**生成命令**：
```bash
ssh-keygen -t rsa -b 4096
```

{: .important }
> RSA 密钥的长度越长，安全性越高，但也会带来性能下降。因此，建议在 4096 位密钥的基础上使用，不必追求过长的密钥。

### 4. **DSA (Digital Signature Algorithm)**

`DSA` 是一种较老的加密算法，不再推荐使用。其主要原因是它仅支持 1024 位密钥，安全性较低。而且，许多现代系统已经逐步废弃对 DSA 的支持。

**不推荐使用 DSA**。

## 密钥长度的影响

对于不同的加密算法，密钥长度直接影响安全性和性能：

- **RSA**：需要较长的密钥来提供足够的安全性。2048 位的 RSA 密钥已经过时，建议至少使用 4096 位。如果使用 8192 位密钥，安全性虽然更高，但性能会显著下降，特别是在嵌入式设备或低性能系统上。
- **ECDSA**：建议使用 521 位密钥，它能提供相当于 15360 位 RSA 密钥的安全性，但不需要检查或调整长度，使用方便。
- **Ed25519**：长度固定，无需手动设置，性能最佳，因此不需要检查其长度。

## 如何检查现有密钥的长度

如果你已经生成了 SSH 密钥，尤其是 RSA 或 ECDSA 密钥，可以通过以下命令检查公钥的长度：

```bash
ssh-keygen -l -f <path/to/your/public/key>
```

例如，检查 RSA 密钥长度：

```bash
ssh-keygen -l -f ~/.ssh/id_rsa.pub
```

输出的第一个数字即为公钥的长度。如果长度不足（如 RSA 低于 4096 位），建议重新生成密钥。

## 总结

- **Ed25519** 是目前最推荐的 SSH 密钥加密算法，因其安全性和高效性，适合大多数用户。
- **ECDSA** 是另一种基于椭圆曲线的加密算法，虽然仍然安全，但逐渐被 Ed25519 取代。
- **RSA** 依然广泛支持，推荐使用至少 4096 位的密钥，但比起椭圆曲线加密，性能较差。
- **DSA** 不再推荐使用，因其安全性较低且不再被广泛支持。

选择合适的加密算法和密钥长度时，需要在安全性和性能之间找到平衡。如果你不确定该选择哪种算法，默认选择 Ed25519 是一个安全且高效的选择。

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
