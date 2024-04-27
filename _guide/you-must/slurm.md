---
title: 如何利用SLURM在集群上运行程序
nav_order: 1
parent: 使用须知
---

{: .important }
> 这是一篇比较长的教程. 但你仍然需要仔细阅读以确保能正确的在集群上运行程序.

# 如何利用SLURM在集群上运行程序

*Last update: April 27, 2024*

服务器上已经有很多用户在运行程序了, 你**不可以**和其他人一起抢占资源 (最终导致炸服). 另外, 我们的登陆节点性能也不如计算节点好. 我们的服务器集群使用 SLURM, 一套自动化资源分配的作业调度工具, 帮助你提交作业到计算节点上运行. 当你的程序需要很长的运行时间或者很大的内存占用时, 请使用 SLURM 提交程序. 下文介绍了如何使用 SLURM 提交程序.

- 👉[申请资源与提交作业](#申请资源与提交作业), 介绍了slurm的三种提交作业的方法: `srun`, `salloc`, `sbatch`.
- 👉[申请资源选项](#申请资源选项), 介绍了在提交作业的同时，如何指定作业时限、核数等参数.
- 👉[其他常用命令](#其他常用命令), 介绍了`sinfo`, `squeue`, `scancel`, `scontrol`等其它slurm命令, 帮助你更好地了解服务器状态与作业状态.
- 👉🆕[预约节点资源](#预约节点资源)

{: .important }
> 我们以对其他用户可能造成的影响来衡量一个任务是否适合在登录节点临时运行.
> 
> 例如, 以下是你可以在登录节点上临时运行的程序:
>
> 1. 已知仅使用极少数核心的程序 (例如 C, C++ 程序默认为1核, 不调用 `numpy, pandas` 等库的简单 Python 程序), 不超过10分钟
> 2. 已知使用半数左右核心的程序 (例如经过手动控制并行程度的 C, C++ 程序), 不超过3-5分钟
> 3. 可能会使用全部核心的程序 (例如 MATLAB, 涉及 `numpy, pandas` 等并行计算库的 Python 程序), 不超过1分钟
>
> 例如, 以下是你**必须要去计算节点上运行的程序**:
>
> 1. 预计可能会使用超过 32G 内存的程序
> 2. 预计运行时长超过 10 分钟的程序
> 3. 预计其中计算密集部分超过 1 分钟的程序
> 

![user-topology](/guide/figure/user-topology.png)

## 申请资源与提交作业

将你想要运行的一条或多条指令 (例如执行一个Python脚本) 称为作业 (job). SLURM 提供了运行作业的三种方式:

- `srun`: 将你当前要运行的一条指令提交到计算节点上运行. 优点是最容易使用, 缺点是只能运行一行代码 (因此无法提前设置环境变量等). 如果你想要运行的命令一行不够, 比如需要在运行命令之前加载模块, 或者设置环境变量等, 可以用下面的 `salloc` 或 `sbatch`.
- `salloc`: 为需要实时处理的作业分配资源, 系统会为你分配一个或多个计算节点, 然后你可以登陆到计算节点上, 使用交互式命令行. 这一用法适用于需要互动处理的作业.
- `sbatch`: 提交作业脚本, 系统会为你分配一个或多个计算节点, 运行你的作业. 这一用法适用于放在后台慢慢跑的作业.

### `srun`

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
> 在不添加任何参数的情况下, `srun` 的计算资源仅仅只有1-2核, 并且 **不会使用GPU**. 对于会默认并行的程序来说 (例如Python, MATLAB), 你可能会反而觉得速度不如在登录节点上测试的时候快. 这是因为申请的资源太少了. 你需要指定额外的参数来确定你所需要的核数. 


### `salloc`

编写自己的程序, 在跑大规模的测试例子之前通常需要经历在小规模例子上的 debug 环节. 这时候, 为了验证自己的程序能正常运行, 你往往会需要在可以交互的环境下尝试运行程序 -> 观察错误 -> 修改程序 -> 再次运行.

虽然, 非常小的例子(例如：运行市场仅仅几秒钟的程序)可以在登录节点上临时测试, 但更多的时候, 你需要在计算节点上测试你的程序.

使用 `salloc` 可以向 SLURM 申请计算资源, 然后你可以登录到计算节点上进行你的测试 (在命令行里你可以看到你现在在哪台机器上).

~~~
aduser@loginNode:~$ salloc
salloc: Granted job allocation 2984
salloc: Waiting for resource configuration
salloc: Nodes bigMem1 are ready for job
aduser@loginNode:~$ ssh bigMem1
aduser@bigMem1:~$ exit
logout
Connection to 192.168.2.11 closed.
aduser@loginNode:~$ exit
exit
salloc: Relinquishing job allocation 2984
salloc: Job allocation 2984 has been revoked.
~~~

首先, 用 `salloc` 申请资源, 然后通过 `ssh` 登录到分配的计算节点上. 输入一次 `exit` 回退到登陆节点, 再输入一次 `exit` 将任务结束.


{: .important }
> **请务必记得结束任务, 避免占用不使用的资源.** 默认的任务执行时间上限是 6 小时. 不合理的占用会被管理员提醒.


{: .note }
> 在不添加任何参数的情况下, 创建的计算资源仅仅只有1-2核, 并且 **不会使用GPU**. 对于会默认并行的程序来说 (例如Python, MATLAB), 你可能会反而觉得速度不如在登录节点上测试的时候快. 这是因为申请的资源太少了. 你需要指定额外的参数来确定你所需要的核数. 
>
> `salloc` 会创建一个新的 bash 环境, 因此你在登陆节点上加载的模块和设置的环境变量都需要重新加载和设置.

另可参考: SLURM 官方文档对 `salloc` 的介绍 <https://slurm.schedmd.com/salloc.html>


### `sbatch`

当你想要执行的不止一条命令, 或者执行的命令需要非常久才能完成, 此时需要使用 `sbatch` 提交你的任务.

把所有需要运行的命令写进一个脚本里, 然后通过 `sbatch` 提交. 脚本就是平时的 shell 脚本 (入门教程中见过的 shell 指令都可以在里面使用), 但这个脚本必须以 `#!/bin/bash` 开头. 例如我们创建了一个叫做 `job.sh` 的文件包含以下内容:

~~~ bash
#!/bin/bash
module load MATLAB
matlab -batch "testMatlab"
~~~

接下来, 用 `sbatch job.sh` 提交作业. 屏幕上会打印 `Submitted batch job ###`, 其中 `###` 是你的作业 id. 当作业结束后, 结果会输出到当前目录下的 `slurm-###.out`, 如果作业产生了错误信息, 会输出到 `slurm-###.err`.

{: .note }
> 在不添加任何参数的情况下, 创建的计算资源仅仅只有1-2核, 并且 **不会使用GPU**. 对于会默认并行的程序来说 (例如Python, MATLAB), 你可能会反而觉得速度不如在登录节点上测试的时候快. 这是因为申请的资源太少了. 你需要指定额外的参数来确定你所需要的核数. 
> 
> 和 `salloc` 不同的是, `sbatch` 会继承你在登陆节点上加载的模块和设置的环境变量.

另可参考: SLURM 官方文档对 `sbatch` 的介绍 <https://slurm.schedmd.com/sbatch.html>

## 申请资源选项

在上述案例中, 无论是 `srun`, `salloc` 还是 `sbatch` 都默认你申请一个计算节点, 启动一个进程, 不使用GPU, 并有默认的运行时长上限. 如果你想要申请更多资源 (**比如你需要使用GPU, 就必须加上GPU选项!**), 或者指定一些运行设定, 都可以添加选项.

比如, 加 `-t 30` 表示申请运行30分钟的任务, 就直接把选项加在命令后面:

~~~ bash
srun -t 30 python3 helloworld.py
salloc -t 30
sbatch -t 30 test.sh
~~~

{: .important }
> 请注意，选项必须紧跟 SLURM 命令。
>
> - ❌ 错误示例： `sbatch test.sh -t 30`
> - ✅ 正确示例： `sbatch -t 30 test.sh `

对于 `sbatch`, 还可以把选项放在脚本的开头, 以 `#SBATCH` 开头, 而且必须接在 `#!/bin/bash` 的后面, 放在所有的命令前面, 否则就会被当成普通的注释. 比如:

~~~ bash
#!/bin/bash
#SBATCH -t 30
pwd; hostname; date
echo "Running python on the server"
python3 helloworld.py
~~~

下面介绍一些其它常用选项. 长选项和短选项都是可用的, 短选项备注在括号中 (若存在).

| 选项                    |     默认值       |        描述                    |
|------------------------------------------------------------|:------------------------------|:--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `--time=<walltime> (-t <walltime>)` | 6 小时        | 运行任务的时间限制, 格式如下 [hours:]minutes[:seconds] 如 20, 01:20, 01:20:30   days-hours[:minutes][:seconds] 如 2-0, 1-5:20, 1-5:20:30   |
|`--cpus-per-task=<number> (-c <number>)`  | 1 | 每个任务所能使用的线程数、(逻辑)核数. 通常需要自己指定 |
|`--gres=gpu:[gpu_type:]:<number>`| 无 | 指定要用的 gpu 数量或类型, 如 `--gres=gpu:1`. 仅 `bigMem0, bigMem1` 上有 GPU 并有访问控制. GPU的性能详见[我们的Benchmark页面](../reference/index) |
| `--job-name=<jobname> (-J <jobname>) `                      | 命令名                                | 作业的名称, 有助于帮助你记录你正在运行什么作业.|
| `--output=<path>/<file pattern> (-o <path>/<file pattern>)`  |   slurm-%j.out   (%j = JobID)  | 指定标准输出文件的路径以及名字. |
| `--error=<path>/<file pattern> (-e <path>/<file pattern>) `  |   slurm-%j.out   (%j = JobID)  | 指定错误输出文件的路径以及名字. |
|`--nodes=<number> (-N <number>)`| 1 | 所需要分配的计算节点数.
|`--ntasks=<number> (-n <number>)`| 1 | 启动的任务数量, 几乎只有当你运行 MPI 程序时需要修改这个选项. |
|`--nodelist=<node_name_list> (-w <node_name_list>)` |  | 指定在哪台机器上运行, 可能的值为 `bigMem{0-3}`.|


{: .important }
> 资源调度系统不限制各个程序内存的使用量. 但请合理的使用有限的内存资源.
> 
> **作业的时间限制最长为7天**.
>
> 你不可以只申请 GPU 而不申请任何 CPU 的使用. 

<!-- <div style="background-color: #008080; color: white; ">
 <p style="margin: 10px">小练习</p>
 <div style="background-color: #BFDFDF; color: black">
  <p style="margin: 10px">以下哪个说法是正确的？</p>
  <table>
    <td><input type="radio" name="slurmquestion1" id="slurmq1opt1" /><label for="slurmq1opt1">用`srun -w bigMem0 nvidia-smi`可以查看`bigMem0`上的GPU情况</label></td>
    <td><input type="radio" name="slurmquestion1" id="slurmq1opt2" /><label for="slurmq1opt2">没有申请过资源，也可以直接`ssh bigMem0`或`ssh bigMem1`</label></td>
    <td><input type="radio" name="slurmquestion1" id="slurmq1opt3" /><label for="slurmq1opt3">可以在登陆节点编译完后再到计算节点上运行</label></td>
  </table>
  <p style="margin: 10px"><button onclick="window.alert(document.getElementById('slurmq1opt3').checked ? '正确, 因为我们的集群软件环境是一样的' : document.getElementById('slurmq1opt1').checked ? '错误, 必须加上`--gres`选项' : '错误, 你试试就知道了')">提交</button></p>
 </div>
</div> -->

{: .tip }
> 以下哪个说法是正确的？
> <ul class="example-question">
>    <li><input type="radio" name="slurmquestion1" id="slurmq1opt1" /><label for="slurmq1opt1" markdown="1">用 `srun -w bigMem0 nvidia-smi` 可以查看 `bigMem0` 上全部 GPU 的使用情况</label></li>
>    <li><input type="radio" name="slurmquestion1" id="slurmq1opt2" /><label for="slurmq1opt2" markdown="1">没有申请过资源，也可以直接 `ssh bigMem0` 或 `ssh bigMem1`</label></li>
>    <li><input type="radio" name="slurmquestion1" id="slurmq1opt3" /><label for="slurmq1opt3" markdown="1">可以在登陆节点编译完后再到计算节点上运行</label></li>
> </ul>
> <button onclick="window.alert(document.getElementById('slurmq1opt3').checked ? '正确, 因为我们的集群软件环境是一样的' : document.getElementById('slurmq1opt1').checked ? '错误, 必须加上`--gres`选项' : '错误, 你试试就知道了')">提交</button>



## 其他常用命令

- `sinfo`: 查看节点空余状态;
- `squeue`: 查看作业队列;
- `scancel`: 取消作业.

### `sinfo`

官方文档: <https://slurm.schedmd.com/sinfo.html>

`sinfo`命令报告分区和节点的状态.

~~~  bash
$ sinfo
HOSTNAMES  AVAIL  STATE  CPUS(Avail/Total)  GRES_USED
bigMem0    up     idle   64/64              gpu:tesla_t4:0(IDX:N/A)
bigMem1    up     mix    54/64              gpu:nvidia_a30:2(IDX:0-1)
bigMem2    up     mix    14/128             gpu:0
bigMem3    up     alloc  0/512              gpu:0
~~~

上述输出表示有四个计算节点, bigMem0 是 idle 即完全空闲的; bigMem1 是 mix, 表示有一部分核被用户使用了, 且GPU被占用了前两个; bigMem3 显示 alloc, 表示该计算节点的所有核都被占用了, 此时其他用户无法再申请那台机器上的资源. 

### `squeue` & `scancel`

官方文档: <https://slurm.schedmd.com/squeue.html>, <https://slurm.schedmd.com/scancel.html>

在等待你的程序执行的同时, 你可以通过 `squeue` 知道程序的状态. 例如, 在 `loginNode` 上列出所有正在队列中的作业:

~~~  bash
$ squeue
~~~

你会看到

~~~  bash
JOBID USER      NAME       ST END_TIME            NODELIST CPUS TRES_PER_N REQ_NODE
1865  mingli    cifar      R  2024-04-30T20:12:55 bigMem1  2    gres/gpu:1 bigMem1
1826  mcdu      interactiv R  2024-04-28T10:06:03 bigMem1  2    N/A
1874  xli       make       R  2024-04-28T22:52:19 bigMem2  112  N/A        bigMem2
1848  xyshan    interactiv R  2024-04-28T17:36:06 bigMem2  2    N/A        bigMem2
1789  yjzhang   dissociati R  2024-05-04T23:04:23 bigMem3  512  N/A        bigMem3
~~~

- `JOBID`: 作业编号.
- `USER`: 提交作业的用户名.
- `NAME`: 作业名称.
- `ST`: 作业状态. 从提交到完成的典型作业状态是: PENDING (PD) 和 RUNNING (R). 如果你没有看到你的作业, 那么很可能它已经完成了. 此外有时候你能看到的状态是 COMPLETING (CG), 表示作业已完成, 正在结束.
- `END_TIME`: 作业预计结束时间. **如果该作业正在运行中**, 这个时间表示该作业最晚可能的结束时间 (注意到所有作业都有运行时长限制, 如果不设置时长, 默认的运行时长是一天; 最多可申请的运行时长是七天.) **如果该作业正在排队中**, 这是 slurm 根据当前队伍的长度为你预估的结束时间, **没有任何保障你的任务一定会在这个时间点前结束**. 如果显示 N/A, 表明 slurm 暂时未安排你的任务, 无法预估何时结束.
- `NODELIST`: 作业所占用的节点.
- `CPUS`: 作业申请的核数. 你可以通过这一列推断某一个节点上还有多少空闲的核可用.
- `TRES_PER_N`: 用户申请节点时使用的GPU. 如果为空, 表示用户并没有使用.
- `REQ_NODE`: 用户申请的节点. 如果为空, 表示用户并没有指定节点.

如果你想中断正在运行的作业或取消排队, 请使用以下命令取消它:

~~~  bash
scancel <jobid>
~~~

{: .note }
> 取消正在运行的作业需要一分钟左右的时间 (根据系统已经分配的资源大小), 此时作业会进入 CG 状态.

### `scontrol`


提交作业后你会得到一个作业号, 以下用 `<jobid>` 表示. 如果忘了你的作业号, 且你的作业还没有运行结束, 可以通过 `squeue` 命令查看你的作业编号.

用以下命令查看你提交的作业状态的详细信息:

~~~  bash
scontrol show job <jobid>
~~~

用以下命令查看节点的状态的详细信息:

~~~  bash
scontrol show node <nodename>
~~~

例如

~~~  bash
$ scontrol show node bigMem0
NodeName=bigMem0 Arch=x86_64 CoresPerSocket=16
   CPUAlloc=28 CPUEfctv=64 CPUTot=64 CPULoad=3.78
   AvailableFeatures=(null)
   ActiveFeatures=(null)
   Gres=gpu:tesla_t4:4(S:0-1)
   NodeAddr=bigMem0 NodeHostName=bigMem0 Version=22.05.2
   OS=Linux 3.10.0-1160.36.2.el7.x86_64 #1 SMP Wed Jul 21 11:57:15 UTC 2021
   RealMemory=1030499 AllocMem=0 FreeMem=717245 Sockets=2 Boards=1
   State=MIXED ThreadsPerCore=2 TmpDisk=0 Weight=1 Owner=N/A MCS_label=N/A
   Partitions=partition
   BootTime=2023-09-11T13:27:35 SlurmdStartTime=2023-11-30T07:26:18
   LastBusyTime=2024-01-30T14:32:36
   CfgTRES=cpu=64,mem=1030499M,billing=64
   AllocTRES=cpu=28
   CapWatts=n/a
   CurrentWatts=0 AveWatts=0
   ExtSensorsJoules=n/s ExtSensorsWatts=0 ExtSensorsTemp=n/s
~~~

用以下命令查看系统中的预约信息:
~~~  bash
scontrol show reservation
~~~

另可参见 SLURM 官方文档对 `scontrol` 的介绍: <https://slurm.schedmd.com/scontrol.html>

## <a name="reservations"> 预约节点资源 </a>

你可能已经注意到了, 服务器上有很多用户在使用资源, 有时你提交作业后, `squeue` 会显示你的作业状态是 PD (Pending), 表示作业正在排队. 作业排队的原因有很多, 你可以通过 `scontrol show job <jobid>` 的方式查看具体原因, 在输出内容中, JobState=PENDING 后面会跟着一个 Reason, 显示作业未被执行的原因. 常见的作业未开始执行的原因是 Resources, 即你所申请的资源不可用. 比如, 你申请了 `bigMem1` 上32核的资源, 但当前已有一个用户使用了 `bigMem1` 上48核, 这时你的作业就会进入队列排队. 如果对排队的原因有所疑问, 请直接联系服务器管理员.

当你在 `loginNode` 上使用 `squeue` 命令时, 你可以看到 `END_TIME`, 对于正在运行的作业, 这个时间表示作业最晚可能结束的时间, 作业可能比这个时间更早结束, **但绝不会晚于这个时间点** (除非计算节点崩溃, 任务重新排队). 对于正在排队的作业, `END_TIME` 表示作业预计结束的时间, 并不保证一定会在这个时间点前结束, 且会根据队列的状态实时更新相应的估计. 所以, 如果你希望能在某个确切的时间点前完成任务, 请使用预约制度.

另一种常见的情况是出于测试程序和算法性能的需求, 你想要独占节点资源. 通常, 你可以在 `srun`/`salloc`/`sbatch` 的时候加上选项 `--exclusive`, 这保证了我们的作业独占这个节点. 下面是关于 `--exclusive` 的说明 (使用方式请参考[申请资源选项](#申请资源选项))

![slurm_exclusive](/guide/figure/slurm_exclusive.png)

如果当前有完全空闲 (IDLE) 的计算节点, 则你的作业可以立刻运行. 否则, 你的任务将在队列中排队. 在排队的过程中, 如果有其他用户希望不独占节点地运行任务, 出于计算资源最大化利用的考量, 他们可以插队运行他们的任务. 考虑最坏的情况下, 我们对你的任务最终开始运行的时间没有任何保障. 因此, 如果你对作业运行的时间有所需求, 我们同样建议使用预约制度.

预约节点资源就像在饭店里预定座位一样, 你可以预订从某个时间点开始到某个时间点结束, 只有你指定的一部分用户可以使用你指定的一部分节点. 一旦节点被预约, 则其他用户无法提交可能结束时间晚于预约开始时间的作业. 如果你需要预约节点, 请发邮件至[管理员邮箱](mailto:cash_admin@163.com). 邮件内容必须包括:

1. 预约开始时间 (精确到某一个小时，如北京时间2月1日上午9点) 和预约结束时间 (精确到某一个小时，如北京时间2月4日上午9点). 除非有特殊需求，否则预约时间不得超过七天.
2. 预约的节点名称, bigMem0, bigMem1, bigMem2 或 bigMem3. 除非有特殊需求，否则预约节点数不得超过一个.
3. 预约的核数, 如无特殊声明, 默认为预约节点上所有核.
4. 需要在这段时间内使用节点的用户名称, 用逗号分隔. 如: aduser1, aduser2, aduser3.
5. 使用节点的具体用途.

**预约条件**: 预约开始时间必须晚于当前节点正在运行的任务的最终结束时间, 请提前用 `squeue` 查看节点状态. 此外, 每一个被包含在上述用户列表中的用户每个月有1024核时的额度, 且预约次数不得超过3次. 若超出额度, 则需要提供导师知情且同意的证明.

例:

- 用户 aduser 申请1月7日9点-21点使用bigMem1:64核, 12小时, 若当前没有任务预计运行到1月7日9点, 则预约成功. 用户 aduser 申请1月14日9点-21点使用bigMem1:64核, 12小时, 预约不成功, 因为超出了该月使用额度.
- 用户 aduser 申请1月的每个周六使用bigMem1一小时, 管理员只能为她预约前三次, 因为第四次超出了该月使用额度.

发送邮件后, 管理员会及时和你联系, 告知预约是否成功. 预约成功后, 请在预约时间内用 SLURM 提交任务. 如果管理员在24小时内连续两次看到被预约的节点并没有在运行任何任务, 管理员有权取消你的预约. 若多次违约, 管理员有权取消你的预约资格.


## 接下来干嘛?

阅读 [关于服务器储存空间的规则](xfs-quota).

