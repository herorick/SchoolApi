import { Request, Response, NextFunction } from 'express';
import { DeliveryUser, Order, } from '../models';
import { APIError, GenerateSalt, generatePassword, generateSignature, validatePassword } from '../utilities';
import asyncHandler from 'express-async-handler';

export const DeliverySignUp = async (req: Request, res: Response, next: NextFunction) => {
	const { body, files } = req;
	const { email, phone, password, address, firstName, lastName, pincode } = body;

	const salt = await GenerateSalt();
	const userPassword = await generatePassword(password, salt);

	const existingDeliveryUser = await DeliveryUser.findOne({ email: email });

	if (existingDeliveryUser !== null) {
		return res.status(400).json({ message: 'A Delivery User exist with the provided email ID!' });
	}

	// image
	const images = files as [Express.Multer.File];
	const imageNames = images.map((file) => file.filename);

	const result = await DeliveryUser.create({
		email: email,
		password: userPassword,
		salt: salt,
		phone: phone,
		firstName: firstName,
		lastName: lastName,
		address: address,
		pincode: pincode,
		verified: false,
		lat: 0,
		lng: 0,
		coverImage: imageNames[0],
	})

	if (result) {

		//Generate the Signature
		const signature = await generateSignature({
			id: result._id,
			email: result.email,
			verified: result.verified
		})
		// Send the result
		return res.status(201).json({ signature, verified: result.verified, email: result.email })

	}

	return res.status(400).json({ msg: 'Error while creating Delivery user' });


}

export const DeliveryLogin = async (req: Request, res: Response, next: NextFunction) => {

	const { email, password } = req.body;

	const deliveryUser = await DeliveryUser.findOne({ email: email });
	if (deliveryUser) {
		const validation = await validatePassword(password, deliveryUser.password, deliveryUser.salt);

		if (validation) {

			const signature = generateSignature({
				id: deliveryUser._id,
				email: deliveryUser.email,
				verified: deliveryUser.verified
			})

			return res.status(200).json({
				signature,
				email: deliveryUser.email,
				verified: deliveryUser.verified
			})
		}
	}

	return res.json({ msg: 'Error Login' });

}

export const GetDeliveryProfile = async (req: Request, res: Response, next: NextFunction) => {

	const deliveryUser = req.user;

	if (deliveryUser) {

		const profile = await DeliveryUser.findById(deliveryUser.id);

		if (profile) {

			return res.status(201).json(profile);
		}

	}
	return res.status(400).json({ msg: 'Error while Fetching Profile' });

}

export const EditDeliveryProfile = async (req: Request, res: Response) => {

	const deliveryUser = req.user;

	const { firstName, lastName, address } = req.body;

	if (deliveryUser) {

		const profile = await DeliveryUser.findById(deliveryUser.id);

		if (profile) {
			profile.firstName = firstName;
			profile.lastName = lastName;
			profile.address = address;
			const result = await profile.save()

			return res.status(201).json(result);
		}

	}
	return res.status(400).json({ msg: 'Error while Updating Profile' });

}

/* ------------------- Delivery Notification --------------------- */


export const UpdateDeliveryUserStatus = async (req: Request, res: Response) => {

	const deliveryUser = req.user;

	if (deliveryUser) {

		const { lat, lng } = req.body;

		const profile = await DeliveryUser.findById(deliveryUser.id);

		if (profile) {

			if (lat && lng) {
				profile.lat = lat;
				profile.lng = lng;
			}

			profile.isAvailable = !profile.isAvailable;

			const result = await profile.save();

			return res.status(201).json(result);
		}

	}
	return res.status(400).json({ msg: 'Error while Updating Profile' });

}

export const GetOrdersByDelivery = asyncHandler(async (req: Request, res: Response) => {
	const deliveryUser = req.user!;
	const orders = await Order.find({ deliveryId: deliveryUser.id });
	res.json({ result: orders })
});

export const DeliveryGetOrderById = asyncHandler(async (req: Request, res: Response) => {
	const { id } = req.params
	try {
		const order = await Order.findById(id)
		res.json(order)
	} catch (err) {
		throw new APIError("Can't get order by Id")
	}
});

export const UpdateStatusOrder = asyncHandler(async (req: Request, res: Response) => {
	try {
		const { body, files, params } = req;
		const { id } = params;
		const { status, remarks } = body;
		const order = await Order.findById(id)

		// image
		const images = files as [Express.Multer.File];
		const imageNames = images.map((file) => file.filename);

		if (order !== null) {
			order.remarks = remarks;
			order.status = status
			order.verifyImage = imageNames
			const result = await order.save();
			res.json({ result })
		}
	} catch (err) {
		throw new APIError("Can't update staus of order")
	}
});