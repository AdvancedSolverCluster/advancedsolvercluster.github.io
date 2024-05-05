---
title: 使用 VS Code 连接到服务器
nav_order: 5
parent: 入门教程
---

# 使用 VS Code 连接到服务器

VS Code 全称 Visual Studio Code, 是微软出的一款轻量级代码编辑器, 免费、开源而且功能强大. 它支持几乎所有主流的程序语言的语法高亮、智能代码补全、自定义热键、括号匹配、代码片段、代码对比 Diff、GIT 等特性, 支持插件扩展, 并针对网页开发和云端应用开发做了优化. 软件跨平台支持 Win、Mac 以及 Linux.

## 下载 VS Code

进入官网 <https://code.visualstudio.com/>, 下载 VS Code. 如果有需要, 在左侧扩展选项卡中搜索 chinese 安装中文语言包. 但是, 我们推荐使用英文版的VS Code, 可以帮助你熟悉相关词汇, 便于与他人交流. 如果你现在使用的是中文版 VS Code, 可以用 `F1` (或 `Ctrl+Shift+P`) 调出命令面板, 在已有的 `>` 号后输入 `language`, 选择 `configure display language`, 然后选择英语. 虽然命令面板的可发现性(discoverability) 不太好，但它是 VS Code 最重要的组件之一, 请牢记它的打开方式.

## 安装 SSH 插件

VS Code 有丰富而强大的插件 (Extensions)，这些优秀的插件使得VS Code生态体系更加吸引人，让开发效率大大提升. 要用 VS Code 连接服务器, 就需用到 `Remote - SSH` 和 `Remote - SSH: Editing Configuration` 这两个插件 (前者为必须安装 (install) 的, 后者推荐安装). 安装完成之后会在左侧新增一个选项卡 Remote Explorer (远程资源管理器).

![](/guide/figure/VSCode-extensions.png)

## 添加服务器连接配置

方法一: 点击 Remote Explorer, 在 SSH Targets 中点击加号, 输入 `ssh <username>@10.88.3.90 -p 20001` (这个命令需要挂学校的 VPN) 即可进行连接. 这个时候相应的信息储存在 `C:\Users\admin\.ssh\config` 中, 你可以参考前面的教程进行修改. 当下次还想连接时, 可以直接在 SSH Targets 中选择.

方法二: 安装之后, 应该能在 VS Code 的左下角看到两个上下排列的 $>$ 和 $<$ 组成的图案 (如果没有出现, 则用 `F1` (或 `Ctrl+Shift+P`)调出命令面板, 输入 `Reload Window` 重新加载), 点击它, 选择 `Connect to Host...`, 然后选择 `Configure SSH Hosts`. 再选择(通常来说)在 `username` 目录下 `.ssh` 文件夹内的 `config` 文件 (如果没有该文件, 请参考[首次登录服务器! - 服务器基本操作: SSH & SCP](../knowledge/ssh)), 比如 `C:\Users\admin\.ssh\config` . 保存后再次点击左下角的图标, 然后选择要连接的服务器名即可. 在上方的 `Select the plaform of the remote host` 中选择 Linux, 如果左下角显示 `SSH: Hostname`, 则说明连接成功！连接成功的图示如下:

![](/guide/figure/VSCode-login-success.png)

**如果连接不成功, 可以参考的解决方法: **

<https://code.visualstudio.com/docs/remote/troubleshooting#_troubleshooting-hanging-or-failing-connections>