;LOOP循环;双指针实现内外访问
;LOOP循环，DJNZ R7，LOOP，要放在最后
ORG 0000H
;状态管理
MAIN:
    MOV R7,#32
    MOV R0,#30H
    MOV DPTR,#3000H
;LOOP循环
LOOP:
    MOV A,@R0           ;将当前指针的数据拿出来
    MOVX @DPTR,A        ;将内指针地址传给外指针地址
    INC DPTR            ;外指针+1
    INC R0              ;内指针+1
    DJNZ R7,LOOP        