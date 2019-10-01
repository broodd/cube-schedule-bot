import { IUser } from '../../models/User';

/**
 * Displays menu with a list of movies
 * @param teachers - list of movies
 */
export function getClassmatesHTML(teachers: IUser[]) {
  return teachers.map(item => {
    return `${item.fullName}\n<b>${item.phones.join(', ')}</b>`
  }).join('\n\n')
}
