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

module.exports.createBlog = createBlog