---
title: "How to start an HPC cluster on centos 7 Linux servers"
---

# "How to start an HPC cluster on centos 7 Linux servers"

考虑到书写的方便性，直接在markdown里记录下来了配置的几乎全过程。 不过似乎知乎的配色方案不太好看，原本在mdnice里写的还挺漂亮。经过Grammarly查错，不知道会不会把本来的命令给改了...按说是没有的。**未经许可，请勿翻译/转载。**

## **How to start an HPC cluster on centos 7 Linux servers**

Prepare several Linux servers with centos 7 installed. Make sure they are physically connected and get their IPs.

In the following, we will use these 2 machines as an example:

- `hostname: loginNode, ip: 10.66.66.88`
- `hostname: bigMem0, ip: 10.66.66.100`

I assume you already have a user named _USERNAME_ with `sudo` privileges. If not, open `/etc/sudoers` and check if this line is there: `%wheel ALL=(ALL) ALL`. Uncomment it so that all users in the `wheel` group can use `sudo`. Use `usermod` to add a user to your wheel group: `usermod USERNAME \-G wheel \-a`\(_Not tested_\).

Allow this user to do `mv, mkdir` without password confirm: add to the last line of `sudoers` by `sudo visudo`: `USERNAME *TAB HERE* ALL=(ALL) *TAB HERE* NOPASSWD: ALL`.\(_possibly not safe\?_\)

It's better than to disallow `root` to login from `ssh` for safety reasons. Everything following will run under USERNAME \(with `sudo` privileges\).

It is ok if you work out the following with the `root` user. \(_Not tested_\)

Add this username to the environment, and we will use it later: `export ClusterManager=USERNAME`.

## **Dispatch RSA keys to each slave node for ssh login**

We will later use `ssh` to transfer scripts and make other configurations. So let's set up public-key authentication for ssh between clusters.

Usually, you won't want to expose your port 22 to the public. You might change the port that `ssh` uses by modifying its config `/etc/ssh/sshd_config`: Add a new line `Port 10086`, and remove line `Port 22`. Disable `root` login by set `PermitRootLogin no`. Restart `sshd` for rules to take effect: `sudo systemctl restart sshd`.

CentOs uses SELinux to enhance its safety. This change should be reported by `sudo semanage port \-a \-t ssh_port_t \-p tcp 10086`. If the system cannot find `semanage`, install it with `sudo yum install policycoreutils-python.x86_64`.

Now, open _the manage node's_ terminal and generate keys: `ssh-keygen \-t rsa \-b 4096 \-N ""` at the defualt position `~/.ssh/id_rsa`. Copy your public key \(in `id_rsa.pub`\) and paste it to the end of _all slave nodes'_ file: `~/.ssh/authorized_keys`.

Test if this is correctly configured. On manage node, type `ssh USERNAME@SLAVE \-i ~/.ssh/id_rsa \-p 10086` to see if it requires password to login.

Add the port number to the environment, and we will use it later: `export ClusterPort=10086`.

## **Install \&\& start slurm daemon and slurm control daemon on nodes**

1.  ensure that no existed munge user or slurm user in every machine. If yes, delete them directly. `sudo vim /etc/passwd` and find `munge`/`slurm`. To delete, use `userdel`.
2.  follow the link `https://www.ni-sp.com/slurm-build-script-and-container-commercial-support/`\(copied and _modified_ version following\) to complete most of the work. These should be modified:

- Line 90: The newest VER is now 20.11.8.
- Line 121: Delete the HOST configuration line.
- Line 123-186: Detailed configuration file for slurm. Edit carefully or generate it from `https://slurm.schedmd.com/configurator.html`

  - in case using MySQL for job completion logging. Install MySQL database to the selected position.

