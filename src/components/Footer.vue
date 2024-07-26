<template>
    <a-back-top style="bottom:25px;" :class="{ 'Left': windowSize <= 960 }" />
    <a-float-button-group trigger="hover" style="bottom:125px;" :class="{ 'Left': windowSize <= 960 }">
        <a-float-button @click="() => open = true">
            <template #icon>
                <SettingOutlined />
            </template>
        </a-float-button>
        <a-float-button @click="update">
            <template #icon>
                <SyncOutlined />
            </template>
        </a-float-button>
    </a-float-button-group>

    <div>
        <a-modal v-model:open="open" :footer="null">
            <template #title>
                <span style="text-align: center; display: block; font-size: 25px; font-weight: 600;">背景设置</span>
            </template>
            <p style="font-size: 17px; font-weight: 600;">纯色背景</p>
            <a-row justify="center">
                <a-col :span="6" v-for="(item, index) in gradients" :key="index">
                    <div :style="{ background: item }"
                        style="height: 50px; opacity: 0.8; margin: 10px 5px; border-radius: 5px; cursor: pointer;"
                        @click="setBackground(item, 1);"></div>
                </a-col>
            </a-row>
        </a-modal>
    </div>
</template>
<script setup>
import { ref, onMounted, reactive } from 'vue'
import { message } from 'ant-design-vue'
import { SyncOutlined, SettingOutlined } from '@ant-design/icons-vue'
import { useWindowSize } from '@vueuse/core'
let windowSize = useWindowSize().width

/*按钮组 */
const open = ref(false)
let gradients = reactive([
    'linear-gradient( 135deg, #FFD26F 10%, #3677FF 100%)',
    'linear-gradient( 135deg, #FFDB01 10%, #0E197D 100%)',
    'linear-gradient( 70deg, lightblue, pink)',
    'linear-gradient( 135deg, #C2FFD8 10%, #465EFB 100%)',
    'linear-gradient(to right, #c6ffdd, #fbd786, #f7797d)',
    'linear-gradient(to right, #2980b9, #6dd5fa, #ffffff)',
    'linear-gradient(to right, #355c7d, #6c5b7b, #c06c84)',
    'linear-gradient(to right, #00f260, #0575e6)',
    'linear-gradient(to right, #3a6186, #89253e)',
    'linear-gradient(to right, #ffd89b, #19547b)',
    'linear-gradient(to right, #2bc0e4, #eaecc6)',
    'linear-gradient(to right, #cc95c0, #dbd4b4, #7aa1d2)',
    'linear-gradient(to right, #003973, #e5e5be)',
    'linear-gradient(to right, #77a1d3, #79cbca, #e684ae)',
    'linear-gradient(to right, #bbd2c5, #536976, #292e49)',
    'linear-gradient(to right, #5433ff, #20bdff, #a5fecb)',
])

const setBackground = (str, num) => {
    const element = document.querySelector('.background')
    if (num === 1) {
        element.style.background = str
        element.style.opacity = 0.3
        console.log(element.style.background)
    }
}
const update = () => { location.reload() }

</script>

<style scoped>
span {
    font-size: 16px;
    font-family: kaiti;
    font-weight: 500;
    margin: 7px 3px;
}

img {
    margin: 3px 5px;
    cursor: pointer;
}

.test {
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center;
    height: 50px;
    opacity: 0.8;
    margin: 10px 5px;
    border-radius: 5px;
    cursor: pointer;
}

.Left {
    left: 10px;
}
</style>