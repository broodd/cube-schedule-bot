import { ContextMessageUpdate, Markup } from 'telegraf';
import Stage from 'telegraf/stage';
import Scene from 'telegraf/scenes/base';
import WizardScene from 'telegraf/scenes/wizard';
import logger from '../../util/logger';
import User from '../../models/User';
import { getMainKeyboard } from '../../util/keyboards';
import { getAccountConfirmKeyboard } from './helpers'


const userInfoWizard = new WizardScene('user-info-wizard',
	(ctx: ContextMessageUpdate) => {
		ctx.reply('Введи імя')
		return ctx.wizard.next()
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

		await ctx.reply(ctx.i18n.t('scenes.start.userinfo'))
		await ctx.reply(
			Object.keys(ctx.wizard.state).map(key => ctx.wizard.state[key]).join('\n'),
			getAccountConfirmKeyboard(ctx)
		)
	},
	async (ctx: ContextMessageUpdate) => {
		logger.debug(ctx, 'User info updated');
		const uid = String(ctx.from.id);
		await User.findOneAndUpdate(
			{ _id: uid },
			{
				_id: uid,
				username: ctx.from.username,
				nickname: ctx.from.first_name + ' ' + ctx.from.last_name,
				name: ctx.wizard.state.name,
				surname: ctx.wizard.state.surname,
				phones: ctx.wizard.state.phones,
			},
			{ upsert: true }
		);
		await ctx.scene.leave();
		// return await ctx.reply('Choose language / Виберіть мову', getLanguageKeyboard());
	}
)

userInfoWizard.action(/back/, async (ctx: ContextMessageUpdate) => {
	console.log('--- back action', );
	ctx.wizard.selectStep(0)
	await ctx.answerCbQuery();
})

userInfoWizard.action(/okey/, async (ctx: ContextMessageUpdate) => {
	console.log('--- okey action');
	ctx.wizard.next()
	await ctx.answerCbQuery();

	
	// ctx.scene.reenter()
})

// userInfoWizard.use(async (ctx: ContextMessageUpdate, next: Function) => {
// 	if ((ctx.message && ctx.message.text) || (ctx.callbackQuery))
// 		return next()

// 	await ctx.wizard.back()
// 	await ctx.reply('try_again')
// 	await ctx.answerCbQuery();
// 	return;
// })

export default userInfoWizard