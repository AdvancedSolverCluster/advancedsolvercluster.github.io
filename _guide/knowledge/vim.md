---
title: vi/vim 教程
nav_order: 3
parent: 其他知识
---

# vi/vim 教程
*Last modified: September 02, 2024*

*March 10, 2022, [Jingyu Liu](mailto:381258337@qq.com), [Yidong Zhang](mailto:2308353627@qq.com)*

vi/vim 都是 Linux 的文本编辑器. vim 是 vi 的增强版, 功能更加强大, 我们推荐使用 vim. 输入 `vim <filename>` 即可进入相应的文件. 若没有对应的文件, 会新建相应名称的文件.

vi/vim 共分为三种模式, 分别是命令模式, 输入模式和末行模式. 我们将依次介绍各个模式.

1. 命令模式

    该模式是进入 vim 编辑器后的默认模式. 任何时候, 不管用户处于何种模式, 按下 `Esc` 键即可进入命令模式.

    在命令模式下, 从键盘上输入的任何字符会被 vim 识别为命令, 而非文件内容. 若输入的字符是合法的 vi 命令, 则 vi 在接受用户命令之后完成相应的动作. 但需注意的是, 输入的命令并不显示在屏幕上. 若输入不是合法命令, vi 会响铃报警.

    以下是常用的几个命令:

    `i` 切换到输入模式.

    `x` 删除当前光标所在处的字符.

    `:` 切换到末行模式, 以在最底一行输入命令.

1. 输入模式

    在该模式下,用户输入的任何字符都被 vi 当做文件内容保存起来,并将其显示在屏幕上. 输入模式下的绝大多数操作和在 word 中的操作一样, 在此不再赘述. 需要特别指出, 在此模式下使用 `ctrl+q` 可以将已复制的内容在光标下一行粘贴.

1. 末行模式

    此时vi会在显示窗口的最后一行（通常也是屏幕的最后一行）显示一个 `:`作为末行模式的说明符, 等待用户输入命令. 多数文件管理命令都是在此模式下执行的, 常用的命令有 (已经省略了 `:`) :

    `w` 保存文件.

    `q` 退出文件.

    `q!` 强制退出, 若修改过文件又不想储存可用此方法退出.

    `<num>` 跳转到第 num 行.

1. 示例

    当你想要新创建一个名为 filename 的文件时,在命令行输入 `$ vim <filename>`, 例如 `$ vim test.cpp`, 进入 vim 编辑界面, 此时界面左下角状态栏为文件名称, 表示此时处于命令模式. 键盘按下 `i` 键, 此时左下角状态栏显示 `--insert--`, 表示进入输入模式. 现在你可以开始编辑文档. 文档编辑完成后, 按下键盘 `ESC` 键, 退出输入模式回到命令模式, 可以看到状态栏的 `insert` 字样消失, 输入 `:wq`, 游标来到页面左下角, 回车后即可保存离开.

1. 常用命令

    下面是一些有用的快捷键. 请在命令模式使用它们.

    `[Ctrl] + [f]` 或 `[Page Down]` : 屏幕向下移动一页.

    `[Ctrl] + [b]` 或 `[Page Up]` : 屏幕向上移动一页.

    `0` 或 `[Home]` : 移动到这一行的最前面字符处.

    `$` 或 `[End]` : 移动到这一行的最后面字符处.

    `gg` : 移动到文档的第一行.

    `G` : 移动到这个档案的最后一行.

    `/<word>` 或 `?<word>` : 向光标之下/上寻找一个名称为 word 的字符串.

    `:[addr] s/<word_original>/<word_target>/[option]` :  查找替换命令. `addr` 表示搜索范围, 例如`1, 5` 表示文件1-5行, `%` 表示当前行到最后一行. `s` 表示替换操作, `option` 表示操作类型,如 `g` 表示全局操作, `c` 表示确认. 举例: `:1,$s/Hello/hello/g` 表示在全文档将 `Hello` 替换为 `hello`.

    `dd` : 剪切光标所在的一整行.

1. 在 vim 中使用查找功能

在命令模式下按下 `/` 即可进入查找模式, 输入要查找的字符串并按下回车. vim 会跳转到第一个匹配. 按下 `n` 查找下一个, 按下 `N` 查找上一个.

**可以参考的学习资源:**

<https://www.runoob.com/linux/linux-vim.html>
