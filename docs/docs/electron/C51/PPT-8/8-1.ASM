;写6264 -> LOOP
;LOOP双指针读写，内外指针+1，传递数据
ORG 0000H
SJMP MAIN
MAIN:
    MOV R0,#20
    MOV DPTR,#0000H
    MOV R7,#16
LOOP:
    MOVX A,@R0
    MOV @DPTR,A  
    INC R0 
    INC DPTR
    DJNZ R7,LOOP
    SJMP $
    END 


