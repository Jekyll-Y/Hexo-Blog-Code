---
title:  ARC做题记录
date: 2022-10-13 15:56:00
tags: 
- AtCoder Regular Contest
- Record
toc: true
categories : 
- 做题记录

sticky: 1

---

Solve ARC Problems Record

<!--more-->

# ARC做题记录

## ARC058

### C.Iroha's Obsession

**Difficulty**: $\color{green} 1147$

分情况讨论即可，首先确定构造的数的第一位， 有三种情况，能填的数分别可以大于第一位， 等于第一位， 小于第一位，贪心考虑即可。

时间复杂度$O(n)$。

~~~c++
#include <bits/stdc++.h>

using namespace std;

const int N = 1e4 + 10;
const int M = 12;

int n, m;

int d[M];

bool vis[M];

int num[N], len;

void solve(int type)
{
    if(type == 0)
    {
        int fir = 0;
        for(int i = 1; i <= m; i++)
        {
            if(d[i] >= num[len])
            {
                fir = d[i];
                break;
            }
        }
        if(fir > num[len])
            cout << fir, solve(1);
        else solve(2);
    }
    else if(type == 1)
    {
        for(int i = len - 1; i >= 1; i--)
            cout << d[1];
    }
    else if(type == 2)
    {
        int fir = 0;
        for(int i = 1; i <= m; i++)
        {
            if(d[i] == num[len])
            {
                fir = d[i];
                break;
            }
        }
        int res = true; vector <int> v;
        for(int i = len - 1; i >= 1; i--)
        {
            int x = -1;
            for(int j = 1; j <= m; j++)
            {
                if(d[j] >= num[i])
                {
                    x = d[j];
                    break;
                }
            }
            if(x == -1)res = false;
            v.push_back(x);
        }
        if(res && fir != 0)
        {
            cout << fir;
            for(auto x : v)
                cout << x;
        }
        else solve(3);
    }
    else if(type == 3)
    {
        if(d[1] == 0)cout << d[2];
        else cout << d[1];
        for(int i = len; i >= 1; i--)
            cout << d[1];
    }
}

int main()
{
    scanf("%d%d", &n, &m);
    for(int i = 1; i <= m; i++)
    {
        int x;
        scanf("%d", &x);
        vis[x] = true;
    }
    m = 0;
    for(int i = 0; i < 10; i++)
        if(!vis[i])d[++m] = i;
    if(n == 0)num[++len] = 0;
    while(n != 0)num[++len] = n % 10, n /= 10;
    solve(0);
    return 0;
}
~~~

### D.Iroha and a Grid

**Difficulty**:$\color{blue} 1905$

首先没有限制的方案数显然是$\dbinom{n - 1}{n + m - 2}$, 再考虑上限制，其实就是出现了一个分界线，我们可以强制其走到分界线上方，不走有限制的格子， 再让其走到右下角， 求方案数， 答案即为：

$$

\sum_{ i = 1} ^ {m - b} \dbinom{b + i - 1}{n - a + b + i - 2} \times \dbinom{a - 1}{a + m - b - i + 1 - 2}

$$

时间复杂度$O(n)$。

~~~c++
#include <bits/stdc++.h>

using namespace std;

#define int long long

const int mod = 1e9 + 7;
const int N = 1e5 + 10;

int n, m, a, b;

int fac[N << 1], ifac[N << 1];

int qpow(int a, int b)
{
    int t = 1;
    while(b != 0)
    {
        if(b & 1)t = t * a % mod;
        a = a * a % mod; b >>= 1;
    }
    return t;
}

int C(int n, int m)
{
    if(n < m)return 0;
    return fac[n] % mod * ifac[m] % mod * ifac[n - m] % mod;
}

signed main()
{
    scanf("%lld%lld%lld%lld", &n, &m, &a, &b);
    fac[0] = ifac[0] = 1;
    for(int i = 1; i <= n + m; i++)
        fac[i] = fac[i - 1] * i % mod;
    for(int i = 1; i <= n + m; i++)
        ifac[i] = qpow(fac[i], mod - 2);
    int ans = 0;
    for(int i = 1; i <= m - b; i++)
        (ans += C(n - a + b + i - 2, b + i - 1) % mod * C(a + m - b - i - 1, a - 1) % mod) %= mod;
    printf("%lld", ans);
    return 0;
}
~~~

### E.Iroha and Haiku

**Difficulty**: $\color{orange} 2473$

首先我们可以将每个数分解，然后组合构造方案，但是会产生重复，而且很难计算，不妨换一个思路考虑总方案数-不合法的方案数， 接下来考虑如何计算不合法的方案数。

感觉是一道非常好的状压dp, 状压方式也很特殊，首先根据数据限制可以判断$x + y + z \le 17$， 可以压成一个$17$位的二进制数，将一个数$k$压成$1 << k - 1$， 比如将$4$，压成$1000$，表示**末尾的数**，当加入一个数$3$时，其为$1000100$，同时也可以表示出其能表示出的数$7$，再举一个例子，比如$10000100010$可以表示$11,6,2,4,5,9$，其实就是表示的一段连续区间的和，那么当状态的子集中有$(1 << x - 1) | (1 << x + y - 1) | (1 << x + y + z - 1)$时，显然就满足要求，每次只考虑压的$x + y + z$即可，注意防止越位，时间复杂度$O(n 2 ^ {x + y + z})$。

~~~c++
#include <bits/stdc++.h>

using namespace std;

#define int long long

const int N = 45;
const int M = 17;
const int mod = 1e9 + 7;

int n, X, Y, Z;

int f[N][1 << M];

int ans;

int qpow(int a, int b)
{
    int t = 1;
    while(b != 0)
    {
        if(b & 1)t = t * a % mod;
        a = a * a % mod; b >>= 1;
    }
    return t;
}

signed main()
{
    scanf("%lld%lld%lld%lld", &n, &X, &Y, &Z);
    int S = (1 << X + Y + Z) - 1;
    int T = (1 << X - 1) | (1 << X + Y - 1) | (1 << X + Y + Z - 1);
    f[0][0] = 1;
    for(int i = 1; i <= n; i++)
    {
        for(int j = 0; j <= S; j++)
        {
            for(int k = 1; k <= 10; k++)
            {
                int s = ((j << k) | (1 << k - 1)) & S;
                if((T & s) == T)continue;
                f[i][s] = (f[i][s] + f[i - 1][j]) % mod;
            }
        }
    }
    ans = qpow(10, n);
    for(int i = 0; i <= S; i++)
        ans = (ans - f[n][i] + mod) % mod;
    printf("%lld", ans);
    return 0;
}

~~~

### F.Iroha Loves Strings

**Difficulty**: $\color{red} 3678$

就会写一个$O(nm^2)$的，不太会Z函数。

~~~c++
#include <bits/stdc++.h>

using namespace std;

const int N = 2100;
const int K = 1e4 + 10;

int n, k;

string s[N];

string f[2][K];

int main()
{
    cin >> n >> k;
    for(int i = 1; i <= n; i++)
        cin >> s[i];
    string str = "";
    for(int i = 1; i <= k; i++)
        str = str + "|";
    for(int i = 1; i <= k; i++)
        f[0][i] = str;
    f[0][0] = "";
    for(int i = 1; i <= n; i++)
    {
        int len = s[i].size();
        for(int j = 0; j <= k; j++)
            f[i & 1][j] = f[!(i & 1)][j];
        for(int j = len; j <= k ; j++)
        {
            if(f[!(i & 1)][j - len] + s[i] < f[i & 1][j])
                f[i & 1][j] = f[!(i & 1)][j - len] + s[i];
        }
    }
    cout << f[n & 1][k];
    return 0;
}
~~~

