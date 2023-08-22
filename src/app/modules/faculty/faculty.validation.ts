import { z } from 'zod';

const create = z.object({
  body: z.object({
    facultyId: z.string(),
    firstName: z.string(),
    lastName: z.string(),
    middleName: z.string(),
    profileImage: z.string(),
    email: z.string(),
    contactNo: z.string(),
    gender: z.string(),
    bloodGroup: z.string(),
    designation: z.string(),
    academicDepartmentId: z.string(),
    academicFacultyId: z.string(),
  }),
});

export const facultyValidation = {
  create,
};
