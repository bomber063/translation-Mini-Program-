# translation-Mini-Program-
## app.wxss
* 用到样式导入
* 使用@import语句可以导入外联样式表，@import后跟需要导入的外联样式表的相对路径，用;表示语句结束。比如
```
@import "./assets/iconfont/iconfont.wxss";
```
## iconfont.wxss
* 用到[@font-face](https://developer.mozilla.org/zh-CN/docs/Web/CSS/@font-face)
* 在同时使用url()和local()功能时，为了用户已经安装的字体副本在需要使用时被使用，如果在用户本地没有找到字体副本就会去使用户下载的副本查找字体。
* 这里的主要是通过[iconfont](https://www.iconfont.cn/)的font-class引用，当然也可以用其他的引用。
* 我这里生成的[源码链接](http://at.alicdn.com/t/font_1609616_ja0bvddti2f.css)，不过我删除了一部分多余的代码。
## md5.min.js
* md5加密方式见文章[js MD5加密处理](https://www.cnblogs.com/CooLLYP/p/8628467.html),[md5的js的源码地址](https://github.com/blueimp/JavaScript-MD5/tree/master/js)

## index.js
* [wx.setStorageSync('history', history)](https://developers.weixin.qq.com/miniprogram/dev/api/storage/wx.setStorageSync.html)，将数据存储在本地缓存中指定的 key 中。会覆盖掉原来该 key 对应的内容。除非用户主动删除或因存储空间原因被系统清理，否则数据都一直可用。单个 key 允许存储的最大数据长度为 1MB，所有数据存储上限为 10MB。它是wx.setStorage 的同步版本。
* [setData](https://developers.weixin.qq.com/miniprogram/dev/reference/api/Page.html#Page.prototype.setData(Object%20data,%20Function%20callback)) **函数用于将数据从逻辑层发送到视图层**（异步），同时改变对应的 this.data 的值（同步）。下面就是把result，也就是翻译的结果设置为res.trans_result，然后显示在视图层。trans_result这个key是[百度通用翻译API文档](https://api.fanyi.baidu.com/doc/21)默认的返回的结果的key。
```
this.setData({'result': res.trans_result})
```
* [getApp()](https://developers.weixin.qq.com/miniprogram/dev/reference/api/getApp.html)获取到小程序全局唯一的 App 实例。
* onInput是由于index.wxml里面用了`bindinput=onInput`,[bindinput](https://developers.weixin.qq.com/miniprogram/dev/component/input.html)里面的事件，比如用e代替，那么就可以通过e.detail获取到细节对象。
```
  onInput: function(e) {
    this.setData({'query': e.detail.value})
    if(this.data.query.length > 0) {
      this.setData({ 'hideClearIcon': false })
    }else{
      this.setData({ 'hideClearIcon': true })
    }
    
    console.log('focus')
  },
```
* [unshift](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/unshift)方法将一个或多个元素添加到数组的开头，并返回该数组的新长度(该方法修改原有数组)。
## app.js
*     this.globalData.curLang = wx.getStorageSync('curLang') ||     this.globalData.langList[0]

## api.js
* 设置为我自己的百度翻译的appid和key。
```
const appid = '20200110000374561'
const key = 'txvBkUR3vgfaTYSaXTim'
```
* 这个主要参考文档可以查看[百度通用翻译API文档](https://api.fanyi.baidu.com/doc/21)
* [Date.now()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Date/now)方法返回自1970年1月1日 00:00:00 UTC到当前时间的毫秒数。
* 用到[wx.request](https://developers.weixin.qq.com/miniprogram/dev/api/network/request/wx.request.html)发请求。
* 可以设置为[get或者post请求](https://api.fanyi.baidu.com/doc/21)
```
  //method为post的时候，需要把header的content-type设置为application/x-www-form-urlencoded,如果是get请求就不需要，默认就是get请求
  method:'POST',
  header:{'content-type':'application/x-www-form-urlencoded'},
```
* trans_result这个key是[百度通用翻译API文档](https://api.fanyi.baidu.com/doc/21)默认的返回的结果的key。
* 这里如果是请求成功了，把请求的数据提交，也就是
```
      resolve(res.data)
```
* 如果请求失败会把整个请求失败的对象返回呈现在报错里面
```
      reject({ status: 'error', msg: '翻译失败' })
```
* 另外如果请求失败的会还会弹出toast，通过[wx.showToast](https://developers.weixin.qq.com/miniprogram/dev/api/ui/interaction/wx.showToast.html#%E6%B3%A8%E6%84%8F)
```
      wx.showToast({
        title: '翻译失败',
        icon: 'none',
        duration: 3000
      })
```
* [wx.getStorageSync](https://developers.weixin.qq.com/miniprogram/dev/api/storage/wx.getStorageSync.html),它是wx.getStorage 的同步版本，从本地缓存中异步获取指定 key 的内容。
```
    this.globalData.curLang = wx.getStorageSync('curLang') ||     this.globalData.langList[0]
```
## index.wxml
* [bindtap](https://developers.weixin.qq.com/miniprogram/dev/framework/view/wxml/event.html#%E4%BA%8B%E4%BB%B6%E7%9A%84%E4%BD%BF%E7%94%A8%E6%96%B9%E5%BC%8F)这个是当用户点击该组件的时候会在该页面对应的Page中找到相应的事件处理函数。

