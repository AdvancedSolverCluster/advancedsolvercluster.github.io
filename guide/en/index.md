# Welcome to the Advanced Solver HPC Guide Page!

## Tutorial

<div style="color: red">Notice: This is a machine translated version of the guide page. Read carefully.</div>

- [Log in to the server for the first time! - Basic server operations: SSH & SCP](basic-ssh-scp.md)
- [Basic Operations of Servers? - Basics of Linux Servers](basic-linux.md)
- [My First Program! - Running Programs and Submitting Jobs](run-program.md)
- [Advanced 1: Writing code on the command line - vi/vim tutorial](vim.md)
- [Advanced 2: Use the editor to write code - VSCode Tutorial](vscode.md)
- [Advanced 3: Markdown Tutorial](markdown.md)
- [Advanced 4: Git Tutorial](git.md)
- [About the quota](xfs-quota.md)

## Announcement

## FAQ

*March 5, 2022, [Jingyu Liu](mailto:381258337@qq.com)*

- The location I want to access shows Permission denied, what should I do?

In general, everyone's work area is there `/home/username`. Permission denied occurs because you don't have permission to access this location, please don't access it, and generally you don't need to.

- The software I want to use is not available on the machine or the version is too low, what should I do?

An Installation guide will be provided on the homepage of the general software. Please install the software into your own user directory according to the installation guide (hint: the software compiled and installed by `make` or `cmake` can specify the installation path in the first step, then just specify the installation path for your own user directory, you do not need administrator rights).

If the installation fails, or there is no installation guide that does not require administrator privileges, please <a class="one" href="mailto:cash_admin@163.com">contact administrator</a>, and the software name and purpose should be stated in the email, and the administrator will reply within 24 hours.

- I accidentally modified the `~/.bashrc` file , and the Linux system command is invalid, what should I do?

Please use `/usr/bin/vim ~/.bashrc` back to `.bashrc` file to undo your changes to the original. If you have forgotten your changes, you can find a file named `bashrc_sample` in `/home/admin/script/`, delete the `.bashrc` file , then copy `bashrc_sample` and rename it for `.bashrc`(this command is `cp /home/admin/script/bashrc_sample ~/.bashrc`). Finally, reconnect to the server.

