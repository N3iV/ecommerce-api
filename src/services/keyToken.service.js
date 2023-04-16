const keytokenModel = require("../models/keytoken.model");
const keyTokenModel = require("../models/keytoken.model");
const { Types } = require("mongoose");
class KeyTokenService {
  static createKeyToken = async ({
    userID,
    publicKey,
    privateKey,
    refreshToken,
  }) => {
    try {
      // const tokens = await keyTokenModel.create({
      //   user: userID,
      //   publicKey,
      //   privateKey,
      // });
      // return tokens ? tokens.publicKey : null;

      const filter = { user: userID };
      const update = {
        publicKey,
        privateKey,
        refreshTokenUsed: [],
        refreshToken,
      };
      const options = { upsert: true, new: true };
      const tokens = await keyTokenModel.findOneAndUpdate(
        filter,
        update,
        options
      );
      return tokens ? tokens.publicKey : null;
    } catch (error) {
      return error;
    }
  };

  static findByUserID = async (userID) => {
    return await keyTokenModel.findOne({ user: Types.ObjectId(userID) }).lean();
  };

  static removeKeyByID = async (userID) => {
    return await keytokenModel.removeKeyByID(userID);
  };
}
module.exports = KeyTokenService;