## ARC059

### C.Being Together

**Difficulty**: $\color{brown} 712$

直接枚举即可，时间复杂度$O(n^2)$

~~~c++
#include <bits/stdc++.h>

using namespace std;

const int N = 110;

int n;

int a[N];

int cost(int x, int y)
{
    return (x - y) * (x - y);
}

int main()
{
    scanf("%d", &n);
    for(int i = 1; i <= n; i++)
        scanf("%d", &a[i]);
    int ans = 1e9;
    for(int i = -100; i <= 100; i++)
    {
        int sum = 0;
        for(int j = 1; j <= n; j++)
            sum += cost(a[j], i);
        ans = min(ans, sum);
    }
    printf("%d", ans);
    return 0;
}
~~~

### D.Unbalanced

**Difficulty** : $\color{cyan} 1374$

其实手玩一下就可以发现出现相邻的相同的或间隔一个相同的就会满足要求，时间复杂度$O(n)$

~~~c++
#include <bits/stdc++.h>

using namespace std;

const int N = 1e5 + 10;

char s[N];

int n;

int main()
{
    scanf("%s", s + 1);
    n = strlen(s + 1);
    bool res = true;
    for(int i = 2; i <= n; i++)
    {
        if(s[i] == s[i - 1])
        {
            res = false;
            printf("%d %d", i - 1, i);
            break;
        }
    }
    if(res)
    {
        for(int i = 3; i <= n; i++)
        {
            if(s[i] == s[i - 2])
            {
                res = false;
                printf("%d %d", i - 2, i);
                break;
            }
        }
    }
    if(res)printf("-1 -1");
    return 0;
}
~~~

### E.Children and Candies

**Difficulty**: $\color{yellow}2189$

~~一开始被一坨sigma搞不会了~~, 其实就是个dp, 设$f_{i, j}$表示前$i$个人， 分到了$j$个糖果的答案，可以得到转移
$$

f_{i, j} = \sum_{k = 0} ^ j \bigg ( f_{i - 1, j - k} \times \sum_{x = a_i} ^ {b_i} x ^ k  \bigg)

$$

表示当前选了$k$个，然后其对答案的贡献。

时间复杂度$O(n^3)$

~~~c++
#include <bits/stdc++.h>

using namespace std;

#define int long long

const int mod = 1e9 + 7;
const int N = 410;

int n, m;

int a[N], b[N];

int f[N][N];

int qpow(int a, int b)
{
    int t = 1;
    while(b != 0)
    {
        if(b & 1)t = t * a % mod;
        a = a * a % mod; b >>= 1;
    }
    return t;
}

int sum[N][N];

signed main()
{
    scanf("%lld%lld", &n, &m);
    for(int i = 1; i <= n; i++)
        scanf("%lld", &a[i]);
    for(int i = 1; i <= n; i++)
        scanf("%lld", &b[i]);
    for(int i = 1; i <= n; i++)
        for(int k = 0; k <= m; k++)
            for(int j = a[i]; j <= b[i]; j++)
                sum[i][k] = (sum[i][k] + qpow(j, k)) % mod;
    f[0][0] = 1;
    for(int i = 1; i <= n; i++)
        for(int j = 0; j <= m; j++)
            for(int k = 0; k <= j; k++)
                f[i][j] = (f[i][j] + f[i - 1][j - k] * sum[i][k] % mod) % mod;
    printf("%lld", f[n][m]);
    return 0;
}
~~~

### F.Unhappy Hacking

**Difficulty**: $\color{orange} 2427$

其实挺简单的，一开始想麻烦了，设$f_{i, j}$表示当前使用了$i$次操作，匹配到了$j$个字符，对于转移可以分为两种，首先是选填$0, 1$，
$$
f_{i, j} = f_{i, j} + f_{i - 1, j - 1}
$$

如果选择删除操作， 其实就可以从上次操作的$j + 1$个位置转移过来，由于不限制$0, 1$， 要乘以$2$

$$
f_{i, j} = f_{i, j} + 2 \times f_{i - 1, j + 1}
$$

注意为空时可以使用删除操作。

时间复杂度$O(n ^ 2)$

~~~c++
#include <bits/stdc++.h>

using namespace std;

#define int long long

const int N = 5100;
const int mod = 1e9 + 7;

int n;

char s[N];

int f[N][N];

signed main()
{
    scanf("%lld%s", &n, s + 1);
    int m = strlen(s + 1);
    f[0][0] = 1;
    for(int i = 1; i <= n; i++)
    {
        for(int j = 0; j <= i; j++)
        {
            if(j > 0)f[i][j] = (f[i][j] + f[i - 1][j - 1]) % mod;
            else f[i][j] = (f[i][j] + f[i - 1][0]) % mod;
            f[i][j] = (f[i][j] + 2 * f[i - 1][j + 1]) % mod;
        }
    }
    printf("%lld", f[n][m]);
    return 0;
}
~~~

## ARC060

### C.Tak and Cards

**Difficulty**: $\color{cyan} 1583$

首先将每个数减去平均数，将问题转化为选出若干个数使其和为$0$的方案数， 可以使用折半搜索，时间复杂度$O(n^{\frac{n}{2}})$。

~~~c++
#include <bits/stdc++.h>
#include <unordered_map>

using namespace std;

#define int long long

const int N = 60;

int n, m;

int a[N];

unordered_map<int, int> vis;

int ans;

void dfs1(int x, int lim, int sum)
{
    if(x > lim)
    {
        vis[sum]++;
        return;
    }
    dfs1(x + 1, lim, sum);
    dfs1(x + 1, lim, sum + a[x]);
}

void dfs2(int x, int lim, int sum)
{
    if(x > lim)
    {
        ans += vis[-sum];
        return;
    }
    dfs2(x + 1, lim, sum);
    dfs2(x + 1, lim, sum + a[x]);
}

signed main()
{
    scanf("%lld%lld", &n, &m);
    for(int i = 1; i <= n; i++)
        scanf("%lld", &a[i]);
    sort(a + 1, a + n + 1);
    for(int i = 1; i <= n; i++)
        a[i] -= m;
    int mid = n >> 1;
    dfs1(1, mid, 0);
    dfs2(mid + 1, n, 0);
    printf("%lld", ans - 1);
    return 0;
}
~~~

### D.Digit Sum

**Difficulty**: $\color{yellow} 2261$

可以使用根号分治，当$d \le \sqrt n$的时候，直接暴力枚举，$d > \sqrt n$时，$n = k b + x, s = k + x$, $n - s$为$b - 1$的倍数，枚举约数即可，有一些特殊情况需要特判。

时间复杂度$O(\sqrt n)$

~~~c++
#include <bits/stdc++.h>

using namespace std;

#define int long long

int n, m;

int f(int b, int n)
{
    if(!n)return 0;
    return f(b, n / b) + n % b;
}

int ans = 1e18;

