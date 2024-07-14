<template>
    <a-row style="justify-content: center; ">
      <div class="titleStyle">欢迎来到智泊云界管理系统</div>
    </a-row>
    <a-row style="justify-content: center; margin: 10px;">
        <div  style="display: flex; width: 60%; justify-content: center;">
            <template v-for="item in showList">
                <a-col :span="4" style="text-align: center;">
                    <img :src="item.url" style="width: 50px; height: 50px; margin: 10px;" />
                    <div style="font-weight: 600;font-size: 18px;">{{ item.name }}</div>
                </a-col>
            </template>
        </div>
    </a-row>
    <a-row>
        <a-col :span="11">
            <div class="cardStyle">
                <PieChart />
            </div>
        </a-col>
        <a-col :offset='1' :span="11">
            <div class="cardStyle">
                <LineChart />
            </div>
        </a-col>
    </a-row>
</template>

<script setup>
import PieChart from '@/components/Charts/PieChart.vue'
import LineChart from '@/components/Charts/LineChart.vue'
import { ref } from 'vue'
const showList = ref([
    {
        url: '/images/show/1.png',
        name: '华为云'
    },

    {
        url: '/images/show/2.png',
        name: '掌上应用'
    },
    {
        url: '/images/show/3.png',
        name: '智慧生活'
    },
    {
        url: '/images/show/4.png',
        name: '智慧物联'
    },
    {
        url: '/images/show/5.png',
        name: '智慧系统'
    },
    {
        url: '/images/show/6.png',
        name: '智慧支付'
    },
])
</script>

<style scoped>
.titleStyle {
    font-size: 50px;
    font-weight: bold;
    margin: 10px;
    font-family: 'kaiti';
    background: linear-gradient(90deg, #864eff, #2d99dd);
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
}
.cardStyle {
    background-color: rgba(255, 255, 255, 0.5);
    margin: 15px;
    text-align: center;
    justify-self: center;
    width: 100%;
    box-shadow: 1px 1px 5px rgb(121, 207, 250);
    border: 1px solid rgb(185, 213, 227);
    border-radius: 15px;

}

.cardStyle:hover {
    box-shadow: 1px 1px 10px rgb(121, 207, 250);
}
</style>