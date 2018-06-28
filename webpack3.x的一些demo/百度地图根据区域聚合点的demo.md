# 前端代码
```html
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Document</title>
    <style type="text/css">
        html,
        body,
        #container {
            width: 100%;
            height: 100%;
            overflow: hidden;
            margin: 0;
            font-family: "微软雅黑";
        }
    </style>
</head>

<body>
    <div id="container"></div>
    <script src="https://code.jquery.com/jquery-2.2.4.min.js" integrity="sha256-BbhdlvQf/xTY9gja0Dq3HiwQF8LaCRTXxZKRutelT44="
        crossorigin="anonymous"></script>
    <script type="text/javascript" src="http://api.map.baidu.com/api?v=3.0&ak=HWzRuiQHQj1QrMifGGkYB0su9YufKwiz"></script>
    <script>
        //三级（市，区县，街道）直辖市，除此之外的省都是四级（省，市，区县，街道）
        const municipality = ["北京市", "天津市", "上海市", "重庆市", "香港特别行政区", "澳门特别行政区"];
        //最小级zoom，省级zoom
        const ZOOM_PROVINCE_LEVEL = 5;
        //市级zoom
        const ZOOM_CITY_LEVEL = 8;
        //区县级zoom
        const ZOOM_DISTRICT_LEVEL = 11;
        //街道级zoom
        const ZOOM_STREET_LEVEL = 13;
        //缩放最大级别 zoom
        const ZOOM_MAX_LEVEL = 17;
        //当前zoom级别
        let current_zoom = ZOOM_PROVINCE_LEVEL;

        //省市区县级别
        const LEVEL_PROVINCE = 1;
        const LEVEL_CITY = 2;
        const LEVEL_DISTRICT = 3;
        const LEVEL_STREET = 4;

        //事件控制变量
        let marker_mouseover_flag = true;


        //清除覆盖物
        function removeOverlay(map) {
            map.clearOverlays();
        }

        //设置所有覆盖物为可清除
        function setAllOverLayClear(map) {
            let allOverlay = map.getOverlays();
            for (let overlay of allOverlay) {
                overlay.enableMassClear();
            }
        }


        /**
        * 添加行政区边框
        * @param map
        * @param args 行政区域名称数组，以百度地图标准行政区域名称为主
        * @param isAlwaysShow 是否持续显示，默认为false
        * @param strokeColor 边框线条颜色，填入颜色编码，默认为#ff9a39
        * @param fillColor 覆盖物背景色，填入颜色编码，默认为无色透明
        */
        function getBoundaryAndColor(map, arg, isAlwaysShow, fillColor, strokeWeight, strokeColor) {
            strokeColor = strokeColor || "#f56c6c";
            if (fillColor == null) {
                fillColor = "#67c23a";
            }
            isAlwaysShow = isAlwaysShow || false;
            strokeWeight = strokeWeight || 2;
            //通过行政区域名称获取行政区划
            let bdary = new BMap.Boundary();
            bdary.get(arg, function (rs) {
                let count = rs.boundaries.length;
                if (count === 0) {
                    return;
                }
                let ply = new BMap.Polygon(rs.boundaries[0],
                    { strokeColor: strokeColor, fillColor: fillColor, strokeWeight: strokeWeight });
                if (isAlwaysShow) {
                    ply.disableMassClear();
                }
                map.addOverlay(ply);
                // $("#container").mLoading("hide");
                marker_mouseover_flag = true;
            });
        }


        /**
 * 渲染标记和标签(重点方法)
 * @param map map地图对象
 * @param level 地图级别 1：省级 2：市级 3：区县级
 * @param data json数据
 * @param markerClickCallback 标记点击事件方法回调函数
 * @param center 中心坐标
 */
        function renderMarkersAndLabels(map, level, data, markerClickCallback, center, isClick) {
            //设置所有覆盖物均可清除
            setAllOverLayClear(map);
            //清除所有覆盖物
            removeOverlay(map);
            //点击时需要设置zoom级别与定位中心，并将current_zoom置为当前zoom
            if (level != LEVEL_PROVINCE && center) {
                if (level == LEVEL_CITY && isClick) {
                    map.setZoom(ZOOM_CITY_LEVEL);
                    current_zoom = ZOOM_CITY_LEVEL;
                    map.panTo(center);
                }
                else if (level == LEVEL_DISTRICT && isClick) {
                    map.setZoom(ZOOM_DISTRICT_LEVEL);
                    current_zoom = ZOOM_DISTRICT_LEVEL;
                    map.panTo(center);
                }
                else if (level == LEVEL_STREET && isClick) {
                    map.setZoom(ZOOM_STREET_LEVEL);
                    current_zoom = ZOOM_STREET_LEVEL;
                    map.panTo(center);
                }
            }
            //1,2,3级地图省略道路，4级地图展示道路
            if (level == LEVEL_STREET) {
                map.setMapStyle({});
            }
            else {
                map.setMapStyle({
                    styleJson: [
                        {
                            "featureType": "road",
                            "elementType": "all",
                            "stylers": {
                                "color": "#ffffff",
                                "visibility": "off"
                            }
                        }
                    ]
                });
            }
            for (let i = 0; i < data.length; i++) {
                let d = data[i];
                if (d.position) {
                    let x = d.position.split(",")[0];
                    let y = d.position.split(",")[1];
                    let TXPointArr = [new BMap.Point(y, x)];
                    //腾讯坐标系 转化为 百度坐标系
                    new BMap.Convertor().translate(TXPointArr, 3, 5, function (data) {
                        // data = {"lng":116.395645,"lat":39.929986}
                        data = {
                            points: [{ "lng": x, "lat": y }]
                        }
                        //标记显示文本
                        let labelContent;
                        //悬停信息框展示文本
                        let windowInfoContent;
                        //获取图片的序号 对应m0-m9.png
                        let img_num;
                        //图片的偏移位置大小
                        let size;
                        if (level == LEVEL_PROVINCE) {
                            windowInfoContent = "省份：" + d.provinceName + "<br>排名：" + d.rank + "<br>省销售额：" + d.sale + "<br>省门店数量：" + d.shopNum;
                            labelContent = d.shopNum;
                            //3.6保证35个省能分布到0-9的渐进图片里，每张图有两个级别，偏移位置根据图片大小而定的
                            img_num = Math.floor(d.rank / 3.6);
                            size = new BMap.Size(-10 - ((10 - img_num) * 0.6), -4 + (10 - img_num) * 0.2);
                        }
                        else if (level == LEVEL_CITY) {
                            windowInfoContent = "城市：" + d.cityName + "<br>排名：" + d.rank + "<br>市销售额：" + d.sale + "<br>市门店数量：" + d.shopNum;
                            labelContent = d.shopNum;
                            //2.2保证15个市能分布到0-7的渐进图片里，每张图有两个级别，偏移位置根据图片大小而定的
                            img_num = Math.floor(d.rank / 2.2);
                            size = new BMap.Size(-8 - ((10 - img_num) * 0.4), -4 + (10 - img_num) * 0.2);
                        }
                        else if (level == LEVEL_DISTRICT) {
                            windowInfoContent = "区县：" + d.districtName + "<br>排名：" + d.rank + "<br>区县销售额：" + d.sale + "<br>区县门店数量：" + d.shopNum;
                            labelContent = d.shopNum;
                            //2.2保证15个区县能分布到0-7的渐进图片里，每张图有两个级别，偏移位置根据图片大小而定的
                            img_num = Math.floor(d.rank / 2.2);
                            size = new BMap.Size(-6 - ((10 - img_num) * 0.4), -5 + (10 - img_num) * 0.2);
                        }
                        else if (level == LEVEL_STREET) {
                            windowInfoContent = "门店名称" + d.shopName + "<br>销售额：" + d.shopSale;
                            labelContent = d.shopName;
                        }
                        let marker;
                        let label;
                        //1,2,3级地图选用自定义marker，4级地图选用默认地图，且label也不一样
                        if (level != LEVEL_STREET) {
                            //创建自定义icon以及自定义icon大小
                            let myIcon = new BMap.Icon("../public/images/mendianfenbu/m" + img_num + ".png", new BMap.Size(50 + (10 - img_num) * 2, 50 + (10 - img_num) * 2));
                            marker = new BMap.Marker(new BMap.Point(x, y), { icon: myIcon });
                            // var marker = new BMap.Marker(new BMap.Point(116.404, 39.915)); // 创建点
                            let opts = {
                                position: data.points[0], // 指定文本标注所在的地理位置
                                offset: size
                            };
                            label = new BMap.Label(labelContent, opts);
                            label.setStyle({
                                color: "white",
                                fontSize: "16px",
                                height: "auto",
                                width: "30px",
                                textAlign: "center",
                                lineHeight: "6px",
                                fontFamily: "微软雅黑",
                                backgroundColor: 'none',
                                maxWidth: 'none',
                                border: 'none',
                                'font-weight': 'bold'
                            });
                        } else {
                            marker = new BMap.Marker(new BMap.Point(x, y));
                            let opts = {
                                position: data.points[0] // 指定文本标注所在的地理位置
                            };
                            label = new BMap.Label(labelContent, opts);
                            label.setStyle({
                                color: "black",
                                fontSize: "16px",
                                height: "auto",
                                lineHeight: "15px",
                                fontFamily: "微软雅黑",
                                backgroundColor: 'white',
                                maxWidth: 'none'
                            });
                        }

                        //禁止覆盖物在map.clearOverlays方法中被清除，与行政区划覆盖物区别
                        marker.disableMassClear();
                        label.disableMassClear();
                        //注册标记鼠标悬停事件
                        marker.addEventListener('mouseover', function (e) {
                            if (marker_mouseover_flag) {
                                marker_mouseover_flag = false;
                                removeOverlay(map);
                                setTimeout(function () {
                                    label.setContent(labelContent);
                                    let opts = {
                                        width: 50,     // 信息窗口宽度
                                        height: 100,     // 信息窗口高度
                                        offset: new BMap.Size(20, -30), //信息窗口偏移
                                    };
                                    // 创建信息窗口对象
                                    let infoWindow = new BMap.InfoWindow(windowInfoContent, opts);
                                    //开启信息窗口
                                    map.openInfoWindow(infoWindow, new BMap.Point(e.target.point.lng, e.target.point.lat));
                                    if (level == LEVEL_PROVINCE) {
                                        getBoundaryAndColor(map, d.provinceName);
                                    }
                                    else if (level == LEVEL_CITY) {
                                        getBoundaryAndColor(map, d.cityName);
                                    }
                                    else if (level == LEVEL_DISTRICT) {
                                        getBoundaryAndColor(map, d.districtName);
                                    }
                                    marker_mouseover_flag = true;
                                }, 300);
                            }
                        });

                        marker.addEventListener('mouseout', function () {
                            if (marker_mouseover_flag) {
                                removeOverlay(map);
                            }
                        });

                        map.addOverlay(marker);
                        map.addOverlay(label);
                        //初始化标记点击事件
                        if (markerClickCallback) {

                            markerClickCallback(map, marker, level);
                        }
                    });
                }
            }
        }
        /**
         * 获得所有省份信息并渲染省级级（一级）地图
         * @param map map地图对象
         */
        function renderLevelOneMap(map) {
            // permissionService.getProvincesList(params).then((data) => {
            //     renderMarkersAndLabels(map, LEVEL_PROVINCE, data, bindMarkersEvent);
            // });
            $.ajax({
                url: 'http://localhost:3000/api/area/province',
                type: "get",
                success: function (res) {
                    // console.log(res)
                    renderMarkersAndLabels(map, LEVEL_PROVINCE, res.body.contentList, bindMarkersEvent);
                }
            })

        }
        let cityData = [{ position: "116.395645,39.929986", rank: 5, sale: 5000, shopNum: 75, cityName: "北京" }];
        //逆向解析省级坐标并渲染该省的市级（二级）地图
        function renderLevelTwoMap(map, center, isClick) {
            center = center || map.getCenter();
            isClick = isClick || false;
            let geoc = new BMap.Geocoder();
            geoc.getLocation(center, function (rs) {
                //获得省份
                // params.province = rs.addressComponents.province;
                //判断是否属于直辖市
                if (municipality.indexOf(rs.addressComponents.province) === -1) {
                    //调用后台接口获取城市数据cityData
                    // permissionService.getCitiesByProvince(params).then((cityData) => {
                    //     renderMarkersAndLabels(map, LEVEL_CITY, cityData, bindMarkersEvent, center, isClick);
                    //     getBoundaryAndColor(map, params.province, true, "", 4);
                    // });
                    // renderMarkersAndLabels(map, LEVEL_CITY, cityData, bindMarkersEvent, center, isClick);
                    // // if (cityData.some(v => rs.addressComponents.province.indexOf(v.cityName) > -1)) {
                    // getBoundaryAndColor(map, rs.addressComponents.province, true, "", 4);

                    // }
                    $.ajax({
                        url: 'http://localhost:3000/api/area/city',
                        type: "get",
                        success: function (res) {
                            // console.log(res)
                            renderMarkersAndLabels(map, LEVEL_CITY, res.body.contentList, bindMarkersEvent, center, isClick);
                            getBoundaryAndColor(map, rs.addressComponents.province, true, "", 4);
                        }
                    })

                } else {

                    // params.city = rs.addressComponents.city;
                    //调用后台接口获取区县数据DistrictData
                    // permissionService.getDistrictsByCity(params).then((DistrictData) => {
                    //     renderMarkersAndLabels(map, LEVEL_DISTRICT, DistrictData, bindMarkersEvent, center, isClick);
                    //     getBoundaryAndColor(map, params.city, true, "", 4);
                    // });
                    renderMarkersAndLabels(map, LEVEL_CITY, cityData, bindMarkersEvent, center, isClick);
                    // // if (cityData.some(v => rs.addressComponents.city.indexOf(v.cityName) > -1)) {
                    getBoundaryAndColor(map, rs.addressComponents.city, true, "", 4);

                    // }
                }
            });
        }

        //逆向解析市级坐标并渲染该市的区县级（三级）地图
        function renderLevelThreeMap(map, center, isClick) {
            center = center || map.getCenter();
            isClick = isClick || false;
            let geoc = new BMap.Geocoder();
            geoc.getLocation(center, function (rs) {
                //获得市级
                // params.city = rs.addressComponents.city;
                //调用后台接口获取区县数据DistrictData
                // permissionService.getDistrictsByCity(params).then((DistrictData) => {
                //     renderMarkersAndLabels(map, LEVEL_DISTRICT, DistrictData, bindMarkersEvent, center, isClick);
                //     getBoundaryAndColor(map, params.city, true, "", 4);
                // });
                $.ajax({
                    url: 'http://localhost:3000/api/area/discript',
                    type: "get",
                    success: function (res) {
                        // console.log(res)
                        renderMarkersAndLabels(map, LEVEL_DISTRICT, res.body.contentList, bindMarkersEvent, center, isClick);
                        getBoundaryAndColor(map, rs.addressComponents.city, true, "", 4);
                    }
                })
                console.log(rs.addressComponents.city)
                // renderMarkersAndLabels(map, LEVEL_DISTRICT, [{ position: "116.395645,39.929986", rank: 5, sale: 5000, shopNum: 50, districtName: "中通区" }], bindMarkersEvent, center, isClick);
                // getBoundaryAndColor(map, rs.addressComponents.city, true, "", 4);
            });
        }

        //逆向解析区县级坐标并渲染该区县的乡镇街道级（四级）地图
        function renderLevelFourMap(map, center, isClick) {
            center = center || map.getCenter();
            isClick = isClick || false;
            let geoc = new BMap.Geocoder();
            geoc.getLocation(center, function (rs) {
                //获得区县
                // params.district = rs.addressComponents.district;
                //调用后台接口获取乡镇街道数据streetData
                // permissionService.getStreetsByDistrict(params).then((streetData) => {
                //     renderMarkersAndLabels(map, LEVEL_STREET, streetData, null, center, isClick);
                //     getBoundaryAndColor(map, params.district, true, "", 4);
                // });
                // renderMarkersAndLabels(map, LEVEL_STREET, [{ position: "116.395645,39.929986", shopName: "大中华区总公司", shopSale: 5000, shopNum: 0, provinceName: "北京" }], bindMarkersEvent, center, isClick);
                // getBoundaryAndColor(map, rs.addressComponents.district, true, "", 4);

                $.ajax({
                    url: 'http://localhost:3000/api/area/street',
                    type: "get",
                    success: function (res) {
                        renderMarkersAndLabels(map, LEVEL_STREET, res.body.contentList, bindMarkersEvent, center, isClick);
                        getBoundaryAndColor(map, rs.addressComponents.district, true, "", 4);
                    }
                })
            });
        }
        /**
             * 设置区县级标记点击事件
             * @param marker 标记对象
             * @param markerLevel 标记所在的地图级别
             */
        function bindMarkersEvent(map, marker, markerLevel) {
            marker.addEventListener('click', function (e) {
                let _this = $(this);
                let center = new BMap.Point(e.target.point.lng, e.target.point.lat) //new BMap.Point(_this[0].IA.lng, _this[0].IA.lat);
                if (markerLevel == LEVEL_PROVINCE) {
                    renderLevelTwoMap(map, center, true);
                }
                else if (markerLevel == LEVEL_CITY) {
                    renderLevelThreeMap(map, center, true);
                }
                else if (markerLevel == LEVEL_DISTRICT) {
                    renderLevelFourMap(map, center, true);
                } else if (markerLevel == LEVEL_STREET) {
                    let geoc = new BMap.Geocoder();
                    geoc.getLocation(center, function (rs) {
                        map.setZoom(17);
                        current_zoom = 17;
                        map.panTo(center);
                    })
                }
            });
        }


        function bindProvinceAndCitySwitchListener(map) {
            let mouseFlag = true;
            map.addEventListener('dragend', function () {
                if (mouseFlag) {
                    mouseFlag = false;
                    setTimeout(function () {
                        let zoom = map.getZoom();
                        //市级
                        if (zoom >= ZOOM_CITY_LEVEL && zoom < ZOOM_DISTRICT_LEVEL) {
                            // $("#container").mLoading("show");
                            renderLevelTwoMap(map);
                        }
                        //区县级
                        else if (zoom >= ZOOM_DISTRICT_LEVEL && zoom < ZOOM_STREET_LEVEL) {
                            // $("#container").mLoading("show");
                            renderLevelThreeMap(map);
                        }
                        mouseFlag = true;
                    }, 200);
                }
            });
        }
        /**
         * zoom切换监听事件
         * @param map map地图对象
         */
        function bindZoomSwithListener(map) {
            let flag = true;
            const scrollFunc = (e) => {
                if (flag) {
                    flag = false;
                    setTimeout(function () {
                        //是否放大
                        let isUp = false;
                        //IE/Opera/Chrome 的滚轮判断为wheelDelta = +- 120 ，firefox的滚轮判断为detail = +- 3
                        //+120为放大，-120为缩小 -3为放大，+3为缩小
                        if (e.wheelDelta) {
                            if (e.wheelDelta == 120) {
                                isUp = true;
                                map.zoomIn();
                            }
                            else {
                                map.zoomOut();
                            }
                        } else if (e.detail) {//Firefox
                            if (e.detail == -3) {
                                isUp = true;
                                map.zoomIn();
                            }
                            else {
                                map.zoomOut();
                            }
                        }
                        //从一级跳二级
                        if (isUp && current_zoom == ZOOM_CITY_LEVEL - 1) {
                            renderLevelTwoMap(map);
                        }
                        //从二级跳一级
                        else if (!isUp && current_zoom == ZOOM_CITY_LEVEL) {
                            renderLevelOneMap(map);
                        }
                        //从二级跳三级
                        else if (isUp && current_zoom == ZOOM_DISTRICT_LEVEL - 1) {
                            renderLevelThreeMap(map);
                        }
                        //从三级跳二级
                        else if (!isUp && current_zoom == ZOOM_DISTRICT_LEVEL) {
                            renderLevelTwoMap(map);
                        }
                        //从三级跳四级
                        else if (isUp && current_zoom == ZOOM_STREET_LEVEL - 1) {
                            renderLevelFourMap(map);
                        }
                        //从四级跳三级
                        else if (!isUp && current_zoom == ZOOM_STREET_LEVEL) {
                            renderLevelThreeMap(map);
                        }
                        else {
                            map.removeOverlay();
                        }
                        if (isUp) {
                            current_zoom = map.getZoom();
                        } else {
                            current_zoom = map.getZoom();
                        }
                        flag = true;
                    }, 300);
                }
            };
            /*注册事件*/
            let userAgent = navigator.userAgent;
            let isFF = userAgent.indexOf("Firefox") > -1; //判断是否Firefox浏览器
            if (isFF) {
                document.addEventListener('DOMMouseScroll', scrollFunc, false);
            } else {
                window.onmousewheel = document.onmousewheel = scrollFunc;//IE/Opera/Chrome
            }
        }


        var map = new BMap.Map("container");
        var point = new BMap.Point(109.404, 35.915);
        map.centerAndZoom(point, 11);
        map.setCurrentCity("北京");
        map.setMapStyle({ style: 'googlelite' });
        map.enableScrollWheelZoom(true);
        map.centerAndZoom(point, current_zoom); //创建中心点与zoom缩放级别
        map.setMinZoom(ZOOM_PROVINCE_LEVEL);  //最小zoom缩放级别
        map.setMaxZoom(ZOOM_MAX_LEVEL); //最大zoom缩放级别
        map.disableScrollWheelZoom();     //关闭鼠标滚轮缩放，自定义滚轮事件，调用map.zoomIn()与map.zoomOut()来控制缩放，避免直接使用而导致一次放大或缩小几级导致数据加载问题
        bindZoomSwithListener(map); //初始化zoom缩放监听事件
        bindProvinceAndCitySwitchListener(map); //初始化map拖动监听事件
        renderLevelOneMap(map);

    </script>
</body>

</html>
```

