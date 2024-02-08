const User = require('../../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('../../utils/config')
const randomstring = require('randomstring');

const SECRET_KEY = config.SECRET_KEY;

const getTokenFrom = (request) => {
    const authHeader = request.header('Authorization');
    return authHeader;
}

const userController = {

    //Signup and generate activation link with token
    signup: async (req, res) => {
        try {
            const { name, email, password } = req.body;
            console.log(name, email)
            //check if the user already exists
            const existingUser = await User.findOne({ email });

            if (existingUser) {
                return res.status(409).json({ message: 'User already exists' });
            }

            //create randomstring for account activation                  
            let token = randomstring.generate({
                length: 16,
                charset: "alphanumeric",
            });

            //creating expiry after 1 hour
            let expiry = new Date(Date.now() + 3600 * 1000);

            //hash the password before savingg
            const hashedPassword = await bcrypt.hash(password, 10);

            //create new USer

            const newUser = new User({
                name,
                email,
                password: hashedPassword,
                resetExpiry: expiry,
                resetToken: token,
            });

            //save the user
            await newUser.save();

            res.status(201).json({ message: "Account has been created successfully" });

        }
        catch (error) {
            console.error('Error sending link to Email', error)
            // res.status(500).json({message:'Activation Error'})
        }
    },

    //Signin process and generate JWT Token
    signin: async (req, res) => {
        try {
            // console.log("ENTERED")
            const { email, password } = req.body;

            //find the user by email
            const user = await User.findOne({ email });

            if (!user) {
                return res.status(401).json({ message: 'Authentication Failed' });
            }
            //compare passwords

            const passwordMatch = await bcrypt.compare(password, user.password);

            if (!passwordMatch) {
                return res.status(401).json({ message: 'Authentication Failed' });
            }

            //generate and send the jwt token 

            const token = jwt.sign({ userId: user._id }, SECRET_KEY, { expiresIn: '1h' });
            res.json({ token });
        }
        catch (error) {
            console.log('Error signing in user', error);
            res.status(500).json({ message: 'Internal Server error' });
        }
    },


    //To get the ID of User
    getUserID: async (req, res) => {
        try {
            const token = getTokenFrom(req);
            // decode the token to authorize the user
            const decodedToken = jwt.verify(token, SECRET_KEY);
            // if the token is not valid, return an error
            if (!decodedToken) {
                return response.json({ message: 'token invalid' });
            }
            const user = await User.findById(decodedToken.userId).exec();
            const user_ID = user._id
            const user_name = user.name
            res.status(200).json({ user_ID, user_name })

        }
        catch (error) {
            console.error('Error in Fetching User ID', error)
            res.status(500).json({ message: 'Error in Fetching User ID' })
        }
    },

}

module.exports = userController;