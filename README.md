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
* [setData](https://developers.weixin.qq.com/miniprogram/dev/reference/api/Page.html#Page.prototype.setData(Object%20data,%20Function%20callback)) **函数用于将数据从逻辑层发送到视图层**（异步），同时改变对应的 this.data 的值（同步）。下面就是把result，也就是翻译的结果设置为res.trans_result，然后显示在视图层。trans_result这个key是[百度通用翻译API文档](https://api.fanyi.baidu.com/doc/21)默认的返回的结果的key。并且把当前的result值设置为翻译后的结果，也就是响应传过来的结果res.trans_result

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
* 这里在真机调试的时候
  会弹出翻译失败，它的原因主要是index.wxml文件里面同时存在[bindconfirm——点击完成时和bindblur——输入框失去焦点](https://developers.weixin.qq.com/miniprogram/dev/component/textarea.html)，那么会在相隔很短的事件间隔内翻译两次(第二次会翻译失败)。因为标准版本的QPS(每秒访问量)=1。用我自己的appid和key不会出现翻译失败的情况，因为我的是高级版本，高级版本的QPS(每秒访问量)=10.具体查看[通用翻译API产品服务介绍](https://api.fanyi.baidu.com/product/111)
```
bindconfirm='onConfirm' bindblur='onConfirm'
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
* 用到[navigator页面链接](https://developers.weixin.qq.com/miniprogram/dev/component/navigator.html)的两个属性
    * hover-class属性,默认属性值是`navigator-hover`，指定点击时的样式类，当`hover-class="none"`时，**没有点击态效果**
    * url属性，当前小程序内的跳转链接。
* [textarea多行输入框](https://developers.weixin.qq.com/miniprogram/dev/component/textarea.html)。该组件是原生组件，使用时请注意相关限制。用到它的以下属性
    * placeholder——输入框为空时占位符。
    * placeholder-style——指定 placeholder 的样式，目前仅支持color,font-size和font-weight
    * bindinput——当键盘输入时，触发 input 事件，event.detail = {value, cursor, keyCode}，keyCode 为键值，目前工具还不支持返回keyCode参数。bindinput 处理函数的返回值并不会反映到 textarea 上
    * bindconfirm——点击完成时， 触发 confirm 事件，event.detail = {value: value}
    * bindblur——输入框失去焦点时触发，event.detail = {value, cursor}
    * value——输入框的内容
* 用到[列表渲染](https://developers.weixin.qq.com/miniprogram/dev/reference/wxml/list.html)，[列表渲染 wx:key 的作用](https://segmentfault.com/a/1190000017999005),建议写上，因为不写上动态绑定会有一个警告。如不提供 wx:key，会报一个 warning， 如果明确知道该列表是静态，或者不必关注其顺序，可以选择忽略。
```
  <view class="text-result" wx:for="{{result}}" wx:key="index">
    <text selectable="true">{{item.dst}}</text>
  </view>
```
## index.wxss
* 这里主要注意用的尺寸单位是[rpx](https://developers.weixin.qq.com/miniprogram/dev/framework/view/wxss.html)。
* 另外icon-close是会和textarea重叠的，所以用绝对定位分开。因为设置了绝对定位，所以内联元素text就变成块级元素。
```
    <text class="iconfont icon-close" hidden="{{hideClearIcon}}" bindtap='onTapClose'></text>
    <view class="textarea-wrap">
      <textarea placeholder='请输入要翻译的文本' placeholder-style='color: #8995a1'  bindinput='onInput' bindconfirm='onConfirm' bindblur='onConfirm'  value="{{query}}"></textarea>
    </view>
    
.input-area .icon-close {
  position: absolute;
  right: 10rpx;
  top: 20rpx;
  z-index: 100;
  font-size: 35rpx;
  color: #888;
}
```
## change.json
* [页面配置](https://developers.weixin.qq.com/miniprogram/dev/framework/config.html#%E9%A1%B5%E9%9D%A2%E9%85%8D%E7%BD%AE)

## change.wxml
* 这里面用到一个公用属性[data-*](https://developers.weixin.qq.com/miniprogram/dev/framework/view/component.html#%E5%85%AC%E5%85%B1%E5%B1%9E%E6%80%A7),他会存在你绑定的事件，比如这个事件是e，那么对应的信息就会在currentTarget->dataset里面
```
  "currentTarget":  {
    "id": "tapTest",
    "dataset": {
      "hi":"WeChat"
    }
  },
```
* 比如我这里用到了`data-chs="{{language.chs}}" data-lang="{{language.lang}}" data-index="{{index}}`这些自定义的公用属性，并且有一个事件是`bindtap=onTapItem`
```
  <view class="item" data-chs="{{language.chs}}" data-lang="{{language.lang}}" data-index="{{index}}" wx:for="{{langList}}" wx:key="index" wx:for-item="language" bindtap='onTapItem'  hover-class="view-hover">
```
* 那么这个onTapItem里面的事件就可以在`currentTarget->dataset`里面找到这个公用属性的key和value
```
  onTapItem: function(e) {
    console.log(e)
  }
```
* 这些key和value分别是
```
chs: "中文"
index: 1
lang: "zh"
```
* [列表渲染](https://developers.weixin.qq.com/miniprogram/dev/reference/wxml/list.html),这里列表渲染默认的下标是index，对应下标的的变量名默认为item。当然可以指定这个下标和变量的名字。我这里就指定下标为**i**，变量名字为**language**.当指定的下标**i**与app.js中原本存储的语言列表对应的index一样的时候就显示这个**对号**。
```
<!--  列表渲染-->
  <view class="item" data-chs="{{language.chs}}" data-lang="{{language.lang}}" data-index="{{index}}" wx:for="{{langList}}" wx:key="index" wx:for-item="language" wx:for-index="i" bindtap='onTapItem'  hover-class="view-hover">
    <view class="item-inner">
      <text class="txt">{{language.chs}}</text>
      <text class="iconfont icon-duihao" wx:if="{{i===curLang.index}}"></text>
    </view>
  </view>
```
* 同时使用下面的公用属性和列表渲染。
```
<view class="container lang-list">
  <view class="title">翻译成</view>
<!--  下面的data-chs="{{la.chs}}" data-lang="{{la.lang}}" data-i="{{i}}"是一起使用的，是为了提供公用属性，但是公用属性的值，也就是value需要从渲染的变量里面去获取-->
<!--  下面的wx:for="{{langList}}" wx:key="i" wx:for-item="la" wx:for-index="i"是一起使用的，是为了渲染一个列表-->
  <view class="item" data-chs="{{la.chs}}" data-lang="{{la.lang}}" data-i="{{i}}" wx:for="{{langList}}" wx:key="i" wx:for-item="la" wx:for-index="i" bindtap='onTapItem'  hover-class="view-hover">
    <view class="item-inner">
<!--      {{la.chs}}就可以把前面渲染的列表列出呈现在页面中-->
      <text class="txt">{{la.chs}}</text>
<!--      下面左边的i是前面wx:for渲染的设置的下标i,右边的curLang.index是第一次进入，没有点击的时候，缓存中保存的数据，此时的数据的索引用的还全局数据，在全局数据里面的索引用的是index，当点击之后，通过change.js里面的onTapItem代码可以看到，已经把全局curLang变成了和通过公用属性保存的curLang，并且保存在缓存里面，此时用的索引是i,所以是curLang.i-->
      <text class="iconfont icon-duihao" wx:if="{{i===curLang.i||i===curLang.index}}"></text>
    </view>
  </view>
</view>


<!-- 下面是老师的代码，如果公用属性和最开始全局属性是一样的变量比如索引都是index，那么就不用考点击之后变化的判断，只需要判断一次，因为都是index作为索引-->
<view class="container lang-list">
  <view class="title">翻译成</view>
  <view class="item" data-chs="{{language.chs}}" data-lang="{{language.lang}}" data-index="{{index}}" wx:for="{{langList}}" wx:key="index" wx:for-item="language" bindtap='onTapItem'  hover-class="view-hover">
    <view class="item-inner">
      <text class="txt">{{language.chs}}</text>
      <text class="iconfont icon-duihao" wx:if="{{index===curLang.index}}"></text>
    </view>
  </view>
</view>
```
## change.js
* 用到[wx.switchTab](https://developers.weixin.qq.com/miniprogram/dev/api/route/wx.switchTab.html),跳转到 tabBar 页面，并关闭其他所有非 tabBar 页面,用到下面的属性
    * url——需要跳转的 tabBar 页面的路径 (代码包路径)（需在 app.json 的 tabBar 字段定义的页面），路径后不能带参数。
## history.js
* 用到[wx.reLaunch](https://developers.weixin.qq.com/miniprogram/dev/api/route/wx.reLaunch.html),关闭所有页面，打开到应用内的某个页面,用到的属性
    * url——需要跳转的应用内页面路径 (代码包路径)，路径后可以带参数。参数与路径之间使用?分隔，参数键与参数值用=相连，不同参数用&分隔；如 'path?key=value&key2=value2'
* 这里的代码如下
```
  onTapItem: function(e) {
    wx.reLaunch({
      url: `/pages/index/index?query=${e.currentTarget.dataset.query}`
    })
  },
```
* 当点击的死后会触发reLaunch，然后带上参数`query=${e.currentTarget.dataset.query}`，这个参数就是history.wxml里面的`data-query="{{item.query}}`也就是index.js里面翻译前的信息query
```
      history.unshift({ query: this.data.query, result: res.trans_result[0].dst})
```
* 然后跳转到index.js页面，这时候因为在此显示index.js页面，那么就会执行onShow
```
  onShow: function () {
    if (this.data.curLang.lang !== app.globalData.curLang.lang) {
      this.setData({ curLang: app.globalData.curLang })
      this.onConfirm()
    }
  },
```
* 因为index.wxml里面的value，也就是输入的信息是`{{query}}`
```
      <textarea placeholder='请输入要翻译的文本' placeholder-style='color: #8995a1'  bindinput='onInput' bindconfirm='onConfirm' bindblur='onConfirm'  value="{{query}}"></textarea>
```
* 所以就把value=query传过去显示，并且点击确认(onConfirm())，就会直接翻译你的内容了。
* 用wx.reLaunch传参的时候遇到一个问题，就是我传了两个参数，一个是query，另一个是result，但是只能在接受的页面index里面获取到传过去query的值，但是获取不到result的值。
```
  onTapItem: function(e) {
    console.log(`e.currentTarget.dataset.query`)
    console.log(e.currentTarget.dataset.query)
    console.log(`e.currentTarget.dataset.result`)
    console.log(e.currentTarget.dataset.result)
    wx.reLaunch({
      url: `/pages/index/index?query=${e.currentTarget.dataset.query}&result=${e.currentTarget.dataset.result}`
    })
  },
```
* 这个问题我在微信小程序开发交流专区发过一个[问题——wx.reLaunch(Object object)通过url传参数的问题，只能传query吗？](https://developers.weixin.qq.com/community/develop/doc/000aa6b1d3cf28f55fc914da656400)， **我怀疑这个传参是不是只能传query**
* 我把data数据里面的query不定义也可以传过来。
```
  data: {
    query: '',//这个定义删除也可以实现传参
    hideClearIcon: true,
    result: [],
    curLang: {}
  },
```
* 我为什么想要传这个result过去，是因为历史页面跳转到index页面后的翻译显示的结果是默认英文的翻译，如果之前的翻译是选择别的语言翻译(比如之前是韩语)的话就会出现语言不同啦（因为显示的是英语，英语和韩语翻译的结果不同）。**如果这里只能传query，那么就不能判断之前用的是英语翻译还是别的语言的翻译，所以这个问题我暂时还解决不了。**
### 传值的问题解决了
* 这里之前通过wx.reLaunch传值到onShow里面，所以获取不到。我把它放到onLoad里面就可以获取到了.
```
  onLoad: function( options) {
    if(options.query) {
      this.setData({ query: options.query })
    }
    if(options.result){
      this.setData({ result: [options.result] })
    }
  },
  onShow: function () {
    console.log(`this.data.query`)
    console.log(this.data.query)
    console.log(`this.data.result`)
    console.log(this.data.result)
    if (this.data.curLang.lang !== app.globalData.curLang.lang) {
      this.setData({curLang: app.globalData.curLang})
        if (this.data.result) {
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
  },
```
* 然后在index.wxml里面增加result就可以显示历史页面点击后的跳转的结果啦
```
        <text selectable="true">{{item.dst||result}}</text>
```
* 具体解决过程也可以看我发的问题——[问题——wx.reLaunch(Object object)通过url传参数的问题，只能传query吗？](https://developers.weixin.qq.com/community/develop/doc/000aa6b1d3cf28f55fc914da656400)
## util.js
* 好像并没有用到它。
