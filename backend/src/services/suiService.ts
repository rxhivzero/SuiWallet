import { SuiClient } from '@mysten/sui/client';

// Get RPC URLs from environment variables with fallbacks
const MAINNET_RPC_URL = process.env.SUI_MAINNET_RPC_URL || 'https://fullnode.mainnet.sui.io:443';
const TESTNET_RPC_URL = process.env.SUI_TESTNET_RPC_URL || 'https://fullnode.testnet.sui.io:443';

// Initialize clients
const mainnetClient = new SuiClient({ url: MAINNET_RPC_URL });
const testnetClient = new SuiClient({ url: TESTNET_RPC_URL });

export interface WalletData {
	address: string;
	suiBalance: string;
	tokens: TokenInfo[];
}

export interface TokenInfo {
	coinType: string;
	balance: string;
	symbol?: string;
}

export interface TestnetObjectData {
	adminId: string;
	balance: string;
}

export async function getWalletData(address: string): Promise<WalletData> {
	try {
		// 獲取 SUI 餘額
		const suiBalance = await mainnetClient.getBalance({
			owner: address,
			coinType: '0x2::sui::SUI',
		});

		// 獲取所有代幣餘額
		const allBalances = await mainnetClient.getAllBalances({
			owner: address,
		});

		const tokens: TokenInfo[] = allBalances.map((balance) => ({
			coinType: balance.coinType,
			balance: balance.totalBalance,
			symbol: getCoinSymbol(balance.coinType),
		}));

		return {
			address,
			suiBalance: suiBalance.totalBalance,
			tokens,
		};
	} catch (error) {
		console.error('Error fetching wallet data:', error);
		throw error;
	}
}

export async function getTestnetObjectData(): Promise<TestnetObjectData> {
	try {
		// 固定的 TestNet 合約 Object IDs
		const objectIds = [
			'0x1a66b986f6e938c9f6d4cf7b98c97c331165cad5759e13fbbb1dee01728841dd',
			'0xeeb34a78eaf4ae873c679db294296778676de4a335f222856716d1ad6ed54e45',
		];

		const objects = await testnetClient.multiGetObjects({
			ids: objectIds,
			options: {
				showContent: true,
				showDisplay: true,
				showType: true,
			},
		});

		// 解析 Object 資料
		const objectData: TestnetObjectData[] = objects.map((obj, index) => {
			if (obj.data && 'fields' in obj.data) {
				const fields = obj.data.fields as any;
				return {
					adminId: objectIds[index],
					balance: fields.balance || fields.Balance || '0',
				};
			}
			return {
				adminId: objectIds[index],
				balance: '0',
			};
		});

		return objectData[0] || { adminId: '', balance: '0' };
	} catch (error) {
		console.error('Error fetching testnet object data:', error);
		throw error;
	}
}

function getCoinSymbol(coinType: string): string {
	// 常見代幣符號映射
	const symbolMap: { [key: string]: string } = {
		'0x2::sui::SUI': 'SUI',
		'0x5d4b302506645c3ff4b44698f0c0b4d4cb96cf5c': 'USDC',
		'0x2::coin::Coin<0x2::sui::SUI>': 'SUI',
	};

	return symbolMap[coinType] || coinType.split('::').pop() || 'Unknown';
}
