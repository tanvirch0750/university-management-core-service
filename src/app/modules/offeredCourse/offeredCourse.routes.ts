import express from 'express';
import { ENUM_USER_ROLE } from '../../../enums/user';
import auth from '../../middlewares/auth';
import { validateRequest } from '../../middlewares/validateRequest';
import { OfferedCourseController } from './offeredCourse.controller';
import { OfferedCourseValidations } from './offeredCourse.validation';

const router = express.Router();

router.get('/:id', OfferedCourseController.getDataById);

router.delete(
  '/:id',
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  OfferedCourseController.deleteDataById
);

router.patch(
  '/:id',
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  validateRequest(OfferedCourseValidations.update),
  OfferedCourseController.updateDataById
);

router.post(
  '/create-offered-course',
  validateRequest(OfferedCourseValidations.create),
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  OfferedCourseController.insertIntoDB
);

router.get('/', OfferedCourseController.getAllFromDB);

export const offeredCoursesRoutes = router;
