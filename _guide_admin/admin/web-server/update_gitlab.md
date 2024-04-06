---
title: Update GitLab
nav_order: 1
parent: GitLab Log
---

# 更新 gitlab

这篇 markdown 记录如何更新 gitlab. 我们的 gitlab 版本是 `14.6.0` (可以在 gitlab 的 `help` 界面看到当前的版本), 我们打算将其更新到 `16.10.1`. 我们主要参考 gitlab 的官方文档 <https://docs.gitlab.com/ee/update/>.

## 准备工作

### 更新前的检查

#### 检查常规配置

``` bash
sudo gitlab-rake gitlab:check
```

#### 检查数据库

```bash
sudo gitlab-rake gitlab:doctor:secrets
```

#### 检查 UI

主要包括:

- 用户可以正常登录
- project 列表可见.
- 可以访问 project issues 和 merge requests
- clone 和 push功能正常.

#### 检查 CI/CD

- Runners pick up jobs.
- Docker images can be pushed and pulled from the registry.

### 确定升级路线

在 <https://gitlab-com.gitlab.io/support/toolbox/upgrade-path/> 确定 gitlab 的升级路线, `Current` 选择 `14.6.0`, Target 选择 `16.10.1`,  `Edition` 选择 `Enterprise`, `Distro` 选择 `CentOS`. 比如我这里告诉我的升级路线是

``` text
14.9.5 => 14.10.5 => 15.0.5 => 15.4.6 => 15.11.13 => 16.1.6 => 16.3.7 => 16.7.7 => 16.10.1
```

### 备份

先输入

``` bash
sudo touch /etc/gitlab/skip-auto-backup
```

它的目的是跳过安装新版本时候的自动备份.

然后, 参考 <https://docs.gitlab.com/ee/administration/backup_restore/backup_gitlab.html> 进行手动备份. 具体来说, 分为下面两步 (因为我们没用对象存储 objective strogae):

- 用 backup 命令备份. 输入

``` bash
sudo gitlab-backup create
```

备份.

- 手动备份配置文件. 配置文件通常位于 `/etc/gitlab/` 目录下, 我们用

```bash
sudo cp -R /etc/gitlab /path/to/backup/directory
```

来进行备份. 这里我选择的目录是 `/home/backup_gitlab_config`. 此外, 我们强烈建议把前面 backup 备份的文件复制到这里.

### 检查后台迁移的状态

参考 <https://docs.gitlab.com/ee/update/background_migrations.html>.

## 开始升级

遵循之前得到的升级路线进行升级即可, 我们还需要查看 <https://docs.gitlab.com/ee/update/index.html#version-specific-upgrading-instructions>, 它给出了升级到特定版本时的注意事项.

利用

``` bash
sudo yum install gitlab-ee-14.9.5
```

升级到 `14.9.5` 版本, 最后出现 `Complete!` 即表示更新完成, 我们可以在更新完成后等待一段时间登录 gitlab 查看是否更新成功. 如果登陆遇到问题, 可以使用

``` bash
sudo gitlab-ctl status
```

查看 gitlab 的状态. 在需要的时候使用

``` bash
sudo gitlab-ctl reconfigure
sudo gitlab-ctl restart
```

重启 gitlab. 对于升级路线上的每个版本, 我们都有类似的处理.

## 问题记录

在更新到 `16.1.6` 时, 遇到了下面的问题

``` text
gitlab preinstall: Your version of PostgreSQL is no longer supported. Please upgrade your PostgreSQL version to 13.
```

解决方法是

``` bash
sudo gitlab-ctl pg-upgrade -V 13
```

然后出现

``` text
==== Upgrade has completed ====
Please verify everything is working and run the following if so
sudo rm -rf /var/opt/gitlab/postgresql/data.12
sudo rm -f /var/opt/gitlab/postgresql-version.old
```

执行相应的命令即可.
