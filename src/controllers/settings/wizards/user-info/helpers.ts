import { ContextMessageUpdate, Extra, Markup } from 'telegraf';

/**
 * Returns button that user has to click to create user info in DB
 */
export function getUserInfoConfirmKeyboard(ctx: ContextMessageUpdate) {
  return Extra.HTML().markup((m: Markup) =>
    m.inlineKeyboard(
      [
        m.callbackButton(
          ctx.i18n.t('scenes.start.back'),
          JSON.stringify({ a: 'back' }),
          false
        ),
        m.callbackButton(
          ctx.i18n.t('scenes.start.next'),
          JSON.stringify({ a: 'confirmUserInfo' }),
          false
        )
      ],
      {}
    )
  );
}