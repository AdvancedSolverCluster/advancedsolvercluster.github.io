# 在服务器上运行程序及提交作业

*May 25, 2022, [Jingyu Liu](mailto:381258337@qq.com), [Yuejia Zhang](mailto:yuejiazhang21@m.fudan.edu.cn), [Xiang Li](mailto:646873166@qq.com)*

<!-- todo: 写一个综述, 服务器上运行程序和本地有什么不同. 1是只运行程序的话实际上在loginNode上运行了程序, 2是什么时候要使用slurm到其他地方运行程序(可以使用我们的user-topology.png配图) -->

我有理由相信, 当你点开这篇文档时, 大概是被要求 "去服务器上跑一下代码". 那么你是否想过, 服务器上运行程序和本地有什么不同?

对程序自身而言, 这并没有什么不同 (我并不觉得程序会知道他自己在哪里). 但是对用户而言, 我提醒你注意下面两件事

1. 只运行程序 (后面会解释这句话是什么意思) 的话实际上在loginNode上运行了程序.

2. 当你的程序需要很长的运行时间或者很大的内存占用时, 请使用 slurm 提交程序, 它将保证你的程序会在其他地方运行. 下面的图片说明了这件事.
![user-topology](guide/figure/user-topology.png)

3. 请检查代码, 形如 `system("pause")` 之类的句子不应当出现在服务器上的代码中, 因为它不适用于 Linux.

## 使用 module

我们在服务器上提供了很多软件和软件包供使用. 这里核心的命令是 `module`.
我们只列出一些常用的命令.

`module avail` 查看服务器上已有的软件.

`module load <name>` 加载要用的 module, 例如用 `module load MATLAB` 加载MATLAB.

`module unload <name>` 卸载 module.

`module list` 列出当前所用 module.

## 常用软件使用

### Python

`python filename.py`
  
NEW! <a class="one" href="python-tensorflow-pytorch"> Python Tensorflow + PyTorch 安装教程 </a>

### C/C++, 包括 CUDA 程序, MPI 程序

gcc 和 g++ 是最常见的 c&c++ 编译器.当你想要运行 c 或 c++ 的代码时,首先需要用编译器编译. 对于最基本的运行 c++ 程序的命令,只需进入程序文件所在位置,在命令行输入

```bash
gcc <input_file_name> -o <output_file_name>
```

例如 `gcc helloworld.c -o test_hello_world`, 就能在当前路径下找到一个新的可执行文件 `test_hello_world`. 在当前路径命令行输入 `./<output_file_name>`, 就能得到程序的输出结果啦.

对于 c++ 程序, 以上命令可以改为 `g++ <input_file_name> -o <output_file_name>`. 对于更复杂的编译命令, 可以自行查找 gcc 和 g++ 的参数文档.

如果你想要在服务器上调试代码,可以考虑使用 GDB 工具. 在编译的时候, 加上参数 `-g`, 例如 `gcc -g test.c -o test`, 然后命令行输入 `gdb <filename>`, 对应上面例子则为 `gdb test`, 你就进入了 GDB 调试界面,按 `q` 即可退出. 常见的命令有:

- `r` : 从头开始运行代码.
- `b <num>` : 列出 num 所在行开始的代码.
- `b <num>` : 在程序第 num 行打断点.
- `n` : 单步运行.
- `c` : 继续运行.
- `display <var_name>` : 跟踪查看变量 var_name, 每次停下都会显示.

除了在服务器上调试, 也可以通过在 VS Code 上使用 `remote ssh` 连接到服务器上之后进行调试. 一般要求安装插件 C/C++. 之后调试办法有很多,简单的可以使用 `code runner` 插件一键调试, 也可以自行配置 json文件. 具体方法可以根据自己需求自行查阅.

### MATLAB

- 方法一: 直接使用 (无图形化界面)
  首先用 `module load MATLAB` 加载 MATLAB, 输入 `matlab` (在哪个目录启动的 MATLAB, 启动后的默认工作目录就在哪里) , 然后输入对应的文件名即可 (不要加 `.m`) , 用 `exit` 退出. 可以用 `matlab --help` 查看更详细的说明.
- 方法二: 利用 X11 Forwarding 打开图形化界面

  (1) 安装 MobaXterm (如已安装可以跳过这一步). 进入 <https://mobaxterm.mobatek.net/download-home-edition.html>, 选择 `Install edition` 进行下载安装.

  (2) 打开 MobaXterm, 点击 `Session`, 选择 `SSH`, 接下来填入 `Remote host`, `specify username`, `Port`, 点击下方 `Advanced SSH Settings` 的选项面板, 在 `Use Private Key` 这一栏里选择自己的 private key, 最后连接到服务器.

  (3) 在现在的 MobaXterm 页面输入 `matlab` 即可打开MATLAB图形化界面.

