type Draftable = {
	data?: {
		draft?: boolean;
	};
};

/**
 * 开发环境（astro dev）允许展示草稿；构建（astro build）默认隐藏草稿。
 */
export const INCLUDE_DRAFTS = import.meta.env.DEV;

export function filterDrafts<T extends Draftable>(items: T[]): T[] {
	return INCLUDE_DRAFTS ? items : items.filter((item) => !item.data?.draft);
}

export function isDraft(item: Draftable): boolean {
	return Boolean(item.data?.draft);
}


