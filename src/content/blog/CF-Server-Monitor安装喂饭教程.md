---
slug: 2026-07-09-cf
title: CF-Server-Monitor安装喂饭教程
description: 教程
pubDate: 2026-07-09
tags:
  - 探针
---
本文为[CF-Server-Monitor](https://github.com/huilang-me/CF-Server-Monitor/) 项目安装教程。

前提：Cloudflare有效账户，GitHub账户

### 1.Fork项目

打开项目地址[CF-Server-Monitor](https://github.com/huilang-me/CF-Server-Monitor/) ,老规矩，右上角来个Star，然后点[Fork](https://github.com/huilang-me/CF-Server-Monitor/fork)

![](https://huilang.me/wp-content/uploads/2026/06/2026-06-19-389.png)

点右下角Create fork。

### 2.创建应用程序

打开[Cloudflare Workers & Pages](https://dash.cloudflare.com/?to=/:account/workers-and-pages) （右上角头像可用修改语言为中文，下面以中文界面来介绍），点击右上角[创建应用程序](https://dash.cloudflare.com/?to=/:account/workers-and-pages/create)

![创建应用程序](https://huilang.me/wp-content/uploads/2026/06/2026-06-19-298.png)

选择Continue with GIthub，如果还没绑定过GitHub，需要在下拉点Add GitHub Account绑定。选择CF-Server-Monitor，点下一步

![](https://huilang.me/wp-content/uploads/2026/06/2026-06-19-966.png)

项目名称填 cf-server-monitor ，构建命令填`npm run build:frontend`，部署命令填`npx wrangler deploy --keep-vars`(一定不要漏了-keep-vars)，点击部署。

![](https://huilang.me/wp-content/uploads/2026/06/2026-06-19-380.png)

点击部署后，会显示 “正在设置您的存储库。这可能需要几秒钟时间... ”，然后可用看到部署流程，大概30秒左右后部署成功

![](https://huilang.me/wp-content/uploads/2026/06/2026-06-19-833.png)

### 3.  设置环境变量

滚动回顶部，点击上面的设置，在变量和密钥的右侧点击添加（下面的触发事件会看到Cron任务，如果没有估计前面步骤不对，或者账户有问题）。

![](https://huilang.me/wp-content/uploads/2026/06/2026-06-19-560.png)

在右侧出来的弹窗，变量名称填 API_SECRET ，值填写密码（建议使用随机数,不要包含特殊字符比如%#），需要记住一次，然后点右下角部署，等待几秒即可。

![](https://huilang.me/wp-content/uploads/2026/06/2026-06-19-744.png)

绑定成功后会显示

![](https://huilang.me/wp-content/uploads/2026/06/2026-06-20-792.png)

### 4. 查看域名和绑定域名

点击顶部的**域**，可用查看项目域名，比如我这个的cf-server-monitor.dashworkers.workers.dev，这里在右下角可用绑定你自己的域名（默认的域名部分地区可能不能访问。有自己域名的，建议绑定一个）

![](https://huilang.me/wp-content/uploads/2026/06/2026-06-19-183.png)

访问这个域名，会看到成功部署了，至此Cloudflare Workers部署完成。

### 5. 后台管理与设置

访问后台地址/admin, 默认用户名admin，默认密码是刚才API_SECRET的值。

![](https://huilang.me/wp-content/uploads/2026/06/2026-06-19-243.png)

第一次设置请修改用户名和密码，强烈建议设置JWT密钥。其他选项可用根据需求进行设置，Turnstile以及Cloudflare设置等高级用法在后面补充。

### 6. 填加服务器

在服务器tab添加服务器名称和分类名称，点添加服务器

![](https://huilang.me/wp-content/uploads/2026/06/2026-06-19-398.png)

添加完，可用点右侧的编辑，根据实际进行修改

![](https://huilang.me/wp-content/uploads/2026/06/2026-06-19-252.png)

![](https://huilang.me/wp-content/uploads/2026/06/2026-06-19-611.png)

保存后，点刚才编辑按钮左侧的复制按钮，会出来一个弹窗

![](https://huilang.me/wp-content/uploads/2026/06/2026-06-19-663.png)

这里根据需要选择系统，如果需要校正月流量，在这里填写，然后点复制命令。

```
curl -sL https://你的域名/install.sh | bash -s install xxx
```

将你复制出来的命令粘贴在你的服务器上运行即可（需要root权限）。

### 7. 高级用法

#### 7.1 启用**Turnstile（Cloudflare盾）**

访问[Turnstile](https://dash.cloudflare.com/?to=/:account/turnstile)，点击手动添加小部件。小组件名称随便填，注意下面的添加主机，需要填上域名比如默认的workers.dev，如果有自定义域名，在这里一定要添加上（这里以example.com演示），其他默认，滚动到底部点击右下角创建。

![](https://huilang.me/wp-content/uploads/2026/06/2026-06-19-635.png)

保存后会出来站点密钥和密钥。将这两个值对应粘贴回刚才探针后台，并勾选**启用 Turnstile后保存**即可。

![](https://huilang.me/wp-content/uploads/2026/06/2026-06-19-574.png)

![](https://huilang.me/wp-content/uploads/2026/06/2026-06-19-973.png)

保存后，成功开启Cloudflare护盾

![](https://huilang.me/wp-content/uploads/2026/06/2026-06-19-90.png)

#### 7.2 Cloudflare额度设置

打开 [Cloudflare Dashboard](https://dash.cloudflare.com/?to=/:account/workers-and-pages)在右下角获取Account ID，填入探针设置选项的Cloudflare Account ID

![](https://huilang.me/wp-content/uploads/2026/06/2026-06-19-701.png)

访问 [用户令牌](https://dash.cloudflare.com/profile/api-tokens) ，点击右上角创建令牌。权限选择 **账户 - 账户分析 - 读取**

![](https://huilang.me/wp-content/uploads/2026/06/2026-06-19-767.png)

复制这个令牌，粘贴到探针后台的Cloudflare API Token选项

![](https://huilang.me/wp-content/uploads/2026/06/2026-06-19-940.png)![](https://huilang.me/wp-content/uploads/2026/06/2026-06-19-692.png)

点击右下角保存。保存成功后，点击查询当日D1 & Workers用量，

![](https://huilang.me/wp-content/uploads/2026/06/2026-06-19-780.png)

### 8. 版本升级

**Workers升级：**进入你自己的Fork后的GitHub项目地址，点击 **Sync fork** → **Update branch** 同步上游更新，Cloudflare Workers 会自动检测到代码变更并重新部署。

如果你修改过文件，可用选择放弃修改再同步（点击Discard 1 commit）

![](https://huilang.me/wp-content/uploads/2026/06/2026-06-19-369.png)

同步成功后，等30多秒后会自动更新到Workers上。

**探针升级:**

```
# Linux
curl -sL https://你的项目.你的子域.workers.dev/install.sh | bash -s install
# Alpine
curl -sL https://你的项目.你的子域.workers.dev/install-alpine.sh | sh -s install
# OpenWrt
curl -sL https://你的项目.你的子域.workers.dev/install-openwrt.sh | sh -s install
```

为了安全，没有提供自动升级功能，如有需要自行将升级脚本加入服务器定时任务。

比如 crontab -e 中添加以下内容，每天凌晨 0 点执行升级：

```
# Linux
0 0 * * * curl -sL https://你的项目.你的子域.workers.dev/install.sh | bash -s install
```