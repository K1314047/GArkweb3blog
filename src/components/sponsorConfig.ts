export type SponsorItem = {
	id: string;
	name: string;
	image: string;
	color: string;
	desc?: string;
	address?: string;
};

export type SponsorGroup = {
	name: 'CNY' | 'Crypto';
	items: SponsorItem[];
};

export const SPONSOR_GROUPS: SponsorGroup[] = [
	{
		name: 'CNY',
		items: [
			{
				id: 'wechat',
				name: '微信',
				image: '/sponsor/wechat.jpg',
				color: '#09bb07',
			},
			{
				id: 'alipay',
				name: '支付宝',
				image: '/sponsor/alipay.jpg',
				color: '#00a0e9',
			},
		],
	},
	{
		name: 'Crypto',
		items: [
			{
				id: 'evm',
				name: 'USDT(EVM)',
				image: '/sponsor/evm.jpg',
				address: '0x3033a8db7ef3c03fa2c7396dd859eb7a53f10890',
				color: '#627eea',
			},
			{
				id: 'usdt_arb',
				name: 'USDT(Sol)',
				image: '/sponsor/usdt_sol.jpg',
				address: '2CwVb4NtZNPuK2FfEinKPtk41ZmFaF65fa9z2RMLrWBB',
				color: '#2d3748',
			},
			{
				id: 'usdt_bnb',
				name: 'Doge',
				image: '/sponsor/doge.jpg',
				address: 'DRgJhTVydQFScENmf8NES5MMXsPKKYEvro',
				color: '#f3ba2f',
			},
		],
	},
];

export const ALL_SPONSOR_ITEMS: SponsorItem[] = SPONSOR_GROUPS.flatMap((g) => g.items);

