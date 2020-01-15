//logs.js
const util = require('../../utils/util.js')
const app = getApp()
Page({
  data: {
    curLang: {},
    langList: app.globalData.langList
  },
  onShow: function () {
    //因为要多次进入该页面，所以用onShow，不用onLoad
    this.setData({ curLang: app.globalData.curLang })
  },
  onTapItem: function(e) {
    let langObj = e.currentTarget.dataset
    wx.setStorageSync('language', langObj)
    this.setData({'curLang': langObj})
    app.globalData.curLang = langObj
    wx.switchTab({ url: '/pages/index/index'})
    console.log(e)
  }
})
