import express from 'express';
import cors from 'cors';
import { getWalletData, getTestnetObjectData } from './services/suiService';

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// 獲取錢包資料 API
app.get('/api/wallet/:address', async (req, res) => {
	try {
		const { address } = req.params;
		const walletData = await getWalletData(address);
		res.json(walletData);
	} catch (error) {
		console.error('Error fetching wallet data:', error);
		res.status(500).json({ error: 'Failed to fetch wallet data' });
	}
});

// 獲取 TestNet Object 資料 API
app.get('/api/testnet/object', async (req, res) => {
	try {
		const objectData = await getTestnetObjectData();
		res.json(objectData);
	} catch (error) {
		console.error('Error fetching testnet object data:', error);
		res.status(500).json({ error: 'Failed to fetch testnet object data' });
	}
});

app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});
