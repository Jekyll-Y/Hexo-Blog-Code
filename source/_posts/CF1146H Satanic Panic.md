---
title: CF1146H Satanic Panic
date: 2022-08-24 20:11:21
tags:
- 计算几何
- 动态规划
categories:
- 题解

toc: true
---


CF1146H Satanic Panic

<!-- more -->

# 题解



## 题意

给定平面内的$n$个点($n \le 300$)，求有多少种方案可以构成一个五角星。

![image-20220824205205207.png](https://s2.loli.net/2022/08/24/slDvH4npCkStwLu.png)

## 解法

首先其实找五角星就是在找一个由五个顶点构成的凸包，设$f[i][j][k]$表示为从$i$到$j$经过了$k$个点的不同方案数。

其实五个点的凸包就是五条斜率具有单调性的线段组合而成的图形，我们可以先将所有的线段按照极角序进行排序，这样就可以得到一个状态转移方程：
$$
f[i][x][j+1] = \sum f[i][y][j]
$$
其中$x$和$y$表示一条线段的左右端点，因为排序后极角序是具有单调性的，所以上述方程的转移是成立的。

初始化所有的$f[i][i][1] = 1$，最后统计一下答案$\sum f[i][i][6]$即可。

时间复杂度$O(n^3)$。不过CF评测机显然能在4s内跑过1e8。

 

~~~c++
#include <bits/stdc++.h>
#define ll long long
using namespace std;

const int N = 310;

struct Point{
    double x, y;
    Point(double _x = 0, double _y = 0):x(_x), y(_y) {}
    friend Point operator + (Point a, Point b){return Point(a.x+b.x, a.y+b.y);}
    friend Point operator - (Point a, Point b){return Point(a.x-b.x, a.y-b.y);}
    friend Point operator * (Point a, double b){return Point(a.x*b, a.y*b);}
    friend Point operator / (Point a, double b){return Point(a.x/b, a.y/b);}
}origin;

Point p[N];

struct Segment{
    int a, b; Point v;double An;
    Segment(int _a = 0, int _b = 0): a(_a), b(_b) {v = p[b]-p[a]; An = atan2(v.y, v.x);}
    friend bool operator < (Segment x, Segment y){return x.An < y.An;}
}s[N * N];

int n, cnt;

ll f[N][N][7];

int main()
{
    scanf("%d", &n);
    for(int i = 1; i <= n; i++)
    {
        double x, y;
        scanf("%lf%lf", &x, &y);
        p[i] = Point(x, y);
    }
    for(int i = 1; i <= n; i++)
    {
        for(int j = 1; j <= n; j++)
        {
            if(i == j)continue;
            s[++cnt] = Segment(i, j);
        }
    }
    sort(s+1, s+cnt+1);
    for(int i = 1; i <= n; i++)
        f[i][i][1] = 1;
    for(int k = 1; k <= cnt; k++)
    {
        int x = s[k].a;
        int y = s[k].b;
        for(int i = 1; i <= n; i++)
            for(int j = 1; j <= 5; j++)
                f[i][y][j+1] += f[i][x][j];
    }
    ll ans = 0;
    for(int i = 1; i <= n; i++)
        ans += f[i][i][6];
    printf("%lld", ans);
    return 0;
}
~~~

  
