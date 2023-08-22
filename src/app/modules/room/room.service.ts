import { Prisma, Room } from '@prisma/client';
import { calculatePagination } from '../../../helpers/paginationHelper';
import { IGenericPaginationResponse } from '../../../interfaces/genericPaginationResponse';
import { IpaginationOptions } from '../../../interfaces/paginationOptions';
import { findFilterConditions } from '../../../shared/findFilterConditions';
import { orderByConditions } from '../../../shared/orderCondition';
import prisma from '../../../shared/prisma';
import { roomSearchableFields } from './room.constant';
import { IRoomFilters } from './room.interface';

const insertIntoDB = async (data: Room): Promise<Room> => {
  const result = await prisma.room.create({
    data,
    include: {
      building: true,
    },
  });
  return result;
};

const getAllFromDB = async (
  filters: IRoomFilters,
  options: IpaginationOptions
): Promise<IGenericPaginationResponse<Room[]>> => {
  const { page, limit, skip } = calculatePagination(options);
  const { searchTerm, ...filterData } = filters;

  const andConditions = findFilterConditions(
    searchTerm,
    filterData,
    roomSearchableFields
  );

  const whereConditons: Prisma.RoomWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const orderCondition = orderByConditions(options);

  const result = await prisma.room.findMany({
    include: {
      building: true,
    },
    where: whereConditons,
    skip,
    take: limit,
    orderBy: orderCondition,
  });

  const total = await prisma.room.count();

  return {
    meta: {
      total,
      page,
      limit,
    },
    data: result,
  };
};

const getDataById = async (id: string): Promise<Room | null> => {
  const result = await prisma.room.findUnique({
    where: {
      id,
    },
    include: {
      building: true,
    },
  });
  return result;
};

const updateDataById = async (
  id: string,
  payload: Partial<Room>
): Promise<Room> => {
  const result = await prisma.room.update({
    where: {
      id,
    },
    data: payload,
    include: {
      building: true,
    },
  });

  return result;
};

const deleteDataById = async (id: string): Promise<Room> => {
  const result = await prisma.room.delete({
    where: {
      id,
    },
    include: {
      building: true,
    },
  });

  return result;
};

export const RoomServices = {
  insertIntoDB,
  getAllFromDB,
  getDataById,
  updateDataById,
  deleteDataById,
};
