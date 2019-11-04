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
  const mainKeyboardSettings = ctx.i18n.t('keyboards.main_keyboard.settings');
  const mainKeyboardAbout = ctx.i18n.t('keyboards.main_keyboard.about');
  const mainKeyboardSupport = ctx.i18n.t('keyboards.main_keyboard.support');
  const mainKeyboardContact = ctx.i18n.t('keyboards.main_keyboard.contact');
  const mainKeyboardTeachers = ctx.i18n.t('keyboards.main_keyboard.teachers');
  const mainKeyboardScheldure = ctx.i18n.t('keyboards.main_keyboard.schedule');
  const mainKeyboardClassmates = ctx.i18n.t('keyboards.main_keyboard.classmates');
  const mainKeyboardMem = ctx.i18n.t('other.mem');
  let mainKeyboard: any = Markup.keyboard([
    [mainKeyboardScheldure, mainKeyboardMem],
    [mainKeyboardClassmates, mainKeyboardTeachers],
    [mainKeyboardSettings, mainKeyboardAbout],
    [mainKeyboardSupport, mainKeyboardContact]
  ]);
  mainKeyboard = mainKeyboard.resize().extra();

  return {
    mainKeyboard,
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
 * Returns schedule & back keyboard
 * @param ctx - telegram context
 */
export const getScheldureBoard = (ctx: ContextMessageUpdate) => {
	const scheldureKeyBoardYersterday = ctx.i18n.t('keyboards.scheldure_keyboard.yersterday');
	const scheldureKeyBoardToday = ctx.i18n.t('keyboards.scheldure_keyboard.today');
	const scheldureKeyBoardTommorow = ctx.i18n.t('keyboards.scheldure_keyboard.tommorow');
	// const scheldureKeyBoardPrevWeek = ctx.i18n.t('keyboards.scheldure_keyboard.prev_week');
	// const scheldureKeyBoardNextWeek = ctx.i18n.t('keyboards.scheldure_keyboard.next_week');
	const scheldureKeyBoardBack = ctx.i18n.t('keyboards.back_keyboard.back');
	let days: any[] = new Array(7)
		.fill(undefined)
		.map((item: any, index: number) => {
			return `${ctx.i18n.t('scenes.schedule.days_min.' + (+index + 1))}`
		})

	let scheldureKeyBoard: any = Markup.keyboard([
		days,
		[scheldureKeyBoardYersterday, scheldureKeyBoardToday, scheldureKeyBoardTommorow],
		// [scheldureKeyBoardPrevWeek, scheldureKeyBoardNextWeek],
		[scheldureKeyBoardBack]
	])
	scheldureKeyBoard = scheldureKeyBoard.resize().extra();

  return {
		scheldureKeyBoard,
		scheldureKeyBoardYersterday,
		scheldureKeyBoardToday,
		scheldureKeyBoardTommorow,
		scheldureKeyBoardPrevWeek,
		scheldureKeyBoardNextWeek,
		scheldureKeyBoardBack
  };
};
