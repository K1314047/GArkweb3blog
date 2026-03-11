---
slug: 2026-01-24-windows-terminal-proxy
title: ALXC 自动交易脚本使用指南 (失效)
description: alxc是贾跃亭投资，顺手做做
pubDate: 2026-01-24
tags:
  - 撸毛
  - 脚本
---

#### **前提准备**

1. **登录账户**：请先在浏览器中正常访问 ALXC 网站并登录您的账户

1. **进入交易界面**：确保已进入可进行"开多"（Long Position）和"开空"（Short Position）操作的交易页面

1. **检查交易次数**：确认页面显示还有可用的交易次数（未显示"chances in xx:xx:xx"）

#### **脚本安装步骤**

**第一步：打开开发者工具**

- **Windows/Linux**：按下键盘上的 `**F12**` 键

- **Mac**：按下 `**Command + Option + I**`

- 或者右键点击页面空白处，选择"检查"（Inspect）

**第二步：切换到控制台**

1. 在开发者工具顶部，找到并点击 **"Console"**（控制台）标签页

1. 确保看到空白输入区域和 `>` 提示符

**第三步：复制并运行脚本**

1. 复制完整的脚本代码（从 `let running = true;` 到最后的 `};`）

1. 在控制台中点击鼠标，将代码粘贴到输入区域

1. 按下 `**Enter**`（回车键）执行

**第四步：确认启动成功**

执行后控制台会显示绿色提示：

text

```plain
🚀 AIxC 自动脚本已启动（适配新倒计时界面）！
• 每 13~17 秒随机点击
• 当两个按钮都显示 "xx chances in xx:xx:xx" 时自动停止
手动停止：stopAutoClick()
```

#### **脚本工作说明**

- **运行间隔**：每 **13-17秒** 随机时间执行一次

- **选择逻辑**：随机选择"开多"或"开空"按钮（仅当该方向还有次数时）

- **自动停止**：当两个方向都显示倒计时（剩余0次）时自动停止

- **手动停止**：在控制台输入 `stopAutoClick()` 并按回车

#### **监控与维护**

1. **保持页面活动**：不要最小化浏览器窗口，确保标签页处于活动状态

1. **不要刷新页面**：刷新会重置脚本，需要重新执行

1. **检查控制台输出**：可观察每次点击的确认信息

1. **注意平台限制**：部分交易平台可能检测自动化操作

#### **重要提醒**

- 仅用于个人学习目的

- 自动化交易存在风险，请谨慎使用

- 确保了解平台的使用条款

- 建议先用小额资金测试

#### **常见问题**

**Q：脚本没有运行？**

A：检查控制台是否有错误信息，确认页面已加载完毕

**Q：想中途停止？**

A：在控制台输入 `stopAutoClick()` 并按回车

**Q：页面刷新后？**

A：需要重新按步骤执行脚本

**Q：按钮没找到？**

A：确保交易页面已正确加载，且浏览器窗口足够宽显示所有元素

------

**📌 建议**：首次使用时，建议在控制台执行后观察几分钟，确认脚本按预期工作再离开。

#### **脚本代码**

```javascript
// 建议先刷新网页停止旧脚本，再运行此脚本
var autoBilingual = setInterval(function() {
    // --- 1. 侦测市场趋势 ---
    // 检查是否有向上趋势的图标 (lucide-trending-up)
    const marketIsGoingUp = document.querySelector('span svg.lucide-trending-up') !== null;

    // --- 2. 制定反向策略 (定义目标关键词) ---
    // 逻辑：涨了就买跌/Short，跌了就买涨/Long
    
    let targetKeywords = [];
    let actionName = "";

    if (marketIsGoingUp) {
        // 市场涨 -> 我们做空 (Short / 下跌)
        targetKeywords = ["Place Short", "預測下跌"]; 
        actionName = "📉 逆势做空";
    } else {
        // 市场跌 -> 我们做多 (Long / 上涨)
        targetKeywords = ["Place Long", "預測上漲"];
        actionName = "📈 逆势做多";
    }

    // --- 3. 遍历寻找并点击 ---
    const candidates = document.querySelectorAll('div.w-full.rounded-lg'); // 选取潜在按钮
    let hasClicked = false;

    for (let i = 0; i < candidates.length; i++) {
        const el = candidates[i];
        const text = el.innerText || "";

        // 核心修改：检查按钮文字是否包含 targetKeywords 数组里的任意一个词
        // 只要包含 "Place Short" 或者 "預測下跌"，就视为命中
        const isMatch = targetKeywords.some(keyword => text.includes(keyword));

        if (isMatch) {
            el.click();
            hasClicked = true;
            // 打印日志，显示当前趋势和点击的内容
            console.log(`[${new Date().toLocaleTimeString()}] 市场:${marketIsGoingUp ? '⬆️' : '⬇️'} -> ${actionName} -> ✅ 已点击: "${text.trim()}"`);
            break; 
        }
    }

    if (!hasClicked) {
        console.log(`[${new Date().toLocaleTimeString()}] ⚠️ 未找到目标按钮 (寻找: ${targetKeywords.join(' 或 ')})`);
    }

}, 3000); // 3秒一次

console.log("🚀 双语反向策略已启动！支持中文/英文界面。");
console.log(`如需停止，请输入: clearInterval(autoBilingual)`);
```
