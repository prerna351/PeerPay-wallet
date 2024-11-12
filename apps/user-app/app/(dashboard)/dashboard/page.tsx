import { getServerSession } from "next-auth";
import { ShowBalance } from "../../../components/showBalance";
import { authOptions } from "../../lib/auth";
import prisma from "@repo/db/client";

async function getBalance() {
    const session = await getServerSession(authOptions);
    const balance = await prisma.balance.findFirst({
        where: {
            userId: Number(session?.user?.id)
        }
    });
    return {
        amount: balance?.amount || 0
    }
}

export default async function() {
    const balance = await getBalance();
    return <div className="h-96  m-10 w-full">
        
        <ShowBalance amount={balance.amount/100}></ShowBalance>
        
    </div>
}