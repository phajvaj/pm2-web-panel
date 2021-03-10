const jwt = require('jsonwebtoken');
const secretKey = 'saciw&earn@phingosoft.com.pm2-web-panel#260931';

module.exports = {
  sign(playload) {
    const token = jwt.sign(playload, secretKey, {
      expiresIn: '1d'
    });
    return token;
  },

  verify(token) {
    return new Promise((resolve, reject) => {
      jwt.verify(token, secretKey, (err, decoded) => {
        if (err) {
          reject(err)
        } else {
          resolve(decoded)
        }
      });
    });
  }
};
