//Import auth file
let auth = require('../authConfig/auth')
let router = require('express').Router();
const {check, validationResult} = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require('../model/user')
router.get('/', function (req, res) {
        res.json({
            status: 'API Its Working',
            message: 'Welcome to RESTHub crafted with love!',
        });
    });

//signup route
//check() is middleware used to validate the incoming data as per the field
router.post('/user/signup',[check("username", "Please enter valid username").not().isEmpty(),
check("email", "Please enter a valid email").isEmail(),
check("password", "Please enter a valid password").matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/, "i").isLength({ min: 8})
],
async (req, res) => {
    //validationresult function check the whether the any errors occured or not and return an object.
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(200).json({
            errors: errors.array(),
            msg:"Validation error"
        });
    }
    //get and assign db field values to constant
    const { username,email,password } = req.body;
    try {
        let user = await User.findOne({
            email
        });
        if (user) {
            return res.status(200).json({
                msg: "User Already Exists"
            });
        }

        user = new User({
            username,
            email,
            password
        });

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);

        await user.save();

        const payload = {
            user: {
                id: user.id
            }
        };

        jwt.sign(
            payload,
            "randomString", {
                expiresIn: 10000
            },
            (err, token) => {
                if (err) throw err;
                res.status(200).json({
                    token,
                    msg:"success"
                });
            }
        );
    } catch (err) {
        console.log(err.message);
        res.status(500).send("Error in Saving");
    }
}
);
//login route
router.post(
    "/login",
    [
      check("email", "Please enter a valid email").isEmail(),
      check("password", "Please enter a valid password").matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/, "i").isLength({ min: 8})
    ],
    // validationResult function checks whether any error occurs or not and return an object
    async (req, res) => {
        // If some error occurs, then this block of code will run 
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(200).json({
          errors: errors.array(),
          message:"Incorrect Username or Password"
        });
      }
   // If no error occurs, then this  block of code will run 
      const { email, password } = req.body;
      try {
        let user = await User.findOne({
          email
        });
        if (!user)
          return res.status(200).json({
            message: "User Not Exist",
            status:"error"
          });
  
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch)
          return res.status(200).json({
            message: "Incorrect Password !",
            status:"error"
          });
  
        const payload = {
          user: {
            id: user.id
          }
        };
  
        jwt.sign(
          payload,
          "randomString",
          {
            expiresIn: 3600
          },
          (err, token) => {
            if (err) throw err;
            res.status(200).json({
              token,
              status:"success"
            });
          }
        );
      } catch (e) {
        console.error(e);
        res.status(500).json({
          message: "Server Error"
        });
      }
    }
);  


//get user
router.get('/userDetail', auth, 
async(req,res) =>{
    try{
        let user = await User.findById(req.user.id)
        res.json(user);
    }
    catch (e) {
        res.send({ message: "Error in Fetching user" });
      }
}
)
// Export API routes
module.exports = router;    