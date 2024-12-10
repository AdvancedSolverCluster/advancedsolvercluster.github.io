---
title: 我换了电脑, 怎么在新电脑上连接服务器?
nav_order: 4
parent: 快速开始
---

# 我换了电脑, 怎么在新电脑上连接服务器?
*Last modified: September 10, 2024*

- Step 1 在新电脑上生成 key

参考 [我还没有服务器账号，我该怎么做？](i-have-no-account), 在新电脑上生成 key.

- Step 2 利用原电脑, 把 key 添加到服务器上

如果原电脑仍然能够登录服务器的, 我们使用原电脑登陆服务器, 然后编辑 `~/.ssh/authorized_keys` 文件, 把新电脑的 public key 复制到这个文件下就可以.

如果原电脑无法使用, 请将新的公钥发送到[管理员邮箱](mailto:cash_admin@163.com).

- Step 3 在新电脑上测试能否正常登录.

参考 [我得到了我的服务器账号, 我该怎么连接服务器?](how-can-i-connect), 在新电脑上测试能否登录到我们的服务器.
