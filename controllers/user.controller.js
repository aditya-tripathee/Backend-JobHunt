import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";



export const regsiterUser = async (req, res) => {
  try {
    const { fullName, email, phoneNumber, password, role } = req.body;
    const photo = req.file; // multer se uploaded file

    // console.log({ fullName, email, phoneNumber, password, role, photo });

    if (!fullName || !email || !phoneNumber || !password || !role) {
      return res.status(400).json({
        message: "Missing required fields",
        success: false,
      });
    }
    // is already user with same email
    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({
        message: "User already exists!",
        success: false,
      });
    }

    // convert password to hashes
    const hashPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      fullName,
      email ,
      phoneNumber,
      password: hashPassword,
      role 
    });

    await newUser.save();

    return res.status(201).json({
      message: `Account register successfully ${fullName}!`,
      success: true,
      user: newUser,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Server problem",
      success: false,
      error,
    });
  }
};


export const login = async (req, res) => {
  try {
    const {email,password,role} = req.body;
    if(!email || !password || !role){
        return res.status(400).json({
            message:"Missing required fields",
            success:false
        })
    };

    let user = await User.findOne({email});
    if(!user){
        return res.status(400).json({
            message:"Incorrect email or password",
            success:false
        })
    }
    
    // compare password 

    const isMatch = await bcrypt.compare(password,user.password);
    if(!isMatch){
        return res.status(400).json({
            message:"Incorrect password",
            success:false
        })
    };

    // check role
    if(user.role !== role){
        return res.status(403).json({
            message:"You don't have permission to access this resource",
            success:false
        })
    };

    // token generation 
    const tokenData = {
        userId : user._id,

    };

      user = {
        _id : user._id,
        fullName : user.fullName,
        email : user.email,
        phoneNumber : user.phoneNumber,
        role : user.role,
        profile : user.profile
    };


    const token = await jwt.sign(tokenData,process.env.SECRET_KEY,{
        expiresIn:"3d",
    });

    return res.status(200).cookie("token",token,{
        maxAge:3*24*60*60*1000,
        httpOnly:true,
        sameSite : "strict",
    }).json({
        message:`Welcome back ${user.fullName}`,
        user,
        success:true,

    });

  
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Server problem",
      success: false,
      error,
    });
  }
};


export const logout = async(req,res)=>{
    try {
        return res.status(200).cookie("token","",{
            maxAge:0
        }).json({
            message:"Logged out successfully!",
            success:true
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message:"Server problem",
            success:false
        })
    }
}


export const updateProfile = async(req,res)=>{
    try {
        const {fullName,email,phoneNumber,bio,skills} = req.body;
        const file = req.file;

        // if(!fullName || !email || !phoneNumber || !bio || !skills){
        //     return res.status(200).json({
        //         message:"Missing required fields",
        //         success:false
        //     })
        // };
         
        
        // cloudinary upload 



    


        const userId = req.id;  // middlewares authentication 
        let user = await User.findById(userId);
        if(!user){
            return res.status(404).json({
                message:"User not found!",
                success:false
            })
        };
        
        // resume 
        let skillsArray;
        
        if(fullName){
          user.fullName = fullName;
        }

        if(email){
          user.email = email;
        }

        if(phoneNumber){
          user.phoneNumber = phoneNumber;
        }
        
        if(bio){
          user.profile.bio = bio;
        }
        
        if(skills){
          const skillsArray = skills.split(",");
          user.profile.skills = skillsArray;
        }



        await user.save();


        user = {
         _id : user._id,
         fullName : user.fullName,
         email : user.email,
         phoneNumber : user.phoneNumber,
         role : user.role,
         profile : user.profile,
         bio : user.bio
        
       };

      return res.status(200).json({
        message:"User profile updated successfully!",
        user,
        success:true
      });
      

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message:"Server problem",
            success:false
        })
    }
}

