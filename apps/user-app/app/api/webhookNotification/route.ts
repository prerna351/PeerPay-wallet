import { getServerSession } from "next-auth"
import { authOptions } from "../../lib/auth";


import { NextApiRequest, NextApiResponse } from "next";

interface PaymentInformation{
    token : string,
    userId: string,
    amount : string
}
export const POST = async(req: NextApiRequest, res: NextApiResponse) => {
    
    //get the body from the webhook
    try{
        const paymentInformation: PaymentInformation = await req.body;

        // Validate the incoming data
    if (!paymentInformation.token && !paymentInformation.userId && !paymentInformation.amount) {
        return res.status(400).json({ message: "Invalid request payload" });
    }

        res.json({ message: "Payment processed successfully" });
    }catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Error processing payment"
        });
    }
}