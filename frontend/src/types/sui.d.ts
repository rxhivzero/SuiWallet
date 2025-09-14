declare global {
	interface Window {
		sui: {
			requestPermissions: () => Promise<Array<{ address: string }>>;
			getAccounts: () => Promise<Array<{ address: string }>>;
			signAndExecuteTransactionBlock: (params: {
				transactionBlock: any;
				options?: {
					showEffects?: boolean;
					showObjectChanges?: boolean;
				};
			}) => Promise<{
				digest: string;
				effects?: {
					status?: {
						status: string;
					};
				};
			}>;
		};
	}
}

export {};
