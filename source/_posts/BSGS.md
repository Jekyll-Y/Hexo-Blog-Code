---
title: BSGS
date: 2022-07-24 08:27:30
tags:
- 数论
- BSGS
cover: https://s2.loli.net/2022/08/15/e8XTFSE6tnVmJZW.jpg
thumbnail: https://s2.loli.net/2022/08/15/e8XTFSE6tnVmJZW.jpg
categories : 
- 学习笔记
toc: true
---


Baby - Step - Giant - Step

<!-- more -->

# BSGS 


## 前置知识

**同余**

## BSGS

**BSGS（baby-step giant-step）** (~~北上广深，拔山盖世~~)是用来解决形如
$$
a^x \equiv b \quad (\bmod m)
$$
的高次同余方程，其中 $a \perp m$

首先$0 \le x < m$（就$m$个不同的得数），设$x=A \sqrt{m}-B$，其中$0 \le A,B\le \sqrt{m}$，方程变为：
$$
a^{A \sqrt{m}-B} \equiv b \quad (\bmod m) 
$$
由于 $a \perp m$移项可得：
$$
a^{A \sqrt{m}} \equiv ba^{B} \quad (\bmod m)
$$
由于$a,b,m$均已知可以考虑枚举$B$用$map$存储对应的值，然后再枚举$A$，检查$map$中是否有值对应

因为$A,B$均不大于$\sqrt{m}$，所以时间复杂度为$O(\sqrt{n})$。（没算$map$）

[题目](https://www.luogu.com.cn/problem/P3846)

~~~c++
#include<bits/stdc++.h>
#define ll long long
using namespace std;
ll p,b,n;
map<ll,ll> vis;
ll BSGS()
{
    if(1%p==n%p)return 0;
    int k=sqrt(p)+1;ll j=n%p;
    for(int i=0;i<k;i++)
    {
        vis[j]=i;
        j=j*b%p;
    }
    ll x=1;
    for(int i=1;i<=k;i++)x=x*b%p;
    j=x;
    for(int i=1;i<=k;i++)
    {
        if(vis.count(j))return i*k-vis[j];
        j=x*j%p;
    }
    return -1;
}
int main()
{
    scanf("%lld%lld%lld",&p,&b,&n);
    ll ans=BSGS();
    ans==-1?printf("no solution"):printf("%lld",ans);
    return 0;
}
~~~

## exBSGS

问题仍然是去解决一个形如
$$
a^x \equiv b \quad (\bmod m)
$$
的高次同余方程，但**不保证**$a \perp m$

考虑用**扩展BSGS（exBSGS）**(~~无限宝石公式~~)来解决这个问题

此时$a$和$m$不一定互质，我们可以将式子进一步化简为：
$$
\frac{a^x}{\gcd(a,m)} \equiv \frac{b} {\gcd(a,m)} \quad (\bmod \frac{m}{\gcd(a,m)})
$$
将左边提出一项
$$
a^{x-1} \frac{a}{\gcd(a,m)} \equiv \frac{b} {\gcd(a,m)} \quad (\bmod \frac{m}{\gcd(a,m)})
$$
接下来不断除以$\gcd(a,m)$直到$a$与$m$互质，然后用BSGS求解

由于最后我们将式子递归执行了$k$层，此时式子变为
$$
a^{x-k} \frac{a^k}{\gcd^k(a,m)} \equiv \frac{b} {\gcd^k(a,m)} \quad (\bmod \frac{m}{\gcd^k(a,m)})
$$
最后利用BSGS求解出$x$后应当再加上$k$，$x+k$即为该方程的解。

~~~c++
#include<bits/stdc++.h>
#define ll long long
using  namespace std;
const int maxn=5e6+10;
map<ll,ll> vis;
ll gcd(ll a,ll b)
{
    if(b==0)return a;
    return gcd(b,a%b);
}
ll qpow(ll a,ll b,ll p)
{
    ll t=1;
    while(b!=0)
    {
        if(b&1)t=(t*a)%p;
        a=a*a%p;b>>=1;
    }
    return t;
}
ll bsgs(ll a,ll b,ll p,ll k)
{
    vis.clear();
    int m=sqrt(p)+1;
    ll r=b%p;
    for(int i=0;i<=m;i++)
    {
        vis[r]=i;
        r=r%p*a%p;
    }
    ll l=k%p,x=qpow(a,m,p);
    for(int i=0;i<=m;i++)
    {
        if(vis.count(l)&&i*m-vis[l]>=0)
            return i*m-vis[l];
        l=l*x%p;
    }
    return -1e9;
}
ll exbsgs(ll a,ll b,ll p,ll m)
{
    a%=p,b%=p;
    if(b==1||p==1&&m==1)return 0;
    ll d=gcd(a,p);
    if(b%d!=0)return -1;
    if(d==1)return bsgs(a,b,p,m);
    else return exbsgs(a,b/d,p/d,(m*a/d)%p)+1;
}
int main()
{
    ll a,b,p;
    while(scanf("%lld%lld%lld",&a,&p,&b)&&a&&b&&p)
    {
        ll res=exbsgs(a,b,p,1);
        if(res<0)
            printf("No Solution\n");
        else printf("%lld\n",res);
    }
    return 0;
}
~~~

（好像用递归写的很少，大数据肯定是可以过的，但好像过不了洛谷上的hack小数据，不过小数据时我觉得直接可以~~暴力枚举~~）

