const blogModel = require("../model/blogModel")
const authorModel = require("../model/authorModel")
const mongoose = require("mongoose")


//3========================================= CreateBlog Api==========================================================

const createBlog = async function (req, res) {

  try {

    let data = req.body //data come from body

    if (!Object.keys(data).length) return res.status(404).send({ status: false, msg: "Please Provide Valid Blog Details" })

    if (!data.title) return res.status(400).send({ status: false, msg: "Title is Required"  })
    
    if (!data.body) return res.status(400).send({ status: false, msg: "Body is Required"  })

    if (!data.authorId) return res.status(400).send({ status: false, msg: "AuthorId is Required" })

    if (!data.category) return res.status(400).send({ status: false, msg: "Category is Required" })

    if (!mongoose.isValidObjectId(data.authorId)) return res.status(400).send({ status: false, msg: "Enter a Valid AuthorId"})

    if(!Array.isArray(data.category)) return res.status(400).send({ status: false, msg: "category Should be an Array" })

    if(!Array.isArray(data.tags)) return res.status(400).send({ status: false, msg: "Tags Should be an Array" })

    if(!Array.isArray(data.subcategory)) return res.status(400).send({ status: false, msg: "Sub-category Should be an Array" })
    
    //--------------------------------checking authorId validity from author Model-------------------------------//

    let AuthorData = await authorModel.findById(data.authorId) 

    if (!AuthorData) return res.status(400).send({ status: false, msg: "No such authorId found" })

    let checkBlog=await blogModel.findOne(data).count()

    if(checkBlog) return res.status(400).send({ status: false, msg: "Blog already exists" })

    if(data.isPublished) data.publishedAt=new Date()

//--------------------------------------Blog create here-------------------------------------------------------------
    
    let blogCreate = await blogModel.create(data) 

    res.status(201).send({ status: true, msg:"Blog Created Sucessfully" ,data:blogCreate })

  }
  catch (err) {
    res.status(500).send({ error: err.message })
  }
}

//3 =========================================GET BLOG DATA====================================================//

const getSpecificAllBlogs = async function (req, res) {

  try {

    let data = req.query //input takes from query

    if (!Object.keys(data).length) return res.status(400).send({ status: false, msg: "Please Enter The Required Details" })

    if (!mongoose.isValidObjectId(data.authorId)) return res.status(400).send({ status: false, msg: "Enter a Valid AuthorId"})

    let AuthorData = await authorModel.findById(data.authorId) 

    if (!AuthorData) return res.status(400).send({ status: false, msg: "No such authorId found" })

    let blogData = await blogModel.find({ $and: [data, { isDeleted: false }, { isPublished: true }] }).populate("authorId")
    
    if (blogData.length==0) return res.status(404).send({ status: false, msg: "No such blog exists" })
    
    res.status(200).send({ status: true, data: blogData })

  } catch (err) {
    
    res.status(500).send({ status: false, msg: err.message });
  
  }
};


//4 ==============================================update Blog=====================================================//


const updateBlog = async function (req, res) {

  try {

    let data = req.body //update Data takes from body

    if (!Object.keys(data).length) return res.status(404).send({ status: false, msg: "input can't be empty" })
    
    //----------------------------------------------check availibility-----------------------------------------------//
    
    if (!data.title) return res.status(400).send({ status: false, msg: "tags is Required" })
    
    if (!data.body) return res.status(400).send({ status: false, msg: "tags is Required" })
    
    if (!data.tags) return res.status(400).send({ status: false, msg: "tags is Required" })

    if (!data.subcategory) return res.status(400).send({ status: false, msg: "subcategory is Required" })
   
    if(!Array.isArray(data.tags)) return res.status(400).send({ status: false, msg: "Tags Should be an Array" })

    if(!Array.isArray(data.subcategory)) return res.status(400).send({ status: false, msg: "Sub-category Should be an Array" })

    let blog_Id = req.params.blogId //input takes from path param

    if (!mongoose.isValidObjectId(blog_Id)) return res.status(400).send({ status: false, msg: "Enter a Valid BlogId"})

    let check = await blogModel.findById(blog_Id)  //validting blogId

    if (check.isDeleted == true) return res.status(400).send({ status: false, msg: "This blog is already Deleted" })

    //=----------------------------------------------update here------------------------------------------------------//
    
    let update = await blogModel.findByIdAndUpdate(blog_Id,

      { $push:{tags:data.tags,subcategory:data.subcategory},title:data.title,body:data.body,isPublished: true, publishedAt: new Date()  },
      { new: true }
    )
   
    res.status(200).send({ status: true, data: update })

  }

  catch (err) {

    res.status(500).send({ error: err.message })

  }
}

//5========================================DeletedBlog By Path Param Id==============================================//
const deleteBlog = async function (req, res) {

  try {

    let blog_Id = req.params.blogId; //input takes from path params 
    
    if (!mongoose.isValidObjectId(blog_Id)) return res.status(400).send({ status: false, msg: "Enter a Valid BlogId"})

    let blog = await blogModel.findById(blog_Id)//blogId check form blogModel
    
    if (blog.isDeleted == true) return res.status(400).send({ status: false, msg: "this blog is already deleted" })

    //--------------------------------------------------Deleted here--------------------------------------------------//
    
    let deletedBlog = await blogModel.findOneAndUpdate(
    
      { _id: blog_Id },
    
      { $set: { isDeleted: true ,DeletedAt:Date.now()} },
    
      { new: true });

      if (deleteByQuery.modifiedCount==0) return res.status(400).send({ status: false, msg: "The Blog is already Deleted" })

      res.status(200).send({ status: true, data: deletedBlog });
  }

  catch (err) {
   
    res.status(500).send({ msg: "error", error: err.message })
  
  }
}

//6=======================================DeleteBlog By query params===================================================//

const deleteparams = async function (req, res) {

  try {

    let data = req.query; //input takes from query
    //we are putting all the condtions in middleware
    //---------------------------------------delete is done here--------------------------------------//

    const deleteByQuery = await blogModel.updateMany(

      { $and: [data, { isDeleted: false }] },

      { $set: { isDeleted: true ,DeletedAt:new Date()} },

      { new: true })

      if (deleteByQuery.modifiedCount==0) return res.status(400).send({ status: false, msg: "The Blog is already Deleted" })

      res.status(200).send({ status: true, msg: deleteByQuery })
  }

  catch (err) {

    res.status(500).send({ error: err.message })

  }
}

module.exports={createBlog,getSpecificAllBlogs,updateBlog,deleteBlog,deleteparams}

