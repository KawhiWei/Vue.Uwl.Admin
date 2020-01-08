<template>
    <div>
     <Row :gutter="16" type="flex" justify="space-between" class="code-row-bg">
        <Col span="6" style="background:#eee;" >
            <div id="echarts"  :style="{width: '300px', height: '300px'}"></div>
        </Col>
        <Col span="8" style="background:#eee;" >
           <div id="chart-panel"   :style="{width: '500px  !important', height: '100%  !important',position: 'absolute',padding:'5px'}">

           </div>
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
        <Button type="info" size="small" @click="SenMsg()">发送消息</Button>
        <Input v-model="message" >
          </Input>

    </div>
</template>
<style scoped>
.ivu-row-flex-space-between{
    margin: 0 !important;
}
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
              {Id:8,name: 'Jon Snow',age: 26,address: 'Ottawa No. 2 Lake Park',date: '2016-10-04'},
              {Id:9,name: 'Jon Snow',age: 26,address: 'Ottawa No. 2 Lake Park',date: '2016-10-04'},
              {Id:10,name: 'Jon Snow',age: 26,address: 'Ottawa No. 2 Lake Park',date: '2016-10-04'},
              {Id:11,name: 'Jon Snow',age: 26,address: 'Ottawa No. 2 Lake Park',date: '2016-10-04'},
            ],
        connection: "",
        message:"",
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
      var option = {
    title: {
        text: '堆叠区域图'
    },
    tooltip : {
        trigger: 'axis',
        axisPointer: {
            type: 'cross',
            label: {
                backgroundColor: '#6a7985'
            }
        }
    },
    legend: {
        data:['联盟广告','视频广告','直接访问','搜索引擎']
    },
    toolbox: {
        feature: {
            saveAsImage: {}
        }
    },
    grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
    },
    xAxis : [
        {
            type : 'category',
            boundaryGap : false,
            data : ['周一','周二','周三','周四','周五','周六','周日']
        }
    ],
    yAxis : [
        {
            type : 'value'
        }
    ],
    series : [

        {
            name:'联盟广告',
            type:'line',
            stack: '总量',
            areaStyle: {},
            data:[220, 182, 191, 234, 290, 330, 310]
        },
        {
            name:'视频广告',
            type:'line',
            stack: '总量',
            areaStyle: {},
            data:[150, 232, 201, 154, 190, 330, 410]
        },
        {
            name:'直接访问',
            type:'line',
            stack: '总量',
            areaStyle: {normal: {}},
            data:[320, 332, 301, 334, 390, 330, 320]
        },
        {
            name:'搜索引擎',
            type:'line',
            stack: '总量',
            label: {
                normal: {
                    show: true,
                    position: 'top'
                }
            },
            areaStyle: {normal: {}},
            data:[820, 932, 901, 934, 1290, 1330, 1320]
        }
    ]
    }
    var dom = document.getElementById('chart-panel')
        var quyu = this.echarts.init(dom)
        quyu.setOption(option);
        var _this  =this;
    _this.connection=this.$store.state.SignalRconnection;
        // //接收别人发过来的消息
    _this.connection.on("ReceiveMessage", function(user, message) {
        // _this.$Notice.info({ content: , duration: 1 });
        _this.$Notice.success({ title: message + user});
        });
    },
    methods:{
        SenMsg() {
        var msg = this.message;
        var SenderName="uwladmin";
        var SenderId="";
        var ReceiverId="ad73d0f6-33c9-40e3-8c56-f0ec8e35315f";
        this.connection.invoke("SendMessage", SenderName,SenderId, ReceiverId,msg).catch(function(err) {
            return console.error(err);
        });
        },
    }


}
</script>
