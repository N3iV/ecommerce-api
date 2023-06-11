const JWT = require("jsonwebtoken");
const asyncHandler = require("../helpers/asyncHandler");
const { AuthFailureError, NotFoundError } = require("../core/error.respose");
const { findByUserID } = require("../services/keyToken.service");

const HEADER = {
  API_KEY: "x-api-key",
  CLIENT_ID: "x-client-id",
  AUTHORIZATION: "authorization",
  REFRESHTOKEN: "x-rtoken-id",
};

const createTokenPair = async (payload, publicKey, privateKey) => {
  try {
    const accessToken = await JWT.sign(payload, publicKey, {
      expiresIn: "2 days",
    });
    const refreshToken = await JWT.sign(payload, privateKey, {
      expiresIn: "7 days",
    });

    JWT.verify(accessToken, publicKey, (err, decoded) => {
      if (err) {
        console.log("err", err);
      }
      console.log("decoded", decoded);
    });

    return { accessToken, refreshToken };
  } catch (error) {}
};

const authentication = asyncHandler(async (req, res, next) => {
  const userID = req.headers[HEADER.CLIENT_ID];
  if (!userID) throw new AuthFailureError("Invalid request");
  const keyStore = await findByUserID(userID);
  if (!keyStore) throw new NotFoundError("Not found key store");

  const accessToken = req.headers[HEADER.AUTHORIZATION];

  if (!accessToken) throw new AuthFailureError("Invalid request");
  try {
    const decodeUser = JWT.verify(accessToken, keyStore.publicKey);
    if (userID !== decodeUser.userID)
      throw new AuthFailureError("Invalid User ID");

    req.keyStore = keyStore;
    return next();
  } catch (error) {
    throw error;
  }
});

const authenticationv2 = asyncHandler(async (req, res, next) => {
  const userID = req.headers[HEADER.CLIENT_ID];
  if (!userID) throw new AuthFailureError("Invalid request");
  const keyStore = await findByUserID(userID);
  if (!keyStore) throw new NotFoundError("Not found key store");

  if (req.headers[HEADER.REFRESHTOKEN]) {
    try {
      const refreshToken = req.headers[HEADER.REFRESHTOKEN];
      const decodeUser = JWT.verify(refreshToken, keyStore.privateKey);
      if (userID !== decodeUser.userID)
        throw new AuthFailureError("Invalid User ID");

      req.keyStore = keyStore;
      req.user = decodeUser;
      req.refreshToken = refreshToken;
      return next();
    } catch (error) {
      throw error;
    }
  }

  const accessToken = req.headers[HEADER.AUTHORIZATION];

  if (!accessToken) throw new AuthFailureError("Invalid request");
  try {
    const decodeUser = JWT.verify(accessToken, keyStore.publicKey);
    if (userID !== decodeUser.userID)
      throw new AuthFailureError("Invalid User ID");

    req.keyStore = keyStore;
    return next();
  } catch (error) {
    throw error;
  }
});

const verifyJWT = async (token, keySecret) => {
  return await JWT.verify(token, keySecret);
};

module.exports = {
  createTokenPair,
  authentication,
  authenticationv2,
  verifyJWT,
};
