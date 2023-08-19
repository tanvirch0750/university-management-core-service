import express from 'express';
import { validateRequest } from '../../middlewares/validateRequest';
import { AcademicDepartmentController } from './academicDepartment.controller';
import { AcademicDepartmentValidation } from './academicDepartment.validation';

const router = express.Router();

router.get('/:id', AcademicDepartmentController.getDataById);
router.post(
  '/create-department',
  validateRequest(AcademicDepartmentValidation.create),
  AcademicDepartmentController.insertIntoDB
);

router.get('/', AcademicDepartmentController.getAllFromDB);

export const academicDepartmentRoutes = router;
