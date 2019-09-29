import { ContextMessageUpdate, Extra, Markup } from 'telegraf';

/**
 * Returns button that user has to click to create user info in DB
 */
export function getUserInfoConfirmKeyboard(ctx: ContextMessageUpdate) {
	return Extra.HTML().markup((m: Markup) =>
		m.inlineKeyboard(
			[
				m.callbackButton(
					// ctx.i18n.t('scenes.start.lets_go'),
					'Back',
					JSON.stringify({ a: 'back' }),
					false
				),
				m.callbackButton(
					// ctx.i18n.t('scenes.start.lets_go'),
					'Okey',
					JSON.stringify({ a: 'confirmUserInfo' }),
					false
				)
			],
			{}
		)
	);
}

/**
 * Returns button that user has to click to start working with the bot
 */
export function getAccountConfirmKeyboard(ctx: ContextMessageUpdate) {
	return Extra.HTML().markup((m: Markup) =>
		m.inlineKeyboard(
			[
				m.callbackButton(
					ctx.i18n.t('scenes.start.lets_go'),
					JSON.stringify({ a: 'confirmAccount' }),
					false
				)
			],
			{}
		)
	);
}
