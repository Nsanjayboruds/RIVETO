import jwt from "jsonwebtoken";

export const genToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "7d"
  });
}

export const genToken1=async(email) => {
  try {
    let token =await jwt.sign({email}, process.env.JWT_SECRET, {expiresIn: "7d"});
    return token;
  } catch (error) {
    console.log("token error");
    
  }
}