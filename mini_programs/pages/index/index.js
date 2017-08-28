//index.js
//获取应用实例
var app = getApp()
Page({
    data: {
        input_name: '',
        input_text: ''
    },
    //事件处理函数
    gen_picture: function() {
        var name = ''
        if (this.data.input_name) {
            name = 'To '+this.data.input_name
        }
        wx.navigateTo({
            url: '../result/result?input_name='+name+'&input_text='+this.data.input_text+'&back_to_index=0'
        })
    },
    listen_input_name: function(e) {
        this.data.input_name = e.detail.value
    },
    listen_input_text: function(e) {
        this.data.input_text = e.detail.value
    }
})
