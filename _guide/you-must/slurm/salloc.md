---
title: salloc
nav_order: 2
parent: slurm
grand_parent: 使用须知
---
# `salloc`

*Last modified: December 03, 2024*

编写自己的程序, 在跑大规模的测试例子之前通常需要经历在小规模例子上的 debug 环节. 这时候, 为了验证自己的程序能正常运行, 你往往会需要在可以交互的环境下尝试运行程序 -> 观察错误 -> 修改程序 -> 再次运行.

虽然, 非常小的例子 (例如：运行时长仅仅几秒钟的程序) 可以在登录节点上临时测试, 但更多的时候, 你需要在计算节点上测试你的程序.

使用 `salloc` 可以向 SLURM 申请计算资源, 然后你可以登录到计算节点上进行你的测试 (在命令行里你可以看到你现在在哪台机器上).

~~~
aduser@loginNode:~$ salloc
salloc: Granted job allocation 2984
salloc: Waiting for resource configuration
salloc: Nodes bigMem1 are ready for job
aduser@loginNode:~$ ssh bigMem1 -p 10888
... after some time ...
aduser@bigMem1:~$ exit
logout
Connection to 192.168.2.11 closed.
aduser@loginNode:~$ exit
exit
salloc: Relinquishing job allocation 2984
salloc: Job allocation 2984 has been revoked.
~~~

首先, 用 `salloc` 申请资源, 然后通过 `ssh` 加端口 `-p 10888` 登录到分配的计算节点上. 例如: `ssh bigMem1 -p 10888`.

{: .important }
> **不要忘记加上端口号.** 不加端口号的 `ssh bigMem1` 会收到报错提示: `ssh: connect to host bigmem1 port 22: Connection refused`.

输入一次 `exit` 便可回退到登陆节点. 通过 `ssh bigMem1 -p 10888` 重新进入计算节点.

如果不再需要计算资源了, 再输入一次 `exit` 将任务结束.


{: .important }
> **请务必记得结束任务, 避免占用不使用的资源.** 默认的任务执行时间上限是 6 小时. 不合理的占用会被管理员提醒.


{: .note }
> `salloc` 会创建一个新的 bash 环境, 因此你在登陆节点上加载的模块和设置的环境变量都需要重新加载和设置.
>

{: .note }
> 一些集群会禁止使用 `ssh xx` 的形式登录计算节点. 此时可以尝试 `srun --jobid=xx --pty /bin/bash` 来登录计算节点.

另可参考: SLURM 官方文档对 `salloc` 的介绍 <https://slurm.schedmd.com/salloc.html>