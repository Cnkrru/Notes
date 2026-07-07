;甲机发送程序（中断方式）（不重要，着重记住查询方式）
;配置号，把数据放到缓冲区，然后中断程序固定
ORG 0000H
SJMP MAIN
ORG 001BH
SJMP INT
ORG 0030H

MAIN:
    MOV TMOD,#20H
    MOV TH1,#F4H
    MOV TL1,#F4H

    MOV PCON,#00H 
    MOV SCON,#40H 

    SETB EA
    SETB ES 
    SETB TR1

    MOV 20H,SUBF
    SJMP $

INT:
    CLR TI 
    CLR EA
    CLR ES

    RETI 
    END

