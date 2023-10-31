## 前言

> 学校摄影社的设备管理起来太麻烦，需要我们帮他们做一个摄影设备管理的小程序，于是 WMS 就诞生了。
> WMS 算是我的第一个正式项目，虽然好像也挺简单的，由 YuYa 大佬牵头，我在其中学到了不少东西，写的不好，还有很多改进的空间，希望大佬们提出宝贵的意见，不胜感激。 -- Xiaofan

## ⚙ WMS

> WMS 是一款使用 uni-app 开发的轻量级摄影设备管理小程序。

<a href="https://github.com/xfanweb/WMS/releases/latest"><img src="https://img.shields.io/github/v/release/xfanweb/WMS?color=231ab1ad&label=Releases" alt="GitHub release" /></a>

## 🌈 扫码体验

![体验小程序](sample.png)

## 🎉 功能详细

- 扫描设备上的二维码即可进行借还操作
- 支持查看该设备的历史借还记录
- 该设备历史借还记录支持通过姓名手机号进行模糊搜索
- 附带简易的后台管理
- 查看当前已借出设备的信息
- 添加与查看库存
- 查询所有设备的历史记录支持模糊搜索

> ps：你问我为什么这么少功能？因为便宜...

## 💻 安装说明

1. 克隆仓库

```powershell
git clone https://github.com/xfanweb/WMS.git
```

2. 安装依赖

```powershell
npm install
```

3. 打开 HBuilder X 导入项目.
4. 打开 manifest.json 获取自己的 AppID 同时配置好自己的微信小程序 AppID.
5. 登录 uniCloud 后台 https://unicloud.dcloud.net.cn/ 新建服务空间（推荐按量计费）或者选已有空间,新建两个数据库 record stock,可将 stock.json 导入到 stock.
6. 右键 uniCloud 文件夹云服务初始化,选择刚刚的服务空间.
7. 点击运行到小程序模拟器安装流程到此结束.

## ✨ 贡献者

<a href="https://github.com/xfanweb/wms/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=xfanweb/wms" />
</a>

- 20 届 YuYa & Xiaofan 编写
- 21 届 CreeperNatuDisa & longyu & hoob-y & liuzi 维护
- 后续维护人员敬请期待~

## 📷 截图

![截图1](screenshot1.jpg)
![截图2](screenshot2.jpg)
![截图3](screenshot3.jpg)
![截图4](screenshot4.jpg)