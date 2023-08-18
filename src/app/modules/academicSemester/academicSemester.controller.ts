import { RequestHandler } from 'express';
import httpStatus from 'http-status';
import { paginationFields } from '../../../constants/paginationFields';
import ApiError from '../../../errors/ApiError';
import catchAsync from '../../../shared/catchAsync';
import pick from '../../../shared/pick';
import sendResponse from '../../../shared/sendResponse';
import { academeicSemesterFilterableFields } from './academicSemester.constant';
import { AcademicSemesterServices } from './academicSemester.service';

export const insertIntoDB: RequestHandler = catchAsync(async (req, res) => {
  const data = req.body;
  const result = await AcademicSemesterServices.insertIntoDB(data);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    status: 'success',
    message: 'Academic semester created successfully',
    data: result,
  });
});

export const getAllFromDB: RequestHandler = catchAsync(
  async (req, res, next) => {
    const filters = pick(req.query, academeicSemesterFilterableFields);
    const paginationOptions = pick(req.query, paginationFields);

    const result = await AcademicSemesterServices.getAllFromDB(
      filters,
      paginationOptions
    );

    if (result.data.length === 0) {
      return next(new ApiError('No semesters found!', httpStatus.NOT_FOUND));
    }

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      status: 'success',
      message: 'Semesters retrived successfully',
      meta: result.meta,
      data: result.data,
    });
  }
);

const getDataById: RequestHandler = catchAsync(async (req, res, next) => {
  const result = await AcademicSemesterServices.getDataById(req.params.id);

  if (!result) {
    return next(
      new ApiError(`No semesters found with this id`, httpStatus.NOT_FOUND)
    );
  }

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    status: 'success',
    message: 'Academic semester retrived successfully',
    data: result,
  });
});

export const AcademicSemesterController = {
  insertIntoDB,
  getAllFromDB,
  getDataById,
};