signed main()
{
    scanf("%lld%lld", &n, &m);
    bool res = false;
    int mid = 1e6;
    for(int i = 2; i <= mid; i++)
    {
        if(f(i, n) == m)
        {
            res = true;
            ans = i;
            break;
        }
    }
    if(!res)
    {
        for(int i = 1; i * i <= n - m; i++)
        {
            if((n - m) % i)continue;
            if(f(i + 1, n) == m)
            {
                res = true;
                ans = i + 1;
                break;
            }
            if(f((n - m) / i + 1, n) == m)
            {
                ans = min(ans,(n - m) / i + 1);
                res = true;
            }
        }
    }
    if(!res)
    {
        for(int i = n;i >= 2 && i <= n + 10; i++)
            if(f(i, n) == m)
                {ans = i, res = true; break;}
    }
    if(!res)ans = -1;
    printf("%lld", ans);
    return 0;
}
~~~

### E.Tak and Hotels

**Difficulty**: $\color{yellow} 2154$

直接倍增处理即可时间复杂度$O(q \log n)$

~~~c++
#include <bits/stdc++.h>

using namespace std;

const int N = 1e5 + 10;

int n, m, q;

int pos[N];

int f[N][26];

int query(int a, int b)
{
    int sum = 0, cur = a;
    for(int i = 25; i >= 0; i--)
    {
        if(f[cur][i] >= b)continue;
        cur = f[cur][i]; sum += (1 << i);
    }
    sum++;
    return sum;
}

int main()
{
    scanf("%d", &n);
    for(int i = 1; i <= n; i++)
        scanf("%d", &pos[i]);
    scanf("%d", &m);
    for(int i = 1; i <= n; i++)
    {
        int x = lower_bound(pos + 1, pos + n + 1, pos[i] + m + 1) - pos;
        f[i][0] = x - 1;
    }
    for(int j = 1; j <= 25; j++)
        for(int i = 1; i <= n; i++)
        {
            if(f[i][j - 1] >= n)f[i][j] = n + 1;
            else f[i][j] = f[f[i][j - 1]][j - 1];
        }
    scanf("%d", &q);
    while(q--)
    {
        int a, b;
        scanf("%d%d", &a, &b);
        if(a > b)swap(a, b);
        printf("%d\n", query(a, b));
    }
    return 0;
}
~~~

### F.Best Representation

**Difficulty**: $\color{red} 2804$

~~诈骗题~~

一道诈骗题，模数根本就没用到， 也没特殊性质， 还以为是dp， 其实除了全是相同字母的字符串， 其他的要么为$1$，要么为$2$，很显然，然后kmp， 判循环节，统计方案就可以了。

~~~c++
#include <bits/stdc++.h>

using namespace std;

#define int long long

const int N = 5e5 + 10;
const int mod = 1e9 + 7;

int n;

char s[N];

bool check1()
{
    for(int i = 2; i <= n; i++)
        if(s[i] != s[i - 1])return false;
    return true;
}

bool check2(int *f, int i)
{
    if((f[i] << 1) < i)
        return true;
    else return i % (i - f[i]);
}

int fnxt[N], gnxt[N];

signed main()
{
    scanf("%s", s + 1);
    n = strlen(s + 1);
    if(check1())
    {
        printf("%d\n1", n);
        return 0;
    }
    for(int i = 2, j = 0; i <= n; i++)
    {
        while(j && s[i] != s[j + 1])
            j = fnxt[j];
        if(s[i] == s[j + 1]) j++;
        fnxt[i] = j;
    }
    reverse(s + 1, s + n + 1);
    for(int i = 2, j = 0; i <= n; i++)
    {
        while(j && s[i] != s[j + 1])
            j = gnxt[j];
        if(s[i] == s[j + 1]) j++;
        gnxt[i] = j;
    }
    if(check2(fnxt, n))
    {
        printf("1\n1");
        return 0;
    }
    int ans = 0;
    for(int i = 1; i < n; i++)
    {
        int x = i, y = n - i;
        if(check2(fnxt, x) && check2(gnxt, y))
            ans++;
    }
    printf("2\n%d", ans);
    return 0;
}
~~~

## ARC061

### C.Many Formulas

**Difficulty**: $\color{green} 1089$

搜索即可，时间复杂度$O(2 ^ n)$。

~~~c++
#include <bits/stdc++.h>

using namespace std;

#define int long long

int n;

char s[15];

int num[15][15];

int ans = 0;

bool vis[15];

void dfs(int x)
{
    if(x >= n)
    {
        int sum = 0;
        int lst = 1;
        for(int i = 1; i <= n; i++)
        {
            if(vis[i])
            {
                sum += num[lst][i];
                lst = i + 1;
            }
        }
        ans += sum;
        return;
    }
    dfs(x + 1);
    vis[x] = true;
    dfs(x + 1);
    vis[x] = false;
}

signed main()
{
    scanf("%s", s + 1);
    n = strlen(s + 1);
    for(int i = 1; i <= n; i++)
    {
        int sum = 0;
        for(int j = i; j <= n; j++)
        {
            sum = sum * 10 + s[j] - '0';
            num[i][j] = sum;
        }
    }
    vis[n] = true;
    dfs(1);
    printf("%lld", ans);
    return 0;
}
~~~

### D.Snuke's Coloring

**Difficulty**: $\color{blue} 1682$

只考虑每个矩形的左上角，然后考虑每个黑点对每个矩形的贡献， 然后枚举即可，时间复杂度$O(n)$。

~~~c++
#include <bits/stdc++.h>

using namespace std;

#define int long long

const int N = 1e5 + 10;

int n, h, w;

struct node
{
    int x, y;
    node(int a = 0, int b = 0) : x(a), y(b) {}
    friend bool operator < (node a, node b){return a.x == b.x ? a.y < b.y : a.x < b.x;}
};

map <node, int> id;

int b[N * 100];

int cnt;

void paint(int x, int y)
{
    for(int i = x - 2; i <= x; i++)
    {
        for(int j = y - 2; j <= y; j++)
        {
            if(i < 1 || j < 1 || i + 2 > h || j + 2 > w)
                continue;
            if(id[node(i, j)] == 0)
                id[node(i, j)] = ++cnt;
            b[id[node(i, j)]]++;
        }
    }
}

int ans[10];

signed main()
{
    scanf("%lld%lld%lld", &h, &w, &n);
    for(int i = 1; i <= n; i++)
    {
        int x, y;
        scanf("%lld%lld", &x, &y);
        paint(x, y);
    }
    for(int i = 1; i <= cnt; i++)
        ans[b[i]]++;
    int sum = 0;
    for(int i = 1; i <= 9; i++)
        sum += ans[i];
    ans[0] = max(0ll, (h - 2) * (w - 2) - sum);
    for(int i = 0; i <= 9; i++)
        printf("%lld\n", ans[i]);
    return 0;
}
~~~

### E.Snuke's Subway Trip

**Difficulty**: $\color{orange} 2502$

首先可以想到新建虚点然后，在每个连通块中跑最短路， 但是这样建的边数是$n^2$级别的，我们可以换一种建边方式，将每个边拆成一个点，然后建边，这样的话其实就是将费用拆成了两个$0.5$最后需要，除以$2$，建边的复杂度为$n + 2 \times m$级别的。 跑最短路即可。

~~~c++
#include <bits/stdc++.h>

using namespace std;

#define int long long

const int N = 1e6 + 10;
const int INF = 0x3f3f3f3f3f3f3f3f;

int cnt, head[N];

