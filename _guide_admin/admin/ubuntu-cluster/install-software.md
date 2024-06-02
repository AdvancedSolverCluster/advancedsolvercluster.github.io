---
title: 安装软件
nav_order: 3
parent: Ubuntu Cluster
---

# 安装软件

## Modules

```bash
sudo apt-get install environment-modules -y
```

修改 `/etc/environment-modules/modulespath`:

```text
/etc/environment-modules/modules
/software/modulefiles
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

## Intel OneAPI (以2024版为例)

```bash
sudo apt-get install libnotify4 libatspi2.0-0 xdg-utils libgbm1 libgtk-3-0 -y
wget https://registrationcenter-download.intel.com/akdlm/IRC_NAS/163da6e4-56eb-4948-aba3-debcec61c064/l_BaseKit_p_2024.0.1.46.sh
sudo sh ./l_BaseKit_p_2024.0.1.46.sh -a --silent --eula accept
wget https://registrationcenter-download.intel.com/akdlm/IRC_NAS/67c08c98-f311-4068-8b85-15d79c4f277a/l_HPCKit_p_2024.0.1.38.sh
sudo sh ./l_HPCKit_p_2024.0.1.38.sh -a --silent --eula accept
```

## MPICH

```bash
wget https://www.mpich.org/static/downloads/4.2.0/mpich-4.2.0.tar.gz

tar -xvzf mpich-4.2.0.tar.gz

sudo mkdir -p /opt/MPICH/4.2.0
mkdir -p ./tmp_build/mpich-4.2.0

cd ./tmp_build/mpich-4.2.0
../../mpich-4.2.0/configure --prefix=/opt/MPICH/4.2.0 2>&1 | tee c.txt

make 2>&1 | tee m.txt

sudo make install 2>&1 | tee mi.txt

content="#include<stdio.h>
#include\"mpi.h\"

int main(int argc, char *argv[]){
        int totalTaskNum, rankID;

        int rt = MPI_Init(&argc, &argv);
        if(rt != MPI_SUCCESS){
                printf(\"Error starting MPI.\\n\");
                MPI_Abort(MPI_COMM_WORLD, rt);
        }

        MPI_Comm_size(MPI_COMM_WORLD, &totalTaskNum);
        MPI_Comm_rank(MPI_COMM_WORLD, &rankID);

        printf(\"Hello, world! %dth of totalTaskNum = %d\\n\", rankID, totalTaskNum);

        MPI_Finalize();

        return 0;
}"

echo "$content" > test_mpi.cpp

mpic++ test_mpi.cpp -o test_mpi.x
mpiexec -n 4 ./test_mpi.x

rm -r mpich-4.0.2/
rm -r ./tmp_build/
rm mpich-4.2.0.tar.gz
```

---
持续更新中
