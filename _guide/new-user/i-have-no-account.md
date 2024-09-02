---
title: 我还没有服务器账号, 我该怎么做?
nav_order: 1
parent: 入门教程
---

*Last update: April 27, 2024*


# 我还没有服务器账号, 我该怎么做?

## Step 1: 生成 Key

首先, 你需要一个 key, 作为你的身份证明.

在你的电脑上, 打开一个终端窗口. 输入`ssh-keygen -t ecdsa -b 521`.

~~~ text
> ssh-keygen -t ecdsa -b 521
Generating public/private ecdsa key pair.
Enter file in which to save the key (C:\Users\<username>/.ssh/id_ecdsa):
~~~

敲击 `Enter`.

~~~ text
> ssh-keygen -t ecdsa -b 521
Generating public/private ecdsa key pair.
Enter file in which to save the key (C:\Users\<username>/.ssh/id_ecdsa):
Enter passphrase (empty for no passphrase):
~~~

再次敲击 `Enter`.

~~~ text
> ssh-keygen -t ecdsa -b 521
Generating public/private ecdsa key pair.
Enter file in which to save the key (C:\Users\<username>/.ssh/id_ecdsa):
Enter passphrase (empty for no passphrase):
Enter same passphrase again:
~~~

再次敲击 `Enter`. (你可能已经嫌烦了, 别着急, 这就结束了.)

这时候, key 就生成好了. 终端会提示你, 你的 identification (即私钥, private key) `id_ecdsa` 被存储在了什么位置. 你的 public key (即公钥) `id_ecdsa.pub` 被存储在了什么位置.

你会发现公钥和私钥实际上在同一个位置下. 对于 Windows 用户, 这个位置是 `C:\Users\<username>\.ssh\`. 对于 macOS/Linux 用户, 这个位置是 `/home/<username>/.ssh/`.

{: .tip }
> `.ssh` 对于 macOS/Linux 在 `~/.ssh/`, `~` 是用户的home的简写. 对于 Windows 是 `C:\Users\<username>\.ssh\`, `C:\Users\<username>` 实际上是用户的home.

{: .important }
> 请注意, 私钥相当于你的身份证明: **任何获取了你私钥的人都可以以你的身份登录你的账户! 私钥在任何时候都不能被泄露! 也不应该作为网盘同步的一部分等被上传到任何其他地方!**

以任何名义索要你的私钥的行为, 都是窃密. 请放心, 我们只要你的公钥.

## Step 2: 将 Public key 发送给我们

将生成的 Public key `id_ecdsa.pub` 的内容**复制到正文中**发送至[管理员邮箱](mailto:cash_admin@163.com).

既然你已经复制到邮件正文里了, 那不妨检查一下它的格式是否正确吧. 这一串字符应该以 `ecdsa-sha2-nistp521` 开头, 然后是一个空格, 然后是一串乱七八糟的字符混合体, 里面几乎什么都有但是**没有空格也没有换行**. 然后又是一个空格, 最后是你在你自己电脑上的名字 @ 你自己电脑的名字.

发个邮件给管理员, 别忘了**备注上你的姓名, 申请账号的原因, 负责老师, 预计毕业时间 (课题组学生) 或使用结束时间 (其他人员)**, 一般来说管理员会在24小时内回复, 告诉你, 你在服务器上的账户名是什么. 这个名字, 我们以后都用 `<username>` 指代.

## 结束了?

是的, 就是这么简单. 静候管理员回复你的邮件吧. 如果管理员没有及时回复, 可以再发一封邮件催促或通过其他途径联系到管理员催促.

在这期间, 你可以

- 阅读 [VS Code 教程](../knowledge/vscode) 学习如何使用 VS Code 连接服务器;
- 详细了解一下刚才自己都做了什么, 每一步都代表着什么, 如果不这么做会怎么样, 阅读[SSH 知识](../knowledge/ssh).

## 我收到管理员的回信了, 得到了我在服务器上的账户名, 接下来我该怎么连接服务器?

请移步[管理员已经帮我开好了服务器账号，我该怎么连接服务器？](how-can-i-connect).
