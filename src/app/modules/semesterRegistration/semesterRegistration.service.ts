import {
  Prisma,
  SemesterRegestration,
  SemesterRegestrationStatus,
  StudentSemesterRegistration,
} from '@prisma/client';
import httpStatus from 'http-status';
import ApiError from '../../../errors/ApiError';
import { calculatePagination } from '../../../helpers/paginationHelper';
import { IGenericPaginationResponse } from '../../../interfaces/genericPaginationResponse';
import { IpaginationOptions } from '../../../interfaces/paginationOptions';
import { findFilterConditions } from '../../../shared/findFilterConditions';
import { orderByConditions } from '../../../shared/orderCondition';
import prisma from '../../../shared/prisma';
import {
  semesterRegistrationRelationalFields,
  semesterRegistrationRelationalFieldsMapper,
  semesterRegistrationSearchableFields,
} from './semesterRegistration.constant';
import {
  IEnrollCoursePayload,
  ISemesterRegistrationFilterRequest,
} from './semesterRegistration.interface';

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
    semesterRegistrationSearchableFields,
    semesterRegistrationRelationalFields,
    semesterRegistrationRelationalFieldsMapper
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

const startMyRegistration = async (
  authUserId: string
): Promise<{
  semesterRegistration: SemesterRegestration | null;
  studentSemesterRegistration: StudentSemesterRegistration | null;
}> => {
  const studentInfo = await prisma.student.findFirst({
    where: {
      studentId: authUserId,
    },
  });

  if (!studentInfo) {
    throw new ApiError('Student Info not found!', httpStatus.BAD_REQUEST);
  }

  const semesterRegistrationInfo = await prisma.semesterRegestration.findFirst({
    where: {
      status: {
        in: [
          SemesterRegestrationStatus.ONGOING,
          SemesterRegestrationStatus.UPCOMING,
        ],
      },
    },
  });

  if (
    semesterRegistrationInfo?.status === SemesterRegestrationStatus.UPCOMING
  ) {
    throw new ApiError(
      'Registration is not started yet',
      httpStatus.BAD_REQUEST
    );
  }

  let studentRegistration = await prisma.studentSemesterRegistration.findFirst({
    where: {
      student: {
        id: studentInfo?.id,
      },
      semesterRegistration: {
        id: semesterRegistrationInfo?.id,
      },
    },
  });

  if (!studentRegistration) {
    studentRegistration = await prisma.studentSemesterRegistration.create({
      // we can just insert id but connect is another way of insert relation related field
      data: {
        student: {
          connect: {
            id: studentInfo?.id,
          },
        },
        semesterRegistration: {
          connect: {
            id: semesterRegistrationInfo?.id,
          },
        },
      },
    });
  }

  return {
    semesterRegistration: semesterRegistrationInfo,
    studentSemesterRegistration: studentRegistration,
  };
};

const enrollIntoCourse = async (
  authUserId: string,
  payload: IEnrollCoursePayload
) => {
  const student = await prisma.student.findFirst({
    where: {
      studentId: authUserId,
    },
  });

  const semesterRegistration = await prisma.semesterRegestration.findFirst({
    where: {
      status: SemesterRegestrationStatus.ONGOING,
    },
  });

  const offeredCourse = await prisma.offeredCourse.findFirst({
    where: {
      id: payload.offeredCourseId,
    },
    include: {
      course: true,
    },
  });
  const offeredCourseSection = await prisma.offeredCourseSection.findFirst({
    where: {
      id: payload.offeredCourseSectionId,
    },
  });

  if (!student) {
    throw new ApiError('Student not found!', httpStatus.NOT_FOUND);
  }

  if (!semesterRegistration) {
    throw new ApiError(
      'Semester Registration not found!',
      httpStatus.NOT_FOUND
    );
  }
  if (!offeredCourse) {
    throw new ApiError('Offered Course not found!', httpStatus.NOT_FOUND);
  }
  if (!offeredCourseSection) {
    throw new ApiError(
      'Offered Course Section not found!',
      httpStatus.NOT_FOUND
    );
  }

  if (
    offeredCourseSection.maxCapacity &&
    offeredCourseSection.currentlyEnrolledStudent &&
    offeredCourseSection.currentlyEnrolledStudent >=
      offeredCourseSection.maxCapacity
  ) {
    throw new ApiError('Student capacity is full!', httpStatus.BAD_REQUEST);
  }

  await prisma.$transaction(async transactionClient => {
    await transactionClient.studentSemesterRegistrationCourse.create({
      data: {
        studentId: student?.id,
        semesterRegistrationId: semesterRegistration?.id,
        offeredCourseId: payload.offeredCourseId,
        offeredCourseSectionId: payload.offeredCourseSectionId,
      },
    });

    await transactionClient.offeredCourseSection.update({
      where: {
        id: payload.offeredCourseSectionId,
      },
      data: {
        currentlyEnrolledStudent: {
          increment: 1,
        },
      },
    });

    await transactionClient.studentSemesterRegistration.updateMany({
      where: {
        student: {
          id: student.id,
        },
        semesterRegistration: {
          id: semesterRegistration.id,
        },
      },
      data: {
        totalCreditsTaken: {
          increment: offeredCourse.course.credits,
        },
      },
    });
  });

  return {
    message: 'Successfully enrolled into course',
  };
};

