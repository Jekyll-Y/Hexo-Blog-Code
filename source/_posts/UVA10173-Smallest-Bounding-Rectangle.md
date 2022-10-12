---
title: UVA10173 Smallest Bounding Rectangle
date: 2022-06-29 22:45:12
tags: 
- 旋转卡壳
- 计算几何
cover: https://s2.loli.net/2022/08/18/txvCwgc3KP296XM.png

thumbnail: https://s2.loli.net/2022/08/18/txvCwgc3KP296XM.png
categories : 
- 题解
  
toc: true
---



UVA10173 Smallest Bounding Rectangle

<!-- more -->

## 题意

给定多组数据，每组数据给定 $n$ 个坐标，求能覆盖这$n$个点的最小矩形，并输出其面积。

## 思路

其实这道题跟[P3187 [HNOI2007]最小矩形覆盖](https://www.luogu.com.cn/problem/P3187)并没有多大的区别，而且也省去了求矩形顶点坐标的步骤，（当时内心是非常开心，但发现这数据比P3187强得多的时候，内心是崩溃的。。。），但这道题显然数据是强得太多了，我一份A了P3187的代码并没有过不了这道题。。（我后来改了一下找左边点时的旋转方向好像就A了）想要比较强的数据的话可以上[这里](https://www.udebug.com/UVa/10173)。

对于最小矩形覆盖，其最小矩形的一条边必定在这$n$个点的凸包上，这样我们就先求出凸包再使用旋转卡壳，找到在以当前边为矩形的一条边时，在最左边，最右边，最上边的点，然后用向量加减的方法求出矩形的高和宽，再进一步求面积就好了。

![](https://cdn.luogu.com.cn/upload/image_hosting/3u9dki2d.png)

（别忘了会出现最小矩形覆盖无解的情况）。

## Code
~~~c++
#include<bits/stdc++.h>
#define double long double 
#define eps 1e-18
using namespace std;
const int maxn=5e4+10;
struct geometric {
    double x, y;
    geometric(double X=0, double Y=0) :x(X), y(Y) {}
    friend geometric operator + (const geometric a, const geometric b) { return geometric(a.x+b.x, a.y+b.y); }
    friend geometric operator - (const geometric a, const geometric b) { return geometric(a.x-b.x, a.y-b.y); }
    friend geometric operator * (const geometric a, double p) { return geometric(a.x*p, a.y*p); }
    friend geometric operator / (const geometric a, double p) { return geometric(a.x/p, a.y/p); }// 向量的四则运算
}p[maxn], st[maxn];
int n, cnt, top;double S=1e20;
double dis(geometric a, geometric b) { return sqrt((a.x-b.x)*(a.x-b.x)+(a.y-b.y)*(a.y-b.y)); } // 向量模长
double dot(geometric a1, geometric a2, geometric b1, geometric b2) { return (a2.x-a1.x)*(b2.x-b1.x)+(a2.y-a1.y)*(b2.y-b1.y); }// 点积
double cross(geometric a1, geometric a2, geometric b1, geometric b2) { return (a2.x-a1.x)*(b2.y-b1.y)-(a2.y-a1.y)*(b2.x-b1.x); } // 叉积
bool cmp(geometric a, geometric b)
{
    double tmp;
    tmp=cross(p[1], a, p[1], b);
    if(tmp>0)return true;
    if(tmp==0)return dis(p[1], a)<=dis(p[1], b);
    return false;
}
int main()
{
    while(true)
    {
        memset(st,0,sizeof(st));
        memset(p,0,sizeof(p));
        scanf("%d", &n);
        if(n==0)break;
        top=0;cnt=0;S=1e20;
        for(int i=1;i<=n;i++)
        {
            double x, y;
            scanf("%Lf%Lf", &x, &y);
            p[++cnt]=geometric(x, y);
            if(i==1)
                continue;
            if(p[cnt].y<p[1].y)
                swap(p[cnt], p[1]);
            if(p[cnt].y==p[1].y&&p[cnt].x>p[1].x)
                swap(p[cnt], p[1]);
        }
        sort(p+2, p+cnt+1, cmp);
        st[++top]=p[1];
        for(int i=2;i<=cnt;i++)
        {
            while(top>1&&cross(st[top-1], st[top], st[top], p[i])<=0)
                top--;
            st[++top]=p[i];
        }
        st[++top]=p[1];

        // 求凸包
        if(top<=3)
        {
            printf("0.0000\n");
            continue;
        }
        // 凸包顶点只有两个时，最小矩形覆盖无解。
        st[0]=st[top-1];
        for(int i=2, j=3,l,r;i<=top;i++)
        {
            r=(i==top)?1:i;l=i-1;
            while(cross(st[i-1], st[i], st[i], st[j])<cross(st[i-1], st[i], st[i], st[j+1]))
                j=(j==top-1)?1:j+1;
            // 找最上边的点
            while(dot(st[i-1], st[i], st[i], st[r])<dot(st[i-1], st[i], st[i], st[r+1]))
                r=(r==top-1)?1:r+1;
            // 找最右边的点
            while(dot(st[i], st[i-1], st[i-1], st[l])<dot(st[i], st[i-1], st[i-1], st[l-1]))
                l=(l==1)?top-1:l-1;
            // 找最左边的点
            double wide, high, len=dis(st[i-1], st[i]);
            wide=fabs(dot(st[i], st[i-1], st[i-1], st[l]))/len+fabs(dot(st[i-1], st[i], st[i], st[r]))/len+len; // 宽
            high=fabs(cross(st[i-1], st[i], st[i-1], st[j]))/len; // 高
            S=min(S, high*wide);
        
        }
        printf("%.4Lf\n", S);
    }
    return 0;
}
~~~
**感谢观看！！！**
