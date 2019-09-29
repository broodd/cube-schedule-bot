require('dotenv').config();
require('./models'); // ficha, cool
import fs from 'fs';
import path from 'path';
import Telegraf, { ContextMessageUpdate, Extra, Markup } from 'telegraf';
import TelegrafI18n, { match } from 'telegraf-i18n';
import session from 'telegraf/session';
import mongoose from 'mongoose';
import rp from 'request-promise';
import User from './models/User';
import logger from './util/logger';

import about from './controllers/about';

import { checkUnreleasedMovies } from './util/notifier';
import asyncWrapper from './util/error-handler';
import { getMainKeyboard } from './util/keyboards';
import { updateLanguage } from './util/language';
import { showMem } from './util/mem';
import { updateUserTimestamp } from './middlewares/update-user-timestamp';
import { getUserInfo } from './middlewares/user-info';
import { isAdmin } from './middlewares/is-admin';
import Telegram from './telegram';
import stage from './stage';
import Teacher from './models/Teacher';

mongoose.connect(`mongodb://localhost:27017/${process.env.DATABASE_HOST}`, {
  useNewUrlParser: true,
	useFindAndModify: false,
	useUnifiedTopology: true
});
mongoose.connection.on('error', err => {
  logger.error(
    undefined,
    `Error occurred during an attempt to establish connection with the database: %O`,
    err
  );
  process.exit(1);
});

