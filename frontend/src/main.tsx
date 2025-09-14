import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx';
import { WalletProvider, SuiClientProvider, createNetworkConfig } from '@mysten/dapp-kit';
import { getFullnodeUrl } from '@mysten/sui/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

const { networkConfig } = createNetworkConfig({
	testnet: { url: getFullnodeUrl('testnet') },
});
import './styles/main.scss'

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
                <QueryClientProvider client={queryClient}>
            <SuiClientProvider networks={networkConfig}>
                <WalletProvider>
                    <App />
                </WalletProvider>
            </SuiClientProvider>
        </QueryClientProvider>
    </React.StrictMode>,
)
