---
title: 如何在服务器上安装并配置 slurm
nav_order: 8
parent: CentOS Cluster (legacy)
---

# "如何在服务器上安装并配置 slurm"

*Last modified: February 26, 2024*

*April 1, 2022, [Jingyu Liu](mailto:381258337@qq.com)*
(6/17 更新到slurm22.05)

这篇 markdown 主要记录在服务器上安装 slurm 的过程以及 (可能) 遇到的问题. 我们将以在 loginNode, bigMem0 和 bigMem1 安装和配置 slurm 作为例子, 其中 loginNode, bigMem0 作为管理节点和计算节点, bigMem1 作为计算节点.

概括来说, 我们的过程主要分为以下几步.

- 安装 munge.

- 安装 slurm.

- 配置 slurm.

- 启动服务, 检查.

我们将详细说明这些步骤.

## STEP 0 关闭 (已有的) slurm 和 munge

在每个节点运行下面的脚本:

~~~ bash
sudo systemctl stop slurmd
sudo systemctl stop slurmdbd
sudo systemctl stop slurmctld
sudo systemctl stop munge
~~~

## STEP 1 安装 munge

你可以在 munge 的官方文档 <https://dun.github.io/munge/> 找到 munge 的安装包和安装的详细步骤. munge 需要安装在每个节点上.

主要的命令是

~~~  bash
tar xJf munge-0.5.14.tar.xz
cd munge-0.5.14
./configure --prefix=/usr --sysconfdir=/etc --localstatedir=/var --runstatedir=/run
make                     \
make check               \
sudo make install
~~~

然后使用 `munge -V` 来检查是否安装成功, 若成功, 会显示形如 `munge-0.5.14 (2020-01-14)` 的信息.

你可能在执行第三行 `./configure` 时遇到 `configure: error: unable to locate cryptographic library`, 此时可以运行

~~~  bash
yum -y install openssl openssl-devel
~~~

来安装所需要的包，注意 yum 源下的 openssl 版本较低.

或者遇到下面的报错

`munge: error while loading shared libraries: libmunge.so.2: cannot open shared object file: No such file or directory`

此时, 请运行下面的命令.

~~~  bash
ldd /usr/sbin/mungekey | grep libmunge
    libmunge.so.2 => not found
sudo ldconfig
ldd /usr/sbin/mungekey | grep libmunge
~~~


请对比第一行和第三行出现的结果. 然后重新 `sudo make install` 即可.

在安装好了之后, 我们在每个节点运行 `add_munge_and_slurm_user.sh`:

~~~  bash
if id munge; then sudo userdel -r -f munge; fi
if id slurm; then sudo userdel -r -f slurm; fi

sudo groupadd -g 966 munge
sudo useradd  -m -c "MUNGE Uid and Gid Emporium" -d /var/lib/munge -u 966 -g munge -s /sbin/nologin munge
sudo groupadd -g 967 slurm
sudo useradd  -m -c "SLURM workload manager" -d /var/lib/slurm -u 967 -g slurm  -s /bin/bash slurm

id munge
id slurm
~~~

它的作用是创建 munge 组 和 slurm 组.

然后, 我们在任何一个管理节点 (这里是 bigMem0) 上运行 `generate_munge_key.sh`:

~~~  bash
sudo rngd -r /dev/urandom
sudo /usr/sbin/create-munge-key -r -f

sudo sh -c  "dd if=/dev/urandom bs=1 count=1024 > /etc/munge/munge.key"
sudo chown munge: /etc/munge/munge.key
sudo chmod 400 /etc/munge/munge.key
sudo cp /etc/munge/munge.key ~
sudo chown munge: ~/munge.key
~~~

之后, 我们将 munge.key 用 scp 复制到其他每个节点下, 并运行 `sync_munge_key.sh` (在管理节点也要运行这个):

~~~ bash
sudo cp ~/munge.key /etc/munge
sudo chown -R munge: /etc/munge/ /var/log/munge/ /run/munge /var/lib/munge
sudo chmod 0700 /etc/munge/ /var/log/munge/
sudo systemctl enable munge
sudo systemctl restart munge
~~~

特别注意, 在执行这一步前, 我们需要保证时钟是同步的, 这可以通过 `sudo ntpdate 10.108.68.100` 做到, 这里 `10.108.68.100` 是复旦的内网 ip.

在做完上面这些后, 我们在所有节点运行 `test_munge.sh` 以检查是否成功, 脚本如下:

~~~ bash
echo "Test munge on $(hostname)"
munge -n
munge -n | unmunge
~~~

