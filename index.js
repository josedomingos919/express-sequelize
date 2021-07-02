const sequelize = require('./src/config/database');
const app = require('./src/app');
const UserService = require('./src/user/UserService');
const logger = require('./src/logger');

if(process.env.NODE_ENV === 'production') {
  sequelize.sync();
} else {
  sequelize.sync({ force: true }).then(async () => {
    for(let i = 1; i <= 5; i++) {
      const user = {
        username: `user${i}`,
        email: `user${i}@mail.com`,
        password: 'P4ssword'
      }
      await UserService.create(user);
    }
  });
}

logger.error('error');
logger.warn('warn');
logger.info('info');
logger.verbose('verbose');
logger.debug('debug');
logger.silly('silly');

app.listen(process.env.PORT || 3000, () => {
  logger.info("app is running in mode: ", process.env.NODE_ENV)
});
