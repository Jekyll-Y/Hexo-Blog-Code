---
title: 扩展Lucas定理
date: 2022-07-19 19:36:03
tags: 
- 数论
- 组合数学
cover: https://s2.loli.net/2022/08/15/sAJ6ovVGSau5E9I.png
thumbnail: https://s2.loli.net/2022/08/15/sAJ6ovVGSau5E9I.png
categories : 
- 学习笔记
toc: true

---


用的比较多的lucas定理吧



<!-- more -->

# 扩展Lucas定理

## 前置知识

**Lucas定理**

**中国剩余定理**

**逆元**

## 问题

首先 $Lucas$ 和 $ExLucas$ 都是用来求解形如：

$$
C^m_n \mod p
$$

的问题

对于 $p$ 为质数的情况就可以直接用 $Lucas$ 来解决，但是对于 $p$ 不是质数的话，就需要用到 $ExLucas$ 。


## 求解

由于 $p$ 不为质数可以将 $p$ 进行质因数分解:
（不分解肯定要T飞）
$$
p= \prod_{i=1}^n p_i^{k_i}
$$

分解完后由于两两互质可以用中国剩余定理进行合并求解。

进一步化简：
$$
C^m_n \mod p^k
$$

为：

$$
\dfrac{n!}{m! \times (n-m)!} \mod p^k
$$

显然需要求逆元但是分母上的两项不一定与模数互质，不能求出直接的逆元，进行进进一步拆分，

提出 $n!$ 的中的 $p$ 的倍数：
$$
n! = p ^ {\left\lfloor\frac{n}{p}\right\rfloor} \times \left\lfloor\frac{n}{p}\right\rfloor ! \times \prod_{p \nmid i}^n i
$$

首先 $p ^ {\left\lfloor\frac{n}{p}\right\rfloor}$ 可以直接快速幂，

$$
\left\lfloor\frac{n}{p}\right\rfloor ! 
$$
考虑递归求解，那么后面不能被整除的数该怎么办？

仔细观察:thinking: 可以看出，有循环节，那么我们可以这样统计:

$$
((p-1)!)^{\left\lfloor\frac{n}{p}\right\rfloor} \mod p
$$


这里的 p  为模数 p的k次方哦


可以直接统计阶乘再加上一个快速幂，由于有
$$ p ^ {\left\lfloor\frac{n}{p}\right\rfloor} $$
这一项，不能直接求逆元，应在求组合数时处理。

最后用中国剩余定理合并即为答案。

另外对于统计$p$的指数需要用到一个柿子：
$$
\sum_{i=1}\left\lfloor\frac{n}{p^i}\right\rfloor \\\\
$$

其实就是统计贡献。

时间复杂度为 $O(\log n)$ 级别的 。

