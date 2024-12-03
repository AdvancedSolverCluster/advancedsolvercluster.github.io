---
title: sbatch
nav_order: 3
parent: slurm
grand_parent: 使用须知
---
# `sbatch`

当你想要执行的不止一条命令, 或者执行的命令需要非常久才能完成, 此时需要使用 `sbatch` 提交你的任务.

把所有需要运行的命令写进一个脚本里, 然后通过 `sbatch` 提交. 脚本就是平时的 shell 脚本 (入门教程中见过的 shell 指令都可以在里面使用), 但这个脚本必须以 `#!/bin/bash` 开头. 例如我们创建了一个叫做 `job.sh` 的文件包含以下内容:

~~~ bash
#!/bin/bash
module load MATLAB
matlab -batch "testMatlab"
~~~

接下来, 用 `sbatch job.sh` 提交作业. 屏幕上会打印 `Submitted batch job ###`, 其中 `###` 是你的作业 id. 当作业结束后, 结果会输出到当前目录下的 `slurm-###.out`, 如果作业产生了错误信息, 会输出到 `slurm-###.err`.

{: .note }
> 和 `salloc` 不同的是, `sbatch` 会继承你在登陆节点上加载的模块和设置的环境变量.

另可参考: SLURM 官方文档对 `sbatch` 的介绍 <https://slurm.schedmd.com/sbatch.html>
