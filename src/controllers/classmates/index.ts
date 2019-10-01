import { ContextMessageUpdate } from 'telegraf';
import { match } from 'telegraf-i18n';
import Stage from 'telegraf/stage';
import Scene from 'telegraf/scenes/base';
import { getClassmatesHTML } from './helpers';
import User from '../../models/User';
import { getMainKeyboard, getBackKeyboard } from '../../util/keyboards';
import logger from '../../util/logger';

const { leave } = Stage;
const classmates = new Scene('classmates');

classmates.enter(async (ctx: ContextMessageUpdate) => {
  logger.debug(ctx, 'Enters teacher scene');
  const { backKeyboard } = getBackKeyboard(ctx);
  
  const classmates = await User.find({
    group: ctx.session.user.group
  });

  if (classmates.length) {
    await ctx.reply(ctx.i18n.t('scenes.teachers.list_of_teachers'));
    await ctx.replyWithHTML(getClassmatesHTML(classmates), backKeyboard);
    await ctx.reply(ctx.i18n.t('scenes.teachers.search_teachers'));
  } else {
    await ctx.reply(ctx.i18n.t('scenes.teachers.no_have_teachers'), backKeyboard);
  }
});

classmates.leave(async (ctx: ContextMessageUpdate) => {
  logger.debug(ctx, 'Leaves teacher scene');
  const { mainKeyboard } = getMainKeyboard(ctx);
  await ctx.reply(ctx.i18n.t('shared.what_next'), mainKeyboard);
});

classmates.command('saveme', leave());
classmates.hears(match('keyboards.back_keyboard.back'), leave());

classmates.on('text', async (ctx: ContextMessageUpdate) => {
  var regex = new RegExp(ctx.message.text, "ig");
  const classmates = await User.find({
    group: ctx.session.user.group,
    $or: [
      { name: { $regex: regex }, },
      { surname: { $regex: regex }, },
      { fathername: { $regex: regex } }
    ]
  })

  if (!classmates || !classmates.length) {
    await ctx.reply(ctx.i18n.t('scenes.teachers.not_found'));
    return;
  }

  await ctx.reply(ctx.i18n.t('scenes.teachers.list_of_found_teachers'))
  await ctx.replyWithHTML(getClassmatesHTML(classmates));
});

export default classmates;
