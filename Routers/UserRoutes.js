import express from "express";
import {
  userSigUp,
  getUserSignUp,
  generateJwtToken,
  setStringDb,
  getRandomString,
  getTokenPassReset,
  changePassword,
  removePassReset,
  getPizzaDataById
} from "../Controllers/PizzaControl.js";
import bcrypt from "bcrypt";
import Randomstring from "randomstring";
import nodemailer from "nodemailer"
import dotenv from "dotenv"

dotenv.config();

const router = express.Router();

router.post("/signup", async (req, res) => {
  try {
    const user = await getUserSignUp(req.body.email);
    if (!user) {
      const salt =await bcrypt.genSalt(10);
      const hashedPassword =await bcrypt.hash(req.body.password, salt);
      req.body.password = hashedPassword.toString();
      const result = userSigUp(req.body);
      return res.status(200).json({ result, data: "Data added successfully" });
    }
    res.status(400).json({ data: "Given user already exist" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ data: "Internal server error" });
  }
});

router.post("/signin", async (req, res) => {
  try {
    const user = await getUserSignUp(req.body.email);
    if (!user) {
      return res.status(400).json({ data: "Invalid Email" });
    }
    const validPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!validPassword) {
      return res.status(400).json({ data: "Invalid Password" });
    }
    const token = generateJwtToken(user._id);
    res.status(200).json({
      data: {
        message: "Successfully logged in",
        token: token,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ data: "Internal server error" });
  }
});

router.post("/forgotpassword",async(req,res)=>{
try {
  const userEmail=await getUserSignUp(req.body.email);
  if(userEmail){
   let randstring=Randomstring.generate({
    length: 12,
    charset: 'alphabetic'
  });
  const token=generateJwtToken(randstring);
  let value={
    email:req.body.email,
    token:token,
    random_string:randstring
  }
 const setString=setStringDb(value)
 var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: `${process.env.MAIL_ID}`,
    pass: `${process.env.PASSWORD}`
  }
});

var mailOptions = {
  from:`${process.env.MAIL_ID}`,
  to: `${userEmail.email}`,
  subject: 'Reset pizza site password',
  text:  `Please use the OTP to reset your Password : ${randstring}`,
};

transporter.sendMail(mailOptions, function(error, info){
  if (error) {
    console.log(error);
  } else {
    res.status(200).json({data:{
      message:"OTP send successfully",
      token:token
    }})
  }
});
  }
  else{
    res.status(400).json({data:"Invalid Email"});
  }
} catch (error) {
  console.log(error);
  res.status(500).json({data:"Internal server error"});
}
})

router.post("/otp-confirm",async(req,res)=>{
  try {
    const ranstring=await getRandomString(req.body.random_string);
if(ranstring?.random_string==req.body?.random_string){
   res.status(200).json({data:"Enter reset password"})
}else{
  res.status(400).json({data:"Invalid OTP"});
}
  } catch (error) {
    console.log(error);
    res.status(500).json({data:"Internal server error"});
  }
})

router.put("/change-password",async(req,res)=>{
  try {
    let {token,pass}=req.body;
    const salt=await bcrypt.genSalt(10);
    const hashedPassword=await bcrypt.hash(pass,salt)
    pass= hashedPassword;
    const emailval=await getTokenPassReset(token);
    const getUser=await getUserSignUp(emailval.email)
    if(!getUser){
      res.status(500).json({data:"Internal server Error"});
      return;
    }
    const changePass=await changePassword(getUser.email,pass)
    const removepasrest=await removePassReset(token)
    res.status(200).json({data:"Password changed successfully"});
  } catch (error) {
    console.log(error);
    res.status(500).json({data:"Internal server error"});
  }

})

export const userRouter = router;
