const blogModel = require("../model/blogModel")
const authorModel = require("../model/authorModel")


//3 CreateBlog Api
//error tag req. not working
const createBlog = async function (req, res) {
  try {
    let data = req.body //data come from body
    if (Object.keys(data).length == 0) return res.status(404).send({ status: false, msg: "Input Can't Be Empty" })
    let {title,body,authorId,category}=data

    if (!authorId) return res.status(404).send({ status: false, msg: "authorId is missing" })

    if (authorId.length !== 24) return res.status(401).send({ status: false, msg: "Enter a Valid AuthorId"})
    //--------------------------------checking authorId validity from author Model-------------------------------//
    let AuthorData = await authorModel.findById(authorId) 
    if (!AuthorData) return res.status(401).send({ status: false, msg: "invalid authorId" })

//--------------------------------------Blog create here-------------------------------------------------------------
    let blogCreate = await blogModel.create(data) 
    res.status(200).send({ status: true, msg: blogCreate })
  }
  catch (err) {
    res.status(500).send({ error: err.message })
  }
}

//3 =========================================GET BLOG DATA====================================================//

const getSpecificAllBlogs = async function (req, res) {
  try {
    let data = req.query //input takes from query
    if (Object.keys(data).length == 0) return res.status(404).send({ status: false, msg: "query data can't be empty" })
    let blogData = await blogModel.find({ $and: [data, { isDeleted: false }, { isPublished: true }] }) //.populate("authorId")
    if (blogData.length==0) return res.status(404).send({ status: false, msg: "No such blog exists" })
    res.status(200).send({ status: true, msg: blogData })

  } catch (err) {
    res.status(500).send({ status: false, msg: err.message });
  }
};


//4 ==============================================update Blog=====================================================//


const updateBlog = async function (req, res) {
  try {
    let data = req.body //update Data takes from body
    if (Object.keys(data).length == 0) return res.status(404).send({ status: false, msg: "input can't be empty" })

    //----------------------------------------------check availibility-----------------------------------------------//
    let { title, body, tags, subcategory } = data 
    if (!tags) return res.status(401).send({ status: false, msg: "tags is misssing" })
    if (!subcategory) return res.status(401).send({ status: false, msg: "subcategory is missing" })

    let blog_Id = req.params.blogId //input takes from path param
    let check = await blogModel.findById(blog_Id)  //validting blogId
    if (check.isDeleted == true) return res.status(404).send({ status: false, msg: "This blog is already Deleted" })
    //=----------------------------------------------update here------------------------------------------------------//
    let update = await blogModel.findByIdAndUpdate(blog_Id,
      { $set: data, isPublished: true, publishedAt: new Date() },
      { new: true }
    )
    res.status(200).send({ status: true, msg: update })
  }
  catch (err) {
    res.status(500).send({ error: err.message })
  }
}

//5========================================DeletedBlog By Path Param Id==============================================//
const deleteBlog = async function (req, res) {
  try {
    let blogId = req.params.blogId; //input takes from path params 
    let blog = await blogModel.findById(blogId)//blogId check form blogModel
    if (blog.isDeleted == true) return res.status(404).send({ status: false, msg: "this blog is already deleted" })

    //--------------------------------------------------Deleted here--------------------------------------------------//
    let deletedBlog = await blogModel.findOneAndUpdate(
      { _id: blogId },
      { $set: { isDeleted: true ,DeletedAt:Date.now()} },
      { new: true });
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
    if (Object.keys(data).length == 0) return res.status(404).send({ status: false, msg: "Query data empty" })

    //---------------------------------------delete is done here--------------------------------------//
    const deleteByQuery = await blogModel.updateMany(
      { $and: [data, { isDeleted: false }, { isPublished: true }] },
      { $set: { isDeleted: true ,DeletedAt:new Date()} },
      { new: true })
    if (!deleteByQuery) return res.status(404).send({ status: false, msg: "Not a valid Blog" })
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

