import { Prisma, Student } from '@prisma/client';
import prisma from '../../../shared/prisma';
import { IStudentFilters } from './student.interface';
import { IpaginationOptions } from '../../../interfaces/paginationOptions';
import { IGenericPaginationResponse } from '../../../interfaces/genericPaginationResponse';
import { calculatePagination } from '../../../helpers/paginationHelper';
import { findFilterConditions } from '../../../shared/findFilterConditions';
import { studentSearchableFields } from './student.constant';
import { orderByConditions } from '../../../shared/orderCondition';


const insertIntoDB = async (
  data: Student
): Promise<Student> => {
  const result = await prisma.student.create({ data });
  return result;
};

const getAllFromDB = async (
  filters: IStudentFilters,
  options: IpaginationOptions
): Promise<IGenericPaginationResponse<Student[]>> => {
  const { page, limit, skip } = calculatePagination(options);
  const { searchTerm, ...filterData } = filters;

  const andConditions = findFilterConditions(
    searchTerm,
    filterData,
    studentSearchableFields
  );

  const whereConditons: Prisma.StudentWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const orderCondition = orderByConditions(options);

  const result = await prisma.student.findMany({
    where: whereConditons,
    skip,
    take: limit,
    orderBy: orderCondition,
  });

  const total = await prisma.student.count();

  return {
    meta: {
      total,
      page,
      limit,
    },
    data: result,
  };
};

const getDataById = async (id: string): Promise<Student | null> => {
  const result = await prisma.student.findUnique({
    where: {
      id,
    },
  });
  return result;
};

export const StudentServices = {
  insertIntoDB,
  getAllFromDB,
  getDataById,
};
