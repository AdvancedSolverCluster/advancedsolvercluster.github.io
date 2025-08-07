---
title: R
parent: 软件环境
nav_order: 5
---

# R

*Last modified: September 10, 2024*

在命令行运行 `module load R`.

输入 `R` 即可打开 R 语言的命令行界面, 此时在命令行输入

~~~  R
print("Hello World!")
~~~

即可看到屏幕上输出 `Hello World!`.

运行 R 程序也很容易, 我们新建一个文件 `hello_world.R`

~~~  R
print("Hello World!")
~~~

输入 `Rscript hello_world.R` 即可看到屏幕上输出 `Hello World!`.

如果是利用 slurm 提交作业, sbatch 文件有以下格式

~~~  bash
#!/bin/bash

Rscript hello_world.R
~~~

然后利用 sbatch 提交即可.