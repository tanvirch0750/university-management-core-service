import { z } from 'zod';

const create = z.object({
  body: z.object({
    studentId: z.string(),
    firstName: z.string(),
    lastName: z.string(),
    middleName: z.string(),
    profileImage: z.string(),
    email: z.string(),
    contactNo: z.string(),
    gender: z.string(),
    bloodGroup: z.string(),
    academicSemesterId: z.string(),
    academicDepartmentId: z.string(),
    academicFacultyId: z.string(),
  }),
});

export const StudentValidation = {
  create,
};
