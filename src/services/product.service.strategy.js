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
    return await product.create({ ...this, _id: productID });
  }
}

class Clothing extends Product {
  async createProduct() {
    const newClothing = await clothing.create({
      ...this.product_attributes,
      product_shop: this.product_shop,
    });
    if (!newClothing) throw new BadRequestError("Can not create clothing");
    const newProduct = await super.createProduct();

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
class Furnitures extends Product {
  async createProduct() {
    const newFurniture = await furniture.create({
      ...this.product_attributes,
      product_shop: this.product_shop,
    });
    console.log(newFurniture, "newFurniture");
    if (!newFurniture) throw new BadRequestError("Can not create furniture");
    const newProduct = await super.createProduct(newFurniture._id);
    console.log(newProduct, "new Product");
    if (!newProduct) throw new BadRequestError("Can not create Product");
    return newProduct;
  }
}

ProductFactory.registryProductType("Electronics", Electronics);
ProductFactory.registryProductType("Clothing", Clothing);
ProductFactory.registryProductType("Furniture", Furnitures);

module.exports = ProductFactory;
