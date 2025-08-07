---
title: Intel OneAPI Toolkit
parent: 软件环境
nav_order: 6
---


# Intel OneAPI Toolkit

*Last modified: December 10, 2024*

Intel OneAPI Toolkit 使用一流的编译器, 性能库, 框架以及分析和调试工具在 CPU 和 XPU 上分析和优化高性能, 跨架构应用程序. 我们的服务器上安装了 Base Toolkit 和 HPC Toolkit, 包含 icc compiler, debugger, mkl 数学库, intel MPI, vtune 等软件, 请参阅官网查看完整软件列表及使用方法.

在命令行输入 `module load Intel-toolset`.

```text
aduser@loginNode:~$ module load Intel-toolset
Intel toolset included. Use `module av` to re-check and load the Intel toolset you want.
To unload your Intel environment, unload each specific package first then unload this one.
aduser@loginNode:~$ module av
------------------------------ /software/modulefiles-Intel -------------------------------
advisor/2024.0          dnnl/3.3.0                  intel_ippcp_intel64/2021.7.0
                       ... other Intel modules ...
```

你可以看到可以使用的 Intel 软件, 可以选择你想要的加载, 例如 `module load compiler mkl mpi`.

{: .tip }
> Intel oneAPI 的 icc 和 icpc 已经被 icx 取代。我们的服务器上没有安装 icc 和 icpc，因此请使用 icx 进行 C 和 C++ 编译。使用方式和原先的编译器类似，例如：`icx your_code.cpp -o output`。