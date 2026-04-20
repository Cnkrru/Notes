import{_ as s,o as a,c as p,ag as l}from"./chunks/framework.Cqf6AMW8.js";const m=JSON.parse('{"title":"JavaScript DOM增删查","description":"JavaScript DOM增删查的使用方法，包括DOM节点类型和增删改查操作。","frontmatter":{"title":"JavaScript DOM增删查","description":"JavaScript DOM增删查的使用方法，包括DOM节点类型和增删改查操作。","date":"2026-04-21T00:00:00.000Z","tags":["JavaScript","DOM","增删查"],"sidebar":"auto"},"headers":[],"relativePath":"docs/frontend/javascript/JS-DOM-14-DOM增删查.md","filePath":"docs/frontend/javascript/JS-DOM-14-DOM增删查.md","lastUpdated":1776715536000}'),e={name:"docs/frontend/javascript/JS-DOM-14-DOM增删查.md"};function t(i,n,c,o,d,r){return a(),p("div",null,[...n[0]||(n[0]=[l(`<h2 id="_1-dom-节点类型" tabindex="-1">1. DOM 节点类型 <a class="header-anchor" href="#_1-dom-节点类型" aria-label="Permalink to &quot;1. DOM 节点类型&quot;">​</a></h2><table tabindex="0"><thead><tr><th>节点类型</th><th>描述</th><th>示例</th></tr></thead><tbody><tr><td>元素节点</td><td>所有的标签，如 body、div</td><td><code>&lt;div&gt;内容&lt;/div&gt;</code></td></tr><tr><td>属性节点</td><td>所有的属性，如 href</td><td><code>&lt;a href=&quot;#&quot;&gt;链接&lt;/a&gt;</code></td></tr><tr><td>文本节点</td><td>所有的文本</td><td><code>文本内容</code></td></tr><tr><td>其他</td><td>注释、文档类型等</td><td><code>&lt;!-- 注释 --&gt;</code></td></tr></tbody></table><h2 id="_2-增删改查操作" tabindex="-1">2. 增删改查操作 <a class="header-anchor" href="#_2-增删改查操作" aria-label="Permalink to &quot;2. 增删改查操作&quot;">​</a></h2><table tabindex="0"><thead><tr><th>操作类型</th><th>方法/属性</th><th>描述</th></tr></thead><tbody><tr><td>查找节点</td><td><code>parentNode</code></td><td>获取父节点</td></tr><tr><td></td><td><code>children</code></td><td>仅获得所有元素子节点（重点），返回的是一个伪数组</td></tr><tr><td></td><td><code>nextElementSibling</code></td><td>获取下一个兄弟节点</td></tr><tr><td></td><td><code>previousElementSibling</code></td><td>获取上一个兄弟节点</td></tr><tr><td>增加节点</td><td><code>createElement</code></td><td>创建一个新的元素节点</td></tr><tr><td></td><td><code>cloneNode</code></td><td>克隆一个已有的元素节点，括号内传入布尔值，true 表示包含后代节点，false 表示不包含（默认）</td></tr><tr><td></td><td><code>appendChild</code></td><td>插入到父元素的最后一个子元素</td></tr><tr><td></td><td><code>insertBefore</code></td><td>插入到父元素中某个子元素的前面</td></tr><tr><td>删除节点</td><td><code>removeChild</code></td><td>通过父元素删除子元素，语法：父元素.removeChild(要删除的元素)</td></tr></tbody></table><h2 id="实例代码" tabindex="-1">实例代码 <a class="header-anchor" href="#实例代码" aria-label="Permalink to &quot;实例代码&quot;">​</a></h2><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>&lt;!DOCTYPE html&gt;</span></span>
<span class="line"><span>&lt;html lang=&quot;zh-CN&quot;&gt;</span></span>
<span class="line"><span>&lt;head&gt;</span></span>
<span class="line"><span>    &lt;meta charset=&quot;UTF-8&quot;&gt;</span></span>
<span class="line"><span>    &lt;meta name=&quot;viewport&quot; content=&quot;width=device-width, initial-scale=1.0&quot;&gt;</span></span>
<span class="line"><span>    &lt;title&gt;DOM 增删改查示例&lt;/title&gt;</span></span>
<span class="line"><span>    &lt;style&gt;</span></span>
<span class="line"><span>        * {</span></span>
<span class="line"><span>            margin: 0;</span></span>
<span class="line"><span>            padding: 0;</span></span>
<span class="line"><span>            box-sizing: border-box;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        body {</span></span>
<span class="line"><span>            font-family: Arial, sans-serif;</span></span>
<span class="line"><span>            line-height: 1.6;</span></span>
<span class="line"><span>            padding: 20px;</span></span>
<span class="line"><span>            background-color: #f5f5f5;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        .container {</span></span>
<span class="line"><span>            max-width: 800px;</span></span>
<span class="line"><span>            margin: 0 auto;</span></span>
<span class="line"><span>            background-color: #fff;</span></span>
<span class="line"><span>            padding: 20px;</span></span>
<span class="line"><span>            border-radius: 8px;</span></span>
<span class="line"><span>            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        h1 {</span></span>
<span class="line"><span>            text-align: center;</span></span>
<span class="line"><span>            margin-bottom: 20px;</span></span>
<span class="line"><span>            color: #333;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        .controls {</span></span>
<span class="line"><span>            display: flex;</span></span>
<span class="line"><span>            flex-wrap: wrap;</span></span>
<span class="line"><span>            gap: 10px;</span></span>
<span class="line"><span>            margin-bottom: 20px;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        button {</span></span>
<span class="line"><span>            padding: 8px 16px;</span></span>
<span class="line"><span>            background-color: #4CAF50;</span></span>
<span class="line"><span>            color: white;</span></span>
<span class="line"><span>            border: none;</span></span>
<span class="line"><span>            border-radius: 4px;</span></span>
<span class="line"><span>            cursor: pointer;</span></span>
<span class="line"><span>            font-size: 14px;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        button:hover {</span></span>
<span class="line"><span>            background-color: #45a049;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        .demo-area {</span></span>
<span class="line"><span>            border: 1px solid #ddd;</span></span>
<span class="line"><span>            padding: 20px;</span></span>
<span class="line"><span>            margin-bottom: 20px;</span></span>
<span class="line"><span>            border-radius: 4px;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        .item {</span></span>
<span class="line"><span>            background-color: #f0f0f0;</span></span>
<span class="line"><span>            padding: 10px;</span></span>
<span class="line"><span>            margin: 10px 0;</span></span>
<span class="line"><span>            border-radius: 4px;</span></span>
<span class="line"><span>            border-left: 4px solid #4CAF50;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        .result {</span></span>
<span class="line"><span>            background-color: #e3f2fd;</span></span>
<span class="line"><span>            padding: 10px;</span></span>
<span class="line"><span>            border-radius: 4px;</span></span>
<span class="line"><span>            margin-top: 10px;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    &lt;/style&gt;</span></span>
<span class="line"><span>&lt;/head&gt;</span></span>
<span class="line"><span>&lt;body&gt;</span></span>
<span class="line"><span>    &lt;div class=&quot;container&quot;&gt;</span></span>
<span class="line"><span>        &lt;h1&gt;DOM 增删改查示例&lt;/h1&gt;</span></span>
<span class="line"><span>        </span></span>
<span class="line"><span>        &lt;div class=&quot;controls&quot;&gt;</span></span>
<span class="line"><span>            &lt;button data-func=&quot;createElement&quot;&gt;创建元素&lt;/button&gt;</span></span>
<span class="line"><span>            &lt;button data-func=&quot;cloneElement&quot;&gt;克隆元素&lt;/button&gt;</span></span>
<span class="line"><span>            &lt;button data-func=&quot;deleteElement&quot;&gt;删除元素&lt;/button&gt;</span></span>
<span class="line"><span>            &lt;button data-func=&quot;findParent&quot;&gt;查找父节点&lt;/button&gt;</span></span>
<span class="line"><span>            &lt;button data-func=&quot;findChildren&quot;&gt;查找子节点&lt;/button&gt;</span></span>
<span class="line"><span>            &lt;button data-func=&quot;findNextSibling&quot;&gt;查找下一个兄弟节点&lt;/button&gt;</span></span>
<span class="line"><span>            &lt;button data-func=&quot;findPrevSibling&quot;&gt;查找上一个兄弟节点&lt;/button&gt;</span></span>
<span class="line"><span>        &lt;/div&gt;</span></span>
<span class="line"><span>        </span></span>
<span class="line"><span>        &lt;div class=&quot;demo-area&quot; id=&quot;demoArea&quot;&gt;</span></span>
<span class="line"><span>            &lt;div class=&quot;item&quot; id=&quot;item1&quot;&gt;项目 1&lt;/div&gt;</span></span>
<span class="line"><span>            &lt;div class=&quot;item&quot; id=&quot;item2&quot;&gt;项目 2&lt;/div&gt;</span></span>
<span class="line"><span>            &lt;div class=&quot;item&quot; id=&quot;item3&quot;&gt;项目 3&lt;/div&gt;</span></span>
<span class="line"><span>        &lt;/div&gt;</span></span>
<span class="line"><span>        </span></span>
<span class="line"><span>        &lt;div class=&quot;result&quot; id=&quot;result&quot;&gt;&lt;/div&gt;</span></span>
<span class="line"><span>    &lt;/div&gt;</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    &lt;script&gt;</span></span>
<span class="line"><span>        // 创建元素</span></span>
<span class="line"><span>        function createElement() {</span></span>
<span class="line"><span>            // 创建新元素</span></span>
<span class="line"><span>            const newItem = document.createElement(&#39;div&#39;);</span></span>
<span class="line"><span>            newItem.classList.add(&#39;item&#39;);</span></span>
<span class="line"><span>            newItem.innerHTML = &#39;新创建的项目&#39;;</span></span>
<span class="line"><span>            </span></span>
<span class="line"><span>            // 添加到容器末尾</span></span>
<span class="line"><span>            const demoArea = document.querySelector(&#39;#demoArea&#39;);</span></span>
<span class="line"><span>            demoArea.appendChild(newItem);</span></span>
<span class="line"><span>            </span></span>
<span class="line"><span>            showResult(&#39;创建了新元素并添加到末尾&#39;);</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        </span></span>
<span class="line"><span>        // 克隆元素</span></span>
<span class="line"><span>        function cloneElement() {</span></span>
<span class="line"><span>            // 克隆元素</span></span>
<span class="line"><span>            const item2 = document.querySelector(&#39;#item2&#39;);</span></span>
<span class="line"><span>            const clonedItem = item2.cloneNode(true);</span></span>
<span class="line"><span>            clonedItem.innerHTML = &#39;克隆的项目 2&#39;;</span></span>
<span class="line"><span>            </span></span>
<span class="line"><span>            // 插入到项目 3 前面</span></span>
<span class="line"><span>            const demoArea = document.querySelector(&#39;#demoArea&#39;);</span></span>
<span class="line"><span>            const item3 = document.querySelector(&#39;#item3&#39;);</span></span>
<span class="line"><span>            demoArea.insertBefore(clonedItem, item3);</span></span>
<span class="line"><span>            </span></span>
<span class="line"><span>            showResult(&#39;克隆了项目 2 并插入到项目 3 前面&#39;);</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        </span></span>
<span class="line"><span>        // 删除元素</span></span>
<span class="line"><span>        function deleteElement() {</span></span>
<span class="line"><span>            // 删除元素</span></span>
<span class="line"><span>            const demoArea = document.querySelector(&#39;#demoArea&#39;);</span></span>
<span class="line"><span>            const item1 = document.querySelector(&#39;#item1&#39;);</span></span>
<span class="line"><span>            </span></span>
<span class="line"><span>            if (item1) {</span></span>
<span class="line"><span>                demoArea.removeChild(item1);</span></span>
<span class="line"><span>                showResult(&#39;删除了项目 1&#39;);</span></span>
<span class="line"><span>            } else {</span></span>
<span class="line"><span>                showResult(&#39;项目 1 已不存在&#39;);</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        </span></span>
<span class="line"><span>        // 查找父节点</span></span>
<span class="line"><span>        function findParent() {</span></span>
<span class="line"><span>            // 查找父节点</span></span>
<span class="line"><span>            const item2 = document.querySelector(&#39;#item2&#39;);</span></span>
<span class="line"><span>            const parent = item2.parentNode;</span></span>
<span class="line"><span>            </span></span>
<span class="line"><span>            showResult(\`项目 2 的父节点是: \${parent.tagName}\`);</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        </span></span>
<span class="line"><span>        // 查找子节点</span></span>
<span class="line"><span>        function findChildren() {</span></span>
<span class="line"><span>            // 查找子节点</span></span>
<span class="line"><span>            const demoArea = document.querySelector(&#39;#demoArea&#39;);</span></span>
<span class="line"><span>            const children = demoArea.children;</span></span>
<span class="line"><span>            let result = &#39;容器的子元素数量: &#39; + children.length + &#39;&lt;br&gt;&#39;;</span></span>
<span class="line"><span>            </span></span>
<span class="line"><span>            for (let i = 0; i &lt; children.length; i++) {</span></span>
<span class="line"><span>                result += \`子元素 \${i + 1}: \${children[i].innerHTML}&lt;br&gt;\`;</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>            </span></span>
<span class="line"><span>            showResult(result);</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        </span></span>
<span class="line"><span>        // 查找下一个兄弟节点</span></span>
<span class="line"><span>        function findNextSibling() {</span></span>
<span class="line"><span>            // 查找下一个兄弟节点</span></span>
<span class="line"><span>            const item2 = document.querySelector(&#39;#item2&#39;);</span></span>
<span class="line"><span>            const nextSibling = item2.nextElementSibling;</span></span>
<span class="line"><span>            </span></span>
<span class="line"><span>            if (nextSibling) {</span></span>
<span class="line"><span>                showResult(\`项目 2 的下一个兄弟节点是: \${nextSibling.innerHTML}\`);</span></span>
<span class="line"><span>            } else {</span></span>
<span class="line"><span>                showResult(&#39;项目 2 没有下一个兄弟节点&#39;);</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        </span></span>
<span class="line"><span>        // 查找上一个兄弟节点</span></span>
<span class="line"><span>        function findPrevSibling() {</span></span>
<span class="line"><span>            // 查找上一个兄弟节点</span></span>
<span class="line"><span>            const item2 = document.querySelector(&#39;#item2&#39;);</span></span>
<span class="line"><span>            const prevSibling = item2.previousElementSibling;</span></span>
<span class="line"><span>            </span></span>
<span class="line"><span>            if (prevSibling) {</span></span>
<span class="line"><span>                showResult(\`项目 2 的上一个兄弟节点是: \${prevSibling.innerHTML}\`);</span></span>
<span class="line"><span>            } else {</span></span>
<span class="line"><span>                showResult(&#39;项目 2 没有上一个兄弟节点&#39;);</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        </span></span>
<span class="line"><span>        // 显示结果</span></span>
<span class="line"><span>        function showResult(message) {</span></span>
<span class="line"><span>            const resultDiv = document.querySelector(&#39;#result&#39;);</span></span>
<span class="line"><span>            resultDiv.innerHTML = message;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        </span></span>
<span class="line"><span>        // 绑定事件（使用addEventListener，冒泡模式）</span></span>
<span class="line"><span>        document.addEventListener(&#39;DOMContentLoaded&#39;, function() {</span></span>
<span class="line"><span>            const buttons = document.querySelectorAll(&#39;button&#39;);</span></span>
<span class="line"><span>            buttons.forEach(button =&gt; {</span></span>
<span class="line"><span>                button.addEventListener(&#39;click&#39;, function() {</span></span>
<span class="line"><span>                    const funcName = this.getAttribute(&#39;data-func&#39;);</span></span>
<span class="line"><span>                    window[funcName]();</span></span>
<span class="line"><span>                });</span></span>
<span class="line"><span>            });</span></span>
<span class="line"><span>        });</span></span>
<span class="line"><span>    &lt;/script&gt;</span></span>
<span class="line"><span>&lt;/body&gt;</span></span>
<span class="line"><span>&lt;/html&gt;</span></span></code></pre></div>`,6)])])}const g=s(e,[["render",t]]);export{m as __pageData,g as default};
