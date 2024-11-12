

interface onRampHistoryType {
    provider: string;
    amount: number;
    status: string;
    startTime: string;
  }
  
  
  export const OnRampHistory = ({ transactions }: { transactions: onRampHistoryType[] }) => {
    return (
        <div className=" w-[500px] p-4 bg-white border border-gray-200 rounded-lg shadow sm:p-8 ">
            <div className="flex items-center justify-between mb-4">
                <h5 className="text-xl font-bold leading-none text-gray-900">OnRamp Transactions History</h5>
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
                                        {transaction.provider}
                                    </p>
                                    <p className="text-sm text-gray-500 truncate">
                                        {new Date(transaction.startTime).toLocaleString()}
                                    </p>
                                </div>
                                <div className="inline-flex items-center text-base font-semibold text-gray-900">
                                    ${transaction.amount/100}
                                </div>
                                <div className="ml-4 text-sm text-gray-600">
                                    {transaction.status}
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};