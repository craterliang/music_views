 //reviewstable模块
    $(function () {
        //自动加载用户列表
        showReview(1);
        var pageNum;
        function showReview(pageNumber) {
            var url = "http://localhost:8082/songReviews/findSongReviewsColumn";
            var datas = {
                "pageNumber": pageNumber,
                "songName": $("#SongName").val(),
                "userName": $("#UserName").val()
            };
            $.post(url, datas, function (result) {
                var tbody = $("#catalogMsg");
                tbody.find("tr").remove();
                var reviewList = result.list;

                //进数据库  没有符合条件的数据
                if (reviewList == 0) {
                    alert("没有符合条件的数据");
                    tbody.append(tr);
                } else {
                    pageNum = result.pageNum;
                    var pageSize = result.pageSize;
                    // 循环遍历 empList 获取所有的数据  挂载到  tbody 中
                    for (var i = 0; i < reviewList.length; i++) {
                        var tr = $("<tr></tr>");
                        tr.append("<td>" + (pageNum * pageSize - pageSize + i + 1) + "</td>");
                        tr.append("<td>" + reviewList[i].songName + "</td>");
                        tr.append("<td>" + reviewList[i].userName + "</td>");
                        tr.append("<td>" + reviewList[i].content + "</td>");
                        tr.append("<td >" + reviewList[i].createTime + "</td>");

                        if (reviewList[i].reviewsStatus == 1) {
                            tr.append("<td><label class=\"el-switch \"  style='margin: auto;' > <input type=\"checkbox\" name=\"switch\" class='reviewsSts' href='" + reviewList[i].reviewsId + "' checked> <span class=\"el-switch-style\" ></span> </label></td>");
                        } else {
                            tr.append("<td><label class=\"el-switch \"  style='margin: auto;'> <input type=\"checkbox\" name=\"switch\" class='reviewsSts' href='" + reviewList[i].reviewsId + "' > <span class=\"el-switch-style\" ></span> </label></td>");
                        }

                        tr.append("<td><a href='" + reviewList[i].reviewsId + "' class='deleteHref btn btn-danger' style='font-size:10px'>删除</a> </td>");
                        tbody.append(tr);
                    }
                    $(".reviewsSts").click(function () {
                        var reSts;
                        if ($(this).is(':checked')) {
                            reSts=1;
                        }else{
                            reSts=0;
                        }
                        url = "http://localhost:8082/songReviews/updateReview";
                        datas = {
                            "reviewsId": $(this).attr("href"),
                            "reviewsStatus": reSts
                        };
                        $.post(url, datas, function (result) {
                            if (result==1){
                                return true;
                            } else{
                                return false;
                            }
                        });
                    });
                    //* 根据Id删除对象
                    $(".deleteHref").click(function () {
                        if (confirm("确定删除吗？")) {
                            var url = "http://localhost:8082/songReviews/deleteById";
                            var datas = {
                                "reviewsId": $(this).attr("href")
                            };
                            $.post(url, datas, function (result) {
                                if (result == 1) {
                                    /!*alert("删除成功！！！");*/;
                                    showReview(pageNum);
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
                            showReview(pageNumber);
                            return false;
                        });
                    }
                }
            });
        }

        //查找按钮
        $("#findButton").click(function () {
            showReview(1);
        });

    });