//index.js
//获取应用实例
import { translate } from '../../utils/api.js'
const app = getApp()

Page({
  data: {
    query: '',
    hideClearIcon: true,
    result: [],
    curLang: {}
  },
  onLoad: function( options) {
    if(options.query) {
      this.setData({ query: options.query })
    }
    if(options.result){
      this.setData({ result: [options.result] })
    }
  },
  onShow: function () {
    // console.log(`this.data.query`)
    // console.log(this.data.query)
    // console.log(`this.data.result`)
    // console.log(this.data.result)
    if (this.data.curLang.lang !== app.globalData.curLang.lang) {
      this.setData({curLang: app.globalData.curLang})
        if (this.data.result) {
            return
        }
        if (!this.data.result) {
          this.onConfirm()
        }
    }
    //下面四行代码是不需要通过result传值过来，而是通过再次翻译的结果显示出来。
    // if (this.data.curLang.lang !== app.globalData.curLang.lang) {
    //   this.setData({ curLang: app.globalData.curLang })
    //   this.onConfirm()
    // }


    // if(!this.data.curLang.lang){
    //   this.setData({ curLang: this.result })
    //   // this.onConfirm()
    // }
    // else if(this.data.curLang.lang){
    //   this.setData({ curLang: app.globalData.curLang })
    //   this.onConfirm()
    // }
  },
  onInput: function(e) {
    // console.log(e.detail)
    //把输入的信息用query作为key保存。
    this.setData({'query': e.detail.value})
    //如果长度大于0，就显示icon
    if(this.data.query.length > 0) {
      this.setData({ 'hideClearIcon': false })
    }else{
      this.setData({ 'hideClearIcon': true })
    }
    // console.log('focus')
  },
  //点击关闭的叉叉icon的时候清除输入数据并且把关闭的叉叉icon隐藏
  onTapClose: function() {
    this.setData({ query: '', hideClearIcon: true})
  },
  //当有完成键显示并点击的时候触发
  onConfirm: function() {
    //如果没有数据就直接返回
    if (!this.data.query) return
    // 如果有数据就执行translate这个函数开始翻译，百度文档说初始to的赋值不可以为'auto'
    translate(this.data.query, {from: 'auto', to: this.data.curLang.lang}).then((res)=>{
      //翻译成功后把翻译的结果保存在result这个key里面，trans_result是百度文档API里面的默认的key
      //并且把当前的result值设置为翻译后的结果，也就是响应传过来的结果res.trans_result
      this.setData({'result': res.trans_result})
      //把历史设置为缓存的历史，如果缓存历史没有就设置为空数组
      let history = wx.getStorageSync('history')||[]
      //在百度翻译的API里面解释默认的query原文是src，译文是dst
      history.unshift({ query: this.data.query, result: res.trans_result[0].dst})
      //如果历史长度大于10，就只显示是条信息
      history.length = history.length > 10 ? 10 : history.length
      //把历史信息保存在本地缓存里面，用history这个key保存
      wx.setStorageSync('history', history)
      // console.log(history)
    })
  }
})
