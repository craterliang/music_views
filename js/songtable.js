//songtable表js文件

$(function () {
    showsingerAll();

    //加载歌手列表
    function showsingerAll() {
    var singerurl = "http://localhost:8082/singer/findAllSinger";
    $.ajax({
        type: "post",
        url: singerurl,
        async: false,
        success: function (result) {
            if (result.length > 0) {
                let singerAdd = $("#singerAdd");
                let singerup = $("#singerUp");
                singerAdd.find("option").remove();
                //let opt = $("<option value='-1'>歌手</option>");
                //singerAdd.append(opt);
                showSinger(singerAdd);
                showSinger(singerup);
                function showSinger(singerAdd) {
                    for (var i = 0; i < result.length; i++) {
                        var option = $("<option value='" + result[i].singerId + "'>" + result[i].singerName + "</option>");
                        singerAdd.append(option);
                    }
                }

            }
        }
    });//加载信息
    }
    //自动加载歌曲列表
    showSong(1);
    //定义一个值未页码
    var pageNum;
    /*监控模态框
    当模态框打开时清空模态框中的内容*/
    $('#myModal').on('hide.bs.modal', function () {
        $(".fileinput-remove-button").click();
    });
    $('#addModal').on('hide.bs.modal', function () {
        $(".fileinput-remove-button").click();
    });
    $('#addModalNext').on('hide.bs.modal', function () {
        $(".fileinput-remove-button").click();
    });

    //查找按钮
    $("#findButton").click(function () {
        showSong(1);
    });
    // 添加商品
    $("#addButton").click(function () {
        $('#addModal').modal('show');
    });
    //添加歌曲 提交按钮
    $("#addSongBtn").click(function () {
        if (document.getElementById("audio_add").value == null || document.getElementById("audio_add").value === undefined) {
            alert("请选择歌曲");
        } else {
            var formData = new FormData($("#myForm_add")[0]);
            $.ajax({
                //接口地址
                url: 'http://localhost:8082/audioUpload',
                type: 'POST',
                dateType: "JSON",
                data: formData,
                async: false,
                cache: false,
                contentType: false,
                processData: false,
                success: function (data) {
                     $('#addModal').modal('hide');
                    addSong(data);
                    $('#addModalNext').modal('show');
                    $("#songNameAdd").val(data.songName);
                    $("#albumAdd").val(data.album);
                    $("#duration").val(data.duration);
                    $("#songPath").val(data.uuid);
                },
                error: function (returndata) {
                    alert("失败了！歌曲没有添加成功");
                }
            });
        }

    });
    //歌曲所有信息提交
    $("#addSongBtnNext").click(function () {
        var url = "http://localhost:8082/song/insertSong";
        var datas = {
            "singerId": $("#singerAdd").val(),
            "songName": $("#songNameAdd").val(),
            "songStyle": $("#songStyleAdd").val(),
            "songLangue": $("#songLuaAdd").val(),
            "songPath": $("#songPath").val(),
            "songTime": $("#duration").val(),
            "songAlbum": $("#albumAdd").val()
        };
        $.post(url, datas, function (result) {
            if(result==1){
                alert("添加成功！");
                $('#addModalNext').modal('hide');
                showSong(pageNum);
            }
        });
    });
    //添加歌曲
    function addSong(data) {
        //判断是否有歌手信息
        var url = "http://localhost:8082/singer/selectByName";
        var datas = {
            "uname": data.singerName
        };
        $.post(url, datas, function (result) {
            //如没有歌手信息调用自动添加歌手函数添加函数
            if (result.singerId == ""|| result.singerId==null || result.singerId == undefined) {
                addSinger(data.singerName);
            }else{
                $("#singerAdd").val(result.singerId);
            }

        });

    }

    //添加歌手
    function addSinger(singerName) {
        var url = "http://localhost:8082/singer/insert";
        var datas = {
            "singerName": singerName,
            "singerType": "",
            "singerDesc": "",
            "singerSex": "",
            "singerImage": "",
        };
        $.post(url, datas, function (result) {
            if (result == 1) {
                alert("本库没有歌手："+singerName+" :的信息，现已经同步添加到歌手库，记得完善歌手信息");
            }
            var url = "http://localhost:8082/singer/selectByName";
            var datas = {
                "uname": singerName
            };
            $.post(url, datas, function (result) {
                showsingAll();
                $("#singerAdd").val(result.singerId);
            });

        });
    }

    //显示歌曲列表函数
    function showSong(pageNumber) {
        var url = "http://localhost:8082/song/findSongColumn";
        var datas = {
            "songName": $("#SongName").val(),
            "songStyle": $("#songStyle").val(),
            "songLangue": $("#songLu").val(),
            "pageNumber": pageNumber,

        };
        $.post(url, datas, function (result) {
            var tbody = $("#songMsg");
            tbody.find("tr").remove();
            var productList = result.list;
            if (productList == 0) {
                alert("没有符合条件的数据")
                var li = $("#pagenums1");
                li.find("a").remove();
                tbody.append("");
            } else {
                pageNum = result.pageNum;
                var pageSize = result.pageSize;
                // 循环遍历 empList 获取所有的数据  挂载到  tbody 中
                for (var i = 0; i < productList.length; i++) {
                    var tr = $("<tr></tr>");
                    tr.append("<td>" + (pageNum * pageSize - pageSize + i + 1) + "</td>");
                    tr.append("<td>" + productList[i].songName + "</td>");
                    tr.append("<td>" + productList[i].singerName + "</td>");
                    tr.append("<td>" + productList[i].songStyle + "</td>");
                    tr.append("<td>" + productList[i].songLangue + "</td>");
                    tr.append("<td>" + productList[i].songPath + "</td>");
                    tr.append("<td >" + productList[i].songTime + "</td>");
                    tr.append("<td >" + productList[i].songAlbum + "</td>");
                    tr.append("<td width='200px'><a href='" + productList[i].songId + "' style='font-size:10px' class='updateBtn btn btn-danger'>修改</a> <a href='" + productList[i].songId + "' class='deleteHref btn btn-default' style='font-size:10px'>删除</a> </td>");
                    tbody.append(tr);
                }
                // ---分页----------------------------------
                var pages = result.pages;  // 获取总页数
                if (pages >= 1) {
                    var navigatepageNums = result.navigatepageNums;
                    var total = result.total;
                    var li = $("#pagenums1");
                    li.find("li").remove();
                    if (pageNum <= 1) {
                        li.append("<li><a href='" + pageNum + "' class='pageNumBtn btn'>" + "&laquo;" + "</a></li>");
                    } else {
                        var shangye = pageNum - 1;
                        li.append("<li><a href='" + shangye + "' class='pageNumBtn btn'>" + "&laquo;" + "</a></li>");
                    }

                    for (var i = 0; i < navigatepageNums.length; i++) {
                        if(navigatepageNums[i]==pageNum){
                            li.append("<li class='active'><a href='" + navigatepageNums[i] + "' class='pageNumBtn btn'>" + navigatepageNums[i] + "</a></li>");
                        }else{
                            li.append("<li><a href='" + navigatepageNums[i] + "' class='pageNumBtn btn'>" + navigatepageNums[i] + "</a></li>");
                        }
                    }

                    if (pageNum == total) {
                        li.append("<li><a href='" + pageNum + "' class='pageNumBtn btn'>" + "&raquo;" + "</a></li>");
                    } else {
                        var xiaye = pageNum + 1;
                        li.append("<li><a href='" + xiaye + "' class='pageNumBtn btn'>" + "&raquo;" + "</a></li>");
                    }
                    li.append("<li><a id='fenye'>" + "共 " + total + " 条" + "</a></li>");
                    li.append("<li><a id='fenye'>" + "共 " + pages + " 页" + "</a></li>");
                    //$("a[href='"+pageNum+"']").className = 'pageNumBtn pagecolor';
                    /*分页的页码  点击 触发的 事件 */
                    $(".pageNumBtn").click(function () {
                        var pn = $(this).attr("href");
                        showSong(pn);
                        return false;
                    });

                }//  分页  END

                //修改数据，点击按钮根据根据Id获取对象信息
                $(".updateBtn").click(function () {
                    $('#myModal').modal('show');
                    var url = "http://localhost:8082/song/selectSongById";
                    var datas = {
                        "Id": $(this).attr("href")
                    };
                    $("#songIdUp").val($(this).attr("href"));
                    $.post(url, datas, function (result) {
                        $("#songNameUp").val(result.songName);
                        $("#singerUp").val( result.singerId );
                        $("#songStyleUp").val(result.songStyle);
                        $("#songLuaUp").val(result.songLangue);
                        $("#albumUp").val(result.songAlbum);
                        $("#durationUp").val(result.songTime);
                        $("#songPathUp").val(result.songPath);
                    });
                    return false;
                });
                //!* 根据Id删除对象
                $(".deleteHref").click(function () {
                    if (confirm("确定删除吗？")) {
                        var url = "http://localhost:8082/song/deleteSongById";
                        var datas = {
                            "songId": $(this).attr("href")
                        }
                        $.post(url, datas, function (result) {
                            if (result == 1) {
                                //alert("删除成功！！！");
                                showSong(pageNum);
                            } else {
                                alert("删除失败！！！");
                            }
                        });
                    }
                    return false;
                });

            }

        });

    }//显示歌曲列表  end


    //修改数据，提交
    $("#addSongBtnUp").click(function () {

        var url = "http://localhost:8082/song/updateSong";
        var datas = {
            "songId": $("#songIdUp").val(),
            "songName": $("#songNameUp").val(),
            "singerId": $("#singerUp").val(),
            "songStyle": $("#songStyleUp").val(),
            "songLangue": $("#songLuaUp").val(),
            "songAlbum": $("#albumUp").val(),
            "songTime": $("#durationUp").val(),
            "songPath": $("#songPathUp").val(),
        };
        $.post(url, datas, function (result) {
            $('#myModal').modal('hide');
            if (result == 1) {
                alert("修改成功");
                showSong(pageNum);
            } else {
                ErroAlert("修改失败！！！");
            }
        });
    });//修改数据 end

});