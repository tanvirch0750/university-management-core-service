export const academicDepartmentSearchableFields = ['title'];

export const academeicDepartmentFilterableFields = [
  'searchTerm',
  'title',
  'academicFacultyId',
];

export const academicDepartmentRelationalFields: string[] = [
  'academicFacultyId',
];
export const academicDepartmentRelationalFieldsMapper: {
  [key: string]: string;
} = {
  academicFacultyId: 'academicFaculty',
};
