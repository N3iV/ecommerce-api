const express = require("express");
const productController = require("../../controllers/product.controller");
const asyncHandler = require("../../helpers/asyncHandler");
const { authenticationv2 } = require("../../auth/authUtils");

const router = express.Router();

router.get("/", asyncHandler(productController.getProducts));
router.get("/:id", asyncHandler(productController.getProductByID));
router.get("/search/:keySearch", asyncHandler(productController.searchProduct));

router.use(authenticationv2);

router.post("", asyncHandler(productController.createProduct));
router.post(
  "/publish/:id",
  asyncHandler(productController.publicProductByShop)
);
router.post(
  "/unpublish/:id",
  asyncHandler(productController.unPublicProductByShop)
);
router.get("/drafts", asyncHandler(productController.getAllDraftsOfShop));
router.get("/publishes", asyncHandler(productController.getAllPublicOfShop));

module.exports = router;
