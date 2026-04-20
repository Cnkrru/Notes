---
title: "STM32 IC PWM"
description: "STM32 输入捕获（IC）和 PWM 测量的配置和使用。"
date: 2026-04-21
tags: [STM32, IC, PWM, 输入捕获]
sidebar: auto
---

# STM32

======================================================
## IC

======================================================
### IC
- 工作原理：边沿检测，捕获CCR的值，寄存到CNT中
- 测量参数：
	1. 频率
	2. 占空比
	3. 脉冲间隔
	4. 电平持续时间
- 工作模式：
	1. PWMI：    同时测量频率和占空比
	2. 主从触发：实现硬件全自动测量
- 注意事项：OC与IC共用4个CH通道，所以不能将一个通道同时处理OC与IC
- 测量频率的方法：
	1. 测频法
		- **原理**：在闸门时间T内，对输入信号的上升沿计次，得到计数值N
		- **计算公式**： `f_x = N / T`
		- **适用场景**：适用于高频信号测量
	2. 测周法
		- **原理**：在输入信号的两个上升沿内，以标准频率 f_c 计次，得到计数值N
		- **计算公式**： `f_x = f_c / N`
		- **适用场景**：适用于低频信号测量
	3. 中界频率
		- **定义**：测频法与测周法误差相等的频率点
		- **计算公式**： `f_m = \sqrt{f_c / T}`
		- **意义**：当信号频率高于中界频率时，使用测频法误差更小；当信号频率低于中界频率时，使用测周法误差更小
- IC配置步骤
	1. 启动时钟
	2. 配置GPIO
	3. 配置时基单元
	4. 配置输入捕获单元
	5. 选择从模式触发源
	6. 选择触发后的操作
- IC配置代码:
```
	//开启RCC时钟
    RCC_APB1PeriphClockCmd(RCC_APB1Periph_TIM3, ENABLE);
	
	//GPIO-model
    RCC_APB2PeriphClockCmd(RCC_APB2Periph_GPIOA, ENABLE);

    GPIO_InitTypeDef GPIO_InitStructure;
    GPIO_InitStructure.GPIO_Mode = GPIO_Mode_AF_IPU;  // 复用推挽输出
    GPIO_InitStructure.GPIO_Pin = GPIO_Pin_6;        // TIM2_CH1
    GPIO_InitStructure.GPIO_Speed = GPIO_Speed_50MHz;
    GPIO_Init(GPIOA, &GPIO_InitStructure);		
	   
    //开启内部时钟（可以不写，因为默认开启内部时钟）
    TIM_InternalClockConfig(TIM3);
	
	//配置TIM
    TIM_TimeBaseInitTypeDef TIM_TimeBaseInitStructure;
    TIM_TimeBaseInitStructure.TIM_ClockDivision = TIM_CKD_DIV1;    //分频模式
    TIM_TimeBaseInitStructure.TIM_CounterMode = TIM_CounterMode_Up;//向上计数
    TIM_TimeBaseInitStructure.TIM_Period = 65536 - 1;              //目标值
    TIM_TimeBaseInitStructure.TIM_Prescaler = 72 - 1;              //PSC
    TIM_TimeBaseInitStructure.TIM_RepetitionCounter = 0;           //高级计数
	
	//初始化TIM
    TIM_TimeBaseInit(TIM3, &TIM_TimeBaseInitStructure);
    
    //定TIM模式
    TIM_ITConfig(TIM3, TIM_IT_Update, ENABLE);
	
	``` IC-model
    // 配置IC模块
    TIM_ICInitTypeDef TIM_ICInitStructure;
    
    TIM_ICInitStructure.TIM_Channel = TIM_Channel_1;             //配置通道
    TIM_ICInitStructure.TIM_ICFilter = 0xF;                      //滤波器参数N
    TIM_ICInitStructure.TIM_ICPolarity = TIM_ICPolarity_Rising;  //选择边沿触发
    TIM_ICInitStructure.TIM_ICPrescaler = TIM_ICPSC_DIV1;        //IC分频通道
    TIM_ICInitStructure.TIM_ICSelection = TIM_ICSelection_DirectTI;//输入捕获
    
    // 初始化IC
    TIM_ICInit(TIM3, &TIM_ICInitStructure);
    
    // 选择TIM3的输入触发源为TI1FP1
    TIM_SelectInputTrigger(TIM3, TIM_TS_T1FP1);
    
    // 选择TIM3的从模式为复位模式
    TIM_SelectSlaveMode(TIM3, TIM_SlaveMode_Reset);
	```

	//使能TIM
    TIM_Cmd(TIM3, ENABLE);
```
- IC-PWMI模式配置代码
	- 在原有通道配置下方填上这一句就行
	- 因为1/2，3/4通道分别互补，这个是ST公司封装好的函数
```
    // 初始化TIM3为PWMI模式
    // PWMI模式会自动配置通道2为相反极性（下降沿）
    TIM_PWMIConfig(TIM3, &TIM_ICInitStructure);
```