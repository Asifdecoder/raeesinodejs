if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const productRoutes = require("./routes/productRoutes");
const jwt = require("jsonwebtoken");
const FacebookStrategy = require("passport-facebook");

const PORT = 8081;
var flash = require("connect-flash");

const seedDB = require("./seed");
const methodOverride = require("method-override");
const passport = require("passport");

const session = require("express-session");
var cookieParser = require("cookie-parser");
const reviewRoutes = require("./routes/reviewRoutes");
const User = require("./models/User");
var GoogleStrategy = require("passport-google-oauth20").Strategy;
const connnectDb = require("./connectdb");
mongoose.set("strictQuery", true);

connnectDb();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.static(path.join(__dirname, "public")));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(methodOverride("_method"));

app.use(
  session({
    secret: "our little secret.",
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false },
  })
);
app.use(cookieParser("process.env.SECRET_KEY"));
//initializing passport

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function (user, done) {
  done(null, user.id);
});
passport.deserializeUser(async function (id, done) {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      callbackURL: "http://localhost:8081/auth/google/secrets",
      // profileFields: ['id', 'displayName', 'photos', 'email']
    },

    function (accessToken, refreshToken, profile, cb) {
      const { _json } = profile;

      const user = {
        username: _json.name,
        email: _json.email,
        googleId: _json.sub,
      };

      User.findOrCreate(user, function (err, user) {
        // console.log(user);
        return cb(err, user);
      });
    }
  )
);

app.get(
  "/auth/google/secrets",
  passport.authenticate("google", {
    failureRedirect: "/login",
    session: false,
  }),
  (req, res) => {
    let { user } = req;

    // console.log(user._id,user.username,user.role,)

    const newUser = {
      _id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
    };

    const token = jwt.sign(newUser, "process.env.SECRET_KEY", {
      expiresIn: "2h",
    });

    res.cookie("token", token, {
      expires: new Date(Date.now() + 2 * 60 * 60 * 1000),
      httpOnly: true,
    });

    res.redirect("/");
  }
);

app.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

//facebook stratergy

passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.APP_ID,
      clientSecret: process.env.APP_SECRET,
      callbackURL: "http://localhost:8081/auth/facebook/callback",
      profileFields: ["id", "displayName", "photos", "email"],
    },
    function (accessToken, refreshToken, profile, cb) {
      const { _json } = profile;
      // console.log(profile._json);

      // console.log(_json);

      let newUser = {
        username: _json.name,
        fbId: _json.id,
        email: _json.email,
      };

      User.findOrCreate(newUser, function (err, user) {
        // console.log(profile);
        return cb(err, user);
      });
    }
  )
);

//fbroutes

app.get(
  "/auth/facebook",
  passport.authenticate("facebook", { scope: ["email"] })
);

app.get(
  "/auth/facebook/callback",
  passport.authenticate("facebook", {
    failureRedirect: "/login",
    session: false,
  }),
  function (req, res) {
    let { user } = req;

    let newUser = {
      _id: user._id,
      email: user.email,
      fbId: user.fbId,
      role: user.role,
    };

    const token = jwt.sign(newUser, "process.env.SECRET_KEY");

    res.cookie("token", token, {
      expires: new Date(Date.now() + 2 * 60 * 60 * 1000),
      httpOnly: true,
      // signed: true
    });

    res.redirect("/");
  }
);

// to seed the db
// seedDB();

app.use(productRoutes);
app.use(reviewRoutes);
app.use("*", (req, res) => {
  res.render("404");
});
app.listen(8081, () => {
  console.log(`listening on port ${PORT}`);
});
