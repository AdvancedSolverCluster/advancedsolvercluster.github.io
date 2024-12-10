---
title: Set up GPU on slurm
nav_order: 11
parent: CentOS Cluster (legacy)
---

# "Set up GPU on slurm"
*Last modified: February 26, 2024*

by Yuejia Zhang, April 11, 2022

## `nvidia-smi -L`
On loginNode we have,
~~~
GPU 0: NVIDIA GeForce GTX 1080 Ti (UUID: GPU-082b5928-f417-d18b-2e66-7ac8725d2eef)
GPU 1: NVIDIA GeForce GTX 1080 Ti (UUID: GPU-d4beb8f8-57b9-9e30-757d-dace8ba58a6d)
~~~
On bigMem0 we have,
~~~
GPU 0: Tesla T4 (UUID: GPU-e39346a5-2c99-b9b3-3990-314a4955c698)
GPU 1: Tesla T4 (UUID: GPU-804f3721-c596-7163-0d12-0e6430083919)
GPU 2: Tesla T4 (UUID: GPU-a713e9f1-3221-e328-0bf4-c5390ef4c54a)
GPU 3: Tesla T4 (UUID: GPU-0f2b1458-1711-050a-8296-e07175c96634)
~~~
On bigMem1 we have,
~~~
GPU 0: NVIDIA A30 (UUID: GPU-4b5ca539-95f5-1f73-31ac-f88fb31b02d4)
GPU 1: NVIDIA A30 (UUID: GPU-96e0c10d-98af-1ad0-dfc7-aeb3c7b90c7d)
GPU 2: NVIDIA A30 (UUID: GPU-97470ff2-12a9-fc91-fd5f-66d291104940)
GPU 3: NVIDIA A30 (UUID: GPU-14ace18b-5160-afd6-467c-c20f1d706432)
~~~

## Test the AutoDetect mechanism
修改`/etc/slurm/slurm.conf`, debug2,

(line 16)
~~~
GresTypes=gpu
~~~
(line 148 & 149)
~~~
NodeName=loginNode CPUs=24 RealMemory=128546 Sockets=2 CoresPerSocket=12 ThreadsPerCore=1 State=UNKNOWN Gres=gpu:2
NodeName=bigMem[0-1] CPUs=64 RealMemory=1030499 Sockets=2 CoresPerSocket=16 ThreadsPerCore=2 State=UNKNOWN Gres=gpu:4
~~~
修改`/etc/slurm/gres.conf`:
~~~
AutoDetect=nvml
~~~

`sudo systemctl restart slurmd`.
看到loginNode上的`/var/log/slurmd.log`:
~~~
[2022-04-11T13:36:09.102] debug2: gpu/nvml: _get_system_gpu_list_nvml:     Name: nvidia_geforce_gtx_1080_ti
[2022-04-11T13:36:09.102] debug2: gpu/nvml: _get_system_gpu_list_nvml:     UUID: GPU-082b5928-f417-d18b-2e66-7ac8725d2eef
[2022-04-11T13:36:09.102] debug2: gpu/nvml: _get_system_gpu_list_nvml:     PCI Domain/Bus/Device: 0:4:0
[2022-04-11T13:36:09.102] debug2: gpu/nvml: _get_system_gpu_list_nvml:     PCI Bus ID: 00000000:04:00.0
[2022-04-11T13:36:09.102] debug2: gpu/nvml: _get_system_gpu_list_nvml:     NVLinks: -1,0
[2022-04-11T13:36:09.102] debug2: gpu/nvml: _get_system_gpu_list_nvml:     Device File (minor number): /dev/nvidia0
[2022-04-11T13:36:09.102] debug2: gpu/nvml: _get_system_gpu_list_nvml:     CPU Affinity Range - Machine: 0,2,4,6,8,10,12,14,16,18,20,22
[2022-04-11T13:36:09.102] debug2: gpu/nvml: _get_system_gpu_list_nvml:     Core Affinity Range - Abstract: 0-11
[2022-04-11T13:36:09.102] debug2: gpu/nvml: _get_system_gpu_list_nvml:     MIG mode: disabled
...

