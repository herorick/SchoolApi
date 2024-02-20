import express, { Request, Response, NextFunction } from 'express';
import { Offer } from '../models/Offer';
import { Vendor } from '@/models';
import asyncHandler from "express-async-handler";

export const GetProducts = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
	const result = await Vendor.find({}).sort([['rating', 'descending']]).populate('products')
	if (result.length > 0) {
		res.status(200).json(result);
	}
	res.status(404).json({ msg: 'data Not found!' });
});

export const GetTopVendor = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
	const result = await Vendor.find({}).sort([['rating', 'descending']]).limit(10)
	if (result.length > 0) {
		res.status(200).json(result);
	}
	res.status(404).json({ msg: 'data Not found!' });
})

export const SearchProducts = async (req: Request, res: Response, next: NextFunction) => {
	const result = await Vendor.find({})
		.populate('products');

	if (result.length > 0) {
		let foodResult: any = [];
		result.map(item => foodResult.push(...item.products));
		return res.status(200).json(foodResult);
	}
	return res.status(404).json({ msg: 'data Not found!' });
}

export const GetVendorById = async (req: Request, res: Response, next: NextFunction) => {
	const id = req.params.id;
	const result = await Vendor.findById(id).populate('products')
	if (result) {
		return res.status(200).json(result);
	}
	return res.status(404).json({ msg: 'data Not found!' });
}

export const GetAvailableOffers = async (req: Request, res: Response, next: NextFunction) => {
	const offers = await Offer.find({ isActive: true });
	if (offers) {
		return res.status(200).json(offers);
	}
	return res.json({ message: 'Offers not Found!' });
}