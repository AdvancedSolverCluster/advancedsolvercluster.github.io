---
title: "SLURM Admin Guide"
---

如何做一个优秀的SLURM管理员

https://ulhpc-tutorials.readthedocs.io/en/latest/scheduling/advanced/
https://curc.readthedocs.io/en/latest/running-jobs/slurm-commands.html

batch submit example scripts:
https://www.hpc2n.umu.se/documentation/batchsystem/basic-submit-example-scripts


## slurm-web安装

http://edf-hpc.github.io/slurm-web/installation.html
https://github.com/edf-hpc/slurm-web

slurm-web只支持docker或debian/ubuntu安装. 但它只包括一个dashboard和一个flask的wsgi程序, 可以自己实现代替.

## Enable Accounting (2022/1/6)

需要启动slurmDBD(database daemon). 在`/etc/slurm`里增加了配置文件`slurmdbd.conf`, 修改了`slurm.conf`, 用root登录mySQL新建数据库`slurm_acct_db`并grant给`slurmLog`账号权限, 以后accounting information都写入这个database中. 经验: debug时看log信息(`/var/log`).

Reference:
两个conf文件: https://slurm.schedmd.com/slurmdbd.conf.html, https://slurm.schedmd.com/slurm.conf.html
Accounting: https://slurm.schedmd.com/accounting.html

## TODO

需求:
- 邮件,
- PAM,
- 用户用量限制 resource limit, `sacctmgr`

(2022/05/25)
修改了`slurm.conf`: `PartitionName=partition Nodes=bigMem[0-1] MaxTime=3-0 DefaultTime=1-0 Default=YES State=UP`


## 其它注意事项

### reboot后必做

1. 节点会自动down, 通过如下命令使节点重新工作: `sudo scontrol update nodename=bigMem0 state=idle`.
2. 重新挂载`/home`! `sudo mount loginNode:/home /home`.

### Useful DEBUG tips

看节点出问题的原因, `sinfo -R` 或者 `scontrol show node bigMem0`. 通常需要到`/var/log/slurmd.log`里看错误的具体原因.

`sudo scontrol update nodename=bigMem0 state=idle`

DEBUG: `scontrol show config`查看config. `scontrol setdebug 9`把debug开到最高等级. `scontrol update <SPECIFICATION>`修改某个配置. 官网建议: It may be desirable to execute the show command on the specific entity you want to update, then use cut-and-paste tools to enter updated configuration values to the update.

DEBUG结束: `scontrol reconfigure`清除掉之前临时改的设置: Instruct all Slurm daemons to re-read the configuration file. This command does not restart the daemons and does not stop the running jobs.
