# Git 教程

*February 26, 2022, [Jingyu Liu](mailto:381258337@qq.com)*

Git 是一个分布式版本控制系统, 我们强烈推荐使用 Git 来管理你的代码, 这里主要的工具是 GitLab. 在此之前, 你或许已经听过或使用过 GitHub, 这意味着你将几乎处处毫无难度地使用 GitLab.

我们这里给出 Git 的简单介绍, 更详细的说明可以查看下面推荐的学习资源.

**可以参考的学习资源:**

<https://gitlab.advancedsolver.com/help> (你可以从 `New to Git and GitLab?` 这一标题开始看起)

<https://www.liaoxuefeng.com/wiki/896043488029600>.

## git clone到服务器

请先确保你会使用 Git, 你可以查看我们的相关教程进行学习.

### 检查 SSH

进入 `.ssh`, 如果没有这个目录, 说明之前没有使用过 SSH 密钥, 但是由于我们连接服务器的方法为 SSH, 所以不会有这种问题.

如果没有 SSH key, 在服务器生成 SSH key, 具体方法参见 <a class="one" href="public-key"> 教程 </a>.

### NEXT?

剩下的步骤与 Git 的常规使用方法相同, 即为:

- 用 `git config` 配置用户名与邮箱.

- 将公钥辅助到远程库.

- `git clone`.

## 其他问题

### 连接 Gitlab 的问题

连接到我们的 <git@gitlab.advancedsolver.com:test.git> 时, 如果你之前没有写过 config 文件, 请注意, 要将其改成

``` bash
ssh://git@gitlab.advancedsolver.com:test.git`
```

比如

``` bash
git remote add origin ssh://git@gitlab.advancedsolver.com:test.git
```

当然, 更方便的方法是写一个 config 文件, 它的内容如下所示

``` text
Host gitlab.advancedsolver.com
    HostName gitlab.advancedsolver.com
    User git
    Port 10888
    PreferredAuthentications publickey
    IdentityFile ~/.ssh/id_rsa
```

### Windows 下 git 不区分大小写

当你创建一个文件 `readme.md`, 写入内容后提交到线上代码仓库, 然后你在本地修改文件名为 `Readme.md`. 接着去提交, 发现代码没有变化, 控制台输入 `git status` 也不显示任何信息.
