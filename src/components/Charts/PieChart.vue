<template>
    <v-chart autoresize class="chart" :option="option" />
</template>

<script setup>
import { use } from "echarts/core"
import { CanvasRenderer } from "echarts/renderers"
import { PieChart } from "echarts/charts"
import {
    TitleComponent,
    TooltipComponent,
    LegendComponent
} from "echarts/components";
import VChart from "vue-echarts"
import { ref } from "vue"
use([
    CanvasRenderer,
    PieChart,
    TitleComponent,
    TooltipComponent,
    LegendComponent
]);
const option = ref({
    "color": [
        "#42ede8",
        "rgba(235,0,0,0.72)",
        "#3fb1e3",
        "#e8ed2d",
        "#4867e8",
    ],
    title: {
        text: "停车时段分布",
        left: "center"
    },
    tooltip: {
        trigger: "item",
        formatter: "{a} <br/>{b} : {c} ({d}%)"
    },
    legend: {
        orient: "vertical",
        left: "left",
        data: ["0-6时", "6-10时", "10-14时", "14-18时", "18-24时"]
    },
    toolbox: {
        feature: {
            saveAsImage: {}
        }
    },
    series: [
        {
            name: "停车时段分布",
            type: "pie",
            radius: "55%",
            center: ["50%", "60%"],
            data: [
                { value: 135, name: "0-6时" },
                { value: 235, name: "6-10时" },
                { value: 1528, name: "10-14时" },
                { value: 334, name: "14-18时" },
                { value: 310, name: "18-24时" },
            ],
            emphasis: {
                itemStyle: {
                    shadowBlur: 10,
                    shadowOffsetX: 0,
                    shadowColor: "rgba(0, 0, 0, 0.5)"
                }
            }
        }
    ]
});
</script>

<style scoped>
.chart {
    height: 400px;
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