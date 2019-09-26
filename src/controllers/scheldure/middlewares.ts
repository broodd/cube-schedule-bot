import { ContextMessageUpdate } from 'telegraf';
import { IMovie } from '../../models/Movie';
import rp from 'request-promise'

/**
 * Exposes required movie according to the given callback data
 * @param ctx - telegram context
 * @param next - next function
 */
export async function getScheldure(ctx: ContextMessageUpdate, next: Function) {
  // TODO: maybe save scheldure in session & update it
  // let scheldure = ctx.session.scheldure
  
  let options = {
    method: 'GET',
    url: 'http://rozklad.nung.edu.ua/api/schedules.php',
    qs: {
      group_name: 'ІП-19-1К',
      week: 2
    }
  }
  let response = await rp(options)
  response = response.replace(/'/ig, '').replace(/`/ig, '\'').replace(String.fromCharCode(65279), '')
  const scheldure = JSON.parse(response.toString())
  
  if (scheldure) {
    ctx.scheldure = scheldure;

    return next();
  }
  return ctx.reply(ctx.i18n.t('scenes.scheldure.not_found'))
}