```bash
 #!/bin/bash

yum install mariadb-server mariadb-devel -y

export MUNGEUSER=966
sudo groupadd -g $MUNGEUSER munge
sudo useradd  -m -c "MUNGE Uid 'N' Gid Emporium" -d /var/lib/munge \
-u $MUNGEUSER -g munge  -s /sbin/nologin munge
export SLURMUSER=967
sudo groupadd -g $SLURMUSER slurm
sudo useradd  -m -c "SLURM workload manager" -d /var/lib/slurm \
-u $SLURMUSER -g slurm  -s /bin/bash slurm

sudo yum install epel-release -y
sudo yum install \
https://dl.fedoraproject.org/pub/epel/epel-release-latest-7.noarch.rpm -y

sudo yum install munge munge-libs munge-devel -y

sudo yum install rng-tools -y
sudo rngd -r /dev/urandom

sudo /usr/sbin/create-munge-key -r -f

sudo sh -c  "dd if=/dev/urandom bs=1 count=1024 > /etc/munge/munge.key"
sudo chown munge: /etc/munge/munge.key
sudo chmod 400 /etc/munge/munge.key

sudo systemctl enable munge
sudo systemctl start munge

sudo yum install python3 gcc openssl openssl-devel pam-devel \
numactl numactl-devel hwloc lua readline-devel ncurses-devel \
man2html libibmad libibumad rpm-build \
perl-ExtUtils-MakeMaker.noarch -y
sudo yum install rrdtool-devel lua-devel hwloc-devel -y

mkdir slurm-tmp
cd slurm-tmp
export VER=20.11.8
wget https://download.schedmd.com/slurm/slurm-$VER.tar.bz2
rpmbuild -ta slurm-$VER.tar.bz2

rm slurm-$VER.tar.bz2
cd ..
rmdir slurm-tmp

cd ~/rpmbuild/RPMS/x86_64/
sudo yum --nogpgcheck localinstall slurm-[0-9]*.el*.x86_64.rpm \
slurm-contribs-*.el*.x86_64.rpm slurm-devel-*.el*.x86_64.rpm \
slurm-example-configs-*.el*.x86_64.rpm slurm-libpmi-*.el*.x86_64.rpm  \
slurm-pam_slurm-*.el*.x86_64.rpm slurm-perlapi-*.el*.x86_64.rpm \
slurm-slurmctld-*.el*.x86_64.rpm \
slurm-slurmd-*.el*.x86_64.rpm slurm-slurmdbd-*.el*.x86_64.rpm -y

sudo cat > /etc/slurm/cgroup.conf << EOF
###
#
# Slurm cgroup support configuration file
#
# See man slurm.conf and man cgroup.conf for further
# information on cgroup configuration parameters
#--
CgroupAutomount=yes

ConstrainCores=no
ConstrainRAMSpace=no

EOF

sudo mkdir /var/spool/slurm
sudo chown slurm:slurm /var/spool/slurm
sudo chmod 755 /var/spool/slurm
sudo mkdir /var/spool/slurm/slurmctld
sudo chown slurm:slurm /var/spool/slurm/slurmctld
sudo chmod 755 /var/spool/slurm/slurmctld
sudo mkdir -p /var/spool/slurm/cluster_state
sudo chown slurm:slurm /var/spool/slurm/cluster_state
sudo touch /var/log/slurmctld.log
sudo chown slurm:slurm /var/log/slurmctld.log
sudo touch /var/log/slurm_jobacct.log /var/log/slurm_jobcomp.log
sudo chown slurm: /var/log/slurm_jobacct.log /var/log/slurm_jobcomp.log




```

