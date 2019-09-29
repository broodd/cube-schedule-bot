import { ContextMessageUpdate, Markup } from 'telegraf';
import Stage from 'telegraf/stage';
import Scene from 'telegraf/scenes/base';
import WizardScene from 'telegraf/scenes/wizard';
import logger from '../../../util/logger';
import User from '../../../models/User';
import { getMainKeyboard } from '../../../util/keyboards';

const userInfoWizard = new WizardScene('user-info-wizard',
	(ctx: ContextMessageUpdate) => {
		ctx.reply('Введи імя')
		return ctx.wizard.next()
	},
	(ctx: ContextMessageUpdate) => {
		ctx.wizard.state.name = ctx.message.text

		ctx.reply('Введи прізвище')
		return ctx.wizard.next();
	},
	(ctx: ContextMessageUpdate) => {
		ctx.wizard.state.surname = ctx.message.text

		ctx.reply('Введи номер(и) телефону');
		return ctx.wizard.next();
	},
	async (ctx: ContextMessageUpdate) => {
		ctx.wizard.state.phones = ctx.message.text.split(/[\s,]+/)

		await ctx.reply(ctx.i18n.t('scenes.start.userinfo'))
		await ctx.reply(Object.keys(ctx.wizard.state).map(key => ctx.wizard.state[key]).join('\n'))

		logger.debug(ctx, 'New user has been created');
		await User.findOneAndUpdate(
      { _id: ctx.from.id },
      {
        _id: String(ctx.from.id),
        username: ctx.from.username,
        nickname: ctx.from.first_name + ' ' + ctx.from.last_name,
        name: ctx.wizard.state.name,
        surname: ctx.wizard.state.surname,
        phones: ctx.wizard.state.phones,
        observableMovies: [],
        totalMovies: 0
      },
      { upsert: true }
    );
		await ctx.scene.leave();
		// return await ctx.reply('Choose language / Виберіть мову', getLanguageKeyboard());
	}
)

userInfoWizard.use(async (ctx: ContextMessageUpdate, next: Function) => {
	if (ctx.message.text)
		return next()

	await ctx.wizard.back()
	await ctx.reply('try_again')
	return;
})

export default userInfoWizard