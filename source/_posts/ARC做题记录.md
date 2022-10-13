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
