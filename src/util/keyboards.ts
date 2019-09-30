import { Markup, ContextMessageUpdate } from 'telegraf';

/**
 * Returns back keyboard and its buttons according to the language
 * @param ctx - telegram context
 */
export const getBackKeyboard = (ctx: ContextMessageUpdate) => {
  const backKeyboardBack = ctx.i18n.t('keyboards.back_keyboard.back');
  let backKeyboard: any = Markup.keyboard([backKeyboardBack]);

  backKeyboard = backKeyboard.resize().extra();

  return {
    backKeyboard,
    backKeyboardBack
  };
};

/**
 * Returns main keyboard and its buttons according to the language
 * @param ctx - telegram context
 */
export const getMainKeyboard = (ctx: ContextMessageUpdate) => {
  const mainKeyboardSearchMovies = ctx.i18n.t('keyboards.main_keyboard.search');
  const mainKeyboardMyCollection = ctx.i18n.t('keyboards.main_keyboard.movies');
  const mainKeyboardSettings = ctx.i18n.t('keyboards.main_keyboard.settings');
  const mainKeyboardAbout = ctx.i18n.t('keyboards.main_keyboard.about');
  const mainKeyboardSupport = ctx.i18n.t('keyboards.main_keyboard.support');
  const mainKeyboardContact = ctx.i18n.t('keyboards.main_keyboard.contact');
  const mainKeyboardTeachers = ctx.i18n.t('keyboards.main_keyboard.teachers');
  const mainKeyboardScheldure = ctx.i18n.t('keyboards.main_keyboard.scheldure');
  const mainKeyboardClassmates = ctx.i18n.t('keyboards.main_keyboard.classmates');
  const mainKeyboardMem = ctx.i18n.t('other.mem');
  let mainKeyboard: any = Markup.keyboard([
    // [mainKeyboardSearchMovies, mainKeyboardMyCollection],
    [mainKeyboardScheldure, mainKeyboardMem],
    [mainKeyboardClassmates, mainKeyboardTeachers],
    [mainKeyboardSettings, mainKeyboardAbout],
    [mainKeyboardSupport, mainKeyboardContact]
  ]);
  mainKeyboard = mainKeyboard.resize().extra();

  return {
    mainKeyboard,
    mainKeyboardSearchMovies,
    mainKeyboardMyCollection,
    mainKeyboardSettings,
    mainKeyboardAbout,
    mainKeyboardSupport,
    mainKeyboardContact,
    mainKeyboardScheldure,
    mainKeyboardTeachers,
    mainKeyboardClassmates,
    mainKeyboardMem
  };
};


/**
 * Returns scheldure & back keyboard
 * @param ctx - telegram context
 */
export const getScheldureBoard = (ctx: ContextMessageUpdate) => {
  const scheldureKeyBoardToday = ctx.i18n.t('keyboards.scheldure_keyboard.today');
  const scheldureKeyBoardTommorow = ctx.i18n.t('keyboards.scheldure_keyboard.tommorow');
  const scheldureKeyBoardDays = ctx.i18n.t('keyboards.scheldure_keyboard.days_of_week');
  const scheldureKeyBoardBack = ctx.i18n.t('keyboards.back_keyboard.back');
  let scheldureKeyBoard: any = Markup.keyboard([
    [scheldureKeyBoardToday, scheldureKeyBoardTommorow],
    [scheldureKeyBoardDays, scheldureKeyBoardBack]
  ]);
  scheldureKeyBoard = scheldureKeyBoard.resize().extra();

  return {
    scheldureKeyBoard,
    scheldureKeyBoardToday,
    scheldureKeyBoardTommorow,
    scheldureKeyBoardDays,
    scheldureKeyBoardBack
  };
};
