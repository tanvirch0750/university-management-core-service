import express from 'express';
import { ENUM_USER_ROLE } from '../../../enums/user';
import auth from '../../middlewares/auth';
import { validateRequest } from '../../middlewares/validateRequest';
import { FacultyController } from './faculty.controller';
import { facultyValidation } from './faculty.validation';

const router = express.Router();

router.get('/:id', FacultyController.getDataById);

router.delete(
  '/:id',
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  FacultyController.deleteDataById
);

router.patch(
  '/:id',
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  validateRequest(facultyValidation.update),
  FacultyController.updateDataById
);

router.post(
  '/create-faculty',
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  validateRequest(facultyValidation.create),
  FacultyController.insertIntoDB
);

router.get('/', FacultyController.getAllFromDB);

export const facultyRoutes = router;
