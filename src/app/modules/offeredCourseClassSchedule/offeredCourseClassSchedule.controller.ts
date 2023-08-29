import { RequestHandler } from 'express';
import httpStatus from 'http-status';
import { paginationFields } from '../../../constants/paginationFields';
import ApiError from '../../../errors/ApiError';
import catchAsync from '../../../shared/catchAsync';
import pick from '../../../shared/pick';
import sendResponse from '../../../shared/sendResponse';
import { offeredCourseClassScheduleFilterableFields } from './offeredCourseClassSchedule.constant';
import { OfferedCourseClassScheduleServices } from './offeredCourseClassSchedule.service';

export const insertIntoDB: RequestHandler = catchAsync(async (req, res) => {
  const data = req.body;
  const result = await OfferedCourseClassScheduleServices.insertIntoDB(data);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    status: 'success',
    message: 'Offered Course Class Schedule created successfully',
    data: result,
  });
});

export const getAllFromDB: RequestHandler = catchAsync(
  async (req, res, next) => {
    const filters = pick(req.query, offeredCourseClassScheduleFilterableFields);
    const paginationOptions = pick(req.query, paginationFields);

    const result = await OfferedCourseClassScheduleServices.getAllFromDB(
      filters,
      paginationOptions
    );

    if (result.data.length === 0) {
      return next(
        new ApiError(
          'No offered course class schedule found!',
          httpStatus.NOT_FOUND
        )
      );
    }

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      status: 'success',
      message: 'Offered course class schedule retirved successfully',
      meta: result.meta,
      data: result.data,
    });
  }
);

export const OfferedCourseClassScheduleController = {
  insertIntoDB,
  getAllFromDB,
};
