<template>
    <div>
     <Row :gutter="16" type="flex" justify="space-between" class="code-row-bg">
        <Col span="6" style="border:solid 1px red;">
        <div>col-8</div>
            <div id="echarts"  :style="{width: '300px', height: '300px'}"></div>
        </Col>
        <Col span="8" style="border:solid 1px red;">
            内容自定
        </Col>
        <Col span="8" style="background:#eee;padding:10px;height:350px">
             <Card shadow >
                <p slot="title">未读消息</p>
                <Row type="flex" justify="space-between" class="code-row-bg" v-for="item in data1 " :value="item.Id" :key="item.Id">
                <Col span="12">{{item.date}}</Col>
                <Col span="12">{{item.name}}</Col>
              </Row>
            </Card>
        </Col>
    </Row>
    </div>
</template>
<style scoped>

</style>
<script>
export default {
    data(){
      return{
        data1: [
              {Id:1,name: 'John Brown',age: 18,address: 'New York No. 1 Lake Park',date: '2016-10-03'},
              {Id:2,name: 'Jim Green',age: 24,address: 'London No. 1 Lake Park',date: '2016-10-01'},
              {Id:3,name: 'Joe Black',age: 30,address: 'Sydney No. 1 Lake Park',date: '2016-10-02'},
              {Id:4,name: 'Jon Snow',age: 26,address: 'Ottawa No. 2 Lake Park',date: '2016-10-04'},
              {Id:5,name: 'John Brown',age: 18,address: 'New York No. 1 Lake Park',date: '2016-10-03'},
              {Id:6,name: 'Jim Green',age: 24,address: 'London No. 1 Lake Park',date: '2016-10-01'},
              {Id:7,name: 'Joe Black',age: 30,address: 'Sydney No. 1 Lake Park',date: '2016-10-02'},
              {Id:8,name: 'Jon Snow',age: 26,address: 'Ottawa No. 2 Lake Park',date: '2016-10-04'}
            ]
      }
    },
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
          ],
          
        }]
      });      
    },  
}
</script>