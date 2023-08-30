import express from 'express';
import { ENUM_USER_ROLE } from '../../../enums/user';
import auth from '../../middlewares/auth';
import { validateRequest } from '../../middlewares/validateRequest';
import { OfferedCourseClassScheduleController } from './offeredCourseClassSchedule.controller';
import { OfferedCourseClassScheduleValidation } from './offeredCourseClassSchedule.validation';

const router = express.Router();

router.post(
  '/create-class-schedule',
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  validateRequest(OfferedCourseClassScheduleValidation.create),
  OfferedCourseClassScheduleController.insertIntoDB
);

router.get('/', OfferedCourseClassScheduleController.getAllFromDB);

export const offeredCourseClassScheduleRoutes = router;
