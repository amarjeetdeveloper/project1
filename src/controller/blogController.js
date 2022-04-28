const blogModel=require("../model/blogModel")
const authorModel=require("../model/authorModel")



//2
const createBlog = async function (req, res) {
    try {
        let data = req.body
        if(Object.keys(data).length==0) return res.status(400).send("no data available in body")
        let{title,body,authorId,category}=data
        if(!title) return res.status(400).send("required title")
        if(!body) return res.status(400).send("required body")
        if(!category) return res.status(400).send("required category")
        if(!authorId)return res.status(400).send("no author id found")
        let check=await authorModel.findById(authorId)
       if(!check) return res.status(400).send("invalid authorId")
       let blogCreate=await blogModel.create(data)
       res.status(200).send({status:true,msg:blogCreate})
    }
    catch (err) {
        res.status(500).send({ error: err.message })
    }
}

//3
const getSpecificAllBlogs = async function (req, res) {
    try {
      let data = req.query;
      let filter = {
        isDeleted: false,
        isPublished: true,
       ...data,
      };
  
      // let getSpecificBlogs = await blogModel.find({$and:[data,{isDeleted:false},{isPublished:true}]})
  
      // if (getSpecificBlogs.length == 0) {
      //   return res.status(400).send({ status: false, data: "No blogs can be found" });
      let blogData = await blogModel.find(filter)
      if(!blogData) return res.status(404).send({status:false, msg:"No such author exists"})
          
     res.status(200).send({ status: true, data: getSpecificBlogs });
      
    } catch (err) {
      res.status(500).send({ status: false, msg: err.message });
    }
  };


//4
  const updateBlog=async function(req,res){
    //try{
    let data=req.body
    if(Object.keys(data).length==0)return res.status(400).send("body is empty")

   let{title, body, tags, subcategory}=data
    if(!title)return res.status(401).send("title is not present")
    if(!body)return res.status(401).send("body is not present")
    if(!tags)return res.status(401).send("tags is not present")
    if(!subcategory)return res.status(401).send("subcategory is not present")
    let blog_id=req.params.blogId
    console.log(blog_id)
    if(!blog_id) return res.status(400).send("no blogId found")
    let check=await blogModel.find({_id:blog_id})
    if(!check) return res.status(400).send("invalid blog Id")
    if(check.isDeleted==true) return res.status(404).send("we can't update a delete blog")
     let update=await blogModel.findAndUpdate(
       {_id:blog_id},
     {$set:data,isPublished:true,publishedAt:new Date()},
     {new:true}
     )
     res.status(201).send({status:true,msg:update})
    // }
    // catch(err){
    //   res.status(500).send({error:err.message})
    // }
  }
    



//5
  const deleteBlog = async function (req, res) {
    try {
  let blogId = req.params.blogId;
  if(!blogId) return res.status(404).send("no such blogId")
  let blog = await blogModel.findById(blogId)
  if (!blog)  return res.status(400).send("No such blog exists");
  if(blog.isDeleted==true)  return res.status(404).send("this blog is already deleted")
  let deletedBlog = await blogModel.findOneAndUpdate({ _id: blogId }, {$set:{isDeleted: true}}, {new: true});
  res.send({ status: true, data: deletedBlog });
    }

  catch (err) {
        res.status(500).send({msg:"error", error: err.message })
    }
}

 
 const deleteParams =async function(req,res){
   try{ 
let data =req.query;
const deleteByQuery=await blogModel.updateMany({$and:[data,{isDeleted:false},{isPublished:true}]},
  {isDeleted:true},{new:true})
  if(!deleteByQuery) return res.status(404).send("blog doesn't exist")
 res.status(200).send({status:true,msg:deleteByQuery})
}
catch (err){
  res.status(500).send({error:err.message})
}
}

module.exports.createBlog = createBlog
module.exports.getSpecificAllBlogs = getSpecificAllBlogs
module.exports.updateBlog=updateBlog
module.exports.deleteParams=deleteParams
module.exports.deleteBlog=deleteBlog

