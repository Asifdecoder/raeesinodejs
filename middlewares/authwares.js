const jwt = require("jsonwebtoken");
// var cookieParser = require("cookie-parser");
// const { json } = require("express");

const {reviewSchema,productSchema,userSchema} = require('../schema')


const validateProduct = (req,res,next)=>{

  const {name,img,price,description} = req.body;
  const {error} = productSchema.validate({name,img,price,description})
  if(error){
    return res.send(error.message)
  }
  next();
}
const validateReview = (req,res,next)=>{

  const {rating,comment }  = req.body;
  const {error} = reviewSchema.validate({rating,comment});
  if(error){
   return res.send('error')
  }
  next()


}

const validateUser = (req,res,next)=>{
 const {username,name,password,email,googleId,fbId,role} = req.body;
 const {error} = userSchema.validate({username,email,password,name,googleId,fbId,role})
 if(error){
  return res.send('error validating user')
 }
 next();

}


function isAuthentic(req, res, next) {
  const { token } = req.cookies;

  if (!token) {
    return res.status(403).redirect('/login')
  }

  try {
    const decode = jwt.verify(token,'process.env.SECRET_KEY');
    req.user = decode;
    // console.log(req.user)
    next();
  } catch (error) {

 
    console.log(error)
    return res.status(401).send("Invalid or expired token");
  }
}

function isAdmin(req, res, next) {
  const { token } = req.cookies;
  // console.log(token);
//  console.log(req.signedCookies) 
  if(!token){
   return res.send('You are not authorized') 
  }

  const decode = jwt.verify(token, 'process.env.SECRET_KEY');
  
 


  // console.log(decode)


  if(decode && decode.role === true)
   return next()
  else{

    res.send('You are not authorised to access')
  }
}

module.exports = {
  isAuthentic,

  isAdmin,
  validateProduct,
  validateReview,
  validateUser
};
