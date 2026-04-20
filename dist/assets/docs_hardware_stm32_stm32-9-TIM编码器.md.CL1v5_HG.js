import{_ as s,o as a,c as p,ag as e}from"./chunks/framework.Cqf6AMW8.js";const M=JSON.parse('{"title":"STM32 TIM 编码器","description":"STM32 定时器编码器接口的配置和使用。","frontmatter":{"title":"STM32 TIM 编码器","description":"STM32 定时器编码器接口的配置和使用。","date":"2026-04-21T00:00:00.000Z","tags":["STM32","TIM","编码器","定时器"],"sidebar":"auto"},"headers":[],"relativePath":"docs/hardware/stm32/stm32-9-TIM编码器.md","filePath":"docs/hardware/stm32/stm32-9-TIM编码器.md","lastUpdated":1776715536000}'),l={name:"docs/hardware/stm32/stm32-9-TIM编码器.md"};function i(t,n,I,c,_,T){return a(),p("div",null,[...n[0]||(n[0]=[e(`<p>======================================================</p><h2 id="编码器" tabindex="-1">编码器 <a class="header-anchor" href="#编码器" aria-label="Permalink to &quot;编码器&quot;">​</a></h2><ul><li>设备配置：每个高级定时器/通用定时器都有一个编码器接口</li><li>引脚配置：两个输入引脚借用CH1/CH2通道</li><li>配置步骤： <ol><li>启动时钟</li><li>配置GPIO</li><li>配置时基单元</li><li>配置输入捕获单元（只需要配置滤波器/极性选择）</li><li>配置编码器接口模式</li></ol></li><li>配置代码：</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>	//开启RCC时钟</span></span>
<span class="line"><span>    RCC_APB1PeriphClockCmd(RCC_APB1Periph_TIM3, ENABLE);</span></span>
<span class="line"><span>	</span></span>
<span class="line"><span>	//GPIO-model</span></span>
<span class="line"><span>    RCC_APB2PeriphClockCmd(RCC_APB2Periph_GPIOA, ENABLE);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    GPIO_InitTypeDef GPIO_InitStructure;</span></span>
<span class="line"><span>    GPIO_InitStructure.GPIO_Mode = GPIO_Mode_AF_IPU;         // 复用推挽输出</span></span>
<span class="line"><span>    GPIO_InitStructure.GPIO_Pin = GPIO_Pin_6 | GPIO_Pin_6;   // TIM2_CH1</span></span>
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
<span class="line"><span>    TIM_TimeBaseInitStructure.TIM_Prescaler = 1 - 1;               //PSC</span></span>
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
<span class="line"><span>    // 使用库函数初始化TIM_ICInitStructure结构体为默认值</span></span>
<span class="line"><span>    // 默认值包括：</span></span>
<span class="line"><span>    // - TIM_Channel: TIM_Channel_1</span></span>
<span class="line"><span>    // - TIM_ICFilter: 0x0</span></span>
<span class="line"><span>    // - TIM_ICPolarity: TIM_ICPolarity_Rising</span></span>
<span class="line"><span>    // - TIM_ICPrescaler: TIM_ICPSC_DIV1</span></span>
<span class="line"><span>    // - TIM_ICSelection: TIM_ICSelection_DirectTI</span></span>
<span class="line"><span>    TIM_ICStructInit(&amp;TIM_ICInitStructure);</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    //通道1（A相）</span></span>
<span class="line"><span>    TIM_ICInitStructure.TIM_Channel = TIM_Channel_1;             //配置通道</span></span>
<span class="line"><span>    TIM_ICInitStructure.TIM_ICFilter = 0xF;                      //滤波器参数N</span></span>
<span class="line"><span>	</span></span>
<span class="line"><span>	//通道2 （B相）</span></span>
<span class="line"><span>    TIM_ICInitStructure.TIM_Channel = TIM_Channel_2;             //配置通道</span></span>
<span class="line"><span>    TIM_ICInitStructure.TIM_ICFilter = 0xF;                      //滤波器参数N</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // 初始化IC</span></span>
<span class="line"><span>    TIM_ICInit(TIM3, &amp;TIM_ICInitStructure);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	// 配置TIM3为编码器模式</span></span>
<span class="line"><span>    // 参数说明：</span></span>
<span class="line"><span>    // - TIM3: 定时器编号</span></span>
<span class="line"><span>    // - TIM_EncoderMode_TI12: 编码器模式，同时使用TI1和TI2</span></span>
<span class="line"><span>    // - TIM_ICPolarity_Rising: TI1通道上升沿触发</span></span>
<span class="line"><span>    // - TIM_ICPolarity_Rising: TI2通道上升沿触发</span></span>
<span class="line"><span>    TIM_EncoderInterfaceConfig</span></span>
<span class="line"><span>    (TIM3, TIM_EncoderMode_TI12,TIM_ICPolarity_Rising,TIM_ICPolarity_Rising);</span></span>
<span class="line"><span>    \`\`\`</span></span>
<span class="line"><span>	//使能TIM</span></span>
<span class="line"><span>    TIM_Cmd(TIM3, ENABLE);</span></span></code></pre></div>`,4)])])}const o=s(l,[["render",i]]);export{M as __pageData,o as default};
