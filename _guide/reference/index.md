---
title: 集群中各服务器的配置与性能
nav_order: 6
---

# 集群中各服务器的配置与性能

*[Xiang Li](mailto:646873166@qq.com), [Yuejia Zhang](mailto:yuejiazhang21@m.fudan.edu.cn)*

## MATLAB Benchmark

MATLAB benchmark times 6 different MATLAB tasks and compares the execution speed. We take the mean time of 50 repeats of the test.

Version: MATLAB/R2023b

Args: `matlab -nodisplay -nodesktop`

Code: `bench(1);mean(bench(50),1)`

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
| `loginNode` | 0.3732 | 0.3605 | 0.2424 | 0.7200 | 0.3520 | 0.2220 |         |
| `bigMem0`   | 0.2605 | 0.1994 | 0.1661 | 0.5254 | 0.2846 | 0.2059 |         |
| `bigMem1`   | 0.2681 | 0.2196 | 0.1649 | 0.5679 | 0.2761 | 0.1972 |         |
| `bigMem2`   | 0.8643 | 0.2315 | 0.3027 | 3.3614 | 0.3731 | 0.2523 |         |
| `bigMem3`   | 0.2042 | 0.1165 | 0.1392 | 4.8798 | 0.2142 | 0.1321 |         |

## CPU / Memory
评测程序 Source: [PassMark Performance Testing Linux](https://www.passmark.com/products/pt_linux/)

版本: 10.2.1003

参数: (`-i 3`) Test Iterations: 3, (`-d 2`) Test Duration: Medium.

测试结果仅供参考, 有一定的波动. `(?)` 为未经有效确认的结果.

|**CPU Info** |`loginNode`|`bigMem0`|`bigMem1`|`bigMem2`|`bigMem3`|
|--|--:|--:|--:|--:|--:|
|CPU Brand|Intel Xeon CPU E5-2670 v3 @ 2.30GHz|Intel Xeon Gold 6226R CPU @ 2.90GHz|Intel Xeon Gold 6226R CPU @ 2.90GHz|Hygon C86 7285 32-core Processor|AMD EPYC 9754 128-Core Processor|
|Num of CPUs on Board                                     | 2  | 2  | 2  | 2 | 2 |
|Total Threads                                           | 48 | 64 | 64 | 128 | 512 |
|Base Clock Speed (GHz)                                  | 2.30 | 2.90 | 2.90 | 2.00 | 2.25 |
|Boost Clock Speed (GHz)                                 | 3.10 | 3.90 | 3.90 | 2.50(?) | 3.10 |
|CPU Cache (MiB/CPU)                                     | 30 | 22 | 22 | 64 | 256 |
|Lithography (Nanometer)                                 | 22 | 14 | 14 | 14(?) | 5 |
|**CPU Speed** |`loginNode`|`bigMem0`|`bigMem1`|`bigMem2`|`bigMem3`|
|Integer Math (Million Operations/s)                     |113,171 |206,926 |210,833 |326,869 |2,054,471 |
|Floating Point Math (Million Operations/s)              |56,058 |113,990 |114,338 |146,645 |1,149,133 |
|Prime Numbers (Million Primes/s)                        |168    |224     |223     |271     |1,728 |
|Sorting (Thousand Strings/s)                            |73,125 |104,601 |116,809 |164,992 |783,396 |
|Encryption (MB/s)                                       |10,892 |25,528  |26,793  |100,666 |492,442 |
|Compression (MB/s)                                      |484    |804     |840     |1,358   |6,933 |
|CPU Single Threaded (Million Operations/s)              |1,845  |2,334   |2,312   |1,479   |2,444 |
|Physics (Frames/s)                                      |2,281  |4,047   |4,205   |5,643   |22,446 |
|Extended Instructions (SSE) (Million Matrices/s)        |26,481 |46,341  |48,944  |45,151  |428,652 |
|**CPU Final Mark**                                      |28,093 |47,282  |48,524  |52,494 |138,716 |
| **Memory Info** |`loginNode`|`bigMem0`|`bigMem1`|`bigMem2`|`bigMem3`|
|Total Available RAM (GiB)                   |983.1  |1,006.6 |1,006.6 |503.8  |1,511.5 |
|Memory Frequency (MHz)                      |2,133  |2,933   |2,933   |2,666  |4,800   |
| **Memory Speed** |`loginNode`|`bigMem0`|`bigMem1`|`bigMem2`|`bigMem3`|
|Memory Latency (Nanoseconds)                |51     |54      |57      |61      |70     |
|Memory Read Cached (MB/s)                   |22,296 |27,648  |26,946  |18,461  |23,561 |
|Memory Read Uncached (MB/s)                 |9,206  |8,923   |7,479   |12,863  |23,334 |
|Memory Write (MB/s)                         |8,766  |8,109   |7,177   |7,647   |23,305 |
|Memory Threaded (MB/s)                      |107,696 |194,455 |186,943 |226,623 |726,276|
|Database Operations (Thousand Operations/s) |14,320 |20,466  |21,388  |15,415  |29,555 |
|**Memory Final Mark**                       |2,524  |2,562   |2,334   |2,217   |2,876 |


评测程序: [tinymembench v0.4](https://github.com/ssvb/tinymembench)

| tinymembench-v0.4  (result in MB/s)              | lnnode  | bm0     | bm1     | bm2     | bm3     |
|--------------------------------------------------|---------|---------|---------|---------|---------|
| C copy backwards                                 | 6126    | 6508.9  | 5813.7  | 6879.5  | 18378.2 |
| C copy backwards (32 byte blocks)                | 6120.3  | 6494.9  | 5780.3  | 6891.5  | 16917.2 |
| C copy backwards (64 byte blocks)                | 6124.1  | 6505.7  | 5772.2  | 6890.6  | 16935.1 |
| C copy                                           | 5994.4  | 6671.2  | 5938.8  | 6888.2  | 18383   |
| C copy prefetched (32 bytes step)                | 5829.5  | 4753.6  | 4232.2  | 7126.9  | 16105.5 |
| C copy prefetched (64 bytes step)                | 5817.1  | 4784.1  | 4252.4  | 7096.3  | 16373.7 |
| C 2-pass copy                                    | 5185.8  | 5646.7  | 5101.5  | 5827.4  | 13985   |
| C 2-pass copy prefetched (32 bytes step)         | 5415.8  | 3387.9  | 3090.4  | 6242.2  | 10197   |
| C 2-pass copy prefetched (64 bytes step)         | 5413.5  | 3409    | 3106.7  | 6322.3  | 10401.7 |
| C fill                                           | 11580   | 13888   | 12338.1 | 8745.6  | 39944.5 |
| C fill (shuffle within 16 byte blocks)           | 11583.2 | 13938.1 | 12391.8 | 8736.9  | 39729.9 |
| C fill (shuffle within 32 byte blocks)           | 11585.6 | 13949.6 | 12454.8 | 8740.6  | 39756   |
| C fill (shuffle within 64 byte blocks)           | 11575.1 | 13939.8 | 12433.3 | 8751.9  | 35720.2 |
| standard memcpy                                  | 12389.5 | 5708.8  | 5589.3  | 11175.3 | 18968.3 |
| standard memset                                  | 11536.2 | 8114.5  | 8134.6  | 10633.1 | 29393.4 |
| MOVSB copy                                       | 5215.3  | 5519.7  | 5330.9  | 7462.8  | 26351.4 |
| MOVSD copy                                       | 5221.1  | 5510.3  | 5303.5  | 7461.4  | 26375.4 |
| SSE2 copy                                        | 6004    | 6793    | 6107.3  | 7767.1  | 22674.3 |
| SSE2 nontemporal copy                            | 11791.9 | 5174.2  | 5025    | 12468   | 24251.6 |
| SSE2 copy prefetched (32 bytes step)             | 5843    | 5250.8  | 4671.7  | 7804.7  | 22168.2 |
| SSE2 copy prefetched (64 bytes step)             | 5839.4  | 5357.1  | 4787.2  | 7787.7  | 22943.9 |
| SSE2 nontemporal copy prefetched (32 bytes step) | 11431.3 | 3295.4  | 3184.5  | 13364.1 | 25204.1 |
| SSE2 nontemporal copy prefetched (64 bytes step) | 11528.3 | 3455.2  | 3347.3  | 13285.6 | 25874.4 |
| SSE2 2-pass copy                                 | 5443.6  | 6119.2  | 5460.1  | 6518.2  | 23069.5 |
| SSE2 2-pass copy prefetched (32 bytes step)      | 5270.8  | 3962.9  | 3597.6  | 7044.2  | 15304.2 |
| SSE2 2-pass copy prefetched (64 bytes step)      | 5254.1  | 4062.2  | 3734.7  | 7080.1  | 15882.8 |
| SSE2 2-pass nontemporal copy                     | 3749.2  | 2587.7  | 2592.5  | 4019.2  | 3313.2  |
| SSE2 fill                                        | 11614.5 | 13636.6 | 12031.1 | 10619.9 | 41563.1 |
| SSE2 nontemporal fill                            | 17945.7 | 7462.3  | 7294.9  | 32769.2 | 28722.6 |



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

| Spec                         | r/w   | loginNode   |
|------------------------------|-------|------------:|
| 400 MiB file (in-cache)      |       |             |
| randrw, 75% read + 25% write | read  | 332 MiB/s   |
|                              | write | 111 MiB/s   |
| randrw, 100% read            | read  | 510 MiB/s   |
| randrw, 100% write           | write | 494 MiB/s   |
| rw, 75% read + 25% write     | read  | 392 MiB/s   |
|                              | write | 130 MiB/s   |
| rw, 100% read                | read  | 516 MiB/s   |
| rw, 100% write               | write | 536 MiB/s   |
|------------------------------|-------|-------------|
| 16 GiB file (out-of-cache)   |       |             |
| loginNode:/home, /scratch    |       |             |
| (data disk)                  |       |             |
| randrw, 75% read + 25% write | read  | 11.6 MiB/s  |
|                              |       | 2209 IOPS   |
|                              | write |  2.9 MiB/s  |
|                              |       |  732 IOPS   |
| randrw, 100% read            | read  | 11.1 MiB/s  |
|                              |       | 3060 IOPS   |
| randrw, 100% write           | write | 61.9 MiB/s  |
|                              |       |15800 IOPS   |
|                              |       |             |
| loginNode:/                  |       |             |
| (software disk)              |       |             |
| randrw, 75% read + 25% write | read  |  1.6 MiB/s  |
|                              |       |  413 IOPS   |
|                              | write |  0.5 MiB/s  |
|                              |       |  132 IOPS   |
| randrw, 100% read            | read  |  1.1 MiB/s  |
|                              |       |  274 IOPS   |
| randrw, 100% write           | write |  7.4 MiB/s  |
|                              |       | 1817 IOPS   |
