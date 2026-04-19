---
slug: 2026-04-19-alphatradetoolkit
title: 部署 Alpha Trade Toolkit
description: 教程
created: 2026-04-19
tags:
  - 教程
  - 撸毛
  - 交易赛
  - 币安
---
https://github.com/0xxue/alpha-trade-toolkit 这个怎么部署，部署好之后又要怎么设置呢

这个项目不是“直接丢到一台服务器跑起来就能用”的那种 Web 应用，它更像是一个**本地桌面控制端 + 多台远程交易服务器**的批量管理工具。你本机启动 GUI，然后在 GUI 里配置远程服务器、导入用户 headers、做用户和服务器绑定，最后再批量部署到远程机器。README 里的官方流程也是这个思路：本地安装依赖后运行 `python main.py`，随后在 Deploy panel 里配置服务器；并且它要求你维护 `config/servers.txt`、`account/new_account_headers_USERNAME.txt` 这些本地文件。

另外，这个仓库目前公开内容比较简陋：仓库只有 2 次提交，`requirements.txt` 里实际上只写了 `customtkinter` 和 `paramiko` 两个依赖，但 README 又提到了 Playwright、Flask、WebSocket、Binance API 等组件，所以**文档和代码状态并不完全一致**。部署前你要有心理预期：很可能需要自己补依赖、补配置，甚至修代码。

## 一、这个项目的正确部署思路

你可以把它理解成两层：

**第一层：本地控制端**

- 运行在你的 Windows 电脑或一台带桌面的 Linux 主机上。
- 作用是打开 GUI，管理用户、服务器、绑定关系、部署动作。README 明确写了入口是 `python main.py`，并且启动后是 GUI。

**第二层：远程执行端**

- 也就是你准备好的多台 Linux VPS。
- 这些机器通过 SSH 被本地控制端连接，然后被下发交易脚本、headers、2FA 文件等。README 的架构图和目录说明都表明它是通过 Paramiko 走 SSH 批量部署，并且是一机一人绑定。

所以它的部署顺序应该是：

1. 先在**本地电脑**跑起来 GUI
2. 再准备好若干台**远程 Linux 服务器**
3. 在本地填服务器配置
4. 在本地导入用户 headers
5. 把用户绑定到服务器
6. 用 GUI 批量部署
7. 再去交易面板里启动交易

这和 README 中文说明里的 1→5 步完全一致。

---

## 二、先部署本地控制端

### 1）准备环境

建议你直接用 **Windows 10/11** 或者一台有桌面的 Linux 机器来跑，因为这是个 `CustomTkinter` 桌面应用。项目要求 Python 3.10+。README 也把 Python 3.10+ 列为前置条件。

### 2）克隆项目

git clone https://github.com/0xxue/alpha-trade-toolkit.git  
cd alpha-trade-toolkit

这是 README 给的安装方式。

### 3）创建虚拟环境

Windows:

python -m venv .venv  
.venv\Scripts\activate

Linux/macOS:

python3 -m venv .venv  
source .venv/bin/activate

### 4）安装依赖

先按仓库现有要求装：

pip install -r requirements.txt

仓库当前 `requirements.txt` 只有：

- `customtkinter>=5.2.0`
- `paramiko>=3.3.0`

README 还写了：

playwright install chromium

但由于 `requirements.txt` 没列出 Playwright，建议你额外补装：

pip install playwright flask flask-cors websocket-client requests  
playwright install chromium

这是我根据 README 里列出的技术栈做的补充判断；因为 README 明确提到 Playwright、Flask + Flask-CORS、websocket-client，而当前 requirements 并没有覆盖它们。

### 5）首次启动

python main.py

`main.py` 启动时会做几件事：

- 检查 `customtkinter`、`paramiko`
- 自动创建 `config/` 目录
- 如果没有 `config/servers.txt`，会生成示例文件
- 自动确保 `account/` 目录存在
- 然后拉起 GUI 主窗口。

