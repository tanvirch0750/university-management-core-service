/* eslint-disable @typescript-eslint/no-explicit-any */
import { AcademicSemester, Prisma } from '@prisma/client';
import httpStatus from 'http-status';
import ApiError from '../../../errors/ApiError';
import { calculatePagination } from '../../../helpers/paginationHelper';
import { IGenericPaginationResponse } from '../../../interfaces/genericPaginationResponse';
import { IpaginationOptions } from '../../../interfaces/paginationOptions';
import { findFilterConditionsWithoutRelation } from '../../../shared/findFilterConditions';
import { orderByConditions } from '../../../shared/orderCondition';
import prisma from '../../../shared/prisma';
import { RedisClient } from '../../../shared/redis';
import {
  EVENT_ACADEMIC_SEMESTER_CREATED,
  EVENT_ACADEMIC_SEMESTER_DELETED,
  EVENT_ACADEMIC_SEMESTER_UPDATED,
  academicSemesterSearchableFields,
  academicSemesterTitleCodeMapper,
} from './academicSemester.constant';
import { IAcademicSemesterFilters } from './academicSemester.interface';

const insertIntoDB = async (
  data: AcademicSemester
): Promise<AcademicSemester> => {
  const isExist = await prisma.academicSemester.findFirst({
    where: {
      title: data.title,
      year: data.year,
    },
  });

  if (isExist) {
    throw new ApiError('Semester already exist', httpStatus.BAD_REQUEST);
  }

  if (academicSemesterTitleCodeMapper[data.title] !== data.code) {
    throw new ApiError('Invalid Semester Code', httpStatus.BAD_REQUEST);
  }

  const result = await prisma.academicSemester.create({ data });

  if (result) {
    await RedisClient.publish(
      EVENT_ACADEMIC_SEMESTER_CREATED,
      JSON.stringify(result)
    );
  }

  return result;
};

const getAllFromDB = async (
  filters: IAcademicSemesterFilters,
  options: IpaginationOptions
): Promise<IGenericPaginationResponse<AcademicSemester[]>> => {
  const { page, limit, skip } = calculatePagination(options);
  const { searchTerm, ...filterData } = filters;

  const andConditions = findFilterConditionsWithoutRelation(
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

const updateDataById = async (
  id: string,
  payload: Partial<AcademicSemester>
): Promise<AcademicSemester> => {
  const isExist = await prisma.academicSemester.findFirst({
    where: {
      title: payload.title,
      year: payload.year,
    },
  });

  if (isExist) {
    throw new ApiError('Semester already exist', httpStatus.BAD_REQUEST);
  }

  const result = await prisma.academicSemester.update({
    where: {
      id,
    },
    data: payload,
  });

  if (result) {
    await RedisClient.publish(
      EVENT_ACADEMIC_SEMESTER_UPDATED,
      JSON.stringify(result)
    );
  }

  return result;
};

const deleteDataById = async (id: string): Promise<AcademicSemester> => {
  const result = await prisma.academicSemester.delete({
    where: {
      id,
    },
  });

  if (result) {
    await RedisClient.publish(
      EVENT_ACADEMIC_SEMESTER_DELETED,
      JSON.stringify(result)
    );
  }

  return result;
};

export const AcademicSemesterServices = {
  insertIntoDB,
  getAllFromDB,
  getDataById,
  updateDataById,
  deleteDataById,
};
