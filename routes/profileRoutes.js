const express = require("express");
const router = express.Router();
const User = require("./../models/User");
const { jwtAuthMiddleware } = require("../jwt");
const Profile = require("./../models/Profile");

// Posting profile 

router.post("/", jwtAuthMiddleware, async(req, res)=>{
    try{
    const userID = req.user.id;
    const existingProfile = await Profile.findOne({user: userID});
    if (existingProfile){
        return res.status(400).json({error: "Profile already exists"});
    }
    const data = req.body;
    data.user = userID;
    const newProfile = new Profile(data);
    const response = await newProfile.save();
    console.log("Profile data saved");
    res.status(200).json({response: response});
    }
    catch(err){
        console.log(err);
        res.status(500).json({error: "Internal server error"});
    }

})


// Update the profile


router.put("/", jwtAuthMiddleware, async(req, res)=>{
    try{
        const userID = req.user.id;
        const updatedData = req.body;

        const updatedProfile = await Profile.findOneAndUpdate({user: userID}, updatedData,
          { 
            new: true,
            runValidators: true 
          }
        )
        if(!updatedProfile){
            return res.status(404).json({ error: "Profile not found" });
        }
         console.log("Profile updated successfully");
         res.status(200).json({ response: updatedProfile });
    }
    catch(err){
        console.log(err);
        res.status(500).json({error: "Internal server error"});
    }

})

// get all the profiles


router.get ("/profiles",jwtAuthMiddleware, async (req, res) => {
    try{
       

        const profiles = await Profile.find();
        res.status(200).json({profiles});

    }
    catch(err){
        console.log(err);
        res.status(500).json({error: "Internal Server error"});
    }
})

// get the profile of a specific person

router.get("/search/:userId",jwtAuthMiddleware, async(req, res)=>{
    try{
       const  userID = req.params.userId;
       if (!userID) {
       return res.status(400).json({ error: "User ID is required in params" });
       }

        const profile = await Profile.findOne({user: userID}).populate("user", "name");
        if(!profile) {
            return res.status(404).json({error: "User ID not found"});
        }
        console.log("Profile found");
        res.status(200).json(profile);
    }
    catch(err){
        console.log(err);
        res.status(500).json({error: "Internal Server error"});
    }
})


// get the our own profile

router.get("/me", jwtAuthMiddleware, async(req,res)=>{
    try{
        const userID = req.user.id;
       const profile=  await Profile.findOne({user: userID});
       if(!profile) {
            return res.status(404).json({error: "User ID not found"});
        }
        res.status(200).json({profile});

    }
    catch(err){
        console.log(err);
        res.status(500).json({error: "Internal Server error"});
    }

})

module.exports = router;