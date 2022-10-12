---
title: Kruskal重构树
date: 2022-06-13 22:44:55
tags: 
- 图论
- Kruskal重构树
cover: https://s2.loli.net/2022/08/18/xhXHtL1yarSJQ8b.jpg
thumbnail: https://s2.loli.net/2022/08/18/xhXHtL1yarSJQ8b.jpg
categories : 
- 学习笔记
toc: true


---



浅谈重构树

<!-- more -->


# Kruskal 重构树

### 简介

Kruskal重构树其实就是在Kruscal算法进行的过程中，每一次加边都会合并两个集合，我们可以新建一个点，将这个点的点权设为新加的边的权值，同时将两个集合的根节点分别设为新建的点的左儿子和右儿子。然后将两个集合和新建点合并成一个集合。将新建点设为根。

这样建成的一棵二叉树就是Kruskal重构树。


如：

![](https://oi-wiki.org/graph/images/mst5.png)

此图的Kruskal重构树如下：

![](https://oi-wiki.org/graph/images/mst6.png)



### 性质

> - 该树满足二叉堆的性质；
> - 这颗二叉树的节点个数为$2n-1$ ，深度最大为$n$;
> - 重构树中代表原树中的点的节点全是叶子节点，其余节点都代表了一条边的边权；
> - **原图中两个点之间的所有简单路径上最大边权的最小值 = Kruskal 重构树上两点之间的 LCA 的权值**。

因为在加边的时候所有的边都是已经排序过的所以**符合二叉堆**的性质。

又因为二叉堆的性质所以**Kruskal 重构树上两点之间的 LCA 的权值即为原图中两个点之间的所有简单路径上最大边权的最小值**。

**若求两个点之间的所有简单路径上最小边权的最大值，要建最大生成树**。

### 构造

首先对边排序

然后使用并查集辅助加边：


每新建一条边时，新建一个点，设新建点的权值为新加边的边权，合并集合。

代码：

~~~c++
void kruskal()
{
    sort(e+1,e+m+1,cmp);
    for(int i=1;i<=n*2;i++)f[i]=i;// 2n-1个节点
    for(int i=1;i<=m;i++)
    {
        if(cnt==2*n-1)break;
        int x=Find(e[i].u),y=Find(e[i].v);
        if(x==y)continue;
        cnt++;
        f[x]=f[y]=cnt;
        tree[cnt].push_back(y);
        tree[cnt].push_back(x);
        w[cnt]=e[i].c;
    }
    return;
}
~~~

时间复杂度$O(nlog_2n)$。

### 应用

**Kruskal重构树能够更快有效解决一些静态的树剖问题，而且复杂度还很优秀。**

[luogu U92652 【模板】Kruskal重构树](https://www.luogu.com.cn/problem/U92652)

一道板子题（**注意建成的应是一个森林**）。

代码：

~~~c++
#include<bits/stdc++.h>
using namespace std;
const int Max=300010;
int n,m,q,cnt;
struct node{
    int u,v,c;
}e[Max];
int f[Max*2],w[Max*2],lg[Max*2];
int depth[Max*2],fa[Max*2][30];
vector<int> mp[Max*2];
int cmp(node x,node y)
{
    return x.c<y.c;
}
int Find(int x)
{
    if(x==f[x])return x;
    return f[x]=Find(f[x]);
}
void kruskal()
{
    for(int i=1;i<=n*2;i++)f[i]=i;
    sort(e+1,e+m+1,cmp);
    for(int i=1;i<=m;i++)
    {
        int x=Find(e[i].u),y=Find(e[i].v);
        if(x==y)continue;
        cnt++;
        f[x]=cnt;f[y]=cnt;
        w[cnt]=e[i].c;
        mp[cnt].push_back(x);
        mp[cnt].push_back(y);
    }
    return;
}
void dfs(int now,int father)
{
    depth[now]=depth[father]+1;
    fa[now][0]=father;
    for(int i=1;i<=lg[depth[now]];i++)
        fa[now][i]=fa[fa[now][i-1]][i-1];
    for(int i=0;i<mp[now].size();i++)
    {
        int x=mp[now][i];
        if(depth[x])continue;
        dfs(x,now);
    }
    return;
}
int LCA(int x,int y)
{
    if(Find(x)!=Find(y))return -1;
    if(depth[x]<depth[y])swap(x,y);
    while(depth[x]>depth[y])
        x=fa[x][lg[depth[x]-depth[y]]];
    if(x==y)return w[x];
    for(int i=lg[depth[x]];i>=0;i--)
    {
        if(fa[x][i]==fa[y][i])continue;
        x=fa[x][i];
        y=fa[y][i];
    }
    return w[fa[x][0]];
}
int main()
{
    scanf("%d%d%d",&n,&m,&q);
    cnt=n;
    for(int i=1;i<=m;i++)
        scanf("%d%d%d",&e[i].u,&e[i].v,&e[i].c);
    kruskal();
    for(int i=1;i<=n;i++)
        lg[i]=lg[i-1]+(i==1<<(lg[i-1]+1));
    for(int i=1;i<=cnt;i++)
    {
        if(f[i]!=i)continue;
        if(depth[f[i]])continue;
        dfs(f[i],0);
    }
    for(int i=1;i<=q;i++)
    {
        int x,y;scanf("%d%d",&x,&y);
        printf("%d\n",LCA(x,y));
    }
    return 0;
}
~~~



[luogu P1967 货车运输](https://www.luogu.com.cn/problem/P1967)

其实该问题可以转换为**求$x$号城市到$y$号城市所有简单路径上小边权的最大值**（注意该图建成的为一个森林）。

代码：

~~~c++
#include<bits/stdc++.h>
using namespace std;
const int maxn=1e4+10;
const int maxm=5e4+10;
int n,m,q,cnt;
struct node{
    int u,v,c;
}e[maxm];
int f[maxn*2],depth[maxn*2],father[maxn*2][30];
int lg[maxn*2],w[maxn*2];
vector<int> mp[maxn*2];
int cmp(node x,node y)
{
    return x.c>y.c;
}
int Find(int x)
{
    if(x==f[x])return x;
    return f[x]=Find(f[x]);
}
void kruscal()
{
    for(int i=1;i<=n*2;i++)f[i]=i;
    sort(e+1,e+m+1,cmp);
    for(int i=1;i<=m;i++)
    {
        int x=Find(e[i].u),y=Find(e[i].v);
        if(x==y)continue;
        cnt++;
        f[x]=f[y]=cnt;w[cnt]=e[i].c;
        mp[cnt].push_back(x);
        mp[cnt].push_back(y);
    }
    return;
}
void dfs(int now,int fa)
{
    depth[now]=depth[fa]+1;
    father[now][0]=fa;
    for(int i=1;i<=lg[depth[now]];i++)
        father[now][i]=father[father[now][i-1]][i-1];
    for(int i=0;i<mp[now].size();i++)
    {
        int x=mp[now][i];
        if(depth[x])continue;
        dfs(x,now);
    }
    return;
}
int LCA(int x,int y)
{
    if(Find(x)!=Find(y))return -1;
    if(depth[x]<depth[y])swap(x,y);
    while(depth[x]>depth[y])
        x=father[x][lg[depth[x]-depth[y]]];
    if(x==y)return w[x];
    for(int i=lg[depth[x]];i>=0;i--)
    {
        if(father[x][i]==father[y][i])continue;
        x=father[x][i];y=father[y][i];
    }
    return w[father[x][0]];
}
int main()
{
    scanf("%d%d",&n,&m);
    for(int i=1;i<=m;i++)
        scanf("%d%d%d",&e[i].u,&e[i].v,&e[i].c);
    cnt=n;
    kruscal();
    for(int i=1;i<=n;i++)
        lg[i]=lg[i-1]+(i==1<<(lg[i-1]+1));
    for(int i=1;i<=cnt;i++)
    {
        if(f[i]!=i)continue;
        if(depth[f[i]])continue;
        dfs(f[i],0);
    }
    scanf("%d",&q);
    for(int i=1;i<=q;i++)
    {
        int x,y;scanf("%d%d",&x,&y);
        printf("%d\n",LCA(x,y));
    }
    return 0;
}
~~~



[luogu P4768 [NOI2018] 归程](https://www.luogu.com.cn/problem/P4768)

这道题主要在于求**最小的步行路程，不用考虑开车所经过的路程**。

所以我们只需要**两点之间路径上的边权最小值最大**即可，设这个值为$h$,若$h>S$,则步行路程为零，若$h\le S$，我们便需要去判断在哪里下车。

在Kruskal重构树中，**任意节点的子树节点都是可以相互抵达**的，所以我们可以用树上倍增去求出，这棵树上**大于水位线的最小值**，然后输出这个节点子树中，到达终点的最短路的最小值。

最短路+树上倍增+Kruskal重构树。

代码：

~~~c++
#include<bits/stdc++.h>
#define ll long long
using namespace std;
const int maxn=2e5+10;
const int maxm=4e5+10;
const ll INF=5147483647;
int T,n,m,q,k,s,cnt;ll lastans;
int f[maxn*2],lg[maxn];
int depth[maxn*2],fa[maxn*2][31];
struct node{
    int u,v,l,a;
}e[maxm];
struct road{
    int to,cost;
};
struct power{
    ll w,l;
}p[maxn*2];
vector<road> mp[maxn];
vector<int> tree[maxn*2];
typedef pair<ll,int> Pair;
void _clean()
{
    memset(f,0,sizeof(f));
    memset(depth,0,sizeof(depth));
    for(int i=0;i<=cnt;i++)
        for(int j=0;j<=30;j++)
            fa[i][j]=0;
    for(int i=1;i<=n;i++)mp[i].clear();
    for(int i=1;i<=cnt;i++)tree[i].clear();
    cnt=0;lastans=0;
}
void makelog()
{
    for(int i=1;i<=maxn;i++)
        lg[i]=lg[i-1]+(i==1<<(lg[i-1]+1));
    return;
}
bool cmp(node x,node y)
{
    return x.a>y.a;
}
int Find(int x)
{
    if(x==f[x])return x;
    return f[x]=Find(f[x]);
}
void kruscal()
{
    sort(e+1,e+m+1,cmp);
    for(int i=1;i<=n*2;i++)f[i]=i;
    for(int i=1;i<=m;i++)
    {
        if(cnt==2*n-1)break;
        int x=Find(e[i].u),y=Find(e[i].v);
        if(x==y)continue;
        cnt++;
        f[x]=f[y]=cnt;
        tree[cnt].push_back(y);
        tree[cnt].push_back(x);
        p[cnt].w=e[i].a;
    }
    for(int i=1;i<=cnt;i++)p[i].l=INF;
    return;
}
void dij()
{
    priority_queue<Pair,vector<Pair>,greater<Pair> > q;
    bool vis[maxn];ll dis[maxn];
    memset(vis,false,sizeof(vis));
    for(int i=1;i<=n;i++)dis[i]=INF;
    dis[1]=0;
    q.push(make_pair(0,1));
    while(!q.empty())
    {
        int x=q.top().second;
        int c=q.top().first;
        q.pop();
        if(vis[x])continue;
        vis[x]=true;
        for(int i=0;i<mp[x].size();i++)
        {
            if(dis[mp[x][i].to]>dis[x]+mp[x][i].cost)
            {
                dis[mp[x][i].to]=dis[x]+mp[x][i].cost;
                q.push(make_pair(dis[mp[x][i].to],mp[x][i].to));
            }
        }
    }
    for(int i=1;i<=n;i++)p[i].l=dis[i];
    return;
}
void dfs(int now,int father)
{
    depth[now]=depth[father]+1;
    fa[now][0]=father;
    for(int i=1;i<=lg[depth[now]];i++)
        fa[now][i]=fa[fa[now][i-1]][i-1];
    for(int i=0;i<tree[now].size();i++)
    {
        dfs(tree[now][i],now);
        p[now].l=min(p[now].l,p[tree[now][i]].l);// 更新最短路最小值
    }
    return;
}
ll ask(int x,int y)
{
    for(int i=lg[depth[x]];i>=0;i--)
        if(p[fa[x][i]].w>y)x=fa[x][i];
    return p[x].l;
}
int main()
{
    makelog();
    scanf("%d",&T);
    while(T--)
    {
        scanf("%d%d",&n,&m);
        cnt=n;
        for(int i=1;i<=m;i++)
        {
            scanf("%d%d%d%d",&e[i].u,&e[i].v,&e[i].l,&e[i].a);
            mp[e[i].u].push_back((road){e[i].v,e[i].l});
            mp[e[i].v].push_back((road){e[i].u,e[i].l});
        }
        kruscal();
        dij();
        dfs(cnt,0);
        scanf("%d%d%d",&q,&k,&s);
        for(int i=1;i<=q;i++)
        {
            int x,y;scanf("%d%d",&x,&y);
            int vx=(x+k*lastans-1)%n+1;
            int py=(y+k*lastans)%(s+1);
            lastans=ask(vx,py);
            printf("%lld\n",lastans);
        }
        _clean();
    }
    return 0;
}
~~~

**完结撒花~~**