~~~
munge -n -t 10 | ssh bigMem0 unmunge
munge -n -t 10 | ssh bigMem1 unmunge
munge -n -t 10 | ssh -p 10888 loginNode unmunge
~~~

这里要注意, 我们的最后几行事实上需要遍历所有节点, 请根据实际情况修改.

## STEP 2: 安装 MYSQL
为了记录任务所用资源需要一个数据库. 在loginNode上安装MySQL.
~~~ bash
wget -c https://dev.mysql.com/get/mysql80-community-release-el7-6.noarch.rpm
sudo yum -y install mysql80-community-release-el7-6.noarch.rpm
sudo rpm --import https://repo.mysql.com/RPM-GPG-KEY-mysql-2022
sudo yum -y install mysql-community-server
sudo systemctl start mysqld.service
~~~

使用

~~~ bash
sudo grep "password" /var/log/mysqld.log
~~~

查看root的初始密码, 然后登录

~~~ bash
mysql -u root -p
~~~

在mySQL里

~~~ sql
CREATE USER 'slurm'@'%' IDENTIFIED WITH mysql_native_password BY 'da4jia1deTeXshi4ti3yu4lao3shi1jiao1de?';
GRANT ALL ON slurm_acct_db.* TO 'slurm'@'%';
CREATE DATABASE slurm_acct_db;
GRANT ALL ON job_comp_db.* TO 'slurm'@'%';
CREATE DATABASE job_comp_db;
SHOW ENGINES;
SHOW VARIABLES LIKE 'innodb_buffer_pool_size';
~~~

接下来`sudo vim /etc/my.cnf`
加入这四行

~~~
[mysqld]
innodb_buffer_pool_size=4096M
innodb_log_file_size=64M
innodb_lock_wait_timeout=900
~~~

然后 `sudo systemctl restart mysqld`. 再次打开MySQL看 `SHOW VARIABLES LIKE 'innodb_buffer_pool_size';` 会发现这个变量增大了.

## STEP 3: 安装dependencies(JSON, HTTP Parser, YAML, JWT)+配置JWT
在所有机器上运行. 其中可能需要预装包, 另外记录. (就装在默认目录下了)

JSON:

~~~ bash
module load CMake
git clone --depth 1 --single-branch -b json-c-0.15-20200726 https://github.com/json-c/json-c.git json-c
mkdir json-c-build
cd json-c-build
cmake ../json-c
make -j24
sudo make install
cd ..
~~~

HTTP Parser:

~~~ bash
git clone --depth 1 --single-branch -b v2.9.4 https://github.com/nodejs/http-parser.git http_parser-c
cd http_parser-c
make -j24
sudo make install
cd ..
~~~

YAML Parser:

~~~ bash
git clone --depth 1 --single-branch -b 0.2.5 https://github.com/yaml/libyaml libyaml
cd libyaml
./bootstrap
./configure
make -j24
sudo make install
cd ..
~~~

JWT:

~~~ bash
git clone --depth 1 --single-branch -b v1.12.0 https://github.com/benmcollins/libjwt.git libjwt
cd libjwt
autoreconf --force --install
./configure --prefix=/usr/local
make -j24
sudo make install
sudo ldconfig -v
cd ..
~~~

如果configure过程遇到需要`jansson`的问题, 则应该 `sudo yum install jansson jansson-devel`.

JWT配置: 在loginNode上

~~~ bash
sudo dd if=/dev/random of=/var/spool/slurmctld/jwt_hs256.key bs=32 count=1
sudo chown slurm:slurm /var/spool/slurmctld/jwt_hs256.key
sudo chmod 0600 /var/spool/slurmctld/jwt_hs256.key
~~~

并把这个key也复制到计算节点的对应位置并更改权限.

安装其他依赖

~~~ bash
sudo yum install mysql-devel pam-devel hdf5 hdf5-devel hwloc hwloc-devel
~~~


## 安装 slurm
下载slurm最新版本22.05.2.

~~~ bash
wget https://download.schedmd.com/slurm/slurm-22.05.2.tar.bz2
tmp=$(md5sum slurm-22.05.2.tar.bz2)
if [[ $tmp != a56f520b022dcd7610de4082fcb4ac7a* ]]; then exit 1;  fi
tar --bzip -x -f slurm-22.05.2.tar.bz2
unset tmp
cd slurm-22.05.2
~~~

修改`src/salloc/salloc.c`, 1135行把`i>1`改成`i>=0`.

编译安装slurm.

