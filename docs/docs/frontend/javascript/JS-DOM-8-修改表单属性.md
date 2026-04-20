---
title: "JavaScript 修改表单属性"
description: "JavaScript 修改表单属性的方法，包括表单元素属性的获取与设置、常用表单元素属性和表单元素属性操作示例。"
date: 2026-04-21
tags: [JavaScript, DOM, 表单属性]
sidebar: auto
---

#JavaScript

======================================================
## 表单元素属性的获取与设置

| 操作 | 语法 | 描述 |
|------|------|--------|
| 获取属性值 | DOM对象.属性名 | 获取表单元素的属性值 |
| 设置属性值 | DOM对象.属性名 = 新值 | 设置表单元素的属性值 |

======================================================
## 常用表单元素属性

| 属性 | 描述 | 示例 |
|------|------|--------|
| value | 获取或设置表单元素的值 | 表单.value = '用户名' |
| type | 获取或设置表单元素的类型 | 表单.type = 'password' |
| disabled | 禁用或启用表单元素 | 表单.disabled = true |
| checked | 控制复选框或单选按钮的选中状态 | 表单.checked = true |
| selected | 控制下拉菜单选项的选中状态 | 选项.selected = true |

======================================================
## 表单元素属性操作示例

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>表单元素属性操作示例</title>
  <style>
    form {
      max-width: 400px;
      margin: 20px auto;
      padding: 20px;
      border: 1px solid #ddd;
      border-radius: 5px;
      background-color: #f9f9f9;
    }
    div {
      margin-bottom: 15px;
    }
    label {
      display: inline-block;
      width: 80px;
      font-weight: bold;
    }
    input[type="text"],
    input[type="password"],
    select {
      width: 200px;
      padding: 5px;
      border: 1px solid #ddd;
      border-radius: 3px;
    }
    button {
      padding: 5px 15px;
      margin-right: 10px;
      border: 1px solid #ddd;
      border-radius: 3px;
      background-color: #f0f0f0;
      cursor: pointer;
    }
    button:hover {
      background-color: #e0e0e0;
    }
    button:disabled {
      background-color: #ccc;
      cursor: not-allowed;
    }
  </style>
</head>
<body>
  <form>
    <div>
      <label for="username">用户名：</label>
      <input type="text" id="username" name="username">
    </div>
    <div>
      <label for="password">密码：</label>
      <input type="password" id="password" name="password">
      <button type="button" id="togglePwd">切换可见性</button>
    </div>
    <div>
      <label for="remember">记住我：</label>
      <input type="checkbox" id="remember" name="remember">
    </div>
    <div>
      <label for="gender">性别：</label>
      <input type="radio" id="male" name="gender" value="male">
      <label for="male">男</label>
      <input type="radio" id="female" name="gender" value="female">
      <label for="female">女</label>
    </div>
    <div>
      <label for="role">角色：</label>
      <select id="role" name="role">
        <option value="admin">管理员</option>
        <option value="user">普通用户</option>
        <option value="guest">访客</option>
      </select>
    </div>
    <div>
      <button type="button" id="submitBtn">提交</button>
      <button type="reset">重置</button>
    </div>
  </form>
  
  <script>
    // 获取表单元素
    const username = document.getElementById('username');
    const password = document.getElementById('password');
    const togglePwd = document.getElementById('togglePwd');
    const remember = document.getElementById('remember');
    const male = document.getElementById('male');
    const female = document.getElementById('female');
    const role = document.getElementById('role');
    const submitBtn = document.getElementById('submitBtn');
    
    // 设置默认值
    username.value = '默认用户名';
    male.checked = true; // 默认选中男
    role.value = 'user'; // 默认选择普通用户
    
    // 切换密码可见性
    togglePwd.addEventListener('click', function() {
      if (password.type === 'password') {
        password.type = 'text';
        togglePwd.textContent = '隐藏密码';
      } else {
        password.type = 'password';
        togglePwd.textContent = '显示密码';
      }
    });
    
    // 禁用提交按钮
    submitBtn.disabled = true;
    
    // 监听用户名输入，输入后启用提交按钮
    username.addEventListener('input', function() {
      submitBtn.disabled = this.value === '';
    });
    
    // 提交按钮点击事件
    submitBtn.addEventListener('click', function() {
      // 获取所有表单值
      const formData = {
        username: username.value,
        password: password.value,
        remember: remember.checked,
        gender: male.checked ? 'male' : 'female',
        role: role.value
      };
      
      console.log('表单数据:', formData);
      alert('表单提交成功！');
    });
  </script>
</body>
</html>
```

======================================================