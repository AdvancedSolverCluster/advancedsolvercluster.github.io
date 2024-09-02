---
title: Python Tensorflow / PyTorch 安装教程
parent: Python
grand_parent: 软件环境
nav_order: 2
---

# Python Tensorflow / PyTorch 手动安装教程

*Last update: April 27, 2024*

*Created: March 21, 2022*

*Author(s): [Yuejia Zhang](mailto:yuejiazhang21@m.fudan.edu.cn), [Xiang Li](mailto:646873166@qq.com)*


Step 1: 选择你想要的Python版本，建议使用 Python 3.10（通过 `module load Python/3.10` 加载）.

Step 2: (可选)创建一个新的虚拟环境并激活。

~~~ bash
python3 -m venv --system-site-packages ./venv
source ./venv/bin/activate
~~~

当虚拟环境处于有效状态时，shell 提示符带有 (venv) 前缀。用`python3 --version` 确认 Python 版本正确。

Step 3: 在虚拟环境中升级 pip.

~~~ bash
pip install --upgrade pip
~~~

如需要使用 GPU 版本的 Tensorflow / PyTorch, 先需要确认想要跑的机器上是否有

通过以下步骤安装 Tensorflow.

~~~ bash
pip install --upgrade tensorflow
~~~

参照 [PyTorch 网站](https://pytorch.org/get-started/locally/)上的建议选择正确的 PyTorch 版本. 如果使用 GPU, 需要选择正确的 CUDA 版本. (在服务器上使用 `module av` 查看服务器上支持的 CUDA 版本.)

例如: 通过以下步骤安装 PyTorch. (注意正确的版本号!)

~~~ bash
pip3 install torch torchvision torchaudio
pip3 install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cu118
~~~

Step 4: 开始使用 Tensorflow ：在Python中，

~~~ python
import tensorflow as tf
print(tf.reduce_sum(tf.random.normal([1000, 1000])))
print(tf.test.is_built_with_cuda()) #确认是否启动了CUDA
print(tf.test.gpu_device_name()) #打印GPU device
~~~

开始使用 PyTorch ：在Python中，

~~~ python
import torch
x = torch.rand(5, 3)
print(x)
print(torch.cuda.is_available()) #确认是否启动了CUDA
~~~

Step 5: 使用结束后, (如有)退出虚拟环境. (如有)结束自己申请的计算资源.

~~~ bash
deactivate
~~~

