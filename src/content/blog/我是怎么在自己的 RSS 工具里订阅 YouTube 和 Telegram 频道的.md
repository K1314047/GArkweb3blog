---
slug: 2026-04-01-rssdingyue
title: 我是怎么在自己的 RSS 工具里订阅 YouTube 和 Telegram 频道的
description: 教程
pubDate: 2026-04-01
tags:
  - RSS
---
最近折腾了一圈 RSS 订阅，试了 YouTube、Telegram、微博、X、小红书、B 站这些来源，最后发现一个很现实的结论：

**不是所有平台都适合折腾 RSS。**

有些平台本身就支持得不错，比如 **YouTube**。  
有些平台虽然没有官方 RSS，但公开网页结构比较稳定，比如 **Telegram 公开频道**。  
而有些平台反爬太重、接口常变，就算自建 RSSHub 也不一定好用。

所以这篇只记录两个目前我实际验证下来**最值得用**的方式：

- YouTube 频道订阅
- Telegram 公开频道订阅

这两类对我来说，才是真正“能长期用”的 RSS 来源。

---

## 一、YouTube 频道怎么转成 RSS

YouTube 其实一直能订阅，只是很多人不知道它的 RSS 入口格式。

最常用的格式是：

https://www.youtube.com/feeds/videos.xml?channel_id=频道ID

比如：

https://www.youtube.com/feeds/videos.xml?channel_id=UC_x5XG1OV2P6uZZ5FSM9Ttw

只要拿到频道的 `channel_id`，就能拼出可订阅地址。

---

### 1. 如果频道链接本来就是 `channel/UC...`

例如：

https://www.youtube.com/channel/UCxxxxxxxxxxxxxxxxxxxxxx

那后面的 `UCxxxxxxxxxxxxxxxxxxxxxx` 就是频道 ID。

直接拼成：

https://www.youtube.com/feeds/videos.xml?channel_id=UCxxxxxxxxxxxxxxxxxxxxxx

就可以用了。

---

### 2. 如果频道链接是用户名、旧链接或者 `@handle`

现在很多 YouTube 频道不是 `channel/UC...` 这种形式，而是：

https://www.youtube.com/@xxxx

或者像这种旧地址：

https://www.youtube.com/Chickenzhou

这种时候，不能直接拿这个页面地址去订阅，要先把它转成真正的频道 ID。

我之前实际碰到的一个例子是：

https://www.youtube.com/Chickenzhou

后来在页面源码里找到了：

"channelIds":["UCAQDfYdQY8CPUBci02OsPbA"]

这里面的：

UCAQDfYdQY8CPUBci02OsPbA

就是这个博主真正的 channel ID。

所以它最终可订阅的 RSS 地址就是：

https://www.youtube.com/feeds/videos.xml?channel_id=UCAQDfYdQY8CPUBci02OsPbA

---

### 3. 怎么找 channel ID

如果主页不是直接显示 `UC...`，可以这样找：

1. 打开频道主页
2. 按 `F12` 打开开发者工具
3. 查看页面源码
4. 搜索这些关键词：
    - `channelId`
    - `channelIds`
    - `rssUrl`

一般都能找到类似：

"channelIds":["UCxxxxxxxxxxxxxxxx"]

这串 `UC...` 就是你要的频道 ID。

注意不要把页面里别的字段看错了。  
比如我之前看到过：

"unsubscribeButtonContent"

这个不是频道 ID，也不是 RSS 地址，只是页面里某个按钮配置字段，和订阅地址没关系。

真正有用的是：

"channelIds":["UCAQDfYdQY8CPUBci02OsPbA"]

---

### 4. 最终在 RSS 工具里怎么填

直接新建订阅，把下面这种地址贴进去就行：

https://www.youtube.com/feeds/videos.xml?channel_id=频道ID

例如：

```
https://www.youtube.com/feeds/videos.xml?channel_id=UCAQDfYdQY8CPUBci02OsPbA
```

---

## 二、Telegram 公开频道怎么转成 RSS

Telegram 和 YouTube 不一样。

它没有像 YouTube 那样好用的官方 RSS 地址，但 **Telegram 的公开频道网页是可以被抓取的**，所以一般用 **RSSHub** 来转。

如果你已经部署了 RSSHub，那么 Telegram 是非常适合接入的，成功率也比较高。

---

### 1. Telegram 频道的 RSSHub 路由格式

如果频道用户名是：

@123

那么在 RSSHub 里通常写成：

/telegram/channel/123

完整地址就是：

`rsshub://` 形式：

```
rsshub://telegram/channel/123
```

如果你不是本地部署，而是别的 RSSHub 实例，就把域名换掉。

---

### 2. Telegram 频道用户名怎么取

假设一个公开频道链接是：

https://t.me/awesomeRSSHub

那用户名就是：

awesomeRSSHub

---

## 三、我的实际经验：什么值得折腾，什么不值得折腾

这次试下来，我对 RSS 的看法变得很现实：

### 真正值得订阅的

- YouTube 频道
- Telegram 公开频道
- 一些自带 RSS 的博客
- 一些新闻站、资讯站

### 不太值得继续花时间折腾的

- X
- 微博
- 小红书
- 很多强反爬的社交平台
- 某些依赖 Cookie 和登录态的平台

原因很简单：

**能直接订阅的，本来就最好用。**  
**不能直接订阅的，如果平台反爬太重，RSSHub 也不一定救得回来。**

所以后来我对 RSSHub 的定位也变了：

它不是“万能网页转 RSS 工具”，  
而是“给一部分还能抓的平台做补充”。

在这个前提下，Telegram 是值得接入 RSSHub 的。  
但 YouTube 这种本来就能直接订阅的，其实根本不用多绕一层 RSSHub。

---

## 四、结语

如果只是想把常看的内容集中到一个 RSS 工具里，我现在的建议很简单：

- **YouTube：直接用官方 feed**
- **Telegram：走 RSSHub**
- **博客和新闻站：优先找原站 feed**
- **反爬重的平台：别投入太多时间**

折腾 RSS 最怕的不是不会配，而是花了很多时间之后才发现：  
**有些平台从一开始就不想让你订阅。**

所以与其追求“什么都能抓”，不如优先把 **真正稳定可用的来源** 建起来。  
对我来说，YouTube 和 Telegram 就属于这一类。