---

## 三、部署好之后先设置什么

### 1）配置远程服务器

README 明确要求编辑 `config/servers.txt`。格式是：

SERVER_IP:SSH_PORT:SSH_USER:SSH_PASSWORD

例如：

1.2.3.4:22:root:yourpassword  
5.6.7.8:22:root:yourpassword

不过代码里还有一个细节：`core/config_manager.py` 同时兼容两种格式：

- `IP:用户名:密码`
- `IP:端口:用户名:密码`

如果只写三段，端口默认按 22。

所以你可以这样写：

1.2.3.4:root:yourpassword  
5.6.7.8:22:root:yourpassword

### 2）准备用户 headers 文件

README 要求把用户 headers 放到 `account/` 目录下，文件名格式是：

account/new_account_headers_USERNAME.txt

代码里也是按这个命名规则扫描用户的：它只认 `new_account_headers_*.txt` 这种文件。

例如：

account/new_account_headers_alice.txt  
account/new_account_headers_bob.txt

### 3）绑定用户和服务器

这个项目是一机一人隔离。绑定关系会写到：

config/server_bindings.json

README 和代码都说明了这一点；而且 `ConfigManager` 会确保同一台服务器不能同时绑定给两个不同用户。

### 4）团队和模式配置

README 的目录结构里还提到了这些配置文件：

- `config/team_config.json`
- `config/team_passwords.json`
- `config/deployment_mode.json`
- `config/proxy.txt`（可选）

我实际检查到仓库里存在的公开文件里，`team_config.json` 和 `deployment_mode.json` 当前内容是空对象 `{}`，而另一些文件可能会在运行后自动生成。

所以初期你可以这么理解：

- `team_config.json`：团队层级，不玩团队权限的话先不动
- `deployment_mode.json`：用户是 API 模式还是 Web 模式
- `proxy.txt`：代理配置，可选
- `team_passwords.json` / `server_bindings.json` / `servers.txt`：有些会在你操作 GUI 后自动创建

---

## 四、推荐你按这个顺序设置

### 第一步：确认本地 GUI 能打开

在项目根目录执行：

python main.py

如果能打开窗口，说明本地控制端没问题。

### 第二步：填服务器列表

编辑 `config/servers.txt`：

1.2.3.4:22:root:密码1  
5.6.7.8:22:root:密码2

建议每个用户单独一台 VPS。

### 第三步：放入账号 headers

把每个用户的 headers 文件放到 `account/`：

account/new_account_headers_user1.txt  
account/new_account_headers_user2.txt

### 第四步：打开 GUI 后设置

按 README 的面板顺序操作：

1. **Deploy Panel**：检查服务器是否已读入
2. **User Panel**：确认用户 headers 已识别
3. **Binding Panel**：把 user1 绑到 VPS1，把 user2 绑到 VPS2
4. **Deploy / Batch Deploy**：执行一键部署
5. **Trading Panel**：开始交易或监控状态

---

## 五、远程服务器要提前准备什么

README 没把远程机器初始化写细，但从项目结构和 SSH 部署逻辑看，建议你先把每台 VPS 都准备成下面这样：

### 最低建议环境

Ubuntu 22.04 / Debian 12

### 安装基础组件

apt update && apt upgrade -y  
apt install -y python3 python3-pip python3-venv curl wget unzip git

### 如果你要用 Web / Playwright 模式

再补这些：

apt install -y chromium-browser  
# 或系统对应的 chromium 包

如果没有浏览器依赖，Playwright 模式大概率会报错。README 已明确写了 Chrome/Chromium 是前置条件。

### SSH 登录建议

`servers.txt` 用的是账号密码模式，所以远程服务器最好：

- 开启 SSH
- 确认 22 端口可达
- root 或可 sudo 用户能登录

---

## 六、部署后怎么判断设置成功

你可以按这个检查：

### 本地侧

