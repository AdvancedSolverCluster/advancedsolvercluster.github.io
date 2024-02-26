---
title: 在教程中写入小测试
nav_order: 2
parent: AdvancedSolver.com
---

# 在教程中写入小测试

照抄下面这段代码, 可以复制粘贴任意个question line来增加行数; 一定要注意name, id不应该与其他问题重名!

单选题

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

填空题

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
