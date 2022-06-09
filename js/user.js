$(function () {
    // 获取数据，渲染页面
    var width_ = document.documentElement.clientWidth
    var height_ = document.documentElement.clientHeight
    var date = { page: 1 }
    $('.up').click(function () {
        if (date.page == 1) {
            date.page = 1
        } else if (date.page > 1) {
            date.page--
        }
        $.get('http://1.14.68.137:8000/api/v0/owner/', date, (data) => {
            let info = template('tel-owner', data.results)
            $('span.now').html(date.page)
            $('tbody').html(info)
            delect('.del', data)
            setup('.setup', data)
            moreOperation('.more', data)
            allbtn(data)
        })
    })
    $('.next').click(function () {
        date.page++
        if (date.page >= fff) {
            date.page = fff
            $('span.now').html(date.page)
        }
        $.get('http://1.14.68.137:8000/api/v0/owner/', date, (data) => {
            let info = template('tel-owner', data.results)
            $('span.now').html(date.page)
            $('tbody').html(info)
            delect('.del', data)
            setup('.setup', data)
            moreOperation('.more', data)
            allbtn(data)

        })
    })
    $.get('http://1.14.68.137:8000/api/v0/owner/', (res) => {
        let info = template('tel-owner', res.results)
        fff = Math.ceil(res.count / 10)
        $('span.all').html(fff)
        $('tbody').html(info)
        delect('.del', res)
        setup('.setup', res)
        moreOperation('.more', res)
        allbtn(res)
    })
    // 单个删除事件
    function delect(select, data) {
        $(select).each((index, item) => {
            item.dataset.index = data.results[index].id
            $(item).click(function () {
                let ownerId = this.dataset.index
                width_ = document.documentElement.clientWidth
                height_ = document.documentElement.clientHeight
                $('.back.delect').width(width_).height(height_)
                $('.del_alert button.yes').click(function () {
                    $.ajax({
                        type: 'DELETE',
                        url: 'http://1.14.68.137:8000/api/v0/owner/' + ownerId + '/',
                        success(data) {
                            window.location.reload()
                        }
                    })
                })
                $('.del_alert button.no').click(function () {
                    $('.back.delect').width(0).height(0)
                })
            })
        })
    }
    // 编辑事件
    function setup(select, data) {
        $(select).each(function (i, el) {
            el.dataset.index = data.results[i].id
            $(el).click(function () {
                width_ = document.documentElement.clientWidth
                height_ = document.documentElement.clientHeight
                $('.back.setUp').width(width_).height(height_)
                $('.setUp .off').click(function () { $(this).parent().parent().width(0).height(0) })
                $('.upinfo input[id="name"]').val(data.results[i].name)
                $('.upinfo input[id="phone_number"]').val(data.results[i].phone_number)
                $('.upinfo input[id="home_number"]').val(data.results[i].home_number)
                $('.upinfo input[id="park_lot"]').val(data.results[i].park_lot)
                if (data.results[i].park_state == 1) $('.park_state1').click()
                else $('.park_state0').click()
                var _ = this
                $('.setinfo button.yes').click(function () {
                    console.log(_.dataset.index);
                    var updata = {}
                    updata.name = $('.upinfo input[id="name"]').val()
                    updata.home_number = $('.upinfo input[id="home_number"]').val()
                    updata.phone_number = $('.upinfo input[id="phone_number"]').val()
                    updata.park_lot = $('.upinfo input[id="park_lot"]').val()
                    if ($('.upinfo input[id="park_state"]').val() == '已停满') updata.park_state = 1
                    else if ($('.upinfo input[id="park_state"]').val() == '未停满') updata.park_state = 0
                    $.ajax({
                        type: "PUT",
                        url: "http://1.14.68.137:8000/api/v0/owner/" + _.dataset.index + '/', data: updata,
                        success(res) {
                            window.location.reload(true)
                        },
                        error(res) {
                            console.log(res);
                        }
                    }, function (res) {
                    })
                })
                $('.setinfo button.no').click(function () {
                    $('.back.setUp').width(0).height(0)
                })
            })
        })
    }

    // 全选按钮
    function allbtn(data) {
        $('.allbtn').click(function () {
            $('.ownerbtn').click()
        })
    }
    // 更多操作
    function moreOperation(select, data) {
        $(select).each(function (i, el) {
            el.dataset.index = data.results[i].id
            $(el).click(function () {
                $('.back.operation').width(width_).height(height_)
                $('.operation .off').click(function () { $(this).parent().parent().width(0).height(0) })
                $('.operation .owner').text(data.results[i].id)
                $('.operation .name').text(data.results[i].name)
                $('.operation .home-number').text(data.results[i].home_number)
                $('.operation .phone-number').text(data.results[i].phine_number)
                $('.operation .park-lot').text(data.results[i].park_lot)
                if (data.results[i].park_state) $('.operation .park-state').text('已停满')
                else $('.operation .park-state').text('未停满')
                $('.otherInfo').html('<div class="car_oper"></div>')
                if (data.results[i].carlist[0]) {
                    $('.otherInfo').prepend('<p class="has">点击修改车辆信息</p>')
                    for (let j = 0; j < data.results[i].carlist.length; j++) {
                        var car = data.results[i].carlist[j].license
                        car = car.replace(car[1], car[1] + ' · ')
                        $(`<div class="licenseInfo">
                        <img src="${data.results[i].carlist[j].car_img}" alt="">
                        <div class="license">${car}</div>
                        </div>`).prependTo('.otherInfo')
                    }
                    $('.car_oper').append('<div class="delcar">删除车辆</div>')
                } else {
                    $('.otherInfo').prepend('<p>您还没有车！</p>')
                }
                $('.car_oper').append('<div class="addcar">添加车辆</div>')
                addDel('.car_oper', data.results[i])
            })
        })
    }
    // 用户添加/删除车辆事件委托
    function addDel(select, data) {
        $(select).click(function (e) {
            if (e.target.className == 'addcar') {
                // 添加车辆事件
                $('.back.setcar').width(width_).height(height_)
                $('.setcar .off').click(function () {
                    $(this).parent().parent().width(0).height(0);
                    $('.keyboard').hide()
                })

                // imginput.addEventListener('change',function () {
                //     let YL = new FileReader()
                //     YL.addEventListener('load', function (e) {
                //         var imgnode = new Image()
                //         imgnode.src = e.target.results
                //         console.log(imgnode.src);
                //         $('.carImg').prepend(imgnode)
                //     })
                //     YL.readAsDataURL($('.carImg>input[type="file"]')[0].files[0])
                // })

                $('.formPost').click(function () {
                    let chepai = ''
                    $('.setcar>div>div>input[type="text"]').each(function (i, el) {
                        chepai += el.value
                    })
                    let imgsrc = $('.carImg>input')[0].files[0]
                    let owner = data.id
                    let carform = new FormData()
                    carform.append('license', chepai)
                    carform.append('car_img', imgsrc)
                    carform.append('owner', owner)
                    $.ajax({
                        type: 'POST',
                        url: 'http://1.14.68.137:8000/api/v0/license/',
                        contentType: false,
                        processData: false,
                        data: carform,
                        success(res) {
                            window.location.reload()
                        }
                    })
                })
            } else if (e.target.className == 'delcar') {
                // 删除车辆事件
                $('.redcar_license').html('')
                $('.back.redcar').width(width_).height(height_)
                $('.redcar .off').click(function () {
                    $(this).parent().parent().width(0).height(0);
                })
                $(data.carlist).each(function (i, el) {
                    var car = el.license.replace(el.license[1], el.license[1] + ' · ')
                    $('.redcar_license').append(`<div data-index = "${el.id}">${car}</div>`)
                })
                $('.redcar_license>div').click(function () {
                    $('.back.queding').width(width_).height(height_)
                    $('.thiscar').html($(this).html())
                    var _ = this
                    $('.queding >div').click(function (e) {
                        if (e.target.innerHTML == '确定') {
                            $.ajax({
                                url: 'http://1.14.68.137:8000/api/v0/license/' + _.dataset.index + '/',
                                type: 'DELETE',
                                success(res) {
                                    $('.back.queding').width(0).height(0)
                                    window.location.reload()
                                }
                            })
                        } else if (e.target.innerHTML == '取消') $('.back.queding').width(0).height(0)
                    })
                })
            }
        })
    }
    // 时间格式过滤器 
    template.defaults.imports.fliter = function (date) {
        var data = new Date(date)
        var y = data.getFullYear()
        var M = data.getMonth() + 1
        if (M < 10) M = '0' + M
        var d = data.getDate()
        if (d < 10) d = '0' + d
        var h = data.getHours()
        if (h < 10) h = '0' + h
        var f = data.getMinutes()
        if (f < 10) f = '0' + f
        var m = data.getSeconds()
        if (m < 10) m = '0' + m
        return y + '-' + M + '-' + d + ' ' + h + ':' + f + ':' + m
    };
    // 渲染键盘
    var ch = ['京', '沪', '津', '渝', '鲁', '冀', '鄂', '黑', '苏', '浙', '皖', '闽', '赣', '豫', '粤', '桂', '琼', '晋', '蒙', '辽', '吉', '云', '藏', '陕', '甘', '青', '宁', '湘', '川', '贵', '新', '港', '澳', '台']
    var en = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']
    var num = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0]
    ch.forEach(el => $(`<div class="infos">${el}</div>`).appendTo('.ch'));
    en.forEach(el => $(`<div class="infos">${el}</div>`).appendTo('.en'));
    num.forEach(el => $(`<div class="infos">${el}</div>`).appendTo('.num'));
    // 给软键盘添加事件
    $('.keyboard').hide()
    $('div.last , .setcar>div>div>div').click(() => {
        $('.keyboard').show()
        $('.keyboard').click()
    })
    $('.back.add').click((e) => {
        if (!e.target.className == 'last') {
            $('.keyboard').hide()
        }
    })
    var w1 = $('.chback').width()
    var h1 = $('.chback').height()
    $('.keyboard').click(e => {
        if (!$('.back.add').width()) return
        $('.postUp').hide()
        $('input.car').each((i, el) => {
            if (!el.value) {
                if (e.target.className == 'infos') {
                    el.value = e.target.innerHTML
                    $(el).next().focus()
                } else if (e.target.className == 'keyboard') {
                    $(el).focus()
                }
                if (!$('input.car')[0].value) {
                    $('.chback').width(0).height(0)
                } else {
                    $('.chback').width(w1).height(h1)
                    $('.enback').width(0).height(0)
                }
                return false
            }
            if (i == $("input.car").length - 2) {
                $('.keyboard').hide()
                $('.postUp').show()
            }
        })
    })
    $('.keyboard').click(e => {
        if (!$('.back.setcar').width()) return
        $('.setcar>div>div input').each((i, el) => {
            if (!el.value) {
                if (e.target.className == 'infos') {
                    el.value = e.target.innerHTML
                    $(el).next().focus()
                } else if (e.target.className == 'keyboard') {
                    $(el).focus()
                }
                if (!$('.setcar>div>div input')[0].value) {
                    $('.chback').width(0).height(0)
                } else {
                    $('.chback').width(w1).height(h1)
                    $('.enback').width(0).height(0)
                }
                return false
            }
            if (i == $(".setcar>div>div input[type='text']").length - 2) {
                $('.keyboard').hide()
                $('.postUp').show()
            }
        })
    })
    $('button.add').click(() => {
        $('.back.add').width(width_).height(height_)
        $('.off').click(() => {
            $('.back.add').width(0).height(0)
            $('.keyboard').hide()
        })
        $('.userInfo>div>input').eq(0).focus()
    })
    // 提交
    var postData = {}
    $('.park_state1 , .park_state0').click(function (e) {
        if (e.target.className == 'park_state1') {
            $(e.target).css({ background: '#409EFF' })
            $('.park_state0').css({ background: '#999' })
            postData.park_state = 1
        }
        if (e.target.className == 'park_state0') {
            $(e.target).css({ background: '#409EFF' })
            $('.park_state1').css({ background: '#999' })
            postData.park_state = 0
        }

    })
    $('.postUp').click(() => {
        $('input[name]').each((i, el) => {
            postData[`${el.name}`] = el.value
        })
        if (postData.park_state == '已停满') postData.park_state == 0
        else if (postData.park_state == '未停满') postData.park_state == 1
        else $('.alert').html('请输入已停满/未停满！')
        if (!$('.car').eq(0).val()) {
            $.post('http://1.14.68.137:8000/api/v0/owner/', postData, function () {
                location.reload()
            })
        } else {
            $.post('http://1.14.68.137:8000/api/v0/owner/', postData, function () {
            })
            $.get('http://1.14.68.137:8000/api/v0/owner/', { page: fff }, (res) => {
                fff = Math.ceil(res.count / 10)
                // 最新用户id
                let owner = res.results[res.results.length - 1].id
                let license = ''
                $('.car').each(function (i, el) {
                    license += el.value
                })
                let car_img = $('input[accept]')[0].files[0]
                var ownerData = new FormData()
                ownerData.append('car_img', car_img)
                ownerData.append('owner', owner)
                ownerData.append('license', license)
                $.ajax({
                    type: 'post',
                    url: 'http://1.14.68.137:8000/api/v0/license/',
                    contentType: false,
                    processData: false,
                    data: ownerData,
                    success(res) { window.location.reload() }
                })
            })
        }
    })
    // 表单正则
    var al = $('.alert').html()
    $('input[name]').blur(function () {
        switch (this.name) {
            case 'name':
                if (!this.value) {
                    $('.alert').html(this.placeholder)
                    $(this).css({ border: '2px solid #f00' }).focus()
                } else {
                    $(this).css({ border: '1px solid #000' })
                    $('.alert').html(al)
                }
                break;
            case 'phone_number':
                if (!this.value) {
                    $('.alert').html(this.placeholder)
                    $(this).css({ border: '2px solid #f00' }).focus()
                } else {
                    var str = this.value
                    var reg = /^1[0-9]{10}$/
                    if (!reg.test(str)) {
                        $(this).css({ border: '2px solid #f00' }).focus()
                        this.placeholder = '请输入正确的手机号！'
                        $('.alert').html(this.placeholder)
                    } else {
                        $(this).css({ border: '1px solid #000' })
                        $('.alert').html(al)
                    }
                }
                break;
            case 'home_number':
                if (!this.value) {
                    $('.alert').html(this.placeholder)
                    $(this).css({ border: '2px solid #f00' }).focus()
                } else {
                    $(this).css({ border: '1px solid #000' })
                    $('.alert').html(al)
                }
                break;
            case 'park_lot':
                if (!this.value) {
                    $('.alert').html(this.placeholder)
                    $(this).css({ border: '2px solid #f00' }).focus()
                } else {
                    $(this).css({ border: '1px solid #000' })
                    $('.alert').html(al)
                }
                break;
            default:
        }
    })
    // 浏览器默认拖拽事件取消
    document.addEventListener('dragenter', function (e) { e.preventDefault() })
    document.addEventListener('dragleave', function (e) { e.preventDefault() })
    document.addEventListener('dragover', function (e) { e.preventDefault() })
})