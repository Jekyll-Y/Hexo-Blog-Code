---

title: CF280C Game on Tree

date: 2022-11-2 20:31:16

tags:

- 数学期望

categories:

- 题解

toc: true

---



CF280C Game on Tree



<!--more-->

# 题解

## 题意

给定一棵有根树，结点编号从 $1$ 到 $n$。根结点为 $1$ 号结点。

对于每一次操作，等概率的选择一个**尚未被删去**的结点并将它及其子树全部删去。当所有结点被删除之后，游戏结束；也就是说，删除$1$ 号结点后游戏即结束。

要求求出删除所有结点的期望操作次数。

$n \le 10 ^ 5$

## 解法

如果设$f_i$表示每个点的权值，权值的范围显然只有$0$和$1$， 答案其实就是求$E(\sum f_i)$，根据期望的线性性，可以得出$E(\sum f_i) = \sum E(f_i)$， 考虑每个点的期望其实就是这个点被选中的概率，如果这个点被选到，显然一定是在其祖先选到之前，每个节点有$depth_i - 1$个祖先，答案就是$\sum_{i = 1} ^ n \frac{1}{depth_i}$。

~~~c++
#include <bits/stdc++.h>

using namespace std;

const int N = 1e5 + 10;

int n;

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

int depth[N];

void dfs(int x, int fa)
{
    depth[x] = depth[fa] + 1;
    for(int i = head[x]; i; i = e[i].nxt)
    {
        int v = e[i].to;
        if(v == fa)continue;
        dfs(v, x);
    }
}

int main()
{
    scanf("%d", &n);
    for(int i = 1; i < n; i++)
    {
        int x, y;
        scanf("%d%d", &x, &y);
        add(x, y);
    }
    dfs(1, 0);
    double ans = 0;
    for(int i = 1; i <= n; i++)
        ans += 1.0 / depth[i];
    printf("%.6lf", ans);
    return 0;
}
~~~

