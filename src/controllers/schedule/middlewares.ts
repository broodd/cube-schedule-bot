import { ContextMessageUpdate } from 'telegraf';
import rp from 'request-promise'

/**
 * Exposes required movie according to the given callback data
 * @param ctx - telegram context
 * @param next - next function
 */
export async function getScheldure(ctx: ContextMessageUpdate, next: Function) {
  try {
    let options = {
      method: 'GET',
      url: 'http://rozklad.nung.edu.ua/api/schedules.php',
      qs: {
        group_name: ctx.session.user.group,
      }
    }
    
    let response = await rp(options)
    response = response.replace(/'/ig, '').replace(/`/ig, '\'').replace(String.fromCharCode(65279), '')
    const schedule = JSON.parse(response.toString())
    
    if (schedule) {
      ctx.schedule = schedule;
      
      return next();
    }
    return ctx.reply(ctx.i18n.t('scenes.schedule.not_found'))
  } catch (e) {
    await ctx.reply(ctx.i18n.t('scenes.schedule.not_found'))
  }
}
