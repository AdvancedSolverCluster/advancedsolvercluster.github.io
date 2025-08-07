---
title: 我还没有服务器账号, 我该怎么做?
nav_order: 2
parent: 快速开始
---


# 我还没有服务器账号, 我该怎么做?

*Last modified: March 03, 2025*

## Step 1: 生成 Key

首先, 你需要一个 key, 作为你的身份证明。

我们推荐使用 `ed25519` 算法，因为它更现代、更快速，且默认安全性较高。相比于其他算法，如 ECDSA 或 RSA，`ed25519` 的性能和安全性更优，特别适合 SSH 认证。

在你的电脑上, 打开一个终端窗口。输入 `ssh-keygen -t ed25519`。

~~~text
> ssh-keygen -t ed25519
Generating public/private ed25519 key pair.
Enter file in which to save the key (C:\Users\<username>/.ssh/id_ed25519):
~~~

敲击 `Enter`。

~~~text
> ssh-keygen -t ed25519
Generating public/private ed25519 key pair.
Enter file in which to save the key (C:\Users\<username>/.ssh/id_ed25519):
Enter passphrase (empty for no passphrase):
~~~

再次敲击 `Enter`。

~~~text
> ssh-keygen -t ed25519
Generating public/private ed25519 key pair.
Enter file in which to save the key (C:\Users\<username>/.ssh/id_ed25519):
Enter passphrase (empty for no passphrase):
Enter same passphrase again:
~~~

再次敲击 `Enter`。（你可能已经嫌烦了，别着急，这就结束了。）

这时候，key 就生成好了。终端会提示你，你的 identification (即私钥, private key) `id_ed25519` 被存储在了什么位置。你的 public key (即公钥) `id_ed25519.pub` 被存储在了什么位置。

你会发现公钥和私钥实际上在同一个位置下。对于 Windows 用户，这个位置是 `C:\Users\<username>\.ssh\`。对于 macOS/Linux 用户，这个位置是 `/home/<username>/.ssh/`。

{: .tip }
> `.ssh` 对于 macOS/Linux 在 `~/.ssh/`，`~` 是用户的 home 目录的简写。对于 Windows 是 `C:\Users\<username>\.ssh\`，`C:\Users\<username>` 实际上是用户的 home 目录。

{: .important }
> 请注意，私钥相当于你的身份证明：**任何获取了你私钥的人都可以以你的身份登录你的账户！私钥在任何时候都不能被泄露！也不应该作为网盘同步的一部分等被上传到任何其他地方！**

### Passphrase 选择

在生成密钥的过程中，系统会提示你设置一个 passphrase。如果你选择了使用 passphrase，每次使用 SSH 时都会要求输入该密码。这为你的私钥增加了一层额外的安全性。

{: .tip }
> **建议**：使用一个强密码来保护私钥，这样即便私钥文件被窃取，攻击者也无法使用它。

### 管理旧密钥

如果你已经有其他 SSH 密钥（如 `id_rsa`），可以选择备份它们，或将新生成的 `ed25519` 密钥作为默认密钥使用。确保 `.ssh` 目录下的多个密钥不会相互冲突。

## Step 2: 将 Public key 发送给我们

将生成的 Public key `id_ed25519.pub` 的内容**复制到正文中**发送至[管理员邮箱](mailto:cash_admin@163.com)。

一个正确的 Public Key 格式如下:

```text
<key-type> <public-key> <comment>
```

例如：

```text
ssh-ed25519 AAAAC3Nza...base64encodeddata...== user@hostname
```

这一串字符应该以 `ssh-ed25519` 开头, 然后是一个空格, 然后是一串乱七八糟的字符混合体, 里面几乎什么都有但是**没有空格也没有换行**. 然后又是一个空格, 最后是你在你自己电脑上的名字 @ 你自己电脑的名字.

{: .tip }
> comment 部分通常显示你的用户名和主机名，用于标识公钥的来源。你可以自定义这个部分以便于区分多个密钥，例如将 comment 修改为 my-ed25519-key。

发个邮件给管理员, 别忘了**备注上你的姓名, 申请账号的原因, 负责老师, 预计毕业时间 (课题组学生) 或使用结束时间 (其他人员)**, 一般来说管理员会在24小时内回复, 告诉你, 你在服务器上的账户名是什么. 这个名字, 我们以后都用 `<username>` 指代.

## 结束了?

是的, 就是这么简单. 静候管理员回复你的邮件吧. 如果管理员没有及时回复, 可以再发一封邮件催促或通过其他途径联系到管理员催促.

在这期间, 你可以

- 阅读 [VS Code 教程](vscode) 学习如何使用 VS Code 连接服务器;
- 阅读 [SSH 知识](../knowledge/ssh) 了解关于不同的密钥加密算法及其长度、性能等方面的比较，以及 SCP 的用法，SSH 端口转发的用法等。

## 我收到管理员的回信了, 得到了我在服务器上的账户名, 接下来我该怎么连接服务器?

请移步[管理员已经帮我开好了服务器账号，我该怎么连接服务器？](how-can-i-connect).
