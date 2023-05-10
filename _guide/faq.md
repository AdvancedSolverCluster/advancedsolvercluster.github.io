---
title: FAQ
---

- 我想访问的位置提示 Permission denied, 怎么办？

一般来说,每个人的工作区域就在 `/home/username` . 出现 Permission denied 是因为你没有权限访问这个位置, 请不要访问它, 且一般来说你也无须访问.

- 我想用的软件机器上没有或者版本过低, 怎么办？

一般软件的主页里会提供 Installation Guide. 请根据安装指南将软件安装到自己的用户目录下(提示: 通过make或cmake编译安装的软件可以在第一步指明安装路径, 这时只要将安装路径指定为自己的用户目录, 就无需管理员权限).

如果安装失败, 或没有找到不需要管理员权限的安装指南, 请 <a class="one" href="mailto:cash_admin@163.com"> 联系管理员 </a>, 邮件里写明软件名称及用途, 管理员会在24小时内回信.

- 我不小心修改了 `~/.bashrc` 文件, Linux 系统指令失效, 怎么办?

请使用 `/usr/bin/vim ~/.bashrc` 回到 `.bashrc` 文件, 把你的修改撤回到原来的样子. 如果你已经忘了自己的修改, 你可以在 `/home/admin/script/` 目录下找到一个名为 `bashrc_sample` 的文件, 删除自己目录下的 `.bashrc` 文件, 然后将 `bashrc_sample` 复制过来并重命名为 `.bashrc` (这个命令是 `cp /home/admin/script/bashrc_sample ~/.bashrc`). 最后退出重连服务器即可.