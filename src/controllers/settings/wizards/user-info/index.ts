import rp from 'request-promise';
import { ContextMessageUpdate, Markup, Button, Extra } from 'telegraf';
import { match } from 'telegraf-i18n';
import Stage from 'telegraf/stage';
const { leave } = Stage;
import WizardScene from 'telegraf/scenes/wizard';
import User from '../../../../models/User'
import { getUserInfoConfirmKeyboard } from './helpers';


const editUserInfoWizard = new WizardScene('edit-user-info-wizard',
  async (ctx: ContextMessageUpdate) => {
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

// when choose group
editUserInfoWizard.action(
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

editUserInfoWizard.hears(match('keyboards.back_keyboard.back'), leave());

export default editUserInfoWizard