const mongoose = require("mongoose")
const ObjectId = mongoose.Schema.Types.ObjectId
const blogSchema = new mongoose.Schema(
    {

        title:
        {
            type: String,
            required: true,
            trim:true
        },
        body:
        {
            type: String,
            required: true,
            trim:true
        },
        authorId: {
            type: ObjectId,
            trim:true,
            required: true,
            ref: 'Author'
        },
        tags: {
            type:[String],
            trim:true
        },

        category: {
            type: [String],
            required:true,
            trim:true
        },

        subcategory: {
            type: [String],
            trim:true
        },
        isDeleted: {
            type: Boolean,
            default: false,
        },

        publishedAt: Date,
        DeletedAt:Date,

        isPublished: {
            type: Boolean,
            default: false
        }

    }, { timestamps: true });

module.exports = mongoose.model('blogModel', blogSchema)
