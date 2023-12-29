//@ts-ignore

export async function bigetConnect() {
  //@ts-ignore
  const provider = window.bitkeep && window.bitkeep.ethereum;

  if (!provider) {
    window.open("https://web3.bitget.com/en/wallet-download?type=2");
  }
  await provider
    .request({
      method: "eth_requestAccounts",
    })
    .then((accounts: any) => {
      //success
      console.log(accounts);

      const account = accounts[0];
      console.log("address", account);
    })
    .catch((error: any) => {
      //fail
      console.log(error);
    });
}
export function bigetDisconnect() {
  //@ts-ignore
  const provider = window.bitkeep && window.bitkeep.ethereum;

  if (!provider) {
    window.open("https://web3.bitget.com/en/wallet-download?type=2");
  }
  provider
    .request({
      method: "wallet_requestPermissions",
      params: [
        {
          eth_accounts: {},
        },
      ],
    })
    .then((accounts: any) => {
      //success
      console.log(accounts);

      const account = accounts[0];
      console.log("address", account);
    })
    .catch((error: any) => {
      //fail
      console.log(error);
    });
}
export async function bigetSwitch(chain:string) {
  //@ts-ignore
  const provider = window.bitkeep && window.bitkeep.ethereum;

  if (!provider) {
    window.open("https://web3.bitget.com/en/wallet-download?type=2");
  }
  await provider
    .request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: chain }],
    })
    .then((res: any) => {
      console.log(res);

      // success
    })
    .catch((error: any) => {
      console.log(error);

      //could add netword here
    });
}
export function bigetAccount() {
  //@ts-ignore
  const provider = window.bitkeep && window.bitkeep.ethereum;

  if (!provider) {
    window.open("https://web3.bitget.com/en/wallet-download?type=2");
  }
  provider
    .request({
      method: "eth_requestAccounts",
    })
    .then((accounts: any) => {
      //success
      console.log(accounts);

      const account = accounts[0];
    })
    .catch((error: any) => {
      //fail
      console.log(error);
    });
}
export function bigetSign() {
  //@ts-ignore
  const provider = window.bitkeep && window.bitkeep.ethereum;

  if (!provider) {
    window.open("https://web3.bitget.com/en/wallet-download?type=2");
  }
  provider
    .request({
      method: "eth_sign",
      params: ["0x2c"],
    })
    .then((accounts: any) => {
      //success
      console.log(accounts);

      const account = accounts[0];
    })
    .catch((error: any) => {
      //fail
      console.log(error);
    });
}
export function bigetSendTransaction() {
  //@ts-ignore
  const provider = window.bitkeep && window.bitkeep.ethereum;

  if (!provider) {
    window.open("https://web3.bitget.com/en/wallet-download?type=2");
  }
  provider
    .request({
      method: "eth_sendTransaction",
      params: [
        {
          from: "0x2c",
          to: "0x2c",
          value: "0x2c",
          gas: "0x2c",
          gasPrice: "0x2c",
          data: "0x2c",
        },
      ],
    })
    .then((accounts: any) => {
      //success
      console.log(accounts);

      const account = accounts[0];
    })
    .catch((error: any) => {
      //fail
      console.log(error);
    });
}

