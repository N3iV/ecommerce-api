const HEADER = {
  API_KEY: "x-api-key",
  AUTHORIZATION: "authorization",
};

const { findById } = require("../services/apiKey.service");

const apiKey = async (req, res, next) => {
  try {
    const key = req.headers[HEADER.API_KEY];
    console.log(key, "key");
    if (!key) {
      return res.status(403).json({
        message: "Forbidden error",
      });
    }
    const objKey = await findById(key);
    console.log(objKey, "objKey");
    if (!objKey) {
      return res.status(403).json({
        message: "Forbidden error",
      });
    }
    req.objKey = objKey;
    return next();
  } catch (error) {}
};

const permission = (_permission) => {
  return (req, res, next) => {
    try {
      const { objKey } = req;
      if (!objKey.permission) {
        return res.status(403).json({
          message: "Permission denied",
        });
      }
      const validPermission = objKey.permission.includes(_permission);
      if (!validPermission) {
        return res.status(403).json({
          message: "Permission denied",
        });
      }
      return next();
    } catch (error) {}
  };
};

const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = {
  apiKey,
  permission,
  asyncHandler,
};
