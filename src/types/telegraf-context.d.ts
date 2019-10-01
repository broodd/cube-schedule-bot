import { I18n } from 'telegraf-i18n';
import { IMovie } from '../models/Movie';
import { ISearchResult } from '../util/movie-search';

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
