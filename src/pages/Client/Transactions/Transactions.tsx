import BarChart from './BarChart';
import PieChart from './PieChart';
import TransactionsTable from './TransactionsTable';
import { useState, useEffect, useCallback } from 'react';
import API_BASE_URL from '../../../config/api';
import { useAuth } from '../../../context/AuthContext';
import { useAlert } from '../../../components/Alert/AlertContext';
import VotingLoader from '../../../common/Loader/VotingLoader';

export interface TRANSACTION {
  id: number;
  clientId: number;
  programId: number | null;
  idPicture: string;
  fullName: string;
  email: string;
  contactNumber: string;
  yearLevel: number | null;
  remainingVotes: number;
  totalVotesPurchased: number;
  amountPaid: number;
  votesGiven: number;
  handlerFullName: string;
  handlerImage: string;
  createdDate: string;
  createdTime: string;
  datetime: string;
}

const Transactions = () => {
  const { authUser } = useAuth();
  const { showAlert } = useAlert();
  const token = authUser?.token;

  const [transactions, setTransactions] = useState<TRANSACTION[]>([]);
  const [isFetching, setIsFetching] = useState(false);

  const fetchTransactions = useCallback(async () => {
    if (!token) return;
    setIsFetching(true);

    try {
      const res = await fetch(`${API_BASE_URL}/purchase-transactions`, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (!res.ok || data.status !== 'success') {
        throw new Error(data.message || 'Failed to fetch transactions.');
      }

      const mapped: TRANSACTION[] = data.data.map((item: any) => {
        const attrs = item.attributes;
        return {
          id: item.id,
          clientId: attrs.client_id,
          programId: attrs.client?.program_id ?? null,
          idPicture: attrs.client?.id_picture || '',
          fullName: attrs.client?.full_name || 'N/A',
          email: attrs.client?.email || 'N/A',
          contactNumber: attrs.client?.contact_number || 'N/A',
          yearLevel: attrs.client?.year_level ?? null,
          remainingVotes: attrs.client?.remaining_votes ?? 0,
          totalVotesPurchased: attrs.client?.total_votes_purchased ?? 0,
          amountPaid: attrs.amount_paid,
          votesGiven: attrs.votes_given,
          handlerFullName: attrs.handler?.full_name || 'N/A',
          handlerImage: attrs.handler?.image || '',
          createdDate: attrs.createdDate,
          createdTime: attrs.createdTime,
          datetime: `${attrs.createdDate} ${attrs.createdTime}`,
        };
      });

      setTransactions(mapped);
    } catch (error: any) {
      console.error(error);
      showAlert('error', error.message || 'Failed to load transactions.');
    } finally {
      setIsFetching(false);
    }
  }, [token, showAlert]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  return (
    <div>
      {isFetching ? (
        <VotingLoader
          title="Loading Transactions"
          description="Fetching transactions records..."
        />
      ) : (
        <>
          <div className="grid grid-cols-12 gap-4 md:gap-6 2xl:gap-7.5 mb-4">
            <BarChart transactions={transactions} />
            <PieChart transactions={transactions} />
          </div>

          <TransactionsTable
            transactions={transactions}
            fetchTransactions={fetchTransactions}
            isFetching={isFetching}
          />
        </>
      )}
    </div>
  );
};

export default Transactions;
