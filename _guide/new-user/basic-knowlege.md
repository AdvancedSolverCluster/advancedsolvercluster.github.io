# 什么是服务器集群? 集群基本使用方法? (面向新用户)
*Last modified: February 25, 2025*

对服务器集群一无所知在开始之前, 若你还没有服务器账号, 请你移步[我还没有服务器账号, 我该怎么做?](i-have-no-account.md)先申请一个账号, 提交申请后需等待一定时间, 在此期间你可以先阅读这篇指南. 

## 服务器集群的基本架构

服务器集群(Server Cluster)指的是多台服务器组成的计算环境, 这些服务器通过网络连接, 共同完成计算任务. 你可以把它想象成一个工厂, 其中每台服务器就是一名工人, 它们各自分工协作, 以更高效地完成任务. 通常, 我们使用服务器集群来运行复杂的计算任务, 例如科学计算、人工智能训练、大型数据分析等. 

一个服务器集群通常由多个功能不同的节点组成, 每个节点承担不同的任务. 为了帮助新用户理解, 我们可以把整个集群类比成一个大型公司, 其中不同的节点对应着不同的角色.

### 登录节点（Login Node）
登陆节点是你进入服务器集群的入口, 你需要远程连接到这个节点, 之后才能提交任务到计算节点. 若你已经获得服务器账号, 想要在本地连接上服务器, 请参考[我得到了我的服务器账号, 我该怎么连接服务器?](how-can-i-connect.md)

在这里, 你可以: 
#### 编辑代码
可以使用nano、vim等文本编辑器在终端中进行编辑, 也可以使用VSCode远程连接后直接打开脚本进行编辑. 请参考[如何使用 VSCode 连接到服务器, 以提高我的开发效率?](vscode.md)

#### 上传和下载文件
在登录节点上上传和下载文件是使用服务器集群的基本技能, 主要涉及SCP(Secure Copy Protocol)、rsync(remote sync)等方法. SCP适用于传输单个文件或目录, rsync适用于传输大文件、增量同步. 

#### 提交计算任务
在服务器集群上, 直接在登录节点运行计算任务是不允许的, 因为它只用于提交作业, 不会执行实际计算. 计算任务应该提交到计算节点, 由调度系统(如Slurm)分配资源并运行.

基本流程:
1.	编写作业脚本(指定计算资源、运行命令等)
2.	提交作业(系统会将作业加入任务队列)
3.	等待调(系统会根据资源情况运行作业)
4.	监控任务(查看任务状态、输出日志)
5.	作业完成(查看结果、下载数据)

{: .tip }
> 不要在登录节点上运行大型计算任务！
你不能在此直接进行大规模计算. 这里相当于公司的前台+办公区, 你可以在这里做准备工作, 但不会在这里完成所有任务. 

#### 查询任务状态
在服务器集群上提交计算任务后, 你可以使用Slurm作业管理命令来查询任务的状态、资源使用情况以及错误日志. 


### 计算节点 (Computational Node)
计算节点是专门用于运行计算任务的服务器, 它们的性能通常比登录节点更强大, 配备多个CPU核心、大量内存等. 相当于公司的生产车间,计算任务会被派发到这里执行.

使用方式: 
- 首先你需要提交任务, 让作业调度系统(如Slurm)安排计算节点来运行它.
- 你可以查询你的任务在那个计算节点上运行.
- 若需要调试任务，你可以进入计算节点.

{: .tip }
> 每个用户不能独占计算节点, 需要遵守资源分配规则. 

### 存储节点（Storage Node）
存储节点是服务器集群中的数据中心, 负责存储你的代码、输入数据、计算结果等. 详情请参考[关于服务器各用户储存空间的Quota](/server-management/guide/you-must/xfs-quota.md)


