import { ITeacher } from '../../models/Teacher';

/**
 * Displays menu with a list of movies
 * @param teachers - list of movies
 */
export function getTeachersHTML(teachers: ITeacher[]) {
  return teachers.map(item => {
    return `${item.surname} ${item.name} ${item.fathername}\n<b>${item.phones}</b>\n<i>${item.lessons}</i>`
  }).join('\n\n')
}
