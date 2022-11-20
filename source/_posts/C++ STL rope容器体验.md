---
title: C++ STL rope容器体验
date: 2022-11-20 18:49:42
tags:
- C++ STL(Standard Template Library)
categories :
- 学习笔记
toc: true
---

🐂🍺坏了

<!--more-->

挺👍的，黑科技块状链表复杂度$O(n \sqrt{n})$。 但是贼快。

~~~c++
#include <ext/rope> // 在拓展STL里

using namespace __gnu_cxx;

rope<int> S // 声明一个数据类型为int的rope容器

int main()
{
    S.push_back(x); // 在末尾插入x
    S.insert(pos, x); // 在pos处插入x
    S.erase(pos, x); // 在pos处删除x个元素
    S.length(); // 返回容器大小
    S.size(); // 返回容器大小
    S.replace(pos, x); // 将pos处的元素替换成x
    S.substr(pos, x); // 从pos处开始提取x个元素
    S.copy(pos, x, s); // 从pos处开始复制x个元素到s中
    S.at(x); // 访问第x个元素 同 S[x]
}
~~~