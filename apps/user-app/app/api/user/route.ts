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

    //if user logged in 
    if(session?.user){ 
        const { amount, bank } = await req.json(); 
        const userId = session.user.id; 
        console.log("check1")
        try{
            //send request to the dummy bank api
            const bankApiResponse = await axios.post(`http://localhost:3002/api/${bank}/initiate-onramp`, {
                userId,
                amount
            });
            

            //parse the response from the dummy bank api
            const { token, netBankingUrl } = bankApiResponse.data;
           
             // Create transaction record database
             await prisma.onRampTransaction.create({
                data: {
                    provider: bank,
                    status: "Processing",
                    startTime: new Date(),
                    token: token,
                    userId: Number(userId),
                    amount: amount * 100,
                }
            });

            
            // Redirect user to the bank's net banking page with the token in the URL
            const redirectUrl = new URL(netBankingUrl);
            
            redirectUrl.searchParams.append('token', token); // Add the token as a query parameter
            
            // return NextResponse.json({
            //     msg: "Success"
            // })
            // all clear till here 

            return NextResponse.json(redirectUrl.toString()); // Redirect to the new URL with token
            

        }catch(e){
            console.error("Error initiating onRamp transaction:", e);
            return NextResponse.json({
                message: "Error initiating onRamp transaction check1"
              }, {
                status: 500
              });
        }
    }

    //if user not logged in
    return NextResponse.json({
        message: "You are not logged in"
      }, {
        status: 403
      });
}

