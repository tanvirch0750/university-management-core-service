/* eslint-disable @typescript-eslint/no-explicit-any */
import { OfferedCourseSection, Prisma } from '@prisma/client';
import httpStatus from 'http-status';
import ApiError from '../../../errors/ApiError';
import { calculatePagination } from '../../../helpers/paginationHelper';
import { IGenericPaginationResponse } from '../../../interfaces/genericPaginationResponse';
import { IpaginationOptions } from '../../../interfaces/paginationOptions';
import { asyncForEach } from '../../../shared/asyncForeach';
import { findFilterConditions } from '../../../shared/findFilterConditions';
import { orderByConditions } from '../../../shared/orderCondition';
import prisma from '../../../shared/prisma';
import { offeredCourseSearchableFields } from '../offeredCourse/offeredCourse.constant';
import { OfferedCourseClassScheduleUtils } from '../offeredCourseClassSchedule/offeredCourseClassSchedule.utils';
import {
  offeredCourseSectionRelationalFields,
  offeredCourseSectionRelationalFieldsMapper,
} from './offeredCourseSection.constant';
import {
  IClassSchedule,
  IOfferedCourseSectionCreate,
  IOfferedCourseSectionFilterRequest,
} from './offeredCourseSection.interface';

// const insertIntoDB = async (payload: any): Promise<OfferedCourseSection> => {

//   const { classSchedules, ...data } = payload

//   const isExistOfferedCourse = await prisma.offeredCourse.findFirst({
//     where: {
//       id: data.offeredCourseId,
//     },
//   });

//   if (!isExistOfferedCourse) {
//     throw new ApiError(
//       'Offered Course does not exist!',
//       httpStatus.BAD_REQUEST
//     );
//   }

//   data.semesterRegistrationId = isExistOfferedCourse.semesterRegistrationId;
//   data.academicDepartmentId = isExistOfferedCourse.academicDepartmentId;

//   const result = await prisma.offeredCourseSection.create({
//     data,
//   });

//   return result;
// };

const insertIntoDB = async (
  payload: IOfferedCourseSectionCreate
): Promise<OfferedCourseSection | null> => {
  const { classSchedules, ...data } = payload;

  const isExistOfferedCourse = await prisma.offeredCourse.findFirst({
    where: {
      id: data.offeredCourseId,
    },
  });

  if (!isExistOfferedCourse) {
    throw new ApiError(
      'Offered Course does not exist!',
      httpStatus.BAD_REQUEST
    );
  }

  await asyncForEach(classSchedules, async (schedule: any) => {
    await OfferedCourseClassScheduleUtils.checkRoomAvailable(schedule);
    await OfferedCourseClassScheduleUtils.checkFacultyAvailable(schedule);
  });

  const offerCourseSectionData = await prisma.offeredCourseSection.findFirst({
    where: {
      offeredCourse: {
        id: data.offeredCourseId,
      },
      title: data.title,
    },
  });

  if (offerCourseSectionData) {
    throw new ApiError('Course Section already exists', httpStatus.BAD_REQUEST);
  }

  const createSection = await prisma.$transaction(async transactionClient => {
    const createOfferedCourseSection =
      await transactionClient.offeredCourseSection.create({
        data: {
          title: data.title,
          maxCapacity: data.maxCapacity,
          offeredCourseId: data.offeredCourseId,
          semesterRegistrationId: isExistOfferedCourse.semesterRegistrationId,
          academicDepartmentId: isExistOfferedCourse.academicDepartmentId,
        },
      });

    const scheduleData = classSchedules.map((schedule: IClassSchedule) => ({
      startTime: schedule.startTime,
      endTime: schedule.endTime,
      dayOfWeek: schedule.dayOfWeek,
      roomId: schedule.roomId,
      facultyId: schedule.facultyId,
      offeredCourseSectionId: createOfferedCourseSection.id,
      semesterRegistrationId: isExistOfferedCourse.semesterRegistrationId,
    }));

    await transactionClient.offeredCourseClassSchedule.createMany({
      data: scheduleData,
    });

    return createOfferedCourseSection;
  });

  const result = await prisma.offeredCourseSection.findFirst({
    where: {
      id: createSection.id,
    },
    include: {
      offeredCourse: {
        include: {
          course: true,
        },
      },
      academicDepartment: true,
      offeredCourseClassSchedules: {
        include: {
          room: {
            include: {
              building: true,
            },
          },
          faculty: true,
        },
      },
    },
  });

  return result;
};

const getAllFromDB = async (
  filters: IOfferedCourseSectionFilterRequest,
  options: IpaginationOptions
): Promise<IGenericPaginationResponse<OfferedCourseSection[]>> => {
  const { page, limit, skip } = calculatePagination(options);
  const { searchTerm, ...filterData } = filters;

  const andConditions = findFilterConditions(
    searchTerm,
    filterData,
    offeredCourseSearchableFields,
    offeredCourseSectionRelationalFields,
    offeredCourseSectionRelationalFieldsMapper
  );

  const whereConditons: Prisma.OfferedCourseSectionWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const orderCondition = orderByConditions(options);

  const result = await prisma.offeredCourseSection.findMany({
    include: {
      offeredCourse: {
        include: {
          course: true,
        },
      },
      semesterRegistration: true,
      academicDepartment: true,
    },
    where: whereConditons,
    skip,
    take: limit,
    orderBy: orderCondition,
  });

  const total = await prisma.offeredCourseSection.count();

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
): Promise<OfferedCourseSection | null> => {
  const result = await prisma.offeredCourseSection.findUnique({
    where: {
      id,
    },
    include: {
      offeredCourse: {
        include: {
          course: true,
        },
      },
      semesterRegistration: true,
      academicDepartment: true,
    },
  });
  return result;
};

const updateDataById = async (
  id: string,
  payload: Partial<OfferedCourseSection>
): Promise<OfferedCourseSection> => {
  const isExist = await prisma.offeredCourseSection.findUnique({
    where: {
      id,
    },
  });

  if (!isExist) {
    throw new ApiError('Data not found!', httpStatus.BAD_REQUEST);
  }

  const result = await prisma.offeredCourseSection.update({
    where: {
      id,
    },
    data: payload,
    include: {
      offeredCourse: {
        include: {
          course: true,
        },
      },
      semesterRegistration: true,
      academicDepartment: true,
    },
  });

  return result;
};

const deleteDataById = async (id: string): Promise<OfferedCourseSection> => {
  const result = await prisma.offeredCourseSection.delete({
    where: {
      id,
    },
    include: {
      offeredCourse: {
        include: {
          course: true,
        },
      },
      semesterRegistration: true,
      academicDepartment: true,
    },
  });

  return result;
};

export const OfferedCourseSectionService = {
  insertIntoDB,
  getAllFromDB,
  getDataById,
  updateDataById,
  deleteDataById,
};
