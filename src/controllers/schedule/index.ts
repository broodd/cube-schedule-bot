import { ContextMessageUpdate, Markup, Extra } from 'telegraf';
import { match } from 'telegraf-i18n';
import Stage from 'telegraf/stage';
import Scene from 'telegraf/scenes/base';
import moment from 'moment';
import { scheldureHTML } from './helpers';
import { getMainKeyboard, getBackKeyboard, getScheldureBoard } from '../../util/keyboards';
import logger from '../../util/logger';
import { deleteFromSession } from '../../util/session';

const { leave } = Stage;
const schedule = new Scene('schedule');

schedule.enter(async (ctx: ContextMessageUpdate) => {
  logger.debug(ctx, 'Enters schedule scene');
	const { scheldureKeyBoard } = getScheldureBoard(ctx);

  await ctx.reply(ctx.i18n.t('scenes.schedule.what_next'), scheldureKeyBoard);
});

schedule.leave(async (ctx: ContextMessageUpdate) => {
  logger.debug(ctx, 'Leaves schedule scene');
  const { mainKeyboard } = getMainKeyboard(ctx);
  deleteFromSession(ctx, 'user');
  
  await ctx.reply(ctx.i18n.t('shared.what_next'), mainKeyboard);
});

schedule.command('saveme', leave());
schedule.hears(match('keyboards.back_keyboard.back'), leave());

schedule.hears(
  match('keyboards.scheldure_keyboard.yersterday'),
  (ctx: ContextMessageUpdate) =>
    scheldureHTML(ctx, moment().add(-1, 'days'))
);

schedule.hears(
  match('keyboards.scheldure_keyboard.today'),
  (ctx: ContextMessageUpdate) =>
    scheldureHTML(ctx, moment())
);

schedule.hears(
  match('keyboards.scheldure_keyboard.tommorow'), 
  (ctx: ContextMessageUpdate) => 
    scheldureHTML(ctx, moment().add(1, 'days'))
);

schedule.hears(
  match('keyboards.scheldure_keyboard.prev_week'), 
  (ctx: ContextMessageUpdate) => {
		const week = moment().week();
		const fromDate = moment().week(week - 1).day(1);
		const toDate = moment().week(week - 1).day(7);
		
    scheldureHTML(ctx, fromDate, toDate)
	}
);

schedule.hears(
  match('keyboards.scheldure_keyboard.next_week'), 
  (ctx: ContextMessageUpdate) => {
		const week = moment().week();
		const fromDate = moment().week(week + 1).day(1);
		const toDate = moment().week(week + 1).day(7);

    scheldureHTML(ctx, fromDate, toDate)
	}
);

for (let day = 1; day <= 7; day++) {
	schedule.hears(
		match('scenes.schedule.days_min.' + day),
		async (ctx: ContextMessageUpdate) => {
			await scheldureHTML(ctx, moment().day(day))
		}
	);
}

export default schedule;