mongoose.connection.on('open', () => {
  const bot = new Telegraf(process.env.TELEGRAM_TOKEN);
  const i18n = new TelegrafI18n({
    defaultLanguage: 'en',
    directory: path.resolve(__dirname, 'locales'),
    useSession: true,
    allowMissing: false,
    sessionName: 'session'
  });

  bot.use(session());
  bot.use(i18n.middleware());
  bot.use(stage.middleware());
  bot.use(getUserInfo);

  bot.command('teacher', asyncWrapper(async (ctx: ContextMessageUpdate) => {
    const regex = new RegExp(ctx.message.text.split(' ')[1] || '', 'ig');
    const te = await Teacher.find({
      $or: [
        { name: { $regex: regex }, },
        { surname: { $regex: regex }, },
        { fathername: { $regex: regex } }
      ]
    });
    // const te = await Teacher.aggregate([
    //   {
    //     $project: {
    //       s_field: {
    //         $concatArrays: [["$name"], ["$surname"], ["$fathername"], ["$lessons"]]
    //       }
    //     },
    //   },
    //   {
    //     $match: {
    //       s_field: {
    //         $regex: /Ната/
    //       }
    //     }
    //   },
    //   {
    //     $project: {
    //       _id: 0
    //     }
    //   }
    // ])
    console.log('---', te);

    // const teacher = new Teacher({
    //   name: 'Петро',
    //   surname: 'Тупий',
    //   fathername: 'Підор',
    //   phones: ['380967756901', '785452'],
    //   lessons: ['Вища математика', 'Unix OS']
    // })
    // await teacher.save()

    // await ctx.reply([teacher.name, teacher._id].join(' '))
  }));

  bot.command('saveme', async (ctx: ContextMessageUpdate) => {
    logger.debug(ctx, 'User uses /saveme command');

    const { mainKeyboard } = getMainKeyboard(ctx);
    await ctx.reply(ctx.i18n.t('shared.what_next'), mainKeyboard);
  });
  bot.start(asyncWrapper(async (ctx: ContextMessageUpdate) => {
		const uid = String(ctx.from.id);
		const user = await User.findById(uid);
		const { mainKeyboard } = getMainKeyboard(ctx);

		ctx.scene.enter('start')
		
		if (user) {
			// await ctx.reply(ctx.i18n.t('scenes.start.welcome_back'), mainKeyboard);
		} else {
			// ctx.scene.enter('start')
		}
	}));
  bot.hears(
    match('keyboards.main_keyboard.search'),
    updateUserTimestamp,
    asyncWrapper(async (ctx: ContextMessageUpdate) => await ctx.scene.enter('search'))
  );
  bot.hears(
    match('keyboards.main_keyboard.movies'),
    updateUserTimestamp,
    asyncWrapper(async (ctx: ContextMessageUpdate) => await ctx.scene.enter('movies'))
  );
  bot.hears(
    match('keyboards.main_keyboard.settings'),
    updateUserTimestamp,
    asyncWrapper(async (ctx: ContextMessageUpdate) => await ctx.scene.enter('settings'))
  );
  bot.hears(match('keyboards.main_keyboard.about'), updateUserTimestamp, asyncWrapper(about));
  bot.hears(
    match('keyboards.main_keyboard.contact'),
    updateUserTimestamp,
    asyncWrapper(async (ctx: ContextMessageUpdate) => await ctx.scene.enter('contact'))
  );
  bot.hears(
    match('keyboards.main_keyboard.teachers'),
    updateUserTimestamp,
    asyncWrapper(async (ctx: ContextMessageUpdate) => await ctx.scene.enter('teachers'))
  );
  bot.hears(
    match('keyboards.main_keyboard.scheldure'),
    updateUserTimestamp,
    asyncWrapper(async (ctx: ContextMessageUpdate) => await ctx.scene.enter('scheldure'))
  );
  bot.hears(
    match('keyboards.back_keyboard.back'),
    asyncWrapper(async (ctx: ContextMessageUpdate) => {
      // If this method was triggered, it means that bot was updated when user was not in the main menu..
      logger.debug(ctx, 'Return to the main menu with the back button');
      const { mainKeyboard } = getMainKeyboard(ctx);

      await ctx.reply(ctx.i18n.t('shared.what_next'), mainKeyboard);
    })
  );

  bot.hears(
    match('keyboards.main_keyboard.support'),
    asyncWrapper(async (ctx: ContextMessageUpdate) => {
      logger.debug(ctx, 'Opened support options');

      const supportKeyboard = Extra.HTML().markup((m: Markup) =>
        m.inlineKeyboard(
          [
            [m.urlButton(`Patreon`, process.env.PATREON_LINK, false)],
            [m.urlButton(`Paypal`, process.env.PAYPAL_LINK, false)],
            [m.urlButton(`Yandex.Money`, process.env.YANDEX_LINK, false)],
            [m.urlButton(`WebMoney`, process.env.WEBMONEY_LINK, false)]
          ],
          {}
        )
      );

      await ctx.reply(ctx.i18n.t('other.support'), supportKeyboard);
    })
  );

  bot.hears(
    /(.*admin)/,
    isAdmin,
    asyncWrapper(async (ctx: ContextMessageUpdate) => await ctx.scene.enter('admin'))
  );

  bot.action(/mem/, updateUserTimestamp,
    asyncWrapper(async (ctx: ContextMessageUpdate) => {
      await showMem(ctx);

      await ctx.answerCbQuery();
    })
  );

  bot.hears(/(.*mem)/, updateUserTimestamp,
    asyncWrapper(async (ctx: ContextMessageUpdate) => await showMem(ctx))
  );

  bot.hears(/(.*?)/, async (ctx: ContextMessageUpdate) => {
    logger.debug(ctx, 'Default handler has fired');
    const user = await User.findById(ctx.from.id);
    await updateLanguage(ctx, user.language);

    const { mainKeyboard } = getMainKeyboard(ctx);
    await ctx.reply(ctx.i18n.t('other.default_handler'), mainKeyboard);
  });

  bot.catch((error: any) => {
    logger.error(undefined, 'Global error has happened, %O', error);
  });

  // setInterval(checkUnreleasedMovies, 86400000);

  process.env.NODE_ENV === 'production' ? startProdMode(bot) : startDevMode(bot);
});

function startDevMode(bot: Telegraf<ContextMessageUpdate>) {
  logger.debug(undefined, 'Starting a bot in development mode');

  rp(`https://api.telegram.org/bot${process.env.TELEGRAM_TOKEN}/deleteWebhook`).then(() =>
    bot.startPolling()
  );
}

async function startProdMode(bot: Telegraf<ContextMessageUpdate>) {
  // If webhook not working, check fucking motherfucking UFW that probably blocks a port...
  logger.debug(undefined, 'Starting a bot in production mode');
  const tlsOptions = {
    key: fs.readFileSync(process.env.PATH_TO_KEY),
    cert: fs.readFileSync(process.env.PATH_TO_CERT)
  };

  await bot.telegram.setWebhook(
    `https://dmbaranov.io:${process.env.WEBHOOK_PORT}/${process.env.TELEGRAM_TOKEN}`,
    {
      source: 'cert.pem'
    }
  );

  await bot.startWebhook(`/${process.env.TELEGRAM_TOKEN}`, tlsOptions, +process.env.WEBHOOK_PORT);

  const webhookStatus = await Telegram.getWebhookInfo();
  console.log('Webhook status', webhookStatus);

  checkUnreleasedMovies();
}
