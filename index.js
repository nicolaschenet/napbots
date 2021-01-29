/* eslint-disable no-console */

// Imports
require('dotenv').config();
const { format } = require('date-fns');
const axios = require('axios').default;
const deepEqual = require('deep-equal');
const chalk = require('chalk');
const { Spinner } = require('cli-spinner');

const Logger = require('./logger');
const compositions = require('./compositions');

// Account details
const email = process.env.NAPBOTS_EMAIL;
const password = process.env.NAPBOTS_PASSWORD;
const userId = process.env.NAPBOTS_USER_ID;

const loader = new Spinner({
  text: '%s Authenticating to napbots.com...',
  stream: process.stderr,
  onTick(msg) {
    this.clearLine(this.stream);
    this.stream.write(msg);
  },
});
loader.setSpinnerString('⠋⠙⠹⠸⠼⠴⠦⠧⠇⠏');

const getCryptoWeater = async () => {
  const weatherApi = await axios({
    url: 'https://middle.napbots.com/v1/crypto-weather',
  });

  if (!weatherApi) {
    return console.error('No weather information found.');
  }

  const { weather } = weatherApi.data.data.weather;

  return weather;
};

const getAuthToken = async () => {
  loader.start();
  const loginResponse = await axios({
    url: 'https://middle.napbots.com/v1/user/login',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: {
      email,
      password,
    },
  });

  const authToken = loginResponse.data.data.accessToken;

  if (!authToken) {
    return console.error('No Auth Token');
  }
  loader.stop(true);
  console.log('✅  Authenticated to napbots.com!\n');
  return authToken;
};

const getCurrentAllocations = async (token) => {
  const currentAllocationResponse = await axios({
    url: `https://middle.napbots.com/v1/account/for-user/${userId}`,
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      token,
    },
  });

  // Rebuild exchanges array
  return currentAllocationResponse.data.data
    .filter(
      (allocation) =>
        allocation.accountId && allocation.compo && allocation.tradingActive
    )
    .map((allocation) => ({
      id: allocation.accountId,
      compo: allocation.compo,
    }));
};

const assignComposition = (weather) => {
  switch (weather) {
    case 'Extreme markets':
      return compositions.extreme;
    case 'Mild bull markets':
      return compositions.mild_bull;
    case 'Mild bear or range markets':
      return compositions.mild_bear;
    default:
      console.error('Unknown weather condition:', weather);
      return {};
  }
};

const main = async () => {
  Logger.init();

  console.log('-----------------------------------------------------------');
  console.log(
    chalk.bold(`📅  ${format(new Date(), 'EEE, yyyy/MM/dd - hh:mm:ssa')}`)
  );
  console.log('-----------------------------------------------------------\n');
  const weather = await getCryptoWeater();
  console.log(`🌤️  Crypto-weather is: ${chalk.yellow.bold(weather)}\n`);
  const { leverage, compo, botOnly } = assignComposition(weather);
  const authToken = await getAuthToken();
  const exchanges = await getCurrentAllocations(authToken);

  // For each exchange, update allocation if different from the current crypto weather
  exchanges.map(async (exchange) => {
    let toUpdate = false;

    // If leverage different, set to update
    if (exchange.compo.leverage !== leverage) {
      console.log('=> Leverage is different');
      toUpdate = true;
    }

    // If composition different, set to update
    const equalCompos = deepEqual(exchange.compo.compo, compo);
    if (!equalCompos) {
      console.log('=> Compositions are different');
      toUpdate = true;
    }

    // If composition different, update allocation for this exchange
    if (toUpdate) {
      // Rebuild string for composition
      const params = {
        botOnly,
        compo: {
          leverage: leverage.toFixed(2).toString(),
          compo,
        },
      };

      try {
        await axios({
          url: `https://middle.napbots.com/v1/account/${exchange.id}`,
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            token: authToken,
          },
          data: params,
        });
        console.log(
          `✅  Updated allocation for exchange ${chalk.blue.bold(exchange.id)}`
        );
        Logger.log(
          `[${format(
            new Date(),
            'yyyy/MM/dd - hh:mm:ssa'
          )}] Weather: ${weather} => Updated allocation for exchange ${
            exchange.id
          }\n`
        );
      } catch (error) {
        console.error(error.response ? error.response.data : error);
      }
    } else {
      console.log(
        `ℹ️  Nothing to udpate for exchange ${chalk.blue.bold(exchange.id)}`
      );
      Logger.log(
        `[${format(
          new Date(),
          'yyyy/MM/dd - hh:mm:ssa'
        )}] Weather: ${weather} => Nothing to udpate for exchange ${
          exchange.id
        }\n`
      );
    }
  });
};
main();
