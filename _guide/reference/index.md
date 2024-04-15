---
title: 集群中各服务器的配置与性能
nav_order: 6
---

# 集群中各服务器的配置与性能

*Last Update: April 15, 2024 ,Created: August 16, 2023*

*[Xiang Li](mailto:646873166@qq.com), [Yuejia Zhang](mailto:yuejiazhang21@m.fudan.edu.cn)*

## MATLAB Benchmark

MATLAB benchmark times 6 different MATLAB tasks and compares the execution speed.

Version: MATLAB/R2023b

Code: `bench(1);mean(bench(5),1)`

Test description:


| #Test  | Name   |  Full Name                       |   Description | 
| -- | -- | -- | -- |
| Test 1 | LU     |  LAPACK.                         |   Floating point, regular memory access.    |
| Test 2 | FFT    |  Fast Fourier Transform.         |   Floating point, irregular memory access.    |
| Test 3 | ODE    |  Ordinary diff. eqn.             |   Data structures and functions.    |
| Test 4 | Sparse |  Solve sparse system.            |   Sparse linear algebra.    |
| Test 5 | 2-D    |  2-D Lissajous plot.             |   Animating line plot.    |
| Test 6 | 3-D    |  3-D SURF(PEAKS)and HGTransform. |   3-D surface animation.    |


**Time cost (shorter is better):**

| **Machine** | Test 1 | Test 2 | Test 3 | Test 4 | Test 5 | Test 6 | Comment |
|--|--|--|--|--|--|--|--|
| `loginNode` | 0.3772 | 0.3905 | 0.2724 | 0.7500 | 0.3720 | 0.2420 |
| `bigMem0`   | 0.3281 | 0.2174 | 0.1654 | 0.5331 | 0.3128 | 0.2228 |
| `bigMem1`   | 0.2753 | 0.2144 | 0.1702 | 0.5301 | 0.2807 | 0.2087 |
| `bigMem2`   | 0.8111 | 0.2552 | 0.3379 | 3.3274 | 0.3673 | 0.2565 | R2023a |
| `bigMem3`   | 0.2142 | 0.1399 | 0.1398 | 5.3001 | 0.2313 | 0.1309 |

