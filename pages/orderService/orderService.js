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
    hiddenLoading:false
  },
  onLoad: function () {
    var _this = this;
    let {strLatitude,strLongitude,endLatitude,endLongitude} = app.globalData
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
                color: '#FF0000DD',
                width: 4
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

  onShow(){
    this.requesDriver();
    this.mapCtx = wx.createMapContext("didiMap");
    this.movetoPosition();
  },
  requesDriver(){
    wx.request({
      url: 'https://mock.presstime.cn/mock/6346b7df03bda8005d33525b/comment/getname',
      
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
   
  },
  movetoPosition: function(){
    this.mapCtx.moveToLocation();
  },
 
  bindregionchange: (e)=>{

  },
  toCancel(){
    wx.redirectTo({
      url: "/pages/cancel/cancel"
    })
   
  },
  toApp(){
    wx.showToast({
      title: '暂不支持',
      icon: 'success',
      duration: 1000
    })
  },
  toEvaluation(){
    wx.redirectTo({
      url:"/pages/evaluation/evaluation",
    })
  },
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

  
  
})