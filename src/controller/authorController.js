const authorModel = require("../model/authorModel")

const createAuthor = async function (req, res) {
    try {
        let data = req.body
        let saveData = await authorModel.create(data)
        res.status(201).send({ status: true, msg: saveData })
    }
    catch (err) {
        res.status(500).send({ error: err.message })
    }

}

module.exports.createAuthor = createAuthor