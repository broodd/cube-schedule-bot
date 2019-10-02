import { ContextMessageUpdate } from 'telegraf';
import { updateLanguage } from '../../util/language';


export const languageChangeAction = async (ctx: ContextMessageUpdate) => {
  const langData = JSON.parse(ctx.callbackQuery.data);
	await updateLanguage(ctx, langData.p, false);

	ctx.scene.enter('user-info-wizard')
	
  await ctx.answerCbQuery();
};