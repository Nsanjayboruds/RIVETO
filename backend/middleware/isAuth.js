import jwt from "jsonwebtoken";

const isAuth = (req, res, next) => {
  const { token } = req.cookies;
  console.log("🍪 Cookie Token:", token);

  if (!token) {
    return res.status(401).json({ message: "Unauthorized: No token" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    console.log("✅ Authenticated user:", req.userId);
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

export default isAuth;
