---
title: 动态DP
date: 2022-07-24 07:24:05
tags:
- 动态规划
- 动态DP(DDP)
categories :
- 学习笔记
toc: true
---

# 动态DP

## 前言

稍微写了写，不算难想，就是难写。

## 正文

### 动态DP

**动态DP**(DDP)，是用来解决一些在特定条件下待修的DP问题。

例如[P4719"动态 DP"&动态树分治](https://www.luogu.com.cn/problem/P4719)。主要还是解决这类问题，就拿这个举例子吧。

首先不难列出状态转移方程， 设$f_{0 / 1}$表示当前点选或不选的最大权值，可得
$$
\left \{
\begin{aligned}
&f_{x, 0} = f_{x, 0} + \sum \max(f_{v, 1}, f_{v, 0})\\
&f_{x, 1} = f_{x, 1} + \sum f_{v, 0} + w_x
\end{aligned}
\right.
$$
然而题目中有要求带修，每次重新跑一边DP是$O(nm)$的，我们可以用数据结构维护。

### 广义矩阵乘法

我们将矩阵乘法定义为
$$
A \times B = \sum_{i = 1}^n\sum_{j = 1}^n\sum_{k = 1}^n \max\{ A_{i, k} + B_{k, j}\}
$$
然后考虑每次的修改其实就可以看作对当前点到根节点的路径上的信息进行了修改，可以用树剖降低时间复杂度，设$g_{0 / 1}$表示当前点不考虑重儿子的影响下的答案，状态转移方程变为，
$$
\left \{
\begin{aligned}
&f_{x, 0} = g_{x, 0} + \max(f_{son, 1}, f_{son, 0})\\
&f_{x, 1} = g_{x, 1} + f_{son, 0}
\end{aligned}
\right.
$$
然后列出转移矩阵为，
$$
\begin{bmatrix}
g_{x, 0} & g_{x, 0} \\
g_{x, 1} & -\infty
\end{bmatrix}
\times 
\begin{bmatrix}
f_{son, 0} \\ 
f_{son, 1}
\end{bmatrix}
 = 

\begin{bmatrix}
f_{x,0} \\
f_{x, 1}
\end{bmatrix}
$$
线段树维护即可，每次查询查询当前节点所咋重链的答案即可。

### 实现

~~~c++
#include <bits/stdc++.h>

using namespace std;

const int N = 1e5 + 10;
const int INF = 1e9;

int n, m;

int a[N];

int cnt, head[N];

struct edge
{
    int to, nxt;
    edge(int v = 0, int x = 0) : to(v), nxt(x) {}
};

edge e[N << 1];

void add(int u, int v)
{
    e[++cnt] = edge(v, head[u]); head[u] = cnt;
    e[++cnt] = edge(u, head[v]); head[v] = cnt;
}

struct Matrix
{
    int dat[3][3];
    Matrix(){memset(dat, 0, sizeof(dat));}
    int *operator [] (int i){return dat[i];}
    friend Matrix operator * (Matrix A, Matrix B)
    {
        Matrix C;
        for(int i = 1; i <= 2; i++)
            for(int j = 1; j <= 2; j++)
                for(int k = 1; k <= 2; k++)
                    C[i][j] = max(C[i][j], A[i][k] + B[k][j]);
        return C;
    }
};

int fa[N], depth[N], siz[N], son[N], top[N];

int id[N], w[N], tot, ed[N];

void dfs1(int x, int father)
{
    fa[x] = father;
    depth[x] = depth[fa[x]] + 1;
    siz[x] = 1;
    for(int i = head[x]; i; i = e[i].nxt)
    {
        int v = e[i].to;
        if(v == fa[x])continue;
        dfs1(v, x);
        siz[x] += siz[v];
        if(siz[son[x]] < siz[v])
            son[x] = v;
    }
}

void dfs2(int x, int topfather)
{
    top[x] = topfather;
    id[x] = ++tot; w[tot] = x;
    ed[topfather] = tot;
    if(!son[x])return;
    dfs2(son[x], topfather);
    for(int i = head[x]; i; i = e[i].nxt)
    {
        int v = e[i].to;
        if(v == fa[x] || v == son[x])
            continue;
        dfs2(v, v);
    }
}

int f[N][2], g[N][2];

Matrix v[N];

void dp(int x)
{
    f[x][1] = g[x][1] = a[x];
    for(int i = head[x]; i; i = e[i].nxt)
    {
        int v = e[i].to;
        if(v == fa[x])continue;
        dp(v);
        f[x][0] += max(f[v][0], f[v][1]);
        f[x][1] += f[v][0];
        if(v == son[x])continue;
        g[x][0] += max(f[v][0], f[v][1]);
        g[x][1] += f[v][0];
    }
}

struct Segmentree
{
    Matrix val;
    #define ls(p) (p << 1)
    #define rs(p) (p << 1 | 1)
    #define mid (l + r >> 1)
};

Segmentree t[N << 2];

void push_up(int p)
{
    t[p].val = t[ls(p)].val * t[rs(p)].val;
}

void build(int l, int r, int p)
{
    if(l == r)
    {
        Matrix A; int x = w[l];
        A[1][1] = g[x][0];
        A[1][2] = g[x][0];
        A[2][1] = g[x][1];
        A[2][2] = -INF; v[x] = A;
        return void(t[p].val = A);
    }
    build(l, mid, ls(p));
    build(mid + 1, r, rs(p));
    push_up(p);
}

Matrix query(int l, int r, int p, int x, int y)
{
    if(x <= l && r <= y)return t[p].val;
    if(y <= mid)return query(l, mid, ls(p), x, y);
    if(x > mid)return query(mid + 1, r, rs(p), x, y);
    return query(l, mid, ls(p), x, y)
    * query(mid + 1, r, rs(p), x, y);
}

void modify(int l, int r, int p, int x)
{
    if(l > x || r < x)return;
    if(l == r)
        return void(t[p].val = v[w[x]]);
    modify(l, mid, ls(p), x);
    modify(mid + 1, r, rs(p), x);
    push_up(p);
}

void update(int x, int val)
{
    v[x][2][1] += val - a[x]; a[x] = val;
    while(x != 0)
    {
        Matrix B = query(1, n, 1, id[top[x]], ed[top[x]]);
        modify(1, n, 1, id[x]);
        Matrix A = query(1, n, 1, id[top[x]], ed[top[x]]);
        x = fa[top[x]];
        v[x][1][1] += max(A[1][1], A[2][1]) - max(B[1][1], B[2][1]);
        v[x][1][2] = v[x][1][1];
        v[x][2][1] += A[1][1] - B[1][1];
    }
}

int main()
{
    scanf("%d%d", &n, &m);
    for(int i = 1; i <= n; i++)
        scanf("%d", &a[i]);
    for(int i = 1; i < n; i++)
    {
        int x, y;
        scanf("%d%d", &x, &y);
        add(x, y);
    }
    dfs1(1, 0); dfs2(1, 1);
    dp(1); build(1, n, 1);
    for(int i = 1; i <= m; i++)
    {
        int x, y;
        scanf("%d%d", &x, &y);
        update(x, y);
        Matrix ans = query(1, n, 1, 1, ed[1]);
        printf("%d\n", max(ans[1][1], ans[2][1]));
    }
    return 0;
}
~~~

### 应用

[P5024 保卫王国 ](https://www.luogu.com.cn/problem/P5024)

直接列出转移方程为，
$$
\left \{
\begin{aligned}
&f_{x, 0} = f_{x, 0} + \sum f_{x , 1} \\
&f_{x, 1} = f_{x, 1} + \sum \min(f_{x, 0}, f_{x, 1}) + c_x
\end{aligned}
\right.
$$
考虑题目中的强制选其实就是在对应值上加上$-\infty$，强制选就是加上$\infty$，然后设$g_{0/1}$列出方程为
$$
\left \{
\begin{aligned}
&f_{x, 0} = g_{x, 0} + f_{son , 1} \\
&f_{x, 1} = f_{x, 1} + \min(f_{son, 0}, f_{son, 1}) + c_x
\end{aligned}
\right.
$$
