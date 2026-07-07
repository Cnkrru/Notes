;DELAY延时函数
;依靠指令时间来实现延时
ORG 0000H

DEL: 
    MOV R7,#200
DEL1:
    MOV R6,#123
DEL2:
    DJNZ R6,DEL2        ;外层循环
    DJNZ R7,DEL2        ;内层循环
    RET