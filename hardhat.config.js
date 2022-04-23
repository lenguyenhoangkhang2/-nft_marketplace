require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-etherscan");

module.exports = {
  solidity: "0.8.4",
  paths: {
    artifacts: "./src/backend/artifacts",
    sources: "./src/backend/contracts",
    cache: "./src/backend/cache",
    tests: "./src/backend/test",
  },
  networks: {
    rinkeby: {
      url: "https://eth-rinkeby.alchemyapi.io/v2/-mzAWLaLgp7HLQbrxq_OFY3F1g92_6x6",
      accounts: [
        "ef6337e51d3ebbd7324fa968b6aa14a68c10ad48a229cbca9f0576de4c412b38",
      ],
    },
  },
  etherscan: {
    apiKey: "4TRUXW25ZX3Z71IZ88Y1NYMG5XFGMSW83H",
  },
};
