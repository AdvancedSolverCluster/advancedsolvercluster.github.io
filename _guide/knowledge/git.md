---
title: Git教程
nav_order: 6
parent: 其他知识
---

# Git 教程

*Last modified: December 10, 2024*

Created: *August 9, 2022, [Xiang Li](mailto:646873166@qq.com), [Jingyu Liu](mailto:381258337@qq.com)*


## 介绍

### What is Git?

Git 是一个**非常受欢迎的**分布式版本控制系统。它主要用于：

- 跟踪代码修改
- 记录是谁改了代码
- 帮助多人进行代码合作

### Why Git?

无论你是否已经了解版本控制，我们**强烈推荐**使用 Git 来管理你的代码。Git 可以高效地帮助你管理代码的修改记录，并且是团队合作的首选工具。这里主要使用我们自有的 GitLab 安装版（即数据所在的服务器是自有的）。如果你之前听说过或使用过 GitHub / Gitee / GitLab，那是很好的开始。

### Git 的主要功能

- 以代码仓库（**Repositories**, repo）为单位进行代码管理
- **Clone**：复制远程仓库到本地进行自己的修改
- 通过 **Stage** 和 **Commit** 跟踪和记录对代码的修改
- 使用 **Branch** 和 **Merge** 来允许同时开发一个项目的不同版本或部分
- 使用 **Pull** 和 **Push** 同步远程仓库（GitHub/Gitee/GitLab）保存的代码

### GitHub/Gitee/GitLab 的主要功能

- 这些平台用于存储、协作开发和管理代码，它们允许你托管代码仓库，跟踪项目进度，并与他人共享和协作
- 它们提供了如 Issues、Pull Request (Merge Request)、Wiki 等功能，帮助你与他人更好地合作

## 在命令行里使用 Git

首先你需要确保 Git 已经安装好。在 Linux 上通常已经安装了 Git，而在 Windows 上通常需要手动安装。

当你在命令行里输入 `git --version` 并得到正确的回应时，Git 就装好了。

Git 的指令通常以 `git command subcommand --args` 的形式出现。遇到不确定的命令时，可以使用 `git command --help` 或 `man git command` （Linux）查看帮助。

### 配置 Git

Git 的基本功能之一是记录代码是由谁编辑的，因此需要设置身份信息。Git 会使用你的邮箱地址和名字来标识你是谁。

![](/guide/figure/Git-setup1.webp)

```bash
git config --global user.name "my-awesome-name"
git config --global user.email "one.of.my@email.com"
```

{: .note }
> 如果你希望只在某个项目中使用不同的身份信息，可以不加 `--global` 选项，从而只为当前项目配置。


### 创建一个Git文件夹

现在开始创建一个由 Git 进行版本控制的项目文件夹吧！

~~~ bash
mkdir myproject
cd myproject
~~~

{: .note }
> 如果你已经有了一个项目文件夹，可以直接进入那个文件夹。在 Windows 上，如果你安装了 Git，可以在对应文件夹右键并选择 `Git Bash here`.

选好了文件夹, 在文件夹里初始化

~~~ bash
$ git init
Initialized empty Git repository in /sample/myproject
~~~

这就成功创建了一个 Git 仓库！

{: .important }
> Git 会在该文件夹中创建一个 `.git` 的隐藏文件夹，用来保存所有版本控制的信息。删除这个 `.git` 文件夹后，Git 的本地记录就丢失了。



<div style="background-color: #008080; color: white; ">
 <p style="margin: 10px">Test Yourself With Exercises</p>
 <div style="background-color: #BFDFDF; color: black">
  <p style="margin: 10px">Initialize my project I will type:</p>
  <p style="margin: 10px">git <input type="text" id="exercise1" /></p>
  <p style="margin: 10px"><button onclick="window.alert(document.getElementById('exercise1').value === 'init' ? 'Yeah!!' : 'Are you sure?')">Check</button></p>
 </div>
</div>

## Git 的一些基本命令

以下是一些常用的 Git 命令示例，帮助你开始管理代码：

- `git status`：查看仓库的当前状态，包括修改、暂存等信息。
- `git add <filename>`：将文件添加到暂存区（staging area）。
- `git commit -m "message"`：提交暂存区的更改，并添加一条描述性信息。
- `git pull`：从远程仓库获取最新代码，并合并到当前分支。
- `git push`：将本地提交推送到远程仓库。

你可以通过这些命令轻松管理和同步代码。

更详细的说明可以查看下面推荐的学习资源.

**可以参考的学习资源:**

<https://gitlab.advancedsolver.com/help> (你可以从 `New to Git and GitLab?` 这一标题开始看起)

<https://www.liaoxuefeng.com/wiki/896043488029600>.

## 其他常见问题

### 连接 GitLab 的问题

当你试图连接到我们的 GitLab 服务器 (`gitlab.advancedsolver.com`) 时，如果你没有正确配置 SSH 的 `config` 文件，可能会遇到端口问题。在 clone 或者设置远程地址时，需要确保使用正确的地址格式。例如：

```bash
ssh://git@gitlab.advancedsolver.com:10888/name/repo.git
```

如需添加远程地址，可以使用以下命令：

```bash
git remote add origin ssh://git@gitlab.advancedsolver.com:10888/name/repo.git
```

#### 使用 SSH 配置文件简化连接

更方便的方法是创建一个 SSH 配置文件（通常位于 `~/.ssh/config` 中），来自动指定服务器的端口和密钥文件。配置文件内容如下：

```text
Host gitlab.advancedsolver.com
    HostName gitlab.advancedsolver.com
    User git
    Port 10888
    PreferredAuthentications publickey
    IdentityFile ~/.ssh/id_rsa
```

并把相应的公钥上传到 `https://gitlab.advancedsolver.com/-/profile/keys`.

这样，每次使用 Git 时系统会自动匹配到这条记录并使用相应的端口和身份验证文件。之后，你可以使用更简短的 Git 地址，如：

```bash
git clone git@gitlab.advancedsolver.com:name/repo.git
```

系统会根据配置文件自动处理端口和身份验证信息。

### Windows 下 Git 不区分大小写问题

在 Windows 系统下，Git 默认不区分文件名的大小写。例如，如果你创建了一个 `readme.md` 文件并提交到远程仓库，然后在本地修改文件名为 `Readme.md`，再提交时，Git 可能不会察觉到文件名的变化。即使使用 `git status` 查看，也可能不会显示任何修改。

解决方法：

1. 强制 Git 识别大小写变化：

```bash
git mv readme.md temp.md
git mv temp.md Readme.md
git commit -m "Rename readme.md to Readme.md"
```

通过将文件名暂时修改为另一个名字，再改回你希望的大小写形式，可以强制 Git 识别这次更改。

2. 修改 Git 的配置，强制 Git 区分大小写：

```bash
git config core.ignorecase false
```

这样设置后，Git 会区分文件名的大小写，但要注意，这可能会影响现有项目中的文件名管理，因此应谨慎使用。
