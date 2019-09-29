import { ContextMessageUpdate, Markup } from 'telegraf';
import Stage from 'telegraf/stage';
import Scene from 'telegraf/scenes/base';
import WizardScene from 'telegraf/scenes/wizard';
import logger from '../../util/logger';
import User from '../../models/User';
import { getMainKeyboard } from '../../util/keyboards';
import { getUserInfoConfirmKeyboard, getAccountConfirmKeyboard } from './helpers'
import { confirmUserInfo } from './actions';


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
			getUserInfoConfirmKeyboard(ctx)
		)
	}
)

userInfoWizard.action(/back/, async (ctx: ContextMessageUpdate) => {
	console.log('--- back action');
	await ctx.answerCbQuery();
	await ctx.wizard.selectStep(0)
	await ctx.reply('try_again')
})
userInfoWizard.action(/confirmUserInfo/, confirmUserInfo)
userInfoWizard.action(/confirmAccount/, async (ctx: ContextMessageUpdate) => {
	await ctx.answerCbQuery();
	await ctx.scene.leave();

	const { mainKeyboard } = getMainKeyboard(ctx);
	await ctx.reply(ctx.i18n.t('shared.what_next'), mainKeyboard);
})

userInfoWizard.use(async (ctx: ContextMessageUpdate, next: Function) => {
	if ((ctx.message && ctx.message.text) || (ctx.callbackQuery))
		return next()

	await ctx.wizard.back()
	await ctx.reply('try_again')
	// await ctx.answerCbQuery();
	return;
})

export default userInfoWizard