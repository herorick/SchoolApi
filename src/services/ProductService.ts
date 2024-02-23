import { IProduct, Product } from "../models";
import { NotFound } from "../utilities";
import { get } from "lodash";

class ProductService {
  static getProductId = (product: IProduct) => {
    return get(product, "id");
  }
  static findProductById = async (productId: string): Promise<IProduct> => {
    const product = await Product.findById(productId);
    if (!product) {
      throw new NotFound("product not found with id = " + productId);
    } else {
      return product;
    }
  };
  static findProductByIds = async (
    productIds: string[]
  ): Promise<IProduct[]> => {
    const products = await Product.find().where("_id").in(productIds).exec();
    return products;
  };
}

export { ProductService };
