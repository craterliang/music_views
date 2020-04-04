//usertable模块
    $(function () {
        //自动加载用户列表
        showSinger(1);
        var pageNum;
        /*点击查询按钮   查询所有员工数据*/
        $("#selectAll").click(function () {
            showSinger(1);
        });
        //监控模态框，当重新达打开时清空内容
       $('#myModal').on('hide.bs.modal', function () {
            $(".fileinput-remove-button").click();
        });
        $('#addModal').on('hide.bs.modal', function () {
            $(".fileinput-remove-button").click();
        });

        //表单监控
        $(function () {
            /*触发失去焦点的事件 */
            //监控歌手名称
            $("#singerNameAdd").blur(function () {
                if ($("#singerNameAdd").val()==""){
                    $("#singerUsable").replaceWith("<label class='input-group-addon label-danger ' id='singerUsable'>不能为空</label>");
                    $("#addSingerCommit").attr("disabled", true);
                }else{
                var url = "http://localhost:8082/singer/selectByName";
                var datas = {
                    "uname": $("#singerNameAdd").val()
                };
                $.post(url, datas, function (result) {
                    if (result.singerId == ""|| result.singerId==null || result.singerId==undefined) {
                        $("#singerUsable").replaceWith( "<label class='input-group-addon label-success ' id='singerUsable'>可用</label>");
                        $("#addSingerCommit").attr("disabled", false);
                    } else {
                        $("#singerUsable").replaceWith( "<label class='input-group-addon label-danger ' id='singerUsable'>不可用</label>");
                        $("#addSingerCommit").attr("disabled", true);
                    }
                });
                }
            });
            //修改歌手
            $("#singerName").blur(function () {
                if ($("#singerName").val()==""){
                    $("#singerUsable1").replaceWith( "<label class='input-group-addon label-danger ' id='singerUsable1'>不能为空</label>");
                    $("#updateSinger").attr("disabled", true);
                }else {
                    var url = "http://localhost:8082/singer/selectByName";
                    var datas = {
                        "uname": $("#singerName").val()
                    }
                    $.post(url, datas, function (result) {
                        if (result.singerId == "" || result.singerId == null || result.singerId == undefined || result.singerId == $("#userId").val()) {
                            $("#singerUsable1").replaceWith("<label class='input-group-addon label-success ' id='singerUsable1'>可用</label>");
                            $("#updateSinger").attr("disabled", false);
                        } else {
                            $("#singerUsable1").replaceWith("<label class='input-group-addon label-danger ' id='singerUsable1'>不可用</label>");
                            $("#updateSinger").attr("disabled", true);
                        }
                    });
                }
            });
        });
        function showSinger(pageNumber) {

            var url = "http://localhost:8082/singer/findAll";
            var datas = {
                "uname": $("#uname").val(),
                "pageNumber": pageNumber
            };
            $.post(url, datas, function (result) {
                var tbody = $("#userMsg");
                tbody.find("tr").remove();
                var singerList = result.list;
                //进数据库  没有符合条件的数据
                if (singerList == 0) {
                    alert("没有符合条件的数据")
                    tbody.append(tr);
                } else {
                    pageNum = result.pageNum;
                    var pageSize = result.pageSize;
                    // 循环遍历 singerList 获取所有的数据  挂载到  tbody 中
                    for (var i = 0; i < singerList.length; i++) {
                        var tr = $("<tr></tr>");
                        tr.append("<td>" + singerList[i].singerId + "</td>");
                        tr.append("<td>" + singerList[i].singerName + "</td>");
                        tr.append("<td><img src='http://localhost:8082/img/" + singerList[i].singerImage + ".jpg' width='40px' height='40px' /></td>");
                        if (singerList[i].singerSex == 1) {
                            tr.append("<td>男</td>");
                        } else {
                            tr.append("<td>女</td>");
                        }
                        tr.append("<td>" + singerList[i].singerType + "</td>");

                        tr.append("<td>" + singerList[i].singerDesc.substring(0,17)+ "..."+ "</td>");
                        
                       /*tr.append("<td>" + singerList[i].userImage + "</td>");*/
                        
                        tr.append("<td><a href='" + singerList[i].singerId + "'style='font-size:10px' class='updateBtn btn btn-danger'>修改</a><a href='" + singerList[i].singerId + "' class='deleteHref btn btn-default' style='font-size:10px'>删除</a> </td>");
                        tbody.append(tr);
                    }

                    //!* 根据Id删除对象
                    $(".deleteHref").click(function () {
                        if (confirm("确定删除吗？")) {
                            var url = "http://localhost:8082/singer/deleteById";
                            var datas = {
                                "singerId": $(this).attr("href")
                            }
                            $.post(url, datas, function (result) {
                                if (result == 1) {
                                    /!*alert("删除成功！！！");*!/
                                    showSinger(pageNum);
                                } else {
                                    alert("删除失败！！！");
                                }
                            });
                        }
                        return false;
                    });

                    //根据根据Id获取对象
                    $(".updateBtn").click(function () {
                        $('#myModal').modal('show');
                        var url = "http://localhost:8082/singer/selectById";
                        var datas = {
                            "Id": $(this).attr("href")
                        };
                        $("#userId").val($(this).attr("href"));
                        $.post(url, datas, function (result) {
                            $("#singerImge1").val(result.singerImage);
                            $("#singerName").val(result.singerName);
                            $("#singerType").val(result.singerType);
                            $("#singerDesc_up").val(result.singerDesc);
                            $("#singerImge").attr('src', "http://localhost:8082/img/" + result.singerImage + ".jpg");
                            if (result.singerSex == 1) {
                                $("#sSex1").prop("checked", true);
                            } else {
                                $("#sSex0").prop("checked", true);
                            }
                        });

                        return false;
                    });

                    //分页-----------------------
                    var pages = result.pages;
                    if (pages >= 1) {
                        var navigatepageNums = result.navigatepageNums;  // [1,2,3,4,5]
                        var total = result.total;
                        var li = $("#pagenums1");
                        li.find("li").remove();
                        if (pageNum <= 1) {
                            li.append("<li><a href='" + pageNum + "' class='pageHref btn'>" + "&laquo;" + "</a></li>");
                        } else {
                            var shangye = pageNum - 1;
                            li.append("<li><a href='" + shangye + "' class='pageHref btn'>" + "&laquo;" + "</a></li>");
                        }

                        for (var i = 0; i < navigatepageNums.length; i++) {
                            if(navigatepageNums[i]==pageNum){
                                li.append("<li class='active'><a href='" + navigatepageNums[i] + "' class='pageHref btn'>" + navigatepageNums[i] + "</a></li>");
                            }else {
                                li.append("<li><a href='" + navigatepageNums[i] + "' class='pageHref btn'>" + navigatepageNums[i] + "</a></li>");
                            }
                        }
                        if (pageNum == total) {
                            li.append("<li><a href='" + pageNum + "' class='pageHref btn'>" + "&raquo;" + "</a></li>");
                        } else {
                            var xiaye = pageNum + 1;
                            li.append("<li><a href='" + xiaye + "' class='pageHref btn'>" + "&raquo;" + "</a></li>");
                        }
                        li.append("<li><a id='fenye' class='btn'>" + "共 " + total + " 条" + "</a></li>");
                        li.append("<li><a id='fenye' class='btn'>" + "共 " + pages + " 页" + "</a></li>");
                        /*分页超链接的事件*/
                        $(".pageHref").click(function () {
                            var pageNumber = $(this).attr("href");
                            showSinger(pageNumber);
                            return false;
                        });
                    }
                }
            });
        }
        //添加歌手
        $("#addSinger").click(function () {
            $('#addModal').modal('show');
        });
        $("#addSingerCommit").click(function () {
            if (document.getElementById("img_add").value == null || document.getElementById("img_add").value == "") {
                alert("歌手头像不能为空！");
            } else {
                var formData = new FormData($("#myFormAdd")[0]);
                $.ajax({
                    //接口地址
                    url: 'http://localhost:8082/ImgUpload',
                    type: 'POST',
                    dateType: "JSON",
                    data: formData,
                    async: false,
                    cache: false,
                    contentType: false,
                    processData: false,
                    success: function (data) {
                        alert(data);
                        addSinger(data);
                    },
                    error: function (returndata) {
                        alert("头像添加失败了");
                    }
                });
            }
        });
        function addSinger(data){
            var addsex=$("input[name='sSexAdd']:checked").val();
            var url = "http://localhost:8082/singer/insert";
            var datas = {
                "singerName": $("#singerNameAdd").val(),
                "singerType": $("#singerTypeAdd").val(),
                "singerDesc": $("#singerDescAdd").val(),
                "singerSex": addsex,
                "singerImage": data,
            };
            $.post(url, datas, function (result) {
                $('#addModal').modal('hide');
                if (result == 1) {
                    alert("添加成功");
                    $("#singerNameAdd").val("");
                    $("#singerDescAdd").val("   bb" +
                        "" +
                        "" +
                        "" +
                        "") ;
                    showSinger(pageNum);
                } else {
                    alert("添加失败");
                }
            });
        }
        //更新头像
        $("#updateSinger").click(function () {
            if (document.getElementById("img_update").value == null || document.getElementById("img_update").value == "") {
                updateSinger($("#singerImge1").val(),0);
            } else {
                var formData = new FormData($("#myForm")[0]);
                $.ajax({
                    //接口地址
                    url: 'http://localhost:8082/ImgUpload',
                    type: 'POST',
                    dateType: "JSON",
                    data: formData,
                    async: false,
                    cache: false,
                    contentType: false,
                    processData: false,
                    success: function (data) {
                        updateSinger(data,1);
                    },
                    error: function (returndata) {
                        alert("图片修改失败了");
                    }
                });
            }
        });//更新图片 end
        //修改用户信息
        function updateSinger(data,upBool) {
            var sex=$("input[name='sSex']:checked").val();
            var url = "http://localhost:8082/singer/updateSinger";
            var datas = {
                "singerId": $("#userId").val(),
                "singerName": $("#singerName").val(),
                "singerType": $("#singerType").val(),
                "singerDesc": $("#singerDesc_up").val(),
                "singerSex": sex,
                "singerImage": data,
                "upBool":upBool
            };
            $.post(url, datas, function (result) {
                $('#myModal').modal('hide');
                if (result == 1) {
                    alert("修改成功");
                    showSinger(pageNum);
                } else {
                    alert("修改失败");
                }
            });
        }
    });