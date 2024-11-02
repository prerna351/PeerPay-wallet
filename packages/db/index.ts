//singleton design pattern to avoid creating multiple instances of the prisma client 
//This is especially important in development environments where module hot reloading can lead to multiple instances if not handled properly
//Hot reloading - Instead of restarting the application or reloading the entire page, the hot reloading system updates only the parts of the application that have changed.

import { PrismaClient } from '@prisma/client' //This line imports the PrismaClient from the Prisma client package, which you will use to interact with your PostgreSQL database.

const prismaClientSingleton = () => { //function creates new instances of prisma client
  return new PrismaClient()
}

// This block is a TypeScript declaration that extends the global object (global or globalThis) by adding a new property prismaGlobal.
// The type of prismaGlobal can be undefined or the type returned by prismaClientSingleton. This is useful for tracking the singleton instance across different modules in a Node.js environment.
declare global {
  var prismaGlobal: undefined | ReturnType<typeof prismaClientSingleton>
}

// This line checks if globalThis.prismaGlobal already has a value. If it does (i.e., an instance of PrismaClient already exists), it uses that instance. If not, it calls prismaClientSingleton() to create a new instance.
// This way, you're ensuring that you only have one instance of PrismaClient throughout your application.
const prisma: ReturnType<typeof prismaClientSingleton> = globalThis.prismaGlobal ?? prismaClientSingleton()

// This line exports the prisma instance so that you can use it in other parts of your application without needing to create a new instance.
export default prisma

if (process.env.NODE_ENV !== 'production') globalThis.prismaGlobal = prisma