import {z} from 'zod';

const sanitizeAmount = (phone: string) => {
    return phone.replace(/\D/g, ''); // Removes  non-numeric characters
  };


export const amountInput = z.object({
    amount: z.string()
    .transform(sanitizeAmount),
   
})


//type inference in zod
export type AmountInput = z.infer<typeof amountInput>;