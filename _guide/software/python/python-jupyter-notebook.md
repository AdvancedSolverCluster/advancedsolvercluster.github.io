---
title: 在 VSCode 里连接Python Jupyter Notebook
parent: Python
grand_parent: 软件教程
nav_order: 1
---

# 在 VSCode 里连接 Python Jupyter Notebook

*Last update: April 27, 2024*

*Created: April 20, 2023, [Yuejia Zhang](mailto:yuejiazhang21@m.fudan.edu.cn)*

## 在登录节点使用还是在计算节点使用?

{: .important }
> 登录节点只适合极小规模的测试, 如果你预期你的程序需要大量计算资源 (参照[SLURM教程](../../you-must/slurm)), 请申请计算节点的计算资源.

首先你需要确保 VS Code 安装了 `Python` 和 `Jupyter` 等相关插件. 这两个插件是必须的.


## Step 1: 创建一个 notebook 文件

![step1](/guide/figure/python-jupyter-notebook/step1.png)

如图所示, 我们创建了一个名为 `test.ipynb` 的 notebook 文件. 请注意文件的后缀名必须是 `ipynb`.

## Step 2: 确认你想要的 Python 版本已安装 Jupyter Notebook

可以选择服务器上已有的 Python 版本 或 anaconda 版本.

~~~ bash
module load Python/3.8.12
pip install jupyter notebook
~~~

并输入 

```bash
which python3
```

来获取当前使用的 Python 程序的位置.

## Step 3.1: (登录节点使用的情况) 在 notebook 中选择使用的 Python 环境

VS Code 本身并不知道 Python 在服务器的哪里! 你需要手动告诉它你想使用的 Python 在哪里.

打开 VS Code 的命令面板 (Ctrl + Shift + P, F1) 输入 `Python: Select Interpreter` 后选择 `Enter interpreter path`, 选择 `Find` 并输入 Python 程序所在的位置.

服务器的 Python 安装在 `/opt/Python/<version>/bin/python`. 选中后你就告知了 VS Code 服务器里 Python 的所在位置.
服务器的 anaconda 安装在 `/opt/anaconda3/bin/python`. 选中后你就告知了 VS Code 服务器里 anaconda's Python 的所在位置.

打开你的 notebook 文件, 在右上角会出现 `Select Kernel` 的选项. 

选择这个选项之后, 可以从 `Python Environments` 和 `Existing Jupyter Server` 中选择. 在登录节点上运行只需要选择 `Python Environments` 并根据你刚刚添加的 Python 位置使用即可.

{: .important }
> 你可能会发现, 服务器系统自带了 Python: `/usr/bin/python3`, `/bin/python3`.
> 
> 它们是系统自带的, 不受我们的版本管理. 尽量不要使用它们.

选择后你会看到你选择的 Python 版本号出现在界面中, 你已经可以在登录节点使用 Jupyter Notebook 进行简单的测试了.


## Step 3.2: (计算节点使用的情况) 申请计算节点资源并登陆计算节点

使用 `salloc` 申请计算节点资源. 如果你需要用 GPU 卡或者对 CPU 数量有要求, 请参见 [如何利用SLURM在集群上运行程序](../run-program#如何利用slurm在集群上运行程序).

命令行会提示你为你分配的主机名 (如: `bigMem1`).

在终端运行以下命令:

~~~ bash
ssh -L 127.0.0.1:55555:127.0.0.1:55555 bigMem1
~~~

其中, 55555 可以换成一个任意的 50000 到 60000 之间的数字. 如果报错提示端口占用, 就更换一个数字. `bigMem1` 是你被分配的主机名.

运行完这行命令后, 你就登上了计算节点.

## Step 4: (登录节点使用的情况) 在计算节点上启动 Jupyter Notebook

加载你选择的 Python 版本.

~~~ bash
module load Python/3.8.12
~~~

运行以下命令 (端口是刚才你选择的 50000 到 60000 之间的数字):

~~~ bash
jupyter notebook --port=55555 --ip=127.0.0.1
~~~

![step4](/guide/figure/python-jupyter-notebook/step4.png)

出现红框内的提示表示成功启动.

## Step 5: (登录节点使用的情况) 在 VSCode 里打开 Notebook 并选择所使用的 Python

![step5-1](/guide/figure/python-jupyter-notebook/step5-1.png)

点击红框内的 Select Kernel, 选择 Existing Jupyter Server.

![step5-2](/guide/figure/python-jupyter-notebook/step5-2.png)

选择 Enter the URL of the running Jupyter Server.

![step5-3](/guide/figure/python-jupyter-notebook/step5-3.png)

把终端中的 URL 复制粘贴到对话框内.

![step5-4](/guide/figure/python-jupyter-notebook/step5-4.png)

选择 Python 3.

![step5-5](/guide/figure/python-jupyter-notebook/step5-5.png)

最后, 红框内出现 Python 3 (ipykernel) 即成功. 可以在 Notebook 的 code block 内运行以下代码:

~~~ text
!hostname
%pip --version
~~~

如果返回了计算节点的主机名, 则连接成功. 你还可以确认 pip 版本是否正确.
