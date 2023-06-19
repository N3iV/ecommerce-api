const { Types } = require("mongoose");
const { product } = require("../product.model");
const { getSelectData, getUnSelectData } = require("../../utils");

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

const findProducts = async ({ limit, sort, page, filter, select }) => {
  const skip = (page - 1) & limit;
  const sortBy = sort === "ctime" ? { _id: -1 } : { _id: 1 };
  const products = await product
    .find(filter)
    .sort(sortBy)
    .skip(skip)
    .limit(limit)
    .select(getSelectData(select))
    .lean();

  console.log(products);
  return products;
};

const findProduct = async ({ product_id, unSelect }) => {
  const result = await product
    .findById(product_id)
    .select(getUnSelectData(unSelect));
  return result;
};

const publicProductByShop = async ({ product_shop, product_id }) => {
  const foundShop = await product.findOne({
    product_shop,
    _id: product_id,
  });
  if (!foundShop) return null;
  foundShop.isDraft = false;
  foundShop.isPublic = true;
  const { modifiedCount } = await product.updateOne(foundShop);
  return modifiedCount;
};
const unPublicProductByShop = async ({ product_shop, product_id }) => {
  const foundShop = await product.findOne({
    product_shop,
    _id: product_id,
  });
  if (!foundShop) return null;
  foundShop.isDraft = true;
  foundShop.isPublic = false;
  const { modifiedCount } = await product.updateOne(foundShop);
  return modifiedCount;
};

module.exports = {
  findAllDraftOfShop,
  publicProductByShop,
  findAllPublicsOfShop,
  searchProductByUser,
  unPublicProductByShop,
  findProduct,
  findProducts,
};
