"use server";

import prisma from "@repo/db/client";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth";

export async function getTransactions() {
    const session = await getServerSession(authOptions);
    if (!session?.user || !session.user?.id) {
        return {
            message: "Unauthenticated request"
        };
    }

    try {
        // Convert user ID from string to integer
        const userId = parseInt(session.user.id, 10);

        // Fetch the OnRampTransactions for the user
        const onRampTransactions = await prisma.onRampTransaction.findMany({
            where: { userId },
            include: {
                user: true, // Include user data if needed
            },
            orderBy: {
                startTime: "desc", // Sort by start time (most recent first)
            },
        });

        // Fetch p2pTransfers where the user is either sender or receiver
        const p2pTransfers = await prisma.p2pTransfer.findMany({
            where: {
                OR: [
                    { fromUserId: userId },
                    { toUserId: userId },
                ],
            },
            include: {
                fromUser: true,
                toUser: true,
            },
            orderBy: {
                timestamp: "desc", // Sort by timestamp (most recent first)
            },
        });

        // Return only OnRampTransactions if there are no p2pTransfers
        if (p2pTransfers.length === 0) {
            return {
                onRampTransactions,
                p2pTransfers: [], // Return empty array for p2pTransfers if none exist
            };
        }

        // Return both if available
        return {
            onRampTransactions,
            p2pTransfers,
        };

    } catch (error) {
        console.error("Error fetching transactions:", error);
        return {
            message: "Error fetching transactions",
        };
    }
}
