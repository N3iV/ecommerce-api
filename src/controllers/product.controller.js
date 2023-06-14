const { CREATED, SuccessResponse } = require("../core/success.response");
const ProductService = require("../services/product.service");
const ProductServiceStrategy = require("../services/product.service.strategy");

class ProductController {
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
  publicProductByShop = async (req, res, next) => {
    console.log(req.params.id);
    new SuccessResponse({
      message: "Public product success",
      metadata: await ProductServiceStrategy.publicProductByShop({
        product_id: req.params.id,
        product_shop: req.user.userID,
      }),
    }).send(res);
  };
  searchProduct = async (req, res, next) => {
    console.log(req.params.id);
    new SuccessResponse({
      message: "Public product success",
      metadata: await ProductServiceStrategy.searchProduct(req.params),
    }).send(res);
  };
  getAllDraftsOfShop = async (req, res, next) => {
    new SuccessResponse({
      message: "Get draft products success",
      metadata: await ProductServiceStrategy.findAllDraftOfShop({
        product_shop: req.user.userID,
      }),
    }).send(res);
  };
  getAllPublicOfShop = async (req, res, next) => {
    new SuccessResponse({
      message: "Get public products success",
      metadata: await ProductServiceStrategy.findAllPublicsOfShop({
        product_shop: req.user.userID,
      }),
    }).send(res);
  };
}

module.exports = new ProductController();
