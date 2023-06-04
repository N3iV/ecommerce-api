const { CREATED, SuccessResponse } = require("../core/success.response");
const ProductService = require("../services/product.service");
const ProductServiceStrategy = require("../services/product.service.strategy");

class ProductController {
  // createProduct = async (req, res, next) => {
  //   new SuccessResponse({
  //     message: "Create product success",
  //     metadata: await ProductService.createProduct(req.body.product_type, {
  //       ...req.body,
  //       product_shop: req.user.userID,
  //     }),
  //   }).send(res);
  // };
  createProduct = async (req, res, next) => {
    new SuccessResponse({
      message: "Create product success",
      metadata: await ProductServiceStrategy.createProduct(
        req.body.product_type,
        {
          ...req.body,
          product_shop: req.user.userID,
        }
      ),
    }).send(res);
  };
}

module.exports = new ProductController();
