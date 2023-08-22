import express from 'express';
import { validateRequest } from '../../middlewares/validateRequest';
import { StudentController } from './student.controller';
import { StudentValidation } from './student.validation';

const router = express.Router();

router.get('/:id', StudentController.getDataById);
router.delete('/:id', StudentController.deleteDataById);
router.patch(
  '/:id',
  validateRequest(StudentValidation.update),
  StudentController.updateDataById
);
router.post(
  '/create-student',
  validateRequest(StudentValidation.create),
  StudentController.insertIntoDB
);

router.get('/', StudentController.getAllFromDB);

export const studentRoutes = router;
