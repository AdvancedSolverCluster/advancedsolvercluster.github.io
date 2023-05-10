---
title: 在服务器上运行程序及提交作业
---
# 使用 module

我们在服务器上提供了很多软件和软件包供使用. 这里核心的命令是 `module`.
我们只列出一些常用的命令.

`module avail` 查看服务器上已有的软件.

`module load <name>` 加载要用的 module, 例如用 `module load MATLAB` 加载MATLAB. 如果 module 已加载, 不会重新加载.

`module unload <name>` 卸载 module. 如果 module 未被加载, 不会报错.

`module list` 列出当前所用 module.