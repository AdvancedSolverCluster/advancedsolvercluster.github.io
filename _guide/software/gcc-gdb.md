---
title: "GCC/GDB"
---

# GCC/GDB

gcc 和 g++ 是最常见的 c&c++ 编译器.当你想要运行 c 或 c++ 的代码时,首先需要用编译器编译. 对于最基本的运行 c++ 程序的命令,只需进入程序文件所在位置,在命令行输入

```bash
gcc <input_file_name> -o <output_file_name>
```

例如 `gcc helloworld.c -o test_hello_world`, 就能在当前路径下找到一个新的可执行文件 `test_hello_world`. 在当前路径命令行输入 `./<output_file_name>`, 就能得到程序的输出结果啦.

对于 c++ 程序, 以上命令可以改为 `g++ <input_file_name> -o <output_file_name>`. 对于更复杂的编译命令, 可以自行查找 gcc 和 g++ 的参数文档.

如果你想要在服务器上调试代码,可以考虑使用 GDB 工具. 在编译的时候, 加上参数 `-g`, 例如 `gcc -g test.c -o test`, 然后命令行输入 `gdb <filename>`, 对应上面例子则为 `gdb test`, 你就进入了 GDB 调试界面,按 `q` 即可退出. 常见的命令有:

- `r` : 从头开始运行代码.
- `b <num>` : 列出 num 所在行开始的代码.
- `b <num>` : 在程序第 num 行打断点.
- `n` : 单步运行.
- `c` : 继续运行.
- `display <var_name>` : 跟踪查看变量 var_name, 每次停下都会显示.

除了在服务器上调试, 也可以通过在 VS Code 上使用 `remote ssh` 连接到服务器上之后进行调试. 一般要求安装插件 C/C++. 之后调试办法有很多,简单的可以使用 `code runner` 插件一键调试, 也可以自行配置 json文件. 具体方法可以根据自己需求自行查阅.
