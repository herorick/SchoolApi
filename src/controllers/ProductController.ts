import { NextFunction, Request, Response } from "express";
import { APIError, NotFound } from "../utilities";
import asyncHandler from "express-async-handler";
import { Brand, Product, ProductCategory, ProductDoc, Vendor } from "../models";
import difference from "lodash/difference";
import { Review } from "../models/Review";
import { PaginatedData } from "../middlewares/PaginationMiddleware";
import { sumBy } from "lodash";

export const GetProducts = asyncHandler(async (req: Request, res: Response) => {
  try {
    const user = req.user!;
    const page: number = parseInt(req.query.page as string) || 1;
    const limit: number = parseInt(req.query.limit as string) || 10;

    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    const results: PaginatedData<ProductDoc> = {
      results: [],
    }; // Count the total number of documents in the collection
    const totalDocuments = await Product.countDocuments({
      vendorId: user.id,
    }).exec();

    if (startIndex > 0) {
      results.hasPrevious = true;
    }

    if (endIndex < totalDocuments) {
      results.hasNext = true;
    }

    results.totalPage = Math.ceil(totalDocuments / limit);

    results.page = page;

    // Query the database for paginated results
    results.results = await Product.find({ vendorId: user.id })
      .skip(startIndex)
      .limit(limit)
      .populate("review")
      .populate("brand")
      .populate("productCategories")
      .exec();

    res.status(200).json(results);
  } catch (err) {
    console.log(err);
    throw new APIError("can't get transaction");
  }
});

export const ReviewProduct = asyncHandler(
  async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const product = await Product.findById(id);
      if (product) {
        const review = await Review.create({
          product: id,
          ...req.body,
        });
        product.reviews.push(review);
        const populateProduct = await product.populate("reviews");
        populateProduct.reviews.forEach((review) => {
          console.log(review);
        });
        const totalStar = sumBy(populateProduct.reviews, (data) => data.rating);
        const numberReviews = populateProduct.reviews.length;
        product.rating = numberReviews ? totalStar / numberReviews : 0;
        await product.save();
        res.json({ data: review });
      }
      res.status(400).json({ message: "some thing wrong!" });
    } catch (err) {
      console.log(err);
      res.status(400).json({ message: "some thing wrong!" });
    }
  }
);

export const GetProductById = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const product = await Product.findById(id)
      .populate("brand")
      .populate("productCategories")
      .populate("reviews")
      .exec();
    if (!product) throw new NotFound("Product not found by id: " + id);
    res.json({ results: product });
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
    res.json({ results: createdProduct });
  }
);

export const UpdateProduct = asyncHandler(
  async (req: Request, res: Response) => {
    const { files, params, body } = req;
    const { id } = params;
    const { name, brand, description, price, productCategories } = body;
    const oldProduct = await Product.findById(id);
    const oldBrand = oldProduct?.brand;
    const oldCategories = oldProduct!.productCategories;
    if (!oldProduct) throw new NotFound();
    const images = files as [Express.Multer.File];
    const imageNames = images.map((file) => file.filename);

    Object.assign(oldProduct, {
      name,
      brand,
      description,
      price,
      images: [...oldProduct.images, ...imageNames],
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

export const DeleteProducts = asyncHandler(
  async (req: Request, res: Response) => {
    const results = await Product.deleteMany();
    res.json(results);
  }
);

// TODO: remove image
export const DeleteProductImage = asyncHandler(
  async (req: Request, res: Response) => {
    const { productId, imageId } = req.query;
    const product = await Product.findById(productId);
    if (!product) throw new NotFound();
    const newImages = product.images.filter((item) => item !== imageId);
    await product.updateOne({
      images: newImages,
    });
    res.json({ message: "Remove is successfully" });
  }
);
