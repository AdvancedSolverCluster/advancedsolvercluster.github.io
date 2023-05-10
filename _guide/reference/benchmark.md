---
title: 集群中各服务器的配置与性能
---

# 集群中各服务器的配置与性能

*March 29, 2023, [Xiang Li](mailto:646873166@qq.com), [Yuejia Zhang](mailto:yuejiazhang21@m.fudan.edu.cn)*

## CPU / Memory
评测程序 Source: [PassMark Performance Testing Linux](https://www.passmark.com/products/pt_linux/)

参数: Test Iterations: 3, Test Duration: Medium.

测试结果仅供参考, 有一定的波动. `(?)` 为未经有效确认的结果.

|**CPU Info** |`loginNode`|`bigMem0`|`bigMem1`|`bigMem2`|
|--|--:|--:|--:|--:|
|CPU Brand|Intel Xeon CPU E5-2670 v3 @ 2.30GHz|Intel Xeon Gold 6226R CPU @ 2.90GHz|Intel Xeon Gold 6226R CPU @ 2.90GHz|Hygon C86 7285 32-core Processor|
|Num of CPUs on Board                                     | 2  | 2  | 2  | 2 |
|Total Threads                                           | 24 | 64 | 64 | 128 |
|Base Clock Speed (GHz)                                  | 2.30 | 2.90 | 2.90 | 2.00 |
|Boost Clock Speed (GHz)                                 | 2.30 | 3.90 | 3.90 | 3.00(?) |
|CPU Cache (MiB/CPU)                                     | 30 | 22 | 22 | 64 |
|Lithography (Nanometer)                                 | 22 | 14 | 14 | 14(?) |
|**CPU Speed** |`loginNode`|`bigMem0`|`bigMem1`|`bigMem2`|
|Integer Math (Million Operations/s)                     |62,275 |206,066 |209,673 |328,027 |
|Floating Point Math (Million Operations/s)              |48,122 |129,819 |130,277 |146,501 |
|Prime Numbers (Million Primes/s)                        |188 |209 |230 |289 |
|Sorting (Thousand Strings/s)                            |41,063 |90,967|106,039 |172,684 |
|Encryption (MB/s)                                       |5,959 |25,616 |27,013 |99,718 |
|Compression (MB/s)                                      |315 |817 |865 |1,330 |
|CPU Single Threaded (Million Operations/s)              |1,414 |2,421 |2,407 |1,478 |
|Physics (Frames/s)                                      |1,229 |2,336 |3,002 |7,420 |
|Extended Instructions (SSE) (Million Matrices/s)        |21,430 |46,552 |47,889 |45,259 |
|**CPU Final Mark**                                      |19,471 | 42,705 | 46,047 |53,223 |
| **Memory Info** |`loginNode`|`bigMem0`|`bigMem1`|`bigMem2`|
|Total Available RAM (GiB)                   |125.5 |1,006.4 |1,006.3 |485.6 |
|Memory Frequency (MHz)                      |2,133 | 2,666 | 2,933 | 3200 |
| **Memory Speed** |`loginNode`|`bigMem0`|`bigMem1`|`bigMem2`|
|Memory Latency (Nanoseconds)                |50 |53 |52 |62|
|Memory Read Cached (MB/s)                   |17,005 |27,710  |27,698  |18,298 |
|Memory Read Uncached (MB/s)                 |8,187  |12,093  |11,800  |8700  |
|Memory Write (MB/s)                         |7,665  |10,100  |8,890  |7338  |
|Memory Threaded (MB/s)                      |71,989  |100,377  |169,758  |259,208 |
|Database Operations (Thousand Operations/s) |10,649 |18,742 |19,791 |16,254 |
|**Memory Final Mark**                       |2277 | 2827 | 2799 | 2,321 |

Reference:

[E5 2670 v3 Specs](https://ark.intel.com/content/www/us/en/ark/products/81709/intel-xeon-processor-e52670-v3-30m-cache-2-30-ghz.html)

[Gold 6226R Specs](https://ark.intel.com/content/www/us/en/ark/products/199347/intel-xeon-gold-6226r-processor-22m-cache-2-90-ghz.html)

[Hygon IPO Specs](http://static.sse.com.cn/stock/information/c/202203/8c31407852094a259d388fbb535942ca.pdf) pp.124-126

## GPU / DCU 计算加速卡

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
