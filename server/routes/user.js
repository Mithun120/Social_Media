const router=require('express').Router();
const User=require("../model/User")
const bcrypt=require("bcrypt")
router.put('/userput/:id',async(req,res)=>{
    if (req.body.userId === req.params.id || req.body.isAdmin) {
        if (req.body.password) {
          try {
            const salt = await bcrypt.genSalt(10);
            req.body.password = await bcrypt.hash(req.body.password, salt);
          } catch (err) {
            return res.status(500).json(err);
          }
        }
        try {
          const user = await User.findByIdAndUpdate(req.params.id, {
            $set: req.body,
          });
          res.status(200).json("Account has been updated");
        } catch (err) {
          return res.status(500).json(err);
        }
      } else {
        return res.status(403).json("You can update only your account!");
      }
})
// delete
router.delete("/userdelete/:id",async(req,res)=>{
    if (req.body.userId === req.params.id || req.body.isAdmin) {
        try {
          await User.findByIdAndDelete(req.params.id);
          res.status(200).json("Account has been deleted");
        } catch (err) {
          return res.status(500).json(err);
        }
      } else {
        return res.status(403).json("You can delete only your account!");
      }
})
//get
router.get('/userget/:id',async(req,res)=>{
    try{
        const user = await User.findById(req.params.id)
        const { password,updatedAt,...others}=user._doc;
        res.status(200).json(others)
    }
    catch(err)
    {
        res.status(500).json(err)
    }
})
//follow
router.put('/:id/follow',async(req,res)=>{
  if(req.params.id!=req.body.userId){
  try{
    const use =await User.findById(req.params.id)
    const current =await User.findById(req.body.userId)
    if(!use.followers.includes(req.body.current))
    {
      await use.updateOne({$push:{followers:req.body.userId}})
      await current.updateOne({$push:{following:req.params.id}})
      res.status(200).json("follower added")
    }
    else{
      res.status(403).json("you are already a follower")
    }
  }
  catch(err)
  {
    res.status(500).json(err)
  }}
})




router.put("/:id/unfollow",async(req,res)=>{
  if(req.params.id!=req.body.userId)
  {
    try{
      const use=await User.findById(req.params.id)
      const current =await User.findById(req.body.userId)
      if(!use.followers.includes(req.body.userId))
      {
        await use.updateOne({$pull:{followers:req.body.userId}})
        await current.updateOne({$pull:{following:req.params.id}})
        res.status(200).json("Unfollowed")
      }
      else{
        res.status(403).json("you haven't followed this user")
      }
    }
    catch(err)
    {
      res.status(500).json(err)
    }
  }
  
})
module.exports=router;