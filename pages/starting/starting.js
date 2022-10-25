var QQMapWX = require('../../libs/qqmap-wx-jssdk.js');
var qqmapsdk;
qqmapsdk = new QQMapWX({
  key:'BLMBZ-7O2C4-UXVUK-XJGXO-PRYAV-ZBBCZ'
});
const app = getApp()
Page({
  data: {
    scale: 16,
    latitude: 0,
    longitude: 0,
    address: '',
    bluraddress: '',
   controls:[
       {id: "",
        iconPath: "",
        position: {
          left: "",
          top: "",
          width: "",
          height: ""
          },
        clickable: Boolean}
   ]
   
  },
  onLoad: function (options) {
    wx.getLocation({
      type: "gcj02",
      success:(res)=>{
        // console.log(res)
        this.setData({
          longitude:res.longitude,
          latitude: res.latitude
        })
     
    var that = this;
    qqmapsdk.reverseGeocoder({
      location: {
        latitude:  res.latitude,
        longitude: res.longitude,
    },
      success: function (res) {
        
        app.globalData.location=location
        that.setData({
          address: res.result.address,
          bluraddress: res.result.formatted_addresses.recommend
        });
      },
    
    });
      }
      })

    // this.moveToLocation();

    wx.getSystemInfo({
      success: (res)=>{ 
      //console.log(this.data.controls[0].position);
        this.setData({
            controls:[{
                id: 1,
                iconPath: "../../assets/images/marker.png",
                position: {
                  left: res.screenWidth/2 - 15,
                  top: res.screenHeight/2 - 45,
                  width: 22,
                  height: 45
                  },
                clickable: true
              },{
                id: 2,
                iconPath: "../../assets/images/location.png",
                position: {
                  left: 20, // 单位px
                  top: res.screenHeight/2 , 
                  width: 40, // 控件宽度/px
                  height: 40,
                  },
                clickable: true
              }],
        })

      }
    })
  },

  onReady: function(){
    this.mapCtx = wx.createMapContext("didiMap"); // 地图组件的id
    this.movetoPosition()

  },
  controltap: function(e){
  
    console.log(e.controlId)
    if(e.controlId==1){
      this.movetoLocation();
    }
  
  },
  bindregionchange: function(e){
    var that = this
    this.mapCtx.getCenterLocation({
      success: function (res) {
        app.globalData.strLatitude=res.latitude
        app.globalData.strLongitude= res.longitude
      qqmapsdk.reverseGeocoder({
        location: {
          latitude:  res.latitude,
          longitude: res.longitude,
      },
      success: function (res) {
        
        that.setData({
          address: res.result.address,
          bluraddress: res.result.formatted_addresses.recommend
        })
      },
      });
       
      }
    })

  },
  movetoPosition: function(){
    this.mapCtx.moveToLocation();
  },
toIndex(){
  let  bluraddress = this.data.bluraddress;
 app.globalData.bluraddress=bluraddress
  wx.redirectTo({
    url: "/pages/index/index",
  })
},
  
  
})