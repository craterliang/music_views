//reviewstable模块
$(function () {
    //自动加载用户列表
    showLrc(1);
    var pageNum;
    function showLrc(pageNumber) {
        var url = "http://localhost:8082/lrc/findLrcColumn";
        var datas = {
            "pageNumber": pageNumber,
            "lrc": $("#LrcName").val()
        };
        $.post(url, datas, function (result) {
            var tbody = $("#catalogMsg");
            tbody.find("tr").remove();
            var LrcList = result.list;

            //进数据库  没有符合条件的数据
            if (LrcList == 0) {
                alert("没有符合条件的数据");
                tbody.append(tr);
            } else {
                pageNum = result.pageNum;
                var pageSize = result.pageSize;
                // 循环遍历 empList 获取所有的数据  挂载到  tbody 中
                for (var i = 0; i < LrcList.length; i++) {
                    var tr = $("<tr></tr>");
                    tr.append("<td>" + (pageNum * pageSize - pageSize + i + 1) + "</td>");
                    tr.append("<td>" + LrcList[i].lrcName + "</td>");
                    tr.append("<td>" + LrcList[i].lrcPath + "</td>");
                    tr.append("<td><a href='" + LrcList[i].id + "' class='deleteHref btn btn-danger' style='font-size:10px'>删除</a> </td>");
                    tbody.append(tr);
                }
                //* 根据Id删除对象
                $(".deleteHref").click(function () {
                    if (confirm("确定删除吗？")) {
                        var url = "http://localhost:8082/lrc/deleteLrcById";
                        var datas = {
                            "Id": $(this).attr("href")
                        };
                        $.post(url, datas, function (result) {
                            if (result == 1) {
                                showLrc(pageNum);
                            } else {
                                alert("删除失败！！！");
                            }
                        });
                    }
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
                        showLrc(pageNumber);
                        return false;
                    });
                }
            }
        });
    }

    //查找按钮
    $("#findButton").click(function () {
        showLrc(1);
    });
    //添加歌词
    $("#AddButton").click(function () {
        $('#addModal').modal('show');
    });
    $('#addModal').on('hide.bs.modal', function () {
        $(".fileinput-remove-button").click();
    });
    //添加歌词
    $("#addLrcBtn").click(function () {
        var formData = new FormData($("#myForm_add")[0]);
        $.ajax({
            //接口地址
            url: 'http://localhost:8082/lrcUpload',
            type: 'POST',
            dateType: "JSON",
            data: formData,
            async: false,
            cache: false,
            contentType: false,
            processData: false,
            success: function (data) {
                $('#addModal').modal('hide');
                showLrc(pageNum);
            },
            error: function (returndata) {
                alert("添加失败了");
            }
        });
    });

});