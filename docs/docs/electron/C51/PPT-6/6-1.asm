;标准方波10ms，中断生成（中断方式）
;查询方式不用管，只有串口需要
;采用模式1，无自动状填，所以在中断函数里需要再次装填
ORG 0000H
SJMP MAIN
ORG 0013H
SJMP INT
ORG 0030H 

MAIN:
    MOV TMOD,#01H       ;设置工作模式
    MOV TH0,#0ECH       ;提供初始值
    MOV TL0,#78H

    ;初始化
    SETB EA
    SETB ET0
    SETB TR0

    SJMP $

INT:
    ;反转电平
    CPL P1.0
    MOV TH0,#0ECH
    MOV TL0,#78H
    RETI

