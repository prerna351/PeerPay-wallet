import {z} from 'zod';

const sanitizePhoneNumber = (phone: string) => {
    return phone.replace(/\D/g, ''); // Removes  non-numeric characters
  };


export const signInInput = z.object({
    phone: z.string().refine((phone) =>/^\d{10}$/.test(sanitizePhoneNumber(phone)),{
        message: 'Phone number must be a valid 10-digit number',
    } )
    .transform(sanitizePhoneNumber),
    password: z.string()
    .min(6, { message: 'Password must be at least 6 characters' }) 
    .trim(), 
})


//type inference in zod
export type SigninInput = z.infer<typeof signInInput>;