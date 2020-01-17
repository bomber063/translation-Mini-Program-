// pages/history/history.js
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    history: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
  },

  onShow: function () {
    this.setData({ history: wx.getStorageSync('history')})
  },

  onTapItem: function(e) {
    console.log(`e.currentTarget.dataset.query`)
    console.log(e.currentTarget.dataset.query)
    console.log(`e.currentTarget.dataset.result`)
    console.log(e.currentTarget.dataset.result)
    wx.reLaunch({
      // url: `/pages/index/index?query=${e.currentTarget.dataset.query}`
      url: `/pages/index/index?query=${e.currentTarget.dataset.query}&result=${e.currentTarget.dataset.result}`
      // url: `/pages/index/index?r=${e.currentTarget.dataset.r}&query=${e.currentTarget.dataset.query}`
      // url: `/pages/index/index?result=${e.currentTarget.dataset.result}`
      // url: `/pages/index/index?query=11&&id=13`
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})