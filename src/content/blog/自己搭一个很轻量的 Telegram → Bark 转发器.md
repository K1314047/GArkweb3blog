---
slug: 2026-09-16-bark
title: 自己搭一个很轻量的 Telegram → Bark 转发器
description: 教程
pubDate: 2026-09-16
tags:
  - 教程
  - 脚本
---
> 最近ios的telegram推送老是收不到消息，之前是一直拿另一个手机开着全局来接收，主力机是用的分流规则来接收，今天看到有个Bark推送app好像可以解决我不用开着翻墙软件也能接收信息，便让chatgpt帮我做了一个。

功能包括：

- Telegram **用户账号登录**
- 多频道同时监听
- `@频道用户名` 监听
- 私有频道/群组支持
- 全量推送
- 关键词过滤
- SQLite 去重
- Bark 推送
- Bark 点击通知跳回 Telegram
- Bark 声音 / 分组 / level
- Telegram SOCKS5 / HTTP 代理
- Docker Compose
- Telegram Session 持久化
- 容器重启后无需重新登录

Telethon 的 `NewMessage` 事件正适合这种实时监听方式；首次登录后，`.session` 文件会保存授权信息，后续启动无需重复输入验证码。

---

# 一、先准备 Telegram API

打开：

[Telegram API Development Tools](https://my.telegram.org?utm_source=chatgpt.com)

登录你的 Telegram 账号，然后：

```
API development tools
        ↓
Create new application
```
申请示例：
```
App title:
BarkMonitor

Short name:
barkmonitor12321

URL:
留空

Platform:
Desktop

Description:
Telegram channel monitor for personal use 
```

得到：

```
api_id
api_hash
```

这两个不是 Bot Token，而是你这个**个人 Telegram 账号客户端**使用的 API 凭据。Telegram 官方要求通过 `my.telegram.org` 创建应用获取它们。

**特别注意：`api_hash` 不要发给别人，也不要上传 GitHub。**

---

# 二、配置 `.env`

把：

```
.env.example
```

复制成：

```
.env
```

Windows CMD：

```
copy .env.example .env
```

然后编辑：

```
TG_API_ID=12345678
TG_API_HASH=你的API_HASH
TG_PHONE=+81xxxxxxxxxx

BARK_URL=https://api.day.app
BARK_KEY=你的Bark设备Key

BARK_SOUND=telegraph
BARK_GROUP=Telegram
BARK_LEVEL=active

CHANNELS=@channel1,@channel2

FILTER_MODE=keyword
KEYWORDS=Alpha,空投,活动,免费,白嫖,抽奖,送U

DEDUP_ENABLED=true
DEDUP_TTL_SECONDS=604800

TELEGRAM_PROXY=
```

---

# 三、频道怎么填写

例如你想监控：

```
@binance_announcements
@some_crypto_news
@linuxdo_news
```

直接：

```
CHANNELS=@binance_announcements,@some_crypto_news,@linuxdo_news
```

也支持：

```
CHANNELS=https://t.me/binance_announcements,@some_crypto_news
```

程序会自动处理。

---

# 四、关键词过滤

如果：

```
FILTER_MODE=keyword
```

那么：

```
KEYWORDS=Alpha,空投,活动,免费,白嫖,抽奖
```

例如频道出现：

> Binance Alpha 新活动开启

会推送。

出现：

> BTC 今日行情分析

如果没有关键词，就不会推送。

---

## 如果想全部推送

改成：

```
FILTER_MODE=all
```

这样监控频道的每一条新消息都会进入 Bark。

---

# 五、第一次登录

这个地方我特意设计成了**交互式 Docker 登录**。

进入项目目录：

```
cd C:\Users\Administrator\Desktop\new\telegram-bark-monitor
```

然后：

```
docker compose run --rm telegram-bark python main.py --login
```

第一次会看到类似：

```
First login: requesting Telegram login code...

请输入 Telegram 登录验证码:
```

输入 Telegram 发给你的验证码。

如果你的 Telegram 开启了两步验证：

```
请输入 Telegram 两步验证密码:
```

再输入密码。

成功后：

```
Telegram login successful. Session saved.
```

然后 `data` 目录里面会出现：

```
telegram.session
```

这个文件**非常重要**。

它相当于已经授权的 Telegram 登录凭据，所以千万不要上传 GitHub。Telethon 官方也特别说明 session 文件包含授权所需的信息。

---

# 六、然后正式启动

```
docker compose up -d --build
```

查看：

```
docker logs -f telegram-bark-monitor
```

正常应该看到：

```
Telegram session already authorized.
Monitoring channel: xxx
Monitoring channel: xxx
Telegram → Bark monitor started.
Filter mode: keyword
Keywords: Alpha, 空投, 活动, 免费
```

以后就不需要再次登录了。

---

# 七、你这个环境有一个需要特别注意的地方

你之前 Docker 使用过：

```
10808
```

作为代理端口。

如果 Telegram 在 Docker 里面无法连接，可以设置：

```
TELEGRAM_PROXY=socks5://host.docker.internal:10808
```

如果你的 10808 实际是 **HTTP 代理**，则：

```
TELEGRAM_PROXY=http://host.docker.internal:10808
```

不要直接写：

```
TELEGRAM_PROXY=socks5://127.0.0.1:10808
```

因为：

```
127.0.0.1
```

在容器里面代表**容器自己**，不是 Windows 主机。

---

# 八、Bark 推送效果

例如 Telegram 频道发布：

```
Binance Alpha 将上线 XXX
活动时间：2026-09-16 21:00
```

你的 iPhone Bark 会收到类似：

```
【TG】Binance Announcements

Binance Alpha 将上线 XXX
活动时间：2026-09-16 21:00
```

**点击通知还可以直接打开对应的 Telegram 消息。**

我在程序里已经自动生成：

```
https://t.me/频道用户名/消息ID
```

对于没有公开 username 的频道/群组，也会尝试生成 `t.me/c/...` 消息链接。

---

# 九、我还给你做了 SQLite 去重

比如 Telegram 因为网络重连导致同一条消息被程序再次处理：

```
Telegram消息 #12345
        ↓
第一次收到
        ↓
Bark ✅
        ↓
记录 SQLite
```

再次收到：

```
Telegram消息 #12345
        ↓
检查 SQLite
        ↓
发现已经发送
        ↓
跳过 ❌
```

默认保存：

```
DEDUP_TTL_SECONDS=604800
```

也就是 **7 天**。

---

# 十、针对你，我建议后面再加一个功能

你现在经常监控：

```
币安公告
Alpha
交易赛
LinuxDo
Nodeseek
空投
VPS
```

所以我建议下一版直接做成：

```
Telegram
   │
   ├── 币安公告
   │       └── 全部 → Bark
   │
   ├── Alpha频道
   │       └── 全部 → Bark
   │
   ├── LinuxDo
   │       └── 免费/白嫖/抽/送 → Bark
   │
   ├── NodeSeek
   │       └── 小红卡/收U/出U/VPS → Bark
   │
   └── 其他频道
           └── 自定义关键词
```

也就是说，不只是全局：

```
KEYWORDS=Alpha,空投,免费
```

而是可以配置成：

```
channels:

  - name: Binance
    username: "@binance_announcements"
    mode: all

  - name: LinuxDo
    username: "@linuxdo"
    mode: keyword
    keywords:
      - 免费
      - 白嫖
      - 抽奖
      - VPS

  - name: NodeSeek
    username: "@nodeseek"
    mode: keyword
    keywords:
      - 小红卡
      - 收U
      - 出U
      - BSC
      - Bitget
```

这样会比现在这个 `.env` 全局关键词版本**好用很多**。

另外，Telegram 官方提醒，使用 MTProto/第三方客户端时应遵守 API 条款，不要用于刷屏、垃圾消息等滥用行为；这个项目只做你自己账号已加入频道的消息监听和 Bark 通知。