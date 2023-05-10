---
title: usage
nav_order: 4
parent: 入门教程
---

# usage

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