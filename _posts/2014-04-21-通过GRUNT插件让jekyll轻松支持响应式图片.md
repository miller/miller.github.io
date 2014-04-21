---
layout: post
title:  "让你的jekyll博客轻松支持响应式图片"
date:   2014-04-21 10:00:00
tags: responsive image,grunt
---

[上一篇文章](http://www.milleris.me/2014/04/20/%E9%97%B2%E8%B0%88%E5%93%8D%E5%BA%94%E5%BC%8F%E5%9B%BE%E7%89%87%E4%B8%8ESRCSET.html)中介绍了响应式图片能带来的好处，这篇文章就带大家来简单实践下，通过grunt的插件让jekyll搭建的博客也能支持响应式图片。

支持响应式图片需要解决三个问题：

 * 如何解决浏览器兼容性问题？
 * 如何快速简单的获得各种尺寸的图片？
 * 如何快速简单的将博客文章中的图片标签升级为标准写法？

下面我们来一一解答。

###浏览器兼容性

目前浏览器基本上都不支持响应式图片标准，包括最新的Chrome(34)也只支持简单的按像素密度适配，并不能满足更多的响应需求，因此目前只能借助各种[polyfill](http://en.wikipedia.org/wiki/Polyfill)来实现。

针对[srcset属性草案](http://www.w3.org/html/wg/drafts/srcset/w3c-srcset/)的实现，推荐使用[srcset-polyfill](https://github.com/borismus/srcset-polyfill)


```html
<script src="build/srcset.min.js"></script>

<img alt="The Breakfast Combo"
     src="banner.jpeg"
     srcset="banner-HD.jpeg 2x, banner-phone.jpeg 100w,
             banner-phone-HD.jpeg 100w 2x"/>
```


针对[picture元素草案](http://picture.responsiveimages.org/)的实现，推荐[Picturefill](http://scottjehl.github.io/picturefill/)。


```html
<script>
// Picture element HTML5 shiv
document.createElement( "picture" );
</script>
<script src="picturefill.js" async></script>

<picture>
    <source srcset="examples/images/extralarge.jpg" media="(min-width: 1000px)">
    <source srcset="examples/images/large.jpg" media="(min-width: 800px)">
    <source srcset="examples/images/medium.jpg">
    <img srcset="examples/images/medium.jpg" alt="A giant stone">
</picture>
```


注意：JS的polyfill目前还存在一些无法克服的问题，例如图片必须在JS加载完成并执行后才会开始加载或者JS被禁用后图片便无法显示。

###图片尺寸

使用grunt插件-[grunt-responsive-images](https://github.com/andismith/grunt-responsive-images)可以根据响应规则生成各种尺寸的图片。

典型的Gruntfile.js如下：


```js
grunt.initConfig({
  responsive_images: {
    myTask: {
      options: {
        sizes: [{
          width: 320,
          height: 240
        },{
          name: 'large',
          width: 640
        },{
          name: "large",
          width: 1024,
          suffix: "_x2",
          quality: 60
        }]
      },
      files: [{
        expand: true,
        src: ['assets/**.{jpg,gif,png}'],
        cwd: 'test/',
        dest: 'tmp/'
      }]
    }
  },
})
```


例如`assets/logo.png`编译后将会在`tmp`目录下生成：logo-320x240.png，logo-large.png，logo-large_x2.png三种规格的图片。

###标签转换

使用grunt插件-[grunt-responsive-images-converter](https://github.com/miller/grunt-responsive-images-converter) 能够批量的将文章中的图片标签替换为picture草案中的形式。


典型的Gruntfile.js如下：


```js
grunt.initConfig({
  responsive_images_converter: {
    default_options: {
      queries: [{
          name: 'phone',
          media: '(max-width:500px)',
          dprs: [ 2 ],
          suffix: '@'
        },{
          name: 'tablet',
          media: '(max-width:800px)',
          dprs: [ 2 ],
          suffix: '@'
        },{
          name: 'desktop',
          media: '(min-width:800px)',
          dprs: [ 2 ],
          suffix: '@'
        }]
    }
  },
})
```


使用上述配置编译后，MD文件中的标签，例如`! [Webp compare tool](/img/raw/webp-tool.png)
`将会被替换成如下内容：


```html
<picture>
    <source srcset="/img/raw/webp-tool-phone.png, /img/raw/webp-tool-phone@2x.png 2x" media="(max-width:500px)">
    <source srcset="/img/raw/webp-tool-tablet.png, /img/raw/webp-tool-tablet@2x.png 2x" media="(max-width:800px)">
    <source srcset="/img/raw/webp-tool-desktop.png, /img/raw/webp-tool-desktop@2x.png 2x" media="(min-width:800px)">
    <img alt="Webp compare tool">
</picture>
```


最后，实际的例子可以查看下面这张图片。

<picture>
    <source srcset="/img/resp/responsive-image-demo-flower-phone.jpg, /img/resp/responsive-image-demo-flower-phone@2x.jpg 2x" media="(max-width:500px)">
    <source srcset="/img/resp/responsive-image-demo-flower-tablet.jpg, /img/resp/responsive-image-demo-flower-tablet@2x.jpg 2x" media="(max-width:800px)">
    <source srcset="/img/resp/responsive-image-demo-flower-desktop.jpg, /img/resp/responsive-image-demo-flower-desktop@2x.jpg 2x" media="(min-width:800px)">
    <img alt="响应式图片示例">
</picture>





