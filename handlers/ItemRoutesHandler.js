import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function createItemPost(req,res){
    const {title, ImageURL, createdAt,TimeFound,FoundAt,Description}= req.body

    try{
        const item = await prisma.Post.create({
            data: {title, ImageURL, createdAt: new Date(FoundAt),TimeFound,FoundAt,Description,author:userID},
        })

        res.json(item);
    }
    catch(error){
        res.status(500).json({error: error.message})
    }
};

export async function getItemPost(req,res){
    try{
        const posts = await prisma.Post.findMany({
            orderBy:{
                createdAt: "desc",
            },
        });
        res.json(posts);
    }
    catch(error){
        res.status(500).json({error: error.message})
    }
}