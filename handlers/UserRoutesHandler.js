import { PrismaClient } from "@prisma/client";
const prisma = PrismaClient();

export async function createNewUser(req,res){
    try{
    const {email,name} = req.body

    const user = await prisma.User.create({
        data:{email,name}
    })
    res.json(user);
}
catch(error){
    res.status(500).json({error: error.message});
}

};
