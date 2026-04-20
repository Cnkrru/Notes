import{_ as a,o as n,c as p,ag as l}from"./chunks/framework.Cqf6AMW8.js";const h=JSON.parse('{"title":"STM32 Flash存储","description":"STM32 Flash存储的配置和使用。","frontmatter":{"title":"STM32 Flash存储","description":"STM32 Flash存储的配置和使用。","date":"2026-04-21T00:00:00.000Z","tags":["STM32","Flash","存储"],"sidebar":"auto"},"headers":[],"relativePath":"docs/hardware/stm32/stm32-23-Flash.md","filePath":"docs/hardware/stm32/stm32-23-Flash.md","lastUpdated":1776715536000}'),e={name:"docs/hardware/stm32/stm32-23-Flash.md"};function i(t,s,c,r,d,o){return n(),p("div",null,[...s[0]||(s[0]=[l(`<h3 id="硬件规格" tabindex="-1">硬件规格 <a class="header-anchor" href="#硬件规格" aria-label="Permalink to &quot;硬件规格&quot;">​</a></h3><ul><li><strong>Flash容量</strong>：64KB（STM32F103C8T6）</li><li><strong>起始地址</strong>：0x08000000</li><li><strong>结束地址</strong>：0x08010000</li><li><strong>页大小</strong>：1KB（4096字节）</li><li><strong>页数</strong>：64页</li></ul><h3 id="内存映射" tabindex="-1">内存映射 <a class="header-anchor" href="#内存映射" aria-label="Permalink to &quot;内存映射&quot;">​</a></h3><table tabindex="0"><thead><tr><th>内存区域</th><th>地址范围</th><th>大小</th><th>用途</th></tr></thead><tbody><tr><td>Flash</td><td>0x08000000 - 0x08010000</td><td>64KB</td><td>程序存储、数据存储</td></tr><tr><td>SRAM</td><td>0x20000000 - 0x20005000</td><td>20KB</td><td>运行时数据</td></tr><tr><td>外设寄存器</td><td>0x40000000 - 0x40100000</td><td>-</td><td>外设控制寄存器</td></tr></tbody></table><h3 id="flash模块" tabindex="-1">Flash模块 <a class="header-anchor" href="#flash模块" aria-label="Permalink to &quot;Flash模块&quot;">​</a></h3><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>	//==========Flash部分==========//</span></span>
<span class="line"><span>// 读取32位字</span></span>
<span class="line"><span>uint32_t Flash_ReadWord(uint32_t Address)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    return *((__IO uint32_t *)(Address));</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// 读取16位半字</span></span>
<span class="line"><span>uint16_t Flash_ReadHalfWord(uint32_t Address)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    return *((__IO uint16_t *)(Address));</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// 读取8位字节</span></span>
<span class="line"><span>uint8_t Flash_ReadByte(uint32_t Address)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    return *((__IO uint8_t *)(Address));</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// 擦除所有页</span></span>
<span class="line"><span>void Flash_EraseAllPages(void)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    FLASH_Unlock();</span></span>
<span class="line"><span>    FLASH_EraseAllPages();</span></span>
<span class="line"><span>    FLASH_Lock();</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// 擦除指定页</span></span>
<span class="line"><span>void Flash_ErasePage(uint32_t PageAddress)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    FLASH_Unlock();</span></span>
<span class="line"><span>    FLASH_ErasePage(PageAddress);</span></span>
<span class="line"><span>    FLASH_Lock();</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// 编程32位字</span></span>
<span class="line"><span>void Flash_ProgramWord(uint32_t Address, uint32_t Data)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    FLASH_Unlock();</span></span>
<span class="line"><span>    FLASH_ProgramWord(Address, Data);</span></span>
<span class="line"><span>    FLASH_Lock();</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// 编程16位半字</span></span>
<span class="line"><span>void Flash_ProgramHalfWord(uint32_t Address, uint16_t Data)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    FLASH_Unlock();</span></span>
<span class="line"><span>    FLASH_ProgramHalfWord(Address, Data);</span></span>
<span class="line"><span>    FLASH_Lock();</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>	</span></span>
<span class="line"><span>	//==========SRAM部分==========//</span></span>
<span class="line"><span>uint16_t store_Data[STORE_COUNT];              // 定义SRAM数组</span></span>
<span class="line"><span>	</span></span>
<span class="line"><span>// 初始化存储模块</span></span>
<span class="line"><span>void flashStore_Init(void)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    // 判断是不是第一次使用</span></span>
<span class="line"><span>    if (Flash_ReadHalfWord(STORE_START_ADDRESS) != 0xA5A5)</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>        Flash_ErasePage(STORE_START_ADDRESS);</span></span>
<span class="line"><span>        Flash_ProgramHalfWord(STORE_START_ADDRESS, 0xA5A5);</span></span>
<span class="line"><span>        for (uint16_t i = 1; i &lt; STORE_COUNT; i++)</span></span>
<span class="line"><span>        {</span></span>
<span class="line"><span>            Flash_ProgramHalfWord(STORE_START_ADDRESS + i * 2, 0x0000);</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    // 上电时，将闪存数据加载回SRAM数组</span></span>
<span class="line"><span>    for (uint16_t i = 0; i &lt; STORE_COUNT; i++)</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>        store_Data[i] = Flash_ReadHalfWord(STORE_START_ADDRESS + i * 2);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// 保存数据到闪存</span></span>
<span class="line"><span>void flashStore_Save(void)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    Flash_ErasePage(STORE_START_ADDRESS);</span></span>
<span class="line"><span>    for (uint16_t i = 0; i &lt; STORE_COUNT; i++)</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>        Flash_ProgramHalfWord(STORE_START_ADDRESS + i * 2, store_Data[i]);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// 清除所有有效数据</span></span>
<span class="line"><span>void flashStore_Clear(void)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    for (uint16_t i = 1; i &lt; STORE_COUNT; i++)</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>        store_Data[i] = 0x0000;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    flashStore_Save();</span></span>
<span class="line"><span>}</span></span></code></pre></div>`,6)])])}const S=a(e,[["render",i]]);export{h as __pageData,S as default};
