// generate-report.js
/**
 * 生成页面体积评估报告
 * 解析 Lighthouse 结果并生成可读的报告
 */

import { readFile, writeFile } from 'fs/promises';
import { resolve } from 'path';

const LIGHTHOUSE_RESULTS_DIR = process.env.LIGHTHOUSE_RESULTS_DIR || '.lighthouseci';
const OUTPUT_DIR = process.env.OUTPUT_DIR || './reports';
const OUTPUT_FILENAME = process.env.OUTPUT_FILENAME || 'page-size-report';
const JSON_ONLY = process.env.JSON_ONLY === 'true';

/**
 * 解析 Lighthouse 结果
 */
async function parseLighthouseResults() {
	const fs = (await import('fs')).promises;
	const path = (await import('path')).default;

	// 扫描目录中的所有 Lighthouse 结果文件
	console.log('Scanning for Lighthouse result files...');

	const files = (await fs.readdir(LIGHTHOUSE_RESULTS_DIR)).filter((f) => f.endsWith('.json') && f.startsWith('lhr-'));

	if (files.length === 0) {
		throw new Error(`No Lighthouse result files found in ${LIGHTHOUSE_RESULTS_DIR}`);
	}

	console.log(`Found ${files.length} Lighthouse result file(s)`);

	// 按 URL 分组结果
	const urlGroups = {};
	for (const file of files) {
		const filePath = resolve(LIGHTHOUSE_RESULTS_DIR, file);
		const report = JSON.parse(await readFile(filePath, 'utf-8'));
		const url = report.finalUrl || report.requestedUrl;

		if (!urlGroups[url]) {
			urlGroups[url] = [];
		}
		urlGroups[url].push(filePath);
	}

	// 为每个 URL 创建一个条目（使用最后一个运行结果）
	const entries = [];
	for (const [url, files] of Object.entries(urlGroups)) {
		entries.push({
			url,
			jsonPath: path.basename(files[files.length - 1]),
		});
	}

	const results = [];

	for (const entry of entries) {
		const reportPath = resolve(LIGHTHOUSE_RESULTS_DIR, entry.jsonPath);
		const report = JSON.parse(await readFile(reportPath, 'utf-8'));

		const networkRequests = report.audits['network-requests'];
		const items = networkRequests?.details?.items || [];

		// 按资源类型统计
		const resources = {};
		const resourceTypes = ['document', 'font', 'script', 'stylesheet', 'image', 'fetch', 'other'];

		// 初始化所有资源类型
		for (const type of resourceTypes) {
			resources[type] = {
				transferSize: 0,
				resourceSize: 0,
			};
		}

		// 统计资源
		for (const item of items) {
			// 忽略 data: 和 blob: URL
			if (item.url.startsWith('data:') || item.url.startsWith('blob:')) {
				continue;
			}

			const resourceType = (item.resourceType || 'other').toLowerCase();
			const transferSize = item.transferSize || 0;
			const resourceSize = item.resourceSize || 0;

			if (resources[resourceType]) {
				resources[resourceType].transferSize += transferSize;
				resources[resourceType].resourceSize += resourceSize;
			} else {
				// 如果是未知类型，归类到 other
				resources.other.transferSize += transferSize;
				resources.other.resourceSize += resourceSize;
			}
		}

		// 计算总计
		resources.total = {
			transferSize: 0,
			resourceSize: 0,
		};
		for (const type of resourceTypes) {
			resources.total.transferSize += resources[type].transferSize;
			resources.total.resourceSize += resources[type].resourceSize;
		}

		// 将完整 URL 转换为相对路径
		const urlObj = new URL(entry.url);
		const relativePath = urlObj.pathname;

		results.push({
			url: relativePath,
			resources,
		});
	}

	return results;
}

/**
 * 生成 Markdown 报告
 */
