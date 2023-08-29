import { AcademicFaculty, Prisma } from '@prisma/client';
import { calculatePagination } from '../../../helpers/paginationHelper';
import { IGenericPaginationResponse } from '../../../interfaces/genericPaginationResponse';
import { IpaginationOptions } from '../../../interfaces/paginationOptions';
import { findFilterConditionsWithoutRelation } from '../../../shared/findFilterConditions';
import { orderByConditions } from '../../../shared/orderCondition';
import prisma from '../../../shared/prisma';
import { academicFacultySearchableFields } from './academicFaculty.constant';
import { IAcademicFacultyFilters } from './academicFaculty.interface';

const insertIntoDB = async (
  data: AcademicFaculty
): Promise<AcademicFaculty> => {
  const result = await prisma.academicFaculty.create({ data });
  return result;
};

const getAllFromDB = async (
  filters: IAcademicFacultyFilters,
  options: IpaginationOptions
): Promise<IGenericPaginationResponse<AcademicFaculty[]>> => {
  const { page, limit, skip } = calculatePagination(options);
  const { searchTerm, ...filterData } = filters;

  const andConditions = findFilterConditionsWithoutRelation(
    searchTerm,
    filterData,
    academicFacultySearchableFields
  );

  const whereConditons: Prisma.AcademicFacultyWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const orderCondition = orderByConditions(options);

  const result = await prisma.academicFaculty.findMany({
    where: whereConditons,
    skip,
    take: limit,
    orderBy: orderCondition,
  });

  const total = await prisma.academicFaculty.count();

  return {
    meta: {
      total,
      page,
      limit,
    },
    data: result,
  };
};

const getDataById = async (id: string): Promise<AcademicFaculty | null> => {
  const result = await prisma.academicFaculty.findUnique({
    where: {
      id,
    },
  });
  return result;
};

const updateDataById = async (
  id: string,
  payload: Partial<AcademicFaculty>
): Promise<AcademicFaculty> => {
  const result = await prisma.academicFaculty.update({
    where: {
      id,
    },
    data: payload,
  });

  return result;
};

const deleteDataById = async (id: string): Promise<AcademicFaculty> => {
  const result = await prisma.academicFaculty.delete({
    where: {
      id,
    },
  });

  return result;
};

export const AcademicFacultyServices = {
  insertIntoDB,
  getAllFromDB,
  getDataById,
  updateDataById,
  deleteDataById,
};
