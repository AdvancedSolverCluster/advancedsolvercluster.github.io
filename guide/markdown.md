---
title: Markdown教程
---

*March 4, 2022, [Jingyu Liu](mailto:381258337@qq.com)*

Markdown 是一种轻量级的标记语言, 可用于在纯文本文档中添加格式化元素. 事实上, 本篇教程就是用 Markdown 写成的. 我们推荐使用 VS Code 写 Markdown, 请注意, Markdown 文件的后缀是 `.md`.

在这里, 我们列出一些常用的 Markdown 语法供查阅, 并加以简单的说明.

- 在文字前面添加 `#` 即可创建标题, `#` 的数量 (1-6) 代表了标题的级别, 级别越小, 标题的字体越大.

- 使用空白行将一行或多行文本进行分隔.

- 在一行的末尾添加两个或多个空格, 然后按回车键, 即可换行.

- 在文字前后各添加2个星号 `**` 或下划线 `__` 可以对其进行加粗. 如果被加粗的部分在英文单词的中间, 请使用 `**`.

- 在文字前后各添加1个星号 `*` 或下划线 `_` 可以对其进行斜体. 如果被加粗的部分在英文单词的中间, 请使用 `*`.

- 在文字前后各添加3个星号 `***` 或下划线 `___` 可以对其进行斜体. 如果被加粗的部分在英文单词的中间, 请使用 `***`.

- 在段落前添加一个 `>` 符号可以创建引用. 对于多个段落的引用, 请记得在空白行也添加 `>`. 引用可以嵌套, 在要嵌套的段落前添加一个 `>>` 符号.

- 在每个列表项前添加数字并紧跟一个英文句点可以创建有序列表, 数字不必按顺序排列,但是列表应当以数字 `1` 起始. 事实上, 我们建议在每一项前都使用 `1.` , Markdown 会自动为您排序.

- 在每个列表项前面添加破折号 `-`, 星号 `*` 或加号 `+` 以创建无序列表.

- 将代码包裹在反引号 `` ` `` 中, 如果你要表示为代码中包含一个或多个反引号,则可以通过将单词或短语包裹在双反引号 ``` `` ``` 中.

- 将代码块的每一行缩进至少四个空格或一个制表符可以创建代码块.

- 在单独一行上使用三个或多个星号 `***`, 破折号 `---` 或下划线 `___` 可以创建分割线.

- 使用 `[<display name>](<link> "<title>")` 创建超链接, 需要注意的是, 中括号和小括号之间不能有空格.

- 用尖括号 `<>` 添加网址.

- `![<figure text>](<figure link> "title")` 创建图片.

- Markdown 的转义字符是 `\`.

- 使用 `[//]: <text>` 在 Markdown 中使用注释.

- 我们特别推荐使用插件 markdownlint 为您自动指出 Markdown 中的错误, 特别是当你有强迫症的时候.

**可以参考的学习资源:**

<https://markdown.com.cn/>

<https://www.runoob.com/markdown/md-tutorial.html>