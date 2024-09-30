---
title: Python Tensorflow / PyTorch 安装教程
parent: Python
grand_parent: 软件环境
nav_order: 2
---

# Python Tensorflow / PyTorch 安装教程

*Last update: September 29, 2024*

*Created: March 21, 2022*

*Author(s): [Yuejia Zhang](mailto:yuejiazhang21@m.fudan.edu.cn), [Xiang Li](mailto:646873166@qq.com), [Jingyu Liu](mailto:jyliu22@m.fudan.edu.cn)*

我们在服务器的 `bigMem[0-2]` 上为用户预装了 `torch-2.3`. 注意, 使用前请先申请 gpu, 例如 `salloc -w bigMem1 --gres=gpu:1`.

- `bigMem[0-1]` 使用 `module load Python/3.10.13` 即可使用. 运行 `python3 -c "import torch;print('pytorch version:',torch.__version__);print('GPU is',torch.cuda.is_available())"`, 输出应当为

``` text
pytorch version: 2.3.0+cu118
GPU is True
```

- `bigMem2`: 首先 `module load Python/3.10.13 DTK/24.04.2`. 运行 `python3 -c "import torch;print('pytorch version:',torch.__version__);print('DCU is',torch.cuda.is_available())"`, 输出应当

``` text
pytorch version: 2.3.0
DCU is True
```

## Python Tensorflow / PyTorch 手动安装教程

Step 1: 选择你想要的 Python 版本,默认环境是 Python `3.10.12`, 也可以通过 `module load` 加载其他版本的 `Python`.

Step 2: (可选)创建一个新的虚拟环境并激活.

``` bash
python3 -m venv --system-site-packages ./venv
source ./venv/bin/activate
```

当虚拟环境处于有效状态时, shell 提示符带有 (venv) 前缀. 用`python3 --version` 确认 Python 版本正确.

Step 3: 在虚拟环境中升级 pip.

``` bash
pip install --upgrade pip
```

如需要使用 GPU 版本的 Tensorflow / PyTorch, 先需要确认想要跑的机器上是否有

通过以下步骤安装 Tensorflow.

``` bash
pip install --upgrade tensorflow
```

参照 [PyTorch 网站](https://pytorch.org/get-started/locally/)上的建议选择正确的 PyTorch 版本. 如果使用 GPU, 需要选择正确的 CUDA 版本. (在服务器上使用 `module av` 查看服务器上支持的 CUDA 版本.)

例如: 通过以下步骤安装 PyTorch. (注意正确的版本号!)

``` bash
pip install torch torchvision torchaudio
pip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cu118
```

Step 4: 开始使用 Tensorflow ：在Python中，

``` python
import tensorflow as tf
print(tf.reduce_sum(tf.random.normal([1000, 1000])))
print(tf.test.is_built_with_cuda()) #确认是否启动了CUDA
print(tf.test.gpu_device_name()) #打印GPU device
```

开始使用 PyTorch ：在Python中，

``` python
import torch
x = torch.rand(5, 3)
print(x)
print(torch.cuda.is_available()) #确认是否启动了CUDA
```

Step 5: 使用结束后, (如有)退出虚拟环境. (如有)结束自己申请的计算资源.

``` bash
deactivate
```

## 在 bigMem2 上使用 Pytorch

### 准备工作

- 选择想要的 Python 版本, 我们以 `3.10.12` 为例说明, 也可以通过 `module load` 加载其他版本的 `Python`.
- 使用 `module load` 加载 DTK, 我们以 `24.04.1` 为例进行说明
- 前往 <https://developer.hpccube.com/tool/>, 点击 DAS 的下载地址, 或者直接进入 <https://cancon.hpccube.com:65024/4/main/>, 选择相应的 torch (在 pytorch 目录下面) 和 pytorchvision (在 vision 目录下面) 的 `whl` 的安装包. 需要注意的是, 选择的安装包的 Python 版本和 DTK 版本应当匹配. 我们以 `torch-2.3.0+das.opt1.dtk24042-cp310-cp310-manylinux_2_28_x86_64.whl` 和 `torchvision-0.18.1+das.opt1.dtk24042-cp310-cp310-manylinux_2_28_x86_64.whl` 为例进行安装.

### 创建虚拟环境并激活

使用

``` bash
python3 -m venv --system-site-packages ./pytorch_venv
source ./pytorch_venv/bin/activate
```

创建虚拟环境并激活, 当虚拟环境处于有效状态时, shell 提示符带有 (pytorch_venv) 前缀. 用`python3 --version` 确认 Python 版本正确.

### 安装 Pytorch

首先升级 pip

``` bash
pip3 install --upgrade pip
```

然后通过下面的命令安装

``` bash
pip3 install torch-2.3.0+das.opt1.dtk24042-cp310-cp310-manylinux_2_28_x86_64.whl
pip3 install torchvision-0.18.1+das.opt1.dtk24042-cp310-cp310-manylinux_2_28_x86_64.whl
```

最后, 我们运行 `python3 -c "import torch;print('pytorch version:',torch.__version__);print('DCU is',torch.cuda.is_available())"`, 若输出为

``` text
pytorch version: 2.3.0
DCU is True
```

则表示成功安装.
