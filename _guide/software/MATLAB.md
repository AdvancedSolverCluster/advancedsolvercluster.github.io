---
title: MATLAB
parent: 软件环境
nav_order: 4
---

# MATLAB

- 方法一: 直接使用 (无图形化界面)
  首先用 `module load MATLAB` 加载 MATLAB, 输入 `matlab` (在哪个目录启动的 MATLAB, 启动后的默认工作目录就在哪里) , 然后输入对应的文件名即可 (不要加 `.m`) , 用 `exit` 退出. 可以用 `matlab --help` 查看更详细的说明.
- 方法二: 利用 X11 Forwarding 打开图形化界面

  (1) 安装 MobaXterm (如已安装可以跳过这一步). 进入 <https://mobaxterm.mobatek.net/download-home-edition.html>, 选择 `Install edition` 进行下载安装.

  (2) 打开 MobaXterm, 点击 `Session`, 选择 `SSH`, 接下来填入 `Remote host`, `specify username`, `Port`, 点击下方 `Advanced SSH Settings` 的选项面板, 在 `Use Private Key` 这一栏里选择自己的 private key, 最后连接到服务器.

  (3) 在现在的 MobaXterm 页面输入 `matlab` 即可打开MATLAB图形化界面.
