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
        url: 'https://www.fastmock.site/mock/6912acf29b6d3bc12a9658e4c011e118/comment/getinfo',
        
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