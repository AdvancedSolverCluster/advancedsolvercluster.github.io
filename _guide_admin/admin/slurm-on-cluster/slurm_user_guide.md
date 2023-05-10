---
title: "SLURM User Guide"
---

# "SLURM User Guide"

### Ver. 2022/1/9 - by Yuejia Zhang, Xiang Li

<details> <summary> <h2> Introduction </h2> </summary>

The Simple Linux Utility for Resource Management (SLURM) is used for submission, scheduling, execution, and monitoring of jobs on our cluster. SLURM is a free open-source resource manager and scheduler. It is a modern, extensible batch system that is widely deployed around the world on clusters of various sizes.

This guide explains **how users should use SLURM in order to run jobs on our cluster** (for now).

</details>

## Basic SLURM commands

SLURM offers a variety of user commands for all the necessary actions concerning the jobs. With these commands the users have a rich interface to allocate resources, query job status, control jobs, manage accounting information and to simplify their work with some utility commands.

- **`sbatch` submit a batch script that will be executed on the allocated computing node.** The working directory coincides with the working directory of the sbatch directory. Within the script one or multiple srun commands can be used to create job steps and execute parallel applications.

- **`sinfo` show information about all partitions and nodes managed by SLURM as well as about general system state.**

- **`squeue` query the list of pending and running jobs.** By default it reports the list of pending jobs sorted by priority and the list of running jobs sorted separately according to the job priority. The most relevant job states are running (R), pending (PD), completing (CG), completed (CD) and cancelled (CA). The TIME field shows the actual job execution time. The NODELIST (REASON) field indicates on which nodes the job is running or the reason why the job is pending. Typical reasons for pending jobs are waiting for resources to become available (Resources) and queuing behind a job with higher priority (Priority).

- **`scancel` cancel a pending or running job or job step.** It can also be used to send an arbitrary signal to all processes associated with a running job or job step.

- (BANNED) `salloc` request interactive jobs/allocations. When the job is started a shell (or other program specified on the command line) is started on the submission host (login node). From this shell you should use srun to interactively start a parallel applications. The allocation is released when the user exits the shell.

- `srun` initiate parallel job steps within a job or start an interactive job.

## A very simple rookie-level guide to submit a job

### STEP 1: Write bash script
Use your favorite editor to generate the below script `test.sbatch`. The first line must be
```bash
#!/bin/bash
```
From the second line, list all the commands you want to run on the server. For example, if you want to run a python 3 program called `helloworld.py`, then you only need to make your `test.sbatch` look like this:
```bash
#!/bin/bash
python3 helloworld.py
```
Or if you want to run a binary file `myTest/test` generated from `myTest/test.c`, then your `test.sbatch` should look like this:
```bash
#!/bin/bash
myTest/test
```
If `myTest/test` is a CUDA program, remember to load the environment, **and apply for GPU resources (second line).**
```bash
#!/bin/bash
#SBATCH --gpus=1
module load CUDA
myTest/test
```
If `myTest/test` is a MPI program, remember to load the environment.
```bash
#!/bin/bash
source /opt/intel/oneapi/setvars.sh
mpirun -n 10 ./testmpi
```
If you run a MATLAB program, remember to load the environment and run `testMatlab.m`. **Remember to `cd` to the directory where matlab file is before submitting your job.**
```bash
#!/bin/bash
module load MATLAB
matlab -batch "testMatlab"
```
### STEP 2: Submit your job
```bash
sbatch test.sbatch
```
It will return `Submitted batch job ###`, where ### is your job id.

### STEP 3: View running progress and results
When your program is finished, an output file will appear in the directory `slurm-###.out`, where ### is your job id. You can open it using your favorite editor, or run
```bash
cat slurm-###.out
```
to see it in the terminal.

While waiting for your program to execute, you can know the status of the program through `squeue`. For example, the following command list all the job submitted by `username`:
```bash
squeue -u username
```
where `username` is your username (e.g. yjzhang). You will see your job with your jobid, job name, status and time spent, like the following:
```
             JOBID PARTITION     NAME     USER ST       TIME  NODES NODELIST(REASON)
               001    bigMem  python3  yjzhang PD       0:00     10 (PartitionNodeLimit)
               002    bigMem  python3  yjzhang  R       0:56      1 bigMem0
```
Typical job states from submission until completion are: PENDING (PD) and RUNNING (R). If you don't see your job then most likely it is finished.

If you don't want to run a job anymore, cancel it using the following command:
```bash
scancel ###
```
where ### is the jobid (e.g. 001). After you cancel it, you will no longer see it in the queue.

**The rest of the document may be a little difficult for beginners, you can skip it in the first reading.**

## Advanced usage of `sbatch`

The usual way to allocate resources and execute a job is to write a batch script and submit them to SLURM with the `sbatch` command. The batch script is a shell script consisting of two parts: resources requests and job steps. Resources requests are specifications for number of nodes needed to execute the job, time duration of the job etc. Job steps are user's tasks that must be executed. The resources requests and other SLURM submission options are prefixed by '#SBATCH ' directives and must precede any executable commands in the batch script.

Below is an example of sbatch script:

```bash
#!/bin/bash
#SBATCH --job-name=python_job_test    # Job name
#SBATCH --nodes=1                     # Number of nodes to use
#SBATCH --ntasks=1                    # Number of tasks (MPI processes)
#SBATCH --cpus-per-task=1             # Number of threads (logical cores) per task (OPENMP)
#SBATCH --time=00:05:00               # Time limit hrs:min:sec
#SBATCH --output=python_%j.log        # Standard output and error log
pwd; hostname; date
echo "Running python on the server"
python3 helloworld.py
```
where `helloworld.py` is just reading the local file `helloworld.txt` and print out the content.

```python
with open("helloworld.txt", "r") as f:
    s = f.readline()
    print(s)
```

Run sbatch test.sbatch and see the log file.

```
[yjzhang@loginNode ~]$ sbatch test.sbatch
Submitted batch job 235
[yjzhang@loginNode ~]$ cat python_235.log
/home/yjzhang
bigMem0
2021年 12月 15日 星期三 13:39:07 CST
Running python on the server
Hello File!
```

The following table describes the most common or required allocation and submission options that can be defined in a batch script (short options are listed in parentheses):

| sbatch option                                              |          default value         |                                                                                       description                                                                                      |
|------------------------------------------------------------|:------------------------------:|:--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------:|
|   --nodes=\<number> (-N \<number>)                            | 1                              | Number of nodes for the allocation                                                                                                                                                     |
|   --ntasks=\<number> (-n \<number>)                           | 1                              | Number of tasks (MPI processes). Can be omitted if --nodes and --ntasks-per-node are given                                                                                             |
|   --ntasks-per-node=\<num>                                  | 1                              | Number of tasks per node. If keyword omitted the default value is  used, but there are still 48 CPUs available per node for current  allocation (if not shared)                        |
|   --cpus-per-task=\<number> (-c \<number>)                   | 1                              | Number of threads (logical cores) per task. Used for OpenMP or hybrid jobs                                                                                                             |
|   --output=\<path>\/\<file pattern> (-o \<path>\/\<file pattern>)  |   slurm-%j.out   (%j = JobID)  | Standard output file                                                                                                                                                                   |
|   --error=\<path>\/\<file pattern> (-e \<path>\/\<file pattern>)   |   slurm-%j.out   (%j = JobID)  | Standard error file                                                                                                                                                                    |
|   --time=\<walltime> (-t \<walltime>)                         | 3 days        | Requested walltime limit for the job; possible time formats are:     [hours:]minutes[:seconds] e.g. 20, 01:20, 01:20:30   days-hours[:minutes][:seconds] e.g. 2-0, 1-5:20, 1-5:20:30   |
|   --partition=\<name> (-p \<name>)                         | bigMem                         | Partition to run the job                                                     |
|   --job-name=\<jobname> (-J \<jobname>)                       | job script's name                                   | Job name

To see more usage of `sbatch`, refer to the below websites:
- [Official introduction of sbatch](https://slurm.schedmd.com/sbatch.html)
- More examples: [1](https://help.rc.ufl.edu/doc/Annotated_SLURM_Script), [2](https://help.rc.ufl.edu/doc/Sample_SLURM_Scripts) and [3](https://wiki.umiacs.umd.edu/umiacs/index.php/SLURM/JobSubmission)

## SLURM Command Examples
Below some examples of SLURM query commands are provided.

List all jobs submitted to SLURM:
```bash
squeue
```

List all jobs submitted by you:
```bash
squeue -u $USER
```

Check available partitions and nodes:
```bash
sinfo
```
The sinfo command reports the states of the partitions and the nodes. The partitions may be in state UP, DOWN or INACTIVE. The UP state means that a partition will accept new submissions and the jobs will be scheduled. The DOWN state allows submissions to a partition but the jobs will not be scheduled. The INACTIVE state means that submissions are not allowed. The nodes also can be in various states, such as alloc (allocated), comp (completing), down, idle, maint, resv (reserved) etc. Description of all node states can be get from the sinfo man page.

List partition state summary
```bash
sinfo -s
```
The column NODES(A/I/O/T) shows number of nodes in the states "allocated/idle/other/total" for each SLURM partition.

Cancel job with SLURM JobId 4711:
```bash
scancel 4711
```
Cancel all your jobs:
```bash
scancel -u $USER
```


## Reference
Reference: https://www.dkrz.de/up/systems/mistral/running-jobs/slurm-introduction


