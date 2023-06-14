const { Types } = require("mongoose");
const { product } = require("../product.model");

const queryProduct = async ({ query, limit = 50, skip = 0 }) => {
  return await product
    .find(query)
    .populate("product_shop", "name email -_id")
    .sort({ updatedAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean()
    .exec();
};
const findAllDraftOfShop = async ({ query, limit = 50, skip = 0 }) => {
  return await queryProduct({ query, limit, skip });
};
const findAllPublicsOfShop = async ({ query, limit = 50, skip = 0 }) => {
  return await queryProduct({ query, limit, skip });
};

const searchProductByUser = async ({ keySearch }) => {
  const regexSearch = new RegExp(keySearch);
  const results = await product
    .find(
      {
        isPublic: true,
        $text: {
          $search: regexSearch,
        },
      },
      { score: { $meta: "textScore" } }
    )
    .sort({ score: { $meta: "textScore" } })
    .lean();
  console.log(results);
  return results;
};

const publicProductByShop = async ({ product_shop, product_id }) => {
  const foundShop = await product.findOne({
    product_shop,
    _id: product_id,
  });
  console.log(foundShop);
  if (!foundShop) return null;
  foundShop.isDraft = false;
  foundShop.isPublic = true;
  const { modifiedCount } = await product.updateOne(foundShop);
  return modifiedCount;
};

module.exports = {
  findAllDraftOfShop,
  publicProductByShop,
  findAllPublicsOfShop,
  searchProductByUser,
};
