import { getServerSession } from "next-auth"
import { NextResponse } from "next/server";
import { authOptions } from "../../lib/auth";
import axios from "axios";
import prisma from "@repo/db/client";

export const GET = async () => {
    const session = await getServerSession(authOptions);
    if (session.user) {
        return NextResponse.json({
            user: session.user
        })
    }
    return NextResponse.json({
        message: "You are not logged in"
    }, {
        status: 403
    })
}


export const POST = async (req: Request) => {
    const session = await getServerSession(authOptions);

    if (session?.user) {
        const { amount, bank } = await req.json();
        const userId = parseInt(session.user.id|| 10);

        try {
            // Check user's available balance (exclude locked amount)
            const userBalance = await prisma.balance.findUnique({
                where: { userId },
            });

            if (!userBalance || userBalance.amount < amount) {
                return NextResponse.json(
                    { message: "Insufficient balance" },
                    { status: 400 }
                );
            }

            // Lock the amount by updating the balance table
            await prisma.balance.update({
                where: { userId },
                data: {
                    locked: {
                        increment: amount, // Locking the funds
                    },
                    amount: {
                        decrement: amount, // Decrease available balance
                    },
                },
            });

            // Send request to the dummy bank API
            const bankApiResponse = await axios.post(
                `http://localhost:3004/api/${bank}/initiate-onramp`,
                { userId, amount }
            );
            

            const { token, netBankingUrl } = bankApiResponse.data;

            // Create transaction record in database
            await prisma.onRampTransaction.create({
                data: {
                    provider: bank,
                    status: "Processing", // Status indicating the transaction is being processed
                    startTime: new Date(),
                    token: token,
                    userId: Number(userId),
                    amount: amount * 100, // Store amount in smallest unit (e.g., cents)
                },
            });

            // Redirect the user to the bank's net banking page with the token
            const redirectUrl = new URL(netBankingUrl);
            redirectUrl.searchParams.append("token", token);
            // console.log(redirectUrl)
            return NextResponse.json(redirectUrl.toString());
            //all clear
            
        } catch (e) {
            console.error("Error initiating onRamp transaction:", e);
            return NextResponse.json(
                { message: "Error initiating onRamp transaction" },
                { status: 500 }
            );
        }
    }else{
        return NextResponse.json(
            { message: "You are not logged in " },
            { status: 403 }
        );
    }

    
};
