module.exports = {
  keys: {
    ftx: {
      apiKey: 'MRf5dhznpUsqo6YAOyE6GqL5seFqiCBC-KOS1MRZ',
      secret: 'JO_CUEpoELcmHS2CwOGEzfT4HwYmw8FEx_xAAkZ-',
    },
    binance: {
      apiKey: "9gcYJjQtcxf4Xy6xFL3se2WZYbMXRPAKZWUA8a8q6lxFwkKUV9QbVn6JMRuafrwH",
      secret: "Gf9dADq42RvoIAmtRWuvHDjRK79S4lW8TZr0peI1zOlALV5TjrHj3eNGNTd2FtGm"
    },
    kraken: {
      apiKey: "QZ+zKps0EK9aXHd15OwnmfFORGOKXD8o8JMWpaHNhZICFkHKuiD3b+wt",
      secret: "A+kzzhEsmtdu6Aukq8LcWwRCdLTe3sTwRU7uEm5cd3aSF8IiQXB2MdGgdTZlvh/YPAIiNUXnC5zaq1Te6RwDDg=="
    }
  },

  addresses: [
    '0x86fE8d6D4C8A007353617587988552B6921514Cb',
    '0x3941f32a8534a4f608e1fd60c490e30041bbe50c',
    '0x9dcc35ae915926f7f5e8c624254d91f755d55b71'
  ],

  othertokens: {
    BTC: [8.5],         // in cold wallet
    BNB: [200],         // in BSC
    ETH: [10, 30],      // uni-LP, sushi-LP
    USDT: [
      1000,               // borrowed by Alex
      2000,               // borrowed by Kate
      5000,               // my mining machine's value
    ],
    // ......
  },
};
