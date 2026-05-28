---
slug: 2026-05-28-tg
title: VPS 流量监控 Telegram Bot 部署教程
description: 教程
pubDate: 2026-05-28
tags:
  - telegram
  - 脚本
---

## 项目简介

这是一个基于：

- `vnStat`
- `Python Telegram Bot`
- `systemd`

实现的 VPS 流量监控机器人。

支持：

- 查看今日流量
- 查看本月流量
- 查看系统状态
- 查看实时流量
- 查看 VPS 在线时间
- Telegram 远程管理
- systemd 后台运行

适用于：

- Debian 12/13
- Ubuntu
- Oracle Cloud
- 搬瓦工
- NAT VPS
- Xray / Hysteria / Sing-box 节点机

---

# 一、创建 Telegram Bot

打开：

[Telegram 官方网站](https://telegram.org?utm_source=chatgpt.com)

搜索：

`@BotFather`

发送：

```
/newbot
```

按照提示：

1. 输入机器人名称
2. 输入机器人用户名（必须以 bot 结尾）

创建成功后会获得：

```
BOT_TOKEN
```

例如：

```
123456789:AAxxxxxxxxxxxxxxxxxxxxx
```

保存好。

---

# 二、获取 Telegram 用户 ID

搜索机器人：

```
@userinfobot
```

或者：

```
@RawDataBot
```

发送任意消息。

获得：

```
YOUR_USER_ID
```

例如：

```
6112345678
```

保存好。

---

# 三、安装基础环境

SSH 登录 VPS。

执行：

```
apt update && apt install -y python3 python3-pip vnstat curl
```

---

# 四、启动 vnStat

执行：

```
systemctl enable vnstatsystemctl restart vnstat
```

检查是否正常：

```
vnstat
```

如果能看到流量数据说明正常。

---

# 五、创建项目目录

执行：

```
mkdir -p /root/vpsbotcd /root/vpsbot
```

---

# 六、创建 bot.py

执行：

```
nano bot.py
```

把下面完整代码复制进去。

---

# 七、完整 bot.py 代码

```
import os
import subprocess
from telegram import Update
from telegram.ext import ApplicationBuilder, CommandHandler, ContextTypes

BOT_TOKEN = "这里替换成你的BOT_TOKEN"
ALLOWED_USER = 这里替换成你的TG用户ID


def run(cmd):
    return subprocess.getoutput(cmd)


def format_size(bytes_value):
    bytes_value = float(bytes_value)

    if bytes_value >= 1024 ** 4:
        return f"{bytes_value / 1024 ** 4:.2f} TB"

    elif bytes_value >= 1024 ** 3:
        return f"{bytes_value / 1024 ** 3:.2f} GB"

    elif bytes_value >= 1024 ** 2:
        return f"{bytes_value / 1024 ** 2:.2f} MB"

    elif bytes_value >= 1024:
        return f"{bytes_value / 1024:.2f} KB"

    return f"{bytes_value:.2f} B"


async def start(update: Update, context: ContextTypes.DEFAULT_TYPE):
    if update.effective_user.id != ALLOWED_USER:
        return

    text = """
🚀 VPS 流量监控机器人已启动

📊 可用命令：

/day 今日流量
/month 本月流量
/live 实时网速
/sys 系统状态
/uptime 在线时间
/reboot 重启 VPS
"""

    await update.message.reply_text(text)


async def day(update: Update, context: ContextTypes.DEFAULT_TYPE):
    if update.effective_user.id != ALLOWED_USER:
        return

    output = run("vnstat --oneline b")

    try:
        data = output.split(";")

        rx = format_size(data[3])
        tx = format_size(data[4])
        total = format_size(data[5])

        text = f"""
📊 今日流量

⬇ 下载：{rx}
⬆ 上传：{tx}
📦 总计：{total}
"""

        await update.message.reply_text(text)

    except Exception as e:
        await update.message.reply_text(f"解析失败:\n{e}")


async def month(update: Update, context: ContextTypes.DEFAULT_TYPE):
    if update.effective_user.id != ALLOWED_USER:
        return

    result = run("vnstat -m")

    await update.message.reply_text(f"📅 本月流量\n\n{result}")


async def live(update: Update, context: ContextTypes.DEFAULT_TYPE):
    if update.effective_user.id != ALLOWED_USER:
        return

    result = run("vnstat -tr 5")

    await update.message.reply_text(f"📡 实时流量\n\n{result}")


async def sysinfo(update: Update, context: ContextTypes.DEFAULT_TYPE):
    if update.effective_user.id != ALLOWED_USER:
        return

    cpu = run("top -bn1 | grep load")
    mem = run("free -h")
    disk = run("df -h /")

    text = f"""
🖥 系统状态

CPU：
{cpu}

🧠 内存：
{mem}

💾 磁盘：
{disk}
"""

    await update.message.reply_text(text)


async def uptime(update: Update, context: ContextTypes.DEFAULT_TYPE):
    if update.effective_user.id != ALLOWED_USER:
        return

    result = run("uptime -p")

    await update.message.reply_text(f"⏱ 在线时间\n\n{result}")


async def reboot(update: Update, context: ContextTypes.DEFAULT_TYPE):
    if update.effective_user.id != ALLOWED_USER:
        return

    await update.message.reply_text("♻ VPS 即将重启...")
    os.system("reboot")


app = ApplicationBuilder().token(BOT_TOKEN).build()

app.add_handler(CommandHandler("start", start))
app.add_handler(CommandHandler("day", day))
app.add_handler(CommandHandler("month", month))
app.add_handler(CommandHandler("live", live))
app.add_handler(CommandHandler("sys", sysinfo))
app.add_handler(CommandHandler("uptime", uptime))
app.add_handler(CommandHandler("reboot", reboot))

print("Bot Started")

app.run_polling()
```

---

# 八、安装 Python 依赖

执行：

```
pip3 install python-telegram-bot --break-system-packages
```

> Debian 13 必须加 `--break-system-packages`

---

# 九、测试运行

执行：

```
python3 bot.py
```

如果看到：

```
Bot Started
```

说明运行成功。

---

# 十、Telegram 测试

给你的机器人发送：

```
/start
```

然后测试：

```
/day
```

正常会返回今日流量。

---

# 十一、创建 systemd 后台服务

创建服务文件：

```
nano /etc/systemd/system/vpsbot.service
```

写入：

```
[Unit]Description=VPS Telegram BotAfter=network.target[Service]Type=simpleWorkingDirectory=/root/vpsbotExecStart=/usr/bin/python3 /root/vpsbot/bot.pyRestart=always[Install]WantedBy=multi-user.target
```

---

# 十二、启动后台服务

执行：

```
systemctl daemon-reloadsystemctl enable vpsbotsystemctl start vpsbot
```

---

# 十三、查看运行状态

执行：

```
systemctl status vpsbot
```

---

# 十四、查看日志

如果机器人异常：

```
journalctl -u vpsbot -f
```

---

# 十五、常用命令

## 重启机器人

```
systemctl restart vpsbot
```

---

## 停止机器人

```
systemctl stop vpsbot
```

---

## 开机自启

```
systemctl enable vpsbot
```

---

## 关闭开机启动

```
systemctl disable vpsbot
```

---

# 十六、支持的 Telegram 指令

|指令|功能|
|---|---|
|`/start`|帮助菜单|
|`/day`|今日流量|
|`/month`|本月流量|
|`/live`|实时网速|
|`/sys`|系统状态|
|`/uptime`|在线时间|
|`/reboot`|重启 VPS|

---

# 十七、后续可扩展功能

后续可以继续增加：

- 流量超限提醒
- 每日自动推送
- 多 VPS 管理
- Xray 状态检测
- Hysteria2 状态检测
- Docker 状态
- CPU/内存告警
- Telegram 按钮菜单
- 在线节点检测
- 自动重启代理服务

---

# 十八、项目优点

相比很多 GitHub 上的 VPS 管理项目：

- 更轻量
- 更稳定
- 无复杂依赖
- 占用极低
- 易维护
- 适合长期运行

核心依赖：

- vnStat
- python-telegram-bot
- systemd

即可。

