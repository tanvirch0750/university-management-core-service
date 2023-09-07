import { RequestHandler } from 'express';
import httpStatus from 'http-status';
import { paginationFields } from '../../../constants/paginationFields';
import ApiError from '../../../errors/ApiError';
import catchAsync from '../../../shared/catchAsync';
import pick from '../../../shared/pick';
import sendResponse from '../../../shared/sendResponse';
import { studentFilterableFields } from '../student/student.constant';
import { StudentEnrolledCourseService } from './studentEnrolledCourse.service';

export const insertIntoDB: RequestHandler = catchAsync(async (req, res) => {
  const data = req.body;
  const result = await StudentEnrolledCourseService.insertIntoDB(data);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    status: 'success',
    message: 'StudentEnrolledCourse created successfully',
    data: result,
  });
});

export const getAllFromDB: RequestHandler = catchAsync(
  async (req, res, next) => {
    const filters = pick(req.query, studentFilterableFields);
    const paginationOptions = pick(req.query, paginationFields);

    const result = await StudentEnrolledCourseService.getAllFromDB(
      filters,
      paginationOptions
    );

    if (result.data.length === 0) {
      return next(
        new ApiError('No student enrolled course found!', httpStatus.NOT_FOUND)
      );
    }

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      status: 'success',
      message: 'StudentEnrolledCourse retrived successfully',
      meta: result.meta,
      data: result.data,
    });
  }
);

const getDataById: RequestHandler = catchAsync(async (req, res, next) => {
  const result = await StudentEnrolledCourseService.getByIdFromDB(
    req.params.id
  );

  if (!result) {
    return next(
      new ApiError(
        `No Student enrolloed course found with this id`,
        httpStatus.NOT_FOUND
      )
    );
  }

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    status: 'success',
    message: 'StudentEnrolledCourse retrived successfully',
    data: result,
  });
});

const updateDataById: RequestHandler = catchAsync(async (req, res, next) => {
  const payload = req.body;

  const result = await StudentEnrolledCourseService.updateOneInDB(
    req.params.id,
    payload
  );

  if (!result) {
    return next(
      new ApiError(
        `No Student enrolled found with this id`,
        httpStatus.NOT_FOUND
      )
    );
  }

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    status: 'success',
    message: 'StudentEnrolledCourse updated successfully',
    data: result,
  });
});

const deleteDataById: RequestHandler = catchAsync(async (req, res, next) => {
  const result = await StudentEnrolledCourseService.deleteByIdFromDB(
    req.params.id
  );

  if (!result) {
    return next(
      new ApiError(
        `No Student enrolled course found with this id`,
        httpStatus.NOT_FOUND
      )
    );
  }

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    status: 'success',
    message: 'StudentEnrolledCourse deleted successfully',
    data: result,
  });
});

export const StudentEnrolledCourseController = {
  insertIntoDB,
  getAllFromDB,
  getDataById,
  updateDataById,
  deleteDataById,
};
