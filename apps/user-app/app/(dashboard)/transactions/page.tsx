"use client";
import { useEffect, useState } from "react";
import { getTransactions } from "../../lib/actions/getTransactions";
import { OnRampHistory } from "../../../components/OnRampHistory";
import { P2PHistory } from "../../../components/P2pHistory";

// Define the types for transactions
interface OnRampTransaction {
  provider: string;
  amount: number;
  status: string;
  startTime: string; // Expecting a string here
}

type P2PTransfer = {
    amount: number;
    fromUser: {
      name: string | null;  // Allow name to be null
    };
    toUser: {
      name: string | null;  // Allow name to be null
    };
    timestamp: string;
  };

export default function TransactionsPage() {
  const [onRampTransactions, setOnRampTransactions] = useState<OnRampTransaction[] | null>(null);
  const [p2pTransfers, setP2PTransfers] = useState<P2PTransfer[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTransactions = async () => {
      const fetchedTransactions = await getTransactions();
      
      // Handle the case where transactions are fetched and format the dates as strings
      if (fetchedTransactions?.onRampTransactions) {
        const formattedOnRampTransactions = fetchedTransactions.onRampTransactions.map(txn => ({
          ...txn,
          startTime: txn.startTime.toISOString(), // Convert Date to string
        }));
        setOnRampTransactions(formattedOnRampTransactions);
      }

      if (fetchedTransactions?.p2pTransfers) {
        const formattedP2PTransfers = fetchedTransactions.p2pTransfers.map(txn => ({
          ...txn,
          timestamp: txn.timestamp.toISOString(), // Convert Date to string
        }));
        setP2PTransfers(formattedP2PTransfers);
      }

      setLoading(false);
    };

    fetchTransactions();
  }, []);

  if (loading) return <div>Loading...</div>;

  if ((!onRampTransactions || onRampTransactions.length === 0) && (!p2pTransfers || p2pTransfers.length === 0)) {
    return <div>No recent transactions</div>;
  }



  return (
    <div className="w-screen  m-10">
      

      {/* OnRamp Transactions */}
      
      <div className=" w-full flex  justify-around">
        <div>
        {onRampTransactions && (
          <OnRampHistory transactions={onRampTransactions} />
        )}
        </div>

      {/* P2P Transfers */}
      <div>
      {onRampTransactions && (
          <P2PHistory transactions={p2pTransfers || []} />
        )}
      </div>

      </div>
    </div>
  );
}
