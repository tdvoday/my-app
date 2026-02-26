// Import JWT module
const jwt = require("jsonwebtoken");

/**
 * AUTH MIDDLEWARE - Middleware để kiểm tra JWT token
 * - Kiểm tra authorization header có tồn tại không
 * - Extract token từ header (format: "Bearer <token>")
 * - Verify token bằng JWT_SECRET
 * - Nếu token hợp lệ, attach user info vào req.user
 * - Nếu token không hợp lệ, trả về lỗi 401
 */
exports.authMiddleware = (req, res, next) => {
  // Lấy authorization header từ request
  // Format: "Bearer <token>"
  const authHeader = req.headers.authorization;

  // Kiểm tra authorization header có tồn tại không
  if (!authHeader) {
    return res.status(401).json({ message: "No token provided" });
  }

  // Extract token từ header
  // Split "Bearer <token>" và lấy phần token [1]
  const token = authHeader.split(" ")[1];

  try {
    // Verify token bằng JWT_SECRET từ .env
    // Nếu token hợp lệ, jwt.verify() trả về decoded payload
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Lưu decoded payload (chứa id và role) vào req.user
    // Để các middleware/route handler tiếp theo có thể sử dụng
    req.user = decoded;

    // Gọi next() để tiếp tục xử lý request
    next();
  } catch (_error) {
    // Nếu token không hợp lệ (expire, signature không đúng, v.v.)
    // Trả về lỗi 401 Unauthorized
    res.status(401).json({ message: "Invalid token" });
  }
};
