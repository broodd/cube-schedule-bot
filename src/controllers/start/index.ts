import { ContextMessageUpdate, Markup } from 'telegraf';
import Stage from 'telegraf/stage';
import Scene from 'telegraf/scenes/base';
import WizardScene from 'telegraf/scenes/wizard';
import { languageChangeAction, backAction } from './actions';
import { getLanguageKeyboard } from './helpers';
import logger from '../../util/logger';
import User from '../../models/User';
import { getMainKeyboard } from '../../util/keyboards';

const { leave } = Stage;
const start = new Scene('start');

start.enter(async (ctx: ContextMessageUpdate) => {
	logger.debug(ctx, 'New user has been created');

	const uid = String(ctx.from.id);
	await User.findOneAndUpdate(
		{ _id: uid },
		{
			_id: uid,
			username: ctx.from.username,
			nickname: ctx.from.first_name + ' ' + ctx.from.last_name,
		},
		{ upsert: true }
	);
	await ctx.reply('Choose language / Виберіть мову', getLanguageKeyboard());
});

// start.action(match('keyboards.back_keyboard.back'), backAction);

// start.leave(async (ctx: ContextMessageUpdate) => {
// 	logger.debug(ctx, 'Leave start scene');
//   const { mainKeyboard } = getMainKeyboard(ctx);

//   await ctx.reply(ctx.i18n.t('shared.what_next'), mainKeyboard);
// });

start.command('saveme', leave());
start.action(/languageChange/, languageChangeAction);
start.action(/confirmAccount/, async (ctx: ContextMessageUpdate) => {
	await ctx.answerCbQuery();
	
	logger.debug(ctx, 'Leave start scene');
	const { mainKeyboard } = getMainKeyboard(ctx);

	await ctx.reply(ctx.i18n.t('shared.what_next'), mainKeyboard);
  ctx.scene.leave();
});

export default start;
