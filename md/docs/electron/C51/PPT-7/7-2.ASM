;甲机发送程序（查询）

ORG 0000H

MAIN:
    MOV TMOD,#
    MOV TH1,#
    MOV TL1,#

    SETB TR1
    
    MOV 20H,SUBF
    JNB TI,$
    CLR TI
    END