### Intel OneAPI Toolkit

Intel OneAPI Toolkit 使用一流的编译器, 性能库, 框架以及分析和调试工具在 CPU 和 XPU 上分析和优化高性能, 跨架构应用程序. 我们的服务器上安装了 Base Toolkit 和 HPC Toolkit, 包含 icc compiler, debugger, mkl 数学库, intel MPI, vtune 等软件, 请参阅官网查看完整软件列表及使用方法.

要使用 Intel OneAPI Toolkit, 首先在命令行中运行

```bash
module use /opt/intel/oneapi/modulefiles
```

然后再使用`module avail`, 你会看到可用模块中新添了所有 Intel 提供的模块, 这时你可以加载你需要用的模块.

## 如何利用SLURM在集群上运行程序

服务器上已经有很多用户在运行程序了, 你**不可以**和其他人一起抢占资源 (最终导致炸服). 所幸的是, 服务器使用 slurm, 其提供了一套自动化资源分配的作业调度工具, 尝试避免被炸. 想要入门 slurm, 需要掌握以下六个命令:

- `sinfo`: 查看节点状态;
- `srun`: 实时交互式运行作业, 优点是最容易使用, 缺点是只能运行一行代码(因此无法提前设置环境变量等);
- `salloc`: 为需要实时处理的作业分配资源, 典型的用法是启动一个shell, 适用于需要互动处理的作业;
- `sbatch`: 提交作业脚本, 适用于放在后台慢慢跑的作业;
- `squeue`: 查看作业队列;
- `scancel`: 取消作业.

### `sinfo`

官方文档: <https://slurm.schedmd.com/sinfo.html>

`sinfo`命令报告分区和节点的状态, 分区可能处于 UP, DOWN 或 INACTIVE 状态. UP 状态意味着一个分区将接受新的提交并且作业将被调度. 节点也可以处于各种状态, 请参考官方手册.

``` bash
$ sinfo
PARTITION  AVAIL  TIMELIMIT  NODES  STATE NODELIST
partition*    up 3-00:00:00      2   idle bigMem[0-1]
```

表示集群中现在有一个分区叫partition, 是可用的, **时间限制默认为1天(可以手动设置为最多3天)**, 里面有两个计算节点, 状态是完全空闲的 (如果显示 mix, 表示有任务正在运行, 也没关系), 两个计算节点分别是 bigMem0 和 bigMem1.

### `srun`

官方文档: <https://slurm.schedmd.com/srun.html>

直接在你要运行的程序前加一个 `srun`, slurm 就会自动帮你把这个程序放到可用的计算节点上运行. 比如, 原本需要运行 `python3 helloworld.py`, 现在就可以输入

```bash
srun python3 helloworld.py
```

可以用`-w`指定在哪台机器上运行. 如,

```bash
srun -w bigMem1 python3 helloworld.py
```

可以用`--gres=gpu:`指定要用的 gpu 数量或类型. 如,

```bash
nvcc test.cu -o testcu
srun --gres=gpu:1 ./testcu #不指定类型
srun --gres=gpu:nvidia_geforce_gtx_1080_ti:1 ./testcu
srun --gres=gpu:tesla_t4:1 ./testcu
srun --gres=gpu:nvidia_a30:1 ./testcu
```

其中 `nvidia_geforce_gtx_1080_ti` 表示 loginNode 上的GPU, `tesla_t4`表示 bigMem0 上的 GPU, `nvidia_a30` 表示 bigMem1 上的 GPU. 目前只支持这三种类型的 GPU.

如果你想要运行的命令一行不够, 比如需要在运行命令之前加载模块, 或者设置环境变量等, 可以用以下两种方法: `salloc` 或 `sbatch`.

### `salloc`

官方文档: <https://slurm.schedmd.com/salloc.html>

`salloc`相当于向slurm申请计算资源, 然后直接登陆到计算节点上操作.

``` bash
$ salloc
salloc: Granted job allocation 51
$ srun --jobid=51 --pty /bin/bash
$ scancel 51
salloc: Job allocation 51 has been revoked.
```

首先, 用 `salloc` 申请资源, 然后用 `srun --jobid=<id> --pty /bin/bash` 登录到相应的节点上. 所有任务完成后, 记得用 `scancel` 结束任务.

### `sbatch`

官方文档: <https://slurm.schedmd.com/sbatch.html>

可以把所有需要运行的命令写进一个脚本里, 然后通过 `sbatch` 提交. 脚本就是平时的 shell 脚本, 以 `#!/bin/bash` 开头. 例如:

```bash
#!/bin/bash
module use /opt/intel/oneapi/modulefiles
module load mpi
mpirun -n 10 ./testmpi
```

或

```bash
#!/bin/bash
module load MATLAB
matlab -batch "testMatlab"
```

