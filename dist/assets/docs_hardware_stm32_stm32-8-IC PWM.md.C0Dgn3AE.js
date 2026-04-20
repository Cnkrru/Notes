import{_ as s,o as a,c as p,ag as l}from"./chunks/framework.Cqf6AMW8.js";const T=JSON.parse('{"title":"STM32 IC PWM","description":"STM32 输入捕获（IC）和 PWM 测量的配置和使用。","frontmatter":{"title":"STM32 IC PWM","description":"STM32 输入捕获（IC）和 PWM 测量的配置和使用。","date":"2026-04-21T00:00:00.000Z","tags":["STM32","IC","PWM","输入捕获"],"sidebar":"auto"},"headers":[],"relativePath":"docs/hardware/stm32/stm32-8-IC PWM.md","filePath":"docs/hardware/stm32/stm32-8-IC PWM.md","lastUpdated":1776715536000}'),i={name:"docs/hardware/stm32/stm32-8-IC PWM.md"};function e(t,n,I,c,r,o){return a(),p("div",null,[...n[0]||(n[0]=[l(`<h1 id="stm32" tabindex="-1">STM32 <a class="header-anchor" href="#stm32" aria-label="Permalink to &quot;STM32&quot;">​</a></h1><p>======================================================</p><h2 id="ic" tabindex="-1">IC <a class="header-anchor" href="#ic" aria-label="Permalink to &quot;IC&quot;">​</a></h2><p>======================================================</p><h3 id="ic-1" tabindex="-1">IC <a class="header-anchor" href="#ic-1" aria-label="Permalink to &quot;IC&quot;">​</a></h3><ul><li>工作原理：边沿检测，捕获CCR的值，寄存到CNT中</li><li>测量参数： <ol><li>频率</li><li>占空比</li><li>脉冲间隔</li><li>电平持续时间</li></ol></li><li>工作模式： <ol><li>PWMI： 同时测量频率和占空比</li><li>主从触发：实现硬件全自动测量</li></ol></li><li>注意事项：OC与IC共用4个CH通道，所以不能将一个通道同时处理OC与IC</li><li>测量频率的方法： <ol><li>测频法 <ul><li><strong>原理</strong>：在闸门时间T内，对输入信号的上升沿计次，得到计数值N</li><li><strong>计算公式</strong>： <code>f_x = N / T</code></li><li><strong>适用场景</strong>：适用于高频信号测量</li></ul></li><li>测周法 <ul><li><strong>原理</strong>：在输入信号的两个上升沿内，以标准频率 f_c 计次，得到计数值N</li><li><strong>计算公式</strong>： <code>f_x = f_c / N</code></li><li><strong>适用场景</strong>：适用于低频信号测量</li></ul></li><li>中界频率 <ul><li><strong>定义</strong>：测频法与测周法误差相等的频率点</li><li><strong>计算公式</strong>： <code>f_m = \\sqrt{f_c / T}</code></li><li><strong>意义</strong>：当信号频率高于中界频率时，使用测频法误差更小；当信号频率低于中界频率时，使用测周法误差更小</li></ul></li></ol></li><li>IC配置步骤 <ol><li>启动时钟</li><li>配置GPIO</li><li>配置时基单元</li><li>配置输入捕获单元</li><li>选择从模式触发源</li><li>选择触发后的操作</li></ol></li><li>IC配置代码:</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>	//开启RCC时钟</span></span>
<span class="line"><span>    RCC_APB1PeriphClockCmd(RCC_APB1Periph_TIM3, ENABLE);</span></span>
<span class="line"><span>	</span></span>
<span class="line"><span>	//GPIO-model</span></span>
<span class="line"><span>    RCC_APB2PeriphClockCmd(RCC_APB2Periph_GPIOA, ENABLE);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    GPIO_InitTypeDef GPIO_InitStructure;</span></span>
<span class="line"><span>    GPIO_InitStructure.GPIO_Mode = GPIO_Mode_AF_IPU;  // 复用推挽输出</span></span>
<span class="line"><span>    GPIO_InitStructure.GPIO_Pin = GPIO_Pin_6;        // TIM2_CH1</span></span>
<span class="line"><span>    GPIO_InitStructure.GPIO_Speed = GPIO_Speed_50MHz;</span></span>
<span class="line"><span>    GPIO_Init(GPIOA, &amp;GPIO_InitStructure);		</span></span>
<span class="line"><span>	   </span></span>
<span class="line"><span>    //开启内部时钟（可以不写，因为默认开启内部时钟）</span></span>
<span class="line"><span>    TIM_InternalClockConfig(TIM3);</span></span>
<span class="line"><span>	</span></span>
<span class="line"><span>	//配置TIM</span></span>
<span class="line"><span>    TIM_TimeBaseInitTypeDef TIM_TimeBaseInitStructure;</span></span>
<span class="line"><span>    TIM_TimeBaseInitStructure.TIM_ClockDivision = TIM_CKD_DIV1;    //分频模式</span></span>
<span class="line"><span>    TIM_TimeBaseInitStructure.TIM_CounterMode = TIM_CounterMode_Up;//向上计数</span></span>
<span class="line"><span>    TIM_TimeBaseInitStructure.TIM_Period = 65536 - 1;              //目标值</span></span>
<span class="line"><span>    TIM_TimeBaseInitStructure.TIM_Prescaler = 72 - 1;              //PSC</span></span>
<span class="line"><span>    TIM_TimeBaseInitStructure.TIM_RepetitionCounter = 0;           //高级计数</span></span>
<span class="line"><span>	</span></span>
<span class="line"><span>	//初始化TIM</span></span>
<span class="line"><span>    TIM_TimeBaseInit(TIM3, &amp;TIM_TimeBaseInitStructure);</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    //定TIM模式</span></span>
<span class="line"><span>    TIM_ITConfig(TIM3, TIM_IT_Update, ENABLE);</span></span>
<span class="line"><span>	</span></span>
<span class="line"><span>	\`\`\` IC-model</span></span>
<span class="line"><span>    // 配置IC模块</span></span>
<span class="line"><span>    TIM_ICInitTypeDef TIM_ICInitStructure;</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    TIM_ICInitStructure.TIM_Channel = TIM_Channel_1;             //配置通道</span></span>
<span class="line"><span>    TIM_ICInitStructure.TIM_ICFilter = 0xF;                      //滤波器参数N</span></span>
<span class="line"><span>    TIM_ICInitStructure.TIM_ICPolarity = TIM_ICPolarity_Rising;  //选择边沿触发</span></span>
<span class="line"><span>    TIM_ICInitStructure.TIM_ICPrescaler = TIM_ICPSC_DIV1;        //IC分频通道</span></span>
<span class="line"><span>    TIM_ICInitStructure.TIM_ICSelection = TIM_ICSelection_DirectTI;//输入捕获</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    // 初始化IC</span></span>
<span class="line"><span>    TIM_ICInit(TIM3, &amp;TIM_ICInitStructure);</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    // 选择TIM3的输入触发源为TI1FP1</span></span>
<span class="line"><span>    TIM_SelectInputTrigger(TIM3, TIM_TS_T1FP1);</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    // 选择TIM3的从模式为复位模式</span></span>
<span class="line"><span>    TIM_SelectSlaveMode(TIM3, TIM_SlaveMode_Reset);</span></span>
<span class="line"><span>	\`\`\`</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	//使能TIM</span></span>
<span class="line"><span>    TIM_Cmd(TIM3, ENABLE);</span></span></code></pre></div><ul><li>IC-PWMI模式配置代码 <ul><li>在原有通道配置下方填上这一句就行</li><li>因为1/2，3/4通道分别互补，这个是ST公司封装好的函数</li></ul></li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>    // 初始化TIM3为PWMI模式</span></span>
<span class="line"><span>    // PWMI模式会自动配置通道2为相反极性（下降沿）</span></span>
<span class="line"><span>    TIM_PWMIConfig(TIM3, &amp;TIM_ICInitStructure);</span></span></code></pre></div>`,9)])])}const M=s(i,[["render",e]]);export{T as __pageData,M as default};
