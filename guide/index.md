# Advanced Solver 集群使用指南

## 公告板

新功能: 在服务器上使用 `usage` 命令, 可以更迅速地得到帮助. 如:

```bash
[yjzhang-admin@loginNode ~]$ usage sbatch
write a script to submit job to copmute node.
sample file `example.sbatch`:

#!/bin/bash
#SBATCH -t 30
pwd; hostname; date
echo "Running python on the server"
python3 helloworld.py

--nodes=<number> (-N <number>)  1       分配的节点数, 由于目前只有两个计算节点, 因此最大值为2.
--ntasks=<number> (-n <number>) 1       启动的进程数量, 当你运行MPI程序时需要修改这个选项.
...
```

## 入门教程

第一次接触高性能集群？对Linux一窍不通？就从这里开始吧！

- [我还没有服务器账号，我该怎么做？](new-user/i-have-no-account.md)
- [管理员已经帮我开好了服务器账号，我该怎么连接服务器？](new-user/how-can-i-connect.md)
- [我已经学会连接服务器了，我能在服务器上做些什么？比如，如何运行程序？](new-user/how-can-i-run-program.md)

## 进阶教程

<!-- **<font size=3> 以下提供了一些你可能会用到的教程, 如果您有任何建议和想法, 欢迎修改和补充! </font>** -->

- [首次登录服务器! - 服务器基本操作: SSH & SCP](connect-to-server.md)
- [服务器的基本操作? - Linux 服务器的基本知识](basic-linux.md)
- [我的第一个程序! - 运行程序及提交作业](run-program.md)
  - Python: [Tensorflow + Pytorch](documentation/python-tensorflow-pytorch.md)
  - [Jupyter Notebook](documentation/python-jupyter-notebook.md)
- [进阶1: 在命令行里写代码 - vi/vim 教程](vim.md)
- [进阶2: 使用编辑器里写代码 - VSCode 教程](vscode.md)
- [进阶3: Markdown 教程](markdown.md)
- [进阶4: Git 教程](git.md)
- [关于服务器各用户储存空间的 Quota](xfs-quota.md)
- [使用Element聊天软件](element.md)
- [集群中各服务器的配置与性能](benchmark.md)

## FAQ

*March 5, 2022, [Jingyu Liu](mailto:381258337@qq.com)*

- 我想访问的位置提示 Permission denied, 怎么办？

一般来说,每个人的工作区域就在 `/home/username` . 出现 Permission denied 是因为你没有权限访问这个位置, 请不要访问它, 且一般来说你也无须访问.

- 我想用的软件机器上没有或者版本过低, 怎么办？

一般软件的主页里会提供 Installation Guide. 请根据安装指南将软件安装到自己的用户目录下(提示: 通过make或cmake编译安装的软件可以在第一步指明安装路径, 这时只要将安装路径指定为自己的用户目录, 就无需管理员权限).

如果安装失败, 或没有找到不需要管理员权限的安装指南, 请 <a class="one" href="mailto:cash_admin@163.com"> 联系管理员 </a>, 邮件里写明软件名称及用途, 管理员会在24小时内回信.

- 我不小心修改了 `~/.bashrc` 文件, Linux 系统指令失效, 怎么办?

请使用 `/usr/bin/vim ~/.bashrc` 回到 `.bashrc` 文件, 把你的修改撤回到原来的样子. 如果你已经忘了自己的修改, 你可以在 `/home/admin/script/` 目录下找到一个名为 `bashrc_sample` 的文件, 删除自己目录下的 `.bashrc` 文件, 然后将 `bashrc_sample` 复制过来并重命名为 `.bashrc` (这个命令是 `cp /home/admin/script/bashrc_sample ~/.bashrc`). 最后退出重连服务器即可.
