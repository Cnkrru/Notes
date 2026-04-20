---
title: "STM32 ADC数模转换"
description: "STM32 ADC数模转换的配置和使用。"
date: 2026-04-21
tags: [STM32, ADC, 数模转换]
sidebar: auto
---

# STM32 ADC数模转换

## 1. 基本信息

### 1.1 工作原理
- **将引脚的电压映射到一个从0开始的数据区间里**

### 1.2 工作范围
- **0V~3.3V** —— **0~4095**

### 1.3 模块资源
- **ADC1, ADC2**
- **10个外部输入通道**
  1. **规则组**：16通道，1个占位资源
  2. **注入组**：4通道，4个占位资源

======================================================

## 2. 工作模式

### 2.1 转换模式
- **单次转换**：一次只转换一个数据
- **连续转换**：一次转换组中所有数据

### 2.2 扫描模式
- **扫描模式**：转换一次停止
- **非扫描模式**：不间断持续循环
- **间断模式**：扫描模式情况下，间隔几个转换一次

### 2.3 模式组合
- **注释**：1/2相互组合可以搭配4种模式

======================================================

## 3. 注意事项

### 3.1 数据对齐方式
- **STM32的ADC为12位，但寄存器是16位**，所以数据存在两种对齐方式：
  - **右对齐**：一般选择右对齐，因为这样可以直接读取出准确数据
  - **左对齐**：左对齐导致数据与实际相差16倍（2进制的原因），可以左对齐放弃后四个数据，将该ADC看作8位ADC

### 3.2 转换时间计算
- **总转换时间公式**：STM32 ADC的总转换时间由两部分组成：
  - `T_CONV = 采样时间 + 12.5个ADC周期`

### 3.3 ADC校准
- **不需要管，代码处理**

======================================================

## 4. 配置步骤

1. **开启RCC时钟/分频器**
2. **配置GPIO**
3. **配置多路开关**：把开关配置到组（规则组/注入组）里
4. **配置ADC转换器**
5. **使能ADC**
6. **ADC校准**

======================================================

## 5. 配置代码示例

### 5.1 单ADC配置
```c
//启动GPIO和ADC的RCC时钟
RCC_APB2PeriphClockCmd(RCC_APB2Periph_ADC1, ENABLE);
RCC_APB2PeriphClockCmd(RCC_APB2Periph_GPIOA, ENABLE);

//对ADC分频，频率不能超过14MHz
RCC_ADCCLKConfig(RCC_PCLK2_Div6);

//GPIO配置
GPIO_InitTypeDef GPIO_InitStructure;
GPIO_InitStructure.GPIO_Mode = GPIO_Mode_AIN;        //模拟输入模式
GPIO_InitStructure.GPIO_Pin = GPIO_Pin_0;
GPIO_InitStructure.GPIO_Speed = GPIO_Speed_50MHz;
GPIO_Init(GPIOA, &GPIO_InitStructure);

/*通道选择
*选择ADC
*选择通道
*选择组内序列位置
*选择转换时间
*/
ADC_RegularChannelConfig(ADC1, ADC_Channel_0, 1, ADC_SampleTime_55Cycles5);

/*ADC配置
*选择独立模式
*选择数据右对齐
*无外部触发
*单次转换
*非扫描模式
*通道个数为1
*/
ADC_InitTypeDef ADC_InitStructure;
ADC_InitStructure.ADC_Mode = ADC_Mode_Independent;
ADC_InitStructure.ADC_DataAlign = ADC_DataAlign_Right;
ADC_InitStructure.ADC_ExternalTrigConv = ADC_ExternalTrigConv_None;
ADC_InitStructure.ADC_ContinuousConvMode = DISABLE;
ADC_InitStructure.ADC_ScanConvMode = DISABLE;
ADC_InitStructure.ADC_NbrOfChannel = 1;
ADC_Init(ADC1, &ADC_InitStructure);

//使能ADC
ADC_Cmd(ADC1, ENABLE);

/*ADC校准流程
*重置校准寄存器
*等待重置完成
*开始校准
*等待校准完成
*/
ADC_ResetCalibration(ADC1);
while (ADC_GetResetCalibrationStatus(ADC1) == SET);
ADC_StartCalibration(ADC1);
while (ADC_GetCalibrationStatus(ADC1) == SET);
```

### 5.2 读取ADC值
```c
//启动转换
ADC_SoftwareStartConvCmd(ADC1, ENABLE);

//等待转换完成
while (ADC_GetFlagStatus(ADC1, ADC_FLAG_EOC) == RESET);

//读取ADC值
uint16_t adc_value = ADC_GetConversionValue(ADC1);
```