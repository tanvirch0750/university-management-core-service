import express from 'express';
import { academicSemesterRoutes } from '../modules/academicSemester/academicSemester.routes';
const router = express.Router();

const moduleRoutes = [
  {
    path: '/academic-semester',
    route: academicSemesterRoutes,
  },
];

// Application Routes
moduleRoutes.forEach(route => router.use(route.path, route.route));

export default router;
