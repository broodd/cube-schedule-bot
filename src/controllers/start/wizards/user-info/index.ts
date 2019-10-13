import rp from 'request-promise';
import { ContextMessageUpdate, Markup } from 'telegraf';
import WizardScene from 'telegraf/scenes/wizard';
import { getMainKeyboard } from '../../../../util/keyboards';
import { getUserInfoConfirmKeyboard } from './helpers'
import { confirmUserInfo } from './actions';


const userInfoWizard = new WizardScene('user-info-wizard',
  async (ctx: ContextMessageUpdate) => {
    ctx.reply(ctx.i18n.t('scenes.start.input_real_data'))
    ctx.reply(ctx.i18n.t('scenes.start.input_group_name'))
    
    return ctx.wizard.next()
  },
  async (ctx: ContextMessageUpdate) => {
    const group = ctx.message.text.toUpperCase()

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
        await ctx.reply(ctx.i18n.t('scenes.start.group_info', {
          department: data.department,
          group: data.group
        }))

        ctx.wizard.state.group = group
        await ctx.reply(ctx.i18n.t('scenes.start.input_name'))
        return ctx.wizard.next()
      }
    } catch (e) {
      await ctx.reply(ctx.i18n.t('scenes.start.try_again'))
    }
  },
  (ctx: ContextMessageUpdate) => {
    ctx.wizard.state.name = ctx.message.text

    ctx.reply(ctx.i18n.t('scenes.start.input_surname'));
    return ctx.wizard.next();
  },
  (ctx: ContextMessageUpdate) => {
    ctx.wizard.state.surname = ctx.message.text

    ctx.reply(ctx.i18n.t('scenes.start.input_phones'));
    return ctx.wizard.next();
  },
  async (ctx: ContextMessageUpdate) => {
    ctx.wizard.state.phones = ctx.message.text.split(/[\s,]+/)

    const { name, surname, group, phones } = ctx.wizard.state
    await ctx.reply(ctx.i18n.t('scenes.start.user_info',
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
  await ctx.reply(ctx.i18n.t('scenes.start.try_again'))
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
  await ctx.reply(ctx.i18n.t('scenes.start.try_again'))
  return;
})

export default userInfoWizard