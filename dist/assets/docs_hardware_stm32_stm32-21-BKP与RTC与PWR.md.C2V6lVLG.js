import{_ as s,o as n,c as p,ag as l}from"./chunks/framework.Cqf6AMW8.js";const _=JSON.parse('{"title":"STM32 BKP与RTC与PWR","description":"STM32 BKP、RTC和PWR的综合配置和使用。","frontmatter":{"title":"STM32 BKP与RTC与PWR","description":"STM32 BKP、RTC和PWR的综合配置和使用。","date":"2026-04-21T00:00:00.000Z","tags":["STM32","BKP","RTC","PWR","电源管理"],"sidebar":"auto"},"headers":[],"relativePath":"docs/hardware/stm32/stm32-21-BKP与RTC与PWR.md","filePath":"docs/hardware/stm32/stm32-21-BKP与RTC与PWR.md","lastUpdated":1776715536000}'),i={name:"docs/hardware/stm32/stm32-21-BKP与RTC与PWR.md"};function e(c,a,t,r,o,d){return n(),p("div",null,[...a[0]||(a[0]=[l(`<div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>RTC初始化流程</span></span>
<span class="line"><span>    ├── 1. 开启时钟</span></span>
<span class="line"><span>    │   ├── 开启PWR时钟</span></span>
<span class="line"><span>    │   └── 开启BKP时钟</span></span>
<span class="line"><span>    ├── 2. 允许备份访问</span></span>
<span class="line"><span>    │   └── PWR_BackupAccessCmd(ENABLE)</span></span>
<span class="line"><span>    ├── 3. 检查是否首次配置</span></span>
<span class="line"><span>    │   ├── 读取BKP_DR1的值</span></span>
<span class="line"><span>    │   ├── 如果不是0xA5A5（首次配置）</span></span>
<span class="line"><span>    │   │   ├── 开启LSE时钟</span></span>
<span class="line"><span>    │   │   ├── 等待LSE就绪</span></span>
<span class="line"><span>    │   │   ├── 选择LSE作为RTC时钟源</span></span>
<span class="line"><span>    │   │   ├── 使能RTC时钟</span></span>
<span class="line"><span>    │   │   ├── 等待RTC同步</span></span>
<span class="line"><span>    │   │   ├── 设置RTC预分频器</span></span>
<span class="line"><span>    │   │   ├── 设置时间</span></span>
<span class="line"><span>    │   │   └── 写入BKP_DR1=0xA5A5</span></span>
<span class="line"><span>    │   └── 如果是0xA5A5（非首次配置）</span></span>
<span class="line"><span>    │       └── 等待RTC同步</span></span>
<span class="line"><span>    └── 4. 初始化完成</span></span></code></pre></div><h3 id="代码配置" tabindex="-1">代码配置 <a class="header-anchor" href="#代码配置" aria-label="Permalink to &quot;代码配置&quot;">​</a></h3><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>void BKP_RTC_Init(void)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    // 使能PWR和BKP时钟</span></span>
<span class="line"><span>    RCC_APB1PeriphClockCmd(RCC_APB1Periph_PWR | RCC_APB1Periph_BKP, ENABLE);</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    // 允许访问备份寄存器</span></span>
<span class="line"><span>    PWR_BackupAccessCmd(ENABLE);</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    // 检查是否第一次配置</span></span>
<span class="line"><span>    if (BKP_ReadBackupRegister(BKP_DR1) != 0x5555)</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>        // 使能外部低速晶振</span></span>
<span class="line"><span>        RCC_LSEConfig(RCC_LSE_ON);  </span></span>
<span class="line"><span>        // 等待晶振稳定</span></span>
<span class="line"><span>        while (RCC_GetFlagStatus(RCC_FLAG_LSERDY) == RESET);  </span></span>
<span class="line"><span>        // 选择LSE作为RTC时钟</span></span>
<span class="line"><span>        RCC_RTCCLKConfig(RCC_RTCCLKSource_LSE);  </span></span>
<span class="line"><span>        // 使能RTC时钟</span></span>
<span class="line"><span>        RCC_RTCCLKCmd(ENABLE);</span></span>
<span class="line"><span>        </span></span>
<span class="line"><span>        // 初始化RTC</span></span>
<span class="line"><span>        RTC_WaitForSynchro();</span></span>
<span class="line"><span>		// 32768Hz晶振，预分频后1Hz</span></span>
<span class="line"><span>        RTC_SetPrescaler(32767);  </span></span>
<span class="line"><span>        </span></span>
<span class="line"><span>        // 写入标志，表示已配置</span></span>
<span class="line"><span>        BKP_WriteBackupRegister(BKP_DR1, 0x5555);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    else</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>        // 已经配置过，等待同步</span></span>
<span class="line"><span>        RTC_WaitForSynchro();</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// 存储数据到BKP</span></span>
<span class="line"><span>void BKP_SaveData(uint16_t data)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    PWR_BackupAccessCmd(ENABLE);</span></span>
<span class="line"><span>    BKP_WriteBackupRegister(BKP_DR2, data);</span></span>
<span class="line"><span>    PWR_BackupAccessCmd(DISABLE);</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// 从BKP读取数据</span></span>
<span class="line"><span>uint16_t BKP_ReadData(void)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    return BKP_ReadBackupRegister(BKP_DR2);</span></span>
<span class="line"><span>}</span></span></code></pre></div><h3 id="bkp、pwr、rtc实战应用场景" tabindex="-1">BKP、PWR、RTC实战应用场景 <a class="header-anchor" href="#bkp、pwr、rtc实战应用场景" aria-label="Permalink to &quot;BKP、PWR、RTC实战应用场景&quot;">​</a></h3><h3 id="_1-低功耗数据采集系统" tabindex="-1">1. 低功耗数据采集系统 <a class="header-anchor" href="#_1-低功耗数据采集系统" aria-label="Permalink to &quot;1. 低功耗数据采集系统&quot;">​</a></h3><ul><li>电池供电，需要长期运行</li><li>每小时采集一次环境数据</li><li>掉电后数据不丢失</li><li>系统能够定时唤醒和休眠</li></ul><h3 id="_2-智能电表系统" tabindex="-1">2. 智能电表系统 <a class="header-anchor" href="#_2-智能电表系统" aria-label="Permalink to &quot;2. 智能电表系统&quot;">​</a></h3><ul><li>记录用电数据</li><li>定时上报数据</li><li>掉电后保持时间和数据</li><li>防篡改功能</li></ul><h3 id="_3-物联网节点" tabindex="-1">3. 物联网节点 <a class="header-anchor" href="#_3-物联网节点" aria-label="Permalink to &quot;3. 物联网节点&quot;">​</a></h3><ul><li>电池供电，低功耗运行</li><li>定期连接网络上报数据</li><li>存储网络配置和设备ID</li><li>远程唤醒功能</li></ul><h3 id="_4-便携式医疗设备" tabindex="-1">4. 便携式医疗设备 <a class="header-anchor" href="#_4-便携式医疗设备" aria-label="Permalink to &quot;4. 便携式医疗设备&quot;">​</a></h3><ul><li>电池供电，长续航</li><li>定时测量生命体征数据</li><li>存储患者信息和测量历史</li><li>紧急情况下快速唤醒</li></ul><h3 id="_5-工业控制系统" tabindex="-1">5. 工业控制系统 <a class="header-anchor" href="#_5-工业控制系统" aria-label="Permalink to &quot;5. 工业控制系统&quot;">​</a></h3><ul><li>监控设备运行状态</li><li>定时采集生产数据</li><li>掉电后保持系统配置</li><li>故障时通过闹钟唤醒系统</li></ul><h3 id="_6-智能家居设备" tabindex="-1">6. 智能家居设备 <a class="header-anchor" href="#_6-智能家居设备" aria-label="Permalink to &quot;6. 智能家居设备&quot;">​</a></h3><ul><li>低功耗待机</li><li>定时执行任务（如开关灯、调节温度）</li><li>存储用户偏好设置</li><li>远程控制和定时功能</li></ul><h3 id="_7-环境监测站" tabindex="-1">7. 环境监测站 <a class="header-anchor" href="#_7-环境监测站" aria-label="Permalink to &quot;7. 环境监测站&quot;">​</a></h3><ul><li>长期户外运行</li><li>定时采集环境数据（温度、湿度、PM2.5等）</li><li>存储历史数据和校准参数</li><li>低电量时降低采集频率</li></ul><h3 id="_8-智能农业设备" tabindex="-1">8. 智能农业设备 <a class="header-anchor" href="#_8-智能农业设备" aria-label="Permalink to &quot;8. 智能农业设备&quot;">​</a></h3><ul><li>电池或太阳能供电</li><li>定时灌溉和监测</li><li>存储土壤数据和灌溉计划</li><li>根据天气情况调整工作模式</li></ul><h3 id="_9-车辆监测系统" tabindex="-1">9. 车辆监测系统 <a class="header-anchor" href="#_9-车辆监测系统" aria-label="Permalink to &quot;9. 车辆监测系统&quot;">​</a></h3><ul><li>低功耗监控</li><li>定时采集车辆状态数据</li><li>存储故障代码和行驶数据</li><li>异常情况及时唤醒报警</li></ul><h3 id="_10-安防系统" tabindex="-1">10. 安防系统 <a class="header-anchor" href="#_10-安防系统" aria-label="Permalink to &quot;10. 安防系统&quot;">​</a></h3><ul><li>低功耗待机</li><li>定时布防和撤防</li><li>存储系统配置和报警记录</li><li>触发事件时快速唤醒响应</li></ul>`,24)])])}const u=s(i,[["render",e]]);export{_ as __pageData,u as default};
