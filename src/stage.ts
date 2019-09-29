import Stage from 'telegraf/stage';

import startScene from './controllers/start';
import userInfoWizard from './controllers/user-info';
import searchScene from './controllers/search';
import moviesScene from './controllers/movies';
import settingsScene from './controllers/settings';
import contactScene from './controllers/contact';
import teachersScene from './controllers/teachers';
import scheldureScene from './controllers/scheldure';
import adminScene from './controllers/admin';

const stage = new Stage([
	startScene,
	userInfoWizard,
  searchScene,
  moviesScene,
  settingsScene,
  contactScene,
  teachersScene,
  scheldureScene,
  adminScene
]);
export default stage;
