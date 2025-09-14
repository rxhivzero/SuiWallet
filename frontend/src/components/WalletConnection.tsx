import React, { useState, useEffect } from 'react';
import {
    useCurrentWallet,
    useSuiClient,
    useWallets,
    useConnectWallet,
    useDisconnectWallet,
} from '@mysten/dapp-kit';

interface WalletData {
    address: string;
    suiBalance: string;
    tokens: TokenInfo[];
}

interface TokenInfo {
    coinType: string;
    balance: string;
    symbol?: string;
}

interface WalletConnectionProps {
    onWalletConnected: (data: WalletData) => void;
}


const WalletConnection: React.FC<WalletConnectionProps> = ({ onWalletConnected }) => {
    const client = useSuiClient();
    const { currentWallet, connectionStatus } = useCurrentWallet();
    const installedWallets = useWallets();
    const { mutate: connectWallet, isPending: isConnecting } = useConnectWallet();
    const { mutate: disconnectWallet } = useDisconnectWallet();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (connectionStatus === 'connected' && currentWallet) {
            fetchWalletData(currentWallet.accounts[0].address);
        } else if (connectionStatus === 'disconnected') {
            onWalletConnected(null as any);
        }
    }, [connectionStatus, currentWallet]);

    const fetchWalletData = async (address: string) => {
        try {
            setLoading(true);

            // 獲取 SUI 餘額
            const suiBalance = await client.getBalance({
                owner: address,
                coinType: '0x2::sui::SUI'
            });

            // 獲取所有代幣餘額
            const allBalances = await client.getAllBalances({
                owner: address
            });

            const tokens = allBalances.map(balance => ({
                coinType: balance.coinType,
                balance: balance.totalBalance,
                symbol: getCoinSymbol(balance.coinType)
            }));

            onWalletConnected({
                address,
                suiBalance: suiBalance.totalBalance,
                tokens
            });
        } catch (error) {
            console.error('Failed to fetch wallet data:', error);
        } finally {
            setLoading(false);
        }
    };

    const getCoinSymbol = (coinType: string): string => {
        const symbolMap: { [key: string]: string } = {
            '0x2::sui::SUI': 'SUI',
            '0x5d4b302506645c3ff4b44698f0c0b4d4cb96cf5c': 'USDC',
            '0x2::coin::Coin<0x2::sui::SUI>': 'SUI'
        };

        return symbolMap[coinType] || coinType.split('::').pop() || 'Unknown';
    };

    return (
        <div className="wallet-connection">
            {connectionStatus === 'connected' ? (
                <div className="wallet-connected">
                    <div className="wallet-info">
                        <h3>已連接: {currentWallet?.name}</h3>
                        <button onClick={() => disconnectWallet()} className="disconnect-btn">
                            斷開連接
                        </button>
                    </div>
                    {loading && <p>載入錢包資料中...</p>}
                </div>
            ) : (
                <div className="wallet-buttons">
                    <h3>選擇錢包連接</h3>
                    <div className="button-group">
                        {installedWallets.map((wallet) => (
                            <button
                                key={wallet.name}
                                onClick={() => connectWallet({ wallet })}
                                disabled={isConnecting}
                                className="wallet-btn"
                            >
                                {isConnecting ? '連接中...' : `連接 ${wallet.name}`}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default WalletConnection;