import React, { useState } from 'react';
import axios from 'axios';

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

interface AddressInputProps {
    onAddressSubmit: (data: WalletData) => void;
    inputAddress: string;
    setInputAddress: (address: string) => void;
}

const AddressInput: React.FC<AddressInputProps> = ({
    onAddressSubmit,
    inputAddress,
    setInputAddress
}) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!inputAddress.trim()) return;

        try {
            setLoading(true);
            setError(null);

            const response = await axios.get(`/api/wallet/${inputAddress}`);
            onAddressSubmit(response.data);
        } catch (err) {
            console.error('Error fetching wallet data:', err);
            setError('查詢錢包資料失敗，請檢查地址是否正確');
        } finally {
            setLoading(false);
        }
    };

    const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputAddress(e.target.value);
        setError(null);
    };

    return (
        <div className="address-input">
            <form onSubmit={handleSubmit} className="address-form">
                <div className="input-group">
                    <label htmlFor="address">錢包地址:</label>
                    <input
                        type="text"
                        id="address"
                        value={inputAddress}
                        onChange={handleAddressChange}
                        placeholder="輸入 Sui 錢包地址"
                        className="address-field"
                        disabled={loading}
                    />
                    <button
                        type="submit"
                        disabled={loading || !inputAddress.trim()}
                        className="submit-btn"
                    >
                        {loading ? '查詢中...' : '查詢'}
                    </button>
                </div>
                {error && <div className="error-message">{error}</div>}
            </form>
        </div>
    );
};

export default AddressInput;
