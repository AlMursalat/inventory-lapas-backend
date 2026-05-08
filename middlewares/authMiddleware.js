import jwt from "jsonwebtoken";

const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        message: "Token tidak ada",
      });
    }

    const token = authHeader.split(" ")[1];

    jwt.verify(
      token,
      process.env.JWT_SECRET,
      (err, decoded) => {
        if (err) {
          return res.status(401).json({
            message: "Token tidak valid",
          });
        }

        req.user = decoded;

        next();
      }
    );
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

export default authMiddleware;