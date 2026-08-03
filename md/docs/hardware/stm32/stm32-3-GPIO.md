---
title: "STM32 GPIO"

description: "STM32 GPIO的使用方法，包括输入模式、输出模式、GPIO读取和配置步骤。"

date: "2026-04-21"

tags: [STM32, GPIO]

sidebar: auto

---


# STM32

---
## STM32 GPIO

## 1. GPIO端口

- **GPIOA**：PA0-PA15（部分复用）
- **GPIOB**：PB0-PB15（部分复用）
- **GPIOC**：PC13-PC15
- **其余GPIOx**：未设置引脚

### 注释
- **注释1**：对于F1系列，GPIOx全部挂载在APB2总线上
- **注释2**：I/O口中写有“FT”表示这个GPIO容忍5V电压

---

## 2. 输入模式

### 2.1 上拉输入
- **特点**：高电位输入，内置电阻，使得输入电位为3.3V
- **使用场景**：按钮

### 2.2 下拉输入
- **特点**：低电位输入，内置电阻，使得输入电位为0V
- **使用场景**：低电位输入传感器

### 2.3 浮空输入
- **特点**：自定义电位输入，外接电阻，需要多少电位自己算
- **使用场景**：外部有自己搓的电路给它配置电阻

### 2.4 模拟输入
- **特点**：ADC模拟转换，将模拟信号转换为电信号
- **使用场景**：ADC

---

## 3. 输出模式

### 3.1 推挽输出
- **特点**：N-MOS/P-MOS管均可导通
  - N-MOS：输出1——输出高电平
  - P-MOS：输出0——输出低电平
  - 该模式对高低电平都有驱动能力

### 3.2 开漏输出
- **特点**：N-MOS可导通
- **使用场景**：
  - 通信协议
  - 外接电阻实现5V输出

### 3.3 复用推挽/开漏输出
- **特点**：复用是映射时才用得上

---

## 4. GPIO读取

### 4.1 读取函数
- **readinput（GPIOx, PIN)**：读取输入状态
- **readoutput（GPIOx, PIN)**：读取输出状态

---

## 5. GPIO配置步骤

### 5.1 使能GPIO时钟
```c
RCC_APB2PeriphClockCmd(RCC_APB2Periph_GPIOx, ENABLE);
```

### 5.2 配置GPIO参数
```c
GPIO_InitTypeDef GPIO_InitStructure;
GPIO_InitStructure.GPIO_Pin = GPIO_Pin_x;
GPIO_InitStructure.GPIO_Mode = GPIO_Mode_XXX;
GPIO_InitStructure.GPIO_Speed = GPIO_Speed_50MHz;
GPIO_Init(GPIOx, &GPIO_InitStructure);
```

### 5.3 读取GPIO状态
```c
GPIO_ReadInputDataBit(GPIOx, GPIO_Pin_x);
```

### 5.4 设置GPIO输出状态
```c
GPIO_SetBits(GPIOx, GPIO_Pin_x);    // 输出高电平
GPIO_ResetBits(GPIOx, GPIO_Pin_x);  // 输出低电平
GPIO_WriteBit(GPIOx, GPIO_Pin_x, BitAction);  // 写入指定状态
```
	