# express模拟的数据
```js
var express = require("express");
var router = express.Router();
var utils = require("../public/javascripts/util");

/* GET home page. */
router.get("/province", function(req, res, next) {
    res.json({
        body: {
            pageIndex: 1,
            totalItem: 4,
            totalPages: 1,
            pageSize: 10,
            contentList: [
                {
                    position: "116.395645,39.929986",
                    rank: utils.getRandomNum(10),
                    sale: utils.getRandomNum(10000),
                    shopNum: utils.getRandomNum(100),
                    provinceName: "北京"
                },
                {
                    position: "117.282699,31.866942",
                    rank: utils.getRandomNum(10),
                    sale: utils.getRandomNum(10000),
                    shopNum: utils.getRandomNum(100),
                    provinceName: "安徽"
                },
                {
                    position: "85.614899,42.127001",
                    rank: utils.getRandomNum(10),
                    sale: utils.getRandomNum(10000),
                    shopNum: utils.getRandomNum(100),
                    provinceName: "新疆"
                },
                {
                    position: "120.219375,30.259244",
                    rank: utils.getRandomNum(10),
                    sale: utils.getRandomNum(10000),
                    shopNum: utils.getRandomNum(100),
                    provinceName: "浙江"
                },
                {
                    position: "121.487899,31.249162",
                    rank: utils.getRandomNum(10),
                    sale: utils.getRandomNum(10000),
                    shopNum: utils.getRandomNum(100),
                    provinceName: "上海"
                },
                {
                    position: "110.330802,20.022071",
                    rank: utils.getRandomNum(10),
                    sale: utils.getRandomNum(10000),
                    shopNum: utils.getRandomNum(100),
                    provinceName: "海南"
                },
                {
                    position: "108.924274,23.552255",
                    rank: utils.getRandomNum(10),
                    sale: utils.getRandomNum(10000),
                    shopNum: utils.getRandomNum(100),
                    provinceName: "广西"
                }
            ]
        },
        msgCode: "ACTIVE",
        msgContent: "正常",
        status: 200
    });
});

router.get("/city", function(req, res, next) {
    res.json({
        body: {
            pageIndex: 1,
            totalItem: 4,
            totalPages: 1,
            pageSize: 10,
            contentList: [
                {
                    position: "115.820932,32.901211",
                    rank: utils.getRandomNum(10),
                    sale: utils.getRandomNum(10000),
                    shopNum: utils.getRandomNum(100),
                    cityName: "阜阳"
                },
                {
                    position: "117.282699,31.866942",
                    rank: utils.getRandomNum(10),
                    sale: utils.getRandomNum(10000),
                    shopNum: utils.getRandomNum(100),
                    cityName: "合肥"
                },
                {
                    position: "116.791447,33.960023",
                    rank: utils.getRandomNum(10),
                    sale: utils.getRandomNum(10000),
                    shopNum: utils.getRandomNum(100),
                    cityName: "淮北"
                },
                {
                    position: "116.988692,33.636772",
                    rank: utils.getRandomNum(10),
                    sale: utils.getRandomNum(10000),
                    shopNum: utils.getRandomNum(100),
                    cityName: "宿州"
                },
                {
                    position: "117.018639,32.642812",
                    rank: utils.getRandomNum(10),
                    sale: utils.getRandomNum(10000),
                    shopNum: utils.getRandomNum(100),
                    cityName: "淮南 "
                }
            ]
        },
        msgCode: "ACTIVE",
        msgContent: "正常",
        status: 200
    });
});

router.get("/discript", function(req, res, next) {
    res.json({
        body: {
            pageIndex: 1,
            totalItem: 4,
            totalPages: 1,
            pageSize: 10,
            contentList: [
                {
                    position: "115.820932,32.901211",
                    rank: utils.getRandomNum(10),
                    sale: utils.getRandomNum(10000),
                    shopNum: utils.getRandomNum(100),
                    districtName: "阜阳"
                },
                {
                    position: "115.398643,33.226193",
                    rank: utils.getRandomNum(10),
                    sale: utils.getRandomNum(10000),
                    shopNum: utils.getRandomNum(100),
                    districtName: "界首"
                },
                {
                    position: "116.265314,32.66246",
                    rank: utils.getRandomNum(10),
                    sale: utils.getRandomNum(10000),
                    shopNum: utils.getRandomNum(100),
                    districtName: "颍上"
                },
                {
                    position: "115.248461,32.909769",
                    rank: utils.getRandomNum(10),
                    sale: utils.getRandomNum(10000),
                    shopNum: utils.getRandomNum(100),
                    districtName: "临泉"
                },
                {
                    position: "115.654099,32.655881",
                    rank: utils.getRandomNum(10),
                    sale: utils.getRandomNum(10000),
                    shopNum: utils.getRandomNum(100),
                    districtName: "阜南 "
                }
            ]
        },
        msgCode: "ACTIVE",
        msgContent: "正常",
        status: 200
    });
});

router.get("/street", function(req, res, next) {
    res.json({
        body: {
            pageIndex: 1,
            totalItem: 4,
            totalPages: 1,
            pageSize: 10,
            contentList: [
                {
                    position: "115.362005,33.27139",
                    rank: utils.getRandomNum(10),
                    shopSale: utils.getRandomNum(10000),
                    shopNum: utils.getRandomNum(100),
                    shopName: "界首市第一中学 "
                }
            ]
        },
        msgCode: "ACTIVE",
        msgContent: "正常",
        status: 200
    });
});
module.exports = router;

```
