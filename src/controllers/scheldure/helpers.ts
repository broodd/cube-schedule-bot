import { Extra, Markup, ContextMessageUpdate, Button } from 'telegraf';
import { Scheldure } from 'scheldure';
import moment from 'moment'
import scheldure from '.';

/**
 * Get scheldure by date
 * @param ctx - telegram context
 */
export function getScheldureByDate(ctx: ContextMessageUpdate, day: number = 1): Scheldure {
  if (!moment().day() || day > 5)
    day = 1
  
  const date = moment().day(day).format('DD.MM.YYYY')
  
  return ctx.scheldure.find(item => item.date == date)
}

/**
 * Displays menu with a list of movies
 * @param teachers - list of movies
 */
export function getScheldureHTML(ctx: ContextMessageUpdate, day?: number) {
  const scheldure: Scheldure = getScheldureByDate(ctx, day)

  if (scheldure) {
    let title = `<b>${scheldure.lessons.length}  ${ctx.i18n.t('scenes.scheldure.lessons')}</b> ${scheldure.verbose}  ${scheldure.date}.`
    let body = scheldure.lessons.map(item => {
      return `(№${item.number}) <b>${item.from} - ${item.to}</b>\n${item.description}`
    }).join('\n\n')
    
    return [title, body].join('\n\n')
  } else {
    return ctx.i18n.t('shared.not_found')
  }
}

/**
 * Displays menu with a list of days of week
 * @param movies - list of movies
 */
export function getScheldureDaysMenu(ctx: ContextMessageUpdate,) {
  return Extra.HTML().markup((m: Markup) => {

    let array:any[] = new Array(5).fill(undefined).map((item, index) => {
      return m.callbackButton(
        `${ctx.i18n.t('scenes.scheldure.days.' + index)}`,
        JSON.stringify({ a: 'day', p: index }),
        false
      )
    }).push(m.callbackButton('😎', 'cool', false))

    return m.inlineKeyboard(array, {
      wrap: (btn: Button, index: number, currentRow: any) => currentRow.length >= (index + 1) / 2
    })
  });
}