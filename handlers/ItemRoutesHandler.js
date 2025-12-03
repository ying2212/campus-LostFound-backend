import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function createItemPost(req,res){
    const {title, ImageUrl,TimeFound,FoundAt,Description,Category}= req.body
    // only authenticated users can create posts
    if(!req.user?.id){
        return res.status(401).json({error: "Unauthorized"})
    }

    try{
        const item = await prisma.post.create({
            data: {
                title,
                ImageUrl: ImageUrl || null, 
                TimeFound: new Date(TimeFound),
                FoundAt,
                Description,
                Category,
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
        const posts = await prisma.post.findMany({
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
            imageUrl: post.ImageUrl,
            timeFound: post.TimeFound,
            foundAt: post.FoundAt,
            description: post.Description,
            category: post.Category,
            createdAt: post.createdAt,
            author: post.author,
        }));

        res.json(items);
    }
    catch(error){
        res.status(500).json({error: error.message})
    }
}