struct edge
{
    int to, nxt, cost;
    edge(int v = 0, int x = 0, int c = 0) : to(v), nxt(x), cost(c) {}
};

edge e[N << 1];

void add(int u, int v, int c)
{
    e[++cnt] = edge(v, head[u], c); head[u] = cnt;
    e[++cnt] = edge(u, head[v], c); head[v] = cnt;
}

struct node
{
    int x, y;
    node(int a = 0, int b = 0) : x(a), y(b) {}
    friend bool operator < (node a, node b){return a.x == b.x ? a.y < b.y : a.x < b.x;}
};

int n, m;

int tot;

map <node, int> f;

map <node, int> g;

int find(int x, int y)
{
    if(f[node(x, y)])return f[node(x, y)];
    else return f[node(x, y)] = ++tot;
}

bool check(int x, int y)
{
    return g[node(x, y)] | g[node(y, x)];
}

int dis[N];

bool vis[N];

int bfs()
{
    memset(dis, INF, sizeof(dis));
    memset(vis, false, sizeof(vis));
    dis[1] = 0; vis[1] = true;
    queue <int> q; q.push(1);
    while(!q.empty())
    {
        int x = q.front(); q.pop();
        vis[x] = false;
        for(int i = head[x]; i; i = e[i].nxt)
        {
            int v = e[i].to, c = e[i].cost;
            if(dis[x] + c < dis[v])
            {
                dis[v] = dis[x] + c;
                if(!vis[v])
                {
                    vis[v] = true;
                    q.push(v);
                }
            }
        }
    }
    return dis[n];
}

signed main()
{
    scanf("%lld%lld", &n, &m);
    tot = n;
    for(int i = 1; i <= m; i++)
    {
        int x, y, z;
        scanf("%lld%lld%lld", &x, &y, &z);
        int u = find(x, z);
        int v = find(y, z);
        if(!check(x, u))add(x, u, 1), g[node(x, u)] = g[node(u, x)] = 1;
        if(!check(y, v))add(y, v, 1), g[node(x, v)] = g[node(v, x)] = 1;
        add(u, v, 0);
    }
    int ans = bfs();
    if(ans == INF)ans = -2;
    printf("%lld\n", ans / 2);
    return 0;
}
~~~

### F.Card Game for Three

**Difficulty**: $\color{red} 3154$

首先需要注意的是题目说的是$3 ^ { n + m + k }$ 种情况也就是说，最后拿完后，不止对应的是一种情况，首先转化问题，将其转化为只有$1, 2, 3$的序列，假设我们枚举游戏结束时，此时选了不是$1$的个数为$x$，此时这段序列长度为$x + n$，且此时肯定会有$n$个$1$以及末尾一定是$1$， 也就是：
$$
\dbinom{x + n - 1}{x} \sum_{y = 0}^x \dbinom{x}{y} [y \le m][x - y \le k]
$$
这个组合数的意义其实就是，在$x + n - 1$个可以随便选的位置中选$x$个位置填不是$1$的，然后再在这些位置中选填$2$还是$3$，接着将组合数求和转化为
$$
\begin{aligned}

S(x) &= \sum_{x - k \le y \le m} \dbinom{x}{y} \\
&= \sum_{x - k \le  y \le m} \dbinom{x - 1}{y} + \dbinom{x - 1}{y - 1} \\

&= \sum_{x - k \le y \le m} \dbinom{x - 1}{y} + \sum_{x - k \le y \le m} \dbinom{x - 1}{y - 1} \\

&= 2S(x - 1) - \dbinom{x - 1}{x - k - 1} - \dbinom{x - 1}{m}

\end{aligned}
$$

这样就可以$O(n)$处理组合数求和，再考虑长度为$x$的序列对应的情况答案其实就是
$$
\sum_{x = 0} ^ {m + k} 3 ^ {m + k - x} \dbinom{x + n - 1}{x}S(x)
$$

$O(n)$计算即可。~~(tips: 取模意义下减法要加模数)~~

~~~c++
#include <bits/stdc++.h>

using namespace std;

#define int long long

const int mod = 1e9 + 7;
const int N = 1e6 + 10;

int n, m, k;

int S[N];

int fac[N], ifac[N];

int qpow(int a, int b)
{
    int t = 1;
    while(b != 0)
    {
        if(b & 1)t = t * a % mod;
        a = a * a % mod; b >>= 1;
    }
    return t;
}

int inv(int x)
{
    return qpow(x, mod - 2);
}

int C(int n, int m)
{
    if(n < m || n < 0 || m < 0)return 0;
    return fac[n] % mod * ifac[m] % mod * ifac[n - m] % mod;
}

signed main()
{
    scanf("%lld%lld%lld", &n, &m, &k);
    n = n + m + k;
    fac[0] = ifac[0] = 1;
    for(int i = 1; i <= n; i++)
        fac[i] = fac[i - 1] * i % mod,
        ifac[i] = inv(fac[i]);
    S[0] = 1;
    for(int i = 1; i <= n; i++)
        S[i] = ((2 * S[i - 1] % mod - C(i - 1, i - k - 1) % mod - C(i - 1, m) % mod + mod) % mod + mod) % mod;
    int ans = 0;
    for(int i = 0; i <= m + k; i++)
        ((ans += qpow(3, m + k - i) % mod * C(i + n - m - k - 1, i) % mod * S[i] % mod + mod) %= mod + mod) %= mod;
    printf("%lld", ans);
    return 0;
}
~~~

## ARC104

### F.Visibility Sequence

**Difficulty**: $\color{red} 3213$

考虑将所有的$-1$替换成$0$，根据题目中的要求，在$i$和$p_i$之间连一条边，可以构造出一棵树，其满足以下性质：

1. 一棵树对应唯一的一个排列$P$

2. 这棵树以$0$为根

3. 子树内的编号是连续的

4. 对于一个节点的$h_i$，其满足$h_i \ge \max \{ h_{son_i} + 1, h_{friend_i} \}$。

证明不难，直接设$f_{i, j, k}$表示区间$[i, j]$构造出来以$i$为根的字数，且$h_i = k$的$P$的数量。

观察到题目中给的值域的范围，其实由于求的是$P$的个数，已经被我们转化为映射之间的关系，只和相对大小有关，所以其值域其实是$n$，然后就是考虑转移。

首先第一种情况就是，考虑区间$[i, j]$在末尾新添加一棵子树，如果子树太大会导致$h_i$变大：

$$
f_{i, j, k} = \sum_{p = i + 1} ^ j f_{p, j, k - 1} \sum_{t \le k}f_{i , p - 1, t}
$$

另一种情况就是新加入的子树$h$比较小，但是由于其$friend$的影响，而导致变大：

$$
f_{i, j, k} = \sum_{p = i + 1} ^ j f_{i, p - 1, k}[x_p \ge k - 1] \sum_{t < k - 1} f_{p, j, t}
$$

然后可以使用前缀和优化到$O(n^4)$。

~~~c++
#include <bits/stdc++.h>

using namespace std;

#define int long long

const int N = 110;
const int mod = 1e9 + 7;

int n, x[N];

int f[N][N][N];

int g[N][N][N];

