---
title: 申请资源选项
nav_order: 4
parent: slurm
grand_parent: 使用须知
---
# 申请资源选项
*Last modified: December 17, 2024*

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
|`--array=<index_list>`| 无 | 允许用户通过一次提交运行多个相似的作业, 常用于批量模拟、训练模型等. |

{: .important }
> 资源调度系统不限制各个程序内存的使用量. 但请合理的使用有限的内存资源.
>
> **作业的时间限制最长为7天**.
>
> 你不可以只申请 GPU 而不申请任何 CPU 的使用.

以下是一个典型的 sbatch 脚本示例，假设需要运行一个 Python 脚本并使用 GPU：

~~~ bash
#!/bin/bash
#SBATCH -J my_python_job        # 作业名称
#SBATCH -o logs/job-%j.out      # 标准输出文件路径
#SBATCH -e logs/job-%j.err      # 错误输出文件路径
#SBATCH -t 01:30:00             # 运行时间限制 (1小时30分钟)
#SBATCH -N 1                    # 所需节点数
#SBATCH -n 1                    # 启动的任务数量
#SBATCH -c 4                    # 每个任务所使用的线程数
#SBATCH --gres=gpu:1            # 分配1块GPU

# 显示一些作业信息
echo "Job ID: $SLURM_JOB_ID"
echo "Node List: $SLURM_JOB_NODELIST"
echo "Allocated GPUs: $CUDA_VISIBLE_DEVICES"
echo "Start Time: $(date)"

# 激活 Python 环境 (如果需要)
source ~/my_python_env/bin/activate

# 运行 Python 脚本
python3 helloworld.py

# 打印结束时间
echo "End Time: $(date)"
~~~

在上面这个示例中,

- `#SBATCH -o logs/job-%j.out` 中的 `%j` 是一个 **占位符**, 表示 **当前作业的作业 ID (Job ID)**. 其他占位符的介绍,参见[SLURM官方文档 - Filename Pattern](https://slurm.schedmd.com/sbatch.html#SECTION_FILENAME-PATTERN).
- `$SLURM_JOB_ID`, `$SLURM_JOB_NODELIST` 和 `$CUDA_VISIBLE_DEVICES` 是 sbatch 里可用的**环境变量**. 其它可用的环境变量, 参见[SLURM官方文档 - Input Environment Variables](https://slurm.schedmd.com/sbatch.html#SECTION_INPUT-ENVIRONMENT-VARIABLES).



### 详细解释：
- **`-o` 选项**: 指定标准输出文件的保存路径和文件名。
- **`%j`**:
  - Slurm 会在运行时将 `%j` 替换为该作业的唯一标识符，也就是 **Job ID**。
  - 每个作业提交到队列时，Slurm 分配一个唯一的 ID，用来追踪和管理这个作业。
- **`logs/job-%j.out`**:
  - 如果作业的 Job ID 是 `12345`，那么运行时这个文件路径会被解析为 `logs/job-12345.out`。

### 使用场景：
1. **防止文件覆盖**:
   - 不同作业的输出文件会有不同的 Job ID，因此不会覆盖之前的文件。
2. **方便调试和记录**:
   - 可以通过 Job ID 快速定位相关的输出文件，便于检查作业的日志信息。

### 类似的占位符：
Slurm 提供了一些其他常用占位符，可以用于动态生成文件名或路径：
- **`%j`**: 作业的 Job ID。
- **`%x`**: 作业名称。
- **`%N`**: 分配的第一个节点名称。
- **`%u`**: 用户名。
- **`%t`**: 作业步骤 ID。
- **`%A`**: 作业阵列主作业 ID（如果是作业阵列）。
- **`%a`**: 作业阵列任务 ID。




{: .tip }
> 以下哪个说法是正确的？
> <ul class="example-question">
>    <li><input type="radio" name="slurmquestion1" id="slurmq1opt1" /><label for="slurmq1opt1" markdown="1">用 `srun -w bigMem0 nvidia-smi` 可以查看 `bigMem0` 上全部 GPU 的使用情况</label></li>
>    <li><input type="radio" name="slurmquestion1" id="slurmq1opt2" /><label for="slurmq1opt2" markdown="1">没有申请过资源，也可以直接 `ssh bigMem0 -p 10888`</label></li>
>    <li><input type="radio" name="slurmquestion1" id="slurmq1opt3" /><label for="slurmq1opt3" markdown="1">可以在登陆节点编译完后再到计算节点上运行</label></li>
> </ul>
> <button onclick="window.alert(document.getElementById('slurmq1opt3').checked ? '正确, 因为我们的集群软件环境是一样的' : document.getElementById('slurmq1opt1').checked ? '错误, 必须加上`--gres`选项' : '错误, 你试试就知道了')">提交</button>

