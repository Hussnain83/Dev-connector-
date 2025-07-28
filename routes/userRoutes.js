const express = require("express");
const router = express.Router();
const User = require("./../models/User");
const { jwtAuthMiddleware, generateToken } = require("../jwt");

// check for admin role

const checkAdminRole = async (userID) => {
    try{
        const user = await User.findById(userID);
        if(user.role == "admin"){
            return true;
        }
    }catch(err){
        return false;

    }
}




// Signup 

router.post("/signup", async(req, res)=> {
    try{
        const data = req.body;
        const newUser = new User(data);
        const response = newUser.save();
        console.log("User data saved");

        const payload = {
            id: (await response).id,
        }
        console.log(JSON.stringify(payload));
        const token = generateToken(payload);
        console.log("Token is : ", token);

        res.status(200).json({response: response, token: token});

    }
    catch(err){
         console.log(err);
        res.status(500).json({error: "Internal server error"});
    }
})

// Login Route

router.post("/login", async(req, res)=> {
    try {

        const {email,password} = req.body;
        const user = await User.findOne({email: email});

        if (!user || !(await user.comparePassword(password))){
            return res.status(401).json({error: "Invalid username or password"});
           
        }
           const payload = {
            id: user.id,
        }
        const token = generateToken(payload);
        console.log(`Token sent for user with email: ${email}`)

        // return token as response
        res.json({token});
        
    }
    
    catch(err){
         console.log(err);
        res.status(500).json({error: "Internal server error"});
    }
})

// Get the details of the user by givin token

router.get("/me", jwtAuthMiddleware, async(req,res)=> {
    try{
        const userData = req.user;
        console.log("User Data: ", userData);
        const userId = userData.id; // get id from userData object
        const user = await User.findById(userId);
        res.status(200).json({user});
    }
    catch(err){
        console.log(err);
        res.status(500).json({error: "Internal Server error"});        
    }
})

// delete to delete user from the token

router.delete("/:userID", jwtAuthMiddleware, async(req, res)=> {
    try{

        const userID = req.params.userID;
        // checks if the params and the token id is the same 

        if (req.user.id !== userID) {
            return res.status(403).json({ error: "Access denied" });
        }

        const response = await User.findByIdAndDelete(userID);
        
        if(!response){
            return res.status(404).json({error: "Candidate not found"});
        }

        console.log("User deleted");
        res.status(200).json({response, message: `${userID}: deleted`});
    }
    catch(err){
         console.log(err);
        res.status(500).json({error: "Internal Server error"});
    }
})


// list of all users only for the admin

router.post ("/users",jwtAuthMiddleware, async (req, res) => {
    try{
        const userData = req.user;
        const userID = userData.id;
        if(! await checkAdminRole(userID))
            return res.status(403).json({message: "This is only for admin "});

        const users = await User.find();
        res.status(200).json({users});

    }
    catch(err){
        console.log(err);
        res.status(500).json({error: "Internal Server error"});
    }
})

module.exports = router;