~~~ bash
export PKG_CONFIG_PATH=/usr/local/lib/pkgconfig/:$PKG_CONFIG_PATH
./configure --prefix=/usr --sysconfdir=/etc/slurm --enable-pam --with-pam_dir=/lib/slurm/pam --with-http-parser=/usr/local/ --with-yaml=/usr/local/  --with-jwt=/usr/local/ --enable-slurmrestd
make -j24
sudo make install
slurmd -V
~~~
注意看`./configure`的结果, 留意`MySQL test program built properly`之类的字眼.

安装成功的标志是, 输入 `slurmd -V` 显示类似于 `slurm 22.05.02` 的结果.

## STEP 3 配置 slurm
`slurm.conf` (lscpu):
~~~ conf
# slurm.conf file generated by configurator.html.
# Put this file on all nodes of your cluster.
# See the slurm.conf man page for more information.
#
ClusterName=clusterHPC
SlurmctldHost=loginNode
SlurmctldHost=bigMem0
#SlurmctldHost=
#
#DisableRootJobs=NO
#EnforcePartLimits=NO
#Epilog=
#EpilogSlurmctld=
#FirstJobId=1
#MaxJobId=67043328
GresTypes=gpu
#GroupUpdateForce=0
#GroupUpdateTime=600
#JobFileAppend=0
#JobRequeue=1
#JobSubmitPlugins=lua
#KillOnBadExit=0
#LaunchType=launch/slurm
#Licenses=foo*4,bar
#MailProg=/bin/mail
#MaxJobCount=10000
#MaxStepCount=40000
#MaxTasksPerNode=512
MpiDefault=none
#MpiParams=ports=#-#
#PluginDir=
#PlugStackConfig=
#PrivateData=jobs
ProctrackType=proctrack/cgroup
#Prolog=/etc/slurm/slurm.prolog
PrologFlags=contain
#PrologSlurmctld=
#PropagatePrioProcess=0
#PropagateResourceLimits=
#PropagateResourceLimitsExcept=
#RebootProgram=
ReturnToService=1
SlurmctldPidFile=/var/run/slurmctld.pid
SlurmctldPort=6817
SlurmdPidFile=/var/run/slurmd.pid
SlurmdPort=6818
SlurmdSpoolDir=/var/spool/slurmd
SlurmUser=slurm
#SlurmdUser=root
#SrunEpilog=
#SrunProlog=
StateSaveLocation=/var/spool/slurmctld
SwitchType=switch/none
#TaskEpilog=
TaskPlugin=task/cgroup,task/affinity
#TaskProlog=/etc/slurm/slurm.prolog
#TopologyPlugin=topology/tree
#TmpFS=/tmp
#TrackWCKey=no
#TreeWidth=
#UnkillableStepProgram=
#UsePAM=0
#
#
# TIMERS
#BatchStartTimeout=10
#CompleteWait=0
#EpilogMsgTime=2000
#GetEnvTimeout=2
#HealthCheckInterval=0
#HealthCheckProgram=
InactiveLimit=300
KillWait=300
#MessageTimeout=10
#ResvOverRun=0
MinJobAge=300
#OverTimeLimit=0
SlurmctldTimeout=300
SlurmdTimeout=300
#UnkillableStepTimeout=60
#VSizeFactor=0
Waittime=300
#
#
# SCHEDULING
#DefMemPerCPU=0
#MaxMemPerCPU=0
#SchedulerTimeSlice=30
SchedulerType=sched/backfill
SelectType=select/cons_tres
SelectTypeParameters=CR_Core
#
#
# JOB PRIORITY
#PriorityFlags=
#PriorityType=priority/basic
#PriorityDecayHalfLife=
#PriorityCalcPeriod=
#PriorityFavorSmall=
#PriorityMaxAge=
#PriorityUsageResetPeriod=
#PriorityWeightAge=
#PriorityWeightFairshare=
#PriorityWeightJobSize=
#PriorityWeightPartition=
#PriorityWeightQOS=
#
# LOGGING AND ACCOUNTING
#AccountingStorageEnforce=0
AccountingStorageHost=loginNode
AccountingStoragePass=/var/run/munge/munge.socket.2
AccountingStoragePort=6819
AccountingStorageType=accounting_storage/slurmdbd
AccountingStorageUser=slurm
# AccountingStoreFlags=job_comment
JobCompHost=loginNode
JobCompLoc=job_comp_db
JobCompPass=da4jia1deTeXshi4ti3yu4lao3shi1jiao1de?
JobCompPort=3306
JobCompType=jobcomp/mysql
JobCompUser=slurm
#JobContainerType=job_container/none
JobAcctGatherFrequency=30
JobAcctGatherType=jobacct_gather/cgroup
SlurmctldDebug=info
SlurmctldLogFile=/var/log/slurmctld.log
SlurmdDebug=info
SlurmdLogFile=/var/log/slurmd.log
#SlurmSchedLogFile=
#SlurmSchedLogLevel=
#DebugFlags=
#
# POWER SAVE SUPPORT FOR IDLE NODES (optional)
#SuspendProgram=
#ResumeProgram=
#SuspendTimeout=
#ResumeTimeout=
#ResumeRate=
#SuspendExcNodes=
#SuspendExcParts=
#SuspendRate=
#SuspendTime=
#
#
# COMPUTE NODES
NodeName=loginNode CPUs=24 RealMemory=128546 Sockets=2 CoresPerSocket=12 ThreadsPerCore=1 State=UNKNOWN Gres=gpu:nvidia_geforce_gtx_1080_ti:2
NodeName=bigMem0 CPUs=64 RealMemory=1030499 Sockets=2 CoresPerSocket=16 ThreadsPerCore=2 State=UNKNOWN Gres=gpu:tesla_t4:4
NodeName=bigMem1 CPUs=64 RealMemory=1030499 Sockets=2 CoresPerSocket=16 ThreadsPerCore=2 State=UNKNOWN Gres=gpu:nvidia_a30:4
NodeName=bigMem2 CPUs=256 RealMemory=1030499 Sockets=2 CoresPerSocket=64 ThreadsPerCore=2 State=UNKNOWN
PartitionName=partition Nodes=bigMem[0-2] MaxTime=7-0 DefaultTime=1-0 Default=YES State=UP
~~~