signed main()
{
	scanf("%lld", &n);
    x[1] = n + 1; n = n + 1;
    for(int i = 2; i <= n; i++)
        scanf("%lld", &x[i]);
    for(int i = n; i >= 1; i--)
    {
        f[i][i][1] = 1;
        for(int k = 1; k <= n; k++)
            g[i][i][k] = (g[i][i][k - 1] + f[i][i][k]) % mod;
        for(int j = i + 1; j <= n; j++)
        {
            for(int k = 2; k <= n && k <= x[i]; k++)
            {
                for(int mid = i + 1; mid <= j; mid++)
                {
                    f[i][j][k] = (f[i][j][k] + g[i][mid - 1][k] * f[mid][j][k - 1] % mod + f[i][mid - 1][k] * g[mid][j][k - 2] % mod * (x[mid] >= k - 1)) % mod;
                }
                g[i][j][k] = (g[i][j][k - 1] + f[i][j][k]) % mod;
            }
        }
    }
    printf("%lld", g[1][n][n]);
    return 0;
}
~~~


## ARC062

### C.AtCoDeer and Election Report

**Difficulty** : $\color{cyan} 1346$

直接按题意模拟即可。

~~~c++
#include <bits/stdc++.h>

using namespace std;

#define int long long

const int N = 1e3 + 10;

int n, a[N], b[N];

int qpow(int a, int b)
{
    int t = 1;
    while(b != 0)
    {
        if(b & 1)t = t * a;
        a = a * a; b >>= 1;
    }
    return t;
}

signed main()
{
    scanf("%lld", &n);
    a[0] = b[0] = 1;
    for(int i = 1; i <= n; i++)
    {
        int x, y;
        scanf("%lld%lld", &x, &y);
        int k = max(a[i - 1] / x, b[i - 1] / y);
        a[i] = k * x; b[i] = k * y;
        while(a[i] < a[i - 1] || b[i] < b[i - 1])
            a[i] += x, b[i] += y;
    }
    printf("%lld", a[n] + b[n]);
    return 0;
}
~~~

### D.AtCoDeer and Rock-Paper

**Difficulty**: $\color{cyan} 1256$

贪心选择即可。

~~~c++
#include <bits/stdc++.h>

using namespace std;

const int N = 1e5 + 10;

int n;

char s[N];

int main()
{
    scanf("%s", s + 1);
    n = strlen(s + 1);
    int x = 0, y = 0, ans = 0;
    for(int i = 1; i <= n; i++)
    {
        if(s[i] == 'p')
        {
            if(y + 1 <= x)
            {
                y++;
            }
            else x++, ans--;
        }
        else
        {
            if(y + 1 <= x)
            {
                y++;
                ans++;
            }
            else x++;
        }
    }
    printf("%d", ans);
}
~~~

## ARC063

### C.1D Reversi

**Difficulty** : $\color{brown}755$

判断有多少不同的段数。

~~~c++
#include <bits/stdc++.h>

using namespace std;

const int N = 1e5 + 10;

char s[N];

int main()
{
    scanf("%s", s + 1);
    int n = strlen(s + 1);
    int ans = 0;
    for(int i = 2; i <= n; i++)
    {
        if(s[i] != s[i - 1])
            ans++;
    }
    printf("%d", ans);
    return 0;
}
~~~

### D.An Invisible Hand

**Difficulty** : $\color{cyan} 1376$

逆序枚举选一遍最大的差，最后统计一下方案即可。

~~~c++
#include <bits/stdc++.h>

using namespace std;

const int N = 1e5 + 10;

int n, m, a[N];

int ans;

int main()
{
    scanf("%d%d", &n, &m);
    for(int i = 1; i <= n; i++)
        scanf("%d", &a[i]);
    int Max = 0, k = 0;
    for(int i = n; i >= 1; i--)
    {
        Max = max(Max, a[i]);
        k = max(k, Max - a[i]);
    }
    Max = 0;
    for(int i = n; i >= 1; i--)
    {
        Max = max(Max, a[i]);
        if(Max - a[i]== k)
            ans++;
    }
    printf("%d", ans);
    return 0;
}
~~~

### E.Integers on a Tree

**Difficulty** : $\color{yellow} 2198$

不难想到一种构造方式就是维护一下当前的点权最小值，然后让与其相连的点为其点权$+1$，最后check一下就可以了。

~~~c++
#include <bits/stdc++.h>

using namespace std;

const int N = 1e5 + 10;
const int INF = 0x3f3f3f3f;

int n, m;

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

int w[N];

int res, check;

int d[N], l[N], r[N];

void dfs(int x, int fa)
{
    d[x] = d[fa] ^ 1;
    for(int i = head[x]; i; i = e[i].nxt)
    {
        int v = e[i].to;
        if(v == fa)continue;
        dfs(v, x);
        l[x] = max(l[x], l[v] - 1);
        r[x] = min(r[x], r[v] + 1);
    }
    if(l[x] > r[x])check = 0;
    if(w[x] != -1)
    {
        if(w[x] > r[x] || w[x] < l[x])
            check = 0;
        if(res == -1)res = (w[x] & 1) ^ d[x];
        else if(res != ((w[x] & 1) ^ d[x]))
            check = 0;
        l[x] = r[x] = w[x];
    }
}

void paint(int x, int fa)
{
    if(fa != 0)
    {
        if(w[fa] - 1 >= l[x] && w[fa] - 1 <= r[x])
            w[x] = w[fa] - 1;
        else w[x] = w[fa] + 1;
    }
    else w[x] = l[x];
    for(int i = head[x]; i; i = e[i].nxt)
    {
        int v = e[i].to;
        if(v == fa)continue;
        paint(v, x);
    }
}

void init()
{
    check = 1;
    memset(w, -1, sizeof(w));
    memset(l, -INF, sizeof(l));
    memset(r, INF, sizeof(r));
}

int main()
{
    init();
    scanf("%d", &n);
    for(int i = 1, x, y; i < n; i++)
    {
        scanf("%d%d", &x, &y);
        add(x, y);
    }
    scanf("%d", &m);
    for(int i = 1, v, x; i <= m; i++)
    {
        scanf("%d%d", &v, &x);
        w[v] = x;
    }
    res = -1;
    dfs(1, 0);
    if(!check)
    {
        printf("No\n");
    }
    else
    {
        printf("Yes\n");
        paint(1, 0);
        for(int i = 1; i <= n; i++)
            printf("%d\n", w[i]);
    }
    return 0;
}
~~~

### F.Snuke's Coloring 2

**Difficulty** : $\color{red} 3688$

就是找一个矩形使点不在矩形内，求矩形的周长，首先很容易想到的就是答案至少为$2 \max(W, H) + 2$， 我们可以直接枚举中线，进行分治， 复杂度为$O(n \log n)$。

~~~c++
#include <bits/stdc++.h>

using namespace std;

#define int long long

const int N = 3e5 + 10;

int n, W, H;

struct Point
{
    int x, y;
    Point(int a = 0, int b = 0) : x(a), y(b) {}
    friend bool operator < (Point a, Point b)
    {
        return a.x == b.x ? a.y < b.y : a.x < b.x;
    }
};

Point p[N];

int ans, up[N], down[N];

int m;

int q[N], head, tail;

