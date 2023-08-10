---
title: "挂载某个文件夹到其他机器上"
---

# "挂载某个文件夹到其他机器上"

首先确保server和client都有安装`nfs-utils`: `sudo yum install nfs-utils`, 以下以loginNode挂载到bigMem上为例


## Server端(loginNode)

在server端更新`/etc/exports`, [参考链接](https://access.redhat.com/documentation/en-us/red_hat_enterprise_linux/7/html/storage_administration_guide/ch-nfs).

在`loginNode`上更新为(以下使用ip地址的地方都是已知不可以用hostname的地方)

~~~ text
/home 192.168.2.0/26(rw,root_squash,sync,security_label) 192.168.2.100(ro)
~~~

关于参数的含义也可以参考`man exports`.

刷新nfs的记录, `sudo exportfs -r`

重启/重载nfs: `sudo systemctl restart nfs`. (`sudo systemctl reload nfs`)

开放防火墙, 把client加入受信任: `sudo firewall-cmd --zone=trusted --add-source=192.168.2.0/26 --permanent`, [参考链接](https://access.redhat.com/documentation/en-us/red_hat_enterprise_linux/7/html/security_guide/sec-using_zones_to_manage_incoming_traffic_depending_on_source).

## Client端(bigMem)

在client端尝试mount: `sudo mount -t nfs loginNode:/home /home --verbose` 并观察有无报错信息.

加入 `/etc/fstab` 开机自动mount: 在 `/etc/fstab` 中加入行

~~~ text
loginNode:/home /home                           nfs     defaults        0 0
~~~

reload daemon: `sudo systemctl daemon-reload`, [参考链接](https://access.redhat.com/documentation/en-us/red_hat_enterprise_linux/7/html/storage_administration_guide/nfs-clientconfig#s2-nfs-fstab).

开放ssh访问`authorized_keys`的权限(SELinux): [参考链接](https://stackoverflow.com/questions/36682870/passwordless-ssh-on-shared-nfs-home-directory-does-not-work-centos-7)

~~~ bash
sudo setsebool -P use_nfs_home_dirs 1
~~~

## 执行记录

`/etc/exports` on loginNode:

~~~ text
/home 192.168.2.0/26(rw,root_squash,sync,security_label) 192.168.2.100(ro,no_root_squash)
/scratch 192.168.2.0/26(rw,root_squash,sync,security_label)
/sync 192.168.2.0/26(rw,no_root_squash)
/etc/share 192.168.2.0/26(ro,no_root_squash)
~~~

`/etc/fstab` on bigMem0:

~~~ text
/dev/mapper/centos-root /                       xfs     defaults        0 0
UUID=1aae08bb-4581-49b1-aac8-6c595266eb7b /boot                   xfs     defaults        0 0
/dev/mapper/centos-sync /sync                   xfs     defaults        0 0
#/dev/mapper/centos-swap swap                    swap    defaults        0 0
loginNode:/home /home                           nfs     defaults        0 0
loginNode:/scratch /scrach                      nfs     defaults        0 0
loginNode:/sync /mnt/loginNode/sync             nfs     defaults        0 0
loginNode:/etc/share /etc/share                 nfs     defaults        0 0
~~~

`/etc/fstab` on bigMem1:

~~~ text
/dev/mapper/centos-root /                       xfs     defaults        0 0
UUID=ca86668f-ebc7-43ea-81da-9711007cb858 /boot                   xfs     defaults        0 0
UUID=666D-00DA          /boot/efi               vfat    umask=0077,shortname=winnt 0 0
/dev/mapper/centos-sync /sync                   xfs     defaults        0 0
/dev/mapper/centos-swap swap                    swap    defaults        0 0
loginNode:/home /home                           nfs     defaults        0 0
loginNode:/scratch /scratch                     nfs     defaults        0 0
loginNode:/sync /mnt/loginNode/sync             nfs     defaults        0 0
loginNode:/etc/share /etc/share                 nfs     defaults        0 0
~~~

`/etc/fstab` on web0:

~~~ text
/dev/mapper/centos-root /                       xfs     defaults        0 0
UUID=c00e98aa-aec4-4587-927e-ba6bfb3969e2 /boot                   xfs     defaults        0 0
UUID=2BDD-D898          /boot/efi               vfat    umask=0077,shortname=winnt 0 0
/dev/mapper/centos-home /home                   xfs     defaults        0 0
/dev/mapper/centos-swap swap                    swap    defaults        0 0
loginNode:/home /mnt/loginNode/home                           nfs     defaults        0 0
~~~
