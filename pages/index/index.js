import util from '../../utils/index';
var QQMapWX = require('../../libs/qqmap-wx-jssdk.js');
var qqmapsdk;
qqmapsdk = new QQMapWX({
  key:'BLMBZ-7O2C4-UXVUK-XJGXO-PRYAV-ZBBCZ'
});
const app = getApp()
Page({
    data: {
        currentTab: 1,
        currentCost: 0,
        cart: '快车',
        navScrollLeft: 0,
        duration: 1000,
        interval: 5000,
        isLoading: true,
        color:"#cccccc",
        callCart: true,
        destination: '',
        address:'',
        index: '',
    },
    onLoad: function(options) {
       this.requestCart();
       this.requestWaitingtime();
    },
    requestCart(e){
        wx.request({
            url: 'https://www.fastmock.site/mock/6912acf29b6d3bc12a9658e4c011e118/comment/getinfo',
             
          success:((res)=>{
            const navData = res.data.navData;
            const imgUrls = res.data.imgUrls;
            const cost = res.data.cost
            //console.log(navData);
           //console.log(imgUrls);
            
            this.setData({
                navData,
                imgUrls,
                cost
            })
          })
        })
    },
    onShow(){
        this.setData({
          
            address:app.globalData.bluraddress,
            destination:app.globalData.destination,
            currentTab:app.globalData.id,
        })
    },
    requestWaitingtime(){
        setTimeout(() => {
            wx.request({
                url: 'https://www.fastmock.site/mock/6912acf29b6d3bc12a9658e4c011e118/comment/getinfo',
              success:((res)=>{
              const arr = res.data.waitingTimes;
                //console.log(arr)
                var index = Math.floor((Math.random()*arr.length));
                // console.log(arr[index])
                this.setData({
                isLoading:false,
                waitingTimes: arr[index]
                })
              })
            })
        }, 1000);
    },
   
    toCast(e){
      const destination =this.data.destination
      const address =this.data.address
      if(address=='获取当前位置'){
        wx.showToast({
          title: '未获取位置信息',
          duration:1000
        })
      }
      else if(destination==''){
        wx.showToast({
            title: '目的地不能为空',
            icon: 'fail',
           mask: true,
            duration: 1000
          })
      }else{

        let {endLatitude,endLongitude,strLatitude,strLongitude} = app.globalData
        qqmapsdk.calculateDistance({
            mode: 'driving',
            from: {
                latitude: strLatitude,
                longitude: strLongitude
                },
            to:[ {
              latitude: endLatitude,
              longitude:endLongitude
          }],
          success: (res)=> {
            // console.log(res.result.elements[0].distance)
            var num1 = 8+1.9*(res.result.elements[0].distance/1000)
            var num2= 12+1.8*(res.result.elements[0].distance/1000)
            var num3= 16+2.9*(res.result.elements[0].distance/1000)
            var play1 = num1.toFixed(1)
            var play2 = num2.toFixed(1)
            var play3 = num3.toFixed(1)
            app.globalData.play=play1;//默认选择第一种出行方式
            this.setData({
                    play1:play1,
                    play2:play2,
                    play3:play3,
            })
          },
         
          });
        this.setData({
        
            callCart: false
        })
      }
        
       
    },
    
  toWait(e){
   
    wx.reLaunch({
        url:  "/pages/wait/wait",
    }),
    wx.showToast({
      title: '正在等待应答',
      duration:2000
    })
  },
    switchNav(event){
     
        this.requestWaitingtime();
       const cart = event.currentTarget.dataset.name
        let text = this.data.navData;
        this.setData({
            cart,
            isLoading:true,
            waitingTimes: ''
        })
        var cur = event.currentTarget.dataset.current; 
        var singleNavWidth = this.data.windowWindth/6;
        
        this.setData({
            navScrollLeft: (cur - 1) * singleNavWidth,
            currentTab: cur,
        })      
    },
    switchCart(e){
        const id = e.currentTarget.dataset.index;
        app.globalData.play =e.currentTarget.dataset.play;
        //console.log(play);
        this.setData({
          index:id,
          
        })
       
    },
    switchTab(event){
        var cur = event.detail.current;
        var singleNavWidth =55;
        this.setData({
            currentTab: cur,
            navScrollLeft: (cur - 1) * singleNavWidth
        });
    },
    showUser(){
    // 如果全局未存手机号进入登录页
    if(app.globalData.userInfo && app.globalData.userInfo.phone){
       wx.showToast({
         title: '用户'+app.globalData.userInfo.phone,
         duration:2000
       })
    }else{
        wx.navigateTo({
        url:  "/pages/login/login",
        })
    }
    },
    onChange(e){
        const currentCost = e.target.dataset.index;
        this.setData({
            currentCost
        })
      
    }
})