import { ContextMessageUpdate } from 'telegraf';
import { getAccountConfirmKeyboard } from './helpers';
import { sleep } from '../../util/common';
import logger from '../../util/logger';
import User from '../../models/User';
import { updateLanguage } from '../../util/language';


export const confirmUserInfo = async (ctx: ContextMessageUpdate) => {
	console.log('--- okey action');

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
	// await ctx.scene.leave();

	const accountConfirmKeyboard = getAccountConfirmKeyboard(ctx);
	accountConfirmKeyboard.disable_web_page_preview = true;

	await ctx.reply(ctx.i18n.t('scenes.start.new_account'));
	await sleep(3);
	await ctx.reply(ctx.i18n.t('scenes.start.bot_description'), accountConfirmKeyboard);

	await ctx.answerCbQuery();
}