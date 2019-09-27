import { ITeacher } from '../../models/Teacher';

/**
 * Displays menu with a list of movies
 * @param teachers - list of movies
 */
export function getTeachersHTML(teachers: ITeacher[]) {
  return teachers.map(item => {
    return `${item.fullName}\n<b>${item.phones.join(', ')}</b>\n<i>${item.lessons}</i>`
  }).join('\n\n')
}
