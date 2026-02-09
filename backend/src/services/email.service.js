const nodemailer = require('nodemailer');
const config = require('../config/config');
const logger = require('../config/logger');

const transport = nodemailer.createTransport(config.email && config.email.smtp ? config.email.smtp : {
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
        user: 'dummy',
        pass: 'dummy'
    }
});

/* istanbul ignore next */
if (config.env !== 'test') {
  transport
    .verify()
    .then(() => logger.info('Connected to email server'))
    .catch(() => logger.warn('Unable to connect to email server. Make sure you have configured the SMTP options in .env'));
}

/**
 * Send an email
 * @param {string} to
 * @param {string} subject
 * @param {string} text
 * @returns {Promise}
 */
const sendEmail = async (to, subject, text) => {
  const msg = { from: config.email && config.email.from ? config.email.from : 'test@example.com', to, subject, text };
  await transport.sendMail(msg);
};

module.exports = {
  transport,
  sendEmail,
};
