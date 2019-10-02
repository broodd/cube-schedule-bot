import Stage from 'telegraf/stage';

import startScene from './controllers/start';
import settingsScene from './controllers/settings';
import contactScene from './controllers/contact';
import teachersScene from './controllers/teachers';
import classmatesScene from './controllers/classmates';
import scheldureScene from './controllers/schedule';
import adminScene from './controllers/admin';

import userInfoWizard from './controllers/start/wizards/user-info';
import editUserInfoWizard from './controllers/settings/wizards/user-info';

const stage = new Stage([
	startScene,
	userInfoWizard,
  settingsScene,
  editUserInfoWizard,
  contactScene,
  teachersScene,
  classmatesScene,
  scheldureScene,
  adminScene
]);
export default stage;