之后, 我们将 `slurm.conf` 复制到其他每个节点.

`cgroup.conf`:
~~~
###
#
# Slurm cgroup support configuration file
#
# See man slurm.conf and man cgroup.conf for further
# information on cgroup configuration parameters
#--
#CgroupAutomount=yes
CgroupAutomount=yes
CgroupMountpoint=/sys/fs/cgroup
ConstrainCores=yes
ConstrainDevices=yes
ConstrainKmemSpace=no        #avoid known Kernel issues
ConstrainRAMSpace=yes
ConstrainSwapSpace=yes
#ConstrainCores=no
#ConstrainRAMSpace=no
~~~

然后再每个节点运行 `configure_slurm.sh`:

~~~  bash
for dir in /var/spool/slurm /var/spool/slurmd /var/spool/slurmctld /var/spool/slurm/slurmctld /etc/slurm
do
    sudo mkdir -p $dir
    sudo chown slurm: $dir
    sudo chmod 755 $dir
done

for file in /var/log/slurmctld.log /var/log/slurmd.log /var/run/slurmctld.pid /var/run/slurmd.pid /var/log/slurmacct.log
do
    sudo touch $file
    sudo chown slurm: $file
done

sudo ldconfig -n /usr/lib/slurm
sudo cp slurm-22.05.2/etc/*.service /etc/systemd/system
~~~

在loginNode上`/etc/slurm/slurmdbd.conf`:
~~~ conf
#
# Sample /etc/slurm/slurmdbd.conf
#
ArchiveEvents=yes
ArchiveJobs=yes
ArchiveResvs=yes
ArchiveSteps=no
ArchiveSuspend=no
ArchiveTXN=no
ArchiveUsage=no
#ArchiveScript=/usr/sbin/slurm.dbd.archive
AuthInfo=/var/run/munge/munge.socket.2
AuthType=auth/munge
AuthAltTypes=auth/jwt
AuthAltParameters=jwt_key=/var/spool/slurmctld/jwt_hs256.key
DbdHost=loginNode
DebugLevel=info
PurgeEventAfter=1month
PurgeJobAfter=12month
PurgeResvAfter=1month
PurgeStepAfter=1month
PurgeSuspendAfter=1month
PurgeTXNAfter=12month
PurgeUsageAfter=24month
LogFile=/var/log/slurmdbd.log
PidFile=/var/run/slurmdbd.pid
SlurmUser=slurm
StoragePass=da4jia1deTeXshi4ti3yu4lao3shi1jiao1de?
StorageType=accounting_storage/mysql
StorageUser=slurm
~~~
并且
~~~ bash
sudo chown slurm: /etc/slurm/slurmdbd.conf
sudo chmod 600 /etc/slurm/slurmdbd.conf
~~~

## STEP 4 启动服务, 检查

注册cluster:
~~~ bash
sacctmgr create cluster clusterHPC
~~~

先启动 slurmdbd, 再启动 slurmctld, 最后 slurmd.

做法是, 现在每个节点运行 `sudo systemctl daemon-reload`, 然后在存储节点运行 `sudo systemctl start slurmdbd`, 在管理节点运行 `sudo systemctl start slurmctld`, 最后, 在所有节点运行 `sudo systemctl start slurmd`. 你可以通过脚本来做这件事.

做完这些后, 如果幸运的话, 我们已经成功了. 下面要做的就是测试是否成功, 你可以通过 `sinfo`, `srun`, `salloc` 来进行检查, 你还可能用到 `systemctl status`, `squeue`, `scancel`. 这些命令的使用方法可以参考 <https://docs.hpc.sjtu.edu.cn/job/slurm.html>, 事实上, 这是一篇很好的用户手册, 对于管理员, 你可以参考相应的 <http://hmli.ustc.edu.cn/doc/linux/slurm-install/index.html>.

如果还有预料之外的问题, 你可以前往 `/var/log/` 目录下访问相应的日志, 如 `slurmd.log` 来查看问题.

新机器别忘开防火墙和开机自启（见下）

## DEBUG 记录

你可以在 <https://slurm.schedmd.com/troubleshoot.html> 获得大部分问题的解决方法.

### 运行 `sinfo` 提示 `slurm_load_partitions: Unable to contact slurm controller (connect failure)`

查看 `slurmctld.log`, 提示

``error: Possible corrupt pidfile `/var/run/slurmctld.pid'``

因此我们在每个节点手动运行

~~~  bash
sudo touch /var/run/slurmctld.pid
sudo chown slurm: /var/run/slurmctld.pid
~~~

然后启动服务, 发现仍出现相同错误. 查看 `slurmd.log` 提示

`error: Unable to register: Unable to contact slurm controller (connect failure)`

输入 `slurmctld -Dvvvvvv` 发现错误

~~~  txt
(null): _log_init: Unable to open logfile `/var/log/slurmctld.log': Permission denied
slurmctld: error: Unable to open pidfile `/var/run/slurmctld.pid': Permission denied
slurmctld: Not running as root. Can't drop supplementary groups
slurmctld: fatal: Failed to set GID to 967
~~~

最后发现是 `configure_slurm.sh` 写错, 我们已经改正 (你现在看到的是改正后的版本).

### SLURMD running but not responding

在 bigMem1 上使用 `srun hostname` 时一直无法成功, 查看 `log` 文件发现提示 `error: connect io: No route to host`, 此时在 bigMem0 上运行 `telent bigMem1 6817` 发现无法连接.

随后发现是防火墙的问题, 我们在 bigMem0 和 bigMem1 上打开对内网的防火墙, 操作如下 (我们以在 bigMem1 上为例, 对其它节点类似)

~~~  bash
sudo systemctl status firewalld
sudo firewall-cmd --get-active-zones
sudo firewall-cmd --list-all --zone=trusted
sudo firewall-cmd --zone=trusted --add-source=192.168.2.0/24 --permanent
sudo systemctl restart firewalld
~~~

这样问题就得到了解决.

### 运行 `srun hostname` 无反应

输入 `slurmd -Dvvvvvv` 提示

~~~  txt
(null): _log_init: Unable to open logfile `/var/log/slurmd.log': Permission denied
slurmd: error: chmod(/var/spool/slurmd, 0755): Operation not permitted
slurmd: error: Unable to initialize slurmd spooldir
slurmd: error: slurmd initialization failed
~~~

还是防火墙的问题.

## 开机自启
Yuejia Zhang, Apr 12, 2022
~~~ bash
sudo systemctl enable slurmd
~~~
on three machines.

## ubuntu上的slurm安装
步骤基本一致, 但需要注意的是Ubuntu用的是cgroup/v2而我们的slurm用的是cgroup/v1, 所以需要修改kernel的boot参数：
~~~ bash
sudo vim /etc/default/grub
GRUB_CMDLINE_LINUX="cgroup_enable=memory swapaccount=1 systemd.unified_cgroup_hierarchy=false systemd.legacy_systemd_cgroup_controller=false"
sudo update-grub
sudo reboot
~~~
参考资料(从Debian玩家那里找来的):

- https://groups.google.com/g/slurm-users/c/EJWn7nC6z7g?pli=1
- https://www.debian.org/releases/stable/amd64/release-notes/ch-information.en.html#openstack-cgroups
