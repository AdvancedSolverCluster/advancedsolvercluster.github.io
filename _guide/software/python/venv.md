---
title: 使用 Python 的虚拟环境 venv
parent: Python
grand_parent: 软件环境
nav_order: 3
---


*Created: January 27, 2025, [Xiang Li](mailto:646873166@qq.com)*

在使用 Python 的项目中创建虚拟环境是一个好习惯. 
通常我们会把项目创建在 `/home` 目录下, 并利用服务器的每日备份来备份代码. 相比之下, 虚拟环境所创建的 Python 环境易于重新下载创建, 会占用大量磁盘空间且不需要备份. 结合服务器备份功能的特点, 我们建议按照以下方式创建虚拟环境:

```bash

# load the correct Python version
*Last modified: January 27, 2025*
module load Python/3.10

# create your venv inside /scratch
python -m venv /scratch/$USER/envs/my_env

# create soft link to the venv folder, to your project folder
ln -s /scratch/$USER/envs/my_env my_env

# activate the venv as usual
source my_env/bin/activate
```

由此, 创建的虚拟环境实际位置位于 `/scratch/$USER/envs/` 下, 并且使用快捷方式在当前的项目文件夹下链接了这个虚拟环境.