function generateMarkdownReport(results, metadata = {}) {
	let markdown = `# Page Size Audit Report\n\n`;

	// 添加元数据
	if (metadata.projectVersion || metadata.lhciVersion || metadata.generatedAt) {
		markdown += `**Test Environment:**\n`;
		if (metadata.projectVersion) {
			markdown += `- Project Version: ${metadata.projectVersion}\n`;
		}
		if (metadata.lhciVersion) markdown += `- Lighthouse CI Version: ${metadata.lhciVersion}\n`;
		if (metadata.generatedAt) {
			markdown += `- Generated At: ${new Date(metadata.generatedAt).toISOString()}\n`;
		}
		markdown += `\n`;
	}

	markdown += `Unit: KiB, Format: transfer size(gzipped) / resource size\n\n`;

	// 定义资源类型的显示顺序和标签
	const typeOrder = ['document', 'script', 'stylesheet', 'font', 'image', 'fetch', 'other', 'total'];
	const typeLabels = {
		document: 'Document',
		script: 'Script',
		stylesheet: 'Stylesheet',
		font: 'Font',
		image: 'Image',
		fetch: 'Fetch',
		other: 'Other',
		total: 'Total',
	};

	// 生成表头
	markdown += `| Page |`;
	for (const type of typeOrder) {
		if (type === 'total') continue; // Total 列单独处理
		markdown += ` ${typeLabels[type]} |`;
	}
	markdown += ` Total |\n`;

	// 生成分隔线
	markdown += `|------|` + `------:|`.repeat(typeOrder.length);
	markdown += `\n`;

	// 生成数据行
	for (const result of results) {
		markdown += `| \`${result.url}\` |`;

		for (const type of typeOrder) {
			if (type === 'total') continue;
			const transfer = result.resources[type]?.transferSize || 0;
			const resource = result.resources[type]?.resourceSize || 0;
			markdown += ` ${(transfer / 1024).toFixed(2)} / ${(resource / 1024).toFixed(2)} |`;
		}

		const totalTransfer = result.resources.total?.transferSize || 0;
		const totalResource = result.resources.total?.resourceSize || 0;
		markdown += ` **${(totalTransfer / 1024).toFixed(2)} / ${(totalResource / 1024).toFixed(2)}** |\n`;
	}

	markdown += `\n*This report is automatically generated by the Page Size Audit workflow.*\n`;

	return markdown;
}

/**
 * 生成 JSON 报告
 */
function generateJsonReport(results, metadata) {
	return JSON.stringify(
		{
			metadata,
			results,
		},
		null,
		2,
	);
}

/**
 * 主函数
 */
async function main() {
	try {
		console.log('Starting page size report generation...');
		const results = await parseLighthouseResults();

		// 收集元数据
		const metadata = {
			projectVersion: process.env.PROJECT_VERSION || process.env.GITHUB_SHA || null,
			lhciVersion: process.env.LHCI_VERSION || null,
			generatedAt: new Date().toISOString(),
		};

		// 生成 JSON 报告
		console.log('Generating JSON report...');
		const jsonReport = generateJsonReport(results, metadata);
		const jsonPath = resolve(OUTPUT_DIR, `${OUTPUT_FILENAME}.json`);
		await writeFile(jsonPath, jsonReport);
		console.log(`✓ JSON report saved to: ${jsonPath}`);

		// 如果不是仅输出 JSON，也生成 Markdown 报告
		if (!JSON_ONLY) {
			console.log('Generating Markdown report...');
			const markdownReport = generateMarkdownReport(results, metadata);
			const mdPath = resolve(OUTPUT_DIR, `${OUTPUT_FILENAME}.md`);
			await writeFile(mdPath, markdownReport);
			console.log(`✓ Markdown report saved to: ${mdPath}`);

			console.log('\n--- Report Preview ---\n');
			console.log(markdownReport);
		}

		console.log('✅ Report generation completed successfully!');
	} catch (error) {
		console.error('❌ Failed to generate report:', error);
		process.exit(1);
	}
}

main();
