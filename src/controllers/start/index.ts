import { ContextMessageUpdate, Markup } from 'telegraf';
import Stage from 'telegraf/stage';
import Scene from 'telegraf/scenes/base';
import WizardScene from 'telegraf/scenes/wizard';
import { languageChangeAction } from './actions';
import { getLanguageKeyboard } from './helpers';
import logger from '../../util/logger';
import User from '../../models/User';
import { getMainKeyboard } from '../../util/keyboards';

const { leave } = Stage;
const start = new Scene('start');

start.enter(async (ctx: ContextMessageUpdate) => {
	logger.debug(ctx, 'Enters start scene');

	const uid = String(ctx.from.id);
	const user = await User.findById(uid);
	
	if (false) {
		const { mainKeyboard } = getMainKeyboard(ctx);
		await ctx.reply(ctx.i18n.t('scenes.start.welcome_back'), mainKeyboard);
	} else {
		logger.debug(ctx, 'New user has been created');

		await ctx.reply('Choose language / Виберіть мову', getLanguageKeyboard());
	}
});

start.action(/languageChange/, languageChangeAction);

start.hears(/(.*?)/, async (ctx: ContextMessageUpdate) => {
	await ctx.reply('choose some');
});

export default start;