[题目](https://www.luogu.com.cn/problem/P4720)

这里放上我的代码：

~~~c++
#include<bits/stdc++.h>
#define ll long long 
using namespace std;
const int maxn=1e6+10;
ll cnt,prime[maxn],b[maxn],tot,pk[maxn];
bool vis[maxn];
ll qpow(ll a,ll b,ll mod)
{
    ll tot=1;
    while(b!=0)
    {
        if(b&1)tot=(tot*a)%mod;
        a=a*a%mod;b>>=1;
    }
    return tot;
}// 快速幂
ll fac(ll x,ll p,ll k)// k 为 p的k次方
{
    if(!x)return 1;
    ll f=1;
    for(int i=2;i<=k;i++)
        if(i%p)f=f*i%k;// 处理循环节
    f=qpow(f,x/k,k);
    for(int i=2;i<=x%k;i++)
        if(i%p)f=f*i%k;// 多余部分
    return f*fac(x/p,p,k)%k;// 计算提出p后的部分
}
ll sta(ll x,ll p)
{
    ll sum=0;
    for(ll i=p;i<=x;i*=p)sum+=x/i;
    return sum;
}// 统有多少个因子p
void exgcd(ll a,ll b,ll &x,ll &y)
{
    if(b==0){x=1,y=0;return;}
    exgcd(b,a%b,x,y);
    ll z=x;x=y;y=z-a/b*y;
}// 扩欧
ll inv(ll v,ll p)
{
    ll x,y;
    exgcd(v,p,x,y);
    return (x+p)%p;
} // 逆元
ll C(ll n,ll m,ll p,ll k)
{
    if(n<m)return 0;
    return fac(n,p,k)%k*inv(fac(m,p,k),k)%k*inv(fac(n-m,p,k),k)%k*qpow(p,sta(n,p)-sta(m,p)-sta(n-m,p),k)%k;
}// 组合数
ll exlucas(ll n,ll m,ll mod)
{
    ll x=mod;
    for(int i=2;x!=1;i++)
    {
        if(x%i==0)
        {
            ll tmp=1;
            while(x%i==0)
            {
                tmp*=i;
                x/=i;
            }
            b[++tot]=C(n,m,i,tmp);
            pk[tot]=tmp;
        }//质因数分解，和计算部分答案
    }
    ll ans=0;
    for(int i=1;i<=tot;i++)
    {
        ll Mi=mod/pk[i];
        ans=(ans+Mi*b[i]*inv(Mi,pk[i]))%mod;
    }
    return ans%mod;
}// CRT 合并统计答案
int main()
{
    ll n,m,mod;
    scanf("%lld%lld%lld",&n,&m,&mod);
    printf("%lld",exlucas(n,m,mod)%mod);
    return 0;
}
~~~
:scream_cat: :scream_cat: :scream_cat:

## 应用

[[国家集训队]礼物](https://www.luogu.com.cn/problem/P2183)

其实就是求：

$$
\prod_{i=1}^m C_{n-\sum_{j=1}^{i-1} w[j]}^{w[i]} \mod P 
$$

由于 $P$ 不为质数所以需要用到 $ExLucas$ 

code：

~~~c++
#include<bits/stdc++.h>
#define ll long long 
using namespace std;
const int maxn=1e5+10;
ll w[maxn],S[maxn];
ll qpow(ll a,ll b,ll p)
{
    ll t=1;
    while(b!=0)
    {
        if(b&1)t=(t*a)%p;
        a=a*a%p;b>>=1;
    }
    return t%p;
}
ll stac(ll n,ll p)
{
    ll sum=0;
    for(ll i=p;i<=n;i*=p)sum+=n/i;
    return sum;
}
void exgcd(ll a,ll b,ll &x,ll &y)
{
    if(b==0){x=1,y=0;return;}
    exgcd(b,a%b,x,y);
    ll z=x;x=y;y=z-a/b*y;
}
ll inv(ll v,ll p)
{
    ll x,y;
    exgcd(v,p,x,y);
    return(x+p)%p;
}
ll fact(ll n,ll p,ll k)
{
    if(n==0)return 1;
    ll res=1;
    for(ll i=1;i<=k;i++)
        if(i%p)res=res*i%k;
    res=qpow(res,n/k,k);
    for(ll i=1;i<=n%k;i++)
        if(i%p)res=res*i%k;
    return res*fact(n/p,p,k)%k;
}
ll C(ll n,ll m,ll p,ll k)
{
    if(n<m)return 0;
    return fact(n,p,k)%k*inv(fact(m,p,k),k)%k*inv(fact(n-m,p,k),k)%k*qpow(p,stac(n,p)-stac(m,p)-stac(n-m,p),k)%k;
}
ll exlucas(ll n,ll m,ll mod)
{
    int k=0;
    ll x=mod,b[maxn],a[maxn];
    for(ll i=2;x!=1;i++)
    {
        if(x%i==0)
        {
            ll tmp=1;
            while(x%i==0)
            {
                tmp*=i;
                x/=i;
            }
            b[++k]=tmp;
            a[k]=C(n,m,i,tmp);
        }
    }
    ll ans=0;
    for(int i=1;i<=k;i++)
    {
        ll Mi=mod/b[i];
        ans=(ans+Mi*inv(Mi,b[i])*a[i])%mod;
    }
    return ans;
}
int main()
{
    ll n,m,mod;
    scanf("%lld",&mod);
    scanf("%lld%lld",&n,&m);
    for(int i=1;i<=m;i++)
    {
        scanf("%lld",&w[i]);
        S[i]=S[i-1]+w[i];
    }
    if(S[m]>n)
    {
        printf("Impossible\n");
        return 0;
    }
    ll ans=1;
    for(int i=1;i<=m;i++)
        ans=(ans*exlucas(n-S[i-1],w[i],mod))%mod;
    printf("%lld",ans);
    return 0;
}
~~~
