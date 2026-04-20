import{_ as a,o as s,c as t,ag as p}from"./chunks/framework.Cqf6AMW8.js";const h=JSON.parse('{"title":"STM32","description":"","frontmatter":{},"headers":[],"relativePath":"docs/hardware/stm32/stm32-7-OC PWM.md","filePath":"docs/hardware/stm32/stm32-7-OC PWM.md","lastUpdated":1776715536000}'),l={name:"docs/hardware/stm32/stm32-7-OC PWM.md"};function e(i,n,r,o,c,C){return s(),t("div",null,[...n[0]||(n[0]=[p(`<h1 id="stm32" tabindex="-1">STM32 <a class="header-anchor" href="#stm32" aria-label="Permalink to &quot;STM32&quot;">​</a></h1><p>======================================================</p><h2 id="oc" tabindex="-1">OC <a class="header-anchor" href="#oc" aria-label="Permalink to &quot;OC&quot;">​</a></h2><p>======================================================</p><h3 id="oc-输出比较" tabindex="-1">OC（输出比较） <a class="header-anchor" href="#oc-输出比较" aria-label="Permalink to &quot;OC（输出比较）&quot;">​</a></h3><ul><li>工作原理：比较CNT与CCR寄存器的值，高精度控制GPIO</li><li>每个高级定时器/通用定时器有4个OC通道</li><li>有四个OC比较单元</li></ul><h3 id="oc模式" tabindex="-1">OC模式 <a class="header-anchor" href="#oc模式" aria-label="Permalink to &quot;OC模式&quot;">​</a></h3><table tabindex="0"><thead><tr><th>模式</th><th>描述</th></tr></thead><tbody><tr><td>冻结</td><td>CNT=CCR时，REF保持为原状态</td></tr><tr><td>匹配时置有效电平</td><td>CNT=CCR时，REF置有效电平</td></tr><tr><td>匹配时置无效电平</td><td>CNT=CCR时，REF置无效电平</td></tr><tr><td>匹配时电平翻转</td><td>CNT=CCR时，REF电平翻转</td></tr><tr><td>强制为无效电平</td><td>CNT与CCR无效，REF强制为无效电平</td></tr><tr><td>强制为有效电平</td><td>CNT与CCR无效，REF强制为有效电平</td></tr><tr><td>PWM模式1</td><td>向上计数: CNT&lt;CCR时，REF置有效电平，CNT≥CCR时，REF置无效电平<br>向下计数: CNT&gt;CCR时，REF置无效电平，CNT≤CCR时，REF置有效电平</td></tr><tr><td>PWM模式2</td><td>向上计数: CNT&lt;CCR时，REF置无效电平，CNT≥CCR时，REF置有效电平<br>向下计数: CNT&gt;CCR时，REF置有效电平，CNT≤CCR时，REF置无效电平</td></tr></tbody></table><ol><li>CCR（比对值） <ul><li>每个TIM有多个CCR寄存器，寄存器最大存储值为65535</li><li>CCR寄存器与CH通道一一对应</li><li>CNT与CCR比较，根据模式做出对应行为，有效电平为1，无效电平为0</li><li>触发时机计算：CCR/CK_CNT</li><li>占空比的计算：CCR/AAR</li></ul></li><li>CNT（计数器） <ul><li>计数器与CCR比较，达到预定数值实现中断 ======================================================</li></ul></li></ol><h3 id="pwm" tabindex="-1">PWM <a class="header-anchor" href="#pwm" aria-label="Permalink to &quot;PWM&quot;">​</a></h3><ul><li>频率：1/T <ul><li>CK_PSC/(PSC+1)/(ARR+1)</li></ul></li><li>占空比：Ton/T <ul><li>CCR/(ARR+1)</li><li>占空比越大的部分，模拟信号越靠近那一部分</li></ul></li></ul><svg width="600" height="200" viewBox="0 0 600 200"><p></p><p>&lt;path d=&quot;M50,120 L100,120 L100,80 L200,80 L200,120 L350,120 L350,80 L450,80 L450,120 L550,120&quot;</p><p>stroke=&quot;black&quot; stroke-width=&quot;2&quot; fill=&quot;none&quot;/&gt;</p><p></p><p><rect x="150" y="130" width="100" height="60" stroke="black" stroke-width="1" fill="none"></rect></p><p><rect x="250" y="130" width="150" height="60" stroke="black" stroke-width="1" fill="none"></rect></p><p><rect x="150" y="130" width="250" height="60" stroke="black" stroke-width="1" fill="none"></rect></p><p></p><p><text x="200" y="160" text-anchor="middle" font-family="Arial" font-size="14">T<tspan baseline-shift="sub" font-size="12">ON</tspan></text></p><p><path d="M175,170 L225,170" stroke="black" stroke-width="1" fill="none"></path></p><p><path d="M175,170 L180,165" stroke="black" stroke-width="1" fill="none"></path></p><p><path d="M175,170 L180,175" stroke="black" stroke-width="1" fill="none"></path></p><p><path d="M225,170 L220,165" stroke="black" stroke-width="1" fill="none"></path></p><p><path d="M225,170 L220,175" stroke="black" stroke-width="1" fill="none"></path></p><p></p><p><text x="325" y="160" text-anchor="middle" font-family="Arial" font-size="14">T<tspan baseline-shift="sub" font-size="12">OFF</tspan></text></p><p><path d="M275,170 L375,170" stroke="black" stroke-width="1" fill="none"></path></p><p><path d="M275,170 L280,165" stroke="black" stroke-width="1" fill="none"></path></p><p><path d="M275,170 L280,175" stroke="black" stroke-width="1" fill="none"></path></p><p><path d="M375,170 L370,165" stroke="black" stroke-width="1" fill="none"></path></p><p><path d="M375,170 L370,175" stroke="black" stroke-width="1" fill="none"></path></p><p></p><p><text x="275" y="190" text-anchor="middle" font-family="Arial" font-size="14">T<tspan baseline-shift="sub" font-size="12">S</tspan></text></p><p><path d="M175,180 L375,180" stroke="black" stroke-width="1" fill="none"></path></p><p><path d="M175,180 L180,175" stroke="black" stroke-width="1" fill="none"></path></p><p><path d="M175,180 L180,185" stroke="black" stroke-width="1" fill="none"></path></p><p><path d="M375,180 L370,175" stroke="black" stroke-width="1" fill="none"></path></p><p><path d="M375,180 L370,185" stroke="black" stroke-width="1" fill="none"></path></p><p></p><p><path d="M570,30 L590,30 L585,25 M590,30 L585,35" stroke="black" stroke-width="1" fill="none"></path></p></svg><ul><li>分辨率：占空比变化步长 <ul><li>1/(ARR+1)</li></ul></li><li>PWM配置步骤： <ol><li>启动内部时钟：</li><li>配置时基单元：</li><li>配置输出比较：</li><li>配置GPIO ：</li></ol></li><li>PWM配置代码：</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>	//开启RCC时钟</span></span>
<span class="line"><span>    RCC_APB1PeriphClockCmd(RCC_APB1Periph_TIM2, ENABLE);</span></span>
<span class="line"><span>	</span></span>
<span class="line"><span>	\`\`\` GPIO-model</span></span>
<span class="line"><span>    RCC_APB2PeriphClockCmd(RCC_APB2Periph_GPIOA, ENABLE);</span></span>
<span class="line"><span>    //RCC_APB2PeriphClockCmd(RCC_APB2Periph_AFIO, ENABLE);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    GPIO_InitTypeDef GPIO_InitStructure;</span></span>
<span class="line"><span>    GPIO_InitStructure.GPIO_Mode = GPIO_Mode_AF_PP;  // 复用推挽输出</span></span>
<span class="line"><span>    GPIO_InitStructure.GPIO_Pin = GPIO_Pin_0;        // TIM2_CH1</span></span>
<span class="line"><span>    GPIO_InitStructure.GPIO_Speed = GPIO_Speed_50MHz;</span></span>
<span class="line"><span>    GPIO_Init(GPIOA, &amp;GPIO_InitStructure);</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    /* 配置TIM2_CH1重映射（使用部分重映射1） */</span></span>
<span class="line"><span>    // 重映射模式说明：</span></span>
<span class="line"><span>    // - 无重映射：TIM2_CH1 -&gt; PA0</span></span>
<span class="line"><span>    // - 部分重映射1：TIM2_CH1 -&gt; PA15</span></span>
<span class="line"><span>    // - 部分重映射2：TIM2_CH1 -&gt; PB3</span></span>
<span class="line"><span>    // - 完全重映射：TIM2_CH1 -&gt; PA15</span></span>
<span class="line"><span>    //GPIO_PinRemapConfig(GPIO_PartialRemap1_TIM2, ENABLE);		</span></span>
<span class="line"><span>	\`\`\`    </span></span>
<span class="line"><span>    //开启内部时钟（可以不写，因为默认开启内部时钟）</span></span>
<span class="line"><span>    TIM_InternalClockConfig(TIM2);</span></span>
<span class="line"><span>	</span></span>
<span class="line"><span>	//配置TIM</span></span>
<span class="line"><span>    TIM_TimeBaseInitTypeDef TIM_TimeBaseInitStructure;</span></span>
<span class="line"><span>    TIM_TimeBaseInitStructure.TIM_ClockDivision = TIM_CKD_DIV1;    //分频模式</span></span>
<span class="line"><span>    TIM_TimeBaseInitStructure.TIM_CounterMode = TIM_CounterMode_Up;//向上计数</span></span>
<span class="line"><span>    TIM_TimeBaseInitStructure.TIM_Period = 10000 - 1;              //目标值</span></span>
<span class="line"><span>    TIM_TimeBaseInitStructure.TIM_Prescaler = 7200 - 1;            //PSC</span></span>
<span class="line"><span>    TIM_TimeBaseInitStructure.TIM_RepetitionCounter = 0;           //高级计数</span></span>
<span class="line"><span>	</span></span>
<span class="line"><span>	//初始化TIM</span></span>
<span class="line"><span>    TIM_TimeBaseInit(TIM2, &amp;TIM_TimeBaseInitStructure);</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    //定TIM模式</span></span>
<span class="line"><span>    TIM_ITConfig(TIM2, TIM_IT_Update, ENABLE);</span></span>
<span class="line"><span>	</span></span>
<span class="line"><span>	\`\`\` OC-model</span></span>
<span class="line"><span>	//配置OC</span></span>
<span class="line"><span>    TIM_OCInitTypeDef TIM_OCInitStructure;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    TIM_OCStructInit(&amp;TIM_OCInitStructure);</span></span>
<span class="line"><span>	</span></span>
<span class="line"><span>	//配置OC模式</span></span>
<span class="line"><span>    TIM_OCInitStructure.TIM_OCMode = TIM_OCMode_PWM1;</span></span>
<span class="line"><span>	//配置高电位</span></span>
<span class="line"><span>    TIM_OCInitStructure.TIM_OCPolarity = TIM_OCPolarity_High;</span></span>
<span class="line"><span>	//使能OC</span></span>
<span class="line"><span>    TIM_OCInitStructure.TIM_OutputState = TIM_OutputState_Enable;</span></span>
<span class="line"><span>	//配置CCR</span></span>
<span class="line"><span>    TIM_OCInitStructure.TIM_Pulse = 500;  // CCR (占空比50%)</span></span>
<span class="line"><span>	//初始化OC</span></span>
<span class="line"><span>    TIM_OC1Init(TIM2, &amp;TIM_OCInitStructure);	</span></span>
<span class="line"><span>	\`\`\`</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	//使能TIM</span></span>
<span class="line"><span>    TIM_Cmd(TIM2, ENABLE);</span></span></code></pre></div><p>======================================================</p>`,15)])])}const I=a(l,[["render",e]]);export{h as __pageData,I as default};
