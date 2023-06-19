const {
  product,
  clothing,
  electronic,
  furniture,
} = require("../models/product.model");
const {
  BadRequestError,
  AuthFailureError,
  ForbiddenError,
} = require("../core/error.respose");
const {
  findAllDraftOfShop,
  findAllPublicsOfShop,
  publicProductByShop,
  searchProductByUser,
  unPublicProductByShop,
  findProducts,
  findProduct,
} = require("../models/repositories/product.repo");
class ProductFactory {
  static projectRegistry = {};

  static registryProductType(type, classRef) {
    ProductFactory.projectRegistry[type] = classRef;
  }

  static async createProduct(type, payload) {
    const productClass = ProductFactory.projectRegistry[type];
    if (!productClass)
      throw new BadRequestError(`Invalid product type ${type}`);

    return new productClass(payload).createProduct();
  }

  static async publicProductByShop({ product_shop, product_id }) {
    return await publicProductByShop({ product_id, product_shop });
  }
  static async unPublicProductByShop({ product_shop, product_id }) {
    return await unPublicProductByShop({ product_id, product_shop });
  }
  static async searchProduct({ keySearch }) {
    return await searchProductByUser({ keySearch });
  }

  static async findProducts({
    limit = 50,
    sort = "ctime",
    page = 1,
    filter = { isPublic: true },
  }) {
    return await findProducts({
      limit,
      sort,
      page,
      filter,
      select: ["product_name", "product_price", "product_thumb"],
    });
  }

  static async findProduct({ product_id }) {
    console.log(product_id);
    return await findProduct({
      product_id,
      unSelect: ["__v", "product_variations"],
    });
  }

  static async findAllDraftOfShop({ product_shop, limit = 50, skip = 0 }) {
    const query = {
      product_shop,
      isDraft: true,
    };
    return await findAllDraftOfShop({ query, limit, skip });
  }
  static async findAllPublicsOfShop({ product_shop, limit = 50, skip = 0 }) {
    const query = {
      product_shop,
      isPublic: true,
    };
    return await findAllPublicsOfShop({ query, limit, skip });
  }
}

class Product {
  constructor({
    product_name,
    product_thumb,
    product_description,
    product_price,
    product_quantity,
    product_type,
    product_shop,
    product_attributes,
  }) {
    this.product_name = product_name;
    this.product_thumb = product_thumb;
    this.product_description = product_description;
    this.product_price = product_price;
    this.product_quantity = product_quantity;
    this.product_type = product_type;
    this.product_shop = product_shop;
    this.product_attributes = product_attributes;
  }
  async createProduct(productID) {
    const newProduct = await product.create({ ...this, _id: productID });
    return newProduct;
  }
}

class Clothing extends Product {
  async createProduct() {
    const newClothing = await clothing.create({
      ...this.product_attributes,
      product_shop: this.product_shop,
    });
    if (!newClothing) throw new BadRequestError("Can not create clothing");
    const newProduct = await super.createProduct(newClothing._id);

    if (!newProduct) throw new BadRequestError("Can not create Product");
    return newProduct;
  }
}
class Electronics extends Product {
  async createProduct() {
    const newElectronic = await electronic.create({
      ...this.product_attributes,
      product_shop: this.product_shop,
    });
    if (!newElectronic) throw new BadRequestError("Can not create clothing");
    const newProduct = await super.createProduct(newElectronic._id);

    if (!newProduct) throw new BadRequestError("Can not create Product");
    return newProduct;
  }
}
class Furniture extends Product {
  async createProduct() {
    const newFurniture = await furniture.create({
      ...this.product_attributes,
      product_shop: this.product_shop,
    });
    if (!newFurniture) throw new BadRequestError("Can not create furniture");
    const newProduct = await super.createProduct(newFurniture._id);
    if (!newProduct) throw new BadRequestError("Can not create Product");
    return newProduct;
  }
}

ProductFactory.registryProductType("Electronics", Electronics);
ProductFactory.registryProductType("Clothing", Clothing);
ProductFactory.registryProductType("Furniture", Furniture);

module.exports = ProductFactory;