void solve(int l, int r)
{
    if(l == r)return;
    int mid = (l + r) >> 1;
    solve(l, mid); solve(mid + 1, r);
    int u = H, d = 0;
    for(int i = mid; i >= l; i--)
    {
        up[i] = u; down[i] = d;
        if(p[i].y <= m)
            d = max(d, p[i].y);
        else u = min(u, p[i].y);
    }
    u = H, d = 0;
    for(int i = mid + 1; i <= r; i++)
    {
        up[i] = u, down[i] = d;
        if(p[i].y <= m)
            d = max(d, p[i].y);
        else u = min(u, p[i].y);
    }
    int j = mid, s = W;
    head = 1, tail = 0;
    for(int i = mid + 1; i <= r; i++)
    {
        while(j >= l && up[j] >= up[i])
        {
            while(head <= tail && p[q[tail]].x + down[q[tail]] >= p[j].x + down[j])
                tail--;
            q[++tail] = j;
            j--;
        }
        while(head <= tail && down[q[head]] <= down[i])
        {
            s = min(s, p[q[head]].x);
            head++;
        }
        ans = max(ans, p[i].x - s + up[i] - down[i]);
        if(head <= tail)
            ans = max(ans, p[i].x + up[i] - (p[q[head]].x + down[q[head]]));
    }
}

void getans()
{
    sort(p + 1, p + n + 1);
    m = H >> 1;
    p[0] = Point(0, 0);
    p[n + 1] = Point(W, 0);
    solve(0, n + 1);
    reverse(p + 1, p + n + 1);
    for(int i = 1; i <= n; i++)
        p[i].x = W - p[i].x;
    solve(0, n + 1);
}

signed main()
{
    scanf("%lld%lld%lld", &W, &H, &n);
    for(int i = 1; i <= n; i++)
    {
        int x, y;
        scanf("%lld%lld", &x, &y);
        p[i] = Point(x, y);
    }
    getans();
    swap(W, H);
    for(int i = 1; i <= n; i++)
        swap(p[i].x, p[i].y);
    getans();
    printf("%lld", ans << 1ll);
    return 0;
}
~~~

## ARC119

### A.119 × 2^23 + 1

**Difficulty** : $\color{cray} 69$

直接暴力枚举。

~~~c++
#include <bits/stdc++.h>

using namespace std;

#define int long long

const int mod = 998244353;

int n;

int ans = 1e18;

signed main()
{
    scanf("%lld", &n);
    for(int i = 63; i >= 0; i--)
    {
        int x = 1ll << i;
        ans = min(ans, n / x + n % x + i);
    }
    printf("%lld", ans);
    return 0;
}
~~~

### B.Electric Board

**Difficulty** : $\color{green} 1196$

一个很显然的结论， 答案就是每个$0$的位置差不为$0$的和。

~~~c++
#include <bits/stdc++.h>

using namespace std;

const int N = 5e5 + 10;

int n;

char s[N];

char t[N];

int ans = 0;

vector <int> a, b;

int main()
{
    cin >> n >> s + 1 >> t + 1;
    for(int i = 1; i <= n; i++)
        if(s[i] == '0')a.push_back(i);
    for(int i = 1; i <= n; i++)
        if(t[i] == '0')b.push_back(i);
    if(a.size() != b.size())
        ans = -1;
    else
    {
        for(int i = 0; i < a.size(); i++)
            if(a[i] != b[i])ans++;
    }
    printf("%d", ans);
    return 0;
}
~~~

### C.ARC Wrecker 2

**Difficulty** : $\color{cyan} 1354$

其实就是统计偶数位置和奇数位置的和相加为$0$的个数。

~~~c++
#include <bits/stdc++.h>

using namespace std;

const int N = 3e5 + 10;

#define int long long

int n, a[N];

int f[N], g[N];

int ans;

map <int, int> sum;

signed main()
{
    scanf("%lld", &n);
    for(int i = 1; i <= n; i++)
        scanf("%lld", &a[i]);
    for(int i = 1; i <= n; i++)
    {
        if(i & 1)
            f[i] = f[i - 1] + a[i], g[i] = g[i - 1];
        else
            g[i] = g[i - 1] + a[i], f[i] = f[i - 1];
    }
    for(int i = 0; i <= n; i++)
    {
        ans += sum[f[i] - g[i]];
        sum[f[i] - g[i]]++;
    }
    printf("%lld", ans);
    return 0;
}
~~~

### D. Grid Repainting 3

**Difficulty** : $\color{orange} 2713$

很经典的一个模型，可以根据行列分为左部点和右部点，建立二分图，然后分联通块统计答案即可。

~~~c++
#include <bits/stdc++.h>

using namespace std;

#define fir first
#define sec second
#define mpr make_pair
#define int long long

typedef pair <int, int> Pair;

const int N = 2e7 + 10;

int n, m;

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

int a[5010][5010];

int fa[N];

Pair w[N];

int find(int x)
{
    if(x == fa[x])return x;
    return fa[x] = find(fa[x]);
}

void merge(int x, int y)
{
    if(find(x) == find(y))
        return;
    x = find(x), y = find(y);
    fa[x] = y;
    w[y].fir += w[x].fir;
    w[y].sec += w[x].sec;
}

void init()
{
    for(int i = 1; i <= n; i++)
        fa[i] = i, w[i] = mpr(1, 0);
    for(int i = 1; i <= m; i++)
        fa[i + n] = i + n, w[i + n] = mpr(0, 1);
}

int f(int x, int y)
{
    return x * m + y * n - x * y;
}

bool vis[N];

vector <pair <Pair, int> > ans;

void dfs(int x, int c)
{
    vis[x] = true;
    for(int i = head[x]; i; i = e[i].nxt)
    {
        int v = e[i].to;
        if(vis[v])continue;
        if(!c)ans.push_back(mpr(mpr(x, v - n), 1));
        else ans.push_back(mpr(mpr(v, x - n), 0));
        dfs(v, c ^ 1);
    }
}

signed main()
{
    scanf("%lld%lld", &n, &m);
    for(int i = 1; i <= n; i++)
    {
        for(int j = 1; j <= m; j++)
        {
            char c; cin >> c;
            a[i][j] = (c == 'R');
        }
    }
    init();
    for(int i = 1; i <= n; i++)
        for(int j = 1; j <= m; j++)
            if(a[i][j])add(i, j + n), merge(i, j + n);
    int tot = 0; Pair x(0, 0);
    for(int i = 1; i <= n + m; i++)
    {
        if(find(i) == i && w[i].fir + w[i].sec > 1)
            tot++, x.fir += w[i].fir, x.sec += w[i].sec;
    }
    if(f(x.fir - tot, x.sec) > f(x.fir, x.sec - tot))
    {
        for(int i = 1; i <= n; i++)
            if(!vis[i])dfs(i, 0);
    }
    else
    {
        for(int i = 1; i <= m; i++)
            if(!vis[i + n])dfs(i + n, 1);
    }
    printf("%lld\n", ans.size());
    reverse(ans.begin(), ans.end());
    for(auto i : ans)
        printf("%c %lld %lld\n", (i.sec ? 'Y' : 'X'), i.fir.fir, i.fir.sec);
    return 0;
}
~~~

### E.Pancakes

**Difficulty** : $\color{orange} 2502$

由于反转区间对中间的部分没有影响， 可以把绝对值拆开， 然后转化为一个二维偏序的形式。

~~~c++
#include <bits/stdc++.h>

using namespace std;

#define ll long long

const int N = 3e5 + 10;
const int INF = 2147483647;

struct Point
{
    int x, y;
    bool operator < (const Point &a) const{return x < a.x;}
};

Point p[N];

