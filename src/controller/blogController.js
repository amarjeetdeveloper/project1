const blogModel = require("../model/blogModel")
const authorModel = require("../model/authorModel")


//2 create Blog
const createBlog = async function (req, res) {
  try {
    let data = req.body //data come from body
    if (Object.keys(data).length == 0) return res.status(404).send({status:false,msg:"Data not found"})

    let { title, body, authorId, category } = data //check body data availability
    if (!title) return res.status(404).send({status:false,msg:"title is missing"})
    if (!body) return res.status(404).send({status:false,msg:"body is missing"})
    if (!category) return res.status(404).send({status:false,msg:"category is missing"})
    if (!authorId) return res.status(404).send({status:false,msg:"authorId is missing"})

    if(authorId.length!==24)return res.status(401).send({status:false,msg:"not a author authorId"})
    let check = await authorModel.findById(authorId) //checking authorId validity from author Model
    if (!check) return res.status(401).send({status:false,msg:"invalid authorId"})
    

    let blogCreate = await blogModel.create(data) //create blog
    res.status(200).send({ status: true, msg: blogCreate })
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


//4 update Blog


const updateBlog = async function (req, res) {
  try{
  let data = req.body //checking input
  if (Object.keys(data).length == 0) return res.status(404).send({status:false,msg:"body is empty"})

  let { title, body, tags, subcategory } = data //check availibility
  if (!tags) return res.status(401).send({status:false,msg:"tags is misssing"})
  if (!subcategory) return res.status(401).send({status:false,msg:"subcategory is missing"})

  let blog_Id = req.params.blogId
  if (!blog_Id) return res.status(401).send({ status: false, msg: "Blog Id is required" })
  let check = await blogModel.findById(blog_Id)
  if (!check) return res.status(404).send({status:false,msg:"invalid BlogId"})
  if (check.isDeleted == true) return res.status(404).send ({status:false,msg:"we can't update a deleted blog"})
//update here
  let update = await blogModel.findByIdAndUpdate(blog_Id, 
    { $set: data, isPublished: true, publishedAt: new Date() },
    { new: true }
  )
  res.status(201).send({ status: true, msg: update })
  }
  catch(err){
  res.status(500).send({error:err.message})
   }
}

//5
const deleteBlog = async function (req, res) {
  try {
    let blogId = req.params.blogId; //input
    if (!blogId) return res.status(404).send({status:false,msg:"blogId not found"}) //check
    let blog = await blogModel.findById(blogId)
    if (!blog) return res.status(400).send({status:false,msg:"BlogId is invalid"});
    if (blog.isDeleted == true) return res.status(404).send({status:false,msg:"this blog is already deleted"})

    let deletedBlog = await blogModel.findOneAndUpdate(
      { _id: blogId }, 
      { $set: { isDeleted: true } }, 
      { new: true });
    res.send({ status: true, data: deletedBlog });
  }

  catch (err) {
    res.status(500).send({ msg: "error", error: err.message })
  }
}

//6
const deleteparams = async function (req, res) {
  try {
    let data = req.query;
    if (Object.keys(data).length == 0) return res.status(404).send({status:false,msg:"Query data empty"})
    const deleteByQuery = await blogModel.updateMany(
      { $and: [data, { isDeleted: false }, { isPublished: true }] },
      { $set: { isDeleted: true } },
      { new: true })
    if (!deleteByQuery) return res.status(404).send({status:false,msg:"Not a valid Blog"})
    res.status(201).send({ status: true, msg: deleteByQuery })
  }
  catch (err) {
    res.status(500).send({ error: err.message })
  }
}

module.exports.createBlog = createBlog
module.exports.getSpecificAllBlogs = getSpecificAllBlogs
module.exports.updateBlog = updateBlog
module.exports.deleteBlog = deleteBlog
module.exports.deleteparams = deleteparams

