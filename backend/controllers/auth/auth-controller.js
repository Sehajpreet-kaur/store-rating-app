const User = require("../../models/User");
const jwt = require("jsonwebtoken")

const generateAccessToken = (user) =>
  jwt.sign(
    { id: user.id, role: user.role, email: user.email, name: user.name },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );

// The JWT lives in an httpOnly cookie: JavaScript on the page can never read it (XSS-safe).
const COOKIE_NAME = "token";
const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production", // HTTPS only in production
  sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  maxAge: 24 * 60 * 60 * 1000, // 1 day, same as the JWT expiry
  path: "/",
};

const registerUser = async(req,res)=>{
    const {name, email, password,address}= req.body

    try{
        const existingUser= await User.findOne({where : {email}})
        if(existingUser){
            return res.status(400).json({
                success:false, message: 'User already exists with this email. Please try again.'
            })
        }
        const newUser= await User.create({
            name,
            email,
            password,
            address,
            role:'normal'
        })
        return res.status(201).json({
            success:true, message: "Registration Successful.", user:{
                id:newUser.id,
                name: newUser.name,
                email: newUser.email,
                role: newUser.role
            }
        })
    }
    catch(e){
        console.error(e);
        return res.status(500).json({ success: false, message: "Some error occurred" });
    }
}

const loginUser= async(req,res)=>{
    const {email, password}=req.body;

    try{
        const existingUser= await User.findOne({where :{ email}})
        if(!existingUser){
            return res.status(401).json({
                success:false, message: "Invalid email or password."
            })
        }

        const passwordMatch= await existingUser.comparePassword(password)
        if(!passwordMatch){
            return res.status(401).json({
                success:false, message: "Invalid email or password."
            })
        }

        const token= generateAccessToken(existingUser)

        res.cookie(COOKIE_NAME, token, cookieOptions)

        return res.status(200).json({
            success:true, message: "Login successful!",
            user:({
                id:existingUser.id,
                name:existingUser.name,
                email:existingUser.email,
                role:existingUser.role
            })
        })
    }catch(e){
        console.log("error",e)
        return res.status(500).json({
            success:false, message:"Some error occured."
        })
    }
}

// PUT /api/auth/password  { oldPassword, newPassword }  (any logged-in role)
const updatePassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  try {
    const user = await User.findByPk(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found." });
    }

    const matches = await user.comparePassword(oldPassword);
    if (!matches) {
      return res.status(400).json({ success: false, message: "Current password is incorrect." });
    }

    if (oldPassword === newPassword) {
      return res.status(400).json({ success: false, message: "New password must be different from the current one." });
    }

    // The model's beforeUpdate hook re-hashes because `password` changed.
    user.password = newPassword;
    await user.save();

    return res.status(200).json({ success: true, message: "Password updated successfully." });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ success: false, message: "Some error occurred" });
  }
};

const logoutUser = (req, res) => {
  // Options (except maxAge) must match the ones used when the cookie was set.
  const { maxAge, ...clearOptions } = cookieOptions;
  res.clearCookie(COOKIE_NAME, clearOptions);
  res.status(200).json({ success: true, message: "Logged out successfully" });
};

// Verifies the Bearer token and attaches the decoded payload to req.user.
const verifyToken = (req, res, next) => {
  // Prefer the httpOnly cookie; fall back to a Bearer header (handy for Postman/tests).
  const authHeader = req.headers.authorization;
  const token =
    req.cookies?.[COOKIE_NAME] ||
    (authHeader?.startsWith("Bearer ") ? authHeader.split(" ")[1] : null);

  if (!token) {
    return res.status(401).json({ success: false, message: "No token provided" });
  }
 
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch (e) {
    return res.status(401).json({ success: false, message: "Invalid or expired token" });
  }
};
 
//  Pass one or more allowed roles:
//   requireRole("admin")
//   requireRole("admin", "store_owner")
const requireRole = (...allowedRoles) => (req, res, next) => {
  if (!req.user || !allowedRoles.includes(req.user.role)) {
    return res.status(403).json({ success: false, message: "Access denied" });
  }
  next();
};
 
module.exports = {loginUser,registerUser,logoutUser,updatePassword,verifyToken,requireRole}