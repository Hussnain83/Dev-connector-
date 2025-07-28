const express = require("express");
const router = express.Router();
const User = require("./../models/User");
const { jwtAuthMiddleware, generateToken } = require("../jwt");
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

module.exports = router;
