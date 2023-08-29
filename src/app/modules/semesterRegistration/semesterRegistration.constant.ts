export const semesterRegistrationFilterableFields: string[] = [
  'searchTerm',
  'id',
  'status',
  'academicSemesterId',
];

export const semesterRegistrationSearchableFields: string[] = ['status'];

export const semesterRegistrationRelationalFields: string[] = [
  'academicSemesterId',
];
export const semesterRegistrationRelationalFieldsMapper: {
  [key: string]: string;
} = {
  academicSemesterId: 'academicSemester',
};
