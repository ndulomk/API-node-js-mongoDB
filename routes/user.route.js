import express from 'express';
import { protect } from '../middlewares/auth.js';
import User from '../models/User.js';
const router = express.Router()

router.put("/:id", protect, async(req, res)=>{
  try {
    const user = await User.findById(req.params.id)
    if(!user) return res.status(404).json({message:"User not found"})
    const payload = {...req.body}
    const updatedUser = await User.findByIdAndUpdate(req.params.id, payload, {new: true})
    res.status(200).json(updatedUser)
  } catch (error) {
    res.status(500).send("server error")
  }
})

router.delete("/:id", async(req, res)=>{
  try {
    const post = await User.findByIdAndDelete(req.params.id)
    if(!post) return res.status(404).json({message: "User not found"})
    res.status(200).json({message: "User deleted successfully"})
  } catch (error) {
    res.status(500).send("Server error")
    console.log(error)
  }
})


router.get("/" ,async (req, res) => {
  try {
    const users = await User.find()
    
    if (!users || users.length === 0) {
      return res.status(404).json({ message: "Users not found" });
    }

    res.json(users);
  } catch (error) {
    console.error(error); 
    res.status(500).send("Server error");
  }
});


export default router