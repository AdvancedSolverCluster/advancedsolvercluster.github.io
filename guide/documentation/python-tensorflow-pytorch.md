---
title: Python Tensorflow / PyTorch 安装教程
---

*March 21, 2022, [Yuejia Zhang](mailto:yuejiazhang21@m.fudan.edu.cn)*

Step 1: 选择你想要的Python版本，建议使用 Python 3.8（通过 `module load Python/3.8` 加载）或 Python 3.10（通过 `module load Python/3.10` 加载）。

Step 2: 创建一个新的虚拟环境并激活。
```bash
python3 -m venv --system-site-packages ./venv
source ./venv/bin/activate
```
当虚拟环境处于有效状态时，shell 提示符带有 (venv) 前缀。用`python3 --version` 确认 Python 版本正确。

Step 3: 在虚拟环境中升级 pip.
```bash
pip install --upgrade pip
```
通过以下步骤安装 Tensorflow.
```bash
pip install --upgrade tensorflow
```
通过以下步骤安装 PyTorch.
```bash
pip install torch==1.11.0+cu113 torchvision==0.12.0+cu113 torchaudio==0.11.0+cu113 -f https://download.pytorch.org/whl/cu113/torch_stable.html
```

Step 4: 开始使用 Tensorflow ：在Python中，
```python
import tensorflow as tf
print(tf.reduce_sum(tf.random.normal([1000, 1000])))
print(tf.test.is_built_with_cuda()) #确认是否启动了CUDA
print(tf.test.gpu_device_name()) #打印GPU device
```
开始使用 PyTorch ：在Python中，
```python
import torch
x = torch.rand(5, 3)
print(x)
print(torch.cuda.is_available()) #确认是否启动了CUDA
```

Step 5: 使用结束后，退出虚拟环境。
```bash
deactivate
```

