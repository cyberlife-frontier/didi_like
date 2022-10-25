import util from '../../utils/index';
const app = getApp()
Page({

  data: {
  
  },
  onLoad(e){
  this.requestCart();
  },
  requestCart(e){
    wx.request({
        url: 'https://mock.presstime.cn/mock/6346b7df03bda8005d33525b/comment/getname',
        
      success:((res)=>{
        const navData = res.data.navData;
        this.setData({
            navData,
        })
      })
    })
},
  backIndex(e){
    const id = e.currentTarget.dataset.id;
    const name = e.currentTarget.dataset.name;
    app.globalData.id=id
    wx.reLaunch({
      url: "/pages/index/index"
    })
  },

})