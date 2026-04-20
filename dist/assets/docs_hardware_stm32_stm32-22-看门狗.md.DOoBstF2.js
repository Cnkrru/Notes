import{_ as s,o as n,c as t,ag as p}from"./chunks/framework.Cqf6AMW8.js";const W=JSON.parse('{"title":"STM32 看门狗","description":"STM32 看门狗（IWDG和WWDG）的配置和使用。","frontmatter":{"title":"STM32 看门狗","description":"STM32 看门狗（IWDG和WWDG）的配置和使用。","date":"2026-04-21T00:00:00.000Z","tags":["STM32","看门狗","IWDG","WWDG"],"sidebar":"auto"},"headers":[],"relativePath":"docs/hardware/stm32/stm32-22-看门狗.md","filePath":"docs/hardware/stm32/stm32-22-看门狗.md","lastUpdated":1776715536000}'),d={name:"docs/hardware/stm32/stm32-22-看门狗.md"};function e(l,a,i,r,c,h){return n(),t("div",null,[...a[0]||(a[0]=[p(`<h2 id="看门狗概述" tabindex="-1">看门狗概述 <a class="header-anchor" href="#看门狗概述" aria-label="Permalink to &quot;看门狗概述&quot;">​</a></h2><table tabindex="0"><thead><tr><th>项目</th><th>内容</th></tr></thead><tbody><tr><td>作用</td><td>监控程序运行状态，当程序卡死或跑飞时及时复位，保证系统可靠性和安全性</td></tr><tr><td>本质</td><td>定时器，定时范围内没喂狗就产生复位信号</td></tr><tr><td>STM32内置类型</td><td>独立看门狗(IWDG)和窗口看门狗(WWDG)</td></tr></tbody></table><ul><li>特性对比图</li></ul><table tabindex="0"><thead><tr><th>特性</th><th>IWDG独立看门狗</th><th>WWDG窗口看门狗</th></tr></thead><tbody><tr><td>复位</td><td>计数器减到0后</td><td>计数器T[5:0]减到0后、过早重装计数器</td></tr><tr><td>中断</td><td>无</td><td>早期唤醒中断</td></tr><tr><td>时钟源</td><td>LSI (40KHz)</td><td>PCLK1 (36MHz)</td></tr><tr><td>预分频系数</td><td>4、8、32、64、128、256</td><td>1、2、4、8</td></tr><tr><td>计数器</td><td>12位</td><td>6位（有效计数）</td></tr><tr><td>超时时间</td><td>0.1ms~26214.4ms</td><td>113us~58.25ms</td></tr><tr><td>喂狗方式</td><td>写入键寄存器，重装固定值RLR</td><td>直接写入计数器，写多少重装多少</td></tr><tr><td>防误操作</td><td>键寄存器和写保护</td><td>无</td></tr><tr><td>用途</td><td>独立工作，对时间精度要求较低</td><td>要求看门狗在精确计时窗口起作用</td></tr></tbody></table><h2 id="独立看门狗-iwdg" tabindex="-1">独立看门狗(IWDG) <a class="header-anchor" href="#独立看门狗-iwdg" aria-label="Permalink to &quot;独立看门狗(IWDG)&quot;">​</a></h2><h3 id="键寄存器" tabindex="-1">键寄存器 <a class="header-anchor" href="#键寄存器" aria-label="Permalink to &quot;键寄存器&quot;">​</a></h3><ul><li><strong>功能</strong>：本质上是控制寄存器，用于控制硬件电路的工作，降低硬件电路受到干扰的概率</li></ul><table tabindex="0"><thead><tr><th>写入键寄存器的值</th><th>作用</th></tr></thead><tbody><tr><td>0xCCCC</td><td>启用独立看门狗</td></tr><tr><td>0xAAAA</td><td>IWDG_RLR中的值重新加载到计数器（喂狗）</td></tr><tr><td>0x5555</td><td>解除IWDG_PR和IWDG_RLR的写保护</td></tr><tr><td>0x5555之外的其他值</td><td>启用IWDG_PR和IWDG_RLR的写保护</td></tr></tbody></table><h3 id="超时时间" tabindex="-1">超时时间 <a class="header-anchor" href="#超时时间" aria-label="Permalink to &quot;超时时间&quot;">​</a></h3><ul><li><strong>公式</strong>：<div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>T_IWDG = T_LSI × PR预分频系数 × (RL + 1)</span></span>
<span class="line"><span>其中：T_LSI = 1 / F_LSI</span></span></code></pre></div></li></ul><table tabindex="0"><thead><tr><th>预分频系数</th><th>PR[2:0]位</th><th>最短时间(ms)</th><th>最长时间(ms)</th></tr></thead><tbody><tr><td>/4</td><td>0</td><td>0.1</td><td>409.6</td></tr><tr><td>/8</td><td>1</td><td>0.2</td><td>819.2</td></tr><tr><td>/16</td><td>2</td><td>0.4</td><td>1638.4</td></tr><tr><td>/32</td><td>3</td><td>0.8</td><td>3276.8</td></tr><tr><td>/64</td><td>4</td><td>1.6</td><td>6553.6</td></tr><tr><td>/128</td><td>5</td><td>3.2</td><td>13107.2</td></tr><tr><td>/256</td><td>(6或7)</td><td>6.4</td><td>26214.4</td></tr></tbody></table><h2 id="窗口看门狗-wwdg" tabindex="-1">窗口看门狗(WWDG) <a class="header-anchor" href="#窗口看门狗-wwdg" aria-label="Permalink to &quot;窗口看门狗(WWDG)&quot;">​</a></h2><h3 id="工作原理" tabindex="-1">工作原理 <a class="header-anchor" href="#工作原理" aria-label="Permalink to &quot;工作原理&quot;">​</a></h3><ul><li>递减计数器T[6:0]的值小于0x40时，WWDG产生复位</li><li>递减计数器T[6:0]在窗口W[6:0]外被重新装载时，WWDG产生复位</li><li>递减计数器T[6:0]等于0x40时可以产生早期唤醒中断(EWI)，用于重新装载计数器以避免WWDG复位</li><li>定期写入WWDG_CR寄存器（喂狗）以避免WWDG复位</li></ul><h3 id="超时时间-1" tabindex="-1">超时时间 <a class="header-anchor" href="#超时时间-1" aria-label="Permalink to &quot;超时时间&quot;">​</a></h3><ul><li><strong>计算公式</strong>：</li></ul><table tabindex="0"><thead><tr><th>类型</th><th>公式</th></tr></thead><tbody><tr><td>超时时间</td><td>T_WWDG = T_PCLK1 × 4096 × WDTB预分频系数 × (T[5:0] + 1)</td></tr><tr><td>窗口时间</td><td>T_WIN = T_PCLK1 × 4096 × WDTB预分频系数 × (T[5:0] - W[5:0])</td></tr><tr><td>时间单位</td><td>T_PCLK1 = 1 / F_PCLK1</td></tr></tbody></table><table tabindex="0"><thead><tr><th>WDTB</th><th>最小时间值</th><th>最大时间值</th></tr></thead><tbody><tr><td>0</td><td>113μs</td><td>7.28ms</td></tr><tr><td>1</td><td>227μs</td><td>14.56ms</td></tr><tr><td>2</td><td>455μs</td><td>29.12ms</td></tr><tr><td>3</td><td>910μs</td><td>58.25ms</td></tr></tbody></table><h3 id="工作流程" tabindex="-1">工作流程 <a class="header-anchor" href="#工作流程" aria-label="Permalink to &quot;工作流程&quot;">​</a></h3><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>WWDG工作流程</span></span>
<span class="line"><span>    ├── 初始化WWDG</span></span>
<span class="line"><span>    │   ├── 设置预分频系数</span></span>
<span class="line"><span>    │   ├── 设置窗口值</span></span>
<span class="line"><span>    │   └── 设置计数器初始值</span></span>
<span class="line"><span>    ├── 启动WWDG</span></span>
<span class="line"><span>    ├── 主程序运行</span></span>
<span class="line"><span>    │   ├── 定期喂狗（在窗口时间内）</span></span>
<span class="line"><span>    │   └── 处理业务逻辑</span></span>
<span class="line"><span>    ├── 计数器递减</span></span>
<span class="line"><span>    │   ├── 计数器 &gt; 窗口值：禁止喂狗</span></span>
<span class="line"><span>    │   ├── 窗口值 ≥ 计数器 ≥ 0x40：允许喂狗</span></span>
<span class="line"><span>    │   ├── 计数器 = 0x40：产生早期唤醒中断</span></span>
<span class="line"><span>    │   └── 计数器 &lt; 0x40：产生复位</span></span>
<span class="line"><span>    └── 复位或继续运行</span></span></code></pre></div><h3 id="代码配置" tabindex="-1">代码配置 <a class="header-anchor" href="#代码配置" aria-label="Permalink to &quot;代码配置&quot;">​</a></h3><ul><li>IWDG</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>void IWDG_Init(uint8_t prer, uint16_t rlr)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>	//使能IWDG访问寄存器</span></span>
<span class="line"><span>    IWDG_WriteAccessCmd(IWDG_WriteAccess_Enable);</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    //设置预分帧系数</span></span>
<span class="line"><span>    IWDG_SetPrescaler(prer);</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    //设置重装值</span></span>
<span class="line"><span>    IWDG_SetReload(rlr);</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    //喂狗重载</span></span>
<span class="line"><span>    IWDG_ReloadCounter();</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    //使能IWDG</span></span>
<span class="line"><span>    IWDG_Enable();</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>//喂狗函数</span></span>
<span class="line"><span>void IWDG_Feed(void)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    IWDG_ReloadCounter();</span></span>
<span class="line"><span>}</span></span></code></pre></div><ul><li>WWDG</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>void WWDG_Init(uint8_t tr, uint8_t wr, uint8_t fprer)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>	//使能WWDG</span></span>
<span class="line"><span>    RCC_APB1PeriphClockCmd(RCC_APB1Periph_WWDG, ENABLE);</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    //设置预分帧系数</span></span>
<span class="line"><span>    WWDG_SetPrescaler(fprer);</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    //设置窗口值</span></span>
<span class="line"><span>    WWDG_SetWindowValue(wr);</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    //设置计数器初始值并启动WWDG</span></span>
<span class="line"><span>    WWDG_Enable(tr);</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    //清除早期唤醒WWDG的标志位</span></span>
<span class="line"><span>    WWDG_ClearFlag();</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    //配置WWDG外部中断</span></span>
<span class="line"><span>    NVIC_InitTypeDef NVIC_InitStructure;</span></span>
<span class="line"><span>    NVIC_InitStructure.NVIC_IRQChannel = WWDG_IRQn;</span></span>
<span class="line"><span>    NVIC_InitStructure.NVIC_IRQChannelPreemptionPriority = 0;</span></span>
<span class="line"><span>    NVIC_InitStructure.NVIC_IRQChannelSubPriority = 0;</span></span>
<span class="line"><span>    NVIC_InitStructure.NVIC_IRQChannelCmd = ENABLE;</span></span>
<span class="line"><span>    NVIC_Init(&amp;NVIC_InitStructure);</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    //启动早期唤醒中断</span></span>
<span class="line"><span>    WWDG_EnableIT();</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>//喂狗程序</span></span>
<span class="line"><span>void WWDG_Feed(uint8_t tr)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    WWDG_SetCounter(tr);</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>//提前喂狗</span></span>
<span class="line"><span>void WWDG_IRQHandler(void)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    WWDG_ClearFlag();</span></span>
<span class="line"><span>    WWDG_Feed(0x7F);</span></span>
<span class="line"><span>}</span></span></code></pre></div>`,25)])])}const _=s(d,[["render",e]]);export{W as __pageData,_ as default};
