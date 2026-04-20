---
slug: 2026-04-19-U
title: 怎么部署Alpha Trade Toolkit
description: 教程
pubDate: 2026-04-19
tags:
  - 币安
  - 脚本
  - 交易赛
  - 教程
---
---

> 项目地址：
>  [https://github.com/0xxue/alpha-trade-toolkit](https://github.com/0xxue/alpha-trade-toolkit?utm_source=chatgpt.com)

------

## 📌 一、项目架构说明

这个项目**不是传统 Web 应用**，不能直接丢到服务器运行。

它的架构是：

### 1️⃣ 本地控制端（GUI）

- 运行在你的电脑（Windows / Linux桌面）
- 启动方式：`python main.py`
- 功能：
  - 管理服务器
  - 导入用户 headers
  - 绑定用户与服务器
  - 批量部署

------

### 2️⃣ 远程执行端（VPS）

- 多台 Linux 服务器
- 通过 SSH 被本地控制端连接
- 用于运行交易逻辑

------

### 📊 整体流程

```
本地GUI → SSH连接 → VPS执行脚本
```

------

## 🚀 二、部署流程总览

正确顺序：

1. 本地启动 GUI
2. 准备 VPS 服务器
3. 配置服务器列表
4. 导入 headers
5. 绑定用户与服务器
6. 批量部署
7. 启动交易

------

## 💻 三、本地控制端部署

### 1）环境要求

- Python 3.10+
- Windows / Linux（带桌面）

------

### 2）克隆项目

```
git clone https://github.com/0xxue/alpha-trade-toolkit.git
cd alpha-trade-toolkit
```

------

### 3）创建虚拟环境

#### Windows

```
python -m venv .venv
.venv\Scripts\activate
```

------

### 4）安装依赖

```
pip install -r requirements.txt
```

⚠️ 注意：项目依赖不完整，需要补充：

```
pip install playwright flask flask-cors websocket-client requests
playwright install chromium
```

------

### 5）启动项目

```
python main.py
```

启动后会：

- 自动创建 `config/`
- 自动创建 `account/`
- 初始化服务器配置文件
- 打开 GUI 界面

------

## ⚙️ 四、部署后配置

------

### 1）配置服务器

编辑：

```
config/servers.txt
```

格式：

```
IP:端口:用户名:密码
```

示例：

```
1.2.3.4:22:root:password
5.6.7.8:root:password
```

支持两种格式：

- `IP:用户名:密码`
- `IP:端口:用户名:密码`

------

### 2）添加用户 headers

路径：

```
account/
```

文件命名：

```
new_account_headers_用户名.txt
```

示例：

```
account/new_account_headers_alice.txt
account/new_account_headers_bob.txt
```

------

### 3）绑定用户与服务器

绑定信息会保存到：

```
config/server_bindings.json
```

规则：

- 一台服务器只能绑定一个用户

------

### 4）其他配置文件

```
config/team_config.json
config/team_passwords.json
config/deployment_mode.json
config/proxy.txt
```

说明：

| 文件                 | 作用         |
| -------------------- | ------------ |
| team_config.json     | 团队配置     |
| deployment_mode.json | 运行模式     |
| proxy.txt            | 代理（可选） |
| server_bindings.json | 自动生成     |

------

## 🧭 五、GUI 操作流程

启动后按顺序操作：

### Step 1：Deploy Panel

- 检查服务器是否加载成功

### Step 2：User Panel

- 确认 headers 用户已识别

### Step 3：Binding Panel

- 用户绑定服务器（1:1）

### Step 4：Deploy

- 批量部署

### Step 5：Trading Panel

- 启动交易 / 查看状态

------

## 🖥️ 六、远程服务器准备

### 推荐系统

- Ubuntu 22.04
- Debian 12

------

### 安装基础环境

```
apt update && apt upgrade -y
apt install -y python3 python3-pip python3-venv curl wget unzip git
```

------

### 安装浏览器（必须）

```
apt install -y chromium-browser
```

否则 Playwright 会报错

------

### SSH 要求

- 开启 SSH
- 端口 22 可访问
- 支持 root / sudo 登录

------

## ✅ 七、部署成功验证

### 本地验证

- GUI 正常打开
- 能看到服务器
- 能看到用户
- 绑定成功

------

### 远程验证

服务器上应出现：

```
/root/new_account_headers_用户名.txt
/root/2fa_secret_用户名.txt
/root/trading_status_用户名.json
/root/trading_用户名.log
```

可能还有 systemd 服务：

```
qr-用户名.service
```

------

## ⚠️ 八、常见坑

### 1）误以为是 Web 项目

❌ 错误
 ✅ 实际是 GUI 工具

------

### 2）只安装 requirements.txt

❌ 不够
 ✅ 需要手动补依赖

------

### 3）没有 headers 文件

❌ 用户不会显示

------

### 4）一机多用户

❌ 不支持
 ✅ 必须 1:1

------

### 5）服务器没有浏览器

❌ Playwright 会失败

------

## 🧪 九、最简测试方案

### 配置

- 1 台本地电脑
- 1 台 VPS

------

### 本地执行

```
git clone https://github.com/0xxue/alpha-trade-toolkit.git
cd alpha-trade-toolkit

python -m venv .venv
.venv\Scripts\activate

pip install -r requirements.txt
pip install playwright flask flask-cors websocket-client requests
playwright install chromium

python main.py
```

------

### 配置文件

#### servers.txt

```
你的IP:22:root:密码
```

#### headers

```
account/new_account_headers_testuser.txt
```

------

### GUI 操作

1. 检查服务器
2. 检查用户
3. 绑定
4. 部署
5. 启动交易

------

## 🔒 十、优化建议（强烈建议）

这个项目偏“半成品”，建议你自己增强：

### 安全方面

- 使用 SSH Key（不要密码）
- headers 加密存储
- 配置文件加密

------

### 工程方面

- 补完整 requirements.txt
- 增加 `.env.example`
- 区分 API / Web 模式

------

### 风控方面

- 使用测试账号
- 不要直接上主账号

------

## 📌 总结

### 部署核心

- 本地运行 GUI
- VPS 执行任务
- SSH 批量管理

------

### 使用核心

```
服务器配置 → headers导入 → 用户绑定 → 批量部署 → 启动交易
```