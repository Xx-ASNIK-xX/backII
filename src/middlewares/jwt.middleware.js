import jwt from 'jsonwebtoken';

export const authJwt = (req, res, next) => {
  try {
    const token = req.signedCookies.currentUser;
    if (!token) {
      return res.redirect('/users/login');
    }
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = payload;
    next();
  } catch (error) {
    return res.redirect('/users/login');
  }
};

// Redirect authenticated users away from login/register views
export const forwardAuthenticated = (req, res, next) => {
    const token = req.signedCookies.currentUser;
    if (!token) {
        return next();
    }
    try {
        jwt.verify(token, process.env.JWT_SECRET);
        return res.redirect('/users/current');
    } catch (error) {
        return next();
    }
}; 