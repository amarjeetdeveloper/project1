const authorModel = require("../model/authorModel")

const createAuthor = async function (req, res) {
    try {
        let data = req.body //data comes from body
        if (Object.keys(data).length == 0) return res.status(404).send({ status: false, msg: "No data found" })

        let { firstName, lastName, title, email, password } = data //check data that available or not
        if (!firstName) return res.status(404).send({ status: false, msg: "fistName not found" })
        if (!lastName) return res.status(404).send({ status: false, msg: "lastName not found" })
        if (!title) return res.status(404).send({ status: false, msg: "title not found" })
        if (!email) return res.status(404).send({ status: false, msg: "email not found" })
        if (!password) return res.status(404).send({ status: false, msg: "password not found" })

        let emailCheck = await authorModel.findOne({ email: email })//check email duplicacy
        if (emailCheck) return res.status(409).send({ status: false, msg: "emailId already exits" })

        let saveData = await authorModel.create(data) //create author
        res.status(201).send({ status: true, msg: saveData })
    }
    catch (err) {
        res.status(500).send({ error: err.message })
    }

}

const authorLogin = async function (req, res) {
    try {
        let authorName = req.body.email;
        let password = req.body.password;

        let particularAuthor = await authorModel.findOne({ email: authorName, password: password });

        if (!particularAuthor)
            return res.status(404).send({
                status: false,
                logInFailed: "username or the password is not correct",
            });


        let token = jwt.sign(
            {
                authId: particularAuthor._id.toString(),
                batch: "batch 19 phase2",
                organisation: "FunctionUp",
            },
            "batch 19 phase2"
        );

        return res.status(201).send({ status: true, token: token });

    } catch (err) {
        return res.status(500).send({ ERROR: err.message });
    }
}




module.exports.authorLogin = authorLogin;

module.exports.createAuthor = createAuthor