### 作业调度系统 (Job Scheduler)
服务器集群有多个用户, 为了公平合理地分配计算资源, 集群使用作业调度系统来管理任务. 你不能直接选择在哪个节点上运行任务, 而是要把任务交给调度系统(我们的集群使用SLURM), 它会根据资源情况排队并分配节点. 详细的使用方法请参考[如何使用SLURM在集群上运行程序](/server-management/guide/you-must/slurm/index.md)


## 使用服务器集群的基本步骤示例
### Step 1 : 远程连接到集群
你可以使用终端或SSH工具远程连接到集群，详情请参考[我得到了我的服务器账号, 我该怎么连接服务器?](how-can-i-connect.md)
~~~ bash
ssh <username>@10.88.3.90 -p 20001
~~~

### Step 2 : 了解基本的Linux命令
服务器使用Linux操作系统, 所以你需要掌握一些基本的Linux命令. 详情请参考[服务器的基本操作?-Linux服务器的基本知识](/server-management/guide/knowledge/linux.md)

- `ls`  查看当前目录下的文件
- `cd`  进入某个目录
- `pwd`  查看当前所在的目录
- `cp`  复制文件
- `mv`  移动文件
- `rm`  删除文件

### Step 3 : 上传和下载文件
你可能会需要从本地和服务器之间上传和下载文件, 下面列举一些常见的方法: 

1. 上传单个文件到服务器
~~~ bash
scp my_data.txt your_username@server_address:/home/your_username/
~~~
- `my_data.txt`： 本地文件
- `your_username@server_address`：你的服务器账户
- `/home/your_username/`：服务器上存放文件的目录(你可以更改目标路径)

2. 上传整个文件夹到服务器
~~~ bash
scp -r my_project your_username@server_address:/home/your_username/
~~~
- `-r`选项表示递归上传(用于目录)
- `my_project`: 本地文件夹的名称
3. 从服务器下载文件到本地
~~~bash
scp -r your_username@server_address:/home/your_username/results/ /Users/your_local_path/
~~~
- `/Users/your_local_path/`: 本地文件夹路径

若不设置具体路径，文件夹将下载到当前目录(`.`):

~~~ bash
scp your_username@server_address:/home/your_username/output.txt .
~~~

4. 使用rsync上传文件
~~~ bash
rsync -av my_data.txt your_username@server_address:/home/your_username/
~~~
- `-a`：保持文件权限、时间戳等信息
- `-v`：显示详细信息

5. 使用rsync上传目录
~~~ bash
rsync -av my_project/ your_username@server_address:/home/your_username/my_project/
~~~

6. 使用rsync下载文件
~~~ bash
rsync -av your_username@server_address:/home/your_username/output.txt ./
~~~

7. 使用rsync下载目录
~~~ bash
rsync -av your_username@server_address:/home/your_username/results/ ./local_results/
~~~

### Step 4 ： 提交计算任务
详情请参考[如何使用SLURM在集群上运行程序](/server-management/guide/you-must/slurm/index.md)

任务提交通常需要写一个任务脚本（Job Script），例如一个简单的Slurm脚本`job.slurm`：
~~~ bash
#!/bin/bash
#SBATCH --job-name=my_job        # 任务名称
#SBATCH --nodes=1                # 需要的计算节点数
#SBATCH --ntasks=4               # 需要的CPU核心数
#SBATCH --time=01:00:00          # 运行时间（1小时）
#SBATCH --output=output.txt      # 输出文件

python my_script.py              # 运行Python程序
~~~

然后，使用sbatch命令提交任务：
~~~ bash
sbatch job.slurm
~~~

任务提交后，你可以用squeue命令查看任务的运行状态：
~~~ bash
squeue -u your_username
~~~

如果你的任务还没有运行，可能是服务器正在排队等待资源。

### Step 5 ： 查看计算结果
任务完成后，你可以在指定的输出文件`output.txt`中查看输出结果，也可以用`cat output.txt`或者`less output.txt`命令查看。

如果任务出错，可以查看`slurm-*.out`文件（任务的日志）。