import { IPermission, IUserPermission } from "../interfaces/client.interface";
import { TPermissionTypes } from "../interfaces/permission.interface";

export const capitalizeName = (name: string): string => {
  const words: string[] = name.split(' ');

  const capitalizedWords: string[] = words.map((word) => {
    if (word.length > 0) {
      return word[0].toUpperCase() + word.slice(1).toLowerCase();
    }
    return '';
  });

  return capitalizedWords.join(' ');
};

export const isEmpty = (value: any) => {
  if (value === undefined || value === null || value === '') {
    return true;
  }

  if (typeof value === 'string' || Array.isArray(value)) {
    return value.length === 0;
  }

  if (typeof value === 'object') {
    return Object.keys(value).length === 0;
  }

  return false;
};

export const hasPermission = (permissions: IUserPermission[], targetName: TPermissionTypes): boolean => {
  return permissions?.some(permission => permission.permission_name.name === targetName);
}