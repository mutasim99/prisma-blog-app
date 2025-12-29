import app from "../app/app";
import { prisma } from "../lib/prisma";

const PORT = process.env.PORT || 3000

async function main(){
    try {
       await prisma.$connect();
       console.log('Connected Prisma successfully');

       app.listen(PORT, ()=>{
        console.log(`your app is running on port:, ${PORT}`);
        
       })
        
    } catch (error) {
        console.log("Error", error);
        await prisma.$disconnect()
        process.exit(1)
    }
}

main()