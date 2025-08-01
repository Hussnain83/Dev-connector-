const express = require("express");
const router = express.Router();
const User = require("./../models/User");
const { jwtAuthMiddleware } = require("../jwt");
const Profile = require("./../models/Profile");
const Post = require("./../models/Post");

// creating a post 

router.post("/", jwtAuthMiddleware, async(req, res)=>{
    try{
   
    const userID = req.user.id;
    const data = req.body;
    data.user = userID;

    const useri = await User.findById(userID);
    if (!useri) {
      return res.status(404).json({ error: "User not found" });
    }

    const profile = await Profile.findOne({ user: userID });
    if (!profile) {
      return res.status(400).json({ error: "Please create a profile first." });
    }

    const username = useri.name;
    data.name = username;

    const newPost = new Post(data);
    const response = await newPost.save();
    console.log("Post saved");
    res.status(200).json({response: response});
    }
    catch(err){
        console.log(err);
        res.status(500).json({error: "Internal server error"});
    }
});

// get all the posts

router.get("/posts", async (req, res)=>{
    try{
        const posts = await Post.find();
        res.status(200).json({posts});

    }
    catch(err){
        console.log(err);
        res.status(500).json({error: "Internal server error"});
    }
});

// get post by id 

router.get("/:postid",jwtAuthMiddleware, async(req, res)=>{
    try{
    const postid = req.params.postid;
    if(!postid){
        return res.status(400).json({error: "postid not found"});
    }
    const post = await Post.findById(postid);
    if(!post){
        return res.status(404).status(404)._construct({error: "post not found"});
    }
    console.log("Post sent");
    res.status(200).json({post});
    }
    catch(err){
        console.log(err);
        res.status(500).json({error: "Internal server error"});
    }
});

// delete post by post id
router.delete("/:postid", jwtAuthMiddleware, async(req, res)=> {
    try{

        const postid = req.params.postid;
        if(!postid){
        return res.status(400).json({error: "postid not found"});
    }
        const post = await Post.findById(postid);
        if(!post){
          return res.status(404).status(404).json({error: "post not found"});
        }
        if(post.user.toString() !== req.user.id)
        {
        return res.status(403).json({ error: "Not authorized to delete this post" });
        }
        const deletepost = await Post.findByIdAndDelete(postid);
        res.status(200).json({message: `${postid} deleted successfully`, deletepost});
        
    }
    catch(err){
        console.log(err);
        res.status(500).json({error: "Internal Server error"});
    }
})

                      
// Like a post by postid 

router.put("/like/:postid", jwtAuthMiddleware, async (req, res) => {
  try {
    const post = await Post.findById(req.params.postid);
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    // Check if user already liked
    const alreadyLiked = post.likes.find(
      (like) => like.user.toString() === req.user.id
    );
    if (alreadyLiked) {
      return res.status(400).json({ error: "You already liked this post" });
    }

    // Add user to likes
    post.likes.push({ user: req.user.id });
    const likepost = await post.save();
    console.log("like post ");
    res.json({ likepost, totalLikes: post.likes.length });
  }
  catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Internal Server error" });
  }
});


// unlike a post by post id

router.put("/unlike/:postid", jwtAuthMiddleware, async (req, res) => {
  try {
    const post = await Post.findById(req.params.postid);
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    const userId = req.user.id;

    // Check if user has liked the post
    const alreadyLiked = post.likes.some(
      (like) => like.user.toString() === userId
    );

    if (!alreadyLiked) {
      return res.status(400).json({ error: "You haven't liked this post" });
    }

    // Remove user's like using filter
    post.likes = post.likes.filter(
      (like) => like.user.toString() !== userId
    );

    await post.save();

    res.json({ message: "Post unliked", totalLikes: post.likes.length });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Server error" });
  }
});


// to comment from the post 

// POST /api/posts/comment/:postId
router.post('/comment/:postId', jwtAuthMiddleware, async (req, res) => {
  try {
    const { text } = req.body;
    const userId = req.user.id;

    if (!text || text.trim() === '') {
      return res.status(400).json({ error: 'Comment text is required' });
    }

    const post = await Post.findById(req.params.postId);
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    const newComment = {
      user: userId,
      text,
      date: new Date()
    };

    post.comments.unshift(newComment); // Add comment at beginning

    await post.save();

    res.status(200).json(post.comments);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});



// DELETE /api/posts/comment/:postId/:commentId
router.delete('/comment/:postId/:commentId', jwtAuthMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;

    const post = await Post.findById(req.params.postId);
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    // Find the comment
    const comment = post.comments.find(
      (c) => c._id.toString() === req.params.commentId
    );

    if (!comment) {
      return res.status(404).json({ error: 'Comment not found' });
    }

    // Only allow the comment owner to delete
    if (comment.user.toString() !== userId) {
      return res.status(401).json({ error: 'User not authorized' });
    }

    // Remove the comment using filter
    post.comments = post.comments.filter(
      (c) => c._id.toString() !== req.params.commentId
    );

    await post.save();

    res.status(200).json(post.comments); // Return updated comments
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});


















module.exports = router;