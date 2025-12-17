import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();


export async function createItemPost(req,res){
    const { title, TimeFound,FoundAt,Description,Category,HowToClaim } = req.body;
    if (!req.file) {
        return res.status(400).json({ error: "Image is required" });
    }
    if (!title || !TimeFound || !FoundAt || !Description || !Category || !HowToClaim) {
        return res.status(400).json({ error: "All fields are required" });
    }
    try{
        const item = await prisma.post.create({
            data: {
                title,
                ImageUrl: req.file.location,
                TimeFound: new Date(TimeFound),
                FoundAt,
                Description,
                Category,
                HowToClaim,
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
    catch(error){
        console.error('Error fetching posts:', error);
        res.status(500).json({error: error.message})
    }
}

export async function updatePost(req,res){
    const { id } = req.params;
    const { title, Description, ImageUrl, Category, Foundat, Timefound,HowToClaim } = req.body
    const data = {};
    if(title !== undefined) data.title = title;
    if(Description !== undefined) data.Description = Description;
    if(ImageUrl !== undefined) data.ImageUrl = ImageUrl;
    if(Category !== undefined) data.Category = Category;
    if(Foundat !== undefined) data.Foundat = Foundat;
    if(Timefound !== undefined) data.Timefound = Timefound;
    if(HowToClaim !== undefined) data.HowToClaim = HowToClaim;

    try {

        const postId = parseInt(id);
    
    const existingPost = await prisma.Post.findUnique({
      where: { id: postId },
    });

    if (!existingPost) {
      return res.status(404).json({ error: "Post not found" });
    }

    if (existingPost.authorId !== req.user.id) {
      return res.status(403).json({ error: "You cannot claim this item post" });
    }

    const updatedPost = await prisma.Post.update({
      where: { id: postId },
      data: { Status: true },
    });

    res.json(updatedPost);
    } catch (error) {
        console.error('Error claiming post:', err);
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
        console.log('Error deleting post:', error);
        res.status(500).json({ error: error.message })
    }
}