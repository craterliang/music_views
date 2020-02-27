//protable表js文件

$(function () {

    showMasterImg();
    showShowImg();
    showDetailImg();
    GetRequest();
    var productId;
    var showImgNumber;
    var DetailImgNumber;

    function GetRequest() {
        var url = location.search; //获取url中"?"符后的字串
        if (url.indexOf("?id=") != -1) {    //判断是否有参数
            var str = url.substr(1); //从第一个字符开始 因为第0个是?号 获取所有除问号的所有符串
            strs = str.split("=");   //用等号进行分隔 （因为知道只有一个参数 所以直接用等号进分隔 如果有多个参数 要用&号分隔 再用等号进行分隔）
            productId = strs[1];
            return strs[1];
        }
    }

    function showMasterImg() {
        var id = GetRequest();
        var url = "http://localhost:8082/tbproduct/selectProductById";
        var datas = {
            "Id": id,
        };
        $.post(url, datas, function (result) {
            if (result != 0) {
                var productImg = result;
                var masterdiv = $("#masterImg");
                var h1 = document.getElementById('ImgName');
                h1.innerHTML = productImg.productname + ' 图片管理';
                masterdiv.find("tr").remove();
                masterdiv.append("<tr><td><img style='width: auto;height: 180px' src='http://localhost:8082/" + productImg.picpath + ".jpg'></td></tr>")
            }
        });
    }

    function showShowImg() {
        var url = "http://localhost:8082/productImg/selectAllproductImg";
        var datas = {
            "productid": productId,
            "imgtype": 1
        };
        var Showdiv = $("#showImg");
        Showdiv.find("tr").remove();
        Showdiv.append("<tr><td style='border: 0px'><h3>没有数据！</h3></td></tr>");
        $.post(url, datas, function (result) {
            if (result != 0) {
                var ShowImg = result;
                showImgNumber = result.length;
                Showdiv.find("tr").remove();
                var Showtr = $("<tr></tr>");
                for (var i = 0; i < ShowImg.length; i++) {
                    Showtr.append("<td><img style='width: 165px;height: auto' src='http://localhost:8082/" + ShowImg[i].picpath + ".jpg'>" +
                        "<br><br><a href='" + ShowImg[i].id + "' style='font-size: 8px' class='updateShowHref btn btn-default'>修改</a> " +
                        "<a href='" + ShowImg[i].id + "' style='font-size: 8px' class='deleteShowHref btn btn-danger'>删除</a></td>");
                    Showdiv.append(Showtr);
                }

                //!* 根据Id删除图片
                $(".deleteShowHref").click(function () {
                    if (confirm("确定删除吗？")) {
                        var url = "http://localhost:8082/productImg/deleteproductImg";
                        var datas = {
                            "id": $(this).attr("href")
                        }
                        $.post(url, datas, function (result) {
                            if (result == 1) {
                                showShowImg();
                            } else {
                                alert("删除失败！！！");
                            }
                        });
                    }
                    return false;
                });

                //修改图片
                $(".updateShowHref").click(function () {
                    $('#updateModal').modal('show');
                    $("#updateproductId").val($(this).attr("href"));
                    $("#updateImgType").val("1");
                    return false;
                });

            }
        });
    };

    function showDetailImg() {
        var url = "http://localhost:8082/productImg/selectAllproductImg";
        var datas = {
            "productid": productId,
            "imgtype": 2
        };
        var Detaildiv = $("#DetailImg");
        Detaildiv.find("tr").remove();
        Detaildiv.append("<tr><td style='border: 0px'><h3>没有数据！</h3></td></tr>");
        $.post(url, datas, function (result) {
            if (result != 0) {
                var DetailImg = result;
                DetailImgNumber = result.length;
                Detaildiv.find("tr").remove();
                var Detailtr = $("<tr></tr>");
                var Detailtr1 = $("<tr></tr>");
                for (var i = 0; i < DetailImg.length; i++) {
                    if (i < 5) {
                        Detailtr.append("<td><img style='width: 165px;height: 240px' src='http://localhost:8082/" + DetailImg[i].picpath + ".jpg'>" +
                            "<br><br><a href='" + DetailImg[i].id + "' style=' vertical-align:down; font-size: 8px' class='updateDetailHref btn btn-default'>修改</a> " +
                            "<a href='" + DetailImg[i].id + "' style='font-size: 8px' class='deleteDetailHref btn btn-danger'>删除</a></td>");
                        Detaildiv.append(Detailtr);
                    } else {

                        Detailtr1.append("<td><img style='width: 165px;height: 240px' src='http://localhost:8082/" + DetailImg[i].picpath + ".jpg'>" +
                            "<br><br><a href='" + DetailImg[i].id + "' style='font-size: 8px' class='updateDetailHref btn btn-default'>修改</a> " +
                            "<a href='" + DetailImg[i].id + "' style='font-size: 8px' class='deleteDetailHref btn btn-danger'>删除</a></td>");
                        Detaildiv.append(Detailtr1);
                    }
                }
                //!* 根据Id详情删除图片
                $(".deleteDetailHref").click(function () {
                    if (confirm("确定删除吗？")) {
                        var url = "http://localhost:8082/productImg/deleteproductImg";
                        var datas = {
                            "id": $(this).attr("href")
                        }
                        $.post(url, datas, function (result) {
                            if (result == 1) {
                                showDetailImg();
                            } else {
                                alert("删除失败！！！");
                            }
                        });
                    }
                    return false;
                });

                //修改详情图片
                $(".updateDetailHref").click(function () {
                    $('#updateModal').modal('show');
                    $("#updateproductId").val($(this).attr("href"));
                    $("#updateImgType").val("2");
                    return false;
                });
            }
        });
    }

    //添加展示图片
    $(".addShowBtn").click(function () {
        $('#addShowModal').modal('show');
        $("#ImgType").val("1");
    });
    //添加详情图片
    $(".addDetailBtn").click(function () {
        $('#addShowModal').modal('show');
        $("#ImgType").val("2");
    });

    //添加图片上传图片模块
    $("#submitShowBtn").click(function () {
        if (document.getElementById("img_add").value == null || document.getElementById("img_add").value == undefined || document.getElementById("img_add").value == '') {
            alert("请选择上传图片");
        } else if (showImgNumber >= 5 && $("#ImgType").val() == 1) {
            alert("展示图片上传数量达到上限！");
            $(".fileinput-remove-button").click();
        } else if (DetailImgNumber >= 10 && $("#ImgType").val() == 2) {
            alert("展示图片上传数量达到上限！");
            $(".fileinput-remove-button").click();
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
                    addImg(data, $("#ImgType").val());
                },
                error: function (returndata) {
                    alert("失败了！图片没有添加成功");
                    //请求异常的回调
                }
            });
        }
    });

    //添加图片Ajax提交图片信息
    function addImg(data, ImgType) {
        var url = "http://localhost:8082/productImg/addproductImg";
        var datas = {
            "productid": productId,
            "imgtype": ImgType,
            "picpath": data,
        }
        $.post(url, datas, function (result) {
            $('#addShowModal').modal('hide');
            if (result == 1) {
                $(".fileinput-remove-button").click();
                showShowImg();
                showDetailImg();
            } else {
                alert("添加图片失败");
                $(".fileinput-remove-button").click();
            }
        });

    };


    //修改图片上传图片模块
    $("#submitUpdateBtn").click(function () {
        if (document.getElementById("img_update").value == null || document.getElementById("img_update").value == undefined || document.getElementById("img_update").value == '') {
            alert("请选择上传图片");
        } else {
            var formData = new FormData($("#myForm_update")[0]);
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
                    updateImg(data, $("#updateImgType").val());
                },
                error: function (returndata) {
                    alert("失败了！图片没有修改成功");
                    //请求异常的回调
                }
            });
        }
    });

    //修改图片 展示图片模块 提交信息
    function updateImg(data, Type) {
        var url = "http://localhost:8082/productImg/updateproductImg";
        var datas = {
            "id": $("#updateproductId").val(),
            "productid": productId,
            "imgtype": Type,
            "picpath": data,
        }
        $.post(url, datas, function (result) {
            $('#updateModal').modal('hide');
            if (result == 1) {
                alert("修改图片成功");
                $(".fileinput-remove-button").click();
                showShowImg();
                showDetailImg();
            } else {
                alert("修改图片失败");
                $(".fileinput-remove-button").click();
            }
        });

    };


});