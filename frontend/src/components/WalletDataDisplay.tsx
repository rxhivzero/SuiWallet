import React from 'react';

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

interface WalletDataDisplayProps {
    walletData: WalletData | null;
    title: string;
}

const WalletDataDisplay: React.FC<WalletDataDisplayProps> = ({ walletData, title }) => {
    if (!walletData) {
        return (
            <div className="wallet-data-display">
                <h3>{title}</h3>
                <div className="empty-card">
                    <p>尚未連接錢包或查詢資料</p>
                </div>
            </div>
        );
    }

    const formatBalance = (balance: string) => {
        const num = parseFloat(balance);
        return num.toFixed(4);
    };

    const formatAddress = (address: string) => {
        return `${address.slice(0, 6)}...${address.slice(-4)}`;
    };

    return (
        <div className="wallet-data-display">
            <h3>{title}</h3>
            <div className="wallet-card">
                <div className="wallet-info">
                    <div className="address-section">
                        <label>錢包地址:</label>
                        <span className="address" title={walletData.address}>
                            {formatAddress(walletData.address)}
                        </span>
                    </div>

                    <div className="balance-section">
                        <label>SUI 餘額:</label>
                        <span className="balance">
                            {formatBalance(walletData.suiBalance)} SUI
                        </span>
                    </div>
                </div>

                {walletData.tokens.length > 0 && (
                    <div className="tokens-section">
                        <h4>其他代幣:</h4>
                        <div className="tokens-list">
                            {walletData.tokens.map((token, index) => (
                                <div key={index} className="token-item">
                                    <div className="token-info">
                                        <span className="token-symbol">
                                            {token.symbol || 'Unknown'}
                                        </span>
                                        <span className="token-type">
                                            {token.coinType}
                                        </span>
                                    </div>
                                    <div className="token-balance">
                                        {formatBalance(token.balance)}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default WalletDataDisplay;
