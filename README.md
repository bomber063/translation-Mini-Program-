# translation-Mini-Program-
## WXS（WeiXin Script）
* WXS（WeiXin Script）是小程序的一套脚本语言，结合 WXML，可以构建出页面的结构。
* 它跟MVVM框架比较像，它不想原生的JS那样去操作DOM。而是做了一个数据和视图的绑定。
* 另外移动端是没有鼠标的click的，大部分都是tap。所以绑定事件用的是[bindtap](https://developers.weixin.qq.com/miniprogram/dev/framework/view/wxml/event.html#%E4%BA%8B%E4%BB%B6%E7%9A%84%E4%BD%BF%E7%94%A8%E6%96%B9%E5%BC%8F)等,示例可以看[这里的例子](https://developers.weixin.qq.com/miniprogram/dev/reference/api/Page.html#Page.prototype.setData(Object%20data,%20Function%20callback))
### 页面初始数据
* [data](https://developers.weixin.qq.com/miniprogram/dev/reference/api/Page.html#data).
* wxml里面
```
    <view>{{text}}</view>
    <view>{{array[0].msg}}</view>
```
* js里面
```
Page({
  data: {
    text: 'init data',
    array: [{msg: '1'}, {msg: '2'}]
  }
})
```
### 修改数据
* 我们不是修改对应的DOM，而是通过[setData](https://developers.weixin.qq.com/miniprogram/dev/reference/api/Page.html)来修改。
### 进入的初始页面
* 通过[目录结构](https://developers.weixin.qq.com/miniprogram/dev/framework/structure.html)的[app.json](https://developers.weixin.qq.com/miniprogram/dev/framework/config.html),比如下面的页面最先进入的是index目录下面的index页面。**也就是第一行的就是默认展示的页面**.
```
{
  "pages": [
    "pages/index/index",
    "pages/logs/index"
  ],
}
```
### 显示消息提示框
* [showToast](https://developers.weixin.qq.com/miniprogram/dev/api/ui/interaction/wx.showToast.html)显示消息提示框
### app.wxss
* 用到样式导入
* 使用@import语句可以导入外联样式表，@import后跟需要导入的外联样式表的相对路径，用;表示语句结束。比如
```
@import "./assets/iconfont/iconfont.wxss";
```
### rpx
* [rpx](https://developers.weixin.qq.com/miniprogram/dev/framework/view/wxss.html)会自动的根据屏幕宽度等比的放大或者缩小。
### 逻辑层细节
#### 全局配置
* [全局配置](https://developers.weixin.qq.com/miniprogram/dev/reference/configuration/app.html),**其中注意下面代码的backgroundColor可能会被page覆盖，有时候page往下面拉动的时候才会显示出来这个颜色。**
```
{
  "window": {
    "navigationBarBackgroundColor": "#ffffff",
    "navigationBarTextStyle": "black",
    "navigationBarTitleText": "微信接口功能演示",
    "backgroundColor": "#eeeeee",
    "backgroundTextStyle": "light"
  }
}
```
* tabBar的borderStyle属性——tabbar 上边框的颜色， 仅支持 black / white。
* tabBar的StyleiconPath和selectedIconPath属性——当 position 为 top 时，不显示 icon。
#### 逻辑层
* 首先进入小程序的时候最开始是执行`App({})`——[App](https://developers.weixin.qq.com/miniprogram/dev/framework/app-service/app.html),也就是执行App这个方法，然后调用这个函数传递一些参数。
* [前台/后台状态](https://developers.weixin.qq.com/miniprogram/dev/framework/runtime/operating-mechanism.html)
  小程序启动后，界面被展示给用户，此时小程序处于**前台**状态。
  
  当用户点击右上角胶囊按钮关闭小程序，或者按了设备 Home 键离开微信时，小程序并没有完全终止运行，而是进入了**后台**状态，小程序还可以运行一小段时间。
  
  当用户再次进入微信或再次打开小程序，小程序又会从后台进入**前台**。但如果用户很久没有再进入小程序，或者系统资源紧张，小程序可能被**销毁**，即完全终止运行。
* **globalData是全局都能访问的一个数据。可以供所有页面使用**。
* 注册完小程序之后会去注册页面。也就是你设置的第一个页面，就会去执行第一个`Page({})`
* [页面生命周期](https://developers.weixin.qq.com/miniprogram/dev/framework/app-service/page-life-cycle.html),主要从视图线和逻辑线之间的交互来看。主要是通过某个入口进去然后如何加载某个页面，如何渲染页面。直到销毁这个过程。
    * 视图线**通知**逻辑线应该加载某个页面。
    * 逻辑线**传递参数**给视图线，视图线获取数据然后渲染页面
    * 最后的结束是页面卸载(onUnload)
* 有什么用处
    * 比如当用户切换页面的时候，当到达某个页面的时候就展示一个消息，这个就要放在onShow这个周期里面。
    * 当一个页面做了一个很复杂的运算，代码执行会比较消耗内存。当这个页面不展示的时候，它就没有必要去计算，所以当在onHide的时候把某个执行给停掉。否则内存或者cpu使用过高，那么这个小程序就会自动终止退出。
    * 如果需要一开始进入这个小程序时候获取数据，但是后面的切来切去的切换就不管，那就是要在onLoad里面。
* data的修改必须要要通过[this.setData()](https://developers.weixin.qq.com/miniprogram/dev/reference/api/Page.html)才可以修改。
* 如果要想要获取这个data，就通过`this.data`来获取这个值。
* [页面路由](https://developers.weixin.qq.com/miniprogram/dev/framework/app-service/route.html)
    * 这里打开新页面和重定向页面的区别就是原来的页面前者是隐藏(onHide)，后者是卸载(onUnload)。新页面都是加载和显示(onLoad, onShow)
* [模块化](https://developers.weixin.qq.com/miniprogram/dev/framework/app-service/module.html)
    * 它的页面不是从网络上去请求，而是本地化的代码。有点相当于node.js的环境。所以它天生支持模块化。
    * 每个文件都有一个独立的作用域。
    * 可以将一些公共的代码抽离成为一个单独的 js 文件，作为一个模块。模块只有通过 module.exports 或者 exports 才能对外暴露接口。
    * [common.js](https://www.w3cschool.cn/zobyhd/1ldb4ozt.html)的规范,跟node.js有点类似。通过`module.exports`这个对象上面增加一些方法。其他页面需要用的时候，就通过`require(path)`来引入。这个path路径必须是**相对路径**。[不支持绝对路径](https://developers.weixin.qq.com/miniprogram/dev/reference/api/require.html),因为这里面没有node_modules，所以所有的模块都是要找已经存在的。
#### 视图层
* [数据绑定](https://developers.weixin.qq.com/miniprogram/dev/reference/wxml/data.html)
    * 简单绑定——数据绑定使用 Mustache 语法（双大括号）将变量包起来
    ```
    <view> {{ message }} </view>
    ```
    * 注意： 花括号和引号之间如果有空格，将最终被解析成为字符串
    ```
    <view wx:for="{{[1,2,3]}} ">
      {{item}}
    </view>
    ```
    * 等同于
    ```
    <view wx:for="{{[1,2,3] + ' '}}">
      {{item}}
    </view>
    ```
* [列表渲染](https://developers.weixin.qq.com/miniprogram/dev/reference/wxml/list.html)
    * 用`wx:for`,注意for等于后面的两个引号必须要有。默认数组的当前项的下标变量名默认为 index，数组当前项的变量名默认为 item
    ```
    <view wx:for="{{array}}">
      {{index}}: {{item.message}}
    </view>
    ```
    * 使用 `wx:for-item` 可以指定数组当前元素的变量名，
      
      使用 `wx:for-index` 可以指定数组当前下标的变量名：
    ```
    <view wx:for="{{array}}" wx:for-index="idx" wx:for-item="itemName">
      {{idx}}: {{itemName.message}}
    </view>
    ```
    * 还可以使用`block wx:for`
    ```
    <block wx:for="{{[1, 2, 3]}}">
    <view>{{index}}:{{item}}</view>
      <!-- <view> {{index}}: </view> -->
      <!-- <view> {{item}} </view> -->
    </block>
    ```
    * 就会显示
    ```
    0:1
    1:2
    2:3
    ```
    * 所以可以使用block wx:for，可以使用**多个view来实现列表循环,这里每个view会重复循环对应前面数组的次数**，外面写一个`block wx:for`。而这个block它本身是不会循环渲染。
    * 渲染的时候最好绑定一个key，这样它的性能会更好一些。就是`wx:key`
* [条件渲染](https://developers.weixin.qq.com/miniprogram/dev/reference/wxml/conditional.html)
    * 在框架中，使用 wx:if="" 来判断是否需要渲染该代码块
    ```
    <view wx:if="{{condition}}"> True </view>
    ```
    也可以用 wx:elif 和 wx:else 来添加一个 else 块：
    ```
        <view wx:if="{{length > 5}}"> 1 </view>
        <view wx:elif="{{length > 2}}"> 2 </view>
        <view wx:else> 3 </view>
    ```
    * wx:if vs hidden
      * 因为 wx:if 之中的模板也可能包含数据绑定，所以当 wx:if 的条件值切换时，框架有一个局部渲染的过程，因为它会确保条件块在切换时销毁或重新渲染。
      
      * 同时 wx:if 也是惰性的，如果在初始渲染条件为 false，框架什么也不做，在条件第一次变成真的时候才开始局部渲染。
      
      * 相比之下，**hidden 就简单的多，组件始终会被渲染，只是简单的控制显示与隐藏**。
      
      * 一般来说，wx:if 有更高的切换消耗而 hidden 有更高的初始渲染消耗。因此，如果需要频繁切换的情景下，用 hidden 更好，如果在运行时条件不大可能改变则 wx:if 较好。
* [模板](https://developers.weixin.qq.com/miniprogram/dev/reference/wxml/template.html)
    * WXML提供模板（template），可以在模板中定义代码片段，然后在不同的地方调用.
    * 比如在wxml文件里面代码
    ```
    //定义模板
    <template name="msgItem">
      <view>
        <text> {{index}}: {{msg}} </text>
        <text> Time: {{time}} </text>
      </view>
    </template>
    
    //使用模板
    <template is="msgItem" data="{{...item}}"/>
    ```
    * js文件里面的代码
    ```
    Page({
      data: {
        item: {
          index: 0,
          msg: 'this is a template',
          time: '2016-09-15'
        }
      }
    })
    ```
    * 其中这里用了三点，是ES6语法的结构，也就是结构后有对应的变量key和对应的值value组合。如果不用ES6语法就是下面的代码
    ```
        //使用模板,最原始的代码直接写过来
        <template is="msgItem" data="{{index: 0,msg: 'this is a template',time: '2016-09-15'}}"/>
        
        //使用模板,结合数据绑定和匹配操作符的点来操作取值
        <template is="msgItem" data="{{index:item.index,msg:item.msg,time:item.time}}"/>
        //可以明显的看到key的名字和value的匹配操作符后面的名字一样，比如index:item.index
    ```
* [绑定事件](https://developers.weixin.qq.com/miniprogram/dev/framework/view/wxml/event.html)
    * 事件的使用方式
      在组件中绑定一个事件处理函数。
      如bindtap，当用户点击该组件的时候会在该页面对应的Page中找到相应的事件处理函数。
      ```
      <view id="tapTest" data-hi="WeChat" bindtap="tapName"> Click me! </view>
      ```
      * 在相应的Page定义中写上相应的事件处理函数，参数是event,这个event就是这个对应的事件，事件里面有很多信息。
      ```
      Page({
        tapName: function(event) {
          console.log(event)
        }
      })
      ```
    * 需要传递一些数据还可以**定义在自定义属性上面**，比如
    ```
    <view id="tapTest" data-hi="WeChat" bindtap="tapName"> Click me! </view>
    ```
    * 在相应的Page定义中写上相应的事件处理函数，参数是event。
    ```
    Page({
      tapName: function(event) {
        console.log(event)
      }
    })
    ```
    * 可以看到log出来的信息可以找到对应的`WeChat`，只列出部分信息`currentTarget->dataset->hi->WeChat`。
    ```
    {
    ...
      "target": {
        "id": "tapTest",
        "dataset":  {
          "hi":"WeChat"
        }
      },
      "currentTarget":  {
        "id": "tapTest",
        "dataset": {
          "hi":"WeChat"
        }
      },
      ...
    }
    使用WXS
    ```
    * 冒泡事件和捕获事件
* [引用](https://developers.weixin.qq.com/miniprogram/dev/reference/wxml/import.html)
    * WXML 提供两种文件引用方式import和include
    * 在 item.wxml 中定义了一个叫item的template：
      ```
            <!-- item.wxml -->
            <template name="item">
              <text>{{text}}</text>
            </template>
      ```
    * 在 index.wxml 中引用了 item.wxml，就可以使用item模板：
    ```
          <import src="item.wxml"/>
          <template is="item" data="{{text: 'forbar'}}"/>
    ```
    * index.wxml的is后面的名字(比如item)要和前面item.wxml的name后面的名字(比如item)一样。src的目录是相对目录。
    * include 可以将目标文件除了 <template/> <wxs/> 外的**整个代码引入，相当于是拷贝到 include 位置**，相当于把数据直接方放进去，而不用再去使用一次了。如
    ```
    <!-- index.wxml -->
    <include src="header.wxml"/>
    <view> body </view>
    
    <!-- header.wxml -->
    <view> header </view>
    ```
    * src的路径是相对路径。
#### WXS语法
* [WXS 语法参考](https://developers.weixin.qq.com/miniprogram/dev/reference/wxs/)
#### WXSS语法
* [WXSS语法](https://developers.weixin.qq.com/miniprogram/dev/framework/view/wxss.html)
* rpx（responsive pixel）: 可以根据屏幕宽度进行自适应。规定屏幕宽为750rpx。如在 iPhone6 上，屏幕宽度为375px，共有750个物理像素，则750rpx = 375px = 750物理像素，1rpx = 0.5px = 1物理像素。
* 样式导入  
  使用@import语句可以导入外联样式表，@import后跟需要导入的外联样式表的相对路径，用;表示语句结束。
* 内联样式  
  框架组件上支持使用 style、class 属性来控制组件的样式。
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
* [getStorageSync](https://developers.weixin.qq.com/miniprogram/dev/api/storage/wx.getStorageSync.html)，从本地缓存中异步获取指定 key 的内容。在浏览器里面只能存入字符串，**在小程序里面的缓存可以存对象**。
```
this.globalData.curLang = wx.getStorageSync('curLang') ||     this.globalData.langList[0]
```
## api.js
* 主要是处理一些接口。
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
    * 它相当于HTML语言里面的a链接。可以连接到外部页面。但是navigator只能链接到小程序内部已经有的页面。
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
* [scroll-view](https://developers.weixin.qq.com/miniprogram/dev/component/scroll-view.html)  
  **可滚动视图区域**。使用竖向滚动时，需要给scroll-view一个固定高度，通过 WXSS 设置 height。组件属性的长度单位默认为px，2.4.0起支持传入单位(rpx/px)。
* 这里**老师说错的一个地方**，就是navigator的hover-class
```
    <navigator url="/pages/change/change" hover-class="navigator-hover">
```
* 不是app.wxss里面view-hover的样式。它是[navigator-hover](https://developers.weixin.qq.com/miniprogram/dev/component/navigator.html)默认样式
```
.view-hover {
  background-color: #f3f3f3!important;
}
```
* 我这里的icon用的是通过[iconfont](https://www.iconfont.cn/),我这里用的是**Font-class的引用**。但是小程序本身也自带了[icon](https://developers.weixin.qq.com/miniprogram/dev/component/icon.html),但是种类比较少。
    * 当然你还可以自己制作图片当做icon。当时这个图片最好不要放到当前的目录下。因为对于小程序来说，整个代码包的体积越小越好，因为这些都需要下载到用户的手机上面的，如果体积很大，那么用户下载的数据就比较久，用户进入就比较慢，**所以对于这些资源能放外面的就放在外面**。
    * 可以通过[img](https://developers.weixin.qq.com/miniprogram/dev/component/image.html)这个组件,其中有一个src的属性可以写入图片资料地址。
    * 也可以在CSS的背景图片里面设置也可以。
    * 但是用图片始终都不太方便。
```
    <text class="iconfont icon-down"></text>
```
* 这里注意一点就是小程序需要用到的地址是https协议，而不是http协议。
* 所有组件都有公共属性：[公共属性](https://developers.weixin.qq.com/miniprogram/dev/framework/view/component.html#%E5%85%AC%E5%85%B1%E5%B1%9E%E6%80%A7)中有一个hidden属性，通过Boolean来控制组件是否显示。这里就使用了`hidden="{{hideClearIcon}}"`
```
    <text class="iconfont icon-close" hidden="{{hideClearIcon}}" bindtap='onTapClose'></text>
```
* 因为textarea的在CSS里面的层级比较高。就算你设置一个view覆盖到textarea上面，并且z-index设置的很大，而这个textarea的z-index设置的很小。**但是最终测试的时候发现这个×还是点不到，输入的时候这个输入框还是离用户最近，相当于你设置的z-index设置的很小，但是它的层级还是最高**。而我们这里使用的方法就让他们二者(×符号和textarea)脱离重叠。通过绝对定位和设置padding等方式就可以实现。
```
    <text class="iconfont icon-close" hidden="{{hideClearIcon}}" bindtap='onTapClose'></text>
    <view class="textarea-wrap">
      <textarea placeholder='请输入要翻译的文本' placeholder-style='color: #8995a1'  bindinput='onInput' bindconfirm='onConfirm' bindblur='onConfirm'  value="{{query}}"></textarea>
    </view>
```
* textarea在CSS的部分代码
```
.input-area .text-area {
  min-height: 80rpx;
  padding: 40rpx;
  background-color: #fff;
}
```
* icon-close在CSS的部分代码
```
.input-area .icon-close {
  position: absolute;
  right: 10rpx;
  top: 20rpx;
  z-index: 100;
  font-size: 35rpx;
  color: #888;
}
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
## index.js
* bindinput里面，当键盘输入时，触发 input 事件，event.detail = {value, cursor, keyCode}，keyCode 为键值，获取到输入e.detail.value存在query里面,这里面不能选择DOM，因为小程序里面这里没有选择DOM的API。
```
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
```
## change.json
* [页面配置](https://developers.weixin.qq.com/miniprogram/dev/framework/config.html#%E9%A1%B5%E9%9D%A2%E9%85%8D%E7%BD%AE)

## change.wxml
* 这里面用到一个公共属性[data-*](https://developers.weixin.qq.com/miniprogram/dev/framework/view/component.html#%E5%85%AC%E5%85%B1%E5%B1%9E%E6%80%A7),他会存在你绑定的事件，比如这个事件是e，那么对应的信息就会在currentTarget->dataset里面
```
  "currentTarget":  {
    "id": "tapTest",
    "dataset": {
      "hi":"WeChat"
    }
  },
```
* 比如我这里用到了`data-chs="{{language.chs}}" data-lang="{{language.lang}}" data-index="{{index}}`这些**自定义的公用属性**，并且有一个事件是`bindtap=onTapItem`
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
* 这里的左边的i是列表渲染的，所以每一列都是变化的，按照0123...，而右边的值列表的每一行都是一样的。
```
      <text class="iconfont icon-duihao" wx:if="{{index===curLang.index}}"></text>

<!--        刚开始的时候i都是索引012345...，然后index都是就是最开始的英文，也就是0，当点击之后，就会把点击的索引选中，比如点击的索引是4，那么就选中索引4，那么就选中索引4，那么当前的语言就是4，所以说i是列表渲染的每一行都是变化的，而curLang.i或者curLang.index每一行都是一样的。-->
```
## change.js
* 用到[wx.switchTab](https://developers.weixin.qq.com/miniprogram/dev/api/route/wx.switchTab.html),跳转到 tabBar 页面，并关闭其他所有非 tabBar 页面,用到下面的属性
    * url——需要跳转的 tabBar 页面的路径 (代码包路径)（需在 app.json 的 tabBar 字段定义的页面），路径后不能带参数。
    * 区别：
    1. [wx.switchTab——切换Tab](https://developers.weixin.qq.com/miniprogram/dev/api/route/wx.switchTab.html)——**跳转到 tabBar 页面**，并关闭其他所有非 tabBar 页面
    2. [wx.reLaunch——重启](https://developers.weixin.qq.com/miniprogram/dev/api/route/wx.reLaunch.html)——关闭所有页面，打开到应用内的某个页面
    3. [wx.redirectTo——重定向到](https://developers.weixin.qq.com/miniprogram/dev/api/route/wx.redirectTo.html)——**关闭当前页面**，跳转到应用内的某个页面。但是**不允许跳转到 tabbar 页面**。
    4. [wx.navigateTo——导航到](https://developers.weixin.qq.com/miniprogram/dev/api/route/wx.navigateTo.html)——**保留当前页面**，跳转到应用内的某个页面。但是**不能跳到 tabbar 页面**。使用 wx.navigateBack 可以返回到原页面。小程序中页面栈最多十层
    5. [wx.navigateBack——导航返回](https://developers.weixin.qq.com/miniprogram/dev/api/route/wx.navigateBack.html)——关闭当前页面，返回上一页面或多级页面。可通过 getCurrentPages 获取当前的页面栈，决定需要返回几层
    6. **备注：tabbar页面在这个项目里面就是index和history页面，而change页面是非tabbar页面。**。
* 表格

| API                  |跳转页面              | 关闭的页面            |
| --------             | :-----:             | :----:              |
| wx.switchTab——切换Tab |tabBar页面           |关闭其他所有非tabBar页面|
| wx.reLaunch——重启     |应用内的某个页面       |关闭所有页面           |
| wx.redirectTo——重定向到|不允许跳转到tabbar页面 |关闭当前页面           |
| wx.navigateTo——导航到  |不能跳到tabbar页面    |不关闭,保留当前页面     |
| wx.navigateBack——导航返回|返回上一页面或多级页面|关闭当前页面           |
* **备注：tabbar页面在这个项目里面就是index和history页面，而change页面是非tabbar页面。**。
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
  },
```
* 然后在index.wxml里面增加result就可以显示历史页面点击后的跳转的结果啦
```
        <text selectable="true">{{item.dst||result}}</text>
```
* 具体解决过程也可以看我发的问题——[问题——wx.reLaunch(Object object)通过url传参数的问题，只能传query吗？](https://developers.weixin.qq.com/community/develop/doc/000aa6b1d3cf28f55fc914da656400)
## util.js
* 好像并没有用到它。
