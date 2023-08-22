import { RequestHandler } from 'express';
import httpStatus from 'http-status';
import { paginationFields } from '../../../constants/paginationFields';
import ApiError from '../../../errors/ApiError';
import catchAsync from '../../../shared/catchAsync';
import pick from '../../../shared/pick';
import sendResponse from '../../../shared/sendResponse';
import { academeicDepartmentFilterableFields } from './academicDepartment.constant';
import { AcademicDepartmentServices } from './academicDepartment.service';

export const insertIntoDB: RequestHandler = catchAsync(async (req, res) => {
  const data = req.body;
  const result = await AcademicDepartmentServices.insertIntoDB(data);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    status: 'success',
    message: 'Academic department created successfully',
    data: result,
  });
});

export const getAllFromDB: RequestHandler = catchAsync(
  async (req, res, next) => {
    const filters = pick(req.query, academeicDepartmentFilterableFields);
    const paginationOptions = pick(req.query, paginationFields);

    const result = await AcademicDepartmentServices.getAllFromDB(
      filters,
      paginationOptions
    );

    if (result.data.length === 0) {
      return next(
        new ApiError('No academic department found!', httpStatus.NOT_FOUND)
      );
    }

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      status: 'success',
      message: 'Academic department retrived successfully',
      meta: result.meta,
      data: result.data,
    });
  }
);

const getDataById: RequestHandler = catchAsync(async (req, res, next) => {
  const result = await AcademicDepartmentServices.getDataById(req.params.id);

  if (!result) {
    return next(
      new ApiError(
        `No academic department found with this id`,
        httpStatus.NOT_FOUND
      )
    );
  }

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    status: 'success',
    message: 'Academic department retrived successfully',
    data: result,
  });
});

const updateDataById: RequestHandler = catchAsync(async (req, res, next) => {
  const payload = req.body;

  const result = await AcademicDepartmentServices.updateDataById(
    req.params.id,
    payload
  );

  if (!result) {
    return next(
      new ApiError(
        `No academic department found with this id`,
        httpStatus.NOT_FOUND
      )
    );
  }

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    status: 'success',
    message: 'Academic department updated successfully',
    data: result,
  });
});

const deleteDataById: RequestHandler = catchAsync(async (req, res, next) => {
  const result = await AcademicDepartmentServices.deleteDataById(req.params.id);

  if (!result) {
    return next(
      new ApiError(
        `No academic department found with this id`,
        httpStatus.NOT_FOUND
      )
    );
  }

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    status: 'success',
    message: 'Academic department deleted successfully',
    data: result,
  });
});

export const AcademicDepartmentController = {
  insertIntoDB,
  getAllFromDB,
  getDataById,
  updateDataById,
  deleteDataById,
};
