
# install openclash on R4S router

- download newest release from github openclash repo:

https://github.com/vernesong/OpenClash

- follow wiki to check all dependency installed

- try install the ipk package via `opkg install /abs/path/to/ipk`

- if error caused by some package like `libcap-bin`, find somewhere to download the pacakge

- the arch is `aarch64_generic`

for example 

https://openwrt.proxy.ustclug.org/snapshots/packages/aarch64_generic/base/

download [libcap](https://openwrt.proxy.ustclug.org/snapshots/packages/aarch64_generic/base/libcap_2.69-1_aarch64_generic.ipk) and [libcap-bin](https://openwrt.proxy.ustclug.org/snapshots/packages/aarch64_generic/base/libcap_2.69-1_aarch64_generic.ipk)

- after downloaded requirements and installed them by `opkg install`, try install `openclash` again.

- after installed, refresh the admin page of the router.