接下来, 用 `sbatch <shell script>` 提交作业, 其中 `<shell script>` 是你刚写的脚本名. 屏幕上会打印 `Submitted batch job ###`, 其中 `###` 是你的作业 id. 当作业结束后, 输出结果会打印到当前目录下的 `slurm-###.out`.

### `squeue` & `scancel`

在等待你的程序执行的同时, 你可以通过`squeue`知道程序的状态. 例如, 以下命令列出所有用户名提交的作业:

``` bash
squeue -u <username>
```

你会看到

``` bash
  JOBID PARTITION     NAME     USER ST       TIME  NODES NODELIST(REASON)
    001    bigMem  python3  yjzhang PD       0:00     10 (PartitionNodeLimit)
    002    bigMem  python3  yjzhang  R       0:56      1 bigMem0
```

从提交到完成的典型作业状态是: PENDING (PD) 和 RUNNING (R). 如果你没有看到你的作业, 那么很可能它已经完成了.

如果你不想再运行作业, 请使用以下命令取消它:

``` bash
scancel <jobid>
```

**The rest of the document may be a little difficult for beginners, you can skip it in the first reading.**

## Advanced usage of `sbatch`

The usual way to allocate resources and execute a job is to write a batch script and submit them to SLURM with the `sbatch` command. The batch script is a shell script consisting of two parts: resources requests and job steps. Resources requests are specifications for number of nodes needed to execute the job, time duration of the job etc. Job steps are user's tasks that must be executed. The resources requests and other SLURM submission options are prefixed by `#SBATCH` directives and must precede any executable commands in the batch script.

Below is an example of sbatch script:

```bash
#!/bin/bash
#SBATCH --job-name=python_job_test    # Job name
#SBATCH --nodes=1                     # Number of nodes to use
#SBATCH --ntasks=1                    # Number of tasks (MPI processes)
#SBATCH --cpus-per-task=1             # Number of threads (logical cores) per task (OPENMP)
#SBATCH --time=00:05:00               # Time limit hrs:min:sec
#SBATCH --output=python_%j.log        # Standard output and error log
pwd; hostname; date
echo "Running python on the server"
python3 helloworld.py
```

where `helloworld.py` is just reading the local file `helloworld.txt` and print out the content.

```python
with open("helloworld.txt", "r") as f:
    s = f.readline()
    print(s)
```

Run sbatch test.sbatch and see the log file.

``` bash
[yjzhang@loginNode ~]$ sbatch test.sbatch
Submitted batch job 235
[yjzhang@loginNode ~]$ cat python_235.log 
/home/yjzhang
bigMem0
2021年 12月 15日 星期三 13:39:07 CST
Running python on the server
Hello File!
```

The following table describes the most common or required allocation and submission options that can be defined in a batch script (short options are listed in parentheses):

| sbatch option                                              |          default value         |                                                                                       description                                                                                      |
|------------------------------------------------------------|:------------------------------|:--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
|   --nodes=\<number> (-N \<number>)                            | 1                              | Number of nodes for the allocation                                                                                                                                                     |
|   --ntasks=\<number> (-n \<number>)                           | 1                              | Number of tasks (MPI processes). Can be omitted if --nodes and --ntasks-per-node are given                                                                                             |
|   --ntasks-per-node=\<num>                                  | 1                              | Number of tasks per node. If keyword omitted the default value is  used, but there are still 48 CPUs available per node for current  allocation (if not shared)                        |
|   --cpus-per-task=\<number> (-c \<number>)                   | 1                              | Number of threads (logical cores) per task. Used for OpenMP or hybrid jobs                                                                                                             |
|   --output=\<path>\/\<file pattern> (-o \<path>\/\<file pattern>)  |   slurm-%j.out   (%j = JobID)  | Standard output file                                                                                                                                                                   |
|   --error=\<path>\/\<file pattern> (-e \<path>\/\<file pattern>)   |   slurm-%j.out   (%j = JobID)  | Standard error file                                                                                                                                                                    |
|   --time=\<walltime> (-t \<walltime>)                         | 3 days        | Requested walltime limit for the job; possible time formats are:     [hours:]minutes[:seconds] e.g. 20, 01:20, 01:20:30   days-hours[:minutes][:seconds] e.g. 2-0, 1-5:20, 1-5:20:30   |
|   --partition=\<name> (-p \<name>)                         | bigMem                         | Partition to run the job                                                     |
|   --job-name=\<jobname> (-J \<jobname>)                       | job script's name                                   | Job name

To see more examples of `sbatch`, refer to the below websites:

1. <https://help.rc.ufl.edu/doc/Annotated_SLURM_Script>
2. <https://help.rc.ufl.edu/doc/Sample_SLURM_Scripts>
3. <https://wiki.umiacs.umd.edu/umiacs/index.php/SLURM/JobSubmission>
