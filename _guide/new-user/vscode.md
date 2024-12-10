---
title: 如何使用 VSCode 连接到服务器, 以提高我的开发效率?
nav_order: 5
parent: 快速开始
---

# 如何使用 VSCode 连接到服务器, 以提高我的开发效率?


VS Code 全称 Visual Studio Code, 是微软出的一款轻量级代码编辑器, 免费、开源而且功能强大。它支持几乎所有主流的程序语言的语法高亮、智能代码补全、自定义热键、括号匹配、代码片段、代码对比 Diff、GIT 等特性，并支持插件扩展，针对网页开发和云端应用开发做了优化。软件跨平台支持 Win、Mac 以及 Linux。

## 下载 VS Code

前往官网下载地址下载: <https://code.visualstudio.com/download>

如果有需要，可以在左侧扩展选项卡中搜索 `chinese` 安装中文语言包。不过，我们推荐使用英文版的 VS Code，这有助于你熟悉相关词汇，便于与他人交流。如果你现在使用的是中文版 VS Code，可以用 `F1` (或 `Ctrl+Shift+P`) 调出命令面板，在已有的 `>` 号后输入 `configure display language`，然后选择英语。虽然命令面板的可发现性不太好，但它是 VS Code 最重要的组件之一，请牢记它的打开方式。

## 用 VS Code 连接服务器

VS Code 有丰富而强大的插件 (Extensions)，这些优秀的插件使得VS Code生态体系更加吸引人，让开发效率大大提升。要用 VS Code 连接服务器，需要安装 `Remote - SSH` 和推荐的 `Remote - SSH: Editing Configuration` 插件。

![](/guide/figure/VSCode-extensions.png)

### 添加服务器连接配置

方法一: 点击左侧 Remote Explorer (远程资源管理器) 选项卡，在 SSH Targets 中点击加号，输入 `ssh <username>@<server_ip> -p <port>` (这个命令可能需要挂 VPN) 即可进行连接。这个时候相应的信息储存在 `C:\Users\<username>\.ssh\config` 中，你可以参考前面的教程进行修改。下次要连接时，可以直接在 SSH Targets 中选择。

方法二: 在 VS Code 左下角点击两个上下排列的 `>` 和 `<` 组成的图案。如果没有出现，可以用 `F1` (或 `Ctrl+Shift+P`)调出命令面板，输入 `Reload Window` 重新加载。点击该图标，选择 `Connect to Host...`，然后选择 `Configure SSH Hosts`。接着选择用户目录下 `.ssh` 文件夹内的 `config` 文件。如果没有该文件，请参考[首次登录服务器! - 服务器基本操作: SSH & SCP](../knowledge/ssh)。保存后再次点击左下角的图标，然后选择要连接的服务器名即可。在上方的 `Select the platform of the remote host` 中选择 Linux，如果左下角显示 `SSH: Hostname`，则说明连接成功！

![](/guide/figure/VSCode-login-success.png)

{: .tip }
> 如果连接不成功, 可以参考以下链接的解决方案:
> <https://code.visualstudio.com/docs/remote/troubleshooting#_troubleshooting-hanging-or-failing-connections>
>
> 或者，带着命令行的输出截图和 VS Code 连接失败的整个页面截图向管理员求助。

## 重启服务器上的 vscode-server

当你更改了 `.bashrc` 并希望在 VS Code 中的 terminal 也生效时，或在一些特殊情况下需要排除某个未知问题时，你可能需要重启 VS Code (vscode-server)。

在服务器上使用以下命令来查找并关闭由你启动的vscode-server进程：

```bash
ps -aux | grep $USER | grep vscode-server
```

找到相关进程后，使用 kill PID 关闭它们，其中 PID 是进程号。也可以使用 pgrep 和 pkill 批量处理：

```bash
pgrep -f $USER/.vscode-server
pkill -f $USER/.vscode-server
```

## 使用Live Share合作完成代码

*June 29, 2022, [Xiang Li](mailto:646873166@qq.com)*

Live Share是 VS Code 重磅的生产力提高工具, 允许多人同时编辑同一个project, 控制同一个控制台, 在同一个debugger里共同开发某个项目.

1. 下载. 在Extension market里下载由Microsoft提供的Live Share(Live Share Audio, Live Share Extension Pack, 选装).

2. 重载窗口. 进入VS Code Command Palette(`F1`): `reload window`. 侧边栏及底部栏会出现Live Share选项及Logo.

3. 选择Share以开始分享你的编辑环境给其他人 / 选择Join以加入其他人的编辑环境

  - 加入其他人分享的环境时需要invitiation link.

4. 开始分享环境后自动复制了invitation link到剪切板. 右下角pop up提示框可以选择是否转为只读模式, 或是再次copy invitation link.

5. 侧边栏在分享状态下可以查看当前的参与用户都有谁(可以匿名参与(实名则需要Microsoft/Github帐号), 可以使用网页版VS Code参与). 可以查看Shared Servers / Shared Terminals (默认Read-only), 选配了Live Share Audio的用户可以在这里发起audio call.

6. 在有其他用户参与的模式下, **尤其要注意共同编辑的文件是否有被保存**. 通过侧边栏可以选择follow / unfollow其他用户的光标, 以切换观察员模式看别人写代码和自己动手写代码模式的切换. 侧边栏可以启动一个暂时没什么用的聊天框聊天.

![](/guide/figure/VSCode-LiveShare.png)
