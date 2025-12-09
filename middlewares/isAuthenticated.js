import jwt from "jsonwebtoken";


const authenticateToken = async(req,res,next)=>{
    try {
      const token = req.cookies.token;
      if(!token){
        return res.status(400).json({
            message:"Token not found!",
            success:false
        })
      };
  // token decoed 
      const decoded = await jwt.verify(token,process.env.SECRET_KEY);
      if(!token){
        return res.status(400).json({
            message:"Token invalid",
            success:false
        })
      };
      
      req.id = decoded.userId;
      next();
      
      
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        message:"Invalid token",
        success:false
      })  
    }
}

export default authenticateToken;
