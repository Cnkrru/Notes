;流水灯

ORG 0000H

;初始化
MAIN:
    MOV A,#0FEH
;环移点灯    
LOOP:
    MOV P1,A
    LCALL DEL
    RL A 
    SJMP LOOP   

;延时函数
DEL:
    MOV R7,#200
DEL1:
    MOV R6,#123
DEL2:
    DJNZ R6,DEL2
    DJNZ R7,DEL1
    RET 
    END