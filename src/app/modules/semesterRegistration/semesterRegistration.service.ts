import { SemesterRegestration } from '@prisma/client';
import prisma from '../../../shared/prisma';

const insertIntoDB = async (
  data: SemesterRegestration
): Promise<SemesterRegestration> => {
  const result = await prisma.semesterRegestration.create({
    data,
  });

  return result;
};

export const SemesterRegestrationServices = {
  insertIntoDB,
};
