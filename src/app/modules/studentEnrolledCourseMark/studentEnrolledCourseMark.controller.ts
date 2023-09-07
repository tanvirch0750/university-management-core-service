import { RequestHandler } from 'express';
import httpStatus from 'http-status';
import { paginationFields } from '../../../constants/paginationFields';
import ApiError from '../../../errors/ApiError';
import catchAsync from '../../../shared/catchAsync';
import pick from '../../../shared/pick';
import sendResponse from '../../../shared/sendResponse';

import { studentEnrolledCourseMarkFilterableFields } from './studentEnrolledCourseMark.constant';
import { StudentEnrolledCourseMarkService } from './studentEnrolledCourseMark.service';

export const getAllFromDB: RequestHandler = catchAsync(
  async (req, res, next) => {
    const filters = pick(req.query, studentEnrolledCourseMarkFilterableFields);
    const options = pick(req.query, paginationFields);
    const result = await StudentEnrolledCourseMarkService.getAllFromDB(
      filters,
      options
    );

    if (result.data.length === 0) {
      return next(
        new ApiError('No student marks found!', httpStatus.NOT_FOUND)
      );
    }

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      status: 'success',
      message: 'Student course marks fetched successfully',
      meta: result.meta,
      data: result.data,
    });
  }
);

export const updateStudentMarks: RequestHandler = catchAsync(
  async (req, res) => {
    const result = await StudentEnrolledCourseMarkService.updateStudentMarks(
      req.body
    );

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      status: 'success',
      message: 'Student marks updated!',
      data: result,
    });
  }
);

export const updateFinalMarks: RequestHandler = catchAsync(async (req, res) => {
  const result = await StudentEnrolledCourseMarkService.updateFinalMarks(
    req.body
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    status: 'success',
    message: 'Student final marks updated!',
    data: result,
  });
});

export const StudentEnrolledCourseMarkConroller = {
  getAllFromDB,
  updateStudentMarks,
  updateFinalMarks,
};
