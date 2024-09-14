---
title: 重启后的检查
nav_order: 6
parent: Ubuntu Cluster
---

# 重启后的检查

这篇 markdown 主要讲讲在服务器重启后, 我们应当检查哪些服务.

## 各个节点是否能互相 ping 通

例如, 我们可以在 loginNode 上输入 `ping bigMem0`, 如果得到形如

``` text
PING bigMem0.lan (192.168.2.10) 56(84) bytes of data.
64 bytes from BigMem0.lan (192.168.2.10): icmp_seq=1 ttl=64 time=0.231 ms
64 bytes from BigMem0.lan (192.168.2.10): icmp_seq=2 ttl=64 time=0.204 ms
64 bytes from BigMem0.lan (192.168.2.10): icmp_seq=3 ttl=64 time=0.202 ms
^C
--- bigMem0.lan ping statistics ---
3 packets transmitted, 3 received, 0% packet loss, time 2003ms
rtt min/avg/max/mdev = 0.202/0.212/0.231/0.013 ms
```

的结果, 则表示连接正常. 如果 ping 不通, 则说明网络连接异常.

## slurm 状态

输入 `sinfo` 查看节点信息, 我们重点关注 `STATE` 这一项, 只要不是 `down` (比如 `idle` 或 `mix`), 则说明正常, 否则请重启 slurm. 具体来说, 以 bigMem0 为例, 我们可以使用 `sudo scontrol update NodeName=bigMem0 State=Resume` 来重启它的 slurm 服务.

如果这种方法失败, 请移步至相应的节点, 使用 `systemctl status slurmd` 查看节点状态, 并查看相应的日志, 例如 `/var/log/slurmctld.log` 或者 `/var/log/slurmd.log` 等.

## GPU 状态

这一步只需要对有 gpu 的节点 (例如 loginNode, bigMem0, bigMem1) 做, 方法是在对应的节点上输入 `nvidia-smi`, 查看能否得到正常的输出.

## loginNode 是否正常挂载

在除了 loginNode 的其他节点上输入 `mount | grep loginNode`, 如果得到的输出形如

``` text
loginNode:/software on /software type nfs4 (rw,relatime,vers=4.2,rsize=1048576,wsize=1048576,namlen=255,soft,proto=tcp,timeo=100,retrans=2,sec=sys,clientaddr=192.168.2.10,local_lock=none,addr=192.168.2.1,_netdev)
loginNode:/scratch on /scratch type nfs4 (rw,relatime,vers=4.2,rsize=1048576,wsize=1048576,namlen=255,soft,proto=tcp,timeo=100,retrans=2,sec=sys,clientaddr=192.168.2.10,local_lock=none,addr=192.168.2.1,_netdev)
loginNode:/home on /home type nfs4 (rw,relatime,vers=4.2,rsize=1048576,wsize=1048576,namlen=255,soft,proto=tcp,timeo=100,retrans=2,sec=sys,clientaddr=192.168.2.10,local_lock=none,addr=192.168.2.1,_netdev)
loginNode:/etc/share on /etc/share type nfs4 (rw,relatime,vers=4.2,rsize=1048576,wsize=1048576,namlen=255,hard,proto=tcp,timeo=600,retrans=2,sec=sys,clientaddr=192.168.2.10,local_lock=none,addr=192.168.2.1)
```

就表示挂载正常. 具体来说, 我们必须看到 loginNode 的 `/software`, `/scratch`, `/home` 和 `/etc/share` 都挂载在其他节点上. 否则, 请利用

``` bash
sudo mount -t nfs loginNode:/home /home --verbose
sudo mount -t nfs loginNode:/scratch /scratch --verbose
sudo mount -t nfs loginNode:/software /software --verbose
sudo mount -t nfs loginNode:/etc/share /etc/share --verbose
```

重新挂载 loginNode 到相应的节点.

## 防火墙

在所有节点上输入 `systemctl status firewalld`, 如果看到 `Active: active (running)` 就说明没问题. 否则, 请利用 `sudo systemctl restart firewalld` 重启防火墙.

## sysstat

使用 `ls -l /var/log/sysstat/` 查看是否有对应日期的 `saxx` 文件. 例如, 如果今天是 9 月 14 日, 那么 `sa14` 对应的修改日期应当为 `Sep 14`. 如有异常, 请利用 `sudo systemctl status sysstat` 查看 sysstat 的状态, 应当为 `Active: active (exited)`. 否则, 请利用 `sudo systemctl restart sysstat` 重启服务, 并检查 `/var/log/sysstat/` 是否生成了今天对应日期的文件.