import React, { useState } from 'react';
import {
    useSignAndExecuteTransaction,
    useCurrentAccount,
} from '@mysten/dapp-kit';
import { Transaction } from '@mysten/sui/transactions';
import { SuiSignAndExecuteTransactionOutput } from '@mysten/wallet-standard';

const TransactionForm: React.FC = () => {
    const { mutate: signAndExecuteTransaction, isPending } =
        useSignAndExecuteTransaction();
    const currentAccount = useCurrentAccount();
    const [targetAddress, setTargetAddress] = useState('');
    const [amount, setAmount] = useState('');
    const [txHash, setTxHash] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!currentAccount) {
            setError('請先連接錢包');
            return;
        }

        setError(null);
        setTxHash(null);

        const tx = new Transaction();
        const [coin] = tx.splitCoins(tx.gas, [
            Math.floor(parseFloat(amount) * 1_000_000_000),
        ]);
        tx.transferObjects([coin], targetAddress);

        signAndExecuteTransaction(
            {
                transaction: tx,
                chain: currentAccount.chains[0],
            },
            {
                onSuccess: (result: SuiSignAndExecuteTransactionOutput) => {
                    setTxHash(result.digest);
                },
                onError: (err: Error) => {
                    setError('交易失敗: ' + err.message);
                },
            },
        );
    };

    const getExplorerUrl = (hash: string) => {
        return `https://suiexplorer.com/txblock/${hash}?network=testnet`;
    };

    return (
        <div className="transaction-form">
            <form onSubmit={handleSubmit} className="transaction-form-content">
                <div className="form-group">
                    <label htmlFor="targetAddress">目標地址:</label>
                    <input
                        type="text"
                        id="targetAddress"
                        value={targetAddress}
                        onChange={(e) => setTargetAddress(e.target.value)}
                        placeholder="輸入目標錢包地址"
                        className="form-input"
                        disabled={isPending}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="amount">轉帳金額 (SUI):</label>
                    <input
                        type="number"
                        id="amount"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="輸入轉帳金額"
                        className="form-input"
                        disabled={isPending}
                        min="0"
                        step="0.000001"
                        required
                    />
                </div>

                {!currentAccount && <div className="wallet-notice">請先連接錢包以發送交易</div>}
                <button
                    type="submit"
                    disabled={isPending || !targetAddress || !amount || !currentAccount}
                    className="submit-btn"
                >
                    {isPending ? '發送中...' : '發送交易'}
                </button>

                {error && <div className="error-message">{error}</div>}

                {txHash && (
                    <div className="success-message">
                        <h4>交易成功!</h4>
                        <p>交易Hash: {txHash}</p>
                        <a
                            href={getExplorerUrl(txHash)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="explorer-link"
                        >
                            在 Sui Explorer 中查看
                        </a>
                    </div>
                )}
            </form>
        </div>
    );
};

export default TransactionForm;