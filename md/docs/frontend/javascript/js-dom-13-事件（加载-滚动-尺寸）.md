---
title: "JavaScript 事件（加载-滚动-尺寸）"

description: "JavaScript 事件（加载-滚动-尺寸）的使用方法，包括加载相关事件、滚动相关事件和尺寸相关事件。"

date: "2026-04-21"

tags: [JavaScript, DOM, 事件, 加载, 滚动, 尺寸]

sidebar: auto

---


| 事件分类 | 事件类型 | 语法 | 说明 |
|----------|----------|------|------|
| 加载相关 | 图片加载 | imageElement.addEventListener('load', function() {}) | 当图片资源加载完成时触发 |
|          | 图片加载失败 | imageElement.addEventListener('error', function() {}) | 当图片资源加载失败时触发 |
|          | 页面加载 | window.addEventListener('load', function() {}) | 所有资源加载完成时触发 |
|          | DOM加载 | document.addEventListener('DOMContentLoaded', function() {}) | DOM解析完成时触发 |
| 滚动相关 | 页面滚动 | window.addEventListener('scroll', function() {}) | 滚动条在滚动时持续触发 |
|          | 滚动位置获取 | element.scrollTop / element.scrollLeft | 获取元素滚动位置 |
| 尺寸相关 | 获取宽高 | element.offsetWidth / element.offsetHeight | 获取元素的自身宽高，包含padding、border |
|          | 获取位置 | element.offsetLeft / element.offsetTop | 获取元素距离定位父级的左、上距离 |

## 示例代码

### 完整HTML示例

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>其他事件示例</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            padding: 20px;
            margin: 0;
            height: 1000px;
            background: #f5f7fa;
        }
        .container {
            max-width: 800px;
            margin: 0 auto;
        }
        h1 {
            text-align: center;
            margin-bottom: 30px;
        }
        .section {
            background: white;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            margin-bottom: 20px;
        }
        h2 {
            color: #333;
            margin-bottom: 15px;
            font-size: 18px;
        }
        .image-container {
            width: 100%;
            height: 200px;
            border: 1px solid #ddd;
            border-radius: 8px;
            display: flex;
            align-items: center;
            justify-content: center;
            background: #f8f9fa;
            margin: 10px 0;
        }
        img {
            max-width: 100%;
            max-height: 100%;
            border-radius: 8px;
        }
        .status {
            margin: 10px 0;
            padding: 10px;
            background: #f8f9fa;
            border-radius: 4px;
            font-size: 14px;
        }
        .scroll-info {
            position: fixed;
            top: 20px;
            right: 20px;
            background: white;
            padding: 10px;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            font-size: 14px;
        }
        .back-to-top {
            position: fixed;
            bottom: 20px;
            right: 20px;
            width: 50px;
            height: 50px;
            border-radius: 50%;
            background: #007bff;
            color: white;
            border: none;
            font-size: 20px;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 2px 10px rgba(0,0,0,0.2);
            opacity: 0;
            transition: opacity 0.3s ease;
        }
        .back-to-top.visible {
            opacity: 1;
        }
        .size-info {
            margin: 10px 0;
            padding: 10px;
            background: #f8f9fa;
            border-radius: 4px;
            font-size: 14px;
        }
        .example {
            width: 200px;
            height: 100px;
            background: #e3f2fd;
            border: 2px solid #2196f3;
            padding: 10px;
            margin: 20px 0;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>其他事件示例</h1>
        
        <!-- 图片加载事件 -->
        <div class="section">
            <h2>1. 图片加载事件</h2>
            <div class="image-container">
                <img id="testImage" src="" alt="测试图片">
            </div>
            <div class="status" id="imageStatus">等待加载图片...</div>
        </div>
        
        <!-- 尺寸相关 -->
        <div class="section">
            <h2>2. 尺寸和位置</h2>
            <div class="example" id="sizeExample">尺寸测试元素</div>
            <div class="size-info" id="sizeInfo">元素尺寸和位置信息将显示在这里</div>
        </div>
        
        <!-- 页面加载事件 -->
        <div class="section">
            <h2>3. 页面加载事件</h2>
            <div class="status" id="loadStatus">等待页面加载...</div>
        </div>
    </div>
    
    <div class="scroll-info" id="scrollInfo">
        滚动位置: 0px
    </div>
    
    <button class="back-to-top" id="backToTop">↑</button>

    <script>
        // 获取元素
        const testImage = document.getElementById('testImage');
        const imageStatus = document.getElementById('imageStatus');
        const sizeExample = document.getElementById('sizeExample');
        const sizeInfo = document.getElementById('sizeInfo');
        const loadStatus = document.getElementById('loadStatus');
        const scrollInfo = document.getElementById('scrollInfo');
        const backToTop = document.getElementById('backToTop');

        // 1. 图片加载事件
        testImage.addEventListener('load', function() {
            imageStatus.textContent = '图片加载完成';
            imageStatus.style.backgroundColor = '#d4edda';
            console.log('图片加载完成');
            console.log('图片宽度:', this.width);
            console.log('图片高度:', this.height);
        });

        // 图片加载失败事件
        testImage.addEventListener('error', function() {
            imageStatus.textContent = '图片加载失败，显示默认图片';
            imageStatus.style.backgroundColor = '#f8d7da';
            this.src = 'https://via.placeholder.com/400x200?text=加载失败';
        });

        // 设置图片源
        testImage.src = 'https://picsum.photos/400/200?random=1';

        // 2. 页面滚动事件
        window.addEventListener('scroll', function() {
            const scrollTop = window.scrollY;
            scrollInfo.textContent = `滚动位置: ${scrollTop}px`;
            
            // 滚动超过300px显示返回顶部按钮
            if (scrollTop > 300) {
                backToTop.classList.add('visible');
            } else {
                backToTop.classList.remove('visible');
            }
        });

        // 返回顶部按钮点击事件
        backToTop.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });

        // 3. 页面加载事件
        window.addEventListener('load', function() {
            loadStatus.textContent = '所有资源加载完成';
            loadStatus.style.backgroundColor = '#d4edda';
            console.log('所有资源加载完成');
        });

        // DOM加载事件
        document.addEventListener('DOMContentLoaded', function() {
            console.log('DOM加载完成');
            
            // 获取元素尺寸和位置
            if (sizeExample) {
                sizeInfo.textContent = `元素宽度: ${sizeExample.offsetWidth}px, 元素高度: ${sizeExample.offsetHeight}px, 左边距: ${sizeExample.offsetLeft}px, 上边距: ${sizeExample.offsetTop}px`;
                console.log('元素宽度:', sizeExample.offsetWidth);
                console.log('元素高度:', sizeExample.offsetHeight);
                console.log('元素左边距:', sizeExample.offsetLeft);
                console.log('元素上边距:', sizeExample.offsetTop);
            }
        });
    </script>
</body>
</html>
```

