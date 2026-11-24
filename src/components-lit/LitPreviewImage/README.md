我想做一个图片预览功能，通过函数式调用，调用方式如下：

```js
litPreviewImage({
  images: [] // 图片数组
  index: 0, // 如不传默认从第一张预览
  type: '' // mobile 或 web,如不传代码自行判断浏览器环境调用对应的手机端或web端组件
})
```

渲染的组件用lit编写，组件规范写法可以参考src\components-lit\LitPhoto\index.ts这个文件。组件分开写两个，分别适配手机端和web端，组件name定为LitPreviewImageMobile和LitPreviewImageWeb，代码文件放在 src\components-lit\LitPreviewImage 文件夹下，

两个组件共同问题：
1、显示和隐藏时，希望有简单的动画效果
2、展示图片时，图片应居中，根据浏览器视图宽高展示合适的图片比例，比例以能展示完整的图片为准
3、去掉缩放效果。

web组件问题：
1、图片应居中，两个左右箭头按钮也要垂直居中，不能跟随图片的大小而位置变化

mobile组件问题：
1、滑动时，左滑时：右边被划过去的部分应接着显示下一张图片的内容，左滑超过屏幕宽度三分之一才显示下一张，没超过时应回弹显示原来的图片。

1、web端切换时也需要有图片滑动效果，参考常规的焦点图实现。
2、给demo.vue的图片加上title，用于我验证有title的情况。
3、title没有时，也显示它的div结构，用于占位高度，因为没有title的时候，有顶部序号和关闭按钮层站了一定的高度，导致中间的图片没有真正居中。

1、手机端去掉右上角关闭按钮，序号水平居中显示，关闭方式换成点击/手机触摸图片或遮罩层关闭，但要区分与左滑和右滑，不要左滑和右滑时也关闭了。
2、demo.vue里的 const titleImages = [
{ source: 'https://dummyimage.com/600x400/5b8def/fff&text=1', title: '示例图一' },
{ source: 'https://dummyimage.com/600x900/8f6fe8/fff&text=2', title: '示例图二' },
{ source: 'https://dummyimage.com/900x600/2aa198/fff&text=3', title: '示例图三' }
] 这种应该是不能正常显示的，source里面不能放图片url，对象形式的图片是要source+datetime集合去下载的。
3、最后一张继续往下切换时，应回到第一张，也即是循环切换。

1、在demo.vue上加一些错误的图片url和图片对象，方便我验证图片加载错误的情况

1、web端点击遮罩层也支持关闭
2、去掉mobile端的下滑关闭功能，并且兼容下不在手机端时的点击关闭【现在是触屏关闭】
3、title行要固定一行，字数太多超过一行用省略号展示。
