;多字节加法

ORG 0000H

MAIN:
    MOV R0,#30H
    MOV R1,#40H 
    MOV R7,#16
LOOP:
    MOV A,@R1
    ADDC A,@R0
    MOV @R1,A 
    INC R1
    INC R0
    DJNZ R7,LOOP
    SJMP $
    END
