import express from 'express';
import academicDepartmentRouters from '../modules/academicDepartment/academicDepartment.route';
import academicFacultyRouters from '../modules/academicFaculty/academicFaculty.route';
import academicSemesterRouters from '../modules/academicSemester/academicSemester.route';
import adminRouters from '../modules/admin/admin.route';
import authRouters from '../modules/auth/auth.route';
import facultyRouters from '../modules/faculty/faculty.route';
import managementDepartmentRouters from '../modules/managementDepartment/managementDepartment.route';
import studentRouters from '../modules/student/student.route';
import userRouters from '../modules/user/user.route';
const router = express.Router();

const moduleRoutes = [
  {
    path: '/users',
    route: userRouters,
  },
  {
    path: '/academic-semesters',
    route: academicSemesterRouters,
  },
  {
    path: '/academic-faculty',
    route: academicFacultyRouters,
  },
  {
    path: '/academic-departments',
    route: academicDepartmentRouters,
  },
  {
    path: '/user/student',
    route: studentRouters,
  },
  {
    path: '/user/faculty',
    route: facultyRouters,
  },
  {
    path: '/user/admin',
    route: adminRouters,
  },
  {
    path: '/management-department',
    route: managementDepartmentRouters,
  },
  {
    path: '/auth',
    route: authRouters,
  },
];

// Application Routes
moduleRoutes.forEach(route => router.use(route.path, route.route));

export default router;
