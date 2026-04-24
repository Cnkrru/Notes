---
title: "2. 两数相加"

description: "力扣第2题，两数相加的解题思路和代码实现。"

date: 2026-04-25

tags: [力扣, 算法, 链表, 中等]

sidebar: auto

---

# 力扣

# 2. 两数相加

## 题目描述

给你两个非空的链表，表示两个非负的整数。它们每位数字都是按照逆序的方式存储的，并且每个节点只能存储一位数字。

请你将两个数相加，并以相同形式返回一个表示和的链表。

你可以假设除了数字 0 之外，这两个数都不会以 0 开头。

## 解题思路

1. **问题分析**：
   - 两个链表表示两个非负整数，每位数字逆序存储
   - 需要将这两个数相加，并以相同形式返回结果链表
   - 注意处理进位问题

2. **思路选择**：
   - 使用虚拟头节点（dummy node）简化链表操作
   - 遍历两个链表，同时处理进位
   - 注意链表长度不同的情况

3. **关键步骤**：
   - 创建虚拟头节点和当前节点指针
   - 初始化进位为0
   - 遍历两个链表，直到两个链表都为空且进位为0
   - 计算当前位的和，更新进位
   - 创建新节点存储当前位的结果
   - 移动指针到下一个位置

## 代码实现

```python
# Definition for singly-linked list.
# class ListNode:
#     def __init__(self, val=0, next=None):
#         self.val = val
#         self.next = next

class Solution:
    def addTwoNumbers(self, l1: ListNode, l2: ListNode) -> ListNode:
        dummy = ListNode(0)
        current = dummy
        carry = 0
        
        while l1 or l2 or carry:
            val1 = l1.val if l1 else 0
            val2 = l2.val if l2 else 0
            
            total = val1 + val2 + carry
            carry = total // 10
            current_val = total % 10
            
            current.next = ListNode(current_val)
            current = current.next
            
            if l1:
                l1 = l1.next
            if l2:
                l2 = l2.next
        
        return dummy.next
```

## 复杂度分析

- **时间复杂度**：O(max(m, n))，其中 m 和 n 分别是两个链表的长度。我们需要遍历两个链表的全部节点。
- **空间复杂度**：O(max(m, n))，新链表的长度最多为 max(m, n) + 1。

## 示例

**输入**：`l1 = [2,4,3], l2 = [5,6,4]`
**输出**：`[7,0,8]`
**解释**：342 + 465 = 807。

**输入**：`l1 = [0], l2 = [0]`
**输出**：`[0]`

**输入**：`l1 = [9,9,9,9,9,9,9], l2 = [9,9,9,9]`
**输出**：`[8,9,9,9,0,0,0,1]`

## 总结

- 使用虚拟头节点可以简化链表操作，避免处理头节点的特殊情况
- 注意处理进位问题，特别是当两个链表都遍历完但仍有进位的情况
- 这种方法适用于处理链表形式的数字相加问题