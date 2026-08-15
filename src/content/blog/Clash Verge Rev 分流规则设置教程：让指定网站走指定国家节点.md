---
slug: 2026-08-15-clash
title: Clash Verge Rev 分流规则设置教程：让指定网站走指定国家节点
description: 教程
pubDate: 2026-08-15
tags:
  - 科学上网
---
> 本文以 **Clash Verge Rev** 为例，演示如何给指定网站单独设置代理组，并通过域名规则让该网站固定走指定国家或地区的代理节点。
> 
> 例如：让 `pikpak.com` 相关流量全部通过日本节点，而其他网站继续按照原来的规则正常分流。

## 一、为什么需要单独设置分流？

在使用 Clash Verge Rev 的时候，我们通常会直接使用机场提供的订阅配置。

这种情况下，大多数网站会按照订阅本身提供的规则进行分流。

但有时候我们会遇到这样的需求：

- 某个网站必须使用日本 IP
- 某个网站需要使用香港 IP
- 某些服务需要固定使用美国节点
- 某个网站使用默认节点访问速度比较慢
- 某些网站在不同国家 IP 下显示的内容不同

这时候，与其修改整个订阅的默认代理策略，更方便的方法是：

> **单独创建一个代理组，然后通过规则把指定网站交给这个代理组处理。**

例如，我们可以创建一个名为：

```
pikpak
```

的代理组，然后让：

```
pikpak.com
```

相关域名全部通过日本节点访问。

最终的逻辑就是：

```
访问 pikpak.com
        ↓
DOMAIN-SUFFIX 匹配
        ↓
pikpak 代理组
        ↓
日本节点
        ↓
目标网站
```

---

# 二、添加订阅

首先打开 **Clash Verge Rev**。

进入订阅管理页面，添加你正在使用的订阅。

添加完成以后，可以正常使用该订阅进行代理。

这里需要注意：

> **后面的代理组和规则都是针对这个订阅进行修改的。**

因此，建议先确认订阅已经正常更新，并且可以正常访问网络。

---

# 三、创建专用代理组

订阅添加完成以后，在对应的订阅上：

**右键 → 编辑代理组**

进入代理组编辑界面。

