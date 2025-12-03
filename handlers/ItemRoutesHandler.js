import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function createItemPost(req,res){
    const {title, ImageUrl,TimeFound,FoundAt,Description,Category, Type}= req.body
    // only authenticated users can create posts
    if(!red.user?.id){
        return res.status(401).json({error: "Unauthorized"})
    }

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

export async function getItems(req,res){
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
        const items = posts.map(post => ({
            id: post.id,
            title: post.title,
            ImageUrl: post.ImageUrl,
            TimeFound: post.TimeFound,
            FoundAt: post.FoundAt,
            Description: post.Description,
            Category: post.Category,
            Type: post.Type,
            createdAt: post.createdAt,
            author: post.author,
        }));
        res.json(items);
    }
    catch(error){
        res.status(500).json({error: error.message})
    }
}