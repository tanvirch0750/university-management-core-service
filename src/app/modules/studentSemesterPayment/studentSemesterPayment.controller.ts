import { RequestHandler } from 'express';
import httpStatus from 'http-status';
import ApiError from '../../../errors/ApiError';
import catchAsync from '../../../shared/catchAsync';
import pick from '../../../shared/pick';
import sendResponse from '../../../shared/sendResponse';
import { studentSemesterPaymentFilterableFields } from './studentSemesterPayment.constant';
import { StudentSemesterPaymentService } from './studentSemesterPayment.service';

export const getAllFromDB: RequestHandler = catchAsync(
  async (req, res, next) => {
    const filters = pick(req.query, studentSemesterPaymentFilterableFields);
    const options = pick(req.query, ['limit', 'page', 'sortBy', 'sortOrder']);
    const result = await StudentSemesterPaymentService.getAllFromDB(
      filters,
      options
    );

    if (result.data.length === 0) {
      return next(new ApiError('No payments found!', httpStatus.NOT_FOUND));
    }

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      status: 'success',
      message: 'Student payments retrived successfully',
      meta: result.meta,
      data: result.data,
    });
  }
);

export const StudentSemesterPaymentController = {
  getAllFromDB,
};
