//usertable模块
    $(function () {
        //自动加载用户列表
        showUser(1);
        var pageNum;
        /*点击查询按钮   查询所有员工数据*/
        $("#selectAll").click(function () {
            showUser(1);
        });
        //监控模态框，当重新达打开时清空内容
       $('#myModal').on('hide.bs.modal', function () {
            $(".fileinput-remove-button").click();
        });
        function showUser(pageNumber) {

            var url = "http://localhost:8082/user/findAll";
            var datas = {
                "uname": $("#uname").val(),
                "pageNumber": pageNumber
            };
            $.post(url, datas, function (result) {
                var tbody = $("#userMsg");
                tbody.find("tr").remove();
                var userList = result.list;
                //进数据库  没有符合条件的数据
                if (userList == 0) {
                    alert("没有符合条件的数据")
                    tbody.append(tr);
                } else {
                    pageNum = result.pageNum;
                    var pageSize = result.pageSize;
                    // 循环遍历 userList 获取所有的数据  挂载到  tbody 中
                    for (var i = 0; i < userList.length; i++) {
                        var tr = $("<tr></tr>");
                        tr.append("<td>" + (pageNum * pageSize - pageSize + i + 1) + "</td>");
                        tr.append("<td>" + userList[i].userId + "</td>");
                        tr.append("<td>" + userList[i].userName + "</td>");
                        tr.append("<td>" + userList[i].userPwd + "</td>");
                        if (userList[i].userSex == 1) {
                            tr.append("<td>男</td>");
                        } else {
                            tr.append("<td>女</td>");
                        }
                        tr.append("<td>" + userList[i].userEmail + "</td>");
                        tr.append("<td >" + userList[i].userBirthday.substring(0, 10) + "</td>");
                        tr.append("<td >" + userList[i].userRdate + "</td>");
                        tr.append("<td><img src='http://localhost:8082/img/" + userList[i].userImage + ".jpg' width='40px' height='40px' class='img-circle'/></td>");
                        /*tr.append("<td>" + userList[i].userImage + "</td>");*/

                        if (userList[i].userRole == 1) {
                            tr.append("<td class='hidden-480'><span class='label label-success'>管理员</span></td>");
                        } else {
                            tr.append("<td class='hidden-480'><span class='label label-info'>普通用户</span></td>");
                        }
                        tr.append("<td><a href='" + userList[i].userId + "'style='font-size:10px' class='updateBtn btn btn-danger'>修改</a><a href='" + userList[i].userId + "' class='deleteHref btn btn-default' style='font-size:10px'>删除</a> </td>");
                        tbody.append(tr);
                    }

                    //!* 根据Id删除对象
                    $(".deleteHref").click(function () {
                        if (confirm("确定删除吗？")) {
                            var url = "http://localhost:8082/user/deleteById";
                            var datas = {
                                "userId": $(this).attr("href")
                            }
                            $.post(url, datas, function (result) {
                                if (result == 1) {
                                    /!*alert("删除成功！！！");*!/
                                    showUser(pageNum);
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
                        var url = "http://localhost:8082/user/selectById";
                        var datas = {
                            "Id": $(this).attr("href")
                        };
                        $("#userId").val($(this).attr("href"));
                        $.post(url, datas, function (result) {
                            $("#userImge1").val(result.userImage);
                            $("#username").val(result.userName);
                            $("#upwd").val(result.userPwd);
                            $("#ucreatedate").val(result.userRdate);
                            $("#userBirthday").val(result.userBirthday.substring(0, 10));
                            $("#userImge").attr('src', "http://localhost:8082/img/" + result.userImage + ".jpg");
                            $("#uemail").val(result.userEmail);
                            if (result.userRole == 1) {
                                $("#role1").prop("checked", true);
                            } else {
                                $("#role0").prop("checked", true);
                            }
                            if (result.userSex == 1) {
                                $("#uSex1").prop("checked", true);
                            } else {
                                $("#uSex0").prop("checked", true);
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
                            showUser(pageNumber);
                            return false;
                        });
                    }
                }
            });
        }
        //更新头像
        $("#updateUser").click(function () {
            if (document.getElementById("img_update").value == null || document.getElementById("img_update").value == "") {
                updateUser($("#userImge1").val(),0);
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
                        updateUser(data,1);
                    },
                    error: function (returndata) {
                        alert("图片修改失败了");
                    }
                });
            }
        });//更新图片 end
        //修改用户信息
        function updateUser(data,upBool) {
            var role=$("input[name='role']:checked").val();
            var sex=$("input[name='uSex']:checked").val();
            var url = "http://localhost:8082/user/updateUser";
            var datas = {
                "userId": $("#userId").val(),
                "userName": $("#username").val(),
                "userPwd": $("#upwd").val(),
                "userRdate": $("#ucreatedate").val(),
                "userBirthday": $("#userBirthday").val(),
                "userEmail": $("#uemail").val(),
                "userRole": role,
                "userSex": sex,
                "userImage": data,
                "upBool":upBool
            };
            $.post(url, datas, function (result) {
                $('#myModal').modal('hide');
                if (result == 1) {
                    alert("修改成功");
                    showUser(pageNum);
                } else {
                    alert("修改失败");
                }
            });
        }
        //时间选择器初始化
        laydate.render({
            elem: '#userBirthday'//指定元素
        });
    });