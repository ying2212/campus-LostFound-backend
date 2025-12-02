import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

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
export async function getExistingUsers(req, res) {
    try {
        const users = await prisma.user.findMany();
        res.json(users);
    }catch(error) {
        res.status(500).json({ error: error.message });
    }
}
  
