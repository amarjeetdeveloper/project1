const blogModel = require("../model/blogModel")
const authorModel = require("../model/authorModel")

const createBlog = async function (req, res) {
    try {
        let data = req.body
        let authorId = req.body.authorId
        let authorDetails = await authorModel.findById(authorId);
        if (!authorDetails){
        return res.status(404).send({ status: false, msg: "No such author exists" });
        }
    else{
        let saveData = await blogModel.create(data)
        res.status(201).send({ status: true, msg: saveData }) 
     }  
    }
    catch (err) {
        res.status(500).send({msg:"error", error: err.message })
    }
}


const getSpecificAllBlogs = async function (req, res) {
    try {
      let data = req.query;
    //   let filter = {
    //     isDeleted: false,
    //     isPublished: true,
    ///     ...data,
    //   };
  
      let getSpecificBlogs = await blogModel.find({$and:[data,{isDeleted:false},{isPublished:true}]})
  
      if (getSpecificBlogs.length == 0) {
        return res.status(400).send({ status: false, data: "No blogs can be found" });
          
     } else {
        return res.status(200).send({ status: true, data: getSpecificBlogs });
      }
    } catch (err) {
      res.status(500).send({ status: false, msg: err.message });
    }
  };



module.exports.createBlog = createBlog

module.exports.getSpecificAllBlogs = getSpecificAllBlogs