# Intel OneAPI Toolkit

Intel OneAPI Toolkit 使用一流的编译器, 性能库, 框架以及分析和调试工具在 CPU 和 XPU 上分析和优化高性能, 跨架构应用程序. 我们的服务器上安装了 Base Toolkit 和 HPC Toolkit, 包含 icc compiler, debugger, mkl 数学库, intel MPI, vtune 等软件, 请参阅官网查看完整软件列表及使用方法.

要使用 Intel OneAPI Toolkit, 首先在命令行中运行

```bash
module use /opt/intel/oneapi/modulefiles
```

然后再使用`module avail`, 你会看到可用模块中新添了所有 Intel 提供的模块, 这时你可以加载你需要用的模块.
