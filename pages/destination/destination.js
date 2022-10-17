import util from '../../utils/index';

var QQMapWX = require('../../libs/qqmap-wx-jssdk.js');
var qqmapsdk;
qqmapsdk = new QQMapWX({
  key:'BLMBZ-7O2C4-UXVUK-XJGXO-PRYAV-ZBBCZ'
});
const app = getApp();
Page({
  data: {
    value: '',
    address: []
  },
onLoad(){
  this.requestHistory();
},
requestHistory(e){
  util.request({
      url: 'https://mock.presstime.cn/mock/6346b7df03bda8005d33525b/comment/getname',
      mock: false,
    }).then((res)=>{
 
      const entity = res.data.entity;
  
      this.setData({
        entity
      })
    })
  },
  toIndex(e){
    const destination = e.currentTarget.dataset.destination;
    const endAddress =  e.currentTarget.dataset.end;
    qqmapsdk.geocoder({
      address: endAddress,
      success: function(res){
        app.globalData.endLatitude=res.result.location.lat;
        app.globalData. endLongitude= res.result.location.lng;
      }
    })
    app.globalData.destination=destination,
    wx.redirectTo({
      url: "/pages/index/index",
    })
  },

  switchCity(e){
    qqmapsdk.getCityList({
      success: function(res){
        console.log(res)
      }
    })
  },
  searchInputend(e){
   
    var that = this;
    var  value = e.detail.value
    var address = that.address;
   
    qqmapsdk.getSuggestion({
      keyword: value,
      region: '南昌',
      success: function(res){
        let data = res.data
      that.setData({
        address: data,
        value
      })
      }
    })
  },
  
})