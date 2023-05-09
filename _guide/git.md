---
title: Git 教程
---

*August 9, 2022, [Xiang Li](mailto:646873166@qq.com), [Jingyu Liu](mailto:381258337@qq.com)*

## 介绍

### What is Git?

Git 是一个**非常受欢迎的**分布式版本控制系统. 它主要用于

- 跟踪代码修改
- 跟踪是谁改了代码
- 帮助多人进行代码合作

### Why Git?

No why, you should. (at least use version control)

我们**强烈推荐**使用 Git 来管理你的代码, 这里主要的工具是我们自有的 GitLab 安装版(即数据所在的服务器是自有的). 在此之前, 你或许已经听过或使用过 GitHub / Gitee / GitLab, 这是个好事情.

### Git的主要功能

- 以代码仓库(**Repositories**, repo)为单位进行代码管理
- **Clone**其他人的仓库到本地进行自己的修改
- 通过**Stage**和**Commit**跟踪和记录对代码的修改
- 使用**Branch**和**Merge**来允许同时开发一个项目的不同版本或不同部分
- 使用**Pull**和**Push**同步远程仓库(GitHub/Gitee/GitLab)保存的代码

### GitHub/Gitee/GitLab的主要功能

- 类似于百度云, DropBox, 它们允许你把代码仓库放在上面, 且与他人共享
- 可以(也应该)使用Git作为工具上下传代码仓库
- 提供Issues/Pull Request(Merge Request)/Wiki等功能帮助你与其他人更好的合作

## 在命令行里使用Git

首先你应该装好Git. Linux上一般会有已装好的Git, 而Windows上通常需要手动安装.

当你在命令行里输入 `git --version` 并得到正确的回应时, Git就装好了.

Git的指令通常以 `git command subcommand --args` 的形式出现, 在对某个命令疑惑的时候可以加上 `--help` 或者 `man git command` (Linux)来查看帮助.

### 配置Git

Git的一大基本功能就是记录代码是由谁编辑的.

![](/guide/figure/Git-setup1.webp)

所以首先需要设置一下自己的身份信息. Git用邮箱地址和名字来标识你是谁.

```bash
git config --global user.name "my-awesome-name"
git config --global user.email "one.of.my@email.com"
```

> **Note.** 在为某个repo编辑的时候, 你可以不加 `--global` 选项从而只配置当前repo.

### 创建一个Git文件夹

开始创建一个由Git进行版本控制的project文件夹吧~

```bash
mkdir myproject
cd myproject
```

> **Note.** 如果你已经有一个文件夹, 你可以直接进那个文件夹. 在Windows里如果你装了Git可以在对应文件夹右键并选择 `Git Bash here`.

选好了文件夹, 在文件夹里初始化

```bash
$ git init
Initialized empty Git repository in /sample/myproject
```

就创建成功了!

> Git会在这个文件夹里创建一个 `.git` 的隐藏文件夹保存所有它需要的东西, 删了Git的本地记录就**没了**.



<div style="background-color: #008080; color: white; ">
 <p style="margin: 10px">Test Yourself With Exercises</p>
 <div style="background-color: #BFDFDF; color: black">
  <p style="margin: 10px">Initialize my project I will type:</p>
  <p style="margin: 10px">git <input type="text" id="exercise1" /></p>
  <p style="margin: 10px"><button onclick="window.alert(document.getElementById('exercise1').value === 'init' ? 'Yeah!!' : 'Are you sure?')">Check</button></p>
 </div>
</div>



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

连接到我们的 gitlab.advancedsolver.com 时, 如果你之前没有写过 config 文件, 请注意, 在clone或者设置地址时要对应的地址(`git@gitlab.advancedsolver.com/name/repo.git`)改成形如

```bash
ssh://git@gitlab.advancedsolver.com:10888/name/repo.git
```

的地址. 例如添加一个地址时使用的命令应为

```bash
git remote add origin ssh://git@gitlab.advancedsolver.com:10888/name/repo.git
```

当然, 更方便的方法是写一个 config 文件(类似于配置 SSH 时使用的配置, 即在 `.ssh` 文件夹下的 `config` 文件), 添加一条记录

```text
Host gitlab.advancedsolver.com
    HostName gitlab.advancedsolver.com
    User git
    Port 10888
    PreferredAuthentications publickey
    IdentityFile ~/.ssh/id_rsa
```

如此, 在使用默认的repo地址时, 系统会匹配到这一条记录并读取相应的端口和身份文件.

### Windows 下 git 不区分大小写

当你创建一个文件 `readme.md`, 写入内容后提交到线上代码仓库, 然后你在本地修改文件名为 `Readme.md`. 接着去提交, 发现代码没有变化, 控制台输入 `git status` 也不显示任何信息.
