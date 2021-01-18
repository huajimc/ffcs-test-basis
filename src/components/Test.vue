<template>
    <div>
        1
    </div>
</template>

<script>
import * as api from "@/api/unifiedMonitoring.js";

export default {
    name: "Test",
    data() {
        return {
            type: "主机"
        }
    },
    mounted(){
        this.getSubtypeByType("服务", -7);
        // this.getNumberByType(-7);
    },
    methods: {
        // beginDate - endDate 负数
        subtract(beginDate, endDate) {
            let beginTime = new Date(beginDate);
            let endTime = new Date(endDate);
            return (beginTime - endTime) / (1000 * 60 * 60 * 24)
        },
        // 根据故障类型和相差时间 查询故障各环境告警数和实例数
        getSubtypeByType(type, diff) {
            api.getSubtypeByType(type, diff).then((val) => {
                console.log(val);
            })
        },
        getNumberByType(diff) {
            api.getNumberByType(diff).then((val) => {
                console.log(val);
            })
        }
    },
}
</script>

<style scoped>
.test {
    background-color:#EBECF1;
    color:#2D3040;
    height: 28px;

}
</style>