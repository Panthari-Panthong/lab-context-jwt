const router = require("express").Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/User.model");
const isAuthenticated = require("../middlewares/isAuthenticated");

router.post("/signup", async (req, res, next) => {
  /* Get back the payload from your request, as it's a POST you can access req.body */
  const { email, password } = req.body;

  if (email === "" || password === "") {
    res.status(400).json({ message: "Provide email, password and name" });
    return;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  if (!emailRegex.test(email)) {
    res.status(400).json({ message: "Provide a valid email address." });
    return;
  }

  const passwordRegex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
  if (!passwordRegex.test(password)) {
    res.status(400).json({
      message:
        "Password must have at least 6 characters and contain at least one number, one lowercase and one uppercase letter.",
    });
    return;
  }

  try {
    const foundUser = await User.findOne({ email });

    if (foundUser) {
      res.status(400).json({ message: "User already exists." });
      return;
    }

    /* Hash the password using bcryptjs */
    const saltRounds = 10;
    const salt = bcrypt.genSaltSync(saltRounds);
    const hashedPassword = bcrypt.hashSync(password, salt);

    /* Record your user to the DB */
    await User.create({
      email,
      password: hashedPassword,
    });
    res.status(201).json({ message: "Pinging signup" });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.post("/login", async (req, res, next) => {
  /* Get back the payload from your request, as it's a POST you can access req.body */
  const { email, password } = req.body;

  if (email === "" || password === "") {
    res.status(400).json({ message: "Provide email and password." });
    return;
  }
  try {
    /* Try to get your user from the DB */
    const foundUser = await User.findOne({ email });

    /* If your user exists, check if the password is correct */
    if (!foundUser) {
      // If the user is not found, send an error response
      res.status(401).json({ message: "User not found." });
      return;
    }

    /* If your password is correct, sign the JWT using jsonwebtoken */
    const passwordCorrect = bcrypt.compareSync(password, foundUser.password);

    if (passwordCorrect) {
      const { _id, email, name } = foundUser;
      const payload = { _id, email, name };

      const authToken = jwt.sign(
        {
          expiresIn: "6h",
          user: payload, // Put yhe data of your user in there
        },
        process.env.TOKEN_SECRET,
        {
          algorithm: "HS256",
        }
      );
      res.status(200).json({ authToken: authToken });
    } else {
      res.status(401).json({ message: "Unable to authenticate the user" });
    }
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.get("/verify", isAuthenticated, (req, res, next) => {
  // You need to use the middleware there, if the request passes the middleware, it means your token is good
  res.status(200).json(req.payload);
});

module.exports = router;
