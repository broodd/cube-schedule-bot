import { Extra, Markup, ContextMessageUpdate, Button, CallbackButton } from 'telegraf';
import { schedule } from 'schedule';
import moment, { Moment } from 'moment'

/**
 * Displays menu with a list of movies
 * @param ctx - telegram context
 * @param day - number of day
 */
export function getScheldureByDate(ctx: ContextMessageUpdate, day?: number): schedule[] {
	if (day === undefined) {
		return ctx.schedule
	}

	let week = moment().week()

	if (moment().day() == 0 || moment().day() > 5) {
		week += 1
	}
	if (day == 0 || day > 5) {
		day = 1
	}
	
	const date = moment().day(day).week(week).format('DD.MM.YYYY')

	return ctx.schedule.filter(item => item.date == date)
}

/**
 * Displays menu with a list of movies
 * @param ctx - telegram context
 * @param day - number of day
 */
export function scheldureHTML(ctx: ContextMessageUpdate, day?: number) {
  const schedule: schedule[] = getScheldureByDate(ctx, day)

  if (schedule.length) {
		const resultShcedule: string = schedule.map(item => {
			let title: string = ctx.i18n.t('scenes.schedule.day.title', {
				lessons_length: item.lessons.length,
				lessons_alias: ctx.i18n.t('scenes.schedule.lessons'),
				day: ctx.i18n.t('scenes.schedule.days.' + (moment(item.date, 'DD.MM.YYYY').day())),
				date: item.date
			});

			let lessons: string = item.lessons.map(({ number, from, to, description }) => {
				return ctx.i18n.t('scenes.schedule.day.lesson', {
					number,
					from,
					to,
					description
				})
			}).join('\n\n')

			return [title, lessons].join('\n\n')
		}).join('\n\n* * *\n\n')

		ctx.replyWithHTML(resultShcedule);
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
		array.push(m.callbackButton(ctx.i18n.t('scenes.schedule.days.all'), 'all', false)) as any;

    return m.inlineKeyboard(array, {
      wrap: (btn: Button, index: number) => index % 2 == 0
    })
  });
}