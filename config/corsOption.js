const allowedOrigins = [
  "http://localhost:3000",
  "https://medipay.onrender.com"
];

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true
};

module.exports = corsOptions;