import { NextFunction, Request, Response } from "express";
import { NotFound } from "utilities";
import asyncHandler from "express-async-handler";
import { Brand, Product, ProductCategory, Vendor } from "models";
import difference from "lodash/difference";

export const GetProducts = asyncHandler(async (req: Request, res: Response) => {
  res.json(res.paginatedData);
});

export const GetProductById = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const product = await Product.findById(id);
    res.json({ product });
  }
);

export const CreateProduct = asyncHandler(
  async (req: Request, res: Response) => {
    const { user, body, files } = req;
    const { name, brand = null, description, price, productCategories } = body;
    const vendor = await Vendor.findOne({ email: user?.email });
    if (!vendor) throw new NotFound("Vendor not found by email: " + user?.name);
    const images = files as [Express.Multer.File];
    const imageNames = images.map((file) => file.filename);
    const createdProduct = await Product.create({
      name,
      brand,
      description,
      price,
      vendor: user?.id,
      rating: 0,
      images: imageNames,
      productCategories,
    });
    await ProductCategory.updateMany(
      { _id: productCategories },
      { $push: { products: createdProduct._id } }
    );
    await Brand.findByIdAndUpdate(brand, {
      $push: { products: createdProduct._id },
    });
    vendor.products.push(createdProduct);
    await vendor.save();
    res.json({ result: createdProduct });
  }
);

export const UpdateProduct = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const { name, brand, description, price, productCategories } = req.body;
    const oldProduct = await Product.findById(id);
    const oldBrand = oldProduct?.brand;
    const oldCategories = oldProduct!.productCategories;
    if (!oldProduct) throw new NotFound();
    Object.assign(oldProduct, {
      name,
      brand,
      description,
      price,
      productCategories,
    });
    const newProduct = await oldProduct.save();
    const added = difference(productCategories, oldCategories);
    const removed = difference(oldCategories, productCategories);
    await ProductCategory.updateMany(
      { _id: added },
      { $addToSet: { products: id } }
    );
    await ProductCategory.updateMany(
      { _id: removed },
      { $pull: { products: id } }
    );
    if (oldBrand) {
      // Remove product from old Brand
      await Brand.findByIdAndUpdate(
        { _id: oldBrand },
        {
          $pull: { products: id },
        }
      );
    }
    // Add product from new Brand
    await Brand.findByIdAndUpdate(
      { _id: brand },
      {
        $push: { products: id },
      }
    );

    res.json(newProduct);
  }
);

export const DeleteProduct = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const product = await Product.findById(id);
    if (!product) throw new NotFound();
    await product.deleteOne();
    await ProductCategory.updateMany(
      { _id: product.productCategories },
      { $pull: { products: product._id } }
    );
    res.json({ message: "Remove is successfully" });
  }
);
