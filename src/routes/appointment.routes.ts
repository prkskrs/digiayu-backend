import express from 'express';
import { Container } from 'typedi';
const router = express.Router();
import RequestValidator from '../middlewares/validator';
import requestSchemas from './requestSchemas';
import AppointmentControllers from '../controllers/appointment.controller';
const appointmentControllers = Container.get(AppointmentControllers)

router.post(
    '/book',
    RequestValidator(requestSchemas.appointmentRoutesSchemas.bookAppointment.body, 'body'),
    RequestValidator(requestSchemas.appointmentRoutesSchemas.bookAppointment.headers, 'headers'),
    appointmentControllers.bookAppointment,
);

router.get(
    '/zoom/auth',
    appointmentControllers.zoomAuthorization,
);

router.get(
    '/zoom/callback/:appointmentId',
    appointmentControllers.zoomCallback,
);

// For both doctor and patient based on token
router.get(
    '/',
    RequestValidator(requestSchemas.appointmentRoutesSchemas.getAppointments.headers, 'headers'),
    appointmentControllers.getAppointments,
);

router.get(
    '/:id',
    RequestValidator(requestSchemas.appointmentRoutesSchemas.getAppointments.headers, 'headers'),
    appointmentControllers.getAppointmentById,
);

router.patch(
    '/:id',
    RequestValidator(requestSchemas.appointmentRoutesSchemas.updateAppointment.body, 'body'),
    RequestValidator(requestSchemas.appointmentRoutesSchemas.updateAppointment.headers, 'headers'),
    appointmentControllers.updateAppointmentById,
);

export default router;
