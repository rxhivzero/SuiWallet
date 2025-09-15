import express, { Request, Response, RequestHandler } from 'express';
import cors from 'cors';
import { getWalletData, getTestnetObjectData } from './services/suiService';
import { VercelRequest, VercelResponse } from '@vercel/node';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Helper function to handle Vercel serverless functions
const createHandler = (handler: (req: Request, res: Response) => Promise<void>): RequestHandler => 
  async (req: Request, res: Response) => {
    try {
      await handler(req, res);
    } catch (error) {
      console.error('Error in handler:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };

// 獲取錢包資料 API
app.get('/api/wallet/:address', createHandler(async (req: Request, res: Response) => {
  const { address } = req.params;
  const walletData = await getWalletData(address);
  res.json(walletData);
}));

// 獲取 TestNet Object 資料 API
app.get('/api/testnet/object', createHandler(async (req: Request, res: Response) => {
  const objectData = await getTestnetObjectData();
  res.json(objectData);
}));

// For local development
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 3001;
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

export default app;
