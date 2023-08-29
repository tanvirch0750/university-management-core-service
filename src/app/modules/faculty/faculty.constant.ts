export const facultySearchableFields = [
  'firstName',
  'lastName',
  'middleName',
  'email',
  'contactNo',
  'facultyId',
  'designation',
];

export const facultyFilterableFields = [
  'searchTerm',
  'facultyId',
  'email',
  'contactNo',
  'gender',
  'bloodGroup',
  'gender',
  'designation',
  'academicFacultyId',
  'academicDepartmentId',
];

export const facultyRelationalFields: string[] = [
  'academicFacultyId',
  'academicDepartmentId',
];
export const facultyRelationalFieldsMapper: { [key: string]: string } = {
  academicFacultyId: 'academicFaculty',
  academicDepartmentId: 'academicDepartment',
};
