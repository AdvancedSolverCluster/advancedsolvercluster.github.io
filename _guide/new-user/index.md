---
title: 入门教程
nav_order: 2
has_children: true
has_toc: false
---

# 入门教程

第一次接触高性能集群？对Linux一窍不通？就从这里开始吧！
- [我还没有服务器账号，我该怎么做？](i-have-no-account)
- [管理员已经帮我开好了服务器账号，我该怎么连接服务器？](how-can-i-connect)
- [我换了电脑, 怎么在新电脑上连接服务器? (如何自己给现有的账号里添加一个key)](add-key)
- [我已经学会连接服务器了，我能在服务器上做些什么？比如，如何运行程序？](how-can-i-run-program)

# usage

新功能: 在服务器上使用 `usage` 命令, 可以更迅速地得到帮助. 如:

~~~ bash
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
~~~