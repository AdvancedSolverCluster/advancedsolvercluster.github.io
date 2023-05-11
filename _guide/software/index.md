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
我们只列出一些常用的命令.

`module avail` 查看服务器上已有的软件.

`module load <name>` 加载要用的 module, 例如用 `module load MATLAB` 加载MATLAB. 如果 module 已加载, 不会重新加载.

`module unload <name>` 卸载 module. 如果 module 未被加载, 不会报错.

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