const withdrewFromCourse = async (
  authUserId: string,
  payload: IEnrollCoursePayload
): Promise<{
  message: string;
}> => {
  const student = await prisma.student.findFirst({
    where: {
      studentId: authUserId,
    },
  });

  const semesterRegistration = await prisma.semesterRegestration.findFirst({
    where: {
      status: SemesterRegestrationStatus.ONGOING,
    },
  });

  const offeredCourse = await prisma.offeredCourse.findFirst({
    where: {
      id: payload.offeredCourseId,
    },
    include: {
      course: true,
    },
  });

  if (!student) {
    throw new ApiError('Student not found!', httpStatus.NOT_FOUND);
  }

  if (!semesterRegistration) {
    throw new ApiError(
      'Semester Registration not found!',
      httpStatus.NOT_FOUND
    );
  }
  if (!offeredCourse) {
    throw new ApiError('Offered Course not found!', httpStatus.NOT_FOUND);
  }

  await prisma.$transaction(async transactionClient => {
    await transactionClient.studentSemesterRegistrationCourse.delete({
      where: {
        semesterRegistrationId_studentId_offeredCourseId: {
          semesterRegistrationId: semesterRegistration?.id,
          studentId: student?.id,
          offeredCourseId: payload.offeredCourseId,
        },
      },
    });

    await transactionClient.offeredCourseSection.update({
      where: {
        id: payload.offeredCourseSectionId,
      },
      data: {
        currentlyEnrolledStudent: {
          decrement: 1,
        },
      },
    });

    await transactionClient.studentSemesterRegistration.updateMany({
      where: {
        student: {
          id: student.id,
        },
        semesterRegistration: {
          id: semesterRegistration.id,
        },
      },
      data: {
        totalCreditsTaken: {
          decrement: offeredCourse.course.credits,
        },
      },
    });
  });

  return {
    message: 'Successfully withdraw from course',
  };
};

const confirmMyRegistration = async (
  authUserId: string
): Promise<{ message: string }> => {
  const semesterRegistration = await prisma.semesterRegestration.findFirst({
    where: {
      status: SemesterRegestrationStatus.ONGOING,
    },
  });

  // 3 - 6
  const studentSemesterRegistration =
    await prisma.studentSemesterRegistration.findFirst({
      where: {
        semesterRegistration: {
          id: semesterRegistration?.id,
        },
        student: {
          studentId: authUserId,
        },
      },
    });

  if (!studentSemesterRegistration) {
    throw new ApiError(
      'You are not recognized for this semester!',
      httpStatus.BAD_REQUEST
    );
  }

  if (studentSemesterRegistration.totalCreditsTaken === 0) {
    throw new ApiError(
      'You are not enrolled in any course!',
      httpStatus.BAD_REQUEST
    );
  }

  if (
    studentSemesterRegistration.totalCreditsTaken &&
    semesterRegistration?.minCredit &&
    semesterRegistration.maxCredit &&
    (studentSemesterRegistration.totalCreditsTaken <
      semesterRegistration?.minCredit ||
      studentSemesterRegistration.totalCreditsTaken >
        semesterRegistration?.maxCredit)
  ) {
    throw new ApiError(
      `You can take only ${semesterRegistration.minCredit} to ${semesterRegistration.maxCredit} credits`,
      httpStatus.BAD_REQUEST
    );
  }

  await prisma.studentSemesterRegistration.update({
    where: {
      id: studentSemesterRegistration.id,
    },
    data: {
      isConfirmed: true,
    },
  });
  return {
    message: 'Your registration is confirmed!',
  };
};

const getMyRegistration = async (authUserId: string) => {
  const semesterRegistration = await prisma.semesterRegestration.findFirst({
    where: {
      status: SemesterRegestrationStatus.ONGOING,
    },
    include: {
      academicSemester: true,
    },
  });

  const studentSemesterRegistration =
    await prisma.studentSemesterRegistration.findFirst({
      where: {
        semesterRegistration: {
          id: semesterRegistration?.id,
        },
        student: {
          studentId: authUserId,
        },
      },
      include: {
        student: true,
      },
    });

  return { semesterRegistration, studentSemesterRegistration };
};

export const SemesterRegestrationServices = {
  insertIntoDB,
  getAllFromDB,
  getDataById,
  updateDataById,
  deleteDataById,
  startMyRegistration,
  enrollIntoCourse,
  withdrewFromCourse,
  confirmMyRegistration,
  getMyRegistration,
};
