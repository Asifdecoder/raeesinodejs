const express = require('express')
const router = express.Router() // mini instance
const Product = require('../models/menProduct')
const Review = require('../models/review')
const { validateReview } = require('../middlewares/authwares')

router.post('/men/:id/review',validateReview,async (req,res)=>{

    let {id} = req.params;
    let {rating,comment} = req.body;
    console.log(rating,comment)

    const product = await Product.findById(id)
    const review = new Review({rating,comment});

    product.reviews.push(review);
    await review.save();
    await product.save();
    res.redirect(`/men/${id}`);


})




module.exports= router;