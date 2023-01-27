---
title: NaCly_Fish's Math Contest
date: 2022-10-03 07:06:39
tags:
- 题解
- NaCly_Fish's Math Contest
categories :
- 题解

toc: true
---



NaCly_Fish's Math Contest 题解

<!--more-->

# NaCly_Fish's Math Contest

## A.炼金术（Alchemy）

### 题目描述

> 铃是一个爱玩游戏的女孩子。
>
> 她在游戏中想要炼制一种稀有合金 —— 这需要$n$ 种金属来合成。
>
> 她准备好矿石后建造了 $k$个不同的熔炉，当熔炉启动时，会随机炼出这 $n$ 种金属中的一些（也可能什么都没有）。
>
> 如果把每个熔炉炼出的金属收集起来，有了全部 $n$ 种金属，就能造出合金了。澪对此很好奇，对铃说：「我考考你，有多少种情况可以炼出合金呢？」这个简单的问题铃很快就会做了，你能求出结果吗？
>
> 答案可能很大，请对 $998244353$ 取模（即除以 $998244353$ 的余数）后输出。

### 范围限制

$1 \le n , k \le 10 ^ 9$。

### 解法

首先将其看为一个$k \times n$的矩阵，让其每一列上不都为空， 求方案数， 不难得出答案为：
$$
\sum_{i = 0}^n (-1)^i (2^{n - i}) ^ k \dbinom{n}{i}
$$
使用二项式定理将其进一步化简为：
$$
\sum_{i = 0} ^ n (-1)^i(2^k)^{n - i} \dbinom{n}{i} = (2^k - 1) ^ n
$$
快速幂即可， 时间复杂度$O(\log n)$

### Code

~~~c++
#include <bits/stdc++.h>

using namespace std;

#define int long long

const int mod = 998244353;

int n, k;

int qpow(int a, int b)
{
    int t = 1;
    while(b != 0)
    {
        if(b & 1)t = t * a % mod;
        a = a * a % mod; b >>= 1;
    }
    return t  % mod;
}

signed main()
{
    scanf("%lld%lld", &n, &k);
    printf("%lld", qpow((qpow(2, k) - 1), n));
    return 0;
}
~~~

## B.生命游戏（GoL）

### 题目描述

> 有$n$个格子排成一个环，每个格子中都有一个状态为 生/死 的细胞。
>
> 如果一个格子相邻的活细胞数为$1$，那么这个格子中的细胞，在下一代会存活（如果是死亡的会复活）；否则会死亡。
>
> 给定初始状态，请你帮她们快速求出$k$ 代之后的状态。

### 范围限制

$3\le n \le 5 \times 10 ^ 5, 1 \le k < 2 ^ {62}$。

### 解法

题目背景为[Conway's Game of Life](https://baike.baidu.com/item/康威生命游戏?fromModule=search-result_lemma)，这个是问题的简易版，其实可以在[这里](https://playgameoflife.com/)玩一下。

首先题目可以转化为求$f_{i,j} = f_{i - 1,j - 1} \oplus f_{i - 1, j + 1}$，然后根据异或的结合律和数学归纳法可以得到，
$$
f_{i,j} = f_{i - 2 ^ k,j - 2 ^k} \oplus f_{i - 2 ^ k, j + 2^k}
$$
然后就可以解决了，时间复杂度$O(n\log k)$。

### Code

~~~c++
#include <bits/stdc++.h>

using namespace std;

#define int long long

const int N = 2e5 + 10;

int n, T;

int f[N], g[N];

signed main()
{
    cin >> n >> T;
    for(int i = 0; i < n; i++)
    {
        char x; cin >> x;
        f[i] = (x == '1');
    }
    for(int bit = 0; bit <= 62 && T; bit++)
    {
        if((T >> bit) & 1)
        {
            for(int i = 0; i < n; i++)
                g[i] = f[((i - (1ll << bit)) % n + n) % n] ^ f[((i + (1ll << bit)) % n + n) % n];
            memcpy(f, g, sizeof(g));
            T -= (1ll << bit);
        }
    }
    for(int i = 0; i < n; i++)
        putchar(f[i] + '0');
    return 0;
}
~~~

## C.黑暗（Darkness）

### 题目描述

> 铃在一个黑暗的三维空间内寻找澪。这个空间可以表示为 $\{ (x, y, z) | x \in [0,A], y \in [0, B], z \in [0, C]\}$。铃初始站在坐标为 $(A,B,C)$处，澪站在 $(0,0,0)$ 处。假设铃在 $(x,y,z)$ 处，她每次移动会**均匀随机**地尝试移动到 $(x-1,y,z)$ 或 $(x,y-1,z)$或 $(x,y,z-1)$。
>
> 这个空间的外围是墙壁，不可穿过。由于空间内很暗，铃并不知道自己是否走到了墙边。也就是说，她在随机选择三种方向尝试移动时，有可能撞在墙上。
>
> 铃想要知道，自己在第一次撞墙时，「到澪的曼哈顿距离（在本题中的情况就是 $x,y,z$坐标之和）」的$k$次方的期望值。
>
> 你只需要求出答案对 $998244353$取模的结果。

### 范围限制

$1 \le A, B, C \le 5 \times 10 ^ 6, 1 \le k \le 10 ^ 7$。

### 解法

