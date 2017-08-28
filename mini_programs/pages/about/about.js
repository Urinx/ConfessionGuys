//获取应用实例
var app = getApp()
Page({
    data: {
        author: 'Urinx',
        authoravatar: '/imgs/ai.png',
    },

    onLoad: function () {
        var that = this
    },

    about_btn: function(){
    	wx.navigateTo({
            url: '/pages/content/content'
        })
    },

    feedback_btn: function(){
    	wx.showActionSheet({
		  itemList: ['你可以通过以下方式反馈问题', '邮箱: ai@urinx.me', '公众号: Urinx', '客服会话中发送 人工客服 关键字'],
		})
    },

    update_btn: function(){
    	wx.showModal({
		  title: '更新日志',
		  content: '2017.8.28\n1. 优化分享和保存功能\n2. 修复bug\n3. 新增关于tab页面\n4. 增加客服会话功能'
		})
    }
})