[2022-04-11T13:36:09.107] debug:  Gres GPU plugin: Final merged gres.conf list:
[2022-04-11T13:36:09.107] debug:      GRES[gpu] Type:(null) Count:1 Cores(24):0-11  Links:-1,0 Flags:HAS_FILE,ENV_NVML File:/dev/nvidia0 UniqueId:(null)
[2022-04-11T13:36:09.107] debug:      GRES[gpu] Type:(null) Count:1 Cores(24):12-23  Links:0,-1 Flags:HAS_FILE,ENV_NVML File:/dev/nvidia1 UniqueId:(null)
~~~
bigMem0上的`var/log/slurmd.log`:
~~~
[2022-04-11T13:46:20.220] debug2: gpu/nvml: _get_system_gpu_list_nvml:     Name: tesla_t4
[2022-04-11T13:46:20.220] debug2: gpu/nvml: _get_system_gpu_list_nvml:     UUID: GPU-e39346a5-2c99-b9b3-3990-314a4955c698
[2022-04-11T13:46:20.220] debug2: gpu/nvml: _get_system_gpu_list_nvml:     PCI Domain/Bus/Device: 0:59:0
[2022-04-11T13:46:20.220] debug2: gpu/nvml: _get_system_gpu_list_nvml:     PCI Bus ID: 00000000:3B:00.0
[2022-04-11T13:46:20.220] debug2: gpu/nvml: _get_system_gpu_list_nvml:     NVLinks: -1,0,0,0
[2022-04-11T13:46:20.220] debug2: gpu/nvml: _get_system_gpu_list_nvml:     Device File (minor number): /dev/nvidia0
[2022-04-11T13:46:20.220] debug2: gpu/nvml: _get_system_gpu_list_nvml:     CPU Affinity Range - Machine: 0-15,32-47
[2022-04-11T13:46:20.220] debug2: gpu/nvml: _get_system_gpu_list_nvml:     Core Affinity Range - Abstract: 0-15
[2022-04-11T13:46:20.220] debug2: gpu/nvml: _get_system_gpu_list_nvml:     MIG mode: disabled
...
[2022-04-11T13:46:21.517] debug:  Gres GPU plugin: Final merged gres.conf list:
[2022-04-11T13:46:21.517] debug:      GRES[gpu] Type:(null) Count:1 Cores(64):0-15  Links:-1,0,0,0 Flags:HAS_FILE,ENV_NVML File:/dev/nvidia0 UniqueId:(null)
[2022-04-11T13:46:21.517] debug:      GRES[gpu] Type:(null) Count:1 Cores(64):16-31  Links:0,-1,0,0 Flags:HAS_FILE,ENV_NVML File:/dev/nvidia1 UniqueId:(null)
[2022-04-11T13:46:21.517] debug:      GRES[gpu] Type:(null) Count:1 Cores(64):16-31  Links:0,0,-1,0 Flags:HAS_FILE,ENV_NVML File:/dev/nvidia2 UniqueId:(null)
[2022-04-11T13:46:21.517] debug:      GRES[gpu] Type:(null) Count:1 Cores(64):16-31  Links:0,0,0,-1 Flags:HAS_FILE,ENV_NVML File:/dev/nvidia3 UniqueId:(null)
~~~
bigMem1上的`/var/log/slurmd.log`:
~~~
[2022-04-11T13:49:10.275] debug2: gpu/nvml: _get_system_gpu_list_nvml:     Name: nvidia_a30
[2022-04-11T13:49:10.275] debug2: gpu/nvml: _get_system_gpu_list_nvml:     UUID: GPU-4b5ca539-95f5-1f73-31ac-f88fb31b02d4
[2022-04-11T13:49:10.275] debug2: gpu/nvml: _get_system_gpu_list_nvml:     PCI Domain/Bus/Device: 0:24:0
[2022-04-11T13:49:10.275] debug2: gpu/nvml: _get_system_gpu_list_nvml:     PCI Bus ID: 00000000:18:00.0
[2022-04-11T13:49:10.275] debug2: gpu/nvml: _get_system_gpu_list_nvml:     NVLinks: -1,0,0,0
[2022-04-11T13:49:10.275] debug2: gpu/nvml: _get_system_gpu_list_nvml:     Device File (minor number): /dev/nvidia0
[2022-04-11T13:49:10.275] debug2: gpu/nvml: _get_system_gpu_list_nvml:     CPU Affinity Range - Machine: 0-15,32-47
[2022-04-11T13:49:10.275] debug2: gpu/nvml: _get_system_gpu_list_nvml:     Core Affinity Range - Abstract: 0-15
[2022-04-11T13:49:10.275] debug2: gpu/nvml: _get_system_gpu_list_nvml:     MIG mode: disabled
...
[2022-04-11T13:49:12.545] debug:  Gres GPU plugin: Final merged gres.conf list:
[2022-04-11T13:49:12.545] debug:      GRES[gpu] Type:(null) Count:1 Cores(64):0-15  Links:-1,0,0,0 Flags:HAS_FILE,ENV_NVML File:/dev/nvidia0 UniqueId:(null)
[2022-04-11T13:49:12.545] debug:      GRES[gpu] Type:(null) Count:1 Cores(64):0-15  Links:0,-1,0,0 Flags:HAS_FILE,ENV_NVML File:/dev/nvidia1 UniqueId:(null)
[2022-04-11T13:49:12.545] debug:      GRES[gpu] Type:(null) Count:1 Cores(64):16-31  Links:0,0,-1,0 Flags:HAS_FILE,ENV_NVML File:/dev/nvidia2 UniqueId:(null)
[2022-04-11T13:49:12.545] debug:      GRES[gpu] Type:(null) Count:1 Cores(64):16-31  Links:0,0,0,-1 Flags:HAS_FILE,ENV_NVML File:/dev/nvidia3 UniqueId:(null)
~~~
尽管AutoDetect很好用，但我们还是手工加入了更多信息，按官网上说的，This allows gres.conf to serve as an optional sanity check and notifies administrators of any unexpected changes in GPU properties.

