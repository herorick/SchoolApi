import express from 'express';
import {
    DeliveryGetOrderById,
    DeliveryLogin,
    DeliverySignUp, EditDeliveryProfile, GetDeliveryProfile, GetOrdersByDelivery, UpdateDeliveryUserStatus, UpdateStatusOrder
} from '../../controllers';
import { Authenticate } from '../../middlewares';
import { initMulter } from '../../config';

const router = express.Router();
const imagesMiddleware = initMulter();

/* ------------------- Signup / Create Customer --------------------- */
router.post('/signup', imagesMiddleware, DeliverySignUp)

/* ------------------- Login --------------------- */
router.post('/login', DeliveryLogin)

/* ------------------- Authentication --------------------- */
router.use(Authenticate);

/* ------------------- Change Service Status --------------------- */
router.put('/change-status', UpdateDeliveryUserStatus);

/* ------------------- Profile --------------------- */
router.get('/profile', GetDeliveryProfile)
router.patch('/profile', EditDeliveryProfile)

router.get('/orders', GetOrdersByDelivery)
router.get('/orders/:id', DeliveryGetOrderById)
router.put('/orders/:id', imagesMiddleware, UpdateStatusOrder)


export { router as DeliveryRoutes }