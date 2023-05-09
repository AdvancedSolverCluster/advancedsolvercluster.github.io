---
title: "Overleaf Log"
---


参考 https://github.com/overleaf/overleaf/wiki/

## 在旧服务器上

1. 提醒overleaf所有人下线
2. 用```sudo docker stop sharelatex'''和'''sudo docker stop mongo redis```停止sharelatex,mongo,redis的服务(或```sudo docker-compose down```)
3. 在/home/sharelatex目录下用```sudo tar -czvf backup-2022-02-14-1500.tar.gz *```打包数据文件
4. 用```scp backup-2022-02-14-1500.tar.gz web0:/home/overleaf/```将压缩文件发送到新服务器(这里是web0)

## 在新服务器上

1. 用``` sudo docker pull sharelatex/sharelatex```拉取sharelatex的docker
2. 用```sudo wget https://raw.githubusercontent.com/overleaf/overleaf/old-master/docker-compose.yml```拉取```docker-compose.yml```文件
3. ```sudo vim docker-compose.yml```作以下修改(行数不一定完全准确)
LINE 15 sharelatex的port ```35888:80```
LINE 20 sharelatex的volume```/home/overleaf/sharelatex_data:/var/lib/sharelatex```
LINE 28 ```SHARELATEX_APP_NAME: CASH Overleaf Instance```
LINE 52 ```SHARELATEX_SITE_URL: https://overleaf.advancedsolver.com```
LINE 53 ```SHARELATEX_NAV_TITLE: "CASH Overleaf Instance" ```
LINE 54 ```# SHARELATEX_HEADER_IMAGE_URL: http://somewhere.com/mylogo.png```
LINE 55 ```SHARELATEX_ADMIN_EMAIL: "gitlab88@163.com"```
LINE 65 ```SHARELATEX_EMAIL_SMTP_HOST: "smtp.163.com"```
LINE 66 ```SHARELATEX_EMAIL_SMTP_PORT: 465```
LINE 67 ```SHARELATEX_EMAIL_SMTP_SECURE: 'true'```
LINE 68 ```SHARELATEX_EMAIL_SMTP_USER: "gitlab88@163.com"```
LINE 69 ```SHARELATEX_EMAIL_SMTP_PASS: "[MASKED]"```
LINE 70 ```SHARELATEX_EMAIL_SMTP_TLS_REJECT_UNAUTH: 'true'```
LINE 71 ```SHARELATEX_EMAIL_SMTP_IGNORE_TLS: 'false'```
LINE 72 ```SHARELATEX_EMAIL_SMTP_NAME: 'CASH Overleaf Notification'```
LINE 73 ```SHARELATEX_EMAIL_SMTP_LOGGER: 'true'```
LINE 74 ```SHARELATEX_CUSTOM_EMAIL_FOOTER: "This system is run by department 88."```
LINE 75 ```SHARELATEX_PASSWORD_VALIDATION_MIN_LENGTH: 12```
LINE 76 ```SHARELATEX_PASSWORD_VALIDATION_PATTERN: "aA1"```
LINE 114 ```- /home/overleaf/mongo_data:/data/db```
LINE 119 ```- /home/overleaf/redis_data:/data```
4. 用```sudo docker-compose up -d```启动服务
5. 用```sudo docker-compose down```停止服务
5. 把backup的文件都以root身份copy到对应位置```sudo cp -R backup/* ./```
6. ```sudo docker-compose up -d```
7. 用```sudo docker ps```查看容器是否运行在正确的端口

### 如用toolkit, 请注意yml文件和env文件的区别，如
```# toolkit/variables.env```
```SHARELATEX_NAV_TITLE=My ShareLaTeX Instance```
```# docker-compose.yml```
```SHARELATEX_NAV_TITLE:'My ShareLaTeX Instance'```
