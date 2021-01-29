const fs = require('fs');

const { LOG_FILE_PATH } = process.env;

const Logger = {
  init: () => {
    fs.open(LOG_FILE_PATH, 'r', (openError) => {
      if (!openError) {
        return;
      }
      fs.writeFile(LOG_FILE_PATH, '', (writeError) => {
        if (writeError) {
          console.log(writeError);
        }
      });
    });
  },
  log: (msg) => {
    fs.appendFile(LOG_FILE_PATH, msg, () => {});
  },
};

module.exports = Logger;
