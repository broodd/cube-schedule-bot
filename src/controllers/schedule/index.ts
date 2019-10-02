import { ContextMessageUpdate } from 'telegraf';
import { match } from 'telegraf-i18n';
import Stage from 'telegraf/stage';
import Scene from 'telegraf/scenes/base';
import moment from 'moment';
import { getScheldure } from './middlewares';
import { getScheldureByDate, scheldureHTML, getScheldureDaysMenu } from './helpers';
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
  match('keyboards.scheldure_keyboard.today'),
  getScheldure,
  (ctx: ContextMessageUpdate) =>
    scheldureHTML(ctx, moment().day())
);

schedule.hears(
  match('keyboards.scheldure_keyboard.tommorow'), 
  getScheldure,
  (ctx: ContextMessageUpdate) => 
    scheldureHTML(ctx, moment().day() + 1)
);

schedule.command(
  'day',
  getScheldure,
  (ctx: ContextMessageUpdate) => {
    const day: any = ctx.message.text.split(' ')[1]

    scheldureHTML(ctx, day)
  }
)

schedule.hears(
  match('keyboards.scheldure_keyboard.days_of_week'),
  (ctx: ContextMessageUpdate) =>
    ctx.reply(ctx.i18n.t('scenes.schedule.choose_day'), getScheldureDaysMenu(ctx))
);

schedule.action(
  /day/,
  getScheldure,
  async (ctx: ContextMessageUpdate) => {
    const { p } = JSON.parse(ctx.callbackQuery.data);
    
    scheldureHTML(ctx, p + 1)
    await ctx.answerCbQuery();
  }
);

export default schedule;
