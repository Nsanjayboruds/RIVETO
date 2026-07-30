import { randomUUID } from "crypto";

const requestId = (req, res, next) => {
  req.id = randomUUID();
  res.setHeader("X-Request-Id", req.id);
  next();
};

export default requestId;