import { ethers } from 'ethers';
import abi from "../assets/abi/abi"

export const useMetaMask = () => {
  const provider = new ethers.providers.Web3Provider(window.ethereum)


  const connectMetaMask = async () => {
    await provider.send("eth_requestAccounts", [])
    const signer = provider.getSigner()
    const address = await signer.getAddress()
    console.log('address = ', address);
  }


  const transferNFT = async (from: string, to: string, tokenId: number) => {

    if (!ethers.Signer) {
      connectMetaMask()
    }

    const nftAddress = '0x00c74fa26a5d1de302e08a6ea928551fd547c7ed'
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

    const nftAddress = '0x00c74fa26a5d1de302e08a6ea928551fd547c7ed'
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
    console.log(metaData)
    await nftWithSigner.safeMint(address ?? toAddress, json[0]['download_url'])
  }
  return {
    mintNft,
    transferNFT,
    connectMetaMask
  }
}

