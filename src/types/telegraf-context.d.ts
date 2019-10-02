import { I18n } from 'telegraf-i18n';

declare module 'telegraf' {
  interface ContextMessageUpdate {
    i18n: I18n;
    scene: any;
    wizard: any;
    session: {
      // schedule: any[]
      user: any;
      settingsScene: {
        messagesToDelete: any[];
      };
      language: 'en' | 'uk';
    };
    day: number;
    user: any;
    schedule: any[];
    webhookReply: boolean;
  }
}
