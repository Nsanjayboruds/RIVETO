const getCorsOrigins = () => {
  const origins = [];

  if (process.env.CORS_ORIGINS) {
    origins.push(...process.env.CORS_ORIGINS.split(",").map((o) => o.trim()));
  }

  if (process.env.CORS_ORIGIN_ADMIN) {
    origins.push(process.env.CORS_ORIGIN_ADMIN.trim());
  }

  if (process.env.CORS_ORIGIN_FRONTEND) {
    origins.push(process.env.CORS_ORIGIN_FRONTEND.trim());
  }

  if (origins.length === 0) {
    return [
      "https://riveto-frontend2.onrender.com",
      "https://riveto-admin4.onrender.com",
      "http://localhost:5173",
      "http://localhost:5174",
    ];
  }

  return [...new Set(origins)];
};

export const corsOptions = {
  origin: getCorsOrigins(),
  credentials: true,
};

export const socketCorsOptions = {
  cors: {
    origin: getCorsOrigins(),
    credentials: true,
  },
};