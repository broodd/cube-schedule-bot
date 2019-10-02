
import rp from 'request-promise';
import { ContextMessageUpdate, Markup } from 'telegraf';
import WizardScene from 'telegraf/scenes/wizard';
import User from '../../../../models/User'
import { getUserInfoConfirmKeyboard } from './helpers';


const editUserInfoWizard = new WizardScene('edit-user-info-wizard',
  async (ctx: ContextMessageUpdate) => {
    await ctx.reply(ctx.i18n.t('scenes.start.input_real_data'))
    await ctx.reply(ctx.i18n.t('scenes.start.input_group_name'))

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
        await ctx.reply(ctx.i18n.t('scenes.start.group_info', {
          department: data.department,
          group: data.group
        }))

        ctx.wizard.state.group = group.toUpperCase()
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

// action back => input user data
editUserInfoWizard.action(/back/, async (ctx: ContextMessageUpdate) => {
  await ctx.answerCbQuery();
  await ctx.wizard.selectStep(0)
  await ctx.reply(ctx.i18n.t('scenes.start.try_again'))
})

editUserInfoWizard.action(/confirmUserInfo/, async (ctx: ContextMessageUpdate) => {
  const uid = String(ctx.from.id);
  const user = await User.findOneAndUpdate(
    { _id: uid },
    {
      _id: uid,
      username: ctx.from.username,
      nickname: ctx.from.first_name + ' ' + ctx.from.last_name,
      name: ctx.wizard.state.name,
      surname: ctx.wizard.state.surname,
      phones: ctx.wizard.state.phones,
      group: ctx.wizard.state.group,
      language: ctx.session.language
    },
    {
      setDefaultsOnInsert: true,
      new: true,
      upsert: true
    }
  );

  await ctx.answerCbQuery();
  
  await ctx.scene.leave();
  await ctx.scene.enter('settings')
})

editUserInfoWizard.use(async (ctx: ContextMessageUpdate, next: Function) => {
  if ((ctx.message && ctx.message.text) || (ctx.callbackQuery))
    return next()

  await ctx.reply(ctx.i18n.t('scenes.start.try_again'))
  return;
})

export default editUserInfoWizard