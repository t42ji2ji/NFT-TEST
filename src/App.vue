<template lang="pug">
.flex.flex-col
  .flex.justify-center.w-full.flex-row.items-start
    .p5#p5Canvas(ref="canvasRef")
    .w-4
    .flex.flex-col.items-start
      .text(@click="wrapMode = !wrapMode") TextWrap
        input(type="checkbox" v-model="wrapMode")
      .text.flex.items-start 文字
        textarea.inputText(v-model="inputText" type="textarea" )
      .text 對齊
        input(v-model="textAlign" type="range" id="volume" name="volume"
          min="0" max="2")
      .text address
        input.inputText(v-model="address"  id="volume" name="volume"
          min="0" max="2")
      .text 背景顏色 {{ bgColor }}
        input(v-model="bgColor" type="color")
      .text 文字顏色 {{ textColor }}
        input(v-model="textColor" type="color")
      .text 
        input(@change="onImageChange" type="file")
      .text {{ imgUrl }}
      .button.text(@click="saveCanvas") 儲存
      .button.text(@click="connectMetaMask") connectWallet 
      .button.text(@click="doMint") mint 
  .flex.flex-col.items-center
    .text -------------------------------------
    .flex
      .text.flex.items-start 
        input.inputText(v-model="fromAddress" placeholder="from" )
      .text.flex.items-start 
        input.inputText(v-model="toAddress"  placeholder="to")
      .text.flex.items-start 
        input.inputText(v-model="tokenId"  placeholder="to")
      .button.text(@click="transferNFT(fromAddress, toAddress, tokenId)") 轉移NFT
</template>

<script setup lang="ts">
import { useMetaMask } from './composable/web3';
import {
  imgUrl, fileImage, address, useP5, inputText, textAlign, bgColor,
  textColor, canvasRef, googleImageJson
} from './composable/p5Tools';
import { ethers } from 'ethers';
import { ref } from 'vue';
const { wrapMode, saveCanvas } = useP5();
const { mintNft, connectMetaMask, transferNFT } = useMetaMask();

const toAddress = ref('')
const fromAddress = ref('')
const tokenId = ref()

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
  mintNft(address.value, { image: googleImageJson?.value['download_url'] ?? '' })
}

const test = async () => {
  const provider = new ethers.providers.Web3Provider(window.ethereum)
}
</script>

<style>
@import url("https://fonts.googleapis.com/css2?family=Amatic+SC:wght@400;700&family=Walter+Turncoat&display=swap");
body,
html {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
}
#app {
  /* font-family: Avenir, Helvetica, Arial, sans-serif; */
  /* font-family: "Walter Turncoat", cursive; */
  font-family: "Walter Turncoat", cursive;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
.text {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  margin: 5px 0px;
}

.button {
  border-radius: 5px;
  background-color: #3488dd;
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
</style>
