import db from "@repo/db/client";
import CredentialsProvider from "next-auth/providers/credentials"
import bcrypt from "bcrypt";
import { signInInput } from "./validation/authenticationSchema";

export const authOptions = {
    providers: [
      CredentialsProvider({
          name: 'Credentials',
          credentials: {
            phone: { label: "Phone number", type: "text", placeholder: "1231231231", required: true },
            password: { label: "Password", type: "password", required: true }
          },


          //authorize function to handle the core authentication logic
          async authorize(credentials: any) {


            // zod validation
            try{
                const validatedData = signInInput.parse(credentials);
            }catch(e){
                console.error("Validation error:", e);
                throw new Error("Invalid input. Please check your phone number and password.");
            }

            //after validation passed 
            const hashedPassword = await bcrypt.hash(credentials.password, 10);
            const existingUser = await db.user.findFirst({
                where: {
                    number: credentials.phone
                }
            });

            //check if user exists
            if (existingUser) {
                const passwordValidation = await bcrypt.compare(credentials.password, existingUser.password);
                if (passwordValidation) {
                    return {
                        id: existingUser.id.toString(),
                        name: existingUser.name,
                        email: existingUser.number
                    }
                }
                //return if password validation fails
                return null;
            }

            //if user doesn't exists create account in db
            try {
                const user = await db.user.create({
                    data: {
                        number: credentials.phone,
                        password: hashedPassword
                    }
                });
            
                return {
                    id: user.id.toString(),
                    name: user.name,
                    email: user.number
                }
            } catch(e) {
                console.error(e);
            }

            return null
          },
        })
    ],
    secret: process.env.JWT_SECRET || "secret",
    callbacks: {
        // TODO: can u fix the type here? Using any is bad
        //extract the user id from jwt token and return it to the client for global authentication
        async session({ token, session }: any) {
            session.user.id = token.sub

            return session
        }
    }
  }
  