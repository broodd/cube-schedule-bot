import { ContextMessageUpdate } from 'telegraf';
import { getAccountConfirmKeyboard } from './helpers';
import { sleep } from '../../util/common';
import { updateLanguage } from '../../util/language';
import logger from '../../util/logger';
import User from '../../models/User';


export const languageChangeAction = async (ctx: ContextMessageUpdate) => {
  const langData = JSON.parse(ctx.callbackQuery.data);
	await updateLanguage(ctx, langData.p, false);

	ctx.scene.enter('user-info-wizard')
	
  await ctx.answerCbQuery();
};

export const confirmUserInfo = async (ctx: ContextMessageUpdate) => {
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
      group: ctx.wizard.state.group,
      language: ctx.session.language
    },
    {
      setDefaultsOnInsert: true,
      new: true,
      upsert: true
    }
  );

  const accountConfirmKeyboard = getAccountConfirmKeyboard(ctx);
  accountConfirmKeyboard.disable_web_page_preview = true;

  await ctx.reply(ctx.i18n.t('scenes.start.new_account'));
  await sleep(2);
  await ctx.reply(ctx.i18n.t('scenes.start.bot_description'), accountConfirmKeyboard);

  await ctx.answerCbQuery();
}