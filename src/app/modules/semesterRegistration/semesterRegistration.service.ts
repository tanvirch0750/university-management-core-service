import {
  Prisma,
  SemesterRegestration,
  SemesterRegestrationStatus,
} from '@prisma/client';
import httpStatus from 'http-status';
import ApiError from '../../../errors/ApiError';
import { calculatePagination } from '../../../helpers/paginationHelper';
import { IGenericPaginationResponse } from '../../../interfaces/genericPaginationResponse';
import { IpaginationOptions } from '../../../interfaces/paginationOptions';
import { findFilterConditions } from '../../../shared/findFilterConditions';
import { orderByConditions } from '../../../shared/orderCondition';
import prisma from '../../../shared/prisma';
import { semesterRegistrationSearchableFields } from './semesterRegistration.constant';
import { ISemesterRegistrationFilterRequest } from './semesterRegistration.interface';

const insertIntoDB = async (
  data: SemesterRegestration
): Promise<SemesterRegestration> => {
  const isAnySemesterRegUpcomingOrOngoing =
    await prisma.semesterRegestration.findFirst({
      where: {
        OR: [
          {
            status: SemesterRegestrationStatus.UPCOMING,
          },
          {
            status: SemesterRegestrationStatus.ONGOING,
          },
        ],
      },
    });

  if (isAnySemesterRegUpcomingOrOngoing) {
    throw new ApiError(
      `Thers is already an ${isAnySemesterRegUpcomingOrOngoing.status} registration.`,
      httpStatus.BAD_REQUEST
    );
  }

  const result = await prisma.semesterRegestration.create({
    data,
  });

  return result;
};

const getAllFromDB = async (
  filters: ISemesterRegistrationFilterRequest,
  options: IpaginationOptions
): Promise<IGenericPaginationResponse<SemesterRegestration[]>> => {
  const { page, limit, skip } = calculatePagination(options);
  const { searchTerm, ...filterData } = filters;

  const andConditions = findFilterConditions(
    searchTerm,
    filterData,
    semesterRegistrationSearchableFields
  );

  const whereConditons: Prisma.SemesterRegestrationWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const orderCondition = orderByConditions(options);

  const result = await prisma.semesterRegestration.findMany({
    include: {
      academicSemester: true,
    },
    where: whereConditons,
    skip,
    take: limit,
    orderBy: orderCondition,
  });

  const total = await prisma.semesterRegestration.count();

  return {
    meta: {
      total,
      page,
      limit,
    },
    data: result,
  };
};

const getDataById = async (
  id: string
): Promise<SemesterRegestration | null> => {
  const result = await prisma.semesterRegestration.findUnique({
    where: {
      id,
    },
    include: {
      academicSemester: true,
    },
  });
  return result;
};

const updateDataById = async (
  id: string,
  payload: Partial<SemesterRegestration>
): Promise<SemesterRegestration> => {
  const isExist = await prisma.semesterRegestration.findUnique({
    where: {
      id,
    },
  });

  if (!isExist) {
    throw new ApiError('Data not found!', httpStatus.BAD_REQUEST);
  }

  if (
    payload.status &&
    isExist.status === SemesterRegestrationStatus.UPCOMING &&
    payload.status !== SemesterRegestrationStatus.ONGOING
  ) {
    throw new ApiError(
      'Can only move from UPCOMING to ONGOING',
      httpStatus.BAD_REQUEST
    );
  }

  if (
    payload.status &&
    isExist.status === SemesterRegestrationStatus.ONGOING &&
    payload.status !== SemesterRegestrationStatus.ENDED
  ) {
    throw new ApiError(
      'Can only move from ONGOING to ENDED',
      httpStatus.BAD_REQUEST
    );
  }

  const result = await prisma.semesterRegestration.update({
    where: {
      id,
    },
    data: payload,
    include: {
      academicSemester: true,
    },
  });

  return result;
};

const deleteDataById = async (id: string): Promise<SemesterRegestration> => {
  const result = await prisma.semesterRegestration.delete({
    where: {
      id,
    },
    include: {
      academicSemester: true,
    },
  });

  return result;
};

export const SemesterRegestrationServices = {
  insertIntoDB,
  getAllFromDB,
  getDataById,
  updateDataById,
  deleteDataById,
};