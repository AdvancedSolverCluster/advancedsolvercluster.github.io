---
title: Update Overleaf
nav_order: 1
parent: Web0
---

# Update Overleaf

*Last modified: January 02, 2025*

记录一下如何更新 overleaf, 我们的 overleaf 在 <https://overleaf.advancedsolver.com/project>.

start version:

- overleaf: `3.0`
- mongo: `4.0`
- redis: `5.0`

主要是参考 [官方文档](https://github.com/overleaf/overleaf/wiki#release-notes) 中每个版本的更新日志.

general 的规则是, 只对 `/opt/overleaf/docker-compose.yml` 做改动. 主要用到下面两个命令

``` bash
# 拉取最新版本
docker-compose pull

# 更新 docker 配置
docker-compose up -d

```

中间遇到错误用

``` bash
docker logs <id> 
```

排查.

另外在更新前, 请 **务必备份!**

``` bash
sudo mkdir /home/overleaf_backup_20241126
sudo cp -r /home/overleaf/ /home/overleaf_backup_20241126/
```

## 3.0 -> 3.1.0

首先把 mongo 更新到 `4.2`, 修改 `docker-compose.yml`, 然后先 `docker-compose pull` 和 `docker-compose up -d`, 检查网页能登陆后再把 sharelatex 改成`image: sharelatex/sharelatex:3.1.0`, 继续上面两个命令即可.

后续的过程也是类似的, 我在这里只记录几个需要注意的点.

## 3.1.0 -> 3.2.0

把 mongo 更新到 `4.4`.

## 2025.1.2

出现了编译不了的问题, 经过排查是因为缺少相应的 package, 目前的解决方法是. 在 `/opt/overleaf` 下新建了一个文件 `sharelatex_full_dockerfile`, 内容是

``` bash
FROM sharelatex/sharelatex:3.1.0

RUN apt-get update && apt-get install -y \
    texlive-full \
    && rm -rf /var/lib/apt/lists/*
```

然后修改 `docker-compose.yml` 为

``` text
version: '2.2'
services:
    sharelatex:
        build:
            context: .
            dockerfile: sharelatex_full_dockerfile
        restart: always
        # Server Pro users:
        # image: quay.io/sharelatex/sharelatex-pro
        # image: sharelatex/sharelatex:with-texlive-full
        image: sharelatex/sharelatex:3.1.0
(其他不变)
```

目前还是先采用 `3.1.0` 用, 等待后续升级.
