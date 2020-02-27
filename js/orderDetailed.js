//订单详情模块js文件
    $(function () {

        showOrderDetailed();
        function GetRequest() {
            var url = location.search; //获取url中"?"符后的字串
            if (url.indexOf("?id=") != -1) {    //判断是否有参数
                var str = url.substr(1); //从第一个字符开始 因为第0个是?号 获取所有除问号的所有符串
                strs = str.split("=");   //用等号进行分隔 （因为知道只有一个参数 所以直接用等号进分隔 如果有多个参数 要用&号分隔 再用等号进行分隔）
                return strs[1];
            }
        }
        function showOrderDetailed() {
            var id=GetRequest();
            var url = "http://localhost:8082/tborder/selectOrderDetailedById";
            var datas = {
                "id": id,
            };
            $.post(url, datas, function (result) {
                var basetbody = $("#baseMsg");
                var usertbody = $("#userMsg");
                var producttbody = $("#productMsg");
                basetbody.find("tr").remove();
                usertbody.find("tr").remove();
                producttbody.find("tr").remove();
                var productList = result;
                //进数据库  没有符合条件的数据
                if (productList == 0) {
                    alert("没有符合条件的数据");
                } else {
                    //添加基本信息
                    var basetr = $("<tr></tr>");
                    basetr.append("<td>" + productList[0].orderno + "</td>");
                    basetr.append("<td>" + productList[0].username + "</td>");
                    basetr.append("<td>" + productList[0].payment + "</td>");
                    basetr.append("<td >" + productList[0].source + "</td>");
                    basetr.append("<td >" + productList[0].submittime + "</td>");
                    basetbody.append(basetr);
                    //添加收货地址
                    var usertr = $("<tr></tr>");
                    usertr.append("<td>" + productList[0].receiver + "</td>");
                    usertr.append("<td>" + productList[0].telephone + "</td>");
                    usertr.append("<td>" + productList[0].addr + "</td>");
                    usertbody.append(usertr);

                    // 循环遍历 商品信息
                    for (var i = 0; i < productList.length; i++) {
                        var ordertr = $("<tr></tr>");
                        ordertr.append("<td><a href='http://localhost:8082/" + productList[i].picpath + ".jpg' " +
                            "target='_blank'><img src='http://localhost:8082/" + productList[i].picpath + ".jpg' width='40px' height='40px' /></a>  </td>");
                        ordertr.append("<td>" + productList[i].productname + "</td>");
                        ordertr.append("<td>" + productList[i].productsn + "</td>");
                        ordertr.append("<td>" + productList[i].transactionprice + "</td>");
                        ordertr.append("<td >" + productList[i].amount + "</td>");
                        ordertr.append("<td >" + productList[i].amount*productList[i].transactionprice + "</td>");
                        producttbody.append(ordertr);
                    }
                }
            });
        }
    });