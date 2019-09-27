import { ContextMessageUpdate } from 'telegraf';
import logger from './logger';
import rp from 'request-promise';

/**
 * Show mem
 * @param ctx - telegram context
 */
export async function showMem(ctx: ContextMessageUpdate) {
  logger.debug(ctx, 'Show mem');
  const mem = await rp({ url: `https://meme-api.herokuapp.com/gimme`, json: true })

  await ctx.replyWithPhoto({
    url: mem.url,
    filename: 'mem.jpg'
  })
}