## Configuration Files:

`slurm.conf`:
~~~
NodeName=loginNode CPUs=24 RealMemory=128546 Sockets=2 CoresPerSocket=12 ThreadsPerCore=1 State=UNKNOWN Gres=gpu:nvidia_geforce_gtx_1080_ti:2
NodeName=bigMem0 CPUs=64 RealMemory=1030499 Sockets=2 CoresPerSocket=16 ThreadsPerCore=2 State=UNKNOWN Gres=gpu:tesla_t4:4
NodeName=bigMem1 CPUs=64 RealMemory=1030499 Sockets=2 CoresPerSocket=16 ThreadsPerCore=2 State=UNKNOWN Gres=gpu:nvidia_a30:4
~~~

`gres.conf` on `loginNode`:
~~~
##################################################################
# Slurm's Generic Resource (GRES) configuration file
# Define GPU devices with MPS support, with AutoDetect sanity checking
##################################################################
AutoDetect=nvml
Name=gpu Type=nvidia_geforce_gtx_1080_ti File=/dev/nvidia0
Name=gpu Type=nvidia_geforce_gtx_1080_ti File=/dev/nvidia1
~~~

`gres.conf` on `bigMem0`:
~~~
##################################################################
# Slurm's Generic Resource (GRES) configuration file
# Define GPU devices with MPS support, with AutoDetect sanity checking
##################################################################
AutoDetect=nvml
Name=gpu Type=tesla_t4 File=/dev/nvidia0
Name=gpu Type=tesla_t4 File=/dev/nvidia1
Name=gpu Type=tesla_t4 File=/dev/nvidia2
Name=gpu Type=tesla_t4 File=/dev/nvidia3
~~~

`gres.conf` on `bigMem1`:
~~~
##################################################################
# Slurm's Generic Resource (GRES) configuration file
# Define GPU devices with MPS support, with AutoDetect sanity checking
##################################################################
AutoDetect=nvml
Name=gpu Type=nvidia_a30 File=/dev/nvidia0
Name=gpu Type=nvidia_a30 File=/dev/nvidia1
Name=gpu Type=nvidia_a30 File=/dev/nvidia2
Name=gpu Type=nvidia_a30 File=/dev/nvidia3
~~~

配置结束后, restart slurmd, and scontrol update if necessary.
