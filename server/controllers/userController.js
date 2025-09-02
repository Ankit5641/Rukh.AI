import sql from "../configs/db.js";


export const getUserCreations = async (req, res)=>{
    try {
        const {userId} = req.auth()

       const creations = await sql`SELECT * FROM creations WHERE user_id = ${userId} ORDER BY created_at DESC`;

        res.json({ success: true, creations });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

export const getPublishedCreations = async (req, res)=>{
    try {

       const creations = await sql`
       SELECT * FROM creations WHERE publish = true ORDER BY created_at DESC`;

        res.json({ success: true, creations });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

export const toggleLikeCreation = async (req, res)=>{
    try {

        const {userId} = req.auth()
        const {id} = req.body

        const [creation] = await sql`SELECT * FROM creations WHERE id = ${id}`

        if(!creation){
            return res.json({ success: false, message: "Creation not found" })
        }

        const currentLikes = creation.likes;
        const userIdStr = userId.toString();
        let updatedLikes;
        let message;

        if(currentLikes.includes(userIdStr)){
            updatedLikes = currentLikes.filter((user)=>user !== userIdStr);
            message = 'Creation Unliked'
        }else{
            updatedLikes = [...currentLikes, userIdStr]
            message = 'Creation Liked'
        }

        const formattedArray = `{${updatedLikes.join(',')}}`

       await sql`UPDATE creations SET likes = ${formattedArray}::text[] WHERE id = ${id}`;

        res.json({ success: true, message });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

export const deleteCreation = async (req, res) => {
  try {
    const { id } = req.params;        // Get creation ID from URL
    const { userId } = req.auth();    // Clerk auth gives userId

    // Ensure only the owner can delete
    const [creation] = await sql`SELECT * FROM creations WHERE id = ${id} AND user_id = ${userId}`;
    if (!creation) {
      return res.json({ success: false, message: "Creation not found or unauthorized" });
    }

    await sql`DELETE FROM creations WHERE id = ${id} AND user_id = ${userId}`;

    res.json({ success: true, message: "Deleted successfully" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};
