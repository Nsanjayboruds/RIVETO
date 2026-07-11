export const requestIdMiddleware = (req, res, next) => {
  const requestId = req.headers["x-request-id"] || 
    `req_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
  
  req.requestId = requestId;
  res.setHeader("X-Request-ID", requestId);
  next();
};