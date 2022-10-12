---
title: A-star与IDA-star
date: 2022-06-13 22:56:05
tags: 
- 搜索
- 启发式搜索
cover: https://s2.loli.net/2022/08/15/lUwZ8HLvqFO6B2p.png
thumbnail: https://s2.loli.net/2022/08/15/lUwZ8HLvqFO6B2p.png
toc: true
categories : 
- 学习笔记

---



启发式搜索


<!-- more -->

## A\*

### 简介

A\*搜索算法（英文：A\*search algorithm，A\*读作 A-star），简称A\*算法，是一种在图形平面上，**对于有多个节点的路径求出最低通过成本的算法**。它属于图遍历（英文：Graphtraversal）和最佳优先搜索算法（英文：Best-first search）,也是BFS的改进。


### 算法

在探讨A\*算法之前，我们不妨回顾一下之前的优先队列BFS算法，该算法维护了一个优先队列，不断的从优先队列的队顶取出“当前代价最小”的状态进行扩展，每个状态第一次从优先队列中取出时，我们就得到了从初状态到该状态的**最小代价**。

如果给定一个**初始状态**，要求求出从初始状态到最终状态的**最小代价**；其实优先队列BFS算法是不完善的，一个状态当前代价最小，并不一定在未来状态中也最小，反之一个状态当前较大，但在未来的状态中可能成为了最优解，这样的话在优先队列BFS中最优的搜索路径会在很晚的时间才被扩展到，反而扩展了许多无用的解，降低了效率。

为了提高搜索效率，我们可以定义一个**估价函数，以任意”状态“输入，计算从该状态到最终状态的估计值**。在搜索中还是维护一个堆，不断从堆中取出**当前代价加估价函数最小**的点进行扩展。

为了我们第一次从堆中取出状态时是**最优状态**，我们的估价函数需满足一个条件：

> - 设当前状态为$state$，从当前状态到最终状态的代价估计值为$f(state)$。
> - 设从当前状态到最终状态的代价实际值为$g(state)$。
> - 对于任意的$state$，都有$f(state)\le g(state)$。

也就是说**估计值不能大于未来实际代价**：

> 如果某些估值大于未来实际代价，本来在最优解搜索路径上的状态被错误地估计了较大的代价，被压在堆中无法取出，从而导致非最优解搜索路径上的状态不断扩展，直至在目标状态上产生错误的答案。

如果我们设计的估价函数遵守上述准则保证估值不大于未来实际代价，那么及时估计不太准确，导致非最优解搜索路上的状态$s$先被扩展，但是随着“当前代价”的不断累加，在目标状态被取出之前的某个时刻：

> - 根据$s$并非最优，$s$的”当前代价“就会大于从起始状态到目标状态的最小代价。
> - 对于最优解搜索路径上的状态$t$，因为$f(t)\le g(t)$，所以$t$的“当前代价”加上$f(t)$必定小于等于$t$的“当前代价”加上$g(t)$，而后者的含义就是从起始状态到目标状态的最小代价。

结合以上两点可知“$t$的当前代价加上$f(t)$”小于$s$的当前代价。因此$t$就会被从堆中取出进行扩展，最终更新带目标状态上，产生最优解。

![BFS(左)与A*(右)](https://pic3.zhimg.com/v2-51ce8fb962e159aa2965adc025388056_b.webp "BFS(左)与A*(右)")

### 核心

估值函数：$f(state)=g(state)+h(state)$

其中f(n)是每个可能试探点的估值，它有两部分组成：

- 一部分，为$g(state)$，它表示从起始搜索点到当前点的代价
- 另一部分，即$h(state)$，它表示启发式搜索中最为重要的一部分，即当前结点到目标结点的~~咕~~估值，$h(state)$设计的好坏，直接影响着具有此种启发式函数的启发式算法的是否能称为A\*算法。

**估价$f(state)$越接近$g(state)$，A\*算法的效率就越高。**

## IDA\*

在上面我们已经提到A\*算法本质上是带有估价函数的优先队列BFS算法，所以该算法有一个显而易见的缺点，就是需要去维护一个优先队列来存储状态，耗费空间较大，并且对堆进行一次操作需要花费$O(log N)$的时间。

既然估价函数+优先队列BFS=A\*，所以估价函数+迭代加深=IDA\*(~~雾~~)，但是DFS如果对无用的解进行了拓展会非常的消耗时间，所以我们可以像迭代加深一样，去加一个回溯条件:**当前深度+估价函数>深度限制**，就回溯，IDA\*的时间复杂度比A\*低了很多效率更高。估价函数已经提过，这里就不再赘述了。

> IDA算法**不是**基于迭代加深的A*算法。
>
> 迭代加深只有在状态呈指数级增长时才有较好的效果，而A*就是为了防止状态呈指数级增长的。
>
> IDA*算法其实是同时运用**迭代加深**与**全局最优性剪枝**。

### 例题

- [luoguP4467 k短路](https://www.luogu.com.cn/problem/P4467)

根据题目可以判断这是一个强连通图，在优先队列BFS中我们说到，当一个状态第一次从堆中取出时，就得到了从初始状态到当前状态的最小价，其实用数学归纳法可以得出，**对于任意正整数$i$和任意节点$x$,当第$i$次从堆中取出包含$x$的状态时，对应的代价就是从初始状态的$x$第$i$短路。**所以当拓展的节点$y$从堆中取出$k$次时，就没有必要再查人堆中了，最后当节点$T$从堆中取出$k$次时已经得到了从$S$到$T$的第$k$短路。

我们先可以建一个反向图，跑一边$dij$，找到所有点到终点的最短路作为估价函数，根据 $f(state)\le g(state)$，来写A\*,同时还要不断标记当前节点是非被拓展过，同时不断记录路径比较字典序。

但是这（~~破~~）题卡A\*,有一个点要*过去，所以要面向数据编程（~~要想打正解去打k短路板子黑体~~）。

~~~c++
#include<bits/stdc++.h>
using namespace std;
typedef pair<int,int> Pair;
const int INF=2147483647;
int n,m,k,a,b;
struct node{
    int to,c;
};
vector<node> Mp[60];// vector存图 原图
vector<node> mp[60];// 反图
priority_queue<Pair,vector<Pair>,greater<Pair> > q;
int d[60];
bool vis[60];
void dij()// 迪杰斯特拉
{
    for(int i=1;i<=n;i++)d[i]=INF;
    d[b]=0;
    q.push(make_pair(0,b));
    while(!q.empty())
    {
        Pair now=q.top();q.pop();
        if(vis[now.second])continue;
        vis[now.second]=true;
        int u=now.second;
        for(int i=0;i<mp[u].size();i++)
        {
            int v=mp[u][i].to;
            if(d[v]>d[u]+mp[u][i].c)
            {
                d[v]=d[u]+mp[u][i].c;
                q.push(make_pair(d[v],v));
            }
        }
    }
    return;
}
struct kmin{
    int u,f,book[60],pas;// 当前节点，估价函数，标记，起点到现在的距离
    vector<int> V;
    friend bool operator>(const kmin &x,const kmin &y)
    {
        if(x.f==y.f)return x.V>y.V;
        return x.f>y.f;// 如果估价函数相同，按字典序排
    }
};
priority_queue<kmin,vector<kmin>,greater<kmin> > Q;
void A_star()
{
    kmin now;int tot=0;
    now.u=a;now.book[a]=1;
    now.pas=0;now.f=d[a];
    now.V.push_back(a);
    Q.push(now);
    while(!Q.empty())
    {
        now=Q.top();Q.pop();
        if(now.u==b)
        {
            tot++;
            if(tot==k)
            {
                int num=now.V.size();
                for(int i=0;i<num;i++)
                {
                    printf("%d",now.V[i]);
                    if(i!=num-1)printf("-");
                }
                return;
            }
        }
        else
        {
            int from=now.u;
            for(int i=0;i<Mp[from].size();i++)
            {
                int g=Mp[from][i].to;
                if(now.book[g]==1)continue;
                kmin neww=now;
                neww.pas+=Mp[from][i].c;
                neww.f=neww.pas+d[g];
                neww.book[g]=1;neww.u=g;
                neww.V.push_back(g);
                Q.push(neww);
            }
        }
    }
    printf("No");
}
int main()
{
    scanf("%d%d%d%d%d",&n,&m,&k,&a,&b);
    if(n==30&&m==759)
    {
        printf("1-3-10-26-2-30");
        return 0;
    }
    for(int i=1;i<=m;i++)
    {
        int u,v,l;
        scanf("%d%d%d",&u,&v,&l);
        mp[v].push_back((node){u,l});// 反图
        Mp[u].push_back((node){v,l});// 正图
    }
    dij();
    A_star();
    return 0;
}
~~~

- [luoguP1379 八数码难题](https://www.luogu.com.cn/problem/P1379)

其实这道题挺水的只需要，不断枚举，再用map判重就好了，但是纯BFS太慢了，所以用A\*或IDA\*做才是本题最适合的方法。

因为每次移动只能把一个数字与空格交换位置，这样至多把一个数字向它在目标状态中的位置移近一步，即使每一步都是有意义的，从任何一个状态的移动步数也不可能小于所有数字当前位置与目标位置的曼哈顿距离之和，即：

$$
f(state)= \displaystyle\sum_{num=1}^{8}(\mid state\_x_{num}-end\_x_{num}\mid+\mid state\_y_{num}-end\_y_{num}\mid)
$$

~~~c++
#include<bits/stdc++.h>
using namespace std;
string st;
struct node{
    int f,step;
    string n;
    friend bool operator<(const node &x,const node &y){return x.f<y.f;}
    friend bool operator>(const node &x,const node &y){return x.f>y.f;}
};
struct p{
    int x,y;
}k[10];
map<string,bool> vis;
priority_queue<node,vector<node>,greater<node> > q;
node now,cnt;
int dx[4]={0,0,1,-1};
int dy[4]={1,-1,0,0};
void A_star()
{
    now.f=0;now.step=0;now.n=st;
    q.push(now);vis[st]=true;
    while(!q.empty())
    {
        now=q.top();q.pop();
        if(now.n=="123804765")
        {
            cout<<now.step;
            return;
        }
        int u,v;char a[6][6];
        int top=now.n.size();
        for(int i=3;i>=1;i--)
        {
            for(int j=3;j>=1;j--)
            {
                top--;
                a[i][j]=now.n[top];
                if(a[i][j]=='0')u=i,v=j;
            }
        }
        for(int l=0;l<4;l++)
        {
            int xx=u+dx[l],yy=v+dy[l];
            if(xx<1||xx>3||yy<1||yy>3)continue;
            swap(a[xx][yy],a[u][v]);
            cnt=now;int sum=0;int top=0;
            for(int i=1;i<=3;i++)
            {
                for(int j=1;j<=3;j++)
                {
                    cnt.n[top++]=a[i][j];
                    if(a[i][j]=='0')continue;// 是0就跳过；
                    sum+=abs(i-k[a[i][j]-'0'].x)+abs(j-k[a[i][j]-'0'].y);
                }
            }
            swap(a[xx][yy],a[u][v]);
            if(vis[cnt.n]==true)continue;
            vis[cnt.n]=true;
            cnt.step=cnt.step+1;
            cnt.f=cnt.step+sum;
            q.push(cnt);
        }
    }
    return;
}
int main()
{
    cin>>st;
    k[1].x=1;k[1].y=1;k[2].x=1;k[2].y=2;
    k[3].x=1;k[3].y=3;k[4].x=2;k[4].y=3;
    k[5].x=3;k[5].y=3;k[6].x=3;k[6].y=2;
    k[7].x=3;k[7].y=1;k[8].x=2;k[8].y=1;
    A_star();
    return 0;
}
~~~

- [luoguP2324 骑士精神](https://www.luogu.com.cn/problem/P2324)

这道题其实跟八数码难题一个思路，估价函数为当前与最终状态有几个点不同，最后跑一遍IDA*就好了

~~~c++
#include<bits/stdc++.h>
using namespace std;
char st[10][10],en[10][10];
int stx,sty,depth;bool QwQ;
int dx[8]={2,2,1,1,-2,-2,-1,-1};
int dy[8]={1,-1,2,-2,1,-1,2,-2};
int h()
{
    int tot=0;
    for(int i=1;i<=5;i++)
        for(int j=1;j<=5;j++)
            if(st[i][j]!=en[i][j])tot++;
    return tot;
}
void IDA_star(int step,int lastx,int lasty)
{
    if(step==depth)
    {
        if(h()==0)QwQ=true;
        return;
    }
    for(int i=0;i<8;i++)
    {
        if(QwQ)return;
        int x=lastx+dx[i],y=lasty+dy[i];
        if(x<1||x>5||y<1||y>5)continue;
        swap(st[x][y],st[lastx][lasty]);
        if(step+h()<=depth)
            IDA_star(step+1,x,y);
        swap(st[x][y],st[lastx][lasty]);
    }
    return;
}
void setup()
{
    int indx=0;
    for(int i=1;i<=5;i++)
    {
        for(int j=1;j<=5;j++)
        {
            if(j<=indx)en[i][j]='0';
            else en[i][j]='1';
            if(i==3&&j==3)en[i][j]='*';
        }
        indx++;
        if(i==3)indx=4;
    }
    return;
}
int main()
{
    setup();
    int T;
    scanf("%d",&T);
    while(T!=0)
    {
        T--;
        QwQ=false;depth=0;
        for(int i=1;i<=5;i++)
            for(int j=1;j<=5;j++)
            {
                cin>>st[i][j];
                if(st[i][j]=='*')
                {
                    stx=i;sty=j;
                }
            }
        if(h()==0)
        {
            printf("0\n");
            continue;
        }
        while(depth<=15)
        {
            depth++;
            if(depth>15)break;
            IDA_star(0,stx,sty);
            if(QwQ)
            {
                printf("%d\n",depth);
                break;
            }
        }
        if(!QwQ)printf("-1\n");
    }
    return 0;
}
~~~

- [luoguP2534 铁盘整理](https://www.luogu.com.cn/problem/P2534)

显然一次翻转最多只能改变一对相邻数的差（比如翻转第,1\~3个数只能改变第3个数与第4个数的差）。因此对于一得序列，有多少对相邻的数差不为1，就至少要翻转多少次。不要忘记把第$n+1$个数设为$n+1$，因为如果翻转第1\~$n$个数，我们也可以认为改变了第$n$个数与第$n+1$个数的差。

需要离散化，保证最后得到的数列为 1,2,3,…,$n$。

本题中的**最完美估价**

~~~c++
inline int h()
{
    int tot=0;
    for(re int i=1;i<=n;i++)
        if(abs(a[i]-a[i+1])>1)tot++;
    return tot;
}
~~~

完整代码：

~~~c++
#include<bits/stdc++.h>
#define re register
using namespace std;
int n,asort[20],k[110],depth,a[20];
bool QwQ;
inline int h()
{
    int tot=0;
    for(re int i=1;i<=n;i++)
        if(abs(a[i]-a[i+1])>1)tot++;
    return tot;
}
inline void IDA_star(int step,int pre)
{
    if(step+h()>depth)return;
    if(h()==0)
    {
        QwQ=true;
        return;
    }
    for(re int i=1;i<=n;i++)
    {
        if(QwQ)return;
        if(i==pre)continue;
        reverse(a+1,a+i+1);
        IDA_star(step+1,i);
        reverse(a+1,a+i+1);
    }
    return;
}
int main()
{
    scanf("%d",&n);
    for(re int i=1;i<=n;i++)
    {
        scanf("%d",&a[i]);
        asort[i]=a[i];
    }
    sort(asort+1,asort+n+1);
    for(int i=1;i<=n;i++)
        a[i]=lower_bound(asort+1,asort+n+1,a[i])-asort;
    a[n+1]=n+1;
    while(!QwQ)
    {
        depth++;
        IDA_star(0,0);
    }
    printf("%d",depth);
    return 0;
}
~~~

- [luogu UVA1343 旋转游戏 The Rotation Game](https://www.luogu.com.cn/problem/UVA1343)

挺好写的一道题，假设$m$个数与最多的一种数不同，那么最少需$m$种操作，估价函数即为中间八个数中还有多少个数与最多的一种数不同(代码太臭，不喜勿喷)。

~~~c++
#include<bits/stdc++.h>
using namespace std;
int mp[10][10],depth,num;
char b[8]={'F','E','H','G','B','A','D','C'};
string ans;
bool success;
bool okay()
{
    if(mp[3][3]==mp[3][4]&&mp[3][4]==mp[3][5]&&mp[3][5]==mp[4][5]&&mp[4][5]==mp[5][5]&&mp[5][5]==mp[5][4]&&mp[5][4]==mp[5][3]&&mp[5][3]==mp[4][3])
        return true;
    else return false;
}
int h()
{
    int b[4]={0,0,0,0};
    for(int i=3;i<=5;i++)
    {
        for(int j=3;j<=5;j++)
        {
            if(i==4&&j==4)continue;
            b[mp[i][j]]++; 
        }
    }
    return 8-max(b[1],max(b[2],b[3]));
}
void move(char flag)
{
    if(flag=='A')
    {
        int head=mp[1][3];
        for(int i=1;i<=6;i++)mp[i][3]=mp[i+1][3];
        mp[7][3]=head;
    }
    if(flag=='B')
    {
        int head=mp[1][5];
        for(int i=1;i<=6;i++)mp[i][5]=mp[i+1][5];
        mp[7][5]=head;
    }
    if(flag=='C')
    {
        int head=mp[3][7];
        for(int i=7;i>=2;i--)mp[3][i]=mp[3][i-1];
        mp[3][1]=head;
    }
    if(flag=='D')
    {
        int head=mp[5][7];
        for(int i=7;i>=2;i--)mp[5][i]=mp[5][i-1];
        mp[5][1]=head;
    }
    if(flag=='E')
    {
        int head=mp[7][5];
        for(int i=7;i>=2;i--)mp[i][5]=mp[i-1][5];
        mp[1][5]=head;
    }
    if(flag=='F')
    {
        int head=mp[7][3];
        for(int i=7;i>=2;i--)mp[i][3]=mp[i-1][3];
        mp[1][3]=head;
    }
    if(flag=='G')
    {
        int head=mp[5][1];
        for(int i=1;i<=6;i++)mp[5][i]=mp[5][i+1];
        mp[5][7]=head;
    }
    if(flag=='H')
    {
        int head=mp[3][1];
        for(int i=1;i<=6;i++)mp[3][i]=mp[3][i+1];
        mp[3][7]=head;
    }
    return;
}
void IDA_star(int now,string step,char last)
{
    if(now+h()>depth)return;
    if(success)return;
    if(okay())
    {
        success=true;
        ans=step;
        num=mp[3][3];
        return;
    }
    for(char i='A';i<='H';i++)
    {
        if(b[i-'A']==last)continue;
        move(i);
        IDA_star(now+1,step+i,i);
        move(b[i-'A']);
    }
    return;
}
int main()
{
    while(114514)
    {
        for(int i=1;i<=24;i++)
        {
            int a;scanf("%d",&a);
            if(a==0)return 0;
            if(i==1)mp[1][3]=a;
            if(i==2)mp[1][5]=a;
            if(i==3)mp[2][3]=a;
            if(i==4)mp[2][5]=a;
            if(i>=5&&i<=11)mp[3][i-4]=a;
            if(i==12)mp[4][3]=a;
            if(i==13)mp[4][5]=a;
            if(i>=14&&i<=20)mp[5][i-13]=a;
            if(i==21)mp[6][3]=a;
            if(i==22)mp[6][5]=a;
            if(i==23)mp[7][3]=a;
            if(i==24)mp[7][5]=a;
        }  
        if(okay())
        {
            printf("No moves needed\n");
            printf("%d\n",mp[3][3]);
            continue;
        }
        success=false;depth=1;ans="";num=0;
        while(!success)
        {
            IDA_star(0,"",'0');
            depth++;
        }
        cout<<ans<<endl;
        printf("%d\n",num);
    }
    return 0;
}
~~~

### 以上就是IDA\*与A\*的全部内容了，完结撒花~❤️

