---
title: "集群网络结构"
---


基本结构

外网 -- 校园网 -- 10.88.3.90(Cluster/路由器)

```
路由器: 内网/外网隔离: 内网网段192.168.2.0/24
|- 192.168.2.254 (路由器)
|
|- 192.168.2.1(loginNode)
|
|- 192.168.2.10(bigMem0)
|
|- 192.168.2.11(bigMem1)
|
|- 192.168.2.100(web0)

```


|   Server   | Campus URL/IP |     Off-Campus URL     | Port  |
| ---------- | ------------- | ---------------------- | ----- |
| router     | 10.88.3.90    | cluster.yingzhouli.com | 20254 |
| loginNode  | 10.88.3.90    | cluster.yingzhouli.com | 20001 |
| bigMem0    | 10.88.3.90    | cluster.yingzhouli.com | 20010 |
| bigMem1    | 10.88.3.90    | cluster.yingzhouli.com | 20011 |
| web0       | 10.88.3.90    | cluster.yingzhouli.com | 20100 |

路由器管理地址
https://cluster.advancedsolver.com

![Fig: network-topology](/guide/figure/user-topology.png)
