const User = require("../models/User");
const flash = require('connect-flash');
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");



async function handleUserSignup(req, res) {
  let { username, email, password } = req.body;

  if (!(username && email && password)) {
    res.send("all fields are necessary");
  }
  const existingUser = await User.findOne({ email });

  let hash = bcrypt.hashSync(password, 10);

  if (!existingUser) {
    let newUser = await User.create({
      username: username,
      email: email,
      password: hash,
    });

    // generate a token for a user and send it

    const token = jwt.sign(
      {
        id: newUser._id,
        email: email,
        role: false
      },

      "process.env.SECRET_KEY",
      {
        expiresIn: "2h",
      }
    );
    newUser.token = token;
    newUser.password = undefined;

    res.status(201).json({ newUser, token });
    console.log("user registered");
    console.log(token);
  } else {
    res.send(" you have already registered  please login");
  }
}

async function handleUserLogin(req,res) {

  let { email, password } = req.body;

  if (!(email && password)) {
    res.send("please enter email and password both");
  }
  const foundUser = await User.findOne({ email });

  // check if email and password exists in the db

  const normalPassword = bcrypt.compareSync(password, foundUser.password);

  if (foundUser.email && normalPassword) {
    let token = jwt.sign(
      {
        _id: foundUser._id,
        email: foundUser.email,
        role: foundUser.role
      },
      "process.env.SECRET_KEY",
      {
        // expiration time of token
        expiresIn: "5h",
      }
    );

    foundUser.token = token;
    foundUser.password = undefined;
// expirtion time of cookie the token will show
    const options = {
      expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      httpOnly: true,
    };

    res
      .status(200)
      .cookie("token", token, options).redirect('/men')
      
    
  }else{
    res.send('username or password is wrong')
  }



}

module.exports = {
  handleUserSignup,handleUserLogin
};
