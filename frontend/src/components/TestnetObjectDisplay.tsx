import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface TestnetObjectData {
    adminId: string;
    balance: string;
}

const TestnetObjectDisplay: React.FC = () => {
    const [objectData, setObjectData] = useState<TestnetObjectData | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchObjectData = async () => {
        try {
            setLoading(true);
            setError(null);

            const response = await axios.get('http://localhost:3001/api/testnet/object');
            setObjectData(response.data);
        } catch (err) {
            console.error('Error fetching testnet object data:', err);
            setError('獲取 TestNet Object 資料失敗');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchObjectData();
    }, []);

    const formatBalance = (balance: string) => {
        const num = parseFloat(balance);
        return num.toFixed(4);
    };

    const formatAddress = (address: string) => {
        return `${address.slice(0, 6)}...${address.slice(-4)}`;
    };

    return (
        <div className="testnet-object-display">
            <div className="object-header">
                <h3>TestNet Object 資料</h3>
                <button
                    onClick={fetchObjectData}
                    disabled={loading}
                    className="refresh-btn"
                >
                    {loading ? '載入中...' : '重新載入'}
                </button>
            </div>

            {error && <div className="error-message">{error}</div>}

            {objectData ? (
                <div className="object-card">
                    <div className="object-info">
                        <div className="admin-id-section">
                            <label>Admin ID:</label>
                            <span className="admin-id" title={objectData.adminId}>
                                {formatAddress(objectData.adminId)}
                            </span>
                        </div>

                        <div className="balance-section">
                            <label>Balance:</label>
                            <span className="balance">
                                {formatBalance(objectData.balance)}
                            </span>
                        </div>
                    </div>
                </div>
            ) : loading ? (
                <div className="loading-card">
                    <p>載入 TestNet Object 資料中...</p>
                </div>
            ) : (
                <div className="empty-card">
                    <p>無法載入 TestNet Object 資料</p>
                </div>
            )}
        </div>
    );
};

export default TestnetObjectDisplay;
