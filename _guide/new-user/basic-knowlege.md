---
title: 什么是服务器集群? 集群基本使用方法?
nav_order: 1
parent: 快速开始
---

# 什么是服务器集群? 集群基本使用方法?

*Last modified: March 04, 2025*

对服务器集群一无所知? 在开始之前, 若你还没有服务器账号, 请你移步[我还没有服务器账号, 我该怎么做?](i-have-no-account.md) 先申请一个账号, 提交申请后需等待一定时间, 在此期间你可以先阅读这篇指南.

## 服务器集群的基本架构

服务器集群 (Server Cluster) 指的是多台服务器组成的计算环境, 这些服务器通过网络连接, 共同完成计算任务. 你可以把它想象成一个工厂, 其中每台服务器就是一名工人, 它们各自分工协作, 以更高效地完成任务. 通常, 我们使用服务器集群来运行复杂的计算任务, 例如科学计算, 人工智能训练, 大型数据分析等.

一个服务器集群通常由多个功能不同的节点组成, 每个节点承担不同的任务. 为了帮助新用户理解, 我们可以把整个集群类比成一个大型公司, 其中不同的节点对应着不同的角色.

### 登录节点（Login Node）

登陆节点是你进入服务器集群的入口, 你需要远程连接到这个节点, 之后才能提交任务到计算节点. 若你已经获得服务器账号, 想要在本地连接上服务器, 请参考[我得到了我的服务器账号, 我该怎么连接服务器?](how-can-i-connect.md).

在这里, 你可以:

#### 编辑代码

可以使用 nano, vim 等文本编辑器在终端中进行编辑, 也可以使用 VSCode 远程连接后直接打开脚本进行编辑. 请参考[如何使用 VSCode 连接到服务器, 以提高我的开发效率?](vscode.md).

#### 上传和下载文件

在登录节点上上传和下载文件是使用服务器集群的基本技能, 主要涉及 SCP(Secure Copy Protocol), rsync(remote sync)等方法. SCP 适用于传输单个文件或目录, rsync 适用于传输大文件, 增量同步.

#### 提交计算任务

在服务器集群上, 直接在登录节点运行计算任务是不允许的, 因为它只用于提交作业, 不会执行实际计算. 计算任务应该提交到计算节点, 由调度系统(如Slurm)分配资源并运行.

基本流程:

1. 编写作业脚本 (指定计算资源、运行命令等)
2. 提交作业 (系统会将作业加入任务队列)
3. 等待调度 (系统会根据资源情况运行作业)
4. 监控任务 (查看任务状态、输出日志)
5. 作业完成 (查看结果、下载数据)

{: .tip }
> 不要在登录节点上运行大型计算任务！
你不能在此直接进行大规模计算. 这里相当于公司的前台 + 办公区, 你可以在这里做准备工作, 但不会在这里完成所有任务.

#### 查询任务状态

在服务器集群上提交计算任务后, 你可以使用 Slurm 作业管理命令来查询任务的状态、资源使用情况以及错误日志.

### 计算节点 (Computational Node)

计算节点是专门用于运行计算任务的服务器, 它们的性能通常比登录节点更强大, 配备多个CPU核心、大量内存等. 相当于公司的生产车间,计算任务会被派发到这里执行.

使用方式:

- 首先你需要提交任务, 让作业调度系统 (如Slurm) 安排计算节点来运行它.
- 你可以查询你的任务在那个计算节点上运行.
- 若需要调试任务，你可以进入计算节点.

### 存储节点（Storage Node）

存储节点是服务器集群中的数据中心, 负责存储你的代码, 输入数据, 计算结果等. 详情请参考[关于服务器各用户储存空间的Quota](/server-management/guide/you-must/xfs-quota.md).

### 作业调度系统 (Job Scheduler)

服务器集群有多个用户, 为了公平合理地分配计算资源, 集群使用作业调度系统来管理任务. 你需要把任务交给调度系统 (我们的集群使用 SLURM), 它会根据资源情况排队并分配节点. 详细的使用方法请参考[如何使用SLURM在集群上运行程序](/server-management/guide/you-must/slurm/index.md).

