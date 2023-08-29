import { AcademicDepartment, Prisma } from '@prisma/client';
import { calculatePagination } from '../../../helpers/paginationHelper';
import { IGenericPaginationResponse } from '../../../interfaces/genericPaginationResponse';
import { IpaginationOptions } from '../../../interfaces/paginationOptions';
import { findFilterConditions } from '../../../shared/findFilterConditions';
import { orderByConditions } from '../../../shared/orderCondition';
import prisma from '../../../shared/prisma';
import {
  academicDepartmentRelationalFields,
  academicDepartmentRelationalFieldsMapper,
  academicDepartmentSearchableFields,
} from './academicDepartment.constant';
import { IAcademicDepartmentFilters } from './academicDepartment.interface';

const insertIntoDB = async (
  data: AcademicDepartment
): Promise<AcademicDepartment> => {
  const result = await prisma.academicDepartment.create({
    data,
    include: {
      academicFaculty: true,
    },
  });
  return result;
};

const getAllFromDB = async (
  filters: IAcademicDepartmentFilters,
  options: IpaginationOptions
): Promise<IGenericPaginationResponse<AcademicDepartment[]>> => {
  const { page, limit, skip } = calculatePagination(options);
  const { searchTerm, ...filterData } = filters;

  const andConditions = findFilterConditions(
    searchTerm,
    filterData,
    academicDepartmentSearchableFields,
    academicDepartmentRelationalFields,
    academicDepartmentRelationalFieldsMapper
  );

  const whereConditons: Prisma.AcademicDepartmentWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const orderCondition = orderByConditions(options);

  const result = await prisma.academicDepartment.findMany({
    include: {
      academicFaculty: true,
    },
    where: whereConditons,
    skip,
    take: limit,
    orderBy: orderCondition,
  });

  const total = await prisma.academicDepartment.count();

  return {
    meta: {
      total,
      page,
      limit,
    },
    data: result,
  };
};

const getDataById = async (id: string): Promise<AcademicDepartment | null> => {
  const result = await prisma.academicDepartment.findUnique({
    where: {
      id,
    },
    include: {
      academicFaculty: true,
    },
  });
  return result;
};

const updateDataById = async (
  id: string,
  payload: Partial<AcademicDepartment>
): Promise<AcademicDepartment> => {
  const result = await prisma.academicDepartment.update({
    where: {
      id,
    },
    data: payload,
    include: {
      academicFaculty: true,
    },
  });

  return result;
};

const deleteDataById = async (id: string): Promise<AcademicDepartment> => {
  const result = await prisma.academicDepartment.delete({
    where: {
      id,
    },
    include: {
      academicFaculty: true,
    },
  });

  return result;
};

export const AcademicDepartmentServices = {
  insertIntoDB,
  getAllFromDB,
  getDataById,
  updateDataById,
  deleteDataById,
};
