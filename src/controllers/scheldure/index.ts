import { ContextMessageUpdate } from 'telegraf';
import { match } from 'telegraf-i18n';
import Stage from 'telegraf/stage';
import Scene from 'telegraf/scenes/base';
import moment from 'moment';
import { getScheldure } from './middlewares';
import { getScheldureByDate, getScheldureHTML, getScheldureDaysMenu } from './helpers';
import { getMainKeyboard, getBackKeyboard, getScheldureBoard } from '../../util/keyboards';
import logger from '../../util/logger';

const { leave } = Stage;
const scheldure = new Scene('scheldure');

scheldure.enter(async (ctx: ContextMessageUpdate) => {
  logger.debug(ctx, 'Enters scheldure scene');
  const { scheldureKeyBoard } = getScheldureBoard(ctx);

  await ctx.reply(ctx.i18n.t('scenes.movies.no_movies_in_collection'), scheldureKeyBoard);
});

scheldure.leave(async (ctx: ContextMessageUpdate) => {
  logger.debug(ctx, 'Leaves scheldure scene');
  const { mainKeyboard } = getMainKeyboard(ctx);
  await ctx.reply(ctx.i18n.t('shared.what_next'), mainKeyboard);
});

scheldure.command('saveme', leave());
scheldure.hears(match('keyboards.back_keyboard.back'), leave());

scheldure.hears(match('keyboards.scheldure_keyboard.today'), getScheldure, (ctx: ContextMessageUpdate) => {
  ctx.replyWithHTML(getScheldureHTML(ctx, moment().day()))
});

scheldure.hears(match('keyboards.scheldure_keyboard.tommorow'), getScheldure, (ctx: ContextMessageUpdate) => {
  ctx.replyWithHTML(getScheldureHTML(ctx, moment().day() + 1))
});

scheldure.hears(match('keyboards.scheldure_keyboard.days_of_week'), getScheldure, (ctx: ContextMessageUpdate) => {
  ctx.reply(ctx.i18n.t('scenes.scheldure.choose_day'), getScheldureDaysMenu(ctx));
});

scheldure.action(/day/, getScheldure, async (ctx: ContextMessageUpdate) => {
  const { p } = JSON.parse(ctx.callbackQuery.data);
  
  await ctx.replyWithHTML(getScheldureHTML(ctx, p + 1))
  await ctx.answerCbQuery();
});

export default scheldure;
