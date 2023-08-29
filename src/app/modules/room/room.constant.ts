export const roomSearchableFields = ['roomNumber', 'floor', 'buildingId'];

export const roomFilterableFields = ['searchTerm', 'roomNumber', 'floor'];

export const roomRelationalFields: string[] = ['buildingId'];
export const roomRelationalFieldsMapper: { [key: string]: string } = {
  buildingId: 'building',
};
