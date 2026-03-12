---
slug: 2026-03-12-Upan
title: Linux Mint + OpenClaw 随身启动 U 盘制作教程
description: 教程
pubDate: 2026-03-12
tags:
  - openclaw
---
只需要一个普通 U 盘，就可以做出一个可随身携带、插上电脑即可启动的 Linux Mint 系统，而且还能自动保存文件、配置和 OpenClaw 环境。
这类启动 U 盘适合以下场景：

- 想随身携带自己的工作环境
    
- 想在不同电脑上快速进入统一系统
    
- 想体验 Linux + OpenClaw 的便携部署方式
    
- 想自己 DIY 一个有特色的“技术礼物”或展示作品
    

这篇文章会从零开始，教你在 **Windows 电脑** 上制作一个带**持久化存储**的 Linux Mint 启动 U 盘，并在系统中安装 OpenClaw。

## 一、准备材料

### 硬件准备

- 一个 **32GB 或更大容量** 的 USB 3.0 U 盘  
    推荐 64GB，空间更充足，体验更好
    
- 一台支持 **U 盘启动** 的电脑
    
- 一台 Windows 电脑，用来制作启动盘
    

### 软件准备

- **Linux Mint ISO 镜像**
    
- **Rufus 写盘工具**
    

---

## 二、重要提醒

**制作启动 U 盘会清空 U 盘中的全部数据。**

开始之前，请务必先备份好 U 盘内的重要文件，以免数据丢失。

---

## 三、制作流程总览

整个过程大致分为 4 个阶段：

1. 下载 Linux Mint 镜像
    
2. 使用 Rufus 制作带持久化存储的启动 U 盘
    
3. 从 U 盘启动进入 Linux Mint
    
4. 安装 Node.js 和 OpenClaw，并完成初始化配置
    

---

# 四、详细制作步骤

## 步骤 1：下载 Linux Mint 镜像

前往 Linux Mint 官网下载系统镜像。

### 推荐版本

**Linux Mint Cinnamon LTS**

下载完成后，文件名通常类似于：

linuxmint-22-cinnamon-64bit.iso

如果你是第一次使用 Linux Mint，Cinnamon 版本界面更友好，也更适合作为日常便携系统使用。

---

## 步骤 2：在 Windows 上制作持久化启动 U 盘

### 操作步骤

1. 将 U 盘插入电脑
    
2. 打开 **Rufus**
    
3. 在 **Device** 中选择你的 U 盘
    
4. 在 **Boot Selection** 中选择刚刚下载好的 Linux Mint ISO
    
5. 将 **Persistent Storage（持久化存储）** 向右拖动  
    建议分配 **8GB 到 16GB**
    
6. 点击 **Start** 开始写入
    
7. 等待制作完成
    

完成后，安全弹出 U 盘。

### 什么是持久化存储？

持久化存储的作用是：  
你在 Linux Mint 系统里创建的文件、安装的软件、修改的配置，在重启后仍然会保留，而不是每次重启都恢复成初始状态。

---

## 步骤 3：从 U 盘启动电脑

### 操作步骤

1. 将制作好的 U 盘插入目标电脑
    
2. 重启电脑
    
3. 开机时连续按 **F12 / ESC / F2 / DEL** 之一，进入启动菜单或 BIOS  
    不同品牌电脑按键可能不同
    
4. 选择 **USB 启动**
    
5. 在启动菜单中选择：
    

Start Linux Mint

如果成功进入 Linux Mint 桌面，说明启动成功。

---

## 步骤 4：验证持久化功能是否正常

进入系统后，在桌面创建一个测试文件，例如：

test.txt

然后重启电脑，再次从 U 盘进入 Linux Mint。

如果重启后这个文件依然存在，就说明**持久化功能设置成功**。

---

## 步骤 5：安装基础工具

打开终端，执行以下命令：

sudo apt update  
sudo apt upgrade -y  
sudo apt install -y curl wget git build-essential

这一步会安装一些常用工具，为后续安装 Node.js 和 OpenClaw 做准备。

---

## 步骤 6：安装 Node.js

执行以下命令：

curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -  
sudo apt install -y nodejs

安装完成后，输入以下命令检查版本：

node -v

如果能正确显示版本号，说明 Node.js 安装成功。

---

## 步骤 7：安装 OpenClaw

执行以下命令：

npm install -g openclaw@latest

安装完成后，检查版本：

openclaw --version

如果能正常输出版本信息，说明安装成功。

---

## 步骤 8：初始化 OpenClaw

执行：

openclaw onboard

然后根据提示填写所需配置，例如 API Key 等信息。

这一步完成后，OpenClaw 的基本环境就配置好了。

---

## 步骤 9：测试运行

执行以下命令启动测试：

openclaw gateway --port 18789

如果程序能够正常启动，说明整个环境已经搭建完成。

---

# 五、常见问题

## 1. 电脑无法从 U 盘启动

请检查以下几项：

- BIOS 中是否启用了 **USB Boot**
    
- 是否关闭了某些限制启动方式的安全选项
    
- U 盘是否制作成功
    
- 是否选择了正确的启动项
    

---

## 2. Node.js 安装失败

可以先执行：

sudo apt update

然后再重新安装。  
如果网络较慢，也可能导致安装失败，可以稍后重试。

---

## 3. OpenClaw 无法启动

可以尝试重新安装：

npm install -g openclaw@latest

或者检查以下内容：

- Node.js 是否安装成功
    
- npm 是否可用
    
- API Key 是否填写正确
    
- 网络环境是否正常
    

---

# 六、备份建议

为了避免配置丢失，建议定期备份以下目录：

~/.config  
~/.local/share/openclaw

可以使用 `rsync` 备份，例如：

rsync -av ~/.local/share/openclaw /media/usb/backup/

这样即使系统出现问题，也可以快速恢复 OpenClaw 的配置和数据。

---

# 七、适合做成什么样的成品？

如果你愿意进一步折腾，这个 U 盘还可以做成一个更完整的“成品”：

- 定制 U 盘外壳或印字
    
- 预装常用开发工具
    
- 预设 OpenClaw 配置模板
    
- 搭配说明卡片，作为礼物或展示作品
    
- 制作成自己的便携式 Linux 工作环境
    

这样不仅更实用，也更有辨识度。

---

# 八、总结

通过这套方法，你可以做出一个：

- 可启动的 Linux Mint 随身系统
    
- 带持久化存储的便携工作环境
    
- 可直接运行 OpenClaw 的 U 盘设备
    

制作过程并不复杂，核心就是：

**下载镜像 → Rufus 写盘 → 开启持久化 → 启动系统 → 安装 Node.js → 安装并配置 OpenClaw**

只要按步骤操作，基本都能顺利完成。

如果中途遇到启动失败、安装报错、配置问题，也可以逐步排查解决。