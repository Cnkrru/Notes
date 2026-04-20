import{_ as a,o as n,c as p,ag as i}from"./chunks/framework.Cqf6AMW8.js";const c=JSON.parse('{"title":"STM32 W25Q64","description":"STM32 W25Q64 Flash存储器的配置和使用。","frontmatter":{"title":"STM32 W25Q64","description":"STM32 W25Q64 Flash存储器的配置和使用。","date":"2026-04-21T00:00:00.000Z","tags":["STM32","W25Q64","Flash","SPI"],"sidebar":"auto"},"headers":[],"relativePath":"docs/hardware/stm32/stm32-16-W25Q64.md","filePath":"docs/hardware/stm32/stm32-16-W25Q64.md","lastUpdated":1776715536000}'),l={name:"docs/hardware/stm32/stm32-16-W25Q64.md"};function t(e,s,d,h,r,k){return n(),p("div",null,[...s[0]||(s[0]=[i(`<h3 id="基本信息" tabindex="-1">基本信息 <a class="header-anchor" href="#基本信息" aria-label="Permalink to &quot;基本信息&quot;">​</a></h3><ul><li>W25Qxx系列是一种低成本、小型化、使用简单的非易失性存储器</li><li>常用于数据存储、字库存储、固件程序存储等场景</li><li>存储介质：Nor Flash（闪存）</li><li>时钟频率：80MHz / 160MHz (Dual SPI) / 320MHz (Quad SPI)</li></ul><h3 id="存储容量-24位地址" tabindex="-1">存储容量（24位地址） <a class="header-anchor" href="#存储容量-24位地址" aria-label="Permalink to &quot;存储容量（24位地址）&quot;">​</a></h3><table tabindex="0"><thead><tr><th>型号</th><th>容量（bit）</th><th>容量（Byte）</th></tr></thead><tbody><tr><td>W25Q40</td><td>4Mbit</td><td>512KByte</td></tr><tr><td>W25Q80</td><td>8Mbit</td><td>1MByte</td></tr><tr><td>W25Q16</td><td>16Mbit</td><td>2MByte</td></tr><tr><td>W25Q32</td><td>32Mbit</td><td>4MByte</td></tr><tr><td>W25Q64</td><td>64Mbit</td><td>8MByte</td></tr><tr><td>W25Q128</td><td>128Mbit</td><td>16MByte</td></tr><tr><td>W25Q256</td><td>256Mbit</td><td>32MByte</td></tr></tbody></table><h3 id="w21q64使用步骤" tabindex="-1">W21Q64使用步骤 <a class="header-anchor" href="#w21q64使用步骤" aria-label="Permalink to &quot;W21Q64使用步骤&quot;">​</a></h3><h3 id="软件spi操作步骤" tabindex="-1">软件SPI操作步骤 <a class="header-anchor" href="#软件spi操作步骤" aria-label="Permalink to &quot;软件SPI操作步骤&quot;">​</a></h3><table tabindex="0"><thead><tr><th>步骤</th><th>操作</th><th>函数调用</th><th>参数说明</th></tr></thead><tbody><tr><td>1</td><td>初始化软件SPI</td><td><code>SoftSPI_Init()</code></td><td>无参数</td></tr><tr><td>2</td><td>初始化W25Q64</td><td><code>W25Q64_Init()</code></td><td>无参数</td></tr><tr><td>3</td><td>读取数据</td><td><code>W25Q64_ReadData(Address, DataArray, Count)</code></td><td>Address: 读取起始地址<br>DataArray: 存储读取数据的缓冲区<br>Count: 要读取的字节数</td></tr><tr><td>4</td><td>擦除扇区</td><td><code>W25Q64_SectorErase(Address)</code></td><td>Address: 要擦除的扇区地址</td></tr><tr><td>5</td><td>写入数据</td><td><code>W25Q64_PageProgram(Address, DataArray, Count)</code></td><td>Address: 写入起始地址<br>DataArray: 要写入的数据缓冲区<br>Count: 要写入的字节数（最大256字节）</td></tr><tr><td>6</td><td>读取JEDEC ID</td><td><code>W25Q64_ReadJEDECID()</code></td><td>无参数，返回32位JEDEC ID</td></tr></tbody></table><h3 id="硬件spi操作步骤" tabindex="-1">硬件SPI操作步骤 <a class="header-anchor" href="#硬件spi操作步骤" aria-label="Permalink to &quot;硬件SPI操作步骤&quot;">​</a></h3><table tabindex="0"><thead><tr><th>步骤</th><th>操作</th><th>函数调用</th><th>参数说明</th></tr></thead><tbody><tr><td>1</td><td>初始化硬件SPI</td><td><code>HardSPI_Init()</code></td><td>无参数</td></tr><tr><td>2</td><td>初始化W25Q64</td><td><code>W25Q64_HardInit()</code></td><td>无参数</td></tr><tr><td>3</td><td>读取数据</td><td><code>W25Q64_HardReadData(Address, DataArray, Count)</code></td><td>Address: 读取起始地址<br>DataArray: 存储读取数据的缓冲区<br>Count: 要读取的字节数</td></tr><tr><td>4</td><td>擦除扇区</td><td><code>W25Q64_HardSectorErase(Address)</code></td><td>Address: 要擦除的扇区地址</td></tr><tr><td>5</td><td>写入数据</td><td><code>W25Q64_HardPageProgram(Address, DataArray, Count)</code></td><td>Address: 写入起始地址<br>DataArray: 要写入的数据缓冲区<br>Count: 要写入的字节数（最大256字节）</td></tr><tr><td>6</td><td>读取JEDEC ID</td><td><code>W25Q64_HardReadJEDECID()</code></td><td>无参数，返回32位JEDEC ID</td></tr></tbody></table><h3 id="软件spi示例" tabindex="-1">软件SPI示例 <a class="header-anchor" href="#软件spi示例" aria-label="Permalink to &quot;软件SPI示例&quot;">​</a></h3><div class="language-c vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">c</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">void</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> W25Q64_SoftwareExample</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">void</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">)</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">{</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">    uint8_t</span><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;"> readBuffer</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">[</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">10</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">];</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">    uint8_t</span><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;"> writeBuffer</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">[</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">5</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">] </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> {</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">0x</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">01</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">0x</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">02</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">0x</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">03</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">0x</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">04</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">0x</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">05</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">};</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">    uint32_t</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> jedecID;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    </span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">    // 初始化</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">    SoftSPI_Init</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">();</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">    W25Q64_Init</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">();</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    </span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">    // 读取JEDEC ID</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    jedecID </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> W25Q64_ReadJEDECID</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">();</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    </span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">    // 擦除扇区</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">    W25Q64_SectorErase</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">0x</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">000000</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">);</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    </span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">    // 写入数据</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">    W25Q64_PageProgram</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">0x</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">000000</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, writeBuffer, </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">5</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">);</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    </span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">    // 读取数据</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">    W25Q64_ReadData</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">0x</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">000000</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, readBuffer, </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">5</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">);</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">}</span></span></code></pre></div><h3 id="硬件spi示例" tabindex="-1">硬件SPI示例 <a class="header-anchor" href="#硬件spi示例" aria-label="Permalink to &quot;硬件SPI示例&quot;">​</a></h3><div class="language-c vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">c</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">void</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> W25Q64_HardwareExample</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">void</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">)</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">{</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">    uint8_t</span><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;"> readBuffer</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">[</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">10</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">];</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">    uint8_t</span><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;"> writeBuffer</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">[</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">5</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">] </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> {</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">0x</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">01</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">0x</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">02</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">0x</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">03</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">0x</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">04</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">0x</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">05</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">};</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">    uint32_t</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> jedecID;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    </span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">    // 初始化</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">    HardSPI_Init</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">();</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">    W25Q64_HardInit</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">();</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    </span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">    // 读取JEDEC ID</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    jedecID </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> W25Q64_HardReadJEDECID</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">();</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    </span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">    // 擦除扇区</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">    W25Q64_HardSectorErase</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">0x</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">000000</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">);</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    </span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">    // 写入数据</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">    W25Q64_HardPageProgram</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">0x</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">000000</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, writeBuffer, </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">5</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">);</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    </span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">    // 读取数据</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">    W25Q64_HardReadData</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">0x</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">000000</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, readBuffer, </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">5</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">);</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">}</span></span></code></pre></div><h3 id="配置代码" tabindex="-1">配置代码 <a class="header-anchor" href="#配置代码" aria-label="Permalink to &quot;配置代码&quot;">​</a></h3><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>    // 写使能</span></span>
<span class="line"><span>void W25Q64_WriteEnable(void)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    SoftSPI_W_SS(0);</span></span>
<span class="line"><span>    SoftSPI_Transfer(W25Q64_CMD_WRITE_ENABLE);</span></span>
<span class="line"><span>    SoftSPI_W_SS(1);</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>	</span></span>
<span class="line"><span>    // 等待忙状态结束</span></span>
<span class="line"><span>void W25Q64_WaitBusy(void)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    uint8_t Status;</span></span>
<span class="line"><span>    SoftSPI_W_SS(0);</span></span>
<span class="line"><span>    SoftSPI_Transfer(W25Q64_CMD_READ_STATUS_REG1);</span></span>
<span class="line"><span>    do</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>        Status = SoftSPI_Transfer(0xFF);</span></span>
<span class="line"><span>    } while (Status &amp; 0x01);</span></span>
<span class="line"><span>    SoftSPI_W_SS(1);</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>	</span></span>
<span class="line"><span>    // 页编程</span></span>
<span class="line"><span>void W25Q64_PageProgram(uint32_t Address, uint8_t *DataArray, uint16_t Count)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    W25Q64_WriteEnable();</span></span>
<span class="line"><span>    W25Q64_WaitBusy();</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    SoftSPI_W_SS(0);</span></span>
<span class="line"><span>    SoftSPI_Transfer(W25Q64_CMD_PAGE_PROGRAM);</span></span>
<span class="line"><span>    SoftSPI_Transfer((Address &gt;&gt; 16) &amp; 0xFF);</span></span>
<span class="line"><span>    SoftSPI_Transfer((Address &gt;&gt; 8) &amp; 0xFF);</span></span>
<span class="line"><span>    SoftSPI_Transfer(Address &amp; 0xFF);</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    while (Count--)</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>        SoftSPI_Transfer(*DataArray++);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    SoftSPI_W_SS(1);</span></span>
<span class="line"><span>    W25Q64_WaitBusy();</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>	</span></span>
<span class="line"><span>    // 扇区擦除</span></span>
<span class="line"><span>void W25Q64_SectorErase(uint32_t Address)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    W25Q64_WriteEnable();</span></span>
<span class="line"><span>    W25Q64_WaitBusy();</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    SoftSPI_W_SS(0);</span></span>
<span class="line"><span>    SoftSPI_Transfer(W25Q64_CMD_SECTOR_ERASE_4KB);</span></span>
<span class="line"><span>    SoftSPI_Transfer((Address &gt;&gt; 16) &amp; 0xFF);</span></span>
<span class="line"><span>    SoftSPI_Transfer((Address &gt;&gt; 8) &amp; 0xFF);</span></span>
<span class="line"><span>    SoftSPI_Transfer(Address &amp; 0xFF);</span></span>
<span class="line"><span>    SoftSPI_W_SS(1);</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    W25Q64_WaitBusy();</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>	</span></span>
<span class="line"><span>    // 读取数据</span></span>
<span class="line"><span>void W25Q64_ReadData(uint32_t Address, uint8_t *DataArray, uint32_t Count)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    W25Q64_WaitBusy();</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    SoftSPI_W_SS(0);</span></span>
<span class="line"><span>    SoftSPI_Transfer(W25Q64_CMD_READ_DATA);</span></span>
<span class="line"><span>    SoftSPI_Transfer((Address &gt;&gt; 16) &amp; 0xFF);</span></span>
<span class="line"><span>    SoftSPI_Transfer((Address &gt;&gt; 8) &amp; 0xFF);</span></span>
<span class="line"><span>    SoftSPI_Transfer(Address &amp; 0xFF);</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    while (Count--)</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>        *DataArray++ = SoftSPI_Transfer(0xFF);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    SoftSPI_W_SS(1);</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>	</span></span>
<span class="line"><span>    // 读取JEDEC ID</span></span>
<span class="line"><span>uint32_t W25Q64_ReadJEDECID(void)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    uint32_t JEDECID = 0;</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    SoftSPI_W_SS(0);</span></span>
<span class="line"><span>    SoftSPI_Transfer(W25Q64_CMD_JEDEC_ID);</span></span>
<span class="line"><span>    JEDECID |= (uint32_t)SoftSPI_Transfer(0xFF) &lt;&lt; 16;</span></span>
<span class="line"><span>    JEDECID |= (uint32_t)SoftSPI_Transfer(0xFF) &lt;&lt; 8;</span></span>
<span class="line"><span>    JEDECID |= SoftSPI_Transfer(0xFF);</span></span>
<span class="line"><span>    SoftSPI_W_SS(1);</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    return JEDECID;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>	</span></span>
<span class="line"><span>    // 硬件SPI写使能</span></span>
<span class="line"><span>void W25Q64_HardWriteEnable(void)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    HardSPI_W_SS(0);</span></span>
<span class="line"><span>    HardSPI_Transfer(W25Q64_CMD_WRITE_ENABLE);</span></span>
<span class="line"><span>    HardSPI_W_SS(1);</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>	</span></span>
<span class="line"><span>    // 硬件SPI等待忙状态结束</span></span>
<span class="line"><span>void W25Q64_HardWaitBusy(void)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    uint8_t Status;</span></span>
<span class="line"><span>    HardSPI_W_SS(0);</span></span>
<span class="line"><span>    HardSPI_Transfer(W25Q64_CMD_READ_STATUS_REG1);</span></span>
<span class="line"><span>    do</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>        Status = HardSPI_Transfer(0xFF);</span></span>
<span class="line"><span>    } while (Status &amp; 0x01);</span></span>
<span class="line"><span>    HardSPI_W_SS(1);</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>	</span></span>
<span class="line"><span>    // 硬件SPI页编程</span></span>
<span class="line"><span>void W25Q64_HardPageProgram(uint32_t Address, uint8_t *DataArray, uint16_t Count)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    W25Q64_HardWriteEnable();</span></span>
<span class="line"><span>    W25Q64_HardWaitBusy();</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    HardSPI_W_SS(0);</span></span>
<span class="line"><span>    HardSPI_Transfer(W25Q64_CMD_PAGE_PROGRAM);</span></span>
<span class="line"><span>    HardSPI_Transfer((Address &gt;&gt; 16) &amp; 0xFF);</span></span>
<span class="line"><span>    HardSPI_Transfer((Address &gt;&gt; 8) &amp; 0xFF);</span></span>
<span class="line"><span>    HardSPI_Transfer(Address &amp; 0xFF);</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    while (Count--)</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>        HardSPI_Transfer(*DataArray++);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    HardSPI_W_SS(1);</span></span>
<span class="line"><span>    W25Q64_HardWaitBusy();</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>	</span></span>
<span class="line"><span>    // 硬件SPI扇区擦除</span></span>
<span class="line"><span>void W25Q64_HardSectorErase(uint32_t Address)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    W25Q64_HardWriteEnable();</span></span>
<span class="line"><span>    W25Q64_HardWaitBusy();</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    HardSPI_W_SS(0);</span></span>
<span class="line"><span>    HardSPI_Transfer(W25Q64_CMD_SECTOR_ERASE_4KB);</span></span>
<span class="line"><span>    HardSPI_Transfer((Address &gt;&gt; 16) &amp; 0xFF);</span></span>
<span class="line"><span>    HardSPI_Transfer((Address &gt;&gt; 8) &amp; 0xFF);</span></span>
<span class="line"><span>    HardSPI_Transfer(Address &amp; 0xFF);</span></span>
<span class="line"><span>    HardSPI_W_SS(1);</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    W25Q64_HardWaitBusy();</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>	</span></span>
<span class="line"><span>    // 硬件SPI读取数据</span></span>
<span class="line"><span>void W25Q64_HardReadData(uint32_t Address, uint8_t *DataArray, uint32_t Count)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    W25Q64_HardWaitBusy();</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    HardSPI_W_SS(0);</span></span>
<span class="line"><span>    HardSPI_Transfer(W25Q64_CMD_READ_DATA);</span></span>
<span class="line"><span>    HardSPI_Transfer((Address &gt;&gt; 16) &amp; 0xFF);</span></span>
<span class="line"><span>    HardSPI_Transfer((Address &gt;&gt; 8) &amp; 0xFF);</span></span>
<span class="line"><span>    HardSPI_Transfer(Address &amp; 0xFF);</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    while (Count--)</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>        *DataArray++ = HardSPI_Transfer(0xFF);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    HardSPI_W_SS(1);</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>	</span></span>
<span class="line"><span>    // 硬件SPI读取JEDEC ID</span></span>
<span class="line"><span>uint32_t W25Q64_HardReadJEDECID(void)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    uint32_t JEDECID = 0;</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    HardSPI_W_SS(0);</span></span>
<span class="line"><span>    HardSPI_Transfer(W25Q64_CMD_JEDEC_ID);</span></span>
<span class="line"><span>    JEDECID |= (uint32_t)HardSPI_Transfer(0xFF) &lt;&lt; 16;</span></span>
<span class="line"><span>    JEDECID |= (uint32_t)HardSPI_Transfer(0xFF) &lt;&lt; 8;</span></span>
<span class="line"><span>    JEDECID |= HardSPI_Transfer(0xFF);</span></span>
<span class="line"><span>    HardSPI_W_SS(1);</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    return JEDECID;</span></span>
<span class="line"><span>}</span></span></code></pre></div><ul><li>h文件W25Q64指令声明</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>// W25Q64指令定义</span></span>
<span class="line"><span>#define W25Q64_CMD_WRITE_ENABLE          0x06</span></span>
<span class="line"><span>#define W25Q64_CMD_WRITE_DISABLE         0x04</span></span>
<span class="line"><span>#define W25Q64_CMD_READ_STATUS_REG1      0x05</span></span>
<span class="line"><span>#define W25Q64_CMD_READ_STATUS_REG2      0x35</span></span>
<span class="line"><span>#define W25Q64_CMD_WRITE_STATUS_REG      0x01</span></span>
<span class="line"><span>#define W25Q64_CMD_PAGE_PROGRAM          0x02</span></span>
<span class="line"><span>#define W25Q64_CMD_QUAD_PAGE_PROGRAM     0x32</span></span>
<span class="line"><span>#define W25Q64_CMD_BLOCK_ERASE_64KB      0xD8</span></span>
<span class="line"><span>#define W25Q64_CMD_BLOCK_ERASE_32KB      0x52</span></span>
<span class="line"><span>#define W25Q64_CMD_SECTOR_ERASE_4KB      0x20</span></span>
<span class="line"><span>#define W25Q64_CMD_CHIP_ERASE            0xC7</span></span>
<span class="line"><span>#define W25Q64_CMD_ERASE_SUSPEND         0x75</span></span>
<span class="line"><span>#define W25Q64_CMD_ERASE_RESUME          0x7A</span></span>
<span class="line"><span>#define W25Q64_CMD_POWER_DOWN            0xB9</span></span>
<span class="line"><span>#define W25Q64_CMD_HIGH_PERFORMANCE_MODE 0xA3</span></span>
<span class="line"><span>#define W25Q64_CMD_CONTINUOUS_READ_MODE_RESET 0xFF</span></span>
<span class="line"><span>#define W25Q64_CMD_RELEASE_POWER_DOWN    0xAB</span></span>
<span class="line"><span>#define W25Q64_CMD_DEVICE_ID             0xAB</span></span>
<span class="line"><span>#define W25Q64_CMD_MANUFACTURER_DEVICE_ID 0x90</span></span>
<span class="line"><span>#define W25Q64_CMD_READ_UNIQUE_ID        0x4B</span></span>
<span class="line"><span>#define W25Q64_CMD_JEDEC_ID              0x9F</span></span>
<span class="line"><span>#define W25Q64_CMD_READ_DATA             0x03</span></span>
<span class="line"><span>#define W25Q64_CMD_FAST_READ             0x0B</span></span>
<span class="line"><span>#define W25Q64_CMD_FAST_READ_DUAL_OUTPUT 0x3B</span></span>
<span class="line"><span>#define W25Q64_CMD_FAST_READ_QUAD_OUTPUT 0x6B</span></span>
<span class="line"><span>#define W25Q64_CMD_WORD_READ             0xE8</span></span>
<span class="line"><span>#define W25Q64_CMD_DUAL_IO_READ          0xBB</span></span>
<span class="line"><span>#define W25Q64_CMD_QUAD_IO_READ          0xEB</span></span></code></pre></div>`,17)])])}const _=a(l,[["render",t]]);export{c as __pageData,_ as default};
