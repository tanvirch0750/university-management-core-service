/* eslint-disable @typescript-eslint/no-explicit-any */
import { AcademicSemester, Prisma } from '@prisma/client';
import httpStatus from 'http-status';
import ApiError from '../../../errors/ApiError';
import { calculatePagination } from '../../../helpers/paginationHelper';
import { IGenericPaginationResponse } from '../../../interfaces/genericPaginationResponse';
import { IpaginationOptions } from '../../../interfaces/paginationOptions';
import { findFilterConditions } from '../../../shared/findFilterConditions';
import { orderByConditions } from '../../../shared/orderCondition';
import prisma from '../../../shared/prisma';
import {
  academicSemesterSearchableFields,
  academicSemesterTitleCodeMapper,
} from './academicSemester.constant';
import { IAcademicSemesterFilters } from './academicSemester.interface';

const insertIntoDB = async (
  data: AcademicSemester
): Promise<AcademicSemester> => {
  if (academicSemesterTitleCodeMapper[data.title] !== data.code) {
    throw new ApiError('Invalid Semester Code', httpStatus.BAD_REQUEST);
  } else {
    const result = await prisma.academicSemester.create({ data });
    return result;
  }
};

const getAllFromDB = async (
  filters: IAcademicSemesterFilters,
  options: IpaginationOptions
): Promise<IGenericPaginationResponse<AcademicSemester[]>> => {
  const { page, limit, skip } = calculatePagination(options);
  const { searchTerm, ...filterData } = filters;

  const andConditions = findFilterConditions(
    searchTerm,
    filterData,
    academicSemesterSearchableFields
  );

  const whereConditons: Prisma.AcademicSemesterWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const orderCondition = orderByConditions(options);

  const result = await prisma.academicSemester.findMany({
    where: whereConditons,
    skip,
    take: limit,
    orderBy: orderCondition,
  });

  const total = await prisma.academicSemester.count();

  return {
    meta: {
      total,
      page,
      limit,
    },
    data: result,
  };
};

const getDataById = async (id: string): Promise<AcademicSemester | null> => {
  const result = await prisma.academicSemester.findUnique({
    where: {
      id,
    },
  });
  return result;
};

export const AcademicSemesterServices = {
  insertIntoDB,
  getAllFromDB,
  getDataById,
};
