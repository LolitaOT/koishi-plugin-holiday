# 什么时候放假 ~~（迫真）~~

一个用于 **[Koishi v3](https://koishi.js.org/)** 的MLTD插件。

## 安装

``` shell
  npm i koishi-plugin-holiday --save
```
之后根据 **[Koishi v3](https://koishi.js.org/guide/context.html#%E5%AE%89%E8%A3%85%E6%8F%92%E4%BB%B6)** 进行安装。



## 说明

- **数据来源：** http://timor.tech/api/holiday
- **语音生成：** https://azure.microsoft.com/zh-cn/services/cognitive-services/text-to-speech/

## 注意

- 使用语音服务的时候请注意安装 **FFmpeg**

## 配置

``` js
  {
    record: {
      key: string,
      region: string
    }
  }
```

- 你可以不传record，这样就不会输出语音了。
- **key**和**region** 请去 [azure](https://portal.azure.com/#create/hub) 控制面板搜索 **speech** 创建应用获取

## 碎碎念

- 为什么申请免费应用还要用信用卡信息，真见鬼了
- 日历不好用吗？好用，是我闲的做这玩意