int main()
{
    int n, lst;
    scanf("%d%d", &n, &lst);
    ll ans = 0;
    for (int i = 2; i <= n; i++)
    {
        p[i - 1].x = lst;
        scanf("%d", &lst);
        p[i - 1].y = lst;
        ans += abs(p[i - 1].x - lst);
    }
    int cur = 0;
    for (int i = 1; i < n; i++)
        cur = max(cur, abs(p[i].x - p[i].y) - abs(p[n - 1].y - p[i].x));
    for (int i = 1; i < n; i++)
        cur = max(cur, abs(p[i].x - p[i].y) - abs(p[1].x - p[i].y));
    sort(p + 1, p + n);
    for (int i = n - 1, x = INF; i >= 1; i--)
    {
        if (p[i].y <= p[i].x)
        {
            if (x <= p[i].y)
                cur = max(cur, 2 * abs(p[i].x - p[i].y));
            else if (x <= p[i].x)
                cur = max(cur, 2 * abs(p[i].x - x));
            x = min(x, p[i].y);
        }
        swap(p[i].x, p[i].y);
    }
    sort(p + 1, p + n);
    for (int i = n - 1, x = INF; i >= 1; i--)
    {
        if (p[i].y <= p[i].x)
        {
            if (x <= p[i].y)
                cur = max(cur, 2 * abs(p[i].x - p[i].y));
            else if (x <= p[i].x)
                cur = max(cur, 2 * abs(p[i].x - x));
            x = min(x, p[i].y);
        }
    }
    printf("%lld\n", ans - cur);
    return 0;
}
~~~

## ARC112

### F.Die Siedler

**Difficulty** : $\color{red} 3432$

考虑转化问题，将每个位置的卡牌转移到第一个位置上来，首先对于这种转化方式容易得到其得到满足要求的序列所需的最小步数，是与原序列是等价的，同时对于每种卡包， 也用相同的转化方式，然后相加减的答案就是原序列的答案。

对于一个长度为$n$的序列，其转化即为

$$
\sum_{i = 1} ^n a_i 2 ^ {i - 1} (i - 1) !
$$

然后考虑已知这种表达方式如何求解，其实只要贪心即可，去倒着填，对于第一个位置的数，其可以减少若干倍的$2 ^ n n! - 1$(转化一周)， 也就是说，最后所有卡牌转为为第一个位置的时候，答案可以表示为，
$$
v = R + \sum_{i = 1} ^ n b_i x_i - y (2 ^ n n! - 1)
$$
裴蜀定理解出即可， 然后考虑到数据范围，需要使用根号分治，当$d < \sqrt {2 ^ n n !}$时，直接暴力枚举，$d \le \sqrt {2 ^n n!}$时，根据转移，可以跑同余最短路，然后问题就解决了。

~~~c++
#include <bits/stdc++.h>

using namespace std;

#define int long long

const int N = 18;
const int M = 60;
const int INF = 1e18;
const int K = 1.5e6 + 10;

int n, m;

int a[N], s[M][N];

int fac[N], t[N];

int S[M];

int lim;

int b[N];

void init()
{
    fac[0] = t[0] = 1;
    for(int i = 1; i <= n; i++)
        t[i] = t[i - 1] * 2;
    for(int i = 1; i <= n; i++)
        fac[i] = fac[i - 1] * i;
}

int f(int *a)
{
    int sum = 0;
    for(int i = 1; i <= n; i++)
        sum += a[i] * t[i - 1] * fac[i - 1];
    return sum;
}

int calc(int A)
{
    int sum = A, s = 0;
    for(int i = n; i >= 1; i--)
    {
        s += sum / (t[i - 1] * fac[i - 1]);
        sum %= (t[i - 1] * fac[i - 1]);
    }
    return s;
}

int gcd(int a, int b){return b == 0 ? a : gcd(b, a % b);}

int dis[K];

int d;

int spfa(int T)
{
    memset(dis, 0x3f3f3f3f, sizeof(dis));
    queue <int> q;
    for(int i = 1; i <= n; i++)
    {
        int x = t[i - 1] * fac[i - 1] % d;
        dis[x] = 1; q.push(x);
    }
    while(!q.empty())
    {
        int x = q.front();q.pop();
        for(int i = 1; i <= n; i++)
        {
            int v = (x + t[i - 1] * fac[i - 1]) % d;
            if(dis[x] + 1 < dis[v])
            {
                dis[v] = dis[x] + 1;
                q.push(v);
            }
        }
    }
    return dis[T];
}

signed main()
{
    scanf("%lld%lld", &n, &m);
    for(int i = 1; i <= n; i++)
        scanf("%lld", &a[i]);
    for(int i = 1; i <= m; i++)
        for(int j = 1; j <= n; j++)
            scanf("%lld", &s[i][j]);
    init();
    for(int i = 1; i <= m; i++)
        S[i] = f(s[i]);
    lim = t[n] * fac[n] - 1;
    d = lim;
    for(int i = 1; i <= m; i++)
        d = gcd(S[i], d);
    int ans = INF;
    if(d >= lim / d)
    {
        for(int i = f(a) % d; i <= lim; i += d)
            if(i) ans = min(ans, calc(i));
    }
    else
    {
        ans = INF; int A = f(a);
        ans = min(ans, spfa(A % d));
    }
    printf("%lld", ans);
    return 0;
}
~~~

## ARC116

### A.Odd vs Even

**Difficulty** : $\color{gray} 155$

分情况讨论一下，不难得出当$n$为奇数时，$odd > even$， 当$n$不是$4$的倍数时此时$odd = even$， 否则$odd < even$，其实质因数分解一下就可以看出来。

~~~c++
#include <bits/stdc++.h>

using namespace std;

#define ll long long

int main()
{
    int T; scanf("%d", &T);
    while(T--)
    {
        ll n; scanf("%lld", &n);
        if(n & 1)
            cout << "Odd" << endl;
        else if(n % 4 != 0)
            cout << "Same" << endl;
        else
            cout << "Even" << endl;
    }
    return 0;
}
~~~

### B.Products of Min-Max

**Difficulty** : $\color{green} 816$

可以考虑排序后固定最大值，然后统计贡献即可。

~~~c++
#include <bits/stdc++.h>

using namespace std;

#define ll long long

const int N = 2e5 + 10;
const int mod = 998244353;
const int INF = 1e9;

int n, a[N];

int main()
{
    scanf("%d", &n);
    for(int i = 1; i <= n; i++)
        scanf("%d", &a[i]);
    sort(a + 1, a + n + 1);
    ll ans = 0, sum = 0;
    for(int i = 1; i <= n; i++)
    {
        ans = (ans + a[i] * (sum + a[i]) % mod) % mod;
        sum = sum * 2ll % mod; sum = (sum + a[i]) % mod;
    }
    printf("%lld", ans);
    return 0;
}
~~~

### C.Multiple Sequences

**Difficulty** : $\color{cyan} 1468$

首先注意到$m \le 2 \times 10 ^ 5$，分解后质因子数最多为$6$个，然后考虑枚举最后一个数为多少，将其质因数分解，然后先计算每个质因数指数分配的情况然后相乘，这时候等价于在$n$个相同的盒子中放$m$个不同的小球，方案数为$\dbinom{n +m - 1}{n}$，然后将每个质因数的答案乘起来就好了。时间复杂度$O(n \sqrt n)$。