## CPU / Memory
评测程序 Source: [PassMark Performance Testing Linux](https://www.passmark.com/products/pt_linux/)

版本: 10.2.1003

参数: (`-i 3`) Test Iterations: 3, (`-d 2`) Test Duration: Medium.

测试结果仅供参考, 有一定的波动. `(?)` 为未经有效确认的结果.

|**CPU Info** |`loginNode`|`bigMem0`|`bigMem1`|`bigMem2`|`bigMem3`|
|--|--:|--:|--:|--:|--:|
|CPU Brand|Intel Xeon CPU E5-2670 v3 @ 2.30GHz|Intel Xeon Gold 6226R CPU @ 2.90GHz|Intel Xeon Gold 6226R CPU @ 2.90GHz|Hygon C86 7285 32-core Processor|AMD EPYC 9754 128-Core Processor|
|Num of CPUs on Board                                     | 2  | 2  | 2  | 2 | 2 |
|Total Threads                                           | 24 | 64 | 64 | 128 | 512 |
|Base Clock Speed (GHz)                                  | 2.30 | 2.90 | 2.90 | 2.00 | 2.25 |
|Boost Clock Speed (GHz)                                 | 2.30 | 3.90 | 3.90 | 3.00(?) | 3.10 |
|CPU Cache (MiB/CPU)                                     | 30 | 22 | 22 | 64 | 256 |
|Lithography (Nanometer)                                 | 22 | 14 | 14 | 14(?) | 5 |
|**CPU Speed** |`loginNode`|`bigMem0`|`bigMem1`|`bigMem2`|`bigMem3`|
|Integer Math (Million Operations/s)                     |62,275 |206,066 |209,673 |328,027 |2,054,471 |
|Floating Point Math (Million Operations/s)              |48,122 |129,819 |130,277 |146,501 |1,149,133 |
|Prime Numbers (Million Primes/s)                        |188 |209 |230 |289 |1,728 |
|Sorting (Thousand Strings/s)                            |41,063 |90,967|106,039 |172,684 |783,396 |
|Encryption (MB/s)                                       |5,959 |25,616 |27,013 |99,718 |492,442 |
|Compression (MB/s)                                      |315 |817 |865 |1,330 |6,933 |
|CPU Single Threaded (Million Operations/s)              |1,414 |2,421 |2,407 |1,478 |2,444 |
|Physics (Frames/s)                                      |1,229 |2,336 |3,002 |7,420 |22,446 |
|Extended Instructions (SSE) (Million Matrices/s)        |21,430 |46,552 |47,889 |45,259 |428,652 |
|**CPU Final Mark**                                      |19,471 | 42,705 | 46,047 |53,223 |138,716 |
| **Memory Info** |`loginNode`|`bigMem0`|`bigMem1`|`bigMem2`|`bigMem3`|
|Total Available RAM (GiB)                   |125.5 |1,006.4 |1,006.3 |485.6 |1007.0 |
|Memory Frequency (MHz)                      |2,133 | 2,666 | 2,933 | 3200 | 4800 |
| **Memory Speed** |`loginNode`|`bigMem0`|`bigMem1`|`bigMem2`|`bigMem3`|
|Memory Latency (Nanoseconds)                |50 |53 |52 |62 |70 |
|Memory Read Cached (MB/s)                   |17,005 |27,710  |27,698  |18,298 |23,561 |
|Memory Read Uncached (MB/s)                 |8,187  |12,093  |11,800  |8700  |23,334 |
|Memory Write (MB/s)                         |7,665  |10,100  |8,890  |7338  |23,305 |
|Memory Threaded (MB/s)                      |71,989  |100,377  |169,758  |259,208 |726,276 |
|Database Operations (Thousand Operations/s) |10,649 |18,742 |19,791 |16,254 |29,555 |
|**Memory Final Mark**                       |2,277 | 2,827 | 2,799 | 2,321 | 2,876 |

Reference:

[E5 2670 v3 Specs](https://ark.intel.com/content/www/us/en/ark/products/81709/intel-xeon-processor-e52670-v3-30m-cache-2-30-ghz.html)

[Gold 6226R Specs](https://ark.intel.com/content/www/us/en/ark/products/199347/intel-xeon-gold-6226r-processor-22m-cache-2-90-ghz.html)

[Hygon IPO Specs](http://static.sse.com.cn/stock/information/c/202203/8c31407852094a259d388fbb535942ca.pdf) pp.124-126

[EPYC 9754 Specs(AMD)](https://www.amd.com/en/products/cpu/amd-epyc-9754)
[EPYC 9754 Specs(TechPowerUp)](https://www.techpowerup.com/cpu-specs/epyc-9754.c3257)

## GPU / DCU 计算加速卡

`bigMem3` 上无加速卡.

评测程序 Source: [Mixbench](https://github.com/ekondis/mixbench)

| GPU/DCU |`loginNode`|`bigMem0`|`bigMem1`|`bigMem2`|
|--|--|--|--|--|
|Device              |NVIDIA GeForce GTX 1080 Ti|Tesla T4|NVIDIA A30|HYGON Z100|
|CUDA driver version |11.60|11.60|11.60|-|
|GPU clock rate (MHz)     |1721|1590 |1440 |1319 |
|Memory clock rate   |2752 MHz|2500 MHz|607 MHz|- MHz|
|Memory bus width    |352 bits|256 bits|3072 bits|- bits|
|WarpSize            |32|32|32|64|
|L2 cache size       |2816 KB|4096 KB|24576 KB|8192 KB|
|Total global mem    |11178 MB|14910 MB|24068 MB|32752 MB|
|ECC enabled         |No|Yes|Yes|Yes|
|Compute Capability  |6.1|7.5|8.0|-|
|Total SPs           |3584 (28 MPs x 128 SPs/MP)|2560 (40 MPs x 64 SPs/MP)|7168 (56 MPs x 128 SPs/MP)|3840 (60 CUs x 64 SPs/CU)|
|Compute throughput (theoretical single precision FMAs) (GFlops) |12336.13  |8140.80 |20643.84 |10129.92 |
|Memory bandwidth (GB/sec)   |484.44 |320.06 |933.12 |1024.00 |

![benchmark](/guide/figure/benchmark.png)

## 磁盘读写速度

评测程序: `fio-3.7`

命令 `$ fio --randrepeat=1 --ioengine=libaio --direct=1 --gtod_reduce=1 --name=test --filename={} --bs=4ki --iodepth=64 --size=400Mi --readwrite={method} --rwmixread={rwrate}`,

其中 `method=randrw | rw`, `rwrate=0 | 75 | 100`, `filename` 指定为对应硬盘下的位置.

| Spec                         | r/w   | loginNode:/ | loginNode:/home, /scratch |
|------------------------------|-------|------------:|--------------------------:|
| randrw, 75% read + 25% write | read  | 1.5 MiB/s   | 3.4 MiB/s                 |
|                              | write | 0.5 MiB/s   | 1.1 MiB/s                 |
| randrw, 100% read            | read  | 4.1 MiB/s   | 12.5 MiB/s                |
| randrw, 100% write           | write | 1.4 MiB/s   | 1.6 MiB/s                 |
| rw, 75% read + 25% write     | read  | 21.8 MiB/s  | 27.5 MiB/s                |
|                              | write | 7.6 MiB/s   | 9.4 MiB/s                 |
| rw, 100% read                | read  | 176.0 MiB/s | 407.0 MiB/s               |
| rw, 100% write               | write | 161.0 MiB/s | 14.0 MiB/s                |
