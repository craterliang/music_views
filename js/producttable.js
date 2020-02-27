//protable表js文件

$(function () {

    //加载商品类别信息/品牌信息
    var catalogurl = "http://localhost:8082/tbcatalog/findAllTbcatalog";
    var brandurl = "http://localhost:8082/tbbrand/findAllTbbrand";
    $.ajax({
        type: "post",
        url: catalogurl,
        async: false,
        success: function (result) {
            if (result.length > 0) {
                var selectcatalogid = $("#catalogid");
                var updatecatalogid = $("#catalogid_update");
                var addcatalogid = $("#catalogid_add");
                selectcatalogid.find("option").remove();
                updatecatalogid.find("option").remove();
                addcatalogid.find("option").remove();
                var opt = $("<option value='-1'>商品类别</option>");
                selectcatalogid.append(opt);
                showcatalog(selectcatalogid);
                showcatalog(updatecatalogid);
                showcatalog(addcatalogid);

                // 循环显示数据信息
                function showcatalog(allcatalogid) {

                    for (let i = 0; i < result.length; i++) {
                        if(result[i].showflag==1){
                        let option = $("<option value='" + result[i].id + "'>" + result[i].catalog + "</option>");
                        allcatalogid.append(option);
                        }
                    }
                }
            }
        }
    });
    $.ajax({
        type: "post",
        url: brandurl,
        async: false,
        success: function (result) {
            if (result.length > 0) {
                let selectbrandid = $("#brandid");
                let updatetbrandid = $("#brandid_update");
                let addtbrandid = $("#brandid_add");
                selectbrandid.find("option").remove();
                let opt = $("<option value='-1'>所有品牌</option>");
                selectbrandid.append(opt);
                showTbrand(selectbrandid);
                showTbrand(updatetbrandid);
                showTbrand(addtbrandid);

                function showTbrand(alltbrandid) {
                    for (var i = 0; i < result.length; i++) {
                        var option = $("<option value='" + result[i].brandid + "'>" + result[i].brandname + "</option>");
                        alltbrandid.append(option);
                    }
                }

            }
        }
    });//加载信息  end

    //自动加载列表
    showProduct(1);
    var pageNum;
    //监控模态框
    $('#myModal').on('hide.bs.modal', function () {
        $(".fileinput-remove-button").click();
    })
    $('#addModal').on('hide.bs.modal', function () {
        $(".fileinput-remove-button").click();
    })
    //查询按钮
    $("#findButton").click(function () {
        showProduct(1);
    });
    // 添加商品
    $("#addButton").click(function () {
        $('#addModal').modal('show');
    });
    //添加商品提交按钮
    $("#addproductBtn").click(function () {
        if (document.getElementById("img_add").value == null || document.getElementById("img_add").value === undefined) {
            alert("请选择上传图片");
        } else {
            var formData = new FormData($("#myForm_add")[0]);
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
                    addProduct(data);
                },
                error: function (returndata) {
                    alert("失败了！图片没有添加成功");
                    //请求异常的回调
                }
            });
        }
    });

    //添加商品
    function addProduct(data) {
        var show = 0;
        var pay = 0;
        var good = 0;
        if ($("input[id='showflag_add']:checked").val()) {
            show = 1;
        }
        if ($("input[id='payflag_add']:checked").val()) {
            pay = 1;
        }
        if ($("input[id='goodflag_add']:checked").val()) {
            good = 1;
        }
        var url = "http://localhost:8082/tbproduct/insertProduct";
        var datas = {
            "productname": $("#productname_add").val(),
            "productsn": $("#productsn_add").val(),
            "catalogid": $("#catalogid_add").val(),
            "brandid": $("#brandid_add").val(),
            "price": $("#price_add").val(),
            "saleamount": $("#saleamount_add").val(),
            "saleprice": $("#saleprice_add").val(),
            "serialno": $("#serialno_add").val(),
            "weight": $("#weight_add").val(),
            "productdesc": $("#productdesc_add").val(),
            "productdetail": $("#productdetail_add").val(),
            "productremark": $("#productremark_add").val(),
            "amount": $("#amount_add").val(),
            "showflag": show,
            "payflag": pay,
            "goodflag": good,
            "picpath": data,
        };
        $.post(url, datas, function (result) {
            $('#addModal').modal('hide');
            if (result == 1) {
                alert("添加商品成功");
                showProduct(1);
                $("#productname_add").val("");
                $("#productsn_add").val("");
                $("#price_add").val("");
                $("#saleamount_add").val("");
                $("#saleprice_add").val("");
                $("#serialno_add").val("");
                $("#weight_add").val("");
                $("#productdesc_add").val("");
                $("#productdetail_add").val("");
                $("#productremark_add").val("");
                $("#amount_add").val("");
                $("#showflag_add").prop("checked", false);
                $("#goodflag_add").prop("checked", false);
                $("#payflag_add").prop("checked", false);
            } else {
                ErroAlert("添加商品失败！！！");
            }

        });
    }//添加商品  end
    //显示商品列表
    function showProduct(pageNumber) {
        var url = "http://localhost:8082/tbproduct/findProductColumn";
        var datas = {
            "productname": $("#productname").val(),
            "catalogid": $("#catalogid").val(),
            "brandid": $("#brandid").val(),
            "showflag": $("#showflag").val(),
            "lowprice": $("#lowprice").val(),
            "upprice": $("#upprice").val(),
            "goodflag": $("#goodflag").val(),
            "pageNumber": pageNumber,
            "pagesize":5

        };

        $.post(url, datas, function (result) {
            var tbody = $("#productMsg");
            tbody.find("tr").remove();
            var productList = result.list;
            //进数据库  没有符合条件的数据
            if (productList == 0) {
                alert("没有符合条件的数据")
                var li = $("#pagenums1");
                li.find("a").remove();
                tbody.append(tr);
            } else {
                pageNum = result.pageNum;
                var pageSize = result.pageSize;
                // 循环遍历 empList 获取所有的数据  挂载到  tbody 中
                for (var i = 0; i < productList.length; i++) {
                    var tr = $("<tr></tr>");
                    tr.append("<td>" + (pageNum * pageSize - pageSize + i + 1) + "</td>");
                    tr.append("<td><a href='http://localhost:8082/" + productList[i].picpath + ".jpg' " +
                        "target='_blank'><img src='http://localhost:8082/" + productList[i].picpath + ".jpg' width='40px' height='40px' /></a>  </td>");
                    tr.append("<td>" + productList[i].productname + "</td>");
                    tr.append("<td>" + productList[i].productsn + "</td>");
                    tr.append("<td>" + productList[i].catalog + "</td>");
                    tr.append("<td >" + productList[i].brandname + "</td>");
                    tr.append("<td >" + productList[i].price + "</td>");
                    tr.append("<td >" + productList[i].amount + "</td>");
                    if (productList[i].showflag == 1) {
                        tr.append("<td style=\"color: rgb(7, 230, 7);\"><span class='glyphicon glyphicon-ok'></span></td>");
                    } else {
                        tr.append("<td style=\"color: rgb(230, 7, 7);\"><span class='glyphicon glyphicon-remove'></span></td>");
                    }
                    if (productList[i].goodflag == 1) {
                        tr.append("<td style=\"color: rgb(7, 230, 7);\"><span class='glyphicon glyphicon-ok'></span></td>");
                    } else {
                        tr.append("<td style=\"color: rgb(230, 7, 7);\"><span class='glyphicon glyphicon-remove'></span></td>");
                    }
                    tr.append("<td width='200px'><a href='" + productList[i].id + "' style='font-size:10px' class='productImg btn btn-primary'>图片管理</a> <a href='" + productList[i].id + "' style='font-size:10px' class='updateBtn btn btn-danger'>修改</a> <a href='" + productList[i].id + "' class='deleteHref btn btn-default' style='font-size:10px'>删除</a> </td>");

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
                        showProduct(pn);
                        return false;
                    });

                }//  分页  END

                //根据根据Id获取对象信息
                $(".updateBtn").click(function () {
                    $('#myModal').modal('show');
                    var url = "http://localhost:8082/tbproduct/selectProductById";
                    var datas = {
                        "Id": $(this).attr("href")
                    };
                    $("#productId").val($(this).attr("href"));
                    $.post(url, datas, function (result) {
                        $("#picpath1").val(result.picpath);
                        $("#imgup").attr('src', "http://localhost:8082/" + result.picpath + ".jpg");
                        $("#productname_update").val(result.productname);
                        $("#productsn_update").val(result.productsn);
                        $("#catalogid_update").val(result.catalogid);
                        $("#brandid_update").val(result.brandid);
                        $("#price_update").val(result.price);
                        $("#saleprice_update").val(result.saleprice);
                        $("#saleamount_update").val(result.saleamount);
                        $("#amount_update").val(result.amount);
                        $("#serialno_update").val(result.serialno);
                        $("#weight_update").val(result.weight);
                        $("#productdesc_update").val(result.productdesc);
                        $("#productdetail_update").val(result.productdetail);
                        $("#productremark_update").val(result.productremark);
                        $("#showflag_update").val(result.showflag);
                        $("#goodflag_update").val(result.goodflag);
                        $("#payflag_update").val(result.payflag);

                        if (result.showflag == 1) {
                            $("#showflag_update").prop("checked", true);
                        }
                        if (result.goodflag == 1) {
                            $("#goodflag_update").prop("checked", true);
                        }
                        if (result.payflag == 1) {
                            $("#payflag_update").prop("checked", true);
                        }
                    });
                    return false;
                });
                //!* 根据Id删除对象
                $(".deleteHref").click(function () {
                    if (confirm("确定删除吗？")) {
                        var url = "http://localhost:8082/tbproduct/deleteProductById";
                        var datas = {
                            "productId": $(this).attr("href")
                        }
                        $.post(url, datas, function (result) {
                            if (result == 1) {
                                //alert("删除成功！！！");
                                showProduct(pageNum);
                            } else {
                                alert("删除失败！！！");
                            }
                        });
                    }
                    return false;
                });

                //图片管理
                $(".productImg").click(function () {
                    var id= $(this).attr("href");
                    window.location.href = "productImg.html?id=" + id;

                    return false;
                });
            }

        });

    }//显示列表  end


    //更行商品信息
    //更新图片
    $("#updateProduct").click(function () {
        if (document.getElementById("img_update").value == null || document.getElementById("img_update").value == "") {
            updateProduct($("#picpath1").val(),0);
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
                    updateProduct(data,1);
                },
                error: function (returndata) {
                    alert("图片修改失败了");
                }
            });
        }
    });//更新图片 end
    //修改数据
    function updateProduct(data,upBool) {
        var show = 0;
        var pay = 0;
        var good = 0;
        if ($("input[id='showflag_update']:checked").val()) {
            show = 1;
        }
        if ($("input[id='payflag_update']:checked").val()) {
            pay = 1;
        }
        if ($("input[id='goodflag_update']:checked").val()) {
            good = 1;
        }
        var url = "http://localhost:8082/tbproduct/updateProduct";
        var datas = {
            "id": $("#productId").val(),
            "productname": $("#productname_update").val(),
            "productsn": $("#productsn_update").val(),
            "catalogid": $("#catalogid_update").val(),
            "brandid": $("#brandid_update").val(),
            "price": $("#price_update").val(),
            "saleamount": $("#saleamount_update").val(),
            "saleprice": $("#saleprice_update").val(),
            "serialno": $("#serialno_update").val(),
            "weight": $("#weight_update").val(),
            "productdesc": $("#productdesc_update").val(),
            "productdetail": $("#productdetail_update").val(),
            "productremark": $("#productremark_update").val(),
            "amount": $("#amount_update").val(),
            "showflag": show,
            "payflag": pay,
            "goodflag": good,
            "picpath": data,
            "upBool":upBool
        };
        $.post(url, datas, function (result) {
            $('#myModal').modal('hide');
            if (result == 1) {
                alert("修改成功");
                showProduct(pageNum);
            } else {
                ErroAlert("修改失败！！！");
            }
        });
    }
});