---
title: 软件环境
nav_order: 4
has_children: true
has_toc: false
---


# 如何查看服务器上有哪些软件？
*Last modified: December 22, 2024*

服务器在默认情况下会为你提供一个基础的软件环境，其中包括 GCC 11.4.0 编译器和 Python 3.10。但是，服务器并不会自动加载额外的软件或不同版本的工具。如果你需要使用其他的软件包或不同版本的编译器、库等，你可以使用核心命令 `module` 来加载和管理这些软件环境。

| 命令                   | 作用                               |
|------------------------|------------------------------------|
| `module av`              | 查看系统中可用的软件               |
| `module help`            | 查看具体软件的信息                 |
| `module add` / `load`    | 加载环境变量                       |
| `module rm` / `unload`   | 卸载环境变量                      |
| `module list`            | 显示用户已加载的环境变量            |
| `module swap` / `switch` | 替换环境变量                   |
| `module purge`           | 卸载当前 shell 环境下的所有环境变量 |


用 `module avail` 查看服务器上已安装的软件. (缩写 `module av`)

~~~ text
aduser@loginNode:~$ module avail
---------------------------- /etc/environment-modules/modules ----------------------------
CUDA/11.8  CUDA/12.3  Elan/3.1.1  graphviz/12.2.0  hpctoolkit  Ruby/3.3.5  Rust/1.82.0

--------------------------------- /software/modulefiles ----------------------------------
AMD-AOCL      fftw/3.3.10-gcc11.4.0-mpich4.2.0-double  LAPACK/3.11.0    MPI/OpenMPI/5.0.6  petsc/3.21.2    Python/3.12.2    texlive/2023
anaconda3     hdf5/1.14.4.2                            MATLAB/R2023b    MPICH/4.2.0        Python/3.8.12   R/4.2.2          vasp/6.4.3
CMake/3.31.0  Intel-toolset                            MPI/MPICH/4.2.0  OpenBLAS/0.3.26    Python/3.10.13  ScaLAPACK/2.2.0

Key:
modulepath
~~~

{: .tip }
> 这里列出的都是可以加载的软件环境, 在你的命令行中你可以看到已被加载的软件背景有阴影.
>
> 上下两部分的区别在于, `/etc/environment-modules/modules` 底下的 modules 仅对本节点适用, 而 `/software/modulefiles` 底下的 modules 对所有计算节点通用.
>
> 因此, 如果你需要用 slurm 提交任务, 我们建议加载 `/software/modulefiles` 底下的 modules, 或者根据你要提交任务的机器拥有的本地 modules 在 sbatch 脚本中加载对应的 module.

{: .warning }
> Intel-toolset 仅可用于使用了Intel芯片的服务器, AMD-AOCL 仅可用于使用了AMD芯片的服务器.
> 

{: .warning }
> 使用 MPI/MPICH/4.2.0 而不要使用 MPICH/4.2.0. 我们将会在某个时候删除 MPICH/4.2.0 这一条.
> 

可以通过 `module load <name>` 加载要用的 module, 例如用 `module load LAPACK/3.11.0` 加载 LAPACK. 如果 module 已加载, 不会重新加载.

可以通过 `module unload <name>` 卸载 module. 如果 module 未被加载, 不会报错.

`module list` 列出当前所用 module.

## 当前服务器上提供的软件环境（持续更新）
- Python
  - [Tensorflow + Pytorch](python/python-tensorflow-pytorch)
  - [Jupyter Notebook](python/python-jupyter-notebook)
- [GCC/GDB](gcc-gdb)
- [MATLAB](MATLAB)
- [R](R)
- [Intel OneAPI Toolkit](intel)

{: .tip }
> **我想用的软件机器上没有或者版本过低, 怎么办？**
>
> 一般软件的主页里会提供 Installation Guide. 请根据安装指南将软件安装到自己的用户目录下(提示: 通过make或cmake编译安装的软件可以在第一步指明安装路径, 这时只要将安装路径指定为自己的用户目录, 就无需管理员权限).
>
> 如果安装失败, 或没有找到不需要管理员权限的安装指南, 请联系[管理员](mailto:cash_admin@163.com), 邮件里写明软件名称及用途, 管理员会在24小时内回信.


## 接下来干嘛?

你已经知道了所有必须要知道的信息! 如果还遇到了任何困难, 请向管理员求助.

前往了解 [集群的配置和性能](../reference/index)
