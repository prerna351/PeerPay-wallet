interface p2pHistoryType {
    amount: number;
    fromUser: { name: string | null }; 
    toUser: { name: string | null };   
    timestamp: string;
  }


  interface P2PHistoryProps {
    transactions: p2pHistoryType[];
  }
  
  export const P2PHistory = ({ transactions }: P2PHistoryProps) => {
    return (
      <div className="w-[500px] p-4 bg-white border border-gray-200 rounded-lg shadow sm:p-8">
        <div className="flex items-center justify-between mb-4">
          <h5 className="text-xl font-bold leading-none text-gray-900">P2P Transfers History</h5>
          {/* <a href="#" className="text-sm font-medium text-blue-600 hover:underline">
            View all
          </a> */}
        </div>
        <div className="flow-root">
          <ul role="list" className="divide-y divide-gray-200">
            {transactions.map((transaction, index) => (
              <li key={index} className="py-3 sm:py-4">
                <div className="flex items-center">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      From: {transaction.fromUser.name}
                    </p>
                    <p className="text-sm font-medium text-gray-900 truncate">
                      To: {transaction.toUser.name}
                    </p>
                    <p className="text-sm text-gray-500 truncate">
                      {new Date(transaction.timestamp).toLocaleString()}
                    </p>
                  </div>
                  <div className="inline-flex items-center text-base font-semibold text-gray-900">
                    ${transaction.amount / 100}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  };
  