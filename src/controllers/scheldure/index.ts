import { ContextMessageUpdate } from 'telegraf';
import { match } from 'telegraf-i18n';
import Stage from 'telegraf/stage';
import Scene from 'telegraf/scenes/base';
import rp from 'request-promise'
import { getMainKeyboard, getBackKeyboard } from '../../util/keyboards';
import logger from '../../util/logger';

const { leave } = Stage;
const scheldure = new Scene('scheldure');

scheldure.enter(async (ctx: ContextMessageUpdate) => {
  logger.debug(ctx, 'Enters teacher scene');
  const { backKeyboard } = getBackKeyboard(ctx);

  rp(process.env.SCHELDURE_API_URL).then(data => {
    console.log(typeof data);
    console.log(JSON.parse(data));
  })
  // const replace:string = response.replace(/`/g, '__').replace(/'/g, '__')
  // const scheldure = JSON.parse(`${replace}`)
  
  await ctx.reply(ctx.i18n.t('scenes.movies.no_movies_in_collection'), backKeyboard);
});

scheldure.leave(async (ctx: ContextMessageUpdate) => {
  logger.debug(ctx, 'Leaves teacher scene');
  const { mainKeyboard } = getMainKeyboard(ctx);
  await ctx.reply(ctx.i18n.t('shared.what_next'), mainKeyboard);
});

scheldure.command('saveme', leave());
scheldure.hears(match('keyboards.back_keyboard.back'), leave());

export default scheldure;
