---
slug: 2026-03-15-binancealpha
title: 币安 Alpha 监控部署教程（Telegram 推送版)
description: 教程
pubDate: 2026-03-15
tags:
  - 币安
  - alpha
  - 脚本
---
这篇教程记录了如何把一个监控 **币安 Alpha 空投/公告信息** 的 Python 脚本，部署到 Linux 服务器上，并通过 **Telegram Bot** 实现消息推送。
## 一、项目目标

实现一个长期运行的监控脚本，定时从数据源抓取币安 Alpha 空投信息，并在以下场景推送到 Telegram：

1. 发现新的 Alpha 空投项目时推送
2. 项目信息补充了积分门槛时推送
3. 每天早上推送“今日预告”
4. 在活动开始前 20 分钟发送提醒

------

## 二、项目原理

脚本的核心逻辑很简单：

- 周期性请求接口：
   `https://alpha123.uk/api/data?fresh=1`
- 读取返回的 `airdrops` 数据
- 与上一轮缓存做对比
- 如果发现新增项目或状态变化，就发送 Telegram 消息
- 使用 APScheduler 定时执行轮询和提醒任务

------

## 三、准备环境

### 1. 服务器要求

建议使用 Linux 服务器，例如 Ubuntu / Debian。

需要安装：

- Python 3
- pip
- 虚拟环境 venv

### 2. 安装 Python 环境

```
apt update
apt install -y python3 python3-venv python3-pip
```

------

## 四、创建项目目录

```
mkdir -p ~/binance_alpha
cd ~/binance_alpha
```

创建虚拟环境并激活：

```
python3 -m venv venv
source venv/bin/activate
```

------

## 五、安装依赖

在项目目录中新建 `requirements.txt`：

```
requests
apscheduler
```

安装依赖：

```
pip install -r requirements.txt
```

------

## 六、创建 Telegram Bot

### 1. 找 BotFather 创建机器人

在 Telegram 搜索：

```
@BotFather
```

发送命令：

```
/newbot
```

按提示设置：

- bot 名称
- bot 用户名（必须以 `bot` 结尾）

创建完成后，BotFather 会返回一个 **Bot Token**，格式类似：

```
1234567890:AAxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

这个 token 非常重要，相当于机器人的密码。

------

### 2. 获取自己的 chat_id

在 Telegram 搜索：

```
@userinfobot
```

发送命令：

```
/start
```

返回：

```
Id: 185xxxxxx
```

其中这个数字：

```
185xxxxxx
```

就是你的 `chat_id`。

------

## 七、项目文件结构

最终目录结构如下：

```
binance_alpha/
├── main.py
├── msg_handler.py
├── requirements.txt
└── run.log
```

------

## 八、完整代码

项目地址：https://github.com/K1314047/binance_alpha/tree/main


## 九、运行测试

在项目目录中运行：

```
python main.py
```

如果正常，会看到类似输出：

```
✅ 获取空投数据成功
✅ 空投监测系统已启动（Telegram 推送版）
✅ Alpha 空投监控已启动
✅ Telegram 推送成功
```

同时 Telegram 也会收到一条启动提示消息。

停止运行按：

```
Ctrl + C
```

停止时会收到：

```
⏹ Alpha 空投监控已停止
```

------

## 十、后台运行

如果希望脚本退出终端后仍然继续运行，可以使用 `nohup`。

### 启动后台运行

```
nohup python main.py > run.log 2>&1 &
```

命令解释：

- `nohup`：让程序不受终端关闭影响
- `> run.log`：把输出写入日志文件
- `2>&1`：把错误输出也写入日志
- `&`：放到后台执行

启动后，终端可能显示：

```
[1] 32452
```

其中 `32452` 是进程号。

------

### 查看日志

```
tail -f run.log
```

如果看到类似输出，说明程序在正常工作：

```
✅ 获取空投数据成功
✅ 空投监测系统已启动（Telegram 推送版）
✅ Telegram 推送成功
```

------

### 查看进程是否还在运行

```
ps -ef | grep "python main.py"
```

或者：

```
ps -p 32452 -o pid,cmd
```

如果还能看到 `python main.py`，就说明后台任务仍在运行。

------

### 停止后台运行

正常停止：

```
kill 32452
```

强制停止：

```
kill -9 32452
```

------

## 十一、安全建议

### 1. 不要把 Bot Token 明文公开

Bot Token 一旦泄露，别人就可以控制你的机器人。

建议：

- 不要上传到公开 GitHub
- 不要发在群聊或论坛
- 最好使用环境变量保存

------

### 2. 更推荐使用环境变量保存 token

例如把 `msg_handler.py` 改成：

```
import os
import requests


class msg_handler:
    TELEGRAM_BOT_TOKEN = os.getenv("TELEGRAM_BOT_TOKEN", "")
    TELEGRAM_CHAT_ID = os.getenv("TELEGRAM_CHAT_ID", "")
```

运行前先设置：

```
export TELEGRAM_BOT_TOKEN="你的真实token"
export TELEGRAM_CHAT_ID="1859193713"
python main.py
```

这样更安全。

------

## 十二、最终部署步骤速查版

### 第一步：进入项目目录

```
cd ~/binance_alpha
source venv/bin/activate
```

### 第二步：安装依赖

```
pip install -r requirements.txt
```

### 第三步：运行测试

```
python main.py
```

### 第四步：确认 Telegram 能收到启动消息

收到后按 `Ctrl + C` 停止。

### 第五步：后台运行

```
nohup python main.py > run.log 2>&1 &
```

### 第六步：查看日志

```
tail -f run.log
```

### 第七步：确认进程仍在

```
ps -ef | grep "python main.py"
```

------

## 十三、总结

这个项目本质上是一个轻量级的定时监控脚本，核心功能已经够用：

- 自动抓取币安 Alpha 空投信息
- 自动比较更新
- 自动推送到 Telegram
- 支持每日预告和活动提醒

如果只是个人使用，当前方案已经足够。
 如果后续要长期稳定运行，建议继续升级成：

- 环境变量保存密钥
- `systemd` 开机自启
- 日志轮转
- 请求失败重试