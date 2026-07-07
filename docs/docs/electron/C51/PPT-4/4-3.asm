;分段函数（3段），if-else分支
;x初始在30H，Y放在40H
ORG 0000H
MAIN:
    MOV A,30H
    JZ ZERO             ;else分支- =0
    JNB Acc.7,ZHENG     ;else分支- >0

    ADD A,#5
    MOV 40H,A
    SJMP RETURN
;0分支
ZERO:
    MOV 40H,#20H
    SJMP RETURN
;正数分支
ZHENG:
    MOV 40H,A 
    SJMP RETURN         ;这句可忽略，因为会顺序执行
;return函数
RETURN:
    SJMP $
    END
