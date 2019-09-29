import { ContextMessageUpdate, Extra, Markup } from 'telegraf';

export function getAccountConfirmKeyboard(ctx: ContextMessageUpdate) {
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
					JSON.stringify({ a: 'okey' }),
					false
				)
			],
			{}
		)
	);
}