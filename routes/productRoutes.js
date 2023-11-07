const express = require("express");
const router = express.Router();
const Menproduct = require("../models/menProduct");
const User = require("../models/User");
const bcrypt = require("bcrypt");
const Review = require('../models/review')
const passport = require("passport");
const { Cookie } = require("express-session");
const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId;


const {
  ensureAuthenticated,
  isAuthentic,
  isAdmin,
  validateProduct,validateUser
} = require("../middlewares/authwares");
const jwt = require("jsonwebtoken");
const {
  handleUserSignup,
  handleUserLogin,
} = require("../controllers/controllers");
router.get("/", (req, res) => {
  let {token} = req.cookies
  res.render("index", {token});
});

router.get("/signup", (req, res) => {
  res.render("signup");
});

// router.post("/signup", async (req, res) => {
// <<---saving data and using bcrypt to hash the function--->
// let { username, email, password } = req.body;

// // let uniqueUser = await User.find({username})

// const hash = bcrypt.hashSync(password, saltRounds);
// console.log(hash,username,email)

//   await User.create({
//     username: username,
//     email: email,
//     password: hash,
//   });
//   console.log('succesfully added data to db')

// res.redirect('/men')

//now using passports local stratergy for the authentication
// })

router.get("/login", (req, res) => {
  res.render("login");

  // res.redirect('/');
});

// router.post("/login",  (req, res) => {
//   //   let {email,password} = req.body;
//   //  const foundUser = await User.findOne({email})

//   // if(foundUser!=null){

//   //   let passwordCheck =  bcrypt.compareSync(password,foundUser.password) //returns true or false

//   //   if(passwordCheck && foundUser.email === email){

//   //     res.redirect('/men')
//   //   }
//   //   else{
//   //     res.json('Wrong username or password : try again')
//   //   }

//   // }
//   // else{
//   //   res.redirect('/signup')
//   // }
//   let { email, password } = req.body;

//   const user = new User({
//     email: email,
//     password: password,
//   });

//   req.login(user, function (err) {
//     if (err) {
//       console.log(err);
//     } else {

//       passport.authenticate(
//         "local", { successRedirect: '/men', failureRedirect: '/login', })
//         (req,
//         res,)
//       ;
//     }
//   });
// });

// creating a signup post request and then will create a  login post

router.post("/signup",validateUser, handleUserSignup);

router.post("/login",validateUser, handleUserLogin);

//   let { email, password } = req.body;


//   if (!(email && password)) {
//     res.send("please enter email and password both");
//   }
//   const foundUser = await User.findOne({ email });

//   // check if email and password exists in the db

//   const normalPassword = bcrypt.compareSync(password, foundUser.password);

//   if (foundUser.email && normalPassword) {
//     let token = jwt.sign(
//       {
//         _id: foundUser._id,
//         email: foundUser.email,
//       },
//       "process.env.SECRET_KEY",
//       {
//         expiresIn: "2h",
//       }
//     );

//     foundUser.token = token;
//     foundUser.password = undefined;

//     const options = {
//       expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
//       httpOnly: true,
//     };

//     res
//       .status(200)
//       .cookie("token", token, options)
//       .json({ success: true, token, foundUser });
//   }
// });

// router.get("/logout", (req, res) => {
//   res.clearCookie("token");
//   res.clearCookie("connect.sid");
//   res.send("cookies deleted");
// });


router.get("/logout", (req, res) => {
  res.clearCookie("token");

  // req.session.destroy((err) => {
  //   if (err) {
  //     console.error("Error destroying session:", err);
  //   }
    console.log("destroyed");
    // res.clearCookie("connect.sid");
    res.redirect('/');
  // });
});

router.get("/aboutus", isAdmin, (req, res) => {
  res.send("working now");
});

router.get("/contactus", (req, res) => {
  res.render("contactus");
});

router.get("/men", isAuthentic, async (req, res) => {
  let allProducts = await Menproduct.find();
  let {user} = req

  res.render("men", { allProducts,user});

});
router.get("/men/new", isAdmin, (req, res) => {
  res.render("new");
});
router.post("/men",validateProduct, isAdmin,async (req, res) => {
  let { name, img, price, description } = req.body;



  try {
    await Menproduct.create({
      name: name,
      img: img,
      price: price,
      description: description,
    });
    res.redirect("/men");
  } catch (error) {
    console.log("from postmenform");
  }
});
router.get("/men/:pid", isAuthentic, async (req, res) => {
  let { pid } = req.params;

  if (!ObjectId.isValid(pid)) {
    return res.status(400).send("Invalid product ID");
  }
 
  let {user} = req

  
  try {
    
    let findId = await Menproduct.findById(pid).populate('reviews');
    // console.log(findId)
     res.render("show", { findId ,user});
  } catch (error) {
    console.log(error.message);
  }
});

router.get("/men/:pid/edit", isAuthentic, isAdmin, async (req, res) => {
  let { pid } = req.params;
  let findId = await Menproduct.findById(pid);
  let {user} = req

  res.render("edit", { findId , user});
});
router.patch("/men/:pid", validateProduct, isAdmin, async (req, res) => {
  let { pid } = req.params;
  let { name, img, price, description } = req.body;
  await Menproduct.findByIdAndUpdate(pid, {
    name,
    img: img,
    price,
    description,
  });

  res.redirect(`/men/${pid}`);
});

router.delete("/men/:pid", isAdmin, async (req, res) => {
  let { pid } = req.params;

  await Menproduct.findByIdAndDelete(pid);
  res.redirect("/men");
});

router.get("/women", (req, res) => {
  res.send("working now");
});

router.get("/kids", (req, res) => {
  res.send("working now");
});

router.get("/bags", (req, res) => {
  res.send("working now");
});

router.get("/footwear", (req, res) => {
  res.send("working now");
});

router.get("/accessories", (req, res) => {
  res.send("working now");
});

// router.get("*", (req, res) => {
//   res.render("404");
// });

module.exports = router;
