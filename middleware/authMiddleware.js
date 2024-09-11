const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
  let token = req.header('authorization');
  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }
  if (token.startsWith('Bearer ')) {
    token = token.slice(7, token.length).trimLeft();
  }
  console.log(token)
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Token is not valid' });
  }
};