3\. Go to [https://slurm.schedmd.com/configurator.html](https://link.zhihu.com/?target=https%3A//slurm.schedmd.com/configurator.html) and create a configuration file. Put it to `/etc/slurm/slurm.conf`. Following is an example:

```text
# slurm.conf file generated by configurator.html.
# Put this file on all nodes of your cluster.
# See the slurm.conf man page for more information.
#
SlurmctldHost=loginNode
#
#DisableRootJobs=NO
#EnforcePartLimits=NO
#Epilog=
#EpilogSlurmctld=
#FirstJobId=1
#MaxJobId=999999
#GresTypes=
#GroupUpdateForce=0
#GroupUpdateTime=600
#JobFileAppend=0
#JobRequeue=1
#JobSubmitPlugins=1
#KillOnBadExit=0
#LaunchType=launch/slurm
#Licenses=foo*4,bar
#MailProg=/bin/mail
#MaxJobCount=5000
#MaxStepCount=40000
#MaxTasksPerNode=128
MpiDefault=pmi2
#MpiParams=ports=#-#
#PluginDir=
#PlugStackConfig=
#PrivateData=jobs
ProctrackType=proctrack/cgroup
#Prolog=
#PrologFlags=
#PrologSlurmctld=
#PropagatePrioProcess=0
#PropagateResourceLimits=
#PropagateResourceLimitsExcept=
#RebootProgram=
ReturnToService=1
SlurmctldPidFile=/var/run/slurmctld.pid
SlurmctldPort=6816
SlurmdPidFile=/var/run/slurmd.pid
SlurmdPort=6818
SlurmdSpoolDir=/var/spool/slurmd
SlurmUser=slurm
#SlurmdUser=root
#SrunEpilog=
#SrunProlog=
StateSaveLocation=/var/spool/slurm
SwitchType=switch/none
#TaskEpilog=
TaskPlugin=task/affinity
#TaskProlog=
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
InactiveLimit=0
KillWait=30
#MessageTimeout=10
#ResvOverRun=0
MinJobAge=300
#OverTimeLimit=0
SlurmctldTimeout=120
SlurmdTimeout=300
#UnkillableStepTimeout=60
#VSizeFactor=0
Waittime=0
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
#
# LOGGING AND ACCOUNTING
#AccountingStorageEnforce=0
#AccountingStorageHost=
#AccountingStoragePass=
#AccountingStoragePort=
AccountingStorageType=accounting_storage/none
#AccountingStorageUser=
AccountingStoreJobComment=YES
ClusterName=cluster
#DebugFlags=
JobCompHost=loginNode
JobCompLoc=slurmLogDb
JobCompPass=slurmLog1!
JobCompPort=3306
JobCompType=jobcomp/mysql
JobCompUser=slurmLog
#JobContainerType=job_container/none
JobAcctGatherFrequency=30
JobAcctGatherType=jobacct_gather/none
SlurmctldDebug=info
#SlurmctldLogFile=
SlurmdDebug=info
#SlurmdLogFile=
#SlurmSchedLogFile=
#SlurmSchedLogLevel=
#
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
NodeName=bigMem0 State=UNKNOWN CPUs=64 Sockets=2 CoresPerSocket=16 ThreadsPerCore=2
NodeName=loginNode State=UNKNOWN CPUs=24 Sockets=2 CoresPerSocket=12
PartitionName=bigMem Nodes=bigMem0 Default=YES MaxTime=4320 State=UP



```

## **Setup `lsync` service to synchronize configuration files between servers**

1.  Make sure `rsync` is installed on each node. Type `rsync --version` to check they have consistent protocol version numbers \(31 for me\).
2.  Install `lsync` on each node with `yum -y install lsyncd`.
3.  On the manage node, create a list for sync targets in `/etc/cluster` folder: `sudo mkdir /etc/cluster`. Edit file: `sudo vim /etc/cluster/cluster-server.namelist`
    loginNode 10.66.66.88 slave manager bigMem0 10.66.66.100 slave
    Here, `slave` means this will become a computation node, and `manager` means this node will become a manager node.
4.  Write a script to configure the hostname and open up firewalls between nodes. Centos 7 uses `firewall-cmd` instead of `iptables` to manage this. \(refer: **[Help for firewall-cmd --zone](https://link.zhihu.com/?target=https%3A//access.redhat.com/documentation/en-us/red_hat_enterprise_linux/7/html/security_guide/sec-using_zones_to_manage_incoming_traffic_depending_on_source)**\) Say, you have saved this file to `~/set-hostname-and-firewall.sh`.

```bash
 #!/bin/bash

ips=($(ifconfig -a|grep inet|grep -v 127.0.0.1|
    grep -v inet6|awk '{print $2}'|tr -d "addr:"))
while read -a namelist; do
    ip=${namelist[1]}
 if [[ ${ips/$ip/} != ${ips} ]]; then
 # this row contains the ip of this machine, set hostname
        sudo echo ${namelist[0]} > /etc/hostname
 echo "Modify hostname to: ${namelist[0]}"
 else
 # this row contains the ip of another machine, add to hosts
        flag=0
        targetHost=${namelist[1]}
 while read -a hostlist; do
 if [[ ${hostlist/$targetHost/} != ${hostlist} ]]; then
                flag=1
 break
 fi
 done < /etc/hosts
 if (( $flag == 0 )); then
 echo "add ${namelist[1]}\t${namelist[0]} to hosts"
            sudo echo -e "\n${namelist[1]}\t${namelist[0]}\n" >> /etc/hosts
 else
 echo "${namelist[1]} is already in hosts, skip"
 fi
 echo -e "add ${namelist[1]}\t${namelist[0]} to firewall trusted zone"
        sudo firewall-cmd --zone=trusted --add-source=${namelist[1]} --permanent
        sudo firewall-cmd --reload

 unset flag
 fi
done < /etc/cluster/cluster-server.namelist
```

5.The following script does a lot of things on _all other nodes_.

- Copy the `namelist` file to them.
- Run the script `~/set-hostname-and-firewall.sh`.
- Create a new user with uid 968 and gid 968 for `lsyncd` service, and use `/opt/lsync` as its home directory.
- generate an ssh key pair for `lsync` and change the owner of several directories
- share this key pair to all nodes for user `lsync`

You can either copy it to your bash shell or save it as a script file to run.

```bash
#!/bin/bash

echo "Add user lsync and set home directory..."
sudo mkdir /opt/lsync
sudo groupadd -g 968 lsync
sudo useradd -m -c "lsync writer" -d /opt/lsync \
-u 968 -g 968 -s /bin/bash lsync/bin/bash

echo -e "generate 4096 bit RSA ssh key pair at /opt/lsync/.ssh/id_rsa"
sudo mkdir /opt/lsync/.ssh
ssh-keygen -t rsa -b 4096 -C "lsync" -f ~/tmp_id_rsa -N "" -q
SECRET_FILE=~/tmp_id_rsa
PUBLIC_FILE=~/tmp_id_rsa.pub
sudo cp $SECRET_FILE /opt/lsync/.ssh/id_rsa
sudo cat $PUBLIC_FILE > /opt/lsync/.ssh/authorized_keys

ips=($(ifconfig -a|grep inet|grep -v 127.0.0.1|
    grep -v inet6|awk '{print $2}'|tr -d "addr:"))
while read -a namelist; do
    ip=${namelist[1]}
 if [[ ${ips/$ip/} == ${ips} ]]; then

        Remote=${ClusterManager}@${ip}
 echo -e "\n======Communicating with $ip======"
 # this row contains the ip of other nodes
        scp -P $ClusterPort /etc/cluster/cluster-server.namelist \
 $Remote:~/cluster-server.namelist
        ssh -p $ClusterPort $Remote \
 'sudo mkdir /etc/cluster && '\
 'sudo mv ~/cluster-server.namelist '\
 '/etc/cluster/cluster-server.namelist && '\
 'rm -f ~/cluster-server.namelist'
 echo -e "\n"

        scp -P $ClusterPort ~/set-hostname-and-firewall.sh \
 $Remote:~/set-hostname-and-firewall.sh
        ssh -p $ClusterPort $Remote 'sudo bash ~/set-hostname-and-firewall.sh'

 echo "Add user lsync and set home directory..."
        ssh -p $ClusterPort $Remote \
 'sudo mkdir /opt/lsync && sudo groupadd -g 968 lsync && '\
 'sudo useradd -m -c "lsync writer" -d /opt/lsync '\
 '-u 968 -g 968 -s /bin/bash lsync/bin/bash'
 echo -e "\nsuccess"

 echo -e "\ncopy ssh key files..."
        scp -P $ClusterPort $SECRET_FILE $Remote:/opt/lsync/.ssh/id_rsa
        scp -P $ClusterPort $PUBLIC_FILE $Remote:/opt/lsync/.ssh/authorized_keys

 echo -e "\nChange owner of /etc/slurm, /opt/lsync"
        ssh -p $ClusterPort $Remote 'sudo chown -R lsync /opt/lsync/'
        ssh -p $ClusterPort $Remote 'sudo chown -R lsync /etc/slurm/'

 fi
done < /etc/cluster/cluster-server.namelist

sudo chown -R lsync /etc/slurm/
sudo chown -R lsync /opt/lsync/
rm -f $SECRET_FILE
rm -f $PUBLIC_FILE
sudo runuser -l lsync -c "lsyncd -rsyncssh /etc/slurm bigMem0 /etc/slurm"



```

## **How to mount a disk from another Linux machine**

For slurm to share data between nodes, each node should mount the same disk to all nodes at the same directory

1.  `yum install nfs-utils` on both client and server
2.  edit server-side: `/etc/exports` like `/home 10.66.66.100(rw)`
3.  run `systemctl start nfs` on both client and server
4.  call `mount 10.66.66.88:/home /home` \(use showmount -e server\_ip to see what is available / use telnet to ensure firewall is configured\) **Files in original HOME directory WILL be unable to access until you `umount` it.**

## **Other references**

To view the current default target, run: `systemctl get-default`

To set a default target, run: `systemctl set-default TARGET.target`

installing modules `yum install environment-modules`

In case nodes are restarted manually, `scontrol` will set the node to `DOWN` state. You should run `scontrol update NodeName=nodename State=RESUME` to reset.

In case you `mount` something wrongly, for me it was `mount \-o loop /mnt/xx/xx /mnt`, try to `umount` with `-f`\(force\) and `-l` \(lazy\) options.



slurm报错: Job credential expired证书过期

可能的问题: 机器时间不同步，误差超过30s；机器之间munge的uid不一致；munge.key不一致

时间同步可以使用ntpdate, 一起向loginNode同步时间.

参考: https://www.cnblogs.com/williamjie/p/10768657.html


**Useful links**

- **[Sudoers Manual](https://link.zhihu.com/?target=https%3A//www.sudo.ws/man/sudoers.man.html)** tells you the syntax of `sudoers` file.
- **[Slurm FAQ](https://link.zhihu.com/?target=https%3A//slurm.schedmd.com/faq.html)**.
- **[intel Math Kernel Library](https://link.zhihu.com/?target=https%3A//software.intel.com/content/www/us/en/develop/documentation/installation-guide-for-intel-oneapi-toolkits-linux/top/installation/install-using-package-managers/yum-dnf-zypper.html%23yum-dnf-zypper_packages)** installed `intel-hpckit`

## **\=== not done yet ====**

install MATLAB

install open-mpi

correct gcc/g++/gfrotran version

correct python/anaconda version

manage python packages

install docker

use **[pam\_slurmd](https://link.zhihu.com/?target=https%3A//slurm.schedmd.com/pam_slurm_adopt.html)**