## 使用服务器集群的基本步骤示例

### Step 1: 远程连接到集群

你可以使用终端或SSH工具远程连接到集群, 详情请参考[我得到了我的服务器账号, 我该怎么连接服务器?](how-can-i-connect.md).

``` bash
ssh <username>@10.88.3.90 -p 20001
```

### Step 2: 了解基本的Linux命令

服务器使用Linux操作系统, 所以你需要掌握一些基本的Linux命令. 详情请参考[服务器的基本操作?-Linux服务器的基本知识](/server-management/guide/knowledge/linux.md).

- `ls`  查看当前目录下的文件
- `cd`  进入某个目录
- `pwd`  查看当前所在的目录
- `cp`  复制文件
- `mv`  移动文件
- `rm`  删除文件

### Step 3: 提交计算任务

这一部分提供了在服务器上提交计算任务的实例, 可以快速上手，若需要更多信息，请参考[如何使用SLURM在集群上运行程序](/server-management/guide/you-must/slurm/index.md).

#### 1. 创建 Python 脚本

在服务器上新建 `matrix_multiply.py` 文件, 这里是使用 `vim` 在服务器环境中创建 Python 文件, 通过下面的操作可以由简单的命令直接创建文件. 若你已经学会用 VSCode 连接服务器, 也可以直接创建.

``` bash
vim matrix_multiply.py
```

然后按键盘上的 `i`, 并粘贴以下内容 (可按需调整矩阵大小):

``` python
import numpy as np
import time

# 调整矩阵维度
MATRIX_SIZE = 10000

# 生成随机矩阵
a = np.random.rand(MATRIX_SIZE, MATRIX_SIZE)
b = np.random.rand(MATRIX_SIZE, MATRIX_SIZE)

# 计时开始
start = time.time()

# 执行矩阵乘法
result = np.dot(a, b)

# 计算耗时
duration = time.time() - start
print(f"Matrix {MATRIX_SIZE}x{MATRIX_SIZE} multiplication done in {duration:.2f} seconds")
```

保存文件:  先按 `ESC`, 然后输入 `:wq` (保存并退出).

#### 2. 编写 Slurm 作业脚本

首先我们先确定使用的必要模块:

```bash
module avail
```

更多关于服务器上软件环境的信息, 请参考 [服务器上安装了哪些大家常用的软件](../software/index).

创建提交脚本 `submit_job.sh`:

```bash
vim submit_job.sh
```

粘贴以下配置, 注意要将模块的版本更改：

```bash
#!/bin/bash
#SBATCH --job-name=gpu_matrix      # 作业名称
#SBATCH --nodes=1                  # 使用1个节点
#SBATCH --ntasks-per-node=1        # 单任务单进程
#SBATCH --cpus-per-task=8          # 每个任务8核CPU
#SBATCH --gres=gpu:tesla_t4:1      # 申请1块T4显卡（适配bigMem0）
#SBATCH --time=00:15:00            # 超时设置15分钟
#SBATCH --output=%j.out        # 输出文件命名
#SBATCH --exclude=bigMem1,bigMem2,bigMem3  # 明确排除非GPU节点

# 加载环境模块
module purge
module load CUDA/11.8
module load Python/3.10.13

# 执行矩阵运算（启用GPU加速）
python3 matrix_multiply.py --use-gpu  # 需在代码中添加GPU支持
```

**保存文件**：`Ctrl+O` 回车 → `Ctrl+X`

#### 3. 提交与监控任务

提交作业:

``` bash
sbatch submit_job.sh
```

示例输出:

``` text
Submitted batch job 7460
```

#### 4. 查看运行结果

查看作业状态:

``` bash
squeue
```

任务完成后, 可以在 `任务ID.out` 文件里查看运行结果, 例如:

``` text
Matrix 10000x10000 multiplication done in 6.59 seconds
```