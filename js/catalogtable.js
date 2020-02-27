 //catalogtable模块
    $(function () {
        //自动加载用户列表
        showCatalog(1);
        var pageNum;
        function showCatalog(pageNumber) {
            var url = "http://localhost:8082/tbcatalog/selectAllTbcatalog";
            var datas = {
                "pageNumber": pageNumber
            };
            $.post(url, datas, function (result) {
                var tbody = $("#catalogMsg");
                tbody.find("tr").remove();
                var catalogList = result.list;
                //进数据库  没有符合条件的数据
                if (catalogList == 0) {
                    alert("没有符合条件的数据");
                    tbody.append(tr);
                } else {
                    pageNum = result.pageNum;
                    var pageSize = result.pageSize;
                    // 循环遍历 empList 获取所有的数据  挂载到  tbody 中
                    for (var i = 0; i < catalogList.length; i++) {
                        var tr = $("<tr></tr>");
                        tr.append("<td>" + (pageNum * pageSize - pageSize + i + 1) + "</td>");
                        tr.append("<td>" + catalogList[i].catalog + "</td>");
                        tr.append("<td>" + catalogList[i].catalogdesc + "</td>");
                        tr.append("<td>" + catalogList[i].serialno + "</td>");
                        tr.append("<td >" + catalogList[i].parentid + "</td>");
                        if (catalogList[i].showflag == 1) {
                            tr.append("<td style=\"color: rgb(7, 230, 7);\"><span class='glyphicon glyphicon-ok'></span></td>");
                        } else {
                            tr.append("<td style=\"color: rgb(230, 7, 7);\"><span class='glyphicon glyphicon-remove'></span></td>");
                        }
                        if (catalogList[i].goodflag == 1) {
                            tr.append("<td style=\"color: rgb(7, 230, 7);\"><span class='glyphicon glyphicon-ok'></span></td>");
                        } else {
                            tr.append("<td style=\"color: rgb(230, 7, 7);\"><span class='glyphicon glyphicon-remove'></span></td>");
                        }
                        tr.append("<td><a href='" + catalogList[i].id + "'style='font-size:10px' class='updateBtn btn btn-danger'>修改</a><a href='" + catalogList[i].id + "' class='deleteHref btn btn-default' style='font-size:10px'>删除</a> </td>");
                        tbody.append(tr);
                    }

                    //* 根据Id删除对象
                    $(".deleteHref").click(function () {
                        if (confirm("确定删除吗？")) {
                            var url = "http://localhost:8082/tbcatalog/deleteTbcatalog";
                            var datas = {
                                "id": $(this).attr("href")
                            };
                            $.post(url, datas, function (result) {
                                if (result == 1) {
                                    /!*alert("删除成功！！！");*/;
                                    showCatalog(pageNum);
                                } else {
                                    alert("删除失败！！！");
                                }
                            });
                        }
                        return false;
                    });

                    //根据根据Id获取对象
                    $(".updateBtn").click(function () {
                        var headdiv = $("#head");
                        headdiv.find("h5").remove();
                        headdiv.append("<h5 class='modal-title' id='myModalLabel'>修改商品类别信息</h5>");
                        $('#addModal').modal('show');
                        var url = "http://localhost:8082/tbcatalog/selectTbcatalog";
                        var datas = {
                            "id": $(this).attr("href")
                        };
                        $("#catalogId").val($(this).attr("href"));
                        $.post(url, datas, function (result) {
                            $("#catalog_add").val(result.catalog);
                            $("#catalogdesc_add").val(result.catalogdesc);
                            $("#serialno_add").val(result.serialno);
                            $("#parentid_add").val(result.parentid);
                            if (result.showflag == 1) {
                                $("#showflag_add").prop("checked", true);
                            }
                            if (result.goodflag == 1) {
                                $("#goodflag_add").prop("checked", true);
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
                            if (navigatepageNums[i] == pageNum) {
                                li.append("<li class='active'><a href='" + navigatepageNums[i] + "' class='pageHref btn'>" + navigatepageNums[i] + "</a></li>");
                            } else {
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
                            showCatalog(pageNumber);
                            return false;
                        });
                    }
                }
            });
        }

        $('#addModal').on('hidden.bs.modal', function () {
            $("#catalogId").val(null);
            $("#catalog_add").val("");
            $("#catalogdesc_add").val("");
            $("#serialno_add").val("");
            $("#parentid_add").val("");
            $("#showflag_add").prop("checked", false);
            $("#goodflag_add").prop("checked", false);
        });
        //添加商品类别
        $("#addTbcatalog").click(function () {
            var headdiv = $("#head");
            headdiv.find("h5").remove();
            headdiv.append("<h5 class='modal-title' id='myModalLabel'>添加商品类别信息</h5>");
            $('#addModal').modal('show');
        });
        //添加修改提交
        $("#catalogBtn").click(function () {
            var show = 0;
            var good = 0;
            var url;
            var datas;
            var id =$("#catalogId").val();
            if ($("input[id='showflag_add']:checked").val()) {
                show = 1;
            }
            if ($("input[id='goodflag_add']:checked").val()) {
                good = 1;
            }
            if (id == null || id == "") {
                url = "http://localhost:8082/tbcatalog/addTbcatalog";
                datas = {
                    "catalog": $("#catalog_add").val(),
                    "catalogdesc": $("#catalogdesc_add").val(),
                    "serialno": $("#serialno_add").val(),
                    "parentid": $("#parentid_add").val(),
                    "showflag":show,
                    "goodflag":good
                };
            } else {
                url = "http://localhost:8082/tbcatalog/updateTbcatalog";
                datas = {
                    "id": $("#catalogId").val(),
                    "catalog": $("#catalog_add").val(),
                    "catalogdesc": $("#catalogdesc_add").val(),
                    "serialno": $("#serialno_add").val(),
                    "parentid": $("#parentid_add").val(),
                    "showflag":show,
                    "goodflag":good
                };
            }

            $.post(url, datas, function (result) {
                $('#addModal').modal('hide');
                if (result == 1) {
                    alert("成功了");
                    showCatalog(pageNum);
                } else {
                    alert("失败了！！！");
                }

            });
        });//添加修改商品类别  end


    });