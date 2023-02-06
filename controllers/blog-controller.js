import Blog from "../models/blog";
import mongoose from "mongoose";
import User from "../models/user";

export const getAllBlogs = async(req,res,next) => {
    let blogs
    try{
        blogs = await Blog.find()
    }
    catch(err){
        return console.log(err)
    }
    if(!blogs){
        return res.status(404).json({message:"no blogs found"})
    }
    return res.status(200).json({blogs})
}

export const addBlogs = async (req,res,next) =>{
    const {title,description,image,user} = req.body

    let existingUser
    try{
        existingUser=await User.findById(user)
    }
    catch(err){
        return console.log(err)
    }
    if(!existingUser){
        return res.status(400).json({message:"unable to find the user bybthis id"})
    }
    const blog = new Blog({
        title,description,image,user
    })
    try {
        const session = await mongoose.startSession()
        session.startTransaction()
        await blog.save({session})
        existingUser.blogs.push(blog)
        await existingUser.save({session})
        await session.commitTransaction()
    }
    catch(err){
         console.log(err)
        return res.status(500).json({message:err})
    }
    return  res.status(420).json({blog})
}

export const updateBlog = async (req,res,next)=>{
    const {description ,title ,user  } = req.body
    const blogId = (req.params.id.trim());
//     console.log("req.params._id",req.params.id)
//     console.log(".blogId.",blogId)
    let blog
    try{
    blog = await Blog.findByIdAndUpdate(blogId,{
        title,
        description,
        user
    })
    }
    catch(err){
        return console.log(err)
    }

    if(!blog){
        console.log(blog)
        return res.status(500).json({message:"unable to update a blog"})
    }
    blog = await Blog.findOne({blogId})
    res.status(200).json({blog})
    
    }


    export const getById = async (req,res,next) => {
        const id = req.params.id
        let blog
        try {
            blog = await Blog.findById(id)
        }
        catch(err){
            return console.log(err)
        }
        if(!blog){
            return res.status(404).json({message : "no blog with such id is found"})
        }
        return res.status(200).json({blog})
    }

    export const deleteBlog = async (req,res,next) => {
        const id = req.params.id
        let blog
        try {
            blog = await Blog.findByIdAndRemove(id).populate('user')
            // populate function contains user details
            // blog{
            //     user{
            //         blogs:[]
            //     }
            // } 
            // pull alreaDY prsent method in mongoose database for arrays
            console.log("id",id)
            console.log(blog)
            console.log(blog.user)

            await blog.user.blogs.pull(blog)
            await blog.user.save()

        }
        catch(err){
            return console.log(err)
        }
        if(!blog){
            return res.status(404).json({message : "no delete is possible may be blog not found or not present"})
        }
        return res.status(200).json({message:"successfully deleted" , blog})
    }


    export const getByUserId = async (req,res,next) =>{
        const userid = req.params.id
        let userBlogs
        try{
            userBlogs = await User.findById(userid).populate('blogs')
        }
        catch(err){
            return console.log(err)
        }
        if(!userBlogs)
        {
            return res.status(404).json({message :"no blog found"})
        }
        return res.status(200).json({userBlogs})
    }
