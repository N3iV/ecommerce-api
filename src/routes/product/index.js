const express = require("express");
const productController = require("../../controllers/product.controller");
const asyncHandler = require("../../helpers/asyncHandler");
const { authenticationv2 } = require("../../auth/authUtils");

const router = express.Router();

router.use(authenticationv2);

router.post("", asyncHandler(productController.createProduct));
router.get("/drafts", asyncHandler(productController.getAllDraftsOfShop));

module.exports = router;
