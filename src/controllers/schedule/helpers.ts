import { Extra, Markup, ContextMessageUpdate, Button, CallbackButton } from 'telegraf';
import { schedule } from 'schedule';
import moment, { Moment } from 'moment'
import rp from 'request-promise'

/**
 * Get shcedule from IFTUNG API
 * @param ctx - telegram context
 */
export async function getScheldure(ctx: ContextMessageUpdate, from_date: string, to_date: string): Promise<schedule[]> {
	try {
		let options = {
			method: 'GET',
			url: process.env.API_URL + '/groups/schedule',
			qs: {
				group: ctx.session.user.group,
				from_date,
				to_date
			}
		}

		let response = await rp(options)
		// response = response.replace(/'/ig, '').replace(/`/ig, '\'').replace(String.fromCharCode(65279), '')
		const schedule = JSON.parse(response.toString())

		return schedule
	} catch (e) {
		ctx.reply(e.message)
	}
}

/**
 * Display shedule by date
 * @param ctx - telegram context
 * @param from_date - moment, from date
 * @param to_date - moment, to date
 */
export async function scheldureHTML(ctx: ContextMessageUpdate, from_date: Moment, to_date: Moment = from_date) {
	moment.defaultFormat = 'DD.MM.YYYY';
	const schedule: schedule[] = await getScheldure(ctx, from_date.format(), to_date.format())

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
		ctx.reply(ctx.i18n.t('scenes.schedule.not_found'))
	}
}