<template>
    <div>我是首页不会被关闭

        <div id="echarts" :style="{width: '300px', height: '300px'}"></div>
    </div>
    
</template>
<script>
export default {
    mounted:function()
    {
        var dom = document.getElementById('echarts')
        var myChart = this.echarts.init(dom)
        myChart.setOption({
        series: [{
          name: '访问来源',
          type: 'pie',
          radius: '55%',
          data: [{
              value: 235,
              name: '视频广告'
            },
            {
              value: 274,
              name: '联盟广告'
            },
            {
              value: 310,
              name: '邮件营销'
            },
            {
              value: 335,
              name: '直接访问'
            },
            {
              value: 400,
              name: '搜索引擎'
            }
          ]
        }]
      });
    },  
}
</script>