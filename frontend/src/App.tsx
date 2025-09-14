import { useState } from 'react';
import WalletConnection from './components/WalletConnection';
import WalletDataDisplay from './components/WalletDataDisplay';
import AddressInput from './components/AddressInput';
import TestnetObjectDisplay from './components/TestnetObjectDisplay';
import TransactionForm from './components/TransactionForm';
import './styles/App.scss';

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

function App() {
    const [walletData, setWalletData] = useState<WalletData | null>(null);
    const [inputAddress, setInputAddress] = useState<string>('');
    const [inputWalletData, setInputWalletData] = useState<WalletData | null>(null);

    return (
        <div className="app">
            <header className="app-header">
                <h1>Sui 錢包</h1>
            </header>

            <main className="app-main">
                <section className="wallet-section">
                    <h2>錢包連接</h2>
                    <WalletConnection onWalletConnected={setWalletData} />
                    <WalletDataDisplay
                        walletData={walletData}
                        title="連接的錢包資料"
                    />
                </section>

                <section className="address-section">
                    <h2>查詢特定地址</h2>
                    <AddressInput
                        onAddressSubmit={setInputWalletData}
                        inputAddress={inputAddress}
                        setInputAddress={setInputAddress}
                    />
                    <WalletDataDisplay
                        walletData={inputWalletData}
                        title="查詢的錢包資料"
                    />
                </section>

                <section className="testnet-section">
                    <h2>TestNet Object 資料</h2>
                    <TestnetObjectDisplay />
                </section>

                <section className="transaction-section">
                    <h2>發送交易 (TestNet)</h2>
                    <TransactionForm />
                </section>
            </main>
        </div>
    );
}

export default App;
