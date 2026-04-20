import{_ as s,o as a,c as t,ag as p}from"./chunks/framework.Cqf6AMW8.js";const g=JSON.parse('{"title":"STM32 MPU6050","description":"STM32 MPU6050 6轴姿态传感器的配置和使用。","frontmatter":{"title":"STM32 MPU6050","description":"STM32 MPU6050 6轴姿态传感器的配置和使用。","date":"2026-04-21T00:00:00.000Z","tags":["STM32","MPU6050","姿态传感器","I2C"],"sidebar":"auto"},"headers":[],"relativePath":"docs/hardware/stm32/stm32-14-MPU6050.md","filePath":"docs/hardware/stm32/stm32-14-MPU6050.md","lastUpdated":1776715536000}'),d={name:"docs/hardware/stm32/stm32-14-MPU6050.md"};function l(e,n,r,i,c,_){return a(),t("div",null,[...n[0]||(n[0]=[p(`<p>======================================================</p><h3 id="mpu6050简介" tabindex="-1">MPU6050简介 <a class="header-anchor" href="#mpu6050简介" aria-label="Permalink to &quot;MPU6050简介&quot;">​</a></h3><ul><li>MPU6050是一个6轴姿态传感器，可以测量芯片自身X、Y、Z轴的加速度、角速度参数，通过数据融合，可进一步得到姿态角，常应用于平衡车、飞行器等需要检测自身姿态的场景</li><li>3轴加速度计（Accelerometer）：测量X、Y、Z轴的加速度</li><li>3轴陀螺仪传感器（Gyroscope）：测量X、Y、Z轴的角速度</li></ul><h3 id="传感器轴数说明" tabindex="-1">传感器轴数说明 <a class="header-anchor" href="#传感器轴数说明" aria-label="Permalink to &quot;传感器轴数说明&quot;">​</a></h3><table tabindex="0"><thead><tr><th>轴数</th><th>组成部分</th><th>描述</th></tr></thead><tbody><tr><td>3轴</td><td>单独的加速度计或陀螺仪</td><td>测量X、Y、Z三个轴的加速度或角速度</td></tr><tr><td>6轴</td><td>加速度计(3轴) + 陀螺仪(3轴)</td><td>如MPU6050，同时测量加速度和角速度</td></tr><tr><td>9轴</td><td>加速度计(3轴) + 陀螺仪(3轴) + 磁力计(3轴)</td><td>增加磁场强度测量，提供更完整的姿态信息</td></tr><tr><td>10轴</td><td>9轴基础上增加气压计</td><td>增加海拔高度测量，适用于更复杂的导航场景</td></tr></tbody></table><h3 id="设备地址信息" tabindex="-1">设备地址信息 <a class="header-anchor" href="#设备地址信息" aria-label="Permalink to &quot;设备地址信息&quot;">​</a></h3><table tabindex="0"><thead><tr><th>配置</th><th>7位地址</th><th>写入地址</th><th>读取地址</th></tr></thead><tbody><tr><td>AD0接地</td><td>0x68</td><td>0xD0</td><td>0xD1</td></tr><tr><td>AD0接VCC</td><td>0x69</td><td>0xD2</td><td>0xD3</td></tr></tbody></table><h3 id="寄存器总表" tabindex="-1">寄存器总表 <a class="header-anchor" href="#寄存器总表" aria-label="Permalink to &quot;寄存器总表&quot;">​</a></h3><table tabindex="0"><thead><tr><th>寄存器类别</th><th>寄存器地址</th><th>寄存器名称</th><th>功能描述</th></tr></thead><tbody><tr><td><strong>电源管理</strong></td><td>0x6B</td><td>PWR_MGMT_1</td><td>电源管理1，控制设备复位、睡眠模式等</td></tr><tr><td><strong>电源管理</strong></td><td>0x6C</td><td>PWR_MGMT_2</td><td>电源管理2，控制加速度计和陀螺仪的待机模式</td></tr><tr><td><strong>配置</strong></td><td>0x1A</td><td>CONFIG</td><td>配置寄存器，控制DLPF（数字低通滤波器）</td></tr><tr><td><strong>配置</strong></td><td>0x1B</td><td>GYRO_CONFIG</td><td>陀螺仪配置，设置满量程范围</td></tr><tr><td><strong>配置</strong></td><td>0x1C</td><td>ACCEL_CONFIG</td><td>加速度计配置，设置满量程范围</td></tr><tr><td><strong>加速度计数据</strong></td><td>0x3B</td><td>ACCEL_XOUT_H</td><td>加速度计X轴数据高8位</td></tr><tr><td><strong>加速度计数据</strong></td><td>0x3C</td><td>ACCEL_XOUT_L</td><td>加速度计X轴数据低8位</td></tr><tr><td><strong>加速度计数据</strong></td><td>0x3D</td><td>ACCEL_YOUT_H</td><td>加速度计Y轴数据高8位</td></tr><tr><td><strong>加速度计数据</strong></td><td>0x3E</td><td>ACCEL_YOUT_L</td><td>加速度计Y轴数据低8位</td></tr><tr><td><strong>加速度计数据</strong></td><td>0x3F</td><td>ACCEL_ZOUT_H</td><td>加速度计Z轴数据高8位</td></tr><tr><td><strong>加速度计数据</strong></td><td>0x40</td><td>ACCEL_ZOUT_L</td><td>加速度计Z轴数据低8位</td></tr><tr><td><strong>温度传感器数据</strong></td><td>0x41</td><td>TEMP_OUT_H</td><td>温度传感器数据高8位</td></tr><tr><td><strong>温度传感器数据</strong></td><td>0x42</td><td>TEMP_OUT_L</td><td>温度传感器数据低8位</td></tr><tr><td><strong>陀螺仪数据</strong></td><td>0x43</td><td>GYRO_XOUT_H</td><td>陀螺仪X轴数据高8位</td></tr><tr><td><strong>陀螺仪数据</strong></td><td>0x44</td><td>GYRO_XOUT_L</td><td>陀螺仪X轴数据低8位</td></tr><tr><td><strong>陀螺仪数据</strong></td><td>0x45</td><td>GYRO_YOUT_H</td><td>陀螺仪Y轴数据高8位</td></tr><tr><td><strong>陀螺仪数据</strong></td><td>0x46</td><td>GYRO_YOUT_L</td><td>陀螺仪Y轴数据低8位</td></tr><tr><td><strong>陀螺仪数据</strong></td><td>0x47</td><td>GYRO_ZOUT_H</td><td>陀螺仪Z轴数据高8位</td></tr><tr><td><strong>陀螺仪数据</strong></td><td>0x48</td><td>GYRO_ZOUT_L</td><td>陀螺仪Z轴数据低8位</td></tr><tr><td><strong>中断</strong></td><td>0x38</td><td>INT_STATUS</td><td>中断状态寄存器</td></tr><tr><td><strong>中断</strong></td><td>0x37</td><td>INT_ENABLE</td><td>中断使能寄存器</td></tr><tr><td><strong>中断</strong></td><td>0x39</td><td>INT_PIN_CFG</td><td>中断引脚配置寄存器</td></tr><tr><td><strong>I2C从设备</strong></td><td>0x24-0x33</td><td>SLAVE_0-3_ADDR, SLAVE_0-3_REG, SLAVE_0-3_CTRL</td><td>I2C从设备地址、寄存器和控制寄存器</td></tr><tr><td><strong>I2C从设备</strong></td><td>0x6A</td><td>USER_CTRL</td><td>用户控制寄存器，控制I2C主模式</td></tr><tr><td><strong>I2C从设备</strong></td><td>0x34</td><td>I2C_MST_STATUS</td><td>I2C主模式状态寄存器</td></tr><tr><td><strong>其他</strong></td><td>0x75</td><td>WHO_AM_I</td><td>设备ID寄存器，默认值0x68</td></tr><tr><td><strong>其他</strong></td><td>0x1D</td><td>ACCEL_CONFIG2</td><td>加速度计配置2，控制加速度计的采样率和低通滤波器</td></tr><tr><td><strong>其他</strong></td><td>0x1E</td><td>LP_ACCEL_ODR</td><td>低功耗加速度计输出数据速率配置</td></tr><tr><td><strong>其他</strong></td><td>0x1F</td><td>WOM_THR</td><td>运动检测阈值</td></tr><tr><td><strong>其他</strong></td><td>0x69</td><td>SMPLRT_DIV</td><td>采样率分频器</td></tr></tbody></table><h3 id="寄存器配置说明" tabindex="-1">寄存器配置说明 <a class="header-anchor" href="#寄存器配置说明" aria-label="Permalink to &quot;寄存器配置说明&quot;">​</a></h3><ul><li>陀螺仪满量程范围配置 (GYRO_CONFIG, 0x1B)</li></ul><table tabindex="0"><thead><tr><th>FS_SEL位</th><th>满量程范围</th><th>灵敏度</th></tr></thead><tbody><tr><td>0</td><td>±250 °/s</td><td>131 LSB/(°/s)</td></tr><tr><td>1</td><td>±500 °/s</td><td>65.5 LSB/(°/s)</td></tr><tr><td>2</td><td>±1000 °/s</td><td>32.8 LSB/(°/s)</td></tr><tr><td>3</td><td>±2000 °/s</td><td>16.4 LSB/(°/s)</td></tr></tbody></table><ul><li>加速度计满量程范围配置 (ACCEL_CONFIG, 0x1C)</li></ul><table tabindex="0"><thead><tr><th>AFS_SEL位</th><th>满量程范围</th><th>灵敏度</th></tr></thead><tbody><tr><td>0</td><td>±2g</td><td>16384 LSB/g</td></tr><tr><td>1</td><td>±4g</td><td>8192 LSB/g</td></tr><tr><td>2</td><td>±8g</td><td>4096 LSB/g</td></tr><tr><td>3</td><td>±16g</td><td>2048 LSB/g</td></tr></tbody></table><h3 id="mpu6050配置代码" tabindex="-1">MPU6050配置代码： <a class="header-anchor" href="#mpu6050配置代码" aria-label="Permalink to &quot;MPU6050配置代码：&quot;">​</a></h3><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>	//0.宏定义一下从的地址</span></span>
<span class="line"><span>	#define MPU6050_ADDRESS    0xD0 </span></span>
<span class="line"><span>	</span></span>
<span class="line"><span>	//1.初始化</span></span>
<span class="line"><span>	就是初始化一下I2C</span></span>
<span class="line"><span>	</span></span>
<span class="line"><span>	//2.指定地址写</span></span>
<span class="line"><span>void MPU6050_WriteReg(uint8_t RegAddress, uint8_t Data)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    MyI2C_Start();</span></span>
<span class="line"><span>    MyI2C_SendByte(MPU6050_ADDRESS);</span></span>
<span class="line"><span>    MyI2C_ReceiveAck();</span></span>
<span class="line"><span>    MyI2C_SendByte(RegAddress);</span></span>
<span class="line"><span>    MyI2C_ReceiveAck();</span></span>
<span class="line"><span>    MyI2C_SendByte(Data);</span></span>
<span class="line"><span>    MyI2C_ReceiveAck();</span></span>
<span class="line"><span>    MyI2C_Stop();</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>	</span></span>
<span class="line"><span>	//3.指定地址读</span></span>
<span class="line"><span>uint8_t MPU6050_ReadReg(uint8_t RegAddress)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    uint8_t Data;</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    MyI2C_Start();</span></span>
<span class="line"><span>    MyI2C_SendByte(MPU6050_ADDRESS);</span></span>
<span class="line"><span>    MyI2C_ReceiveAck();</span></span>
<span class="line"><span>    MyI2C_SendByte(RegAddress);</span></span>
<span class="line"><span>    MyI2C_ReceiveAck();</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    MyI2C_Start();</span></span>
<span class="line"><span>    MyI2C_SendByte(MPU6050_ADDRESS | 0x01);</span></span>
<span class="line"><span>    MyI2C_ReceiveAck();</span></span>
<span class="line"><span>    Data = MyI2C_ReceiveByte(1);</span></span>
<span class="line"><span>    MyI2C_Stop();</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    return Data;</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    //4.初始化MPU6050</span></span>
<span class="line"><span>uint8_t MPU6050_Init(void)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    uint8_t WhoAmI;</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    // 初始化I2C</span></span>
<span class="line"><span>    MyI2C_Init();</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    // 读取WHO_AM_I寄存器</span></span>
<span class="line"><span>    WhoAmI = MPU6050_ReadReg(MPU6050_REG_WHO_AM_I);</span></span>
<span class="line"><span>    if (WhoAmI != 0x68)</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>        return 1;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    // 唤醒MPU6050</span></span>
<span class="line"><span>    MPU6050_WriteReg(MPU6050_REG_PWR_MGMT_1, 0x00);</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    // 设置采样率分频器</span></span>
<span class="line"><span>    MPU6050_WriteReg(MPU6050_REG_SMPLRT_DIV, 0x07);</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    // 设置配置寄存器</span></span>
<span class="line"><span>    MPU6050_WriteReg(MPU6050_REG_CONFIG, 0x00);</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    // 设置陀螺仪量程</span></span>
<span class="line"><span>    MPU6050_WriteReg(MPU6050_REG_GYRO_CONFIG, 0x00);</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    // 设置加速度计量程</span></span>
<span class="line"><span>    MPU6050_WriteReg(MPU6050_REG_ACCEL_CONFIG, 0x00);</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    return 0;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>	</span></span>
<span class="line"><span>	//5.获取加速度</span></span>
<span class="line"><span>void MPU6050_GetAccel(int16_t *AccelX, int16_t *AccelY, int16_t *AccelZ)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    uint8_t Data[6];</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    MPU6050_ReadRegs(MPU6050_REG_ACCEL_XOUT_H, Data, 6);</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    *AccelX = (Data[0] &lt;&lt; 8) | Data[1];</span></span>
<span class="line"><span>    *AccelY = (Data[2] &lt;&lt; 8) | Data[3];</span></span>
<span class="line"><span>    *AccelZ = (Data[4] &lt;&lt; 8) | Data[5];</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>	</span></span>
<span class="line"><span>	//6.获取角加速度</span></span>
<span class="line"><span>void MPU6050_GetGyro(int16_t *GyroX, int16_t *GyroY, int16_t *GyroZ)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    uint8_t Data[6];</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    MPU6050_ReadRegs(MPU6050_REG_GYRO_XOUT_H, Data, 6);</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    *GyroX = (Data[0] &lt;&lt; 8) | Data[1];</span></span>
<span class="line"><span>    *GyroY = (Data[2] &lt;&lt; 8) | Data[3];</span></span>
<span class="line"><span>    *GyroZ = (Data[4] &lt;&lt; 8) | Data[5];</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>	</span></span>
<span class="line"><span>	//7.获取温度值</span></span>
<span class="line"><span>void MPU6050_GetTemp(int16_t *Temp)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    uint8_t Data[2];</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    MPU6050_ReadRegs(MPU6050_REG_TEMP_OUT_H, Data, 2);</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    *Temp = (Data[0] &lt;&lt; 8) | Data[1];</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>	</span></span>
<span class="line"><span>	//获取所有数据</span></span>
<span class="line"><span>void MPU6050_GetAllData(int16_t *AccelX, int16_t *AccelY, int16_t *AccelZ, int16_t *GyroX, int16_t *GyroY, int16_t *GyroZ, int16_t *Temp)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    uint8_t Data[14];</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    MPU6050_ReadRegs(MPU6050_REG_ACCEL_XOUT_H, Data, 14);</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    *AccelX = (Data[0] &lt;&lt; 8) | Data[1];</span></span>
<span class="line"><span>    *AccelY = (Data[2] &lt;&lt; 8) | Data[3];</span></span>
<span class="line"><span>    *AccelZ = (Data[4] &lt;&lt; 8) | Data[5];</span></span>
<span class="line"><span>    *Temp = (Data[6] &lt;&lt; 8) | Data[7];</span></span>
<span class="line"><span>    *GyroX = (Data[8] &lt;&lt; 8) | Data[9];</span></span>
<span class="line"><span>    *GyroY = (Data[10] &lt;&lt; 8) | Data[11];</span></span>
<span class="line"><span>    *GyroZ = (Data[12] &lt;&lt; 8) | Data[13];</span></span>
<span class="line"><span>}</span></span></code></pre></div>`,16)])])}const h=s(d,[["render",l]]);export{g as __pageData,h as default};
