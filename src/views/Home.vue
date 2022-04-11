<template lang="pug">
.flex.flex-col
  .flex.justify-center.w-full.flex-row.items-start
    .p5#p5Canvas(ref="canvasRef")
    .w-4
    .flex.flex-col.items-start
      .text(@click="wrapMode = !wrapMode") TextWrap
        input(type="checkbox" v-model="wrapMode")
      .text.flex.items-start 文字 {{ $t('aaa') }}
        textarea.inputText(v-model="inputText" type="textarea" )
      .text 對齊
        input(v-model="textAlign" type="range" id="volume" name="volume"
          min="0" max="2")
      .text 背景顏色 {{ bgColor }}
        input(v-model="bgColor" type="color")
      .text 文字顏色 {{ textColor }}
        input(v-model="textColor" type="color")
      .text 
        input(@change="onImageChange" type="file")
      .button.flex.items-center(@click="saveCanvas")
        .text 上傳圖片
        .loader(v-if="showImgLoading")
      .text {{ imgUrl == '' ? '' : 'OK' }}
      .button.text(@click="connectMetaMask") connectWallet 
      .text address
        input.inputText(v-model="address"  id="volume" name="volume"
          min="0" max="2")
      .button.text(@click="doMint") mint 
  .flex.flex-col.items-center
    .text -------------------------------------
    .flex
      .text.flex.items-start 
        input.inputText(v-model="fromAddress" placeholder="from" )
      .text.flex.items-start 
        input.inputText(v-model="toAddress"  placeholder="to")
      .text.flex.items-start 
        input.inputText(v-model="tokenId"  placeholder="tokenId")
      .button.text(@click="transferNFT(fromAddress, toAddress, tokenId)") 轉移NFT
    .text -------------------------------------
    .flex.items-center
      .text.flex.items-start 
        input.inputText(v-model="fromAddress" placeholder="address")
      .button.text(@click="checkBalance") 查詢個數
      .text.ml-4  {{ balance }} 個
    .text -------------------------------------
    .flex.items-center
      .text.flex.items-start 
        input.inputText(v-model="fromAddress" placeholder="address")
      .text.flex.items-start 
        input.inputText(v-model="tokenList" placeholder="tokenIds")
      .button.text(@click="doCheckOwnerOfTokenList") 查詢擁有的tokens
      .text.ml-4  {{ matchOwnerTokenList ? '符合條件' : '條件不符' }} 
</template>

<script setup lang="ts">
import { useMetaMask } from '../composable/web3';
import {
  imgUrl, fileImage, address, useP5, inputText, textAlign, bgColor,
  textColor, canvasRef, googleImageJson, showImgLoading
} from '../composable/p5Tools';
import { ethers } from 'ethers';
import { ref } from 'vue';
import { useToast } from "vue-toastification";
import { useI18n } from "vue-i18n";



const { wrapMode, saveCanvas } = useP5();
const { mintNft, connectMetaMask, transferNFT, balanceOf, checkOwnerOfTokenList } = useMetaMask();

const toAddress = ref('')
const fromAddress = ref('')
const tokenId = ref()

const tokenList = ref('')
const balance = ref()
const matchOwnerTokenList = ref(false)

const toast = useToast();



const doCheckOwnerOfTokenList = async () => {
  matchOwnerTokenList.value = false
  const all = tokenList.value.split(',').map((s) => ethers.BigNumber.from(s))
  if (all.length == 0) {
    console.log("can't check")
    return
  }
  console.log("check")

  const res = await checkOwnerOfTokenList(fromAddress.value, all)
  matchOwnerTokenList.value = res
}

const checkBalance = async () => {
  balance.value = await balanceOf(fromAddress.value)
}


const onImageChange = (event: Event) => {
  if (event) {
    let file = (event.target as HTMLInputElement)?.files;
    if (file) {
      let urlOfImageFile = URL.createObjectURL(file[0]);
      fileImage.value = urlOfImageFile
    }
  }
}
const doMint = () => {
  console.log(address.value)
  if (address.value == '') {
    toast('地址未填寫')
    return
  }
  if (!ethers.utils.isAddress(address.value)) {
    toast('地址錯誤')
    return
  }
  let imgUrl = (googleImageJson?.value ?? '')['download_url']
  if (!imgUrl) {
    toast('圖片未上傳')
    return
  }

  mintNft(address.value, { image: imgUrl })
}

const test = async () => {
  const provider = new ethers.providers.Web3Provider(window.ethereum)
}
</script>

<style>
.text {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  margin: 5px 0px;
}

.button {
  border-radius: 5px;
  background-color: #3e78c0;
  padding: 5px 10px;
  color: white;
}

.inputText {
  background-color: rgb(211, 211, 211);
  border-radius: 5px;
  padding: 5px;
  margin: 3px;
}

.p5 {
  border-radius: 5px;
  overflow: hidden;
}

.loader {
  border: 2px solid #f3f3f3;
  /* Light grey */
  border-top: 2px solid #939393;
  /* Blue */
  border-radius: 50%;
  width: 15px;
  height: 15px;
  animation: spin 2s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}
</style>
