import { Extra, Markup, ContextMessageUpdate, Button, CallbackButton } from 'telegraf';
import { schedule } from 'schedule';
import moment, { Moment } from 'moment'

/**
 * Displays menu with a list of movies
 * @param ctx - telegram context
 * @param day - number of day
 */
export function getScheldureByDate(ctx: ContextMessageUpdate, day: number): schedule {
  ctx.day = day

  if (day == 0 || day > 4)
    ctx.day = 1

  const date = moment().day(day).format('DD.MM.YYYY')

  
	// console.log('--- day', day, moment().day(day).week());
	// let week = moment().week()
	// if (day == 0 || day == 5) {
	// 	ctx.day = 1
	// }
	// if (day == 5) {
	// 	week += 1
	// }
	
	// const date = moment().day(ctx.day).week(week).format('DD.MM.YYYY')
  
  return ctx.schedule.find(item => item.date == date)
}

/**
 * Displays menu with a list of movies
 * @param ctx - telegram context
 * @param day - number of day
 */
export function scheldureHTML(ctx: ContextMessageUpdate, day: number) {
  const schedule: schedule = getScheldureByDate(ctx, day)

  if (schedule) {
    let title: string = ctx.i18n.t('scenes.schedule.day.title', {
      lessons_length: schedule.lessons.length,
      lessons_alias: ctx.i18n.t('scenes.schedule.lessons'),
      day: ctx.i18n.t('scenes.schedule.days.' + (ctx.day)),
      date: schedule.date
    });
    let lessons: string = schedule.lessons.map(({ number, from, to, description }) => {
      return ctx.i18n.t('scenes.schedule.day.lesson', {
        number,
        from,
        to,
        description
      })
    }).join('\n\n')
    
    ctx.replyWithHTML([title, lessons].join('\n\n'))
  } else {
    ctx.reply(ctx.i18n.t('shared.not_found'))
  }
}

/**
 * Displays menu with a list of days of week & mem
 * @param ctx - telegram context
 */
export function getScheldureDaysMenu(ctx: ContextMessageUpdate) {
  return Extra.HTML().markup((m: Markup) => {

    let array: any[] = new Array(5).fill(undefined).map((item: any, index: number) => {
      return m.callbackButton(
        `${ctx.i18n.t('scenes.schedule.days.' + (+index + 1))}`,
        JSON.stringify({ a: 'day', p: index}),
        false
      )
		})
		array.push(m.callbackButton(ctx.i18n.t('other.mem'), 'mem', false)) as any;

    return m.inlineKeyboard(array, {
      wrap: (btn: Button, index: number) => index % 2 == 0
    })
  });
}