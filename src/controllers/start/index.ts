import { ContextMessageUpdate, Markup } from 'telegraf';
import Stage from 'telegraf/stage';
import Scene from 'telegraf/scenes/base';
import WizardScene from 'telegraf/scenes/wizard'
import { languageChangeAction, backAction } from './actions';
import { getLanguageKeyboard } from './helpers';
import logger from '../../util/logger';
import User from '../../models/User';
import { getMainKeyboard } from '../../util/keyboards';

const { leave } = Stage;
const start = new Scene('start');

import stage from '../../stage'

start.enter(async (ctx: ContextMessageUpdate) => {
  const uid = String(ctx.from.id);
  const user = await User.findById(uid);
  const { mainKeyboard } = getMainKeyboard(ctx);

  if (user) {
    console.log('---', user);
    await ctx.reply(ctx.i18n.t('scenes.start.welcome_back'), mainKeyboard);
  } else {
    logger.debug(ctx, 'New user has been created');

    let userinfo = {} as any;
    const userInfoWizard = new WizardScene(
      "userinfo",
      (ctx: ContextMessageUpdate) => {
        ctx.reply('Введи імя')
        return ctx.wizard.next()
      },
      (ctx: ContextMessageUpdate) => {
        userinfo.name = ctx.message.text

        ctx.reply('Введи прізвище')
        return ctx.wizard.next();
      },
      (ctx: ContextMessageUpdate) => {
        userinfo.surname = ctx.message.text

        ctx.reply('Введи номер(и) телефону');
        return ctx.wizard.next();
      },
      async (ctx: ContextMessageUpdate) => {
        userinfo.phones = ctx.message.text.split(/[\s,]+/)

        await ctx.reply(ctx.i18n.t('scenes.start.userinfo'))
        await ctx.reply(Object.keys(userinfo).map(key => userinfo[key]).join('\n'))
        const now = new Date().getTime();

        const newUser = new User({
          _id: uid,
          created: now,
          username: ctx.from.username,
          nickname: ctx.from.first_name + ' ' + ctx.from.last_name,
          name: userinfo.name,
          surname: userinfo.surname,
          phones: userinfo.phones,
          observableMovies: [],
          lastActivity: now,
          totalMovies: 0
        });


        await newUser.save();
        await ctx.scene.leave();
        return await ctx.reply('Choose language / Виберіть мову', getLanguageKeyboard());
      }
    );
    stage.register(userInfoWizard);
    return await ctx.scene.enter('userinfo');
  }
});

// start.action(match('keyboards.back_keyboard.back'), backAction);

start.leave(async (ctx: ContextMessageUpdate) => {
  console.log('---', ctx.scene);
  const { mainKeyboard } = getMainKeyboard(ctx);

  await ctx.reply(ctx.i18n.t('shared.what_next'), mainKeyboard);
});

start.command('saveme', leave());
start.action(/languageChange/, languageChangeAction);
start.action(/confirmAccount/, async (ctx: ContextMessageUpdate) => {
  await ctx.answerCbQuery();
  ctx.scene.leave();
});

export default start;
