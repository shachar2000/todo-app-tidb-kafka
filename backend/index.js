const express = require('express');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/auth');
const log4js = require('log4js');
const cors = require('cors');

log4js.configure({
  appenders: {
    out: {
      type: 'console',
      layout: {
        type: 'pattern',
        pattern: '{"timestamp":"%d","level":"%p","message":%m}'
      }
    }
  },
  categories: { default: { appenders: ['out'], level: 'info' } }
});

const logger = log4js.getLogger();

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use('/auth', authRoutes);

const port = 3000;
app.listen(port, () => logger.info(`Backend listening on port ${port}`));
