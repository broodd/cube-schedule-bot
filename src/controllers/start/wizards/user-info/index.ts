import rp from 'request-promise';
import { ContextMessageUpdate, Markup } from 'telegraf';
import WizardScene from 'telegraf/scenes/wizard';
import logger from '../../../../util/logger';
import User from '../../../../models/User';
import { getMainKeyboard } from '../../../../util/keyboards';
import { getUserInfoConfirmKeyboard, getAccountConfirmKeyboard } from '../../helpers'
import { confirmUserInfo } from '../../actions';


const userInfoWizard = new WizardScene('user-info-wizard',
  async (ctx: ContextMessageUpdate) => {
    await ctx.reply('Будь ласка введи свою персональну інформацію')
    await ctx.reply('Повна назва групи')
    
    return ctx.wizard.next()
  },
  async (ctx: ContextMessageUpdate) => {
    const group = ctx.message.text

    let options = {
      method: 'GET',
      url: 'https://www.ifntung-api.com/groups/exists',
      qs: {
        group,
      },
      json: true
    }
    try {
      let data = await rp(options)
      if (data.group) {
        await ctx.reply(ctx.i18n.t('scenes.start.group-info', {
          department: data.department,
          group: data.group
        }))

        await ctx.reply('Введи імя')
        return ctx.wizard.next()
      }
    } catch (e) {
      await ctx.reply('try_again')
    }

    
  },
  (ctx: ContextMessageUpdate) => {
    ctx.wizard.state.name = ctx.message.text

    ctx.reply('Введи прізвище');
    return ctx.wizard.next();
  },
  (ctx: ContextMessageUpdate) => {
    ctx.wizard.state.surname = ctx.message.text

    ctx.reply('Введи номер(и) телефону');
    return ctx.wizard.next();
  },
  async (ctx: ContextMessageUpdate) => {
    ctx.wizard.state.phones = ctx.message.text.split(/[\s,]+/)

    const { name, surname, group, phones } = ctx.wizard.state
    await ctx.reply(ctx.i18n.t('scenes.start.userinfo',
      {
        group,
        name,
        surname,
        phones: phones.join(', ')
      }),
      getUserInfoConfirmKeyboard(ctx)
    )
  }
)

// action confirmUserInfo => save info and show bot description
userInfoWizard.action(/confirmUserInfo/, confirmUserInfo)

// action back => input user data
userInfoWizard.action(/back/, async (ctx: ContextMessageUpdate) => {
  await ctx.answerCbQuery();
  await ctx.wizard.selectStep(0)
  await ctx.reply('try_again')
})

userInfoWizard.action(/confirmAccount/, async (ctx: ContextMessageUpdate) => {
  await ctx.answerCbQuery();
  await ctx.scene.leave();

  const { mainKeyboard } = getMainKeyboard(ctx);
  await ctx.reply(ctx.i18n.t('shared.what_next'), mainKeyboard);
})

userInfoWizard.use(async (ctx: ContextMessageUpdate, next: Function) => {
  if ((ctx.message && ctx.message.text) || (ctx.callbackQuery))
    return next()

  // await ctx.wizard.back()
  await ctx.reply('try_again')
  return;
})

export default userInfoWizard