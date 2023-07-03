const router=require('express').Router();
const User=require("../model/User")
const bcrypt=require("bcrypt")
//register
router.post('/authregister',async(req,res)=>{
    try{
        const salt=await bcrypt.genSalt(10);
        const hashed=await bcrypt.hash(req.body.password,salt)
        const newUser=await new User(
            {
                username:req.body.username,
                email:req.body.email,
                password:hashed
            }
        )
        const saving=await newUser.save();
        res.status(200).json(saving)
    }
    catch(err)
    {
        res.status(500).json("error")
    }
})
//login
router.post("/authlogin",async(req,res)=>{
    try{
    const user =await User.findOne({email:req.body.email})
   !user &&  res.status(404).json("User not found")

    const validPass=await bcrypt.compare(req.body.password,user.password)
    !validPass && res.status(404).json("Wrong password")
    
    res.status(200).json(user);
}
catch(err)
{
    res.status(500).json("Internal server error")
}
}) 
// router.get("/",async(req,res)=>{
//     try {
//         const users = await User.find();
//         res.status(200).json(users);
//       } catch (error) {
//         res.status(500).json({ error: 'Internal server error' });
//       }
// })

module.exports=router;