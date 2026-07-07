;指针随A变化产生波形
;溢出自动重新开始
ORG 0000H
MAIN:
    MOV DPTR,#0000H
    MOV A,#00H 
LOOP:
    MOVX @DPTR,A 
    INC A 
    SJMP LOOP
    END