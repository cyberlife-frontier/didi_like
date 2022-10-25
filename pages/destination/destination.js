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
    address: [],
    city: ['全国','全国',''],
    customItem:'全国'
  },
onLoad(){
  this.requestHistory();
},
requestHistory(e){
  wx.request({
      url: 'https://mock.presstime.cn/mock/6346b7df03bda8005d33525b/comment/getname',
      
    success:((res)=>{
      const entity = res.data.entity;
      this.setData({
        entity
      })
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

  bindRegionChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
        city: e.detail.value
    })
  },

  searchInputend(e){
   
    var that = this;
    var  value = e.detail.value
    var address = that.address;
   
    qqmapsdk.getSuggestion({
      keyword: value,
      region: this.data.city[1],
      success: function(res){
        let data = res.data
        console.log(data);
      that.setData({
        address: data,
        value
      })
      }
    })
  },
  
})