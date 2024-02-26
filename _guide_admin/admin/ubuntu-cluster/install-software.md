---
title: 安装软件
nav_order: 3
parent: Ubuntu Cluster
---

# 安装软件

## Modules

```bash
sudo apt-get install environment-modules -y
sudo cp -r /etc/share/modules /etc/environment-modules/
```

## Python

```bash
sudo apt-get install python3-pip
sudo apt-get install python3-dateutil
```

## OpenBLAS & LAPACK

```bash
wget https://github.com/OpenMathLib/OpenBLAS/releases/download/v0.3.26/OpenBLAS-0.3.26.tar.gz
tar -xvf OpenBLAS-0.3.26.tar.gz
cd OpenBLAS-0.3.26
make -j
sudo make install PREFIX=/opt/openblas/0.3.26
cd ..
wget https://github.com/Reference-LAPACK/lapack/archive/refs/tags/v3.11.tar.gz
tar -xvf v3.11.tar.gz
cd lapack-3.11
mkdir build
cd build
CC=gcc CXX=g++ FC=gfortran cmake -DCMAKE_INSTALL_LIBDIR=/opt/lapack/3.11.0/ -DBUILD_SHARED_LIBS=ON ..
make -j
sudo make install
```

---
持续更新中