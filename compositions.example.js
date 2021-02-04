module.exports = {
  forcedLeverage: {
    enabled: false,
    value: 0.2,
  },
  markets: {
    mild_bear: {
      compo: {
        STRAT_BTC_ETH_USD_H_1: 0.7,
        STRAT_ETH_USD_H_3_V2: 0.15,
        STRAT_BTC_USD_H_3_V2: 0.15,
      },
      leverage: 1.5,
      botOnly: true,
    },
    mild_bull: {
      compo: {
        STRAT_BTC_ETH_USD_H_1: 0.5,
        STRAT_ETH_USD_H_3_V2: 0.1,
        STRAT_BTC_USD_H_3_V2: 0.1,
        // STRAT_BTC_USD_FUNDING_8H_1: 0.20,
        STRAT_ETH_USD_FUNDING_8H_1: 0.2,
        STRAT_BTC_ETH_USD_LO_D_1: 0.1,
      },
      leverage: 1.5,
      botOnly: true,
    },
    extreme: {
      compo: {
        STRAT_BTC_ETH_USD_H_1: 0.4,
        STRAT_ETH_USD_H_3_V2: 0.2,
        STRAT_BTC_USD_H_3_V2: 0.2,
        // STRAT_BTC_USD_FUNDING_8H_1: 0.15,
        STRAT_ETH_USD_FUNDING_8H_1: 0.15,
        STRAT_BTC_ETH_USD_LO_D_1: 0.05,
      },
      leverage: 1.0,
      botOnly: true,
    },
  },
};
