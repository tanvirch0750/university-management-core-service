export const findFilterConditions = (
  searchTerm: string | undefined,
  filtersData: object,
  searchableFields: string[]
) => {
  const andConditions = [];
  if (searchTerm) {
    andConditions.push({
      $or: searchableFields.map(field => ({
        [field]: {
          $regex: searchTerm,
          $options: 'i',
        },
      })),
    });
  }

  if (Object.keys(filtersData).length) {
    andConditions.push({
      $and: Object.entries(filtersData).map(([field, value]) => ({
        [field]: value,
      })),
    });
  }

  return andConditions;
};
