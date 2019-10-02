import { ContextMessageUpdate, Extra, Markup } from 'telegraf';

/**
 * Displays menu with a list of movies
 * @param movies - list of movies
 */
/**
 * Returns language keyboard
 */
export function getLanguageKeyboard() {
  return Extra.HTML().markup((m: Markup) =>
    m.inlineKeyboard(
      [
        m.callbackButton(`English`, JSON.stringify({ a: 'languageChange', p: 'en' }), false),
        m.callbackButton(`Українська`, JSON.stringify({ a: 'languageChange', p: 'uk' }), false)
      ],
      {}
    )
  );
}
