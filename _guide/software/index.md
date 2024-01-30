---
title: 软件教程
nav_order: 5
has_children: true
has_toc: false
---

# Element 软件
- [Element聊天软件](element)

# 如何查看服务器上有哪些软件？

我们在服务器上提供了很多软件和软件包供使用. 这里核心的命令是 `module`.

当你登陆服务器时, 你会看到

~~~  bash
PS C:\Users\yjzhang> ssh loginNode
Last login: Tue Jan 30 19:41:57 2024 from 10.230.32.216
Loading GCC/11.4.0
Loading CUDA/11.6
Loading MATLAB/R2022b
Loading texlive/2022
[yjzhang@loginNode ~]$
~~~

默认加载的软件环境包括: GCC/11.4.0, CUDA/11.6, MATLAB/R2022b, texlive/2022. 你可以参考[官方教程](https://modules.readthedocs.io/en/latest/module.html#collections), 设定自己希望自动加载的软件环境.

用 `module avail` 查看服务器上已安装的软件.

~~~  bash
[yjzhang@loginNode ~]$ module avail
-------------------------------------------------- /etc/modulefiles ---------------------------------------------------
CMake/3.22.2  GCC/11.4.0   Mathematica/12.0  mpfr/4.1.0        PySCF/2.2      scotch/7.0.1  texlive/2022
CUDA/11.6     gmp/6.2.1    MATLAB/R2021b     MPICH/4.0.2       Python/3.10.2  SPICE/3f5
GCC/9.4.0     go/1.20.3    MATLAB/R2022b     pandoc/2.17.1.1   R/4.2.2        StarPU/1.3.9
GCC/9.4.0-CN  hwloc/2.6.0  metis/5.1.0       parsec/dedicated  Ruby/3.2.2     texlive/2021

-------------------------------------------------- /sync/modulefiles --------------------------------------------------
Anaconda/3.11                 intel/dal/2024.0.0            intel/intel_ipp_ia32/2021.10      intel/tbb/2021.11
CMake/3.25.0                  intel/debugger/2024.0.0       intel/intel_ipp_intel64/2021.10   intel/tbb32/2021.11
GCC/11.4.0                    intel/dev-utilities/2024.0.0  intel/intel_ippcp_ia32/2021.9     intel/vtune/2024.0
intel/advisor/2024.0          intel/dnnl/3.3.0              intel/intel_ippcp_intel64/2021.9  LAPACK/3.11.0
intel/ccl/2021.11.2           intel/dpct/2024.0.0           intel/itac/2022.0                 OpenBLAS/0.3.26
intel/compiler-rt/2024.0.2    intel/dpl/2022.3              intel/mkl/2024.0                  Python/3.8.12
intel/compiler-rt32/2024.0.2  intel/ifort/2024.0.2          intel/mkl32/2024.0                Python/3.10.12
intel/compiler/2024.0.2       intel/ifort32/2024.0.2        intel/mpi/2021.11
intel/compiler32/2024.0.2     intel/inspector/2024.0        intel/oclfpga/2024.0.0

Key:
loaded  modulepath
~~~

这里列出的都是可以加载的软件环境, 在 Terminal 中你可以看到 GCC/11.4.0, CUDA/11.6, MATLAB/R2022b, texlive/2022 背景有阴影，代表它们已被加载. 上下两部分的区别在于, `/etc/modulefiles` 底下的 modules 仅对本节点适用, 而 `/sync/modulefiles` 底下的 modules 对所有计算节点通用. 因此, 如果你需要用 slurm 提交任务, 我们建议加载 `/sync/modulefiles` 底下的 modules, 避免加载 `/etc/modulefiles` 底下的 modules.

可以通过 `module load <name>` 加载要用的 module, 例如用 `module load LAPACK/3.11.0` 加载LAPACK. 如果 module 已加载, 不会重新加载.

可以通过 `module unload <name>` 卸载 module. 如果 module 未被加载, 不会报错.

`module list` 列出当前所用 module.

# 当前服务器上提供的软件（持续更新）
- Python
  - [Tensorflow + Pytorch](python/python-tensorflow-pytorch)
  - [Jupyter Notebook](python/python-jupyter-notebook)
- [GCC/GDB](gcc-gdb)
- [MATLAB](MATLAB)
- [R](R)
- [Intel OneAPI Toolkit](intel)


{: .tip }
> 我想用的软件机器上没有或者版本过低, 怎么办？
>
> 一般软件的主页里会提供 Installation Guide. 请根据安装指南将软件安装到自己的用户目录下(提示: 通过make或cmake编译安装的软件可以在第一步指明安装路径, 这时只要将安装路径指定为自己的用户目录, 就无需管理员权限).
>
> 如果安装失败, 或没有找到不需要管理员权限的安装指南, 请 <a class="one" href="mailto:cash_admin@163.com"> 联系管理员 </a>, 邮件里写明软件名称及用途, 管理员会在24小时内回信.
