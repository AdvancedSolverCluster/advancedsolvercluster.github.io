# VS Code教程

*June 28, 2022, [Ming Li](mailto:19300180127@fudan.edu.cn)*

VS Code 全称 Visual Studio Code, 是微软出的一款轻量级代码编辑器, 免费、开源而且功能强大. 它支持几乎所有主流的程序语言的语法高亮、智能代码补全、自定义热键、括号匹配、代码片段、代码对比 Diff、GIT 等特性, 支持插件扩展, 并针对网页开发和云端应用开发做了优化. 软件跨平台支持 Win、Mac 以及 Linux. 

我们推荐使用英文版的VS Code, 可以帮助你熟悉相关词汇, 便于与他人交流. 如果你现在使用的是中文版 VS Code, 可以用 `F1` (或 `Ctrl+Shift+p`) 调出命令面板, 在已有的 `>` 号后输入 `language` $\rightarrow$ `configure display language`, 然后选择英语. 虽然命令面板的可发现性(discoverability) 不太好，但它是 VS Code 最重要的组件之一, 请牢记它的打开方式. 

## 用VS Code连接服务器

VS Code 有丰富而强大的插件 (Extensions)，这些优秀的插件使得VS Code生态体系更加吸引人，让开发效率大大提升. 要用 VS Code 连接服务器, 就需用到 `Remote - SSH` 和 `Remote - SSH: Editing Configuration` 这两个插件 (前者为必须安装 (install) 的, 后者推荐安装). 

![](guide/figure/VSCode-extensions.png)

安装之后, 应该能在 VS Code 的左下角看到两个上下排列的 $>$ 和 $<$ 组成的图案 (如果没有出现, 则用 `F1` (或 `Ctrl+Shift+p`)调出命令面板, 输入 `Reload Windows` 重新加载), 点击它, 选择 `Connect to Host...` $\rightarrow$ `Configure SSH Hosts`. 然后选择(通常来说)在 `users` 目录下 `.ssh` 文件夹内的 `config` 文件 (如果没有该文件, 请参考[首次登录服务器! - 服务器基本操作: SSH & SCP](basic-ssh-scp.md)). 保存后再次点击左下角的图标, 然后选择要连接的服务器名即可. 在上方的 `Select the plaform of the remote host` 中选择 Linux, 如果左下角显示 `SSH: Host-name`, 则说明连接成功！连接成功的图示如下: 
![](guide/figure/VSCode-login-success.png)

**如果连接不成功, 可以参考的解决方法: **

<https://code.visualstudio.com/docs/remote/troubleshooting#_troubleshooting-hanging-or-failing-connections>


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

![](guide/figure/VSCode-LiveShare.png)