- `python main.py` 能正常打开 GUI
- GUI 里能看到服务器列表
- GUI 里能看到用户列表
- 绑定后 `config/server_bindings.json` 会写入绑定信息。`ConfigManager.save_bindings()` 的逻辑就是这样。

### 远程侧

从代码命名看，部署后远程机器上大概率会生成类似这些文件：

- `/root/new_account_headers_用户名.txt`
- `/root/2fa_secret_用户名.txt`
- `/root/trading_status_用户名.json`
- `/root/trading_用户名_*.log`
- systemd 服务里可能有 `qr-用户名.service` 这类服务名

这些名字来自用户重命名逻辑里对远程文件和服务的处理代码，所以可以反向用来检查部署是否落地。

---

## 七、你最容易踩的坑

### 1）把它当成纯服务器项目

不是。这个项目的控制入口是 GUI，不是常规 Web 后台。`main.py` 启动的是桌面应用。

### 2）只装 `requirements.txt`

当前公开 `requirements.txt` 太少，和 README 写的技术栈不一致。只按它装，后续很可能缺包。

### 3）没有准备 headers 文件

这个项目把用户识别建立在 `account/new_account_headers_*.txt` 上，没这个文件，用户面板大概率就是空的。

### 4）一台服务器绑多个用户

设计上就是一机一人，代码里也会阻止重复绑定。

### 5）远程机没有浏览器环境

如果你选择 Web 模式，Playwright/Chromium 环境没装好会直接卡住。README 已把 Chrome/Chromium 列为前置条件。

---

## 八、给你一套最省事的落地方案

如果你是第一次试，建议这样做：

### 方案：1 台本地电脑 + 1 台测试 VPS

先不要一上来多用户多服务器。

#### 本地

git clone https://github.com/0xxue/alpha-trade-toolkit.git  
cd alpha-trade-toolkit  
  
python -m venv .venv  
# Windows:  
.venv\Scripts\activate  
# Linux/macOS:  
# source .venv/bin/activate  
  
pip install -r requirements.txt  
pip install playwright flask flask-cors websocket-client requests  
playwright install chromium  
  
python main.py

#### 本地文件先这样建

`config/servers.txt`

你的VPS_IP:22:root:你的SSH密码

`account/new_account_headers_testuser.txt`

把你的 headers 内容放这里

#### GUI 里操作

- Deploy 面板检查服务器
- User 面板检查 `testuser`
- Binding 面板把 `testuser` 绑定到 VPS
- 点批量部署
- 去 Trading 面板看是否能启动

---

## 九、如果你想要更稳，我建议你这样改

这个仓库现在更像“作者自用工具”，不是成熟成品。你真要长期用，建议你自己先补这几项：

1. 给项目补完整 `requirements.txt`
2. 改成 SSH key 登录，不要明文密码
3. 把 `servers.txt`、`server_bindings.json`、headers 做加密存储
4. 补一个 `.env.example`
5. 明确 API 模式和 Web 模式各自需要哪些配置
6. 先用测试账号验证，不要上主账号

---

## 十、我给你的直接结论

**怎么部署：**

- 在本地电脑装 Python 环境
- 克隆项目
- 安装依赖
- 运行 `python main.py`
- 准备 `config/servers.txt`
- 准备 `account/new_account_headers_用户名.txt`
- 通过 GUI 完成绑定和批量部署。

**部署后怎么设置：**

- 先填服务器
- 再导入 headers
- 再绑定用户到服务器
- 再选部署模式
- 最后在交易面板启动。README 的中文说明也是这个顺序。

**我对这个仓库的判断：**

- 能看出作者思路清晰
- 但公开仓库文档和依赖不完整
- 适合懂 Python/SSH/自动化的人自己折腾
- 不适合零基础直接商用上实盘。

你要的话，我下一条可以直接给你一份**“Windows 本地部署 + 单台 Ubuntu VPS 测试”的逐步操作清单**，