---
title: 使用 latexdiff 工具标注文档修改
nav_order: 9
parent: 其他知识
---

# 使用 latexdiff 工具标注文档修改

*Last modified: August 07, 2025*

`latexdiff` 是一个 Perl 脚本，用于**比较两个 LaTeX 文件的内容**，并生成一份新的文件，这份新的文件中所有修改/删除/新增处都被高亮显示，效果类似下图：

![image-20250807151257686](/guide/figure/latexdiff-1.png)

假设你的论文编写环境是 **Overleaf**，新旧文档分别为 `new.tex`  和 `old.tex`，那么你要做的是：

1. **把两个文档放在同一目录下**（即使不是也没事，只要改下后面要用的指令）；

2. **确保新旧文档的参考文献是不同的 bib 文件**，比如  `new.bib`  和 `old.bib`。如果两个版本的参考文件并没有发生变化，也一样需要分成两个，否则 `latexdiff` 会报错。

3. **确保要对比的内容都直接位于文档内，没有通过 `\input` 引用**。有的同学可能是在主文件里只写标题、日期这样的辅助信息，然后再使用类似于 `\input{introduction}`, `\input{experiment_results}` 的命令把其他文件的内容引用进来。这样的话，这些被引用的文件的内容是不会参与文档内容的对比的。如果你的文档里没有使用这个命令可以无视。

4. **创建脚本文件**：在 `new.tex` 和 `old.tex` 的同一文件夹下，新建文档 `diff.tex`，粘贴进以下内容：

   ```latex
   \RequirePackage{shellesc}
   % 使用 shellesc 包提供的 \ShellEscape 命令执行 latexdiff

   \ShellEscape{latexdiff old.tex new.tex > diff_result.tex}
   % 使用 latexdiff 来比较 old.tex 和 new.tex 文件，并将结果写入名为 diff_result.tex 的文件中
   % diff_result.tex 文件是生成的文件，即由代码创建的文件，因此它不会在项目文件中显示

   \input{diff_result}
   % 插入diff_result.tex到当前文档

   \documentclass{dummy}
   % 这一行是用来欺骗编译器来编译 diff_result.tex
   % 因为 Overleaf 的编译器会 check 当前打开的文件是否有 \documentclass，如果有则编译当前打开的文件，如果没有才会去编译菜单里面设置的主文档（main tex)
   ```

5. **编译文件**：在 `diff.tex` 或者 `latexmkrc` 点击编译即可，预览窗口将看到生成的 pdf.

更多关于 `latexdiff` 命令的问题，请参考 [官方文档](https://www.overleaf.com/learn/latex/Articles/How_to_use_latexdiff_on_Overleaf)。



