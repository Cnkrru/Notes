import{_ as n,o as a,c as p,ag as i}from"./chunks/framework.Cqf6AMW8.js";const P=JSON.parse('{"title":"STM32 SPI通信","description":"STM32 SPI通信的配置和使用。","frontmatter":{"title":"STM32 SPI通信","description":"STM32 SPI通信的配置和使用。","date":"2026-04-21T00:00:00.000Z","tags":["STM32","SPI","通信协议"],"sidebar":"auto"},"headers":[],"relativePath":"docs/hardware/stm32/stm32-15-SPI.md","filePath":"docs/hardware/stm32/stm32-15-SPI.md","lastUpdated":1776715536000}'),l={name:"docs/hardware/stm32/stm32-15-SPI.md"};function t(e,s,S,c,r,I){return a(),p("div",null,[...s[0]||(s[0]=[i(`<h2 id="_1-spi基本概念" tabindex="-1">1. SPI基本概念 <a class="header-anchor" href="#_1-spi基本概念" aria-label="Permalink to &quot;1. SPI基本概念&quot;">​</a></h2><table tabindex="0"><thead><tr><th>特性</th><th>描述</th></tr></thead><tbody><tr><td>通信线</td><td>4根：SCK（时钟）、MOSI（主出从入）、MISO（主入从出）、SS（从机选择）</td></tr><tr><td>通信方式</td><td>同步，全双工</td></tr><tr><td>拓扑结构</td><td>支持一主多从</td></tr></tbody></table><h2 id="_2-硬件电路连接" tabindex="-1">2. 硬件电路连接 <a class="header-anchor" href="#_2-硬件电路连接" aria-label="Permalink to &quot;2. 硬件电路连接&quot;">​</a></h2><table tabindex="0"><thead><tr><th>连接方式</th><th>说明</th></tr></thead><tbody><tr><td>主机与从机</td><td>所有SPI设备的SCK、MOSI、MISO分别连接在一起</td></tr><tr><td>从机选择</td><td>主机引出多条SS控制线，分别接到各从机的SS引脚</td></tr><tr><td>引脚配置</td><td>输出引脚配置为推挽输出，输入引脚配置为浮空或上拉输入</td></tr></tbody></table><h3 id="_2-1-硬件连接示意图" tabindex="-1">2.1 硬件连接示意图 <a class="header-anchor" href="#_2-1-硬件连接示意图" aria-label="Permalink to &quot;2.1 硬件连接示意图&quot;">​</a></h3><div class="language-mermaid vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">mermaid</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">graph TD</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    subgraph 主机</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        H_SCK[SCK]</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        H_MOSI[MOSI]</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        H_MISO[MISO]</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        H_SS[SS]</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    end</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    subgraph 从机</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        S_SCK[SCK]</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        S_MOSI[MOSI]</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        S_MISO[MISO]</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        S_SS[SS]</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    end</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    H_SCK --&gt; S_SCK</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    H_MOSI --&gt; S_MOSI</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    S_MISO --&gt; H_MISO</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    H_SS --&gt; S_SS</span></span></code></pre></div><h2 id="_3-spi时序基本单元" tabindex="-1">3. SPI时序基本单元 <a class="header-anchor" href="#_3-spi时序基本单元" aria-label="Permalink to &quot;3. SPI时序基本单元&quot;">​</a></h2><h3 id="_3-1-通信开始与结束" tabindex="-1">3.1 通信开始与结束 <a class="header-anchor" href="#_3-1-通信开始与结束" aria-label="Permalink to &quot;3.1 通信开始与结束&quot;">​</a></h3><ul><li><strong>起始条件</strong>：SS从高电平切换到低电平</li><li><strong>终止条件</strong>：SS从低电平切换到高电平</li></ul><h4 id="_3-1-1-通信时序图" tabindex="-1">3.1.1 通信时序图 <a class="header-anchor" href="#_3-1-1-通信时序图" aria-label="Permalink to &quot;3.1.1 通信时序图&quot;">​</a></h4><div class="language-mermaid vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">mermaid</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">graph LR</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    A[空闲状态] --&gt;|SS拉低| B[通信开始]</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    B --&gt; C[数据传输]</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    C --&gt;|SS拉高| D[通信结束]</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    D --&gt; A</span></span></code></pre></div><h3 id="_3-2-数据传输模式-模式0" tabindex="-1">3.2 数据传输模式（模式0） <a class="header-anchor" href="#_3-2-数据传输模式-模式0" aria-label="Permalink to &quot;3.2 数据传输模式（模式0）&quot;">​</a></h3><table tabindex="0"><thead><tr><th>模式参数</th><th>说明</th></tr></thead><tbody><tr><td>CPOL=0</td><td>空闲状态时，SCK为低电平</td></tr><tr><td>CPHA=0</td><td>SCK第一个边沿移入数据，第二个边沿移出数据</td></tr></tbody></table><h4 id="_3-2-1-数据传输时序图-模式0" tabindex="-1">3.2.1 数据传输时序图（模式0） <a class="header-anchor" href="#_3-2-1-数据传输时序图-模式0" aria-label="Permalink to &quot;3.2.1 数据传输时序图（模式0）&quot;">​</a></h4><div class="language-mermaid vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">mermaid</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">graph LR</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    subgraph 时序</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        SS[SS: 高 → 低 → 高]</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        SCK[SCK: 低→高→低→高...]</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        MOSI[MOSI: 数据输出]</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        MISO[MISO: 数据输入]</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    end</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    </span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    SS --&gt;|开始| SCK</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    SCK --&gt;|同步| MOSI</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    SCK --&gt;|同步| MISO</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    SCK --&gt;|结束| SS</span></span></code></pre></div><h2 id="_4-如何使用spi通信" tabindex="-1">4. 如何使用SPI通信 <a class="header-anchor" href="#_4-如何使用spi通信" aria-label="Permalink to &quot;4. 如何使用SPI通信&quot;">​</a></h2><h3 id="_4-1-初始化配置" tabindex="-1">4.1 初始化配置 <a class="header-anchor" href="#_4-1-初始化配置" aria-label="Permalink to &quot;4.1 初始化配置&quot;">​</a></h3><ol><li>配置SPI时钟频率</li><li>设置数据位宽度（通常为8位）</li><li>选择SPI模式（通常为模式0）</li><li>配置GPIO引脚（SCK、MOSI、MISO为复用功能，SS为推挽输出）</li></ol><h3 id="_4-2-通信步骤" tabindex="-1">4.2 通信步骤 <a class="header-anchor" href="#_4-2-通信步骤" aria-label="Permalink to &quot;4.2 通信步骤&quot;">​</a></h3><ol><li><strong>选择从机</strong>：将对应从机的SS引脚拉低</li><li><strong>数据传输</strong>： <ul><li>主机通过MOSI发送数据</li><li>同时通过MISO接收从机返回的数据</li><li>数据在SCK的边沿同步传输</li></ul></li><li><strong>结束通信</strong>：将SS引脚拉高，释放从机</li></ol><h2 id="配置代码" tabindex="-1">配置代码： <a class="header-anchor" href="#配置代码" aria-label="Permalink to &quot;配置代码：&quot;">​</a></h2><ul><li>软件SPI</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>	//写入SS</span></span>
<span class="line"><span>void SoftSPI_W_SS(uint8_t BitValue)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    GPIO_WriteBit(GPIOA, GPIO_Pin_4, (BitAction)BitValue);</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>	</span></span>
<span class="line"><span>	//写入SCK</span></span>
<span class="line"><span>void SoftSPI_W_SCK(uint8_t BitValue)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    GPIO_WriteBit(GPIOA, GPIO_Pin_5, (BitAction)BitValue);</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>	</span></span>
<span class="line"><span>	//写入MOSI</span></span>
<span class="line"><span>void SoftSPI_W_MOSI(uint8_t BitValue)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    GPIO_WriteBit(GPIOA, GPIO_Pin_7, (BitAction)BitValue);</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>	</span></span>
<span class="line"><span>	//读取MISO</span></span>
<span class="line"><span>uint8_t SoftSPI_R_MISO(void)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    return GPIO_ReadInputDataBit(GPIOA, GPIO_Pin_6);</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>void SoftSPI_Init(void)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>	//使能GPIO的RCC时钟</span></span>
<span class="line"><span>    RCC_APB2PeriphClockCmd(RCC_APB2Periph_GPIOA, ENABLE);</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    //配置SS/SCK/MOSI</span></span>
<span class="line"><span>    GPIO_InitTypeDef GPIO_InitStructure;</span></span>
<span class="line"><span>    GPIO_InitStructure.GPIO_Mode = GPIO_Mode_Out_PP;</span></span>
<span class="line"><span>    GPIO_InitStructure.GPIO_Pin = GPIO_Pin_4 | GPIO_Pin_5 | GPIO_Pin_7;</span></span>
<span class="line"><span>    GPIO_InitStructure.GPIO_Speed = GPIO_Speed_50MHz;</span></span>
<span class="line"><span>    GPIO_Init(GPIOA, &amp;GPIO_InitStructure);</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    //配置MISO</span></span>
<span class="line"><span>    GPIO_InitStructure.GPIO_Mode = GPIO_Mode_IPU;</span></span>
<span class="line"><span>    GPIO_InitStructure.GPIO_Pin = GPIO_Pin_6;</span></span>
<span class="line"><span>    GPIO_Init(GPIOA, &amp;GPIO_InitStructure);</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    //初始化引脚</span></span>
<span class="line"><span>    SoftSPI_W_SS(1);</span></span>
<span class="line"><span>    SoftSPI_W_SCK(0);</span></span>
<span class="line"><span>    SoftSPI_W_MOSI(0);</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>	</span></span>
<span class="line"><span>	//发送一个字节</span></span>
<span class="line"><span>uint8_t SoftSPI_Transfer(uint8_t Byte)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    uint8_t i;</span></span>
<span class="line"><span>    for (i = 0; i &lt; 8; i++)</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>        SoftSPI_W_MOSI((Byte &amp; 0x80) &gt;&gt; 7);</span></span>
<span class="line"><span>        SoftSPI_W_SCK(1);</span></span>
<span class="line"><span>        Byte &lt;&lt;= 1;</span></span>
<span class="line"><span>        Byte |= SoftSPI_R_MISO();</span></span>
<span class="line"><span>        SoftSPI_W_SCK(0);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    return Byte;</span></span>
<span class="line"><span>}</span></span></code></pre></div><ul><li>硬件SPI</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>	//硬件写入SS</span></span>
<span class="line"><span>void HardSPI_W_SS(uint8_t BitValue)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    GPIO_WriteBit(GPIOA, GPIO_Pin_4, (BitAction)BitValue);</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>	</span></span>
<span class="line"><span>uint8_t HardSPI_Transfer(uint8_t Byte)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    while (SPI_I2S_GetFlagStatus(SPI1, SPI_I2S_FLAG_TXE) == RESET);</span></span>
<span class="line"><span>    SPI_I2S_SendData(SPI1, Byte);</span></span>
<span class="line"><span>    while (SPI_I2S_GetFlagStatus(SPI1, SPI_I2S_FLAG_RXNE) == RESET);</span></span>
<span class="line"><span>    return SPI_I2S_ReceiveData(SPI1);</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>	</span></span>
<span class="line"><span>void HardSPI_Init(void)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>	//使能GPIO与SPI的RCC时钟</span></span>
<span class="line"><span>    RCC_APB2PeriphClockCmd(RCC_APB2Periph_GPIOA, ENABLE);</span></span>
<span class="line"><span>    RCC_APB2PeriphClockCmd(RCC_APB2Periph_SPI1, ENABLE);</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    //GPIO配置</span></span>
<span class="line"><span>    GPIO_InitTypeDef GPIO_InitStructure;</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    //配置SS引脚</span></span>
<span class="line"><span>    GPIO_InitStructure.GPIO_Mode = GPIO_Mode_Out_PP;</span></span>
<span class="line"><span>    GPIO_InitStructure.GPIO_Pin = GPIO_Pin_4;</span></span>
<span class="line"><span>    GPIO_InitStructure.GPIO_Speed = GPIO_Speed_50MHz;</span></span>
<span class="line"><span>    GPIO_Init(GPIOA, &amp;GPIO_InitStructure);</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    //配置SCK引脚</span></span>
<span class="line"><span>    GPIO_InitStructure.GPIO_Mode = GPIO_Mode_AF_PP;</span></span>
<span class="line"><span>    GPIO_InitStructure.GPIO_Pin = GPIO_Pin_5 | GPIO_Pin_7;</span></span>
<span class="line"><span>    GPIO_Init(GPIOA, &amp;GPIO_InitStructure);</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    //配置MISO引脚</span></span>
<span class="line"><span>    GPIO_InitStructure.GPIO_Mode = GPIO_Mode_IPU;</span></span>
<span class="line"><span>    GPIO_InitStructure.GPIO_Pin = GPIO_Pin_6;</span></span>
<span class="line"><span>    GPIO_Init(GPIOA, &amp;GPIO_InitStructure);</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    /*SPI配置</span></span>
<span class="line"><span>    *1.预分配2</span></span>
<span class="line"><span>    *2.时钟相位为第1个边沿</span></span>
<span class="line"><span>    *3.时钟极性为低电平</span></span>
<span class="line"><span>    *4.CRC多项式</span></span>
<span class="line"><span>    *5.数据宽度为8位</span></span>
<span class="line"><span>    *6.全双工模式</span></span>
<span class="line"><span>    *7.高位先发送</span></span>
<span class="line"><span>    *8.主机模式</span></span>
<span class="line"><span>    *9.软件片选</span></span>
<span class="line"><span>    */</span></span>
<span class="line"><span>    SPI_InitTypeDef SPI_InitStructure;</span></span>
<span class="line"><span>    SPI_InitStructure.SPI_BaudRatePrescaler = SPI_BaudRatePrescaler_2;</span></span>
<span class="line"><span>    SPI_InitStructure.SPI_CPHA = SPI_CPHA_1Edge;</span></span>
<span class="line"><span>    SPI_InitStructure.SPI_CPOL = SPI_CPOL_Low;</span></span>
<span class="line"><span>    SPI_InitStructure.SPI_CRCPolynomial = 7;</span></span>
<span class="line"><span>    SPI_InitStructure.SPI_DataSize = SPI_DataSize_8b;</span></span>
<span class="line"><span>    SPI_InitStructure.SPI_Direction = SPI_Direction_2Lines_FullDuplex;</span></span>
<span class="line"><span>    SPI_InitStructure.SPI_FirstBit = SPI_FirstBit_MSB;</span></span>
<span class="line"><span>    SPI_InitStructure.SPI_Mode = SPI_Mode_Master;</span></span>
<span class="line"><span>    SPI_InitStructure.SPI_NSS = SPI_NSS_Soft;</span></span>
<span class="line"><span>    SPI_Init(SPI1, &amp;SPI_InitStructure);</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    //使能SPI</span></span>
<span class="line"><span>    SPI_Cmd(SPI1, ENABLE);</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    HardSPI_W_SS(1);</span></span>
<span class="line"><span>} </span></span>
<span class="line"><span>	</span></span>
<span class="line"><span>	//硬件发送一个字节</span></span>
<span class="line"><span>uint8_t HardSPI_Transfer(uint8_t Byte)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    while (SPI_I2S_GetFlagStatus(SPI1, SPI_I2S_FLAG_TXE) == RESET);  //等待发送缓冲区为空</span></span>
<span class="line"><span>    SPI_I2S_SendData(SPI1, Byte);  //发送数据</span></span>
<span class="line"><span>    while (SPI_I2S_GetFlagStatus(SPI1, SPI_I2S_FLAG_RXNE) == RESET);  //等待接收缓冲区非空</span></span>
<span class="line"><span>    return SPI_I2S_ReceiveData(SPI1);  //返回接收数据</span></span>
<span class="line"><span>}</span></span></code></pre></div>`,25)])])}const h=n(l,[["render",t]]);export{P as __pageData,h as default};
