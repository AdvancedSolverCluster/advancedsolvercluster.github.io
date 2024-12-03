---
title: sinfo, squeue, scancel, scontrol 等其它 slurm 命令
nav_order: 5
parent: slurm
grand_parent: 使用须知
---

# 常用 SLURM 命令

- `sinfo`: 查看节点空余状态，显示可用分区和节点信息。
- `squeue`: 查看作业队列，显示当前作业状态。
- `scancel <job_id>`: 取消指定作业。
- `scontrol`: 管理作业和集群配置的多功能命令。常用子命令包括：
  - `scontrol show job <job_id>`: 查看指定作业的详细信息。
  - `scontrol show node <node_name>`: 查看指定节点的详细状态信息。
  - `scontrol hold <job_id>`: 暂停一个作业，使其不会执行。
  - `scontrol release <job_id>`: 释放暂停的作业，使其可以继续执行。
  - `scontrol update JobId=<job_id> <parameters>`: 更新作业的某些属性，例如时间限制。

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
JOBID USER    NAME        ST CPUS GPUS END_TIME         NODELIST    REQ_NODES
4902  qsxu    vasp_job    R  48   N/A  2024/09/04 17:43 bigMem[2-3] bigMem3
4898  qsxu    vasp_job    R  48   N/A  2024/09/04 17:29 bigMem[2-3] bigMem3
4897  qsxu    vasp_job    R  48   N/A  2024/09/04 17:29 bigMem[2-3] bigMem3
4896  qsxu    vasp_job    R  48   N/A  2024/09/04 17:29 bigMem[2-3] bigMem3
4793  yjzhang dissociatio R  256  N/A  2024/09/07 01:39 bigMem3     bigMem3
~~~

- `JOBID`: 作业编号.
- `USER`: 提交作业的用户名.
- `NAME`: 作业名称.
- `ST`: 作业状态. 从提交到完成的典型作业状态是: PENDING (PD) 和 RUNNING (R). 如果你没有看到你的作业, 那么很可能它已经完成了. 此外有时候你能看到的状态是 COMPLETING (CG), 表示作业已完成, 正在结束.
- `CPUS`: 作业申请的核数. 你可以通过这一列推断某一个节点上还有多少空闲的核可用.
- `GPUS`: 用户申请节点时使用的GPU. 如果为N/A, 表示用户并没有使用.
- `END_TIME`: 作业预计结束时间. **如果该作业正在运行中**, 这个时间表示该作业最晚可能的结束时间 (注意到所有作业都有运行时长限制, 如果不设置时长, 默认的运行时长是一天; 最多可申请的运行时长是七天.) **如果该作业正在排队中**, 这是 slurm 根据当前队伍的长度为你预估的结束时间, **没有任何保障你的任务一定会在这个时间点前结束**. 如果显示 N/A, 表明 slurm 暂时未安排你的任务, 无法预估何时结束.
- `NODELIST`: 作业所占用的节点.
- `REQ_NODE`: 用户申请的节点. 如果为空, 表示用户并没有指定节点.

如果你想中断正在运行的作业或取消排队, 请使用以下命令取消它:

~~~  bash
scancel <jobid>
~~~

{: .note }
> 有时, 取消正在运行的作业需要较长的时间 (尤其是 I/O 密集型作业), 此时作业会进入 CG 状态.

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

~~~  text
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