import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function createItemPost(req,res){
    const {title, ImageUrl,TimeFound,FoundAt,Description,Category, Type}= req.body

    try{
        const item = await prisma.Post.create({
            data: {
                title,
                ImageUrl: ImageUrl || null, 
                TimeFound: new Date(TimeFound),
                FoundAt,
                Description,
                Category,
                Type,
                authorId: req.user.id,
            },
        })

        res.json(item);
    }
    catch(error){
        console.error('Error creating post:', error);
        res.status(500).json({error: error.message})
    }
};

export async function getItemPost(req,res){
    try{
        const posts = await prisma.Post.findMany({
            orderBy:{
                createdAt: "desc",
            },
            include:{
                author:{
                    select:{
                        id:true,
                        name:true,
                        email:true,
                    }
                }
            }
        });
        res.json(posts);
    }
    catch(error){
        res.status(500).json({error: error.message})
    }
}