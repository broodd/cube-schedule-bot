import { I18n } from 'telegraf-i18n';
import { IMovie } from '../models/Movie';
import { ISearchResult } from '../util/movie-search';

declare module 'telegraf' {
  interface ContextMessageUpdate {
    i18n: I18n;
    scene: any;
    wizard: any;
    session: {
      scheldure: any[]
      movies: IMovie[] | ISearchResult[];
      settingsScene: {
        messagesToDelete: any[];
      };
      language: 'en' | 'uk';
    };
    userinfo: any;
    day: number;
    movie: any;
    scheldure: any[];
    webhookReply: boolean;
  }
}
