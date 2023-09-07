/* eslint-disable @typescript-eslint/no-explicit-any */
import { RequestHandler } from 'express';
import httpStatus from 'http-status';
import { paginationFields } from '../../../constants/paginationFields';
import ApiError from '../../../errors/ApiError';
import catchAsync from '../../../shared/catchAsync';
import pick from '../../../shared/pick';
import sendResponse from '../../../shared/sendResponse';
import { semesterRegistrationFilterableFields } from './semesterRegistration.constant';
import { SemesterRegestrationServices } from './semesterRegistration.service';

export const insertIntoDB: RequestHandler = catchAsync(async (req, res) => {
  const data = req.body;
  const result = await SemesterRegestrationServices.insertIntoDB(data);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    status: 'success',
    message: 'Semester Registration created successfully',
    data: result,
  });
});

export const getAllFromDB: RequestHandler = catchAsync(
  async (req, res, next) => {
    const filters = pick(req.query, semesterRegistrationFilterableFields);
    const paginationOptions = pick(req.query, paginationFields);

    const result = await SemesterRegestrationServices.getAllFromDB(
      filters,
      paginationOptions
    );

    if (result.data.length === 0) {
      return next(
        new ApiError('No semester register found!', httpStatus.NOT_FOUND)
      );
    }

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      status: 'success',
      message: 'Semester registration retirved successfully',
      meta: result.meta,
      data: result.data,
    });
  }
);

const getDataById: RequestHandler = catchAsync(async (req, res, next) => {
  const result = await SemesterRegestrationServices.getDataById(req.params.id);

  if (!result) {
    return next(
      new ApiError(
        `No semester regestration found with this id`,
        httpStatus.NOT_FOUND
      )
    );
  }

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    status: 'success',
    message: 'Semester Regestration retrived successfully',
    data: result,
  });
});

const updateDataById: RequestHandler = catchAsync(async (req, res, next) => {
  const payload = req.body;

  const result = await SemesterRegestrationServices.updateDataById(
    req.params.id,
    payload
  );

  if (!result) {
    return next(
      new ApiError(
        `No semester registration found with this id`,
        httpStatus.NOT_FOUND
      )
    );
  }

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    status: 'success',
    message: 'Semister registration updated successfully',
    data: result,
  });
});

const deleteDataById: RequestHandler = catchAsync(async (req, res, next) => {
  const result = await SemesterRegestrationServices.deleteDataById(
    req.params.id
  );

  if (!result) {
    return next(
      new ApiError(
        `No semester regestration found with this id`,
        httpStatus.NOT_FOUND
      )
    );
  }

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    status: 'success',
    message: 'semester regestration deleted successfully',
    data: result,
  });
});

export const startMyRegistrationCreate: RequestHandler = catchAsync(
  async (req, res) => {
    const user = (req as any).user;
    const result = await SemesterRegestrationServices.startMyRegistration(
      user.userId
    );

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      status: 'success',
      message: 'Student Semester Registration created successfully',
      data: result,
    });
  }
);

export const enrollIntoCourse: RequestHandler = catchAsync(async (req, res) => {
  const user = (req as any).user;

  const result = await SemesterRegestrationServices.enrollIntoCourse(
    user.userId,
    req.body
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    status: 'success',
    message: 'Student Semester Registration course enrolled successfully',
    data: result,
  });
});

export const withdrawFromCourse: RequestHandler = catchAsync(
  async (req, res) => {
    const user = (req as any).user;

    const result = await SemesterRegestrationServices.withdrewFromCourse(
      user.userId,
      req.body
    );

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      status: 'success',
      message: 'Student Wihdraw from enrolled course successfully',
      data: result,
    });
  }
);

export const confirmMyRegistration: RequestHandler = catchAsync(
  async (req, res) => {
    const user = (req as any).user;
    const result = await SemesterRegestrationServices.confirmMyRegistration(
      user.userId
    );

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      status: 'success',
      message: 'Registration confirmed',
      data: result,
    });
  }
);

export const getMyRegistration: RequestHandler = catchAsync(
  async (req, res) => {
    const user = (req as any).user;
    const result = await SemesterRegestrationServices.getMyRegistration(
      user.userId
    );

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      status: 'success',
      message: 'Registration retrived successfully',
      data: result,
    });
  }
);

export const startNewSemester: RequestHandler = catchAsync(async (req, res) => {
  const { id } = req.params;

  const result = await SemesterRegestrationServices.startNewSemester(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    status: 'success',
    message: 'Semester started successfuly',
    data: result,
  });
});

export const SemesterRegistrationController = {
  insertIntoDB,
  getAllFromDB,
  getDataById,
  updateDataById,
  deleteDataById,
  startMyRegistrationCreate,
  enrollIntoCourse,
  withdrawFromCourse,
  confirmMyRegistration,
  getMyRegistration,
  startNewSemester,
};
