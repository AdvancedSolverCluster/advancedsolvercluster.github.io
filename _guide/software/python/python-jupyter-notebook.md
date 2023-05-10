---
title: 在 VSCode 里连接 Python Jupyter Notebook
parent: Python
nav_order: 1
---

# 在 VSCode 里连接 Python Jupyter Notebook

*April 20, 2023, [Yuejia Zhang](mailto:yuejiazhang21@m.fudan.edu.cn)*

## Step 1: 创建一个 notebook 文件

![step1](/guide/figure/python-jupyter-notebook/step1.png)

如图所示, 我们创建了一个名为 `test.ipynb` 的 notebook 文件. 请注意文件的后缀名必须是 `ipynb`.

## Step 2: 确认你想要的 Python 版本已安装 Jupyter Notebook

可以选择 Python 3.8 或 Python 3.10.

```bash
module load Python/3.8.12
pip install jupyter notebook
```

## Step 3: 申请计算节点资源并登陆计算节点

使用 `salloc` 申请计算节点资源. 如果你需要用 GPU 卡或者对 CPU 数量有要求, 请参见 [如何利用SLURM在集群上运行程序](../run-program#如何利用slurm在集群上运行程序).

命令行会提示你为你分配的主机名 (如: `bigMem1`).

在终端运行以下命令:
```bash
ssh -L 127.0.0.1:55555:127.0.0.1:55555 bigMem1
```

其中, 55555 可以换成一个任意的 50000 到 60000 之间的数字. 如果报错提示端口占用, 就更换一个数字. `bigMem1` 是你被分配的主机名.

运行完这行命令后, 你就登上了计算节点.

## Step 4: 在计算节点上启动 Jupyter Notebook

加载你选择的 Python 版本.

```bash
module load Python/3.8.12
```

运行以下命令 (端口是刚才你选择的 50000 到 60000 之间的数字):

```bash
jupyter notebook --port=55555 --ip=127.0.0.1
```

![step4](/guide/figure/python-jupyter-notebook/step4.png)

出现红框内的提示表示成功启动.

## Step 5: 在 VSCode 里打开 Notebook 并选择所使用的 Python

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

```python
!hostname
%pip --version
```

如果返回了计算节点的主机名, 则连接成功. 你还可以确认 pip 版本是否正确.
