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
    //获取到change.wxml里面的公用属性的数据
    let langObj = e.currentTarget.dataset
    //把获取到的数据已变量language储存在缓存里面
    wx.setStorageSync('language', langObj)
    //把获取的数据设置到当前页面的变量curLang里面
    this.setData({'curLang': langObj})
    //把获取的数据设置到全局数据的变量curLang里面
    app.globalData.curLang = langObj
    wx.switchTab({ url: '/pages/index/index'})
  }
})
