const joi = require('joi')


const userSchema = joi.object({
    name: joi.string(),
    username: joi.string().trim(),
    email: joi.string().required().trim(),
    password: joi.string().min(6).max(30),
    googleId: joi.string(),
    fbId: joi.string(),
    role: joi.boolean()
})


const productSchema = joi.object({
    name: joi.string().required().trim(),
    img: joi.string().required(),
    price: joi.number().required().min(0).integer(),
    description: joi.string().required().trim(),
    


})

const reviewSchema = joi.object({

    rating: joi.number().min(0).max(5),
    comment: joi.string()
})

module.exports= {
    
    reviewSchema,productSchema,userSchema
}