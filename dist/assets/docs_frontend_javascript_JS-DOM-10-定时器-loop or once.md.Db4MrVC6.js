import{_ as s,o as a,c as t,ag as p}from"./chunks/framework.Cqf6AMW8.js";const m=JSON.parse('{"title":"JavaScript 定时器","description":"JavaScript 定时器的使用方法，包括setInterval和setTimeout两种定时器的特性和使用建议。","frontmatter":{"title":"JavaScript 定时器","description":"JavaScript 定时器的使用方法，包括setInterval和setTimeout两种定时器的特性和使用建议。","date":"2026-04-21T00:00:00.000Z","tags":["JavaScript","定时器","setInterval","setTimeout"],"sidebar":"auto"},"headers":[],"relativePath":"docs/frontend/javascript/JS-DOM-10-定时器-loop or once.md","filePath":"docs/frontend/javascript/JS-DOM-10-定时器-loop or once.md","lastUpdated":1776715536000}'),e={name:"docs/frontend/javascript/JS-DOM-10-定时器-loop or once.md"};function l(o,n,i,c,d,u){return a(),t("div",null,[...n[0]||(n[0]=[p(`<h2 id="两种定时器" tabindex="-1">两种定时器 <a class="header-anchor" href="#两种定时器" aria-label="Permalink to &quot;两种定时器&quot;">​</a></h2><table tabindex="0"><thead><tr><th>特性</th><th>setInterval (间隔函数)</th><th>setTimeout (延时函数)</th></tr></thead><tbody><tr><td>次数</td><td>重复执行，每隔指定时间执行一次</td><td>仅执行一次</td></tr><tr><td>用途</td><td>定期重复执行一段代码</td><td>延迟执行一段代码</td></tr><tr><td>开启</td><td>setInterval(回调函数, 毫秒)</td><td>setTimeout(回调函数, 毫秒)</td></tr><tr><td>清除</td><td>clearInterval(timer)</td><td>clearTimeout(timer)</td></tr><tr><td>机制</td><td>每隔指定时间执行一次</td><td>等待指定时间后执行一次</td></tr><tr><td>注意</td><td>函数名字不需要加括号；定时器返回的是一个id数字；一般不会刚创建就停止，而是满足一定条件再停止</td><td>延时器需要等待，所以后面的代码先执行；每一次调用延时器都会产生一个新的延时器</td></tr></tbody></table><h3 id="定时器使用建议" tabindex="-1">定时器使用建议 <a class="header-anchor" href="#定时器使用建议" aria-label="Permalink to &quot;定时器使用建议&quot;">​</a></h3><ol><li><strong>简单延迟执行</strong>：使用 <code>setTimeout</code></li><li><strong>简单重复执行</strong>：使用 <code>setInterval</code></li><li><strong>复杂重复执行</strong>：使用 <code>setInterval</code></li><li><strong>一次延迟操作</strong>：使用 <code>setTimeout</code></li></ol><h3 id="示例代码" tabindex="-1">示例代码 <a class="header-anchor" href="#示例代码" aria-label="Permalink to &quot;示例代码&quot;">​</a></h3><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>&lt;!DOCTYPE html&gt;</span></span>
<span class="line"><span>&lt;html lang=&quot;zh-CN&quot;&gt;</span></span>
<span class="line"><span>&lt;head&gt;</span></span>
<span class="line"><span>    &lt;meta charset=&quot;UTF-8&quot;&gt;</span></span>
<span class="line"><span>    &lt;meta name=&quot;viewport&quot; content=&quot;width=device-width, initial-scale=1.0&quot;&gt;</span></span>
<span class="line"><span>    &lt;title&gt;定时器示例&lt;/title&gt;</span></span>
<span class="line"><span>    &lt;style&gt;</span></span>
<span class="line"><span>        body { font-family: Arial, sans-serif; padding: 20px; }</span></span>
<span class="line"><span>        .section { margin: 20px 0; padding: 10px; border: 1px solid #ddd; }</span></span>
<span class="line"><span>        button { margin: 5px; padding: 5px 10px; }</span></span>
<span class="line"><span>        .result { margin-top: 10px; padding: 10px; background: #f0f8ff; }</span></span>
<span class="line"><span>    &lt;/style&gt;</span></span>
<span class="line"><span>&lt;/head&gt;</span></span>
<span class="line"><span>&lt;body&gt;</span></span>
<span class="line"><span>    &lt;h1&gt;定时器示例&lt;/h1&gt;</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    &lt;!-- setTimeout 示例 --&gt;</span></span>
<span class="line"><span>    &lt;div class=&quot;section&quot;&gt;</span></span>
<span class="line"><span>        &lt;h2&gt;setTimeout（只执行一次）&lt;/h2&gt;</span></span>
<span class="line"><span>        &lt;button onclick=&quot;startTimeout()&quot;&gt;开始延时&lt;/button&gt;</span></span>
<span class="line"><span>        &lt;button onclick=&quot;stopTimeout()&quot; disabled&gt;取消&lt;/button&gt;</span></span>
<span class="line"><span>        &lt;div class=&quot;result&quot; id=&quot;timeoutResult&quot;&gt;&lt;/div&gt;</span></span>
<span class="line"><span>    &lt;/div&gt;</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    &lt;!-- setInterval 示例 --&gt;</span></span>
<span class="line"><span>    &lt;div class=&quot;section&quot;&gt;</span></span>
<span class="line"><span>        &lt;h2&gt;setInterval（重复执行）&lt;/h2&gt;</span></span>
<span class="line"><span>        &lt;button onclick=&quot;startInterval()&quot;&gt;开始计数&lt;/button&gt;</span></span>
<span class="line"><span>        &lt;button onclick=&quot;stopInterval()&quot; disabled&gt;停止&lt;/button&gt;</span></span>
<span class="line"><span>        &lt;div class=&quot;result&quot; id=&quot;intervalResult&quot;&gt;计数: 0&lt;/div&gt;</span></span>
<span class="line"><span>    &lt;/div&gt;</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    &lt;script&gt;</span></span>
<span class="line"><span>        let timeoutId, intervalId, count = 0;</span></span>
<span class="line"><span>        </span></span>
<span class="line"><span>        // setTimeout 示例</span></span>
<span class="line"><span>        function startTimeout() {</span></span>
<span class="line"><span>            document.querySelector(&#39;button[onclick=&quot;startTimeout()&quot;]&#39;).disabled = true;</span></span>
<span class="line"><span>            document.querySelector(&#39;button[onclick=&quot;stopTimeout()&quot;]&#39;).disabled = false;</span></span>
<span class="line"><span>            document.getElementById(&#39;timeoutResult&#39;).textContent = &#39;等待中...&#39;;</span></span>
<span class="line"><span>            </span></span>
<span class="line"><span>            timeoutId = setTimeout(() =&gt; {</span></span>
<span class="line"><span>                document.getElementById(&#39;timeoutResult&#39;).textContent = &#39;延时执行完成（仅执行一次）&#39;;</span></span>
<span class="line"><span>                document.querySelector(&#39;button[onclick=&quot;startTimeout()&quot;]&#39;).disabled = false;</span></span>
<span class="line"><span>                document.querySelector(&#39;button[onclick=&quot;stopTimeout()&quot;]&#39;).disabled = true;</span></span>
<span class="line"><span>            }, 2000);</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        </span></span>
<span class="line"><span>        function stopTimeout() {</span></span>
<span class="line"><span>            clearTimeout(timeoutId);</span></span>
<span class="line"><span>            document.getElementById(&#39;timeoutResult&#39;).textContent = &#39;延时已取消&#39;;</span></span>
<span class="line"><span>            document.querySelector(&#39;button[onclick=&quot;startTimeout()&quot;]&#39;).disabled = false;</span></span>
<span class="line"><span>            document.querySelector(&#39;button[onclick=&quot;stopTimeout()&quot;]&#39;).disabled = true;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        </span></span>
<span class="line"><span>        // setInterval 示例</span></span>
<span class="line"><span>        function startInterval() {</span></span>
<span class="line"><span>            document.querySelector(&#39;button[onclick=&quot;startInterval()&quot;]&#39;).disabled = true;</span></span>
<span class="line"><span>            document.querySelector(&#39;button[onclick=&quot;stopInterval()&quot;]&#39;).disabled = false;</span></span>
<span class="line"><span>            count = 0;</span></span>
<span class="line"><span>            </span></span>
<span class="line"><span>            intervalId = setInterval(() =&gt; {</span></span>
<span class="line"><span>                count++;</span></span>
<span class="line"><span>                document.getElementById(&#39;intervalResult&#39;).textContent = \`计数: \${count}\`;</span></span>
<span class="line"><span>            }, 1000);</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        </span></span>
<span class="line"><span>        function stopInterval() {</span></span>
<span class="line"><span>            clearInterval(intervalId);</span></span>
<span class="line"><span>            document.querySelector(&#39;button[onclick=&quot;startInterval()&quot;]&#39;).disabled = false;</span></span>
<span class="line"><span>            document.querySelector(&#39;button[onclick=&quot;stopInterval()&quot;]&#39;).disabled = true;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    &lt;/script&gt;</span></span>
<span class="line"><span>&lt;/body&gt;</span></span>
<span class="line"><span>&lt;/html&gt;</span></span></code></pre></div>`,6)])])}const g=s(e,[["render",l]]);export{m as __pageData,g as default};
