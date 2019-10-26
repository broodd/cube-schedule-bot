import rp from 'request-promise';
import { ContextMessageUpdate, Extra, Markup, Button } from 'telegraf';
import WizardScene from 'telegraf/scenes/wizard';
import { getMainKeyboard } from '../../../../util/keyboards';
import { getUserInfoConfirmKeyboard } from './helpers'
import { confirmUserInfo } from './actions';


const userInfoWizard = new WizardScene('user-info-wizard',
  async (ctx: ContextMessageUpdate) => {
    await ctx.reply(ctx.i18n.t('scenes.start.input_real_data'))
    await ctx.reply(ctx.i18n.t('scenes.start.input_group_name'))
    
    return ctx.wizard.next()
  },
  async (ctx: ContextMessageUpdate) => {
    const inputGroup = ctx.message.text.toUpperCase().trim()

    let options = {
      method: 'GET',
      url: process.env.API_URL + '/groups',
      qs: {
        inputGroup,
      },
      json: true
    }
    try {
			let data = await rp(options) 

			const groups = data.filter((item: any) => {
				return item.group.includes(inputGroup)
			})

      if (groups.length) {
				

				const buttons = Extra.HTML().markup((m: Markup) => {
					return m.inlineKeyboard(
						groups.map((item: any) => {
							return m.callbackButton(
								item.group,
								JSON.stringify({ a: 'group', p: item.group }),
								false
							)
						}),
						{ wrap: (btn: Button, index: number) => index % 2 == 0 }
					)
				})

				// let buttons: any = Markup.keyboard(
				// 	groups.map((item: any) => item.group),
				// 	{ wrap: (btn: Button, index: number) => index % 3 == 0 }
				// );
				// buttons = buttons.resize().extra();

				ctx.reply('choose your group', buttons);
      } else {
				await ctx.reply(ctx.i18n.t('scenes.start.try_again'))
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

// when choose group
userInfoWizard.action(
	/group/,
	async (ctx: ContextMessageUpdate) => {
		if (!ctx.wizard.state.group) {
			const { p } = JSON.parse(ctx.callbackQuery.data);
			ctx.wizard.state.group = p
			await ctx.reply(ctx.i18n.t('scenes.start.input_name'))
			ctx.wizard.next()
		}

		await ctx.answerCbQuery();
	}
);

export default userInfoWizard