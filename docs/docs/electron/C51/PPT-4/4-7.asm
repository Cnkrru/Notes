;多数求最大值
ORG 0000H
MAIN:
    MOV R0,30H 
    MOV R7,#16
    MOV 40H,@R0
LOOP:
    MOV A,R0
    CJNE A,40H,NEXT         ;相减跳转判断 
NEXT:
    JC NCH                  ;标志位=0，A>40H，跳转，指针+1，判断下一个数
    MOV 40H,A               ;标志位=1，A<40H,换位
NCH:
    INC R0
    DJNZ R7,LOOP
    SJMP $
    END