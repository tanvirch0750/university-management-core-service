import express from 'express';
import { validateRequest } from '../../middlewares/validateRequest';
import { FacultyController } from './faculty.controller';
import { facultyValidation } from './faculty.validation';

const router = express.Router();

router.get('/:id', FacultyController.getDataById);
router.post(
  '/create-faculty',
  validateRequest(facultyValidation.create),
  FacultyController.insertIntoDB
);

router.get('/', FacultyController.getAllFromDB);

export const facultyRoutes = router;