~~~c++
#include <bits/stdc++.h>

using namespace std;

#define ll long long

const int N = 2e5 + 10;
const int mod = 998244353;

int n, m;

ll ans;

ll qpow(ll a, ll b)
{
    ll t = 1;
    while(b != 0)
    {
        if(b & 1)t = t * a % mod;
        a = a * a % mod; b >>= 1;
    }
    return t;
}

ll inv(ll x)
{
    return qpow(x, mod - 2);
}

ll fac[N + 100], ifac[N + 100];

ll C(int n, int m)
{
    if(n < m)return 0;
    return fac[n] % mod * ifac[m] % mod * ifac[n - m] % mod;
}

int main()
{
    scanf("%d%d", &n, &m);
    fac[0] = ifac[0] = 1;
    for(ll i = 1; i <= N + 99; i++)
        fac[i] = fac[i - 1] * i % mod;
    for(int i = 1;i <= N + 99; i++)
        ifac[i] = inv(fac[i]);
    for(int i = 1; i <= m; i++)
    {
        int x = i; ll mul = 1;
        for(int j = 2; j * j <= x; j++)
        {
            if(x % j != 0)continue;
            int sum = 0;
            while(x % j == 0)
                sum++, x /= j;
            mul = mul * C(n + sum - 1, sum) % mod;
        }
        if(x != 1)mul = mul * 1ll * n % mod;
        ans = (ans + mul) % mod;
    }
    printf("%lld", ans);
    return 0;
}
~~~

### D.I Wanna Win The Game

**Difficulty** : $\color{blue} 1718$

考虑设$f_{i,j}$表示枚举到第$i$个二进制位，此时权值和为$j$的方案数，然后直接转移即可，需要保证每个二进制位的$1$的个数为偶数。

~~~c++
#include <bits/stdc++.h>

using namespace std;

#define ll long long

const int N = 5100;
const int mod = 998244353;

int n, m;

ll fac[N], ifac[N];

ll qpow(ll a, ll b)
{
    ll t = 1;
    while(b != 0)
    {
        if(b & 1)t = t * a % mod;
        a = a * a % mod; b >>= 1;
    }
    return t;
}

ll inv(ll x)
{
    return qpow(x, mod - 2);
}

ll f[15][N];

ll C(int n, int m)
{
    return fac[n] % mod * ifac[m] % mod * ifac[n - m] % mod;
}

int main()
{
    scanf("%d%d", &n, &m);
    fac[0] = ifac[0] = 1;
    for(int i = 1; i <= n; i++)
        fac[i] = fac[i - 1] * 1ll * i % mod;
    for(int i = 1; i <= n; i++)
        ifac[i] = inv(fac[i]);
    f[0][0] = 1;
    for(int i = 1; i <= 14; i++)
    {
        for(int j = 0; j <= m; j++)
        {
            for(int k = 0; k <= n; k += 2)
            {
                int x = j - (1 << (i - 1)) * k;
                if(x < 0)break;
                f[i][j] = (f[i][j] + f[i - 1][x] * C(n, k) % mod) % mod;
            }
        }
    }
    printf("%lld", f[14][m]);
    return 0;
}
~~~

### E.Spread of Information

**Difficulty** : $\color{yellow} 2236$

直接二分判定时间， 然后贪心，选取点，设$f_i$表示节点$i$到其子树内最近的初始被覆盖的点的距离，$g_i$表示其到子树被最远的没被覆盖住的点的距离。

~~~c++
#include <bits/stdc++.h>

using namespace std;

const int N = 2e5 + 10;
const int INF = 1e9;

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

int n, m;

int tot;

int f[N], g[N];

void dfs(int x, int fa, int lim)
{
    f[x] = INF; g[x] = 0;
    for(int i = head[x]; i; i = e[i].nxt)
    {
        int v = e[i].to;
        if(v == fa)continue;
        dfs(v, x, lim);
        f[x] = min(f[x], f[v] + 1);
        g[x] = max(g[x], g[v] + 1);
    }
    if(f[x] + g[x] <= lim)
        g[x] = -INF;
    else if(g[x] == lim)
    {
        f[x] = 0; g[x] = -INF;
        tot++;
    }
}

bool check(int x)
{
    tot = 0; dfs(1, 0, x);
    if(g[1] >= 0)tot++;
    return tot <= m;
}

int main()
{
    scanf("%d%d", &n, &m);
    for(int i = 1; i < n; i++)
    {
        int x, y;
        scanf("%d%d", &x, &y);
        add(x, y);
    }
    int l = 0, r = n;
    while(l <= r)
    {
        int mid = (l + r) >> 1;
        if(check(mid))
            r = mid - 1;
        else l = mid + 1;
    }
    printf("%d", l);
    return 0;
}
~~~

### F.Deque Game

**Difficulty** : $\color{red} 3125$

首先考虑只有一个序列的情况此时设长度为$n$，假如$n$为偶数，此时很明显答案就是$\max(a[n / 2], a[n / 2 + 1])$，或$\min(a[n/ 2], a[n / 2 + 1])$若$n$为奇数此时答案为$\max(\min(a[n / 2], a[n / 2 + 1]), \min(a[n / 2 + 1], a[n / 2 + 2]))$或$\min(\max(a[n / 2], a[n / 2 + 1]), \max(a[n / 2 + 1], a[n / 2 + 2]))$，依据先后手来决定。然后将其拓展到多个序列，首先考虑所有的序列长度均为奇数， 此时先后手不会被改变，直接按照先手的取值求和即可，但是如若出现长度为偶数的序列， 此时就会出现，先后手交换的情况，此时需要使用优先队列去维护一下，对于每个长度为偶数的序列其带来的影响，最后求和即可。

~~~c++
#include <bits/stdc++.h>

using namespace std;

#define ll long long

const int N = 2e5 +10;

int n;

vector <int> a[N];

int m[N];

int v[N];

ll ans;

int res;

int calc(int x, int n)
{
    if(n == 2)
        return x == 0 ? v[2] : v[1];
    if(!res)
        return max(min(v[n / 2 + x], v[n / 2 + 1 + x]), min(v[n / 2 + 1 + x], v[n / 2 + 2 + x]));
    else
        return min(max(v[n / 2 + x], v[n / 2 + 1 + x]), max(v[n / 2 + 1 + x], v[n / 2 + 2 + x]));
}

int main()
{
    scanf("%d", &n);
    for(int i = 1; i <= n; i++)
    {
        scanf("%d", &m[i]);
        for(int j = 1; j <= m[i]; j++)
        {
            int x; scanf("%d", &x);
            a[i].push_back(x);
        }
        if(!(m[i] & 1))res ^= 1;
    }
    priority_queue <int> q;
    for(int i = 1; i <= n; i++)
    {
        for(int j = 1; j <= m[i]; j++)
            v[j] = a[i][j - 1];
        if(m[i] & 1)
        {
            if(m[i] == 1)
                ans += v[1];
            else
                ans += calc(0, m[i]);
        }
        else
        {
            q.push(max(calc(-1, m[i]), calc(0, m[i])) - min(calc(-1, m[i]), calc(0, m[i])));
            ans += min(calc(-1, m[i]), calc(0, m[i]));
        }
    }
    while(!q.empty())
    {
        ans += q.top(); q.pop();
        if(!q.empty())q.pop();
    }
    printf("%lld\n", ans);
    return 0;
}
~~~

