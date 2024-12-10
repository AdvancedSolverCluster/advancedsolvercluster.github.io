---
title: 安装软件
nav_order: 3
parent: Ubuntu Cluster
---

# 安装软件
*Last modified: October 20, 2024*

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
# first go to https://developer.nvidia.com/cuda-downloads to download the newest version of cuda, for example
wget https://developer.download.nvidia.com/compute/cuda/12.5.0/local_installers/cuda_12.5.0_555.42.02_linux.run
sudo sh cuda_12.5.0_555.42.02_linux.run

# then install the old toolkits
wget https://developer.download.nvidia.com/compute/cuda/11.8.0/local_installers/cuda_11.8.0_520.61.05_linux.run
sudo sh cuda_11.8.0_520.61.05_linux.run --silent --toolkit --toolkitpath=/opt/cuda/11.8
wget https://developer.download.nvidia.com/compute/cuda/12.3.2/local_installers/cuda_12.3.2_545.23.08_linux.run
sudo sh cuda_12.3.2_545.23.08_linux.run --silent --toolkit --toolkitpath=/opt/cuda/12.3

# finally uninstall the newest toolkit
sudo /usr/local/cuda-12.5/bin/cuda-uninstaller
```

## Python

```bash
sudo apt-get install python3-pip
sudo apt-get install python3-dateutil
```

### OpenSSL

```bash
export OPSSL_VER=3.0.8

wget https://www.openssl.org/source/openssl-$OPSSL_VER.tar.gz
wget https://www.openssl.org/source/openssl-$OPSSL_VER.tar.gz.sha256
sha256sum openssl-$OPSSL_VER.tar.gz
cat openssl-$OPSSL_VER.tar.gz.sha256
rm openssl-$OPSSL_VER.tar.gz.sha256

tar -xzvf openssl-$OPSSL_VER.tar.gz
cd openssl-$OPSSL_VER/
./config --prefix=/opt/OpenSSL/$OPSSL_VER --openssldir=/opt/OpenSSL/$OPSSL_VER shared zlib
make -j
make test

sudo make install
```

### Python multi versions
```bash
sudo apt-get install libbz2-dev libncurses5-dev libncursesw5-dev libgdbm-dev  liblzma-dev libsqlite3-dev tk-dev uuid-dev libreadline-dev libffi-dev


export OPSSL_VER=3.0.8
export LDFLAGS=-L/opt/OpenSSL/$OPSSL_VER/lib64
export LD_LIBRARY_PATH=/opt/OpenSSL/$OPSSL_VER/lib64

# ensure you export these env vars before configure!!!

# Go to python.org download corresponding versino of .xz format
# usually you should check which version is the newest

export PY_VER=3.8.12
export PY_VER=3.10.13
export PY_VER=3.12.2

wget https://www.python.org/ftp/python/$PY_VER/Python-$PY_VER.tar.xz --no-check-certificate


# ****bigMem2 needs to remove the --with-lto option****

tar -xvf Python-$PY_VER.tar.xz && cd Python-$PY_VER
LDFLAGS="${LDFLAGS} -Wl,-rpath=/opt/OpenSSL/$OPSSL_VER/lib64" ./configure --enable-optimizations --enable-loadable-sqlite-extensions --enable-ipv6 --enable-big-digits --with-lto --with-pymalloc --with-doc-strings --with-openssl=/opt/OpenSSL/$OPSSL_VER --prefix=/opt/Python/$PY_VER > configure.log 2>&1

# check configure.log
# check if configure log shows that ssl support is correctly installed! (check the last part of the log to see if any module is not correctly installed)
grep SSL configure.log

make -j > make.log 2>&1


# check make.log
# make sure no module fails to build! except _dbm only
tail -n 25 make.log


# ****bigMem3 needs to run `ulimit -n 32768` by root before install****
sudo make install

# Copy or create modulefiles
# sudo cp -r modulefiles/Python /etc/modulefiles

sudo ln -s /opt/Python/$PY_VER/bin/python3 /opt/Python/$PY_VER/bin/python
sudo ln -s /opt/Python/$PY_VER/bin/pip3 /opt/Python/$PY_VER/bin/pip

sudo /opt/Python/$PY_VER/bin/python3 -m pip install --upgrade pip
sudo /opt/Python/$PY_VER/bin/python3 -m pip install pandas polars scikit-learn numpy matplotlib requests
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

## Ruby

使用 [ruby-build](https://github.com/rbenv/ruby-build) 安装:

打开网页, 依照 (Install manually as a standalone program) 下载最新版本的 tarball

```bash
wget https://github.com/rbenv/ruby-build/archive/refs/tags/v20241017.tar.gz
tar -xzvf v20241017.tar.gz
cd ruby-build-20241017/

export PREFIX=/opt/Ruby/ruby-build/20241017
sudo ./install.sh

cd /opt/Ruby/ruby-build/20241017/bin
./ruby-build --list

sudo ./ruby-build 3.3.5 /opt/Ruby/3.3.5

```


---
持续更新中
