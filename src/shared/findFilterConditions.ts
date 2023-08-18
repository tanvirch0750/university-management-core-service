/* eslint-disable @typescript-eslint/no-explicit-any */
export const findFilterConditions = (
  searchTerm: string | undefined,
  filtersData: object,
  searchableFields: string[]
) => {
  const andConditions = [];

  if (searchTerm) {
    andConditions.push({
      OR: searchableFields.map(field => ({
        [field]: {
          contains: searchTerm,
          mode: 'insensitive',
        },
      })),
    });
  }

  if (Object.keys(filtersData).length > 0) {
    andConditions.push({
      AND: Object.keys(filtersData).map(key => ({
        [key]: {
          equals: (filtersData as any)[key],
        },
      })),
    });
  }

  return andConditions;
};
