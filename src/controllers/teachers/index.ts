import { ContextMessageUpdate } from 'telegraf';
import { match } from 'telegraf-i18n';
import Stage from 'telegraf/stage';
import Scene from 'telegraf/scenes/base';
import { getTeachers } from './helpers';
import Teacher from '../../models/Teacher';
import { getMainKeyboard, getBackKeyboard } from '../../util/keyboards';
import logger from '../../util/logger';

const { leave } = Stage;
const teachers = new Scene('teachers');

teachers.enter(async (ctx: ContextMessageUpdate) => {
  logger.debug(ctx, 'Enters teacher scene');
  const { backKeyboard } = getBackKeyboard(ctx);
  
  const teachers = await Teacher.find();
  // saveToSession(ctx, 'teachers', teachers);

  if (teachers.length) {
    await ctx.reply(ctx.i18n.t('scenes.teachers.list_of_teachers'));
    await ctx.replyWithHTML(getTeachers(teachers), backKeyboard);
    await ctx.reply(ctx.i18n.t('scenes.teachers.seach_teachers'));
  } else {
    await ctx.reply(ctx.i18n.t('scenes.movies.no_movies_in_collection'), backKeyboard);
  }
});

teachers.leave(async (ctx: ContextMessageUpdate) => {
  logger.debug(ctx, 'Leaves teacher scene');
  const { mainKeyboard } = getMainKeyboard(ctx);
  await ctx.reply(ctx.i18n.t('shared.what_next'), mainKeyboard);
});

teachers.command('saveme', leave());
teachers.hears(match('keyboards.back_keyboard.back'), leave());

teachers.on('text', async (ctx: ContextMessageUpdate) => {
  var regex = new RegExp(ctx.message.text, "ig");
  const teachers = await Teacher.find({
    $or: [
      { name: { $regex: regex }, },
      { surname: { $regex: regex }, },
      { fathername: { $regex: regex } }
    ]
  })

  if (!teachers || !teachers.length) {
    await ctx.reply(ctx.i18n.t('scenes.search.no_found'));
    return;
  }

  await ctx.reply(ctx.i18n.t('scenes.search.list_of_found_teachers'))
  await ctx.replyWithHTML(getTeachers(teachers));
});

export default teachers;
