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
  logger.debug(ctx, 'Leaves teacher scene');
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
  ctx.reply('Вибери день', getScheldureDaysMenu(ctx));
});

export default scheldure;
