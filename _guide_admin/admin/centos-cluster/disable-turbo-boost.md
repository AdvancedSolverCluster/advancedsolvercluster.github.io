---
title: Manage Intel Turbo Boost with systemd
nav_order: 5
parent: CentOS Cluster (legacy)
---

# Manage Intel Turbo Boost with systemd

source: https://blog.christophersmart.com/2017/02/08/manage-intel-turbo-boost-with-systemd/


If you have a little laptop with an Intel CPU that supports turbo boost, you might find that it’s getting a little hot when you’re using it on your lap.

For example, taking a look at my CPU:

~~~ bash
lscpu |egrep "Model name|MHz"
~~~

We can see that it’s a 2.7GHz CPU with turbo boost taking it up to 3.5GHz.

~~~ text
Model name: Intel(R) Core(TM) i7-7500U CPU @ 2.70GHz
CPU MHz: 524.633
CPU max MHz: 3500.0000
CPU min MHz: 400.0000
~~~

Here’s a way that you can enable and disable turbo boost with a systemd service, which lets you hook it into other services or disable it on boot.

By default, turbo boost is on, so starting our service will disable it.

Create the service.


~~~ bash
cat << EOF | sudo tee \
/etc/systemd/system/disable-turbo-boost.service
[Unit]
Description=Disable Turbo Boost on Intel CPU

[Service]
ExecStart=/bin/sh -c "/usr/bin/echo 1 > \
/sys/devices/system/cpu/intel_pstate/no_turbo"
ExecStop=/bin/sh -c "/usr/bin/echo 0 > \
/sys/devices/system/cpu/intel_pstate/no_turbo"
RemainAfterExit=yes

[Install]
WantedBy=sysinit.target
EOF
~~~

Reload systemd manager configuration.

~~~ bash
sudo systemctl daemon-reload
~~~

Test it by running something CPU intensive and watching the current running MHz.

~~~ bash
cat /dev/urandom > /dev/null & echo 'This process run forever! Remember to kill it!'
lscpu |grep "CPU MHz"
~~~

~~~ text
CPU MHz: 3499.859
~~~

Now disable turbo boost and check the CPU speed again.

~~~ bash
sudo systemctl start disable-turbo-boost
lscpu |grep "CPU MHz"
~~~

~~~ text
CPU MHz: 2699.987
~~~

Don’t forget to kill the CPU intensive process 🙂

~~~ bash
kill %1
~~~

If you want to disable turbo boost on boot by default, just enable the service.

~~~ bash
sudo systemctl enable disable-turbo-boost
~~~

As turbo boost is enabled on a Linux system by default, to turn it back on you just need to turn off the script which disables it.

~~~ bash
sudo systemctl disable disable-turbo-boost
~~~
