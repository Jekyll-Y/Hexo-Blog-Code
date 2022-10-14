---
title:  ARC做题记录
date: 2022-10-13 15:56:00
tags: 
- AtCoder Regular Contest
- Record
cover: https://s2.loli.net/2022/10/13/F875eDMpca4zy9q.png
thumbnail: https://s2.loli.net/2022/10/13/F875eDMpca4zy9q.png
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