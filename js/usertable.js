//usertable模块
    $(function () {
        //自动加载用户列表
        showUser(1);
        var pageNum;
        /*点击查询按钮   查询所有员工数据*/
        $("#selectAll").click(function () {
            showUser(1);
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
                        tr.append("<td >" + userList[i].userRdate.substring(0, 10) + "</td>");
                        tr.append("<td>" + userList[i].userImage + "</td>");

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
                        var url = "http://localhost:8082/tbuser/selectById";
                        var datas = {
                            "Id": $(this).attr("href")
                        };
                        $("#userId").val($(this).attr("href"));
                        $.post(url, datas, function (result) {
                            $("#username").val(result.username);
                            $("#upwd").val(result.userpwd);
                            $("#ucreatedate").val(result.createdate.substring(0, 10));
                            $("#uemail").val(result.email);
                            if (result.role == 1) {
                                $("#role1").prop("checked", true);
                            } else {
                                $("#role0").prop("checked", true);
                            }
                            if (result.userstatus == 1) {
                                $("#ustatus1").prop("checked", true);
                            } else {
                                $("#ustatus0").prop("checked", true);
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

        //修改用户信息
        $("#updateUser").click(function () {
            var url = "http://localhost:8082/tbuser/updateUser";
            var datas = {
                "id": $("#userId").val(),
                "username": $("#username").val(),
                "userpwd": $("#upwd").val(),
                "createdate": $("#ucreatedate").val(),
                "email": $("#uemail").val(),
                "userstatus": $("input[name='ustatus']:checked").val(),
                "role": $("input[name='role']:checked").val()
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
        });
        //时间选择器初始化
        laydate.render({
            elem: '#ucreatedate' //指定元素
        });
    });