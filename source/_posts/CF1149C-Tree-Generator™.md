---
title: CF1149C Tree Generator™
date: 2022-09-14 14:40:02
tags:
- 数据结构
- 线段树
categories:
- 题解

toc: true
---

CF1149C Tree Generator™


<!--more-->

# 题解

## 题目大意

给定一个有$n$个点的树，这颗树的括号序列，输出它的直径，$m$个询问，每次询问表示交换两个括号，输出交换两个括号后的直径。(保证每次操作后都为一棵树)

![a9818ec6abf351ce6c6a0eaa115c2729c37577f5.png](https://s2.loli.net/2022/09/14/1hFobwzi2gQHNPv.png)

$3 \le n \le 1e5 , 1 \le q \le 1e5$。

## 解法


首先，我们需要知道括号树是怎么构建的，对于题目中所描述的括号树，我们只需要在遇到$($时向下走，遇到$)$向回走，就能构造出一个满足要求的括号树， 现在需要知道三个**引理**。

1. 对于括号序列中的任意一个连续子序列，将其中的匹配上的括号除去剩下的对应树上的一条链。
2. 树上直径长度即为任意区间去掉匹配括号后的长度的最大值。
3. 如果将$($权值设为$1$, $)$权值设为$-1$, 最长去匹配区间，也就是直径 = 相邻两个区间权值和之差的最大值。

首先对于引理1，其实就是对于匹配上的括号我们走下去后，又走了回来也就是其对链长度的贡献为$0$，引理2其实就是对应引理1中最长的一段链其实也就是直径.

引理3其实就很清楚的得出了答案， 首先根据引理1区间内已经匹配上的括号是不会对长度产生贡献的，也就是说对应的贡献区间为：

- $(((((((($
- $)))))))$
- $))))(((($

这三种，对于第一种我们可以在区间的最前面作为断点，第二种在最后面，第三种在中间来得到相邻两个区间权值和之差的最大值。

接下来就是考虑怎么维护了，其实类比最大子段和，这个也可以用线段树维护，~~(就是稍微麻烦了一点)~~。

对于区间$[l,r]$需要维护八个变量：

- $sum$为区间和
- $lmx$为从左端点开始的连续最大值
- $rmx$为从右端点开始的连续最大值
- $lmn$为从左端点开始的连续最小值
- $rmn$为从右端点开始的连续最小值
- $val1$为 $\max sum(x,y) - sum(l,x) , l \le x \le y \le r$
- $val2$为 $\max sum(y, r) - sum(x, y), l \le x \le y \le r$
- $val$为 $\max sum(y, z) - sum(x, y), l \le x \le y \le z \le r$， 也就是最终答案

单点修改+查询就可以了

 

~~~c++
#include <bits/stdc++.h>

using namespace std;

const int N = 2e5 + 10;

int n, q;

int a[N];

struct Segmentree
{
    int sum;
    int lmx, rmx;
    int lmn, rmn;
    int val1, val2, val;
    #define ls(p) (p << 1)
    #define rs(p) (p << 1 | 1)
}t[N << 2];

void push_up(int p)
{
    t[p].sum = t[ls(p)].sum + t[rs(p)].sum;
    t[p].lmx = max(t[ls(p)].lmx, t[ls(p)].sum + t[rs(p)].lmx);
    t[p].rmx = max(t[rs(p)].rmx, t[rs(p)].sum + t[ls(p)].rmx);
    t[p].lmn = min(t[ls(p)].lmn, t[ls(p)].sum + t[rs(p)].lmn);
    t[p].rmn = min(t[rs(p)].rmn, t[rs(p)].sum + t[ls(p)].rmn);
    t[p].val1 = max({t[ls(p)].val1, t[rs(p)].val1 - t[ls(p)].sum, t[rs(p)].lmx + t[ls(p)].rmx * 2 - t[ls(p)].sum});
    t[p].val2 = max({t[rs(p)].val2, t[ls(p)].val2 + t[rs(p)].sum, t[rs(p)].sum - t[rs(p)].lmn * 2 - t[ls(p)].rmn});
    t[p].val = max({t[ls(p)].val, t[rs(p)].val, t[ls(p)].val2 + t[rs(p)].lmx, t[rs(p)].val1 - t[ls(p)].rmn});
}

void build(int l, int r, int p)
{
    if(l == r)
    {
        t[p].sum = a[l];
        t[p].lmx = t[p].rmx = max(a[l], 0);
        t[p].lmn = t[p].rmn = min(a[l], 0);
        t[p].val1 = t[p].val2 = t[p].val = 1;
        return;
    }
    int mid = (l + r) >> 1;
    build(l, mid, ls(p));
    build(mid + 1, r, rs(p));
    push_up(p);
}

void change(int l, int r, int p, int x, int k)
{
    if(l == r)
    {
        t[p].sum = k;
        t[p].lmx = t[p].rmx = max(k, 0);
        t[p].lmn = t[p].rmn = min(k, 0);
        return;
    }
    int mid = (l + r) >> 1;
    if(x <= mid) change(l, mid, ls(p), x, k);
    else change(mid + 1, r, rs(p), x, k);
    push_up(p);
}

int main()
{
    scanf("%d%d", &n, &q);
    n = (n - 1) << 1;
    for(int i = 1; i <= n; i++)
    {
        char x;cin >> x;
        if(x == '(')a[i] = 1;
        if(x == ')')a[i] = -1;
    }
    build(1, n, 1);
    printf("%d\n", t[1].val);
    for(int i = 1; i <= q; i++)
    {
        int x, y;
        scanf("%d%d", &x, &y);
        swap(a[x], a[y]);
        change(1, n, 1, x, a[x]);
        change(1, n, 1, y, a[y]);
        printf("%d\n", t[1].val);
    }
    return 0;
}
~~~



  
