import md5 from './md5.min.js'

const appid = '20200110000374561'
const key = 'txvBkUR3vgfaTYSaXTim'

//因为百度翻译的API文档里面说to不可以设置为'auto',所以我把初始赋值取消了
function translate(q, { from = 'auto', to} = { from: 'auto', to: 'auto' }) {
  return new Promise((resolve, reject) => {
    let salt = Date.now()
    let sign = md5(`${appid}${q}${salt}${key}`)
    wx.request({
      url: 'https://fanyi-api.baidu.com/api/trans/vip/translate',
      data: {
        q,
        from,
        to,
        appid,
        salt,
        sign
      },
      //method为post的时候，需要把header的content-type设置为application/x-www-form-urlencoded,如果是get请求就不需要，默认就是get请求
      // method:'POST',
      // header:{'content-type':'application/x-www-form-urlencoded'},
      success(res) {
        if (res.data && res.data.trans_result) {
          resolve(res.data)
        } else {
          reject({ status: 'error', msg: '翻译失败' })
          wx.showToast({
            title: '翻译失败',
            icon: 'none',
            duration: 3000
          })
        }
      },
      fail() {
        reject({ status: 'error', msg: '翻译失败' })
        wx.showToast({
          title: '网络异常',
          icon: 'none',
          duration: 3000
        })
      }
    })
  })
}
module.exports.translate = translate