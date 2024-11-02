import { Card } from "@repo/ui/card"

export const OnRampTransactions = ({
    transactions
}: {
    transactions: {
        time: Date,
        amount: number,
        // TODO: Can the type of `status` be more specific?
        status: string,
        provider: string
    }[]
}) => {
    if (!transactions.length) {
        return <Card title="Recent Transactions">
            <div className="text-center pb-8 pt-8">
                No Recent transactions
            </div>
        </Card>
    }
    return  <Card title="Recent Transactions">
    <div className="pt-2 space-y-4">
        {transactions.map((t, index) => (
            <div
                key={index}
                className="flex justify-between items-center border-b py-2"
            >
                {/* Left part showing the transaction details */}
                <div>
                    <div className="text-sm font-semibold">
                        Transaction Amount: ₹{t.amount / 100}
                    </div>
                    <div className="text-slate-600 text-xs">
                        {t.time.toLocaleDateString()} at {t.time.toLocaleTimeString()}
                    </div>
                </div>

                {/* Right part showing the transaction status */}
                <div className="text-sm">
                    <span
                        className={`${
                            t.status === "Processing"
                                ? "text-yellow-500"
                                : t.status === "Success"
                                ? "text-green-500"
                                : "text-red-500"
                        } font-semibold`}
                    >
                        {t.status}
                    </span>
                </div>
            </div>
        ))}
    </div>
</Card>
}