import{_ as s,o as n,c as p,ag as t}from"./chunks/framework.Cqf6AMW8.js";const P=JSON.parse('{"title":"STM32 PWR电源管理","description":"STM32 PWR（电源管理）的配置和使用。","frontmatter":{"title":"STM32 PWR电源管理","description":"STM32 PWR（电源管理）的配置和使用。","date":"2026-04-21T00:00:00.000Z","tags":["STM32","PWR","电源管理","低功耗模式"],"sidebar":"auto"},"headers":[],"relativePath":"docs/hardware/stm32/stm32-20-PWR.md","filePath":"docs/hardware/stm32/stm32-20-PWR.md","lastUpdated":1776715536000}'),e={name:"docs/hardware/stm32/stm32-20-PWR.md"};function l(d,a,i,c,r,o){return n(),p("div",null,[...a[0]||(a[0]=[t(`<h3 id="pwr简介" tabindex="-1">PWR简介 <a class="header-anchor" href="#pwr简介" aria-label="Permalink to &quot;PWR简介&quot;">​</a></h3><table tabindex="0"><thead><tr><th>项目</th><th>内容</th></tr></thead><tbody><tr><td>主要功能</td><td>管理STM32内部的电源供电部分，实现可编程电压监测器和低功耗模式</td></tr><tr><td>可编程电压监测器(PVD)</td><td>监控VDD电源电压，当VDD下降到PVD阈值以下或上升到PVD阈值之上时，触发中断执行紧急关闭任务</td></tr><tr><td>低功耗模式</td><td>包括睡眠模式(Sleep)、停机模式(Stop)和待机模式(Standby)，可在系统空闲时降低STM32的功耗，延长设备使用时间</td></tr></tbody></table><h3 id="低功耗模式" tabindex="-1">低功耗模式 <a class="header-anchor" href="#低功耗模式" aria-label="Permalink to &quot;低功耗模式&quot;">​</a></h3><table tabindex="0"><thead><tr><th>模式</th><th>进入</th><th>唤醒</th><th>对1.8V区域时钟的影响</th><th>对VDD区域时钟的影响</th><th>电压调节器</th></tr></thead><tbody><tr><td>睡眠模式(SLEEP-NOW或SLEEP-ON-EXIT)</td><td>WFI</td><td>任一中断</td><td>CPU时钟关闭，对其他时钟和ADC时钟无影响</td><td>无</td><td>开</td></tr><tr><td>停机</td><td>PDDS=0位 + SLEEPDEEP位 + WFI或WFE</td><td>外部中断(在外部中断事件寄存器中设置)</td><td>关闭所有1.8V域的时钟</td><td>HSI和HSSE的振荡器关闭</td><td>开启或处于低功耗模式(依据电源控制寄存器(PWR_CR)的设定)</td></tr><tr><td>待机</td><td>PDDS=1位 + SLEEPDEEP位 + WFI或WFE</td><td>WKUP引脚的上升沿、RTC闹钟事件、NRST引脚上的外部复位、IWDG复位</td><td>关闭所有1.8V域的时钟</td><td>HSI和HSSE的振荡器关闭</td><td>关</td></tr></tbody></table><h3 id="pwr使用方法" tabindex="-1">PWR使用方法 <a class="header-anchor" href="#pwr使用方法" aria-label="Permalink to &quot;PWR使用方法&quot;">​</a></h3><table tabindex="0"><thead><tr><th>操作</th><th>函数</th><th>说明</th></tr></thead><tbody><tr><td>开启PWR时钟</td><td><code>RCC_APB1PeriphClockCmd(RCC_APB1Periph_PWR, ENABLE)</code></td><td>使能PWR模块时钟</td></tr><tr><td>允许备份访问</td><td><code>PWR_BackupAccessCmd(ENABLE)</code></td><td>允许访问BKP寄存器</td></tr><tr><td>进入低功耗模式</td><td><code>PWR_EnterSTANDBYMode()</code></td><td>进入待机模式，可由RTC闹钟唤醒</td></tr><tr><td>清除唤醒标志</td><td><code>PWR_ClearFlag(PWR_FLAG_WU)</code></td><td>清除唤醒标志位</td></tr></tbody></table><h3 id="模式选择" tabindex="-1">模式选择 <a class="header-anchor" href="#模式选择" aria-label="Permalink to &quot;模式选择&quot;">​</a></h3><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>执行WFI/WFE</span></span>
<span class="line"><span>    ├── SLEEPDEEP=0</span></span>
<span class="line"><span>    │   └── 睡眠模式</span></span>
<span class="line"><span>    │       ├── SLEEPONEXIT=0</span></span>
<span class="line"><span>    │       │   └── 睡眠模式(立刻睡眠)</span></span>
<span class="line"><span>    │       └── SLEEPONEXIT=1</span></span>
<span class="line"><span>    │           └── 睡眠模式(等待中断退出)</span></span>
<span class="line"><span>    └── SLEEPDEEP=1</span></span>
<span class="line"><span>        └── 深度睡眠模式(停机/待机)</span></span>
<span class="line"><span>            ├── PDDS=0</span></span>
<span class="line"><span>            │   └── 停机模式</span></span>
<span class="line"><span>            │       ├── LPDS=0</span></span>
<span class="line"><span>            │       │   └── 停机模式(电压调节器开启)</span></span>
<span class="line"><span>            │       └── LPDS=1</span></span>
<span class="line"><span>            │           └── 停机模式(电压调节器低功耗)</span></span>
<span class="line"><span>            └── PDDS=1</span></span>
<span class="line"><span>                └── 待机模式</span></span></code></pre></div><h3 id="三种模式" tabindex="-1">三种模式 <a class="header-anchor" href="#三种模式" aria-label="Permalink to &quot;三种模式&quot;">​</a></h3><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>低功耗模式</span></span>
<span class="line"><span>    ├── 睡眠模式</span></span>
<span class="line"><span>    │   ├── 进入方式：执行WFI/WFE指令</span></span>
<span class="line"><span>    │   ├── 唤醒后：从暂停处继续运行</span></span>
<span class="line"><span>    │   ├── 特点：</span></span>
<span class="line"><span>    │   │   ├── SLEEPONEXIT位决定进入时机</span></span>
<span class="line"><span>    │   │   ├── I/O引脚保持运行模式状态</span></span>
<span class="line"><span>    │   │   └── 功耗较低</span></span>
<span class="line"><span>    │   └── 唤醒源：</span></span>
<span class="line"><span>    │       ├── WFI：任意NVIC响应的中断</span></span>
<span class="line"><span>    │       └── WFE：唤醒事件</span></span>
<span class="line"><span>    ├── 停止模式</span></span>
<span class="line"><span>    │   ├── 进入方式：执行WFI/WFE指令</span></span>
<span class="line"><span>    │   ├── 唤醒后：从暂停处继续运行</span></span>
<span class="line"><span>    │   ├── 特点：</span></span>
<span class="line"><span>    │   │   ├── 1.8V区域时钟停止</span></span>
<span class="line"><span>    │   │   ├── SRAM和寄存器内容保留</span></span>
<span class="line"><span>    │   │   ├── I/O引脚保持运行模式状态</span></span>
<span class="line"><span>    │   │   └── 功耗比睡眠模式低</span></span>
<span class="line"><span>    │   └── 唤醒源：</span></span>
<span class="line"><span>    │       ├── WFI：任意EXTI中断</span></span>
<span class="line"><span>    │       └── WFE：任意EXTI事件</span></span>
<span class="line"><span>    └── 待机模式</span></span>
<span class="line"><span>        ├── 进入方式：执行WFI/WFE指令</span></span>
<span class="line"><span>        ├── 唤醒后：从头开始运行</span></span>
<span class="line"><span>        ├── 特点：</span></span>
<span class="line"><span>        │   ├── 1.8V区域断电</span></span>
<span class="line"><span>        │   ├── 只有备份寄存器和待机电路供电</span></span>
<span class="line"><span>        │   ├── I/O引脚变为高阻态</span></span>
<span class="line"><span>        │   └── 功耗最低</span></span>
<span class="line"><span>        └── 唤醒源：</span></span>
<span class="line"><span>            ├── WKUP引脚的上升沿</span></span>
<span class="line"><span>            ├── RTC闹钟事件的上升沿</span></span>
<span class="line"><span>            ├── NRST引脚上外部复位</span></span>
<span class="line"><span>            └── IWDG复位</span></span></code></pre></div>`,10)])])}const E=s(e,[["render",l]]);export{P as __pageData,E as default};
