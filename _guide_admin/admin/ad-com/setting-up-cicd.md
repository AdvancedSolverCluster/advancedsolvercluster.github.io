---
title: GitLab CI/CD + GitLab Runner in Docker 全自动部署服务器网页
nav_order: 1
parent: AdvancedSolver.com
---

# GitLab CI/CD + GitLab Runner in Docker 全自动部署服务器网页

*Updated: February 26, 2024*

Zhihu: [GitLab CI/CD + GitLab Runner in Docker 全自动部署服务器网页](https://zhuanlan.zhihu.com/p/482820237)

最近几天尝试给组里做一个用于各类功能的网页, 但苦于每次更新都要上服务器手动关闭打开Flask, 好累...

所幸的是已经配置好的GitLab自有服务支持的CI/CD解决了这个大麻烦！于是为了解决这个大麻烦, 我们引入这个新麻烦...

## 前提

1. 有一个正在运行的GitLab Self-hosted服务, 具有该GitLab实例的管理员权限
1. 有一个可以运行Docker的地方
1. 准备好了一个可以运行的网页前后端, 例如本文的Flask + Gunicorn

## 流程

### 注册新Runner (在Docker里)

第一步是注册一个用于跑CI/CD任务的GitLab-Runner, 你可以直接在服务器上安装gitlab-runner, 也可以新开一个docker container专门用于运行gitlab-runner, 这里我们选择了后者.

登录具有管理员权限的账号, 比如这里用的root账号, 打开 Admin Area. 在左侧找到Overview -- Runners打开配置Runners.

![admin area - runners](/guide/figure/setting-up-cicd/admin-area-runners.png)

在Runners的配置界面可以找到已经有配置好的Runner. 右侧选择Register an instance runner, 在里面可以复制之后要用的Registration token, 跳转去看官方的教程(或者下面的截图).

![runner list](/guide/figure/setting-up-cicd/runner-list.png)

Option 1/2 指定了在哪里保存gitlab-runner的config, 这里就用Option 2把config存在docker volume中.

![option 2: use docker volumes to start the runner container](/guide/figure/setting-up-cicd/use-docker-volumes.png)

在打算运行runner的机器上执行

~~~ bash
docker volume create <volume name>
~~~

生成一个volume. 拉取gitlab/gitlab-runner的image并启动container:

~~~ bash
docker run -d --name <container name> --restart always \
    -v /var/run/docker.sock:/var/run/docker.sock \
    -v <volume name>:/etc/gitlab-runner \
    gitlab/gitlab-runner:latest
~~~

确认启动正常之后就可以配置config了, 用他自带的script:

~~~ bash
docker run --rm -it -v <volume name>:/etc/gitlab-runner gitlab/gitlab-runner:latest register
~~~

其中选择`docker`作为我们的runner executor. 默认的image选择了`docker:dind` (Docker-in-Docker).

![Follow up steps](/guide/figure/setting-up-cicd/follow-up-steps.png)

在这些都做完以后, 用`docker ps`可以看到你新开的用于跑GitLab Runner的container. 用`docker exec -it <CONTAINER ID> bash`可以进入那个container, 这时候可以运行一系列`gitlab-runner`命令. 比如, `gitlab-runner list`就能看到你刚刚注册的那个GitLab Runner. 更多命令参考`gitlab-runner help`.

用`docker volume ls`可以看到你新开的用于存放Runner配置文件的volume. 用`docker volume inspect <VOLUME NAME>`可以看到相关配置文件挂载在文件系统的哪个位置, 可以修改里面的配置文件`config.toml`, 会立刻生效.

这个文件里有两个东西必须要修改, 第一是 `privileged = true`. If you want to use Docker-in-Docker, you must always use privileged = true in your Docker containers. [[1](https://docs.gitlab.com/ee/ci/docker/using_docker_build.html#use-docker-in-docker)]

第二是 `volumes = ["/cache"]`改成了`volumes = ["/var/run/docker.sock:/var/run/docker.sock", "/cache"]`, 把 Docker 外的 socket 映射到 Docker 内, 这样我们在 Docker 内 `docker ps` 的时候才能看到外面的 Docker.

### 项目 CI/CD 配置

所谓的给项目配置CI/CD, 其实是在项目的根目录下新建一个`.gitlab-ci.yml`文件, 接下来每次push的时候, GitLab都会查看这个文件里的配置运行CI/CD. GitLab提供了一个在线编辑器, 就在侧边栏的CI/CD下的Editor里, 直接编辑这个`.gitlab-ci.yml`文件.

![GitLab project CI/CD page](/guide/figure/setting-up-cicd/project-cicd.png)

当点击Create New Pipeline后, GitLab会生成一个默认的`.gitlab-ci.yml`模板.

~~~ yml
stages:          # List of stages for jobs, and their order of execution
  - build
  - test
  - deploy

build-job:       # This job runs in the build stage, which runs first.
  stage: build
  script:
    - echo "Compiling the code..."
    - echo "Compile complete."

unit-test-job:   # This job runs in the test stage.
  stage: test    # It only starts when the job in the build stage completes successfully.
  script:
    - echo "Running unit tests... This will take about 60 seconds."
    - sleep 60
    - echo "Code coverage is 90%"

lint-test-job:   # This job also runs in the test stage.
  stage: test    # It can run at the same time as unit-test-job (in parallel).
  script:
    - echo "Linting code... This will take about 10 seconds."
    - sleep 10
    - echo "No lint issues found."

deploy-job:      # This job runs in the deploy stage.
  stage: deploy  # It only runs when *both* jobs in the test stage complete successfully.
  script:
    - echo "Deploying application..."
    - echo "Application successfully deployed."
~~~

这个模板的意思是这样的:

- 最前面的stages表明, 在每次push后, 都会按顺序运行三阶段的任务, 分别为build, test和deploy. 每一个阶段只有在上一阶段成功运行, 没有报错后才会运行.
- `build-job`里的stage指明了这一任务是在build阶段运行的, 运行内容为script里的命令.
- `unit-test-job`和`lint-test-job`的stage都是test, 表明在test阶段运行且并行运行, 运行内容为script里的命令.
- `deploy-job`里的stage指明了这一任务是在deploy阶段运行的, 运行内容为script里的命令.

我们点击最下方的commit-changes, 表示保存配置并push, 这时候你就可以看到pipeline已经开始运行了, 而且其中包含三个阶段的任务. 每一阶段的任务它做以下几件事(你可以在View Pipeline的每一个阶段里看到, 蓝色的字体):

![CI/CD running page](/guide/figure/setting-up-cicd/cicd-running.png)

1. "Preparing the "docker" executor": 拉取镜像. 如果你没有在script里指定镜像(就像这个模板里没有指定), 它就会拉取你前面配置runner时所声明的默认镜像(比如我们前面默认镜像选了docker:dind). 默认的拉取策略是从docker仓库里拉取镜像(注: 可以在上文中提到的`config.toml`里在`[runners.docker]`里加上`pull_policy = "if-not-present"`, 这样就使得拉取策略变成了先找本地有没有这个镜像, 如果找不到再去远程拉取).
2. "Preparing environment": 准备环境. 新建了一个名为`runner-<runner id>-project-<project id>-concurrent-<...>`的docker container, 这里面是一个全新的环境, 里面所有东西都是初始化的. 除了镜像自带的环境外(比如docker镜像自带docker, python镜像自带python), 其他什么都没有.
3. "Getting source from Git repository": 下载仓库. 也就是你当前GitLab Repo里的所有东西, 它都帮你下载到当前目录下.
4. "Executing "step_script" stage of the job script": 运行脚本. 非常容易理解, 就是前面在`.gitlab-ci.yml`配置文件里当前阶段script里的脚本.
5. "Uploading artifacts for successful job": 上传制品. 需要用户指定什么是artifacts, 在这个模板里没有指定, 因此什么都没有上传.
6. "Cleaning up project directory and file based variables": 清空环境, 把所有东西全清空了, 包括这个container也被删除了, 所有你在CI/CD过程中生成的文件都不会被保留(甚至不会保留到下一个阶段!), 除非你通过上述第五步上传artifact.

这样一个阶段就结束了, 下一个阶段又是一个全新的阶段.

了解了CI/CD的运行机制, 我们就可以写自己的`.gitlab-ci.yml`了.

~~~ yaml
stages:
  - deploy

variables:
  DOCKER_TLS_CERTDIR: "/certs"

deploy-stage:
  stage: deploy
  only:
    - master
  image: docker:19.03.12
  services:
    - docker:19.03.12-dind
  environment:
    name: production
    url: <website-url>
  before_script:
    - docker info
    - docker ps
  script:
    - echo "Start deploy"
    - wget "https://github.com/docker/compose/releases/download/v2.2.2/docker-compose-$(uname -s)-$(uname -m)" -O /usr/local/bin/docker-compose
    - chmod +x /usr/local/bin/docker-compose
    - docker-compose down
    - docker-compose build
    - docker-compose up -d
~~~

- `stages`: 我们部署服务器网页只有部署阶段, 没有编译和运行, 所以在stages阶段只需要写一个阶段的任务: deploy.
- `variables`: 在scripts里用到的变量都在这里指明. `DOCKER_TLS_CERTDIR: "/certs"`: 由于我们使用的是dind服务，我们必须指示Docker与服务内部启动的守护进程进行对话. 这里向Docker指定创建证书的位置, Docker会在启动时自动创建它们, 并创建 `/certs/client`以在服务和作业容器之间共享, 由于在`config.toml`指定了卷挂载.
- `deploy-stage`: deploy阶段的具体任务.
  - `stage`: 表示这是deploy阶段的任务.
  - `only`: 这个关键字用于指定什么时候触发CI/CD. `only: master`就是说只有master branch被更新时才会启动CI/CD.
  - `image`和`services`表示拉取的是docker镜像, 启动dind服务.
  - `environment`: 指定这个以后, 在CI/CD运行完后, 可以在侧边栏的Deployments-Environments看到刚才的部署结果.
  - `before_script`: 这是在script前运行的脚本.
  - `script`: deploy阶段需要运行的脚本. 需要注意的是docker镜像里并没有现成的docker-compose, 所以不得不去网上下载一个...

在我们的`docker-compose.yml`中, 设置了端口转发规则, 同时在服务器的frp上又套了一层从端口到网站的映射.

### 多仓库联动的 CI/CD

正当以为大功告成时, 老板又提了一个新要求. 原来网页里有一部分静态网页里的内容是通过同事写的Markdown文件转成HTML的, 同事自己开了个仓库, 更新他的Markdown文件. 老板的要求是, 每次同事在他的仓库里提交更新后, 网页就应该进行相应的更新. 好咯, 为了完成这个任务, 必须把两个仓库连在一起了.

首先, 跑到同事的仓库里去, 改他的`.gitlab-ci.yml`(同事不会CI/CD, 说到这里, 我的privilege已经尽数体现了):

~~~ yaml
stages:          # List of stages for jobs, and their order of execution
  - deploy

deploy-to-web-job:      # This job runs in the deploy stage.
  stage: deploy
  only:
    changes:
      - <folder>/*
  trigger: <my-project-owner>/<my-project-name>
~~~

这是一个非常简单的CI/CD配置, 意思就是, 当且仅当你更新`<folder>`文件夹里的文件时, 自动触发`<my-project-owner>/<my-project-name>`(我的repo的相对uri)的CI/CD(可能有的project的深度不止2层, 根据实际情况).

再跑到我自己的仓库里, 做以下工作:

第一, 添加一个submodule, 连上同事的仓库, 这样可以直接在我的仓库里访问他的文件. 只需要更新`.gitmodules`:

~~~ text
[submodule <repo-name>]
    path = <repo-name>
    url = ../../<project-path>/<repo-name>
    branch = main
~~~

这里按照GitLab的要求, url用了相对路径. 从当前project的位置回到根的位置后再转到别的project所在的位置.

第二, 对`.gitlab-ci.yml`做一些更改. 新增一个阶段的任务, 写在stages里. 在variables里新增两行:

~~~ yaml
  GIT_SUBMODULE_STRATEGY: recursive
  GIT_SUBMODULE_UPDATE_FLAGS: --remote
~~~

表示在任务中下载仓库的过程中, 也要递归地下载submodule的内容, 且按照远程的最新commit更新(相当于我们平时用的`git submodule update --remote --recursive`).

新增的update阶段的任务我是这样写的:

~~~ yaml
update-stage:
  stage: update
  image:
    name: pandoc/core:2.17
    entrypoint: ["/bin/sh", "-c"]
  script:
    - echo "Start generating html files..."
    - if [ ! -d $IMG_TARGET ]; then mkdir -p $IMG_TARGET; fi
    - cp <path/to/img>/* $IMG_TARGET
    - if [ ! -d $GUIDE_TARGET ]; then mkdir -p $GUIDE_TARGET; fi
    - sh scripts/markdown-to-html.sh $IMG_TARGET $GUIDE_TARGET
  artifacts:
    paths:
      - $GUIDE_TARGET
~~~

`$IMG_TARGET`和`$GUIDE_TARGET`都是在前面的variables里定义的. 这里拉取了pandoc镜像, 然后我在仓库里写了一个把Markdown文件转换成HTML的脚本(`scripts/markdown-to-html.sh`, 利用了pandoc命令). 需要注意的是**必须要指定artifacts**了, 否则在这个阶段生成的HTML全部会被丢弃, 不会自动传入下一阶段的任务! 那我们就全白干了. 指定artifacts的path后, path里的东西会自动传入下一阶段.

## 结语

一切都配置完毕后, 每一次在仓库里push代码就会触发CI/CD. 你可以在CI/CD的侧边栏里查看运行过的Pipeline和任务. 运行结束后, 在服务器上利用`docker ps`查看正在运行的容器, 就可以看到上一次CI/CD新建的容器正在某个端口运行. 这样就算成功了.

最终这个配置用于展示了一个教程页面. 服务器其他管理员在写好Markdown文档之后push到仓库就会自动upstream更新到网页上, 全过程不导致掉线且大约1分钟就能看到更新. 对于没有太多计算机背景刚进组的同学也算是比较方便的一个展示服务器基本用法的入口. 终于不用再让服务器管理员当客服了!

![outcome](/guide/figure/setting-up-cicd/outcome.png)
