---
title: srun
nav_order: 1
parent: slurm
grand_parent: 使用须知
---
# `srun`
*Last modified: December 03, 2024*

官方文档: <https://slurm.schedmd.com/srun.html>

直接在你要运行的程序前加一个 `srun`, slurm 就会自动帮你把这个程序放到可用的计算节点上运行. 比如, 原本需要运行 `python3 helloworld.py`, 现在就可以输入

~~~ bash
srun python3 helloworld.py
~~~

这个任务就会由计算节点执行, 你并不会感觉到和你直接在登录节点(或者你自己的电脑上)执行命令有什么区别, 但实际上所有的运算都是由计算节点完成的, 登录节点只负责把你的命令传达给计算节点.

{: .important}
> **注意:** `srun`, `salloc`, `sbatch` 实际上都有默认的任务执行时间上限. 我们集群的设置是 6 小时. 超出 6 小时的任务会被强制掐断. 如果需要更长的时间需要自己指定运行时间参数, 见下文.
>

{: .note }
> 在不添加任何参数的情况下, `srun`, `salloc`, `sbatch` 的计算资源仅仅只有单核, 并且 **不会使用GPU**. 对于会默认并行的程序来说 (例如Python, MATLAB), 你可能会反而觉得速度不如在登录节点上测试的时候快. 这是因为申请的资源太少了. 你需要指定额外的参数来确定你所需要的核数.