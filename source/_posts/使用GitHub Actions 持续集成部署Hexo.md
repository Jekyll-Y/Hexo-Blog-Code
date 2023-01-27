---
title: 使用GitHub Actions 持续集成部署Hexo
date: 2022-10-12 19:32:17
tags:
- Hexo
- Github Actions
categories:
- Hexo
toc: true

---

使用GitHub Actions 持续集成部署Hexo

<!--more-->

# 使用GitHub Actions 持续集成部署Hexo

Hexo 作为一个静态的博客框架，相比于wordpress，也是有其轻便，速度快的优点，但是毕竟是静态的，部署起来并没有那么方便，如果在本地的话每次更新，都需要hexo clean -d, 会很麻烦。Github Actions 早在2018年就发布了最初的版本， 作为一个方便的可以持续集成部署的工具，我们可以用它来部署hexo，让blog以后的更新维护更加方便快捷。

需要两个仓库，一个来放blog的源码， 一个放html, 如`name.github.io` 。

首先在git bash中运行：

{% codeblock "生成密钥" lang: yaml >folded %}
ssh-keygen -t rsa -f github-deploy-key
{% endcodeblock %}

此时可以得到两个文件一个是 `github-deploy-key`, 另一个是`github-deploy-key.pub`, 首先复制`github-deploy-key`的内容然后，到博客的源码仓库，打开`Settings->Secrets->Actions`， 选择`New Secrets`，Name 填`HEXO_DEPLOY_PRI`,(这个后面文件会用到建议不做更改)，然后打开博客页面文件所在的仓库，打开`Settings->Deploy Key`， 选择`Add deploy key`， 名字填`HEXO_DEPLOY_PUB`, 把`github-deploy-key.pub`的内容复制进去。

在博客源码的仓库中新建`.github/workflows/deploy.yml`,

接下来就是配置Github Actions，根据注释修改内容， 填在`deploy.yml`， 中：

{% codeblock "Actions" lang: yaml  >folded %}
name: Hexo deploy

on:
  push:
    branches:
      - main #当该分支的内容改变时会触发Actions，请根据实际情况更改成对应分支

env:
  GIT_USER:      #用户名
  GIT_EMAIL:     #邮箱
  DEPLOY_REPO:   #用户名/name.github.io
  DEPLOY_BRANCH: #和上个分支相同

jobs:
  build:
    name: Build on node ${{ matrix.node_version }} and ${{ matrix.os }}
    runs-on: ubuntu-latest
    strategy:
      matrix:
        os: [ubuntu-latest]
        node_version: [16.x]
    # 使用最新的Ubuntu环境
    steps:

      - name: Checkout
        uses: actions/checkout@v3 #使用 actions/checkout@v3 版本为 node.16

      - name: Checkout deploy repo
        uses: actions/checkout@v3
        with:
          repository: ${{ env.DEPLOY_REPO }}
          ref: ${{ env.DEPLOY_BRANCH }}
          path: .deploy_git

      - name: Use Node.js ${{ matrix.node_version }}
        uses: actions/setup-node@v3 #使用 actions/setup-node@v3 版本为 node.16
        with:
          node-version: 16

      - name: Configuration environment
        env:
          HEXO_DEPLOY_PRI: ${{secrets.HEXO_DEPLOY_PRI}}
        run: |
          sudo timedatectl set-timezone "Asia/Shanghai"
          mkdir -p ~/.ssh/
          echo "$HEXO_DEPLOY_PRI" > ~/.ssh/id_rsa
          chmod 600 ~/.ssh/id_rsa
          ssh-keyscan github.com >> ~/.ssh/known_hosts
          git config --global user.name "" #用户名
          git config --global user.email "" # 邮箱

      - name: Install dependencies
        run: |
          npm install
          npm install hexo-cli -g
        # 部署hexo 环境
      - name: Deploy hexo
        run: |
          hexo clean
          hexo g
          hexo d
        #部署 depoly
{% endcodeblock %}

根据实际情况更改即可 ，推荐搭配GitHub的Cloud VSCode 使用效果更佳。