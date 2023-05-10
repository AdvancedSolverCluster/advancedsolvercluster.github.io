---
title: 软件教程
nav_order: 4
has_children: true
---

# 如何查看服务器上有哪些软件？

我们在服务器上提供了很多软件和软件包供使用. 这里核心的命令是 `module`.
我们只列出一些常用的命令.

`module avail` 查看服务器上已有的软件.

`module load <name>` 加载要用的 module, 例如用 `module load MATLAB` 加载MATLAB. 如果 module 已加载, 不会重新加载.

`module unload <name>` 卸载 module. 如果 module 未被加载, 不会报错.

`module list` 列出当前所用 module.

- [Element聊天软件](software/element)
- Python
  - [Tensorflow + Pytorch](software/python/python-tensorflow-pytorch)
  - [Jupyter Notebook](software/python/python-jupyter-notebook)
- [GCC/GDB](software/gcc-gdb)
- [MATLAB](software/matlab)
- [R](software/R)
- [Intel OneAPI Toolkit](software/intel)