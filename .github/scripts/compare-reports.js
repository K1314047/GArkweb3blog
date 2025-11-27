// compare-reports.js
/**
 * 比较两个页面体积报告并生成差异报告
 * 用于 PR 中比较当前版本与 base 版本的差异
 */

import { readFile, writeFile } from "fs/promises";

const CURRENT_REPORT_PATH = process.env.CURRENT_REPORT || "./reports-current/page-size-report.json";
const BASE_REPORT_PATH = process.env.BASE_REPORT || "./reports-base/page-size-report.json";
const OUTPUT_FILE = process.env.OUTPUT_FILE || "./comparison-report.md";
// 从 GitHub Actions 环境变量中获取仓库信息，用于生成动态链接
const GITHUB_REPOSITORY = process.env.GITHUB_REPOSITORY || "your/repo";

/**
 * 读取 JSON 报告
 */
async function readReport(path) {
  try {
    const content = await readFile(path, "utf-8");
    return JSON.parse(content);
  } catch (error) {
    // 如果 base 报告不存在，返回一个空报告结构，避免流程中断
    if (error.code === 'ENOENT' && path === BASE_REPORT_PATH) {
      console.warn(`警告：Base 报告文件 ${path} 未找到。将所有当前值视为新增。`);
      return { metadata: {}, results: [] };
    }
    throw new Error(`无法读取报告文件 ${path}: ${error.message}`);
  }
}

/**
 * 格式化大小变化
 * @param {number} change - 变化量（KiB）
 * @param {number} baseValue - 基准值（KiB）
 * @returns {string} 格式化的字符串，如 "+12.34(+5.67%)" 或 "-12.34(-5.67%)"
 */
function formatChange(change, baseValue) {
  if (change === 0) return "0.000(0.00%)";

  const sign = change > 0 ? "+" : "";
  const percent = baseValue > 0 ? (change / baseValue) * 100 : Infinity;
  
  if (percent === Infinity) {
    return `${sign}${change.toFixed(3)}(new)`;
  }
  
  return `${sign}${change.toFixed(3)}(${sign}${percent.toFixed(2)}%)`;
}

/**
 * 为变化添加颜色标记
 * @param {number} transferChange - transfer size 变化
 * @param {number} resourceChange - resource size 变化
 * @param {number} baseTransfer - base transfer size
 * @param {number} baseResource - base resource size
 * @returns {string} 带颜色标记的字符串
 */
function formatColoredChange(transferChange, resourceChange, baseTransfer, baseResource) {
  if (transferChange === 0 && resourceChange === 0) {
    return "-";
  }

  const transferStr = formatChange(transferChange, baseTransfer);
  const resourceStr = formatChange(resourceChange, baseResource);

  let coloredTransfer = transferStr;
  if (transferChange > 0.01) { // 增加一个小的阈值避免浮点数误差
    coloredTransfer = `🔴 <span style="color: red;">${transferStr}</span>`;
  } else if (transferChange < -0.01) {
    coloredTransfer = `🟢 <span style="color: green;">${transferStr}</span>`;
  }

  let coloredResource = resourceStr;
  if (resourceChange > 0.01) {
    coloredResource = `🔴 <span style="color: red;">${resourceStr}</span>`;
  } else if (resourceChange < -0.01) {
    coloredResource = `🟢 <span style="color: green;">${resourceStr}</span>`;
  }

  return `${coloredTransfer} / ${coloredResource}`;
}

/**
 * 生成当前大小的表格
 */
function generateSizeTable(title, data, typeOrder, typeLabels) {
  let content = ``;
  content += `Unit: KiB, Format: transfer size(gzipped) / resource size\n\n`;
  content += `| Page |`;
  for (const type of typeOrder) {
    content += ` ${typeLabels[type]} |`;
  }
  content += ` Total |\n`;
  content += `|:---|`;
  content += `---:|`.repeat(typeOrder.length);
  content += `---:|\n`;

  for (const row of data) {
    content += row + "\n";
  }
  content += `\n`;

  return `<details>\n<summary><b>${title}</b></summary>\n\n${content}</details>\n\n`;
}

/**
 * 生成变化的表格
 */
function generateChangesTable(title, changes, typeOrder, typeLabels, columnsWithChanges) {
  let content = ``;
  content += `Unit: KiB, Format: transfer size change(%) / resource size change(%)\n\n`;
  content += `🔴 <span style="color: red;">Increase</span> | 🟢 <span style="color: green;">Decrease</span>\n\n`;

  content += `| Page |`;
  for (const type of columnsWithChanges) {
    content += ` ${typeLabels[type]} |`;
  }
  content += ` Total |\n`;
  content += `|:---|`;
  content += `---:|`.repeat(columnsWithChanges.length);
  content += `---:|\n`;

  for (const change of changes) {
    const urlPath = change.url === '/' ? '/' : `\`${change.url}\``;
    content += `| ${urlPath} |`;

    for (const type of columnsWithChanges) {
      const { transferChange, resourceChange, baseTransfer, baseResource } = change.types[type];
      content += ` ${formatColoredChange(transferChange, resourceChange, baseTransfer, baseResource)} |`;
    }

    const { transferChange, resourceChange, baseTransfer, baseResource } = change.types.total;
    content += ` **${formatColoredChange(transferChange, resourceChange, baseTransfer, baseResource)}** |\n`;
  }
  content += `\n`;
  
  return `## ${title}\n\n${content}`;
}

/**
 * 生成比较报告
 */
function generateComparisonReport(currentReport, baseReport) {
  let markdown = `# Page Size Comparison Report\n\n`;
  markdown += `Comparing **current** branch with **base** branch.\n\n`;

  // --- 元数据和环境信息 ---
  markdown += `**Versions:**\n`;
  const repoUrl = `https://github.com/${GITHUB_REPOSITORY}`;

  if (currentReport.metadata?.projectVersion) {
    const version = currentReport.metadata.projectVersion;
    // 如果是 commit hash，添加链接
    const versionText = version.match(/^[0-9a-f]{40}$/i)
      ? `[\`${version.substring(0, 7)}\`](${repoUrl}/commit/${version})`
      : `\`${version}\``;
    markdown += `- Current Project Version: ${versionText}\n`;
  }

  if (baseReport.metadata?.projectVersion) {
    const version = baseReport.metadata.projectVersion;
    const versionText = version.match(/^[0-9a-f]{40}$/i)
      ? `[\`${version.substring(0, 7)}\`](${repoUrl}/commit/${version})`
      : `\`${version}\``;
    markdown += `- Base Project Version: ${versionText}\n`;
  }

  if (currentReport.metadata?.lhciVersion) {
    markdown += `- Lighthouse CI Version: \`${currentReport.metadata.lhciVersion}\`\n`;
  }
  markdown += `\n`;

  // --- 资源类型定义 ---
  const typeOrder = ["document", "script", "stylesheet", "font", "image", "other"];
  const typeLabels = {
    document: "Document",
    script: "Script",
    stylesheet: "Stylesheet",
    font: "Font",
    image: "Image",
    other: "Other",
    total: "Total",
  };

  // --- 准备当前大小的数据 ---
  const currentSizeData = currentReport.results.map(currentResult => {
    const urlPath = currentResult.url === '/' ? '/' : `\`${currentResult.url}\``;
    let row = `| ${urlPath} |`;

    for (const type of typeOrder) {
      const transfer = (currentResult.resources[type]?.transferSize || 0) / 1024;
      const resource = (currentResult.resources[type]?.resourceSize || 0) / 1024;
      row += ` ${transfer.toFixed(3)} / ${resource.toFixed(3)} |`;
    }

    const totalTransfer = (currentResult.resources.total?.transferSize || 0) / 1024;
    const totalResource = (currentResult.resources.total?.resourceSize || 0) / 1024;
    row += ` **${totalTransfer.toFixed(3)} / ${totalResource.toFixed(3)}** |`;
    return row;
  });

  // --- 计算变化 ---
  const changes = [];
  for (const currentResult of currentReport.results) {
    const baseResult = baseReport.results.find((r) => r.url === currentResult.url) || { resources: {} };

    let pageHasChanges = false;
    const pageChanges = { url: currentResult.url, types: {} };

    for (const type of [...typeOrder, "total"]) {
      const currentTransfer = (currentResult.resources[type]?.transferSize || 0) / 1024;
      const currentResource = (currentResult.resources[type]?.resourceSize || 0) / 1024;
      const baseTransfer = (baseResult.resources[type]?.transferSize || 0) / 1024;
      const baseResource = (baseResult.resources[type]?.resourceSize || 0) / 1024;

      const transferChange = currentTransfer - baseTransfer;
      const resourceChange = currentResource - baseResource;

      // 使用一个小的阈值来判断是否有实质性变化
      if (Math.abs(transferChange) > 1e-4 || Math.abs(resourceChange) > 1e-4) {
        pageHasChanges = true;
      }

      pageChanges.types[type] = { transferChange, resourceChange, baseTransfer, baseResource };
    }

    if (pageHasChanges) {
      changes.push(pageChanges);
    }
  }

  // --- 动态确定需要展示变化的列 ---
  const columnsWithChanges = typeOrder.filter(type =>
    changes.some(change => {
      const { transferChange, resourceChange } = change.types[type];
      return transferChange !== 0 || resourceChange !== 0;
    })
  );

  // --- 生成 Markdown 内容 ---
  if (changes.length > 0) {
    markdown += generateChangesTable(
      "Page Size Changes",
      changes,
      typeOrder,
      typeLabels,
      columnsWithChanges
    );
  } else {
    markdown += `## Page Size Changes\n\n✅ No significant changes detected.\n\n`;
  }

  if (currentSizeData.length > 0) {
    markdown += generateSizeTable(
      "Current Page Size",
      currentSizeData,
      typeOrder,
      typeLabels
    );
  }

  markdown += `---\n\n*This comparison report is automatically generated.*`;
  return markdown;
}

/**
 * 主函数
 */
async function main() {
  try {
    console.log("Reading report files...");
    const currentReport = await readReport(CURRENT_REPORT_PATH);
    const baseReport = await readReport(BASE_REPORT_PATH);

    console.log("Generating comparison report...");
    const comparisonReport = generateComparisonReport(currentReport, baseReport);

    console.log("Saving comparison report...");
    await writeFile(OUTPUT_FILE, comparisonReport);

    console.log(`\n✓ Comparison report generated successfully!`);
    console.log(`  - Output file: ${OUTPUT_FILE}`);
  } catch (error) {
    console.error("❌ Failed to generate comparison report:", error.message);
    process.exit(1);
  }
}

main();
