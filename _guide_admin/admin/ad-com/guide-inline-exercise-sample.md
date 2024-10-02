---
title: 在教程中写入小测试
nav_order: 2
parent: AdvancedSolver.com
---

# 在教程中写入小测试

照抄下面这段代码, 可以复制粘贴任意个question line来增加行数; 一定要注意name, id不应该与其他问题重名!


```html
{: .tip }
> 以下哪个说法是正确的？
> <ul class="example-question">
>    <li><input type="radio" name="question1" id="q1opt1" /><label for="q1opt1" markdown="1">用 `srun -w bigMem0 nvidia-smi` 可以查看 `bigMem0` 上全部 GPU 的使用情况</label></li>
>    <li><input type="radio" name="question1" id="q1opt2" /><label for="q1opt2" markdown="1">没有申请过资源，也可以直接 `ssh bigMem0` 或 `ssh bigMem1`</label></li>
> </ul>
> <button onclick="window.alert(document.getElementById('q1opt1').checked ? 'text for opt1' : document.getElementById('q1opt2').checked ? 'text for opt2' : 'text for opt3 (if there is)')">提交</button>

```

旧版本

选择

~~~ html
<div style="background-color: #008080; color: white; ">
 <p style="margin: 10px">title</p>
 <div style="background-color: #BFDFDF; color: black">
  <p style="margin: 10px">question line1</p>
  <p style="margin: 10px">question line2</p>
  <p style="margin: 10px"><table>
    <td><input type="radio" name="question1" id="q1opt1" /><label for="q1opt1">123</label></td>
    <td><input type="radio" name="question1" id="q1opt2" /><label for="q1opt2">456</label></td>
  </table>
  </p>
  <p style="margin: 10px"><button onclick="window.alert(document.getElementById('q1opt2').checked ? 'Yeah!!' : 'Are you sure?')">Check</button></p>
 </div>
</div>
~~~

填空

~~~ html
<div style="background-color: #008080; color: white; ">
 <p style="margin: 10px">title</p>
 <div style="background-color: #BFDFDF; color: black">
  <p style="margin: 10px">question line1</p>
  <p style="margin: 10px">textbox in the same line <input type="text" id="question2" /></p>
  <p style="margin: 10px"><button onclick="window.alert(document.getElementById('question2').value === 'answer' ? 'Yeah!!' : 'Are you sure?')">Check</button></p>
 </div>
</div>
~~~
