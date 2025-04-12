const jwt = require("jsonwebtoken");

function authMiddleware(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Acceso denegado" });

  try {
    const decoded = jwt.verify(token, "clavesecreta123");
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ error: "Token no valido" });
  }
}

module.exports = authMiddleware;