import express from "express";
import mongoose from "mongoose";
import userRouter from "./routes/user-routes";
import blogRouter from "./routes/blog-routes";

const app =express();

app.use(express.json())

app.use("/api/user",userRouter)
app.use("/api/blog",blogRouter)

mongoose.connect("mongodb+srv://vijayaram:vijayaram@cluster0.macbiih.mongodb.net/Blog?retryWrites=true&w=majority")
.then(app.listen(3000,()=>{console.log("server started")}) )
.then(()=>  console.log("mongodb connected"))
.catch((err)=>console.log(err))




