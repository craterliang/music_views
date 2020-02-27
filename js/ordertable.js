//订单模块js文件
    $(function () {
        showOrder(1);
        $("#findButton").click(function () {
            showOrder(1);
        });

        function showOrder(pageNumber) {
            var url = "http://localhost:8082/tborder/findOrderColumn";
            var datas = {
                "orderno": $("#orderno").val(),
                "orderstatus": $("#orderstatus").val(),
                "source": $("#source").val(),
                "pageNumber": pageNumber
            };
            $.post(url, datas, function (result) {
                var tbody = $("#orderMsg");
                tbody.find("tr").remove();
                var orderList = result.list;
                //进数据库  没有符合条件的数据
                if (orderList == 0) {
                    alert("没有符合条件的数据");
                    tbody.append(tr);
                } else {
                    pageNum = result.pageNum;
                    var pageSize = result.pageSize;
                    // 循环遍历 empList 获取所有的数据  挂载到  tbody 中
                    for (var i = 0; i < orderList.length; i++) {
                        var tr = $("<tr></tr>");
                        tr.append("<td>" + (pageNum * pageSize - pageSize + i + 1) + "</td>");
                        tr.append("<td>" + orderList[i].orderno + "</td>");
                        tr.append("<td>" + orderList[i].submittime + "</td>");
                        tr.append("<td>" + orderList[i].userid + "</td>");
                        tr.append("<td >" + orderList[i].amount + "</td>");
                        tr.append("<td >" + orderList[i].payment + "</td>");
                        if (orderList[i].source == 1) {
                            tr.append("<td class='hidden-480'><span class='label label-success'>PC订单</span></td>");
                        } else {
                            tr.append("<td class='hidden-480'><span class='label label-info'>APP订单</span></td>");
                        }
                        if (orderList[i].orderstatus == 1) {
                            tr.append("<td class='hidden-480'><span class='label label-warning'>待付款</span></td>");
                        } else if (orderList[i].orderstatus == 2) {
                            tr.append("<td class='hidden-480'><span class='label label-info'>待发货</span></td>");
                        } else if (orderList[i].orderstatus == 3) {
                            tr.append("<td class='hidden-480'><span class='label label-success'>已发货</span></td>");
                        } else if (orderList[i].orderstatus == 4) {
                            tr.append("<td class='hidden-480'><span class='label label-primary'>已完成</span></td>");
                        } else if (orderList[i].orderstatus == 5) {
                            tr.append("<td class='hidden-480'><span class='label label-danger'>已关闭</span></td>");
                        }
                        tr.append("<td><a style='font-size:10px' class='detailBtn btn btn-primary' id='" + orderList[i].id + "'>查看订单</a></td>");
                        tbody.append(tr);
                    }
                    //查看详情页
                    $(".detailBtn").click(function () {
                        //alert($(this).attr("id"));
                        window.location.href = "orderDetailed.html?id=" + $(this).attr("id");
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
                            showOrder(pageNumber);
                            return false;
                        });

                    }

                }
            });
        }
    });