![https://images.openai.com/static-rsc-4/FyPrQ2PVWX3jDtQk8JgvWo4ntqsGDqWpG-Z3k4S1r8AO-N4i9r7b_Bm86Z8qD93rqCGAOrAW761Iow2ul11K_5JRnkjj17ZEnLauLfr1z60c9jx1mgQ0I8S1oPe3fUvAXXew-Yi-7oansJPEuCMJf5LdJtswJ22uj9e5Fag-Vjo1sh8-wqMiWGsZ1nfYGxVe?purpose=fullsize](https://images.openai.com/static-rsc-4/rM_myXjE_FpojFe2W6ikKOY-enT4_UDCNUOzirSJ2ZQr7QNRrfgVlD1DKmOrHP6FyCsMzqEd4aytD1EMWaGgpS6g1TQuTGXT1MwYHtPZt4chH_B-rt3G6Xnx7a70xrYIRnslEhOlCX9U0xlyZbwyN7ROG_W-jfuOfEC-w1jwqQg?purpose=inline)

![https://images.openai.com/static-rsc-4/mnN3tEDAUnNeQT2by3015b5Yqmcq-8osHrR_J-ygqppo50ZI-dQJhmPThR7K92yfcbp_mrOsn0S9UybNf47D3WTqe--ITFn6ZDk3dN8WSA6NMIUzOeRYDvWirKRG-i5yljMeeJUDCJ60hR42k9UPIP0kFq_LOAnRiZf3z8Bcbk6X3D43y86Gx5OeBL7KBIAQ?purpose=fullsize](https://images.openai.com/static-rsc-4/KbmJPtEi4U0_ywQ0-8KH6KSXpzqt1WzVU6zEaNXt5dV-VPy5-TRXUmr8u_-CNF9lAUhaBzQ1ruapK8EOoM1uzOZvu-8nqGxA1Ya7aDq3NmSyti5RMDZ06HHCOiTDEhsSS_BQ7fYOKO4TI06qS9M8EgiQ2d4DWqrapzVOccSlFRg?purpose=inline)

![https://images.openai.com/static-rsc-4/cuudipsVToQloiNusP1uSH-NeikFFXDpvg1kt7pQ_uoe47Crpd4dHR6iC-m3efR_f3jw34gmP3p7o-OHVs9YJrMv_OLc9cMk7M6VTogOlV093CLiOu94pRMYop5S-lG-wL-Tg4zMbw5nPFu4Pnf8DbGouCMhBwiV7fw5-CZImtJhOx4zM-wg_1Y54_eeIbuv?purpose=fullsize](https://images.openai.com/static-rsc-4/4WfmAzoqG6uayDGn69jzii2q_lSa3KJcFfvsHu9m40TkyfMpMVXT3m41s6HUUQbgdi-HFdqQ0uZqJ5NhItugYM6-pTJPCaDFdvwENXzyypvAvrbHwWRSMwTUATc9sDKEJsQIlHOdE8VfA0NoNNoUAF3kXFJyswltwlqShDowRyo?purpose=inline)

## 1. 设置代理组名称

首先创建一个新的代理组。

例如：

```
pikpak
```

这里的名称可以自己定义。

例如：

```
pikpak
日本网站
PikPak
JP
香港服务
```
都可以。

但建议使用简单、容易识别的名称。

例如：

```
pikpak
```

---

## 2. 引入代理

接下来选择：

**引入代理**

然后选择希望这个代理组使用的国家或地区节点。

例如：

```
日本
```

如果你的订阅中有：

```
日本 01
日本 02
日本 03
香港 01
香港 02
美国 01
```

可以根据自己的需求选择。

例如我们希望 PikPak 使用日本节点，那么就选择：

```
日本
```

---

## 3. 添加前置代理组

选择好代理以后，点击：

**添加前置代理组**

然后保存配置。

这里可以简单理解为：

> 我们刚刚创建了一个叫 `pikpak` 的“专用通道”，这个通道里面使用日本节点。

以后只要规则指定：

```
pikpak
```

那么匹配到的流量就会进入这个代理组。

---

# 四、为网站添加分流规则

代理组创建完成以后，还需要告诉 Clash：

> **哪些网站应该使用这个代理组？**

这一步非常重要。

再次找到刚刚的订阅，然后：

**右键 → 编辑规则**

进入规则编辑界面。

![https://images.openai.com/static-rsc-4/hYYHs76hKcpQErRyTnuiwJt8nL9RCLyXqtmFzrBspFNa9PQNp0xIa-FwJhl8S9aSvLPEaWKfYH-4PtiN613f54XFpATyQDDRder2A7n_o5J24vtwoFa0-mIEjNFVic_0uiHSQvtbBAbEwG-9X43zemXI-wR5ssUb6QpAmxMepVysSVV5jC8UxOkbB0ogoOcn?purpose=fullsize](https://images.openai.com/static-rsc-4/CkM6d62bSxj5fhRRNQm5KvVUKfbqM5Q6vpIYcC9zxYSxvUGK9yHaWDgHpT2jA_QwwTRIzWNieCvtzKUoPqQ3vr6RELOA80PxIv-I-jKvYeyGhOOdfkcNacVZS9LU5AEkPXPC2R6pVZ4e40ySVH5J2Tlp-LUFXim2Z95a4P0qpok?purpose=inline)

![https://images.openai.com/static-rsc-4/0IHn7_m54l2jrg7V6q94wmhJ6T-RvYVEBzr2ah6vuXjrXvo_rdSlSo1fboAd2uTD0-0gAR1X0YongvmbQy2pw3j500N1yyesXSPMF45ntkHuwOkr6erXc_wVEz7WVfCy4Fj6xfP9VgdSMg3e3DKeHrjU7a3AmmRg1owPMDbW4xEBqERAkLvqMnmFqsOqb8TH?purpose=fullsize](https://images.openai.com/static-rsc-4/5bySq2rnZuf2KCqnagNQsbegRPXO1Z2UCapvBwbuO49PiKJI_n1jpDk9De_YurZqDZznCNwcU1mH8FXLzJ4HudoGtuuuM-KrOSelCSqXMEhn776XR0lEnNEEMFlWEz3QtJN3-e6Q3rxoqfthfItRmVo9dD_32XV_wSs_4e2pKjk?purpose=inline)

![https://images.openai.com/static-rsc-4/lTeFT69D5LikFYIzDIXIhHxiwt1fkBDxumXDCqOKceaIhGrWB-wmaWjbQ6QI6PYaLxnlVhSoRMpDFOI4643-rkssmoDoBMsHp3JweRA6Ml0TQqdIqCZiN8ReuaRqCz4L2XMjBo-Bv-hJA-8h_UuoHUgQtkyvXRjhblwfrRAVz62mAv_jAx0twYS8uq7eJCh8?purpose=fullsize](https://images.openai.com/static-rsc-4/gpJxFzrek8T2GsEJ3TwYXcEnMXFaKAR3XYs7L7tljw0O45TFXqAuTMhr5z07aqRLk--IBV64gR3RhZcliAm_pK9Uc7iEk4pw376WFA6TplNcFGX61-x9FSzuJzMcg6KhDGPHRwmnhcUhVEqSGMA0pV0n8pqt1-ulnbFcdnTw6DU?purpose=inline)

---

# 五、添加 DOMAIN-SUFFIX 规则

在规则编辑页面中，选择规则类型：

```
DOMAIN-SUFFIX
```

也就是：

> **匹配域名后缀**

例如我们希望：

```
pikpak.com
```

走刚刚创建的 `pikpak` 代理组。

那么规则内容填写：

```
pikpak.com
```

代理策略选择：

```
pikpak
```

最终类似：

|项目|设置|
|---|---|
|规则类型|`DOMAIN-SUFFIX`|
|规则内容|`pikpak.com`|
|代理策略|`pikpak`|

然后点击：

**添加前置规则**

最后保存。

---

# 六、DOMAIN-SUFFIX 是什么意思？

这里很多新手容易搞混。

例如：

```
DOMAIN-SUFFIX,pikpak.com,pikpak
```

它并不只是匹配：

```
pikpak.com
```

还可以匹配它的子域名，例如：

```
www.pikpak.com
api.pikpak.com
cdn.pikpak.com
xxx.pikpak.com
```

因此，如果一个网站存在多个子域名，通常使用：

```
DOMAIN-SUFFIX
```

会比只匹配单独的域名更加方便。

---

# 七、为什么不是直接填写完整网址？

例如你访问：

```
https://www.pikpak.com/
```

在 Clash 规则中一般不需要填写：

```
https://www.pikpak.com/
```

而是填写域名：

```
pikpak.com
```

因为 Clash 规则匹配的是网络请求中的**域名**，而不是浏览器地址栏里的完整 URL。

所以通常写：

```
pikpak.com
```

即可。

---

# 八、最终配置逻辑

完成以后，整个分流结构就比较清晰了。

例如：

### 代理组
```
代理组名称：
pikpak

引入代理：
日本节点
```

### 规则
```
规则类型：
DOMAIN-SUFFIX

规则内容：
pikpak.com

代理策略：
pikpak
```

最终形成：
```
pikpak.com
     │
     ▼
DOMAIN-SUFFIX
     │
     ▼
   pikpak
     │
     ▼
  日本节点
     │
     ▼
 pikpak.com
```
这样就实现了：

> **只有匹配到 `pikpak.com` 的流量使用日本节点。**

其他网站则继续按照原来的 Clash 规则处理。

---

# 九、如何确认分流是否成功？

配置完成以后，不要直接认为规则一定生效。

最简单的方法就是：

### 第一步：打开目标网站

例如：

```
https://pikpak.com
```

正常访问一次。

---

### 第二步：打开 Clash Verge Rev 日志

回到 Clash Verge Rev，打开：

**日志（Logs）**

然后重新刷新目标网站。

此时可以看到 Clash 捕获到的网络请求。

例如可能会看到类似：

```
www.pikpak.com
```

或者：
```
api.pikpak.com
```
然后观察它所使用的代理策略。

如果看到请求最终进入：
```
pikpak
```
代理组，就说明规则已经生效。

---

# 十、如果发现没有走指定节点怎么办？

如果日志中发现网站没有进入刚刚创建的代理组，可以按照下面几个方向检查。

## 1. 检查域名是否填写正确

例如目标网站实际使用：
```
pikpak.com
```
那么规则应该填写：
```
pikpak.com
```
而不是：
```
https://pikpak.com
```
也不要填写：
```
www.pikpak.com/
```
---

## 2. 检查代理组是否创建成功

确认代理组中确实存在：
```
pikpak
```
并且里面已经添加了可用的日本节点。

---

## 3. 检查规则是否保存

编辑规则以后，一定要点击：

**添加前置规则 → 保存**

否则修改可能不会真正写入订阅配置。

---

## 4. 查看 Clash 日志

这是最重要的一步。

不要只看浏览器能不能打开网站，而应该观察：

> **Clash 实际把这个请求交给了哪个策略组。**

尤其是一个网站同时存在：
```
www.pikpak.com

api.pikpak.com

cdn.pikpak.com
```
等多个域名的时候，日志可以帮助我们判断到底是哪一个域名没有匹配到规则。

---

# 十一、DOMAIN-SUFFIX 分流的实际应用

掌握这个方法以后，就不只是 PikPak 可以使用。

例如：

### 让某个网站走日本节点
```
DOMAIN-SUFFIX,example.jp,日本
```
### 让某个网站走香港节点
```
DOMAIN-SUFFIX,example.com,香港
```
### 让某个服务走美国节点
```
DOMAIN-SUFFIX,example.com,美国
```
当然，前提是你已经提前创建对应的代理组。

例如：
```
日本服务
    ↓
日本节点

香港服务
    ↓
香港节点

美国服务
    ↓
美国节点
```
然后再通过规则把不同域名分别指向对应的代理组。

---

# 十二、推荐的配置思路

如果你经常需要针对不同网站指定不同国家节点，我比较推荐采用：
```
                 ┌─ 日本节点
pikpak ──────────┤
                 └─ 日本节点

                 ┌─ 香港节点
香港服务 ─────────┤
                 └─ 香港节点

                 ┌─ 美国节点
美国服务 ─────────┤
                 └─ 美国节点
```
再通过规则进行分流：
```
DOMAIN-SUFFIX,pikpak.com,pikpak

DOMAIN-SUFFIX,xxx.com,香港服务

DOMAIN-SUFFIX,xxx.com,美国服务
```
这样以后更换节点的时候，只需要修改代理组，不需要重新修改每一条域名规则。

---

# 十三、总结

整个操作实际上只有两个核心步骤：

### ① 创建代理组
```
订阅
 ↓
右键
 ↓
编辑代理组
 ↓
创建代理组
 ↓
例如：pikpak
 ↓
引入日本节点
 ↓
添加前置代理组
 ↓
保存
```
### ② 创建域名规则
```
订阅
 ↓
右键
 ↓
编辑规则
 ↓
规则类型：DOMAIN-SUFFIX
 ↓
规则内容：pikpak.com
 ↓
代理策略：pikpak
 ↓
添加前置规则
 ↓
保存
```
最后：
```
打开 pikpak.com
      ↓
刷新网页
      ↓
打开 Clash Verge 日志
      ↓
查看请求
      ↓
确认是否进入 pikpak 代理组
```
如果日志显示请求进入了我们刚刚创建的 `pikpak` 代理组，并且使用的是指定的日本节点，那么整个分流配置就已经成功了。

> **核心记忆：**
> 
> **代理组决定“走哪个节点”，规则决定“哪些网站走这个代理组”。**
> 
> 两者配合起来，就可以实现非常灵活的 Clash Verge Rev 分流。