import { BigNumber, ethers } from 'ethers';
import abi from "../assets/abi/abi"

export const useMetaMask = () => {
  const provider = new ethers.providers.Web3Provider(window.ethereum)
  const nftAddress = '0xa1e767940e8fb953bbd8972149d2185071b86063'

  const connectMetaMask = async () => {
    await provider.send("eth_requestAccounts", [])
    const signer = provider.getSigner()
    const address = await signer.getAddress()
    console.log('address = ', address);
  }


  const checkOwnerOfTokenList = async (from: string, tokens: BigNumber[]) => {
    if (!ethers.Signer) {
      connectMetaMask()
    }
    const nftContract = new ethers.Contract(nftAddress, abi.abi, provider);
    const nftWithSigner = nftContract.connect(provider.getSigner())
    const res = await nftWithSigner.checkOwnerOfTokenList(from, tokens)
    console.log('check', res)
    return res
  }
  const balanceOf = async (from: string) => {
    if (!ethers.Signer) {
      connectMetaMask()
    }

    const nftContract = new ethers.Contract(nftAddress, abi.abi, provider);
    console.log('contract name', await nftContract.name())

    const nftWithSigner = nftContract.connect(provider.getSigner())
    const res = await nftWithSigner.balanceOf(from)
    console.log('balanceOf', parseInt(res))
    return parseInt(res)
  }
  const transferNFT = async (from: string, to: string, tokenId: number) => {

    if (!ethers.Signer) {
      connectMetaMask()
    }

    const nftContract = new ethers.Contract(nftAddress, abi.abi, provider);
    console.log('contract name', await nftContract.name())

    const nftWithSigner = nftContract.connect(provider.getSigner())

    const signer = provider.getSigner()
    const toAddress = await signer.getAddress()

    await nftWithSigner.transferFrom(from, to ?? toAddress, tokenId)
  }
  const mintNft = async (address: string, metaData: {}) => {

    if (!ethers.Signer) {
      connectMetaMask()
    }

    const nftContract = new ethers.Contract(nftAddress, abi.abi, provider);
    console.log('contract name', await nftContract.name())

    const nftWithSigner = nftContract.connect(provider.getSigner())

    const signer = provider.getSigner()
    const toAddress = await signer.getAddress()

    const res = await fetch("https://dev-nft-marketplace-tqbqpbqb5a-uk.a.run.app/api/v1/files/generate_upload_url", {
      body: JSON.stringify({
        category: "user_profile_image",
        "content_type": "image/jpeg",
        "number_of_resource": 1
      }),
      method: 'post'
    })
    let json = await res.json();
    const res2 = await fetch(json[0]['upload_url'], {
      body: JSON.stringify(metaData),
      headers: {
        'content-type': 'image/jpeg'
      },
      method: 'put'
    })
    console.log(metaData, address)
    await nftWithSigner.safeMint(address ?? toAddress, json[0]['download_url'])
  }
  return {
    mintNft,
    balanceOf,
    transferNFT,
    checkOwnerOfTokenList,
    connectMetaMask
  }
}

