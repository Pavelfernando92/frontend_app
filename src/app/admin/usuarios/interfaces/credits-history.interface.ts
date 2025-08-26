export interface Transaction {
  id: number;
  amount: number;
  userId: number;
  createdAt: string;
}

export interface HistoricCoinsResponse {
  page: number;
  limit: number;
  totalTransactions: number;
  totalCoinsAdded: number;
  transactions: Transaction[];
}

export interface CreditsHistoryFilters {
  startDate?: string;
  endDate?: string;
  page: number;
  limit: number;
}
