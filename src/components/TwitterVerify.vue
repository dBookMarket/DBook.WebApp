<script setup>
import { ref, nextTick } from "vue"
import router from "../router/index.js"
import { get, put } from "../service/http"
import cache from "../assets/lib/cache";
import message from "../assets/lib/resetMessage";
const verifyShow = ref(true)
const sendShow = ref(false)
const form = ref({})
// 1. 获取用户twitter授权 ,返回 auth_url: ''
const goOn = async () => {
    const res = await put("/users/auth")
    if (res && res.ready) {
        window.open(res.data.auth_uri)
        cache.set("auth_uri", res.data.auth_uri)
        verifyShow.value = false
        sendShow.value = false
    }
}
const updateAuth = async (oauth_token, oauth_verifier) => {
    await nextTick()
    verifyShow.value = false
    sendShow.value = true
    form.value.oauth_token = oauth_token
    form.value.oauth_verifier = oauth_verifier
    console.log(verifyShow.value, sendShow.value)
}

// 2，发送twitter并授权
const finish = async () => {
    window.setLoading()
    const res = await put("/users/share", {
        oauth_token: form.value.oauth_token, // required，来自auth_url
        oauth_verifier: form.value.oauth_verifier,  // required, 来自auth_url
        content: form.value.content,  // required
    }).catch(e => {
        window.hideLoading()
        resetParam()
    })
    if (res.ready) {
        message.success("success !")
        const userInfo = await get("users/current")
        if (res.ready) {
            cache.set("userInfo", userInfo.data)
            resetParam()
        }
    }
    window.hideLoading()
}
const resetParam = () => {
    verifyShow.value = false
    sendShow.value = false
    router.push({ path: '/' })
}
const hide = () => {
    verifyShow.value = false
}
const show = () => {
    verifyShow.value = true
}
defineExpose({ updateAuth,show })
</script>
<template>
    <div class="authorVerify" v-show="verifyShow || sendShow">
        <div class="inner" v-show="verifyShow">
            <div class="i_title">Verify the recommendation</div>
            <div class="i_content">For the first time to publish a book, you need to verify
                your Twitter identity to obtain the qualification for
                publishing books, and it will be bound to your wallet
                address after successful verification, and you can re-verify
                it in your personal center if you need to modify it later.</div>
            <div class="operaIcon">
                <span class="cancel" @click="hide()">Cancel</span>
                <span class="continue" @click="goOn">Go on</span>
            </div>
        </div>
        <div class="inner send" v-show="sendShow">
            <div class="i_title">Send a Tweet</div>
            <div class="i_content">
                <el-input v-model="form.content" :rows="4" type="textarea"
                    placeholder="Here is a well-written paragraph..." />
            </div>
            <div class="operaIcon">
                <span class="cancel" @click="sendShow = false">Cancel</span>
                <span class="continue" @click="finish">Finish</span>
            </div>
        </div>
    </div>
</template>
<style lang="scss" scoped>
.authorVerify {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 2;
    width: 100%;
    height: 100vh;
    background-color: rgba(0, 0, 0, 0.6);

    .inner {
        width: 70%;
        max-width: 447px;
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        background-color: #fff;
        padding: 24px 32px 33px 29px;


        .i_title {
            font-size: 18px;
            color: #000000;
            text-align: center;
        }

        .i_content {
            font-size: 15px;
            color: #999999;
            line-height: 27px;
            margin: 43px 0 37px 0;
            background: #FFFFFF;
            border-radius: 10px;
        }

        &.send {
            .i_content {
                margin: 23px 0 37px 0;
            }
        }

        .operaIcon {
            display: flex;
            justify-content: space-between;

            span {
                cursor: pointer;
            }

            .cancel {
                width: 150px;
                height: 36px;
                line-height: 36px;
                text-align: center;
                background: #FFF7E9;
                font-size: 15px;
                color: #50483B;
            }


            .continue {
                width: 150px;
                height: 36px;
                line-height: 36px;
                text-align: center;
                background: #50483B;
                font-size: 15px;
                color: #FFE1B4;
            }
        }
    }
}
</style>