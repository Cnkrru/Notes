import{_ as s,o as a,c as p,ag as l}from"./chunks/framework.Cqf6AMW8.js";const C=JSON.parse('{"title":"STM32 DMA","description":"STM32 DMA（直接内存访问）的配置和使用。","frontmatter":{"title":"STM32 DMA","description":"STM32 DMA（直接内存访问）的配置和使用。","date":"2026-04-21T00:00:00.000Z","tags":["STM32","DMA","直接内存访问"],"sidebar":"auto"},"headers":[],"relativePath":"docs/hardware/stm32/stm32-11-DMA.md","filePath":"docs/hardware/stm32/stm32-11-DMA.md","lastUpdated":1776715536000}'),e={name:"docs/hardware/stm32/stm32-11-DMA.md"};function i(t,n,c,r,A,_){return a(),p("div",null,[...n[0]||(n[0]=[l(`<h3 id="dma简介" tabindex="-1">DMA简介 <a class="header-anchor" href="#dma简介" aria-label="Permalink to &quot;DMA简介&quot;">​</a></h3><ul><li><strong>工作功能</strong>：实现外设与存储器/存储器与存储器之间的数据传输</li><li><strong>工作资源</strong>：DMA1（7个通道）DMA2（5个通道）</li><li><strong>CT86资源</strong>：DMA1</li><li><strong>存储地址</strong>：</li></ul><table tabindex="0"><thead><tr><th>类型</th><th>起始地址</th><th>存储器</th><th>用途</th></tr></thead><tbody><tr><td>ROM</td><td>0x08000000</td><td>程序存储器Flash</td><td>存储C语言编译后的程序代码</td></tr><tr><td>ROM</td><td>0x1FFFF000</td><td>系统存储器</td><td>存储BootLoader，用于串口下载</td></tr><tr><td>ROM</td><td>0x1FFF8000</td><td>选项字节</td><td>存储一些独立于程序代码的配置参数</td></tr><tr><td>RAM</td><td>0x20000000</td><td>运行内存SRAM</td><td>存储运行过程中的临时变量</td></tr><tr><td>RAM</td><td>0x40000000</td><td>外设寄存器</td><td>存储各个外设的配置参数</td></tr><tr><td>RAM</td><td>0xE0000000</td><td>内核外设寄存器</td><td>存储内核各个外设的配置参数</td></tr></tbody></table><ul><li>配置步骤： <ol><li>开启RCC时钟</li><li>配置DMA <ul><li>双方的地址/数据宽度/是否自增（不增，数据一直存在一个位置，数据会覆盖）</li><li>传输方向：由谁向谁传输</li><li>缓存区大小</li><li>是否循环，配合ADC</li><li>选择传输类型：存储器到存储器/外设到存储器</li><li>也可以配置外部中断</li></ul></li><li>使能DMA</li></ol></li><li>配置代码：</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>	//使能RCC-DMA1</span></span>
<span class="line"><span>    RCC_AHBPeriphClockCmd(RCC_AHBPeriph_DMA1, ENABLE);</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    /*配置DMA</span></span>
<span class="line"><span>    *1.外设基地址</span></span>
<span class="line"><span>    *2.外设数据宽度</span></span>
<span class="line"><span>    *3.使能外设数据自增</span></span>
<span class="line"><span>    *1.内存基地址</span></span>
<span class="line"><span>    *2.内存数据宽度</span></span>
<span class="line"><span>    *3.内存地址自增</span></span>
<span class="line"><span>    *传输方向</span></span>
<span class="line"><span>    *缓存区大小</span></span>
<span class="line"><span>    *非循环模式</span></span>
<span class="line"><span>    *存储器到存储器传输</span></span>
<span class="line"><span>    *中等优先级</span></span>
<span class="line"><span>    */</span></span>
<span class="line"><span>    DMA_InitTypeDef DMA_InitStructure;</span></span>
<span class="line"><span>    DMA_InitStructure.DMA_PeripheralBaseAddr = AddrA;</span></span>
<span class="line"><span>    DMA_InitStructure.DMA_PeripheralDataSize = DMA_PeripheralDataSize_Byte;</span></span>
<span class="line"><span>    DMA_InitStructure.DMA_PeripheralInc = DMA_PeripheralInc_Enable;</span></span>
<span class="line"><span>    DMA_InitStructure.DMA_MemoryBaseAddr = AddrB;</span></span>
<span class="line"><span>    DMA_InitStructure.DMA_MemoryDataSize = DMA_MemoryDataSize_Byte;</span></span>
<span class="line"><span>    DMA_InitStructure.DMA_MemoryInc = DMA_MemoryInc_Enable;</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    DMA_InitStructure.DMA_DIR = DMA_DIR_PeripheralSRC;</span></span>
<span class="line"><span>    DMA_InitStructure.DMA_BufferSize = DMA_BufferSize;</span></span>
<span class="line"><span>    DMA_InitStructure.DMA_Mode = DMA_Mode_Normal;</span></span>
<span class="line"><span>    DMA_InitStructure.DMA_M2M = DMA_M2M_Enable;</span></span>
<span class="line"><span>    DMA_InitStructure.DMA_Priority = DMA_Priority_Medium;</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    //初始化DMA</span></span>
<span class="line"><span>    DMA_Init(DMA1_Channel1, &amp;DMA_InitStructure);</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    //使能DMA</span></span>
<span class="line"><span>    DMA_Cmd(DMA1_Channel1, ENABLE);</span></span></code></pre></div><ul><li>ADC+DMA配置代码：</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>    /*</span></span>
<span class="line"><span>     * 1. 使能时钟</span></span>
<span class="line"><span>     * - 使能ADC1时钟</span></span>
<span class="line"><span>     * - 使能GPIOA时钟（PA0-PA3作为模拟输入）</span></span>
<span class="line"><span>     * - 使能DMA1时钟（用于数据传输）</span></span>
<span class="line"><span>     */</span></span>
<span class="line"><span>    RCC_APB2PeriphClockCmd(RCC_APB2Periph_ADC1, ENABLE);</span></span>
<span class="line"><span>    RCC_APB2PeriphClockCmd(RCC_APB2Periph_GPIOA, ENABLE);</span></span>
<span class="line"><span>    RCC_AHBPeriphClockCmd(RCC_AHBPeriph_DMA1, ENABLE);</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    /*</span></span>
<span class="line"><span>     * 2. 配置GPIO</span></span>
<span class="line"><span>     * - PA0-PA3配置为模拟输入模式</span></span>
<span class="line"><span>     * - 用于ADC通道0-3的信号输入</span></span>
<span class="line"><span>     */</span></span>
<span class="line"><span>    GPIO_InitTypeDef GPIO_InitStructure;</span></span>
<span class="line"><span>    GPIO_InitStructure.GPIO_Mode = GPIO_Mode_AIN;</span></span>
<span class="line"><span>    GPIO_InitStructure.GPIO_Pin = </span></span>
<span class="line"><span>	GPIO_Pin_0 | GPIO_Pin_1 | GPIO_Pin_2 | GPIO_Pin_3;</span></span>
<span class="line"><span>    GPIO_InitStructure.GPIO_Speed = GPIO_Speed_50MHz;</span></span>
<span class="line"><span>    GPIO_Init(GPIOA, &amp;GPIO_InitStructure);</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    /*</span></span>
<span class="line"><span>     * 3. 配置DMA通道1</span></span>
<span class="line"><span>     * - 外设基地址：ADC1数据寄存器</span></span>
<span class="line"><span>     * - 数据宽度：16位（HalfWord）</span></span>
<span class="line"><span>     * - 外设地址：固定</span></span>
<span class="line"><span>     * - 内存地址：ADC_ConvertedValue缓冲区</span></span>
<span class="line"><span>     * - 内存地址：自增</span></span>
<span class="line"><span>     * - 传输方向：外设作为数据源</span></span>
<span class="line"><span>     * - 缓冲区大小：4个通道</span></span>
<span class="line"><span>     * - 模式：循环模式</span></span>
<span class="line"><span>     * - 优先级：高</span></span>
<span class="line"><span>     */</span></span>
<span class="line"><span>    DMA_InitTypeDef DMA_InitStructure;</span></span>
<span class="line"><span>    DMA_InitStructure.DMA_PeripheralBaseAddr = (uint32_t)&amp;ADC1-&gt;DR;</span></span>
<span class="line"><span>    DMA_InitStructure.DMA_PeripheralDataSize = </span></span>
<span class="line"><span>    DMA_PeripheralDataSize_HalfWord;</span></span>
<span class="line"><span>    DMA_InitStructure.DMA_PeripheralInc = DMA_PeripheralInc_Disable;</span></span>
<span class="line"><span>    DMA_InitStructure.DMA_MemoryBaseAddr = (uint32_t)ADC_ConvertedValue;</span></span>
<span class="line"><span>    DMA_InitStructure.DMA_MemoryDataSize = DMA_MemoryDataSize_HalfWord;</span></span>
<span class="line"><span>    DMA_InitStructure.DMA_MemoryInc = DMA_MemoryInc_Enable;</span></span>
<span class="line"><span>    DMA_InitStructure.DMA_DIR = DMA_DIR_PeripheralSRC;</span></span>
<span class="line"><span>    DMA_InitStructure.DMA_BufferSize = 4;</span></span>
<span class="line"><span>    DMA_InitStructure.DMA_Mode = DMA_Mode_Circular;</span></span>
<span class="line"><span>    DMA_InitStructure.DMA_M2M = DMA_M2M_Disable;</span></span>
<span class="line"><span>    DMA_InitStructure.DMA_Priority = DMA_Priority_High;</span></span>
<span class="line"><span>    DMA_Init(DMA1_Channel1, &amp;DMA_InitStructure);</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    /*</span></span>
<span class="line"><span>     * 4. 使能DMA通道1</span></span>
<span class="line"><span>     */</span></span>
<span class="line"><span>    DMA_Cmd(DMA1_Channel1, ENABLE);</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    /*</span></span>
<span class="line"><span>     * 5. 配置ADC1</span></span>
<span class="line"><span>     * - ADC时钟分频：PCLK2/6</span></span>
<span class="line"><span>     * - 规则通道配置：通道0-3，采样时间55.5周期</span></span>
<span class="line"><span>     * - 工作模式：独立模式，右对齐，无外部触发</span></span>
<span class="line"><span>     * - 转换模式：连续转换，扫描模式</span></span>
<span class="line"><span>     * - 通道数量：4个</span></span>
<span class="line"><span>     */</span></span>
<span class="line"><span>    RCC_ADCCLKConfig(RCC_PCLK2_Div6);</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    ADC_RegularChannelConfig</span></span>
<span class="line"><span>    (ADC1, ADC_Channel_0, 1, ADC_SampleTime_55Cycles5);</span></span>
<span class="line"><span>    ADC_RegularChannelConfig</span></span>
<span class="line"><span>    (ADC1, ADC_Channel_1, 2, ADC_SampleTime_55Cycles5);</span></span>
<span class="line"><span>    ADC_RegularChannelConfig</span></span>
<span class="line"><span>    (ADC1, ADC_Channel_2, 3, ADC_SampleTime_55Cycles5);</span></span>
<span class="line"><span>    ADC_RegularChannelConfig</span></span>
<span class="line"><span>    (ADC1, ADC_Channel_3, 4, ADC_SampleTime_55Cycles5);</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    ADC_InitTypeDef ADC_InitStructure;</span></span>
<span class="line"><span>    ADC_InitStructure.ADC_Mode = ADC_Mode_Independent;</span></span>
<span class="line"><span>    ADC_InitStructure.ADC_DataAlign = ADC_DataAlign_Right;</span></span>
<span class="line"><span>    ADC_InitStructure.ADC_ExternalTrigConv = ADC_ExternalTrigConv_None;</span></span>
<span class="line"><span>    ADC_InitStructure.ADC_ContinuousConvMode = ENABLE;</span></span>
<span class="line"><span>    ADC_InitStructure.ADC_ScanConvMode = ENABLE;</span></span>
<span class="line"><span>    ADC_InitStructure.ADC_NbrOfChannel = 4;</span></span>
<span class="line"><span>    ADC_Init(ADC1, &amp;ADC_InitStructure);</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    /*</span></span>
<span class="line"><span>     * 6. 使能ADC1的DMA请求</span></span>
<span class="line"><span>     */</span></span>
<span class="line"><span>    ADC_DMACmd(ADC1, ENABLE);</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    /*</span></span>
<span class="line"><span>     * 7. 使能ADC1</span></span>
<span class="line"><span>     */</span></span>
<span class="line"><span>    ADC_Cmd(ADC1, ENABLE);</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    /*</span></span>
<span class="line"><span>     * 8. ADC校准</span></span>
<span class="line"><span>     * - 重置校准寄存器</span></span>
<span class="line"><span>     * - 等待重置完成</span></span>
<span class="line"><span>     * - 开始校准</span></span>
<span class="line"><span>     * - 等待校准完成</span></span>
<span class="line"><span>     */</span></span>
<span class="line"><span>    ADC_ResetCalibration(ADC1);</span></span>
<span class="line"><span>    while (ADC_GetResetCalibrationStatus(ADC1) == SET);</span></span>
<span class="line"><span>    ADC_StartCalibration(ADC1);</span></span>
<span class="line"><span>    while (ADC_GetCalibrationStatus(ADC1) == SET);</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    /*</span></span>
<span class="line"><span>     * 9. 启动ADC转换</span></span>
<span class="line"><span>     */</span></span>
<span class="line"><span>    ADC_SoftwareStartConvCmd(ADC1, ENABLE);</span></span></code></pre></div>`,7)])])}const M=s(e,[["render",i]]);export{C as __pageData,M as default};
