# [Making Installation USB Media on Windows](https://docs.centos.org/en-US/centos/install-guide/Making_Media_USB_Windows/)

1. Download and install [Fedora Media Writer](https://github.com/MartinBriza/MediaWriter/releases).
2. Download the [CentOS ISO image](http://mirrors.aliyun.com/centos/7.9.2009/isos/x86_64/) (`CentOS-7-x86_64-Everything-2009.iso`, 9.5 GB). Use [sha256sum](http://mirrors.aliyun.com/centos/7.9.2009/isos/x86_64/sha256sum.txt) to verify the integrity of the image file after the download finishes.
3. Plug in the USB drive (128 GB) you will be using to create bootable media.
4. Open Fedora Media Writer.
5. In the main window, click `Custom Image`(自定义镜像) and select the downloaded CentOS ISO image.
6. Click `Write to disk`(写入磁盘). 
7. When the creation process finishes and the `Complete!` message appears, unmount the USB drive using the `Safely remove hardware` icon in the system’s notification area.
