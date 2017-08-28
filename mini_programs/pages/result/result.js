var util = require('../../utils/util.js')

Page({
    data: {
        input_name: '',
        input_text: '我只是想\n看看你们\n举的累不累',
        back_to_index: 0,
        input_text_arr: [],
        man_width: 51,
        man_height: 99,
        man_margin: 10,
        man_gradient: 10,
        canvas_id: 'men_canvas',
        img_path: '',
        window_width: 0,
        window_height: 0,
        canvas_width: 0,
        canvas_height: 0,
        canvas_bgcolor: '#F1B64E',
        color_pattern: ['#2980B9', '#FFFFFF', '#FB9696', '#62D2A2', '#4B586E'],
        hide_bgc: false,
        key_word: 'U2FsdGVkX1+WXm7nIB8syC1OFnRyQeSOgzZJFBX4AQ0=',
        love_msg: 'U2FsdGVkX1/peODLALnRdLcEdobbkLwagh6qaSb6BiF+IUFDRIZDasy+A1EULtH0uTa9F56uSmjbquUwqQ12Tw==',
    },

    onLoad: function (options) {
        // 页面初始化 options为页面跳转所带来的参数
        
        var that = this
        this.data.input_name = options.input_name || '告白小人'
        if (options.hide_bgc) {
            this.data.hide_bgc = options.hide_bgc
        }
        if (options.canvas_bgcolor) {
            this.data.canvas_bgcolor = options.canvas_bgcolor
        }
        if (options.input_text) {
            this.data.input_text = options.input_text
        }
        this.data.input_text_arr = this.data.input_text.split('\n')
        this.data.back_to_index = options.back_to_index

        // Easter egg
        if (this.data.input_name == util.aes_decrypt(this.data.key_word)) {
            this.data.input_text = util.aes_decrypt(this.data.love_msg)
            this.data.input_text_arr = this.data.input_text.split('\n')
        }

        this.setData({
            hide_bgcolor_selector: this.data.hide_bgc,
            bgcolor0: this.data.color_pattern[0],
            bgcolor1: this.data.color_pattern[1],
            bgcolor2: this.data.color_pattern[2],
            bgcolor3: this.data.color_pattern[3],
            bgcolor4: this.data.color_pattern[4]
        })

        wx.setNavigationBarTitle({
            title: this.data.input_name
        })

        if (this.data.back_to_index == 1) {
            this.setData({
                btn_title: '创作自己的告白小人',
                btn_fn: 'back_to_index',
                btn_width: '100%',
                share_btn_display: 'none'
            })
        } else {
            this.setData({
                btn_title: '保存',
                btn_fn: 'save_pic',
                btn_width: '40%',
                share_btn_display: 'block'
            })
        }

        wx.getSystemInfo({
            success: function(res) {
                that.data.window_width = res.windowWidth
                that.data.window_height = res.windowHeight

                var min_h = res.windowWidth * 0.8
                var max_h = res.windowHeight * 0.8
                var n = that.data.input_text_arr.length
                var cal_h = n * that.data.man_height + that.data.input_text_arr[n-1].length * that.data.man_gradient
                if (cal_h < min_h) {
                    cal_h = min_h
                } else if (cal_h > max_h) {
                    cal_h = max_h
                }

                that.data.canvas_width = res.windowWidth
                that.data.canvas_height = cal_h
                that.setData({
                    canvas_height: cal_h
                })
            }
        })
    },

    onReady: function (e) {
        this.drawMen(this.data.canvas_bgcolor)
    },

    drawMen: function(bgcolor) {
        // 使用 wx.createContext 获取绘图上下文 context
        var context = wx.createContext()

        context.setFillStyle(bgcolor)
        context.fillRect(0, 0, this.data.canvas_width, this.data.canvas_height)

        // 画举牌小人
        var text = this.data.input_text_arr
        var w = this.data.man_width
        var h = this.data.man_height
        var m = this.data.man_margin
        var g = this.data.man_gradient

        // 计算小人所占宽高
        var n = text.length
        var cal_h = n * h + text[n-1].length * g
        var cal_w = 0
        for (var i = 0; i < n; i++) {
            if (cal_w < text[i].length) {
                cal_w = text[i].length
            }
        }
        cal_w = cal_w * w

        var offset_w = m
        if (cal_w < this.data.canvas_width) {
            offset_w = (this.data.canvas_width - cal_w) / 2
        }
        var offset_h = m
        if (cal_h < this.data.canvas_height) {
            offset_h = (this.data.canvas_height - cal_h) / 2
        }

        for (var i = 0; i < n; i++) {
            for (var j = 0; j < text[i].length; j++) {
                var x = j * w + offset_w
                var y = i * h + j * g + offset_h
                this.drawOneMan(context, text[i][j], x, y)
            }
        }

        // 调用 wx.drawCanvas，通过 canvasId 指定在哪张画布上绘制，通过 actions 指定绘制行为
        wx.drawCanvas({
            canvasId: this.data.canvas_id,
            actions: context.getActions() // 获取绘图动作数组
        })
    },

    drawOneMan: function(context, word, x, y) {
        context.save()
        var n = Math.ceil(Math.random() * 25)
        context.drawImage('../../imgs/'+n+'.png', x, y, this.data.man_width, this.data.man_height)

        context.setFontSize(18)
        context.setFillStyle('#000000')
        context.translate(x, y)
        context.rotate(40 * Math.PI / 180)
        context.fillText(word, 20, 1)

        context.restore()
    },

    save_pic: function() {
        var that = this

        wx.canvasToTempFilePath({
            canvasId: this.data.canvas_id,
            success(res) {
                console.log(res.tempFilePath)
                that.data.img_path = res.tempFilePath

                wx.saveImageToPhotosAlbum({
                    filePath: res.tempFilePath,
                    success: function() {
                        wx.showToast({
                            title: '已保存到手机',
                            icon: 'success',
                            duration: 2000,
                            complete: function() {
                                util.sleep(2000)

                                wx.previewImage({
                                    current: that.data.img_path, // 当前显示图片的http链接
                                    urls: [that.data.img_path] // 需要预览的图片http链接列表
                                })
                            }
                        })
                    },
                    fail: function() {
                        wx.showToast({
                            title: '保存失败',
                            icon: 'error'
                        })
                    }
                })

            } 
        })
    },

    back_to_index: function() {     
        wx.switchTab({
            url: '/pages/index/index'
        })
    },

    change_bgcolor: function(e) {
        this.data.canvas_bgcolor = e.target.dataset.bgcolor
        this.drawMen(e.target.dataset.bgcolor)
    },

    onShareAppMessage: function (res) {
        if (res.from === 'button') {
          // 来自页面内转发按钮
          console.log(res.target)
        }

        return {
            title: this.data.input_name,
            // imageUrl: '',
            path: '/pages/result/result?input_name='+this.data.input_name+'&input_text='+this.data.input_text+'&back_to_index=1&hide_bgc=true&canvas_bgcolor='+this.data.canvas_bgcolor
        }
    }
})
