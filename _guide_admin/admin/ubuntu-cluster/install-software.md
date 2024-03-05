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

## CUDA

```bash
# CUDA
# https://docs.nvidia.com/cuda/cuda-installation-guide-linux/index.html#runfile-installation
# we have to choose runfile, to install it in custom directory.

# Disable the Nouveau drivers
# Test: lsmod | grep nouveau, if prints anything then Nouveau is not disabled.
echo -e "blacklist nouveau\noptions nouveau modeset=0" | sudo tee -a  /etc/modprobe.d/blacklist-nouveau.conf
sudo update-initramfs -u
sudo reboot

# install CUDA
wget https://developer.download.nvidia.com/compute/cuda/11.8.0/local_installers/cuda_11.8.0_520.61.05_linux.run
sudo sh cuda_11.8.0_520.61.05_linux.run --silent --toolkitpath=/opt/cuda/11.8
wget https://developer.download.nvidia.com/compute/cuda/12.3.2/local_installers/cuda_12.3.2_545.23.08_linux.run
sudo sh cuda_12.3.2_545.23.08_linux.run --silent --toolkitpath=/opt/cuda/12.3
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

## MPICH

```bash
wget https://www.mpich.org/static/downloads/4.2.0/mpich-4.2.0.tar.gz

tar -xfzv mpich-4.2.0.tar.gz

sudo mkdir -p /opt/MPICH/4.2.0
mkdir -p ./tmp_build/mpich-4.2.0

cd ./tmp_build/mpich-4.2.0
../../mpich-4.2.0/configure --prefix=/opt/MPICH/4.2.0 2>&1 | tee c.txt

make 2>&1 | tee m.txt

sudo make install 2>&1 | tee mi.txt

rm -r mpich-4.0.2/
rm -r ./tmp_build/
rm mpich-4.2.0.tar.gz
```

---
持续更新中
