# 環境變數設定

在 `backend` 資料夾中創建 `.env` 文件，並添加以下內容：

```
PORT=3001
SUI_RPC_URL_MAINNET=https://fullnode.mainnet.sui.io:443
SUI_RPC_URL_TESTNET=https://fullnode.testnet.sui.io:443
```

這些設定將用於：

-   PORT: 後端服務器端口
-   SUI_RPC_URL_MAINNET: Sui Mainnet RPC 端點
-   SUI_RPC_URL_TESTNET: Sui Testnet RPC 端點
