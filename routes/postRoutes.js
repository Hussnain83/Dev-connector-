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


























module.exports = router;