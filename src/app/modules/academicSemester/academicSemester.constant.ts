import { ISemesterCode, ISemesterTitle } from './academicSemester.interface';

export const academicSemesterSearchableFields = [
  'title',
  'year',
  'code',
  'startMonth',
  'endMonth',
];

export const academeicSemesterFilterableFields = [
  'searchTerm',
  'title',
  'code',
  'year',
  'startMonth',
  'endMonth',
];

export const academicSemesterTitle: ISemesterTitle[] = [
  'Autumn',
  'Summer',
  'Fall',
];

export const academicSemeseterCode: ISemesterCode[] = ['01', '02', '03'];

export const academicSemesterTitleCodeMapper: {
  [key: string]: string;
} = {
  Autumn: '01',
  Summer: '02',
  Fall: '03',
};
