import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();


export async function createItemPost(req,res){
    const {title, ImageUrl,TimeFound,FoundAt,Description,Category}= req.body
    
    try{
        const item = await prisma.post.create({
            data: {
                title,
                ImageUrl, 
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
                        name:true,
                        email:true,
                    }
                }
            }
        });
        
        res.json(posts)
    }

export async function updatePost(req,res){
    const { id } = req.params;
    const { title, Description, ImageUrl, Category, Foundat, Timefound } = req.body
    const data = { title, Description, ImageUrl, Category, Foundat, Timefound };

    try {

        const postId = parseInt(id);
    
    const existingPost = await prisma.Post.findUnique({
      where: { id: postId },
    });

    if (!existingPost) {
      return res.status(404).json({ error: "Post not found" });
    }

    if (existingPost.authorId !== req.user.id) {
      return res.status(403).json({ error: "You cannot edit this post" });
    }

    const updatedPost = await prisma.Post.update({
      where: { id: postId },
      data,
    });

    res.json(updatedPost);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }

}

export async function deletePost(req,res){

    const { id } = req.params;

    try {
        const postId = parseInt(id);

    
    const existingPost = await prisma.Post.findUnique({
      where: { id: postId },
    });

    if (!existingPost) {
      return res.status(404).json({ error: "Post not found" });
    }

    if (existingPost.authorId !== req.user.id) {
      return res.status(403).json({ error: "You cannot delete this post" });
    }

    await prisma.Post.delete({
        where: {id: postId}
    })
    res.json({message:"Post deleted successfully"})

}

    catch(error)
    {
        res.status(500).json({ error: error.message })
    }
}