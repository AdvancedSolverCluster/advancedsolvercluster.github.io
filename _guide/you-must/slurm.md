---
title: 如何利用SLURM在集群上运行程序
nav_order: 1
parent: 使用须知
---

# 如何利用SLURM在集群上运行程序

服务器上已经有很多用户在运行程序了, 你**不可以**和其他人一起抢占资源 (最终导致炸服). 另外, 我们的登陆节点性能也不如计算节点好. 我们的服务器集群使用 SLURM, 一套自动化资源分配的作业调度工具, 帮助你提交作业到计算节点上运行. 当你的程序需要很长的运行时间或者很大的内存占用时, 请使用 slurm 提交程序.

![user-topology](/guide/figure/user-topology.png)

## 申请资源与提交作业

将你想要运行的一条或多条指令称为作业 (job). SLURM 提供了运行作业的三种方式:

- `srun`: 将你当前要运行的一条指令提交到计算节点上运行. 优点是最容易使用, 缺点是只能运行一行代码 (因此无法提前设置环境变量等). 如果你想要运行的命令一行不够, 比如需要在运行命令之前加载模块, 或者设置环境变量等, 可以用下面的 `salloc` 或 `sbatch`.
- `salloc`: 为需要实时处理的作业分配资源, 系统会为你分配一个或多个计算节点, 然后你可以登陆到计算节点上, 使用交互式命令行. 这一用法适用于需要互动处理的作业.
- `sbatch`: 提交作业脚本, 系统会为你分配一个或多个计算节点, 运行你的作业. 这一用法适用于放在后台慢慢跑的作业.

### `srun`

官方文档: <https://slurm.schedmd.com/srun.html>

直接在你要运行的程序前加一个 `srun`, slurm 就会自动帮你把这个程序放到可用的计算节点上运行. 比如, 原本需要运行 `python3 helloworld.py`, 现在就可以输入

~~~ bash
srun python3 helloworld.py
~~~

### `salloc`

官方文档: <https://slurm.schedmd.com/salloc.html>

`salloc`相当于向slurm申请计算资源, 然后直接登陆到计算节点上操作.

~~~
[yjzhang@loginNode ~]$ salloc
salloc: Granted job allocation 2984
salloc: Waiting for resource configuration
salloc: Nodes bigMem1 are ready for job
[yjzhang@loginNode ~]$ ssh bigMem1
[yjzhang@bigMem1 ~]$ exit
logout
Connection to 192.168.2.11 closed.
[yjzhang@loginNode ~]$ exit
exit
salloc: Relinquishing job allocation 2984
salloc: Job allocation 2984 has been revoked.
~~~
首先, 用 `salloc` 申请资源, 然后通过 `ssh` 登录到分配的计算节点上. 输入一次 `exit` 回退到登陆节点, 再输入一次 `exit` 将任务结束 (请务必记得结束任务, 避免占用不使用的资源).

**注意**: `salloc` 会创建一个新的bash环境, 因此你在登陆节点上加载的模块和设置的环境变量都需要重新加载和设置.

### `sbatch`

官方文档: <https://slurm.schedmd.com/sbatch.html>

可以把所有需要运行的命令写进一个脚本里, 然后通过 `sbatch` 提交. 脚本就是平时的 shell 脚本, 以 `#!/bin/bash` 开头. 例如:

~~~ bash
#!/bin/bash
# module load MATLAB # this line can be omitted because MATLAB is loaded by default
matlab -batch "testMatlab"
~~~

接下来, 用 `sbatch <shell script>` 提交作业, 其中 `<shell script>` 是你刚写的脚本名. 屏幕上会打印 `Submitted batch job ###`, 其中 `###` 是你的作业 id. 当作业结束后, 输出结果会打印到当前目录下的 `slurm-###.out`.

**注意**: `sbatch` 会继承你在登陆节点上加载的模块和设置的环境变量. 请注意计算节点上的 MPICH 环境可能和登陆节点不同 (如果未申请计算节点的GPU资源), 所以如果要用 MPICH, 请在 sbatch 脚本里先 `module unload MPICH`, 再 `module load MPICH`.

## 申请资源选项

在上述案例中, 无论是 `srun`, `salloc` 还是 `sbatch` 都默认你申请一个计算节点, 启动一个进程, 不使用GPU, 并有默认的运行时长上限. 如果你想要申请更多资源 (**比如你需要使用GPU, 就必须加上GPU选项!**), 或者指定一些运行设定, 都可以添加选项.

比如, 加 `-t 30` 表示申请运行30分钟的任务, 就直接把选项加在命令后面:

~~~ bash
srun -t 30 python3 helloworld.py
salloc -t 30
sbatch -t 30 test.sh
~~~

{: .important }
> 请注意，选项必须紧跟命令。
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
|`--nodes=<number> (-N <number>)`| 1 | 分配的节点数, 由于目前只有两个计算节点, 因此最大值为2.
|`--ntasks=<number> (-n <number>)`| 1 | 启动的进程数量, 当你运行MPI程序时需要修改这个选项. |
|`--cpus-per-task=<number> (-c <number>)`  | 1 | 每个进程使用的线程数(逻辑核数), 当你运行OpenMP程序时需要修改这个选项. |
|`--nodelist=<node_name_list> (-w <node_name_list>)` |  | 指定在哪台机器上运行, 可能的值为 `bigMem0`, `bigMem1` 或 `bigMem2`.|
|`--gres=gpu:[gpu_type:]:<number>`| 无 | 指定要用的 gpu 数量或类型, 如 `--gres=gpu:1` 不指定类型, 或 `--gres=gpu:tesla_t4:1`, `--gres=gpu:nvidia_a30:1`, `--gres=gpu:nvidia_geforce_gtx_3090:1`. 其中 `tesla_t4`表示 bigMem0 上的 GPU, `nvidia_a30` 表示 bigMem1 上的 GPU, `nvidia_geforce_gtx_3090` 表示 bigMem2 上的GPU. 目前只支持这三种类型的 GPU. GPU的性能详见[我们的Benchmark页面](../reference/index) |
| `--job-name=<jobname> (-J <jobname>) `                      | 命令名                                | 作业的名称, 有助于帮助你记录你正在运行什么作业.|
| `--output=<path>/<file pattern> (-o <path>/<file pattern>)`  |   slurm-%j.out   (%j = JobID)  | 指定标准输出文件的路径以及名字. |
| `--error=<path>/<file pattern> (-e <path>/<file pattern>) `  |   slurm-%j.out   (%j = JobID)  | 指定错误输出文件的路径以及名字. |
| `--time=<walltime> (-t <walltime>)` | 1 天        | 运行任务的时间限制, 格式如下 [hours:]minutes[:seconds] 如 20, 01:20, 01:20:30   days-hours[:minutes][:seconds] 如 2-0, 1-5:20, 1-5:20:30   |

<div style="background-color: #008080; color: white; ">
 <p style="margin: 10px">小练习</p>
 <div style="background-color: #BFDFDF; color: black">
  <p style="margin: 10px">以下哪个说法是正确的？</p>
  <p style="margin: 10px"><table>
    <td><input type="radio" name="slurmquestion1" id="slurmq1opt1" /><label for="slurmq1opt1">用`srun -w bigMem0 nvidia-smi`可以查看`bigMem0`上的GPU情况</label></td>
    <td><input type="radio" name="slurmquestion1" id="slurmq1opt2" /><label for="slurmq1opt2">没有申请过资源，也可以直接`ssh bigMem0`或`ssh bigMem1`</label></td>
    <td><input type="radio" name="slurmquestion1" id="slurmq1opt3" /><label for="slurmq1opt3">可以在登陆节点编译完后再到计算节点上运行</label></td>
  </table>
  </p>
  <p style="margin: 10px"><button onclick="window.alert(document.getElementById('slurmq1opt3').checked ? '正确, 因为我们的集群软件环境是一样的' : document.getElementById('slurmq1opt1').checked ? '错误, 必须加上`--gres`选项' : '错误, 你试试就知道了')">提交</button></p>
 </div>
</div>


## 其他常用命令

- `sinfo`: 查看节点状态;
- `squeue`: 查看作业队列;
- `scancel`: 取消作业.

### `sinfo`

官方文档: <https://slurm.schedmd.com/sinfo.html>

`sinfo`命令报告分区和节点的状态.

~~~  bash
$ sinfo
 PARTITION AVAIL  TIMELIMIT  NODES  STATE NODELIST                          GRES
partition*    up 7-00:00:00      1   idle bigMem0          gpu:tesla_t4:4(S:0-1)
partition*    up 7-00:00:00      1   idle bigMem1        gpu:nvidia_a30:4(S:0-1)
partition*    up 7-00:00:00      1   idle bigMem2  gpu:nvidia_geforce_gtx_3090:2
~~~

三个计算节点, bigMem0, bigMem1 和 bigMem2 状态是 idle 即完全空闲的 (如果显示 mix, 表示有一部分核被用户使用了; 如果显示 alloc, 表示该计算节点的所有核都被占用了, 此时其他用户无法再申请那台机器上的资源), **作业的时间限制最长为7天**, 以及三台机器上分别拥有的 GPU 卡数及型号.

### `squeue` & `scancel`

在等待你的程序执行的同时, 你可以通过`squeue`知道程序的状态. 例如, 以下命令列出所有用户名提交的作业:

~~~  bash
squeue -u <username>
~~~

你会看到

~~~  bash
  JOBID PARTITION     NAME     USER ST       TIME  NODES NODELIST(REASON)
    001    bigMem  python3  yjzhang PD       0:00     10 (PartitionNodeLimit)
    002    bigMem  python3  yjzhang  R       0:56      1 bigMem0
~~~

从提交到完成的典型作业状态是: PENDING (PD) 和 RUNNING (R). 如果你没有看到你的作业, 那么很可能它已经完成了.

如果你不想再运行作业, 请使用以下命令取消它:

~~~  bash
scancel <jobid>
~~~

## 测试性能

我们还可以利用 slurm 测试程序和算法的性能, 为此, 我们需要提交程序占用整个结点资源, 方法是在 sbatch 的时候加参数 `--exclusive`, 这保证了我们独占这个节点. 下面是关于 `--exclusive` 的说明
![slurm_exclusive](/guide/figure/slurm_exclusive.png)
