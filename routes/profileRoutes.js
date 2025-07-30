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

// Delete the whole profile

router.delete("/", jwtAuthMiddleware, async(req, res)=> {
    try{

        const userID = req.user.id;
       // get id from the token      

        const response = await Profile.findOneAndDelete({user: userID});
        
        if(!response){
            return res.status(404).json({error: "Candidate not found"});
        }

        console.log("Profile deleted");
        res.status(200).json({ message: `${userID}: profile deleted`});
    }
    catch(err){
         console.log(err);
        res.status(500).json({error: "Internal Server error"});
    }
})

// update the experience of the Profile

router.put("/experience", jwtAuthMiddleware, async(req, res)=> {
    try{
    const userID = req.user.id;
    const newExperience = req.body;

    const profile = await Profile.findOne({user: userID});
    if(!profile) {
        return res.status(404).json({error: "Profile not found"});
    }
    
    // Add new experience to the beginnin of the array
    profile.experience.unshift(newExperience);

    const updatedProfile = await profile.save();
    res.status(200).json(updatedProfile);
    }
    catch(err){
        console.log(err);
        res.status(500).json({error: "Internal server error"});
    }
});

// delete specific experience using experience id

router.delete("/experience/:expId", jwtAuthMiddleware, async (req, res)=>{
    try{
        const userID = req.user.id;
        const experienceId = req.params.expId;

        const profile = await Profile.findOneAndUpdate(
            {user: userID},
            {$pull: {experience: {_id: experienceId}}},
            {new: true}
        );
        if(!profile){
            return res.status(404).json({error: "Profile not found"});
        }
        console.log("Experience Deleted");
        res.status(200).json({message: "Experience deleted", profile});

    }
    catch(err){
        console.log(err);
        res.status(500).json({error: "Internal server error"});
    }
})

// update the education

router.put("/education", jwtAuthMiddleware, async(req, res) => {
    try{
        const userID = req.user.id;
        const newEducation = req.body;

        const profile = await Profile.findOne({user:userID});
        
        if(!profile) {
        return res.status(404).json({error: "Profile not found"});
    }

        profile.education.unshift(newEducation);
        const updatedProfile = await profile.save();
        console.log("Education deleted");
        res.status(200).json({updatedProfile});

    }
    catch{
        console.log(err);
        res.status(500).json({error: "Internal server error"});
    }
})


// delete the education


router.delete("/education/:eduId", jwtAuthMiddleware, async (req, res)=>{
    try{
        const userID = req.user.id;
        const educationId = req.params.eduId;

        const profile = await Profile.findOneAndUpdate(
            {user: userID},
            {$pull: {education: {_id: educationId}}},
            {new: true}
        );
        if(!profile){
            return res.status(404).json({error: "Profile not found"});
        }
        console.log("Education Deleted");
        res.status(200).json({message: "Education deleted", profile});

    }
    catch(err){
        console.log(err);
        res.status(500).json({error: "Internal server error"});
    }
})





module.exports = router;