<script setup>
import { ref } from "vue";
const chainId = ref('');
const setChainTip = (newChainId) => {
    chainId.value = newChainId
}
window.setChainTip = setChainTip

// 检查到chain变化 则更新
window.addEventListener("setItemEvent", async function (e) {
  if (e.key === "oooooooooo") {
    // todo
    console.log(e)
//     const walletInstance = new wallet(block_chain);
//   console.log(walletInstance);
//   const provider = await walletInstance.connectWeb3();
  } 
})
</script>
<template>
    <div class="chainTip">
        <span class="tipWrap">
            The book is currently listed on __{{ chainId }}___. Do you want to switch the metamask network?
            <span class="yes">Yes</span>
            <span class="no">No</span>
        </span>
    </div>
</template>
<style lang="scss" scoped>
.chainTip {
    width: 100%;
    position: absolute;
    top: 10%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 3;
    text-align: center;
    .tipWrap {
        width: 80%;
        background: #ffe1b4;
        display: inline-block;
        span {
            cursor: pointer;
            margin: 0 10px;
            text-decoration: underline;
        }

        // .yes{

        // }
        // .no{

        // }
    }
}
</style>