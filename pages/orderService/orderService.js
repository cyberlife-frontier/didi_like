import util from '../../utils/index';
var QQMapWX = require('../../libs/qqmap-wx-jssdk.js');
var qqmapsdk;
qqmapsdk = new QQMapWX({
  key:'BLMBZ-7O2C4-UXVUK-XJGXO-PRYAV-ZBBCZ'
});

const app = getApp();
Page({
  data: {
    scale: 14,
    hiddenLoading:false,
    convert:1,
    navScrollLeft: 0,
    currentTab: 0,
    mode:"driving",
    // 选定的路线模式
    policy:"LEAST_TIME",
    //driving路线策略
    policy2:"LEAST_TIME",
    //transit路线策略
    navData:[
        {
            name:"驾车",
            modes:"driving"
        },
        {
            name:"公交",
            modes:"transit"
        },
        {
            name:"骑行",
            modes:"bicycling"
        },
        {
            name:"步行",
            modes:"walking"
        },    
    ],
    policy_driver:[
        {
            name:"时间最短",
            policies:"LEAST_TIME"
        },
        {
            name:"接乘客",
            policies:"PICKUP"
        },
        {
            name:"送乘客",
            policies:"TRIP"
        },
    ],
    policy_transit:[
        {
            name:"时间最短",
            policies:"LEAST_TIME"
        },
        {
            name:"少换乘",
            policies:"LEAST_TRANSFER"
        },
        {
            name:"少步行",
            policies:"LEAST_WALKING"
        },
        {
            name:"推荐路线",
            policies:"RECOMMEND"
        },
    ],
    tra_route:[
        {  
            name:"路线1",
            tra_ways:0
        },
        {  
            name:"路线2",
            tra_ways:1
        },
        {  
            name:"路线3",
            tra_ways:2
        },
        {  
            name:"路线4",
            tra_ways:3
        },
        {  
            name:"路线5",
            tra_ways:4
        },
    ],
    tra_way:0,
    iconPath:"../../assets/images/mapCart.png",
  },

  //首次打开页面时加载
  onLoad: function () {
    //确保在子函数内部可以渲染视图
    var _this = this;
    //获取本地数据
    let {strLatitude,strLongitude,endLatitude,endLongitude} = app.globalData
    //设置地标 
    this.setData({
      markers: [{
        iconPath: "../../assets/images/str.png",
        id: 0,
        latitude: strLatitude,
        longitude:strLongitude,
        width: 30,
        height: 30
      },{
        iconPath: "../../assets/images/end.png",
        id: 1,
        latitude: endLatitude,
        longitude:endLongitude,
        width: 30,
        height: 30
      }],
      //navData
    });
    
    
    qqmapsdk.direction({
        mode: 'driving',//可选值：'driving'（驾车）、'walking'（步行）、'bicycling'（骑行），不填默认：'driving',可不填
        //from参数不填默认当前地址
        
        from: {
            latitude: strLatitude,
            longitude: strLongitude
            },
        to: {
          latitude: endLatitude,
          longitude:endLongitude
        },
      success:function(res){
        //console.log(res);
        var ret = res;
        var coors = ret.result.routes[0].polyline, pl = [];
        //坐标解压（返回的点串坐标，通过前向差分进行压缩）
        var kr = 1000000;
        for (var i = 2; i < coors.length; i++) {
          coors[i] = Number(coors[i - 2]) + Number(coors[i]) / kr;
        }
        //将解压后的坐标放入点串数组pl中
        for (var i = 0; i < coors.length; i += 2) {
          pl.push({ latitude: coors[i], longitude: coors[i + 1] })
        }
        //console.log(pl)
        //设置polyline属性，将路线显示出来,将解压坐标第一个数据作为起点
        _this.setData({
            latitude:pl[0].latitude,
            longitude:pl[0].longitude,
            polyline: [{
                points: pl,
                color: '#FF5352',
                borderWidth: 2,
                borderColor: "#C2C5C8",
                width: 10,
                arrowLine: true,
          }]
        })
      },
      fail: function (error) {
        console.error(error);
      },
      complete: function (res) {
        console.log(res);
      }
    })

    //获取界面的信息
  wx.getSystemInfo({
    success: (res)=>{
      _this.setData({
        controls:[{
          id: 1,
          iconPath: '../../assets/images/mapCart.png',
          position: {
            left: res.screenWidth/2 - 15,
            top: res.screenHeight/2 - 25,
            width: 22,
            height: 45
            },
          clickable: true
        },{
          id: 2,
          iconPath: '../../assets/images/location.png',
          position: {
            left: 20, // 单位px
            top: res.screenHeight/2 +10, 
            width: 40, // 控件宽度/px
            height: 40,
            },
          clickable: true
        },{
          id: 3,
          iconPath: '../../assets/images/walk.png',
          position: {
            left: 20, // 单位px
            top: res.screenHeight/2 +60, 
            width: 40, // 控件宽度/px
            height: 40,
            },
          clickable: true
        }],
     
      })
    }
  })
  
  },//Onload:function()

//驾车的路线
dri_dir:function(){
    var _this=this;
    var dri_pre =['REAL_TRAFFIC','NAV_POINT_FIRST'];
    const i =Math.floor(Math.random()*2);
    const dri_policy = this.data.policy + ',' +dri_pre[i];
    console.log(dri_policy);
    let {strLatitude,strLongitude,endLatitude,endLongitude} = app.globalData
    qqmapsdk.direction({
        mode: this.data.mode,//可选值：'driving'（驾车）、'walking'（步行）、'bicycling'（骑行），不填默认：'driving',可不填
        //from参数不填默认当前地址
        policy:dri_policy,
        from: {
            latitude: strLatitude,
            longitude: strLongitude
            },
        to: {
          latitude: endLatitude,
          longitude: endLongitude
        },
      success:function(res){
        console.log(res);
        var ret = res;
        var coors = ret.result.routes[0].polyline, pl = [];
        //坐标解压（返回的点串坐标，通过前向差分进行压缩）
        var kr = 1000000;
        for (var i = 2; i < coors.length; i++) {
          coors[i] = Number(coors[i - 2]) + Number(coors[i]) / kr;
        }
        //将解压后的坐标放入点串数组pl中
        for (var i = 0; i < coors.length; i += 2) {
          pl.push({ latitude: coors[i], longitude: coors[i + 1] })
        }
        //console.log(pl)
        //设置polyline属性，将路线显示出来,将解压坐标第一个数据作为起点
        _this.setData({
            latitude:pl[0].latitude,
            longitude:pl[0].longitude,
            polyline: [{
                points: pl,
                color: '#FF5352',
                borderWidth: 2,
                borderColor: "#C2C5C8",
                width: 10,
                arrowLine: true,
          }]
        })
      },
      fail: function (error) {
        console.error(error);
      },
      complete: function (res) {
        console.log(res);
      }
    })
    this.data.policy ="LEAST_TIME";
},

//公交路线
tra_dir:function(){
    var _this=this;
    const way =this.data.tra_way;
    let {strLatitude,strLongitude,endLatitude,endLongitude} = app.globalData
    //调用距离计算接口
    qqmapsdk.direction({
        mode: 'transit',//'transit'(公交路线规划)
        //from参数不填默认当前地址
        policy:this.data.policy2,
        from: {
            latitude: strLatitude,
            longitude: strLongitude
            },
        to: {
          latitude: endLatitude,
          longitude: endLongitude
        },
        success: function (res) {
          console.log(res);
          var ret = res.result.routes[way];
          var count = ret.steps.length;
          var pl = [];
          var coors = [];
          //获取各个步骤的polyline
          for(var i = 0; i < count; i++) {
            if (ret.steps[i].mode == 'WALKING' && ret.steps[i].polyline) {
              coors.push(ret.steps[i].polyline);
            }
            if (ret.steps[i].mode == 'TRANSIT' && ret.steps[i].lines[0].polyline) {
              coors.push(ret.steps[i].lines[0].polyline);
            }
          }       
          //坐标解压（返回的点串坐标，通过前向差分进行压缩）
          var kr = 1000000;
          for (var i = 0 ; i < coors.length; i++){
            for (var j = 2; j < coors[i].length; j++) {
              coors[i][j] = Number(coors[i][j - 2]) + Number(coors[i][j]) / kr;
            }
          }
          //定义新数组，将coors中的数组合并为一个数组
  
          var coorsArr = [];
          for (var i = 0 ; i < coors.length; i ++){
            coorsArr = coorsArr.concat(coors[i]);
          }
          //将解压后的坐标放入点串数组pl中
          for (var i = 0; i < coorsArr.length; i += 2) {
            pl.push({ latitude: coorsArr[i], longitude: coorsArr[i + 1] })
          }
          //设置polyline属性，将路线显示出来,将解压坐标第一个数据作为起点
          _this.setData({
            latitude:pl[0].latitude,
            longitude:pl[0].longitude,
            polyline: [{
                points: pl,
                color: '#42E151',
                borderWidth: 2,
                borderColor: "#C2C5C8",
                width: 10,
                arrowLine: true,
            }]
          })
        },
        fail: function (error) {
          console.error(error);
        },
        complete: function (res) {
          console.log(res);
        }
      });
      this.data.policy2 ="LEAST_TIME";
      //运行完毕初始化policy2
      this.data.tra_way= 0;
    //运行完毕初始化tra_way 
},

//自行车和步行的路线
wal_bic_dir:function(){
    var _this=this;
    let {strLatitude,strLongitude,endLatitude,endLongitude} = app.globalData
    qqmapsdk.direction({
        mode: this.data.mode,//可选值：'driving'（驾车）、'walking'（步行）、'bicycling'（骑行），不填默认：'driving',可不填
        //from参数不填默认当前地址
        //policy:this.data.policy,
        from: {
            latitude: strLatitude,
            longitude: strLongitude
            },
        to: {
          latitude: endLatitude,
          longitude:endLongitude
        },
      success:function(res){
        console.log(res);
        var ret = res;
        var coors = ret.result.routes[0].polyline, pl = [];
        //坐标解压（返回的点串坐标，通过前向差分进行压缩）
        var kr = 1000000;
        for (var i = 2; i < coors.length; i++) {
          coors[i] = Number(coors[i - 2]) + Number(coors[i]) / kr;
        }
        //将解压后的坐标放入点串数组pl中
        for (var i = 0; i < coors.length; i += 2) {
          pl.push({ latitude: coors[i], longitude: coors[i + 1] })
        }
        //console.log(pl)
        //设置polyline属性，将路线显示出来,将解压坐标第一个数据作为起点
        _this.setData({
            latitude:pl[0].latitude,
            longitude:pl[0].longitude,
            polyline: [{
                points: pl,
                color: '#D52DD5',
                //colorList:['#46A940','#E4FF00','#D52DD5','#DF985F'],
                borderWidth: 2,
                borderColor: "#C2C5C8",
                width: 10,
                arrowLine: true,
          }]
        })
      },
      fail: function (error) {
        console.error(error);
      },
      complete: function (res) {
        console.log(res);
      }
    })
},

//  交通工具选择实现
switchNav(event){
   //this.requestWaitingtime();
   //const name = event.currentTarget.dataset.name
    this.data.mode = event.currentTarget.dataset.modes;
    const mode =this.data.mode;
    if(mode == "driving"){
        //如果mode为driving 则调用dri_dir函数
        this.dri_dir();
    }
    else if(mode =="transit"){
        //transit 则调用tra_dir函数
        this.tra_dir();
    }
    else{
        //否则调用wal_bic_dir
        this.wal_bic_dir();
    }
    console.log(mode);
    if(mode == "bicycling"){
        this.setData({
            //name,
           // isLoading:true,
           // waitingTimes: ''
            iconPath: '../../assets/images/bicycling.png',
        })
    }else if(mode =="walking"){
        this.setData({
            iconPath: '../../assets/images/two_men_jog.png',
        })
    }else {
        this.setData({
             iconPath: '../../assets/images/mapCart.png',
         })
    }
    
    var cur = event.currentTarget.dataset.current; 
    var singleNavWidth = this.data.windowWindth/4;
    
    this.setData({
        navScrollLeft: (cur - 1) * singleNavWidth,
        currentTab: cur,
    })      
},
//工具策略选择实现的容器实现
switchTab(event){
    var cur = event.detail.current;
    var singleNavWidth =55;
    this.setData({
        currentTab: cur,
        navScrollLeft: (cur - 1) * singleNavWidth
    });
},
//drving工具策略选择实现
choosepolicies(e){
    this.data.policy = e.currentTarget.dataset.policies;
    console.log(this.data.policy);
    //if(this.data.mode=="driving"){
        this.dri_dir();
    //}
},
//transit工具策略选择实现
choosepolicies2(e){
    const way =e.currentTarget.dataset.way;
    const policy2 = e.currentTarget.dataset.policy2;
    if(typeof(way) !== 'undefined'&&'Null'){
        this.data.tra_way =way;
        console.log(this.data.tra_way);
        this.tra_dir();
    }
    if(typeof(policy2) !== 'undefined'&&'Null'){
        this.data.policy2 = policy2;
        console.log(this.data.policy2);
        this.tra_dir();
    }
    
},

//drivers 与 route 的转换
    convertinfo(){
        const flag = -this.data.convert
    this.setData({
        convert:flag
    })
    },


  onShow(){
    this.requesDriver();
    this.mapCtx = wx.createMapContext("didiMap");
    this.movetoPosition();
  },
  requesDriver(){
    wx.request({
      url: 'https://www.fastmock.site/mock/6912acf29b6d3bc12a9658e4c011e118/comment/getinfo',
      //获取司机信息
    success:((res)=>{
      const driver = res.data.drivers
      //const driver = drivers[Math.floor(Math.random()*drivers.length)];
      //console.log(drivers);
      wx.setStorage({
        key:"driver",
        data:driver
      });
      this.setData({
        hiddenLoading:true,
        driver:driver
      })
     })
    })
  },
  bindcontroltap: (e)=>{
    console.log("hello")
    this.movetoPosition();
  },
  onReady(){
   //Need more time to think over
  },
  movetoPosition: function(){
    this.mapCtx.moveToLocation();
  },
 
  bindregionchange: (e)=>{
    //Not implemented yet
  },
  //取下转向
  toCancel(){
    wx.redirectTo({
      url: "/pages/cancel/cancel"
    })
   
  },
  //下载app
  toApp(){
    wx.showToast({
      title: '暂不支持',
      icon: 'success',
      duration: 1000
    })
  },
  //评估服务
  toEvaluation(){
    wx.redirectTo({
      url:"/pages/evaluation/evaluation",
    })
  },
  //页面渲染完成后触发一次
  onReady: function () {
    wx.getLocation({
      type: "gcj02",
      success:(res)=>{
        this.setData({
          //longitude:res.longitude,
          //latitude: res.latitude
        })
      }
      })
     
  },
//more function to be continue
})