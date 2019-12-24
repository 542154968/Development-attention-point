```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <script src="https://cesium.com/downloads/cesiumjs/releases/1.63.1/Build/Cesium/Cesium.js"></script>
    <link
      href="https://cesium.com/downloads/cesiumjs/releases/1.63.1/Build/Cesium/Widgets/widgets.css"
      rel="stylesheet"
    />
    <script src="tdt.js"></script>
    <link href="drawHelp.css" />
    <style>
      ul {
        position: absolute;
        z-index: 9;
      }
      .hidden {
        display: none;
      }
    </style>
  </head>
  <body>
    <div id="cesiumContainer" style="width: 700px; height:400px">
      <ul class="hidden">
        <li><button class="add">添加地块</button></li>
      </ul>
    </div>
    <script src="drawHelp.js"></script>
    <script>
      var tian1 = new TDTWMTSImageProvider(
        "https://t{l}.tianditu.gov.cn/DataServer?T=img_w&x={x}&y={y}&l={z}&tk=494d3e5ced20ed6165e366f82046f76a",
        // "http://t{l}.tianditu.gov.cn/DataServer?T=cva_w&tk=494d3e5ced20ed6165e366f82046f76a&x={x}&y={y}&l={z}",
        //http://t0.tianditu.gov.cn/DataServer?T=cva_w&tk=494d3e5ced20ed6165e366f82046f76a&x=27055&y=13259&l=15
        // http://t0.tianditu.gov.cn/img_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=img&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&tk=494d3e5ced20ed6165e366f82046f76a&TILECOL=27061&TILEROW=13259&TILEMATRIX=15
        false,
        1,
        18
      );
      var tian2 = new TDTWMTSImageProvider(
        "https://t{l}.tianditu.gov.cn/DataServer?T=cva_w&x={x}&y={y}&l={z}&tk=494d3e5ced20ed6165e366f82046f76a",
        false,
        1,
        18
      );

      var tian3 = new TDTWMTSImageProvider(
        "http://t{l}.tianditu.gov.cn/img_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=img&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&tk=494d3e5ced20ed6165e366f82046f76a&TILECOL={x}&TILEROW={y}&TILEMATRIX={z}",
        false,
        1,
        18
      );

      var img_tdt_sl = new Cesium.ProviderViewModel({
        name: "天地图矢量",
        tooltip: "天地图矢量",
        iconUrl: "./imgs/localtion.png",
        creationFunction: function() {
          return tian1;
        }
      });
      var img_tdt_yx = new Cesium.ProviderViewModel({
        name: "天地图影像",
        tooltip: "天地图影像",
        iconUrl: "./imgs/localtion.png",
        creationFunction: function() {
          return tian2;
        }
      });

      var img_tdt_3 = new Cesium.ProviderViewModel({
        name: "天地图影像",
        tooltip: "天地图影像",
        iconUrl: "./imgs/localtion.png",
        creationFunction: function() {
          return tian3;
        }
      });

      const arr = [
        new Cesium.WebMapTileServiceImageryProvider({
          url:
            "http://t0.tianditu.com/img_w/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=img&tileMatrixSet=w&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}&style=default&format=tiles&tk=ebf64362215c081f8317203220f133eb",
          layer: "tdtBasicLayer",
          style: "default",
          format: "image/jpeg",
          tileMatrixSetID: "GoogleMapsCompatible",
          show: false
        })
      ];
      var viewer = new Cesium.Viewer("cesiumContainer", {
        animation: false, //是否创建动画小器件，左下角仪表
        timeline: false, //是否显示时间轴
        sceneModePicker: false, //是否显示3D/2D选择器
        baseLayerPicker: true, //是否显示图层选择器
        geocoder: false, //是否显示geocoder小器件，右上角查询按钮
        // imageryProviderViewModels: [img_tdt_sl, img_tdt_yx, img_tdt_3], //可供BaseLayerPicker选择的图像图层ProviderViewModel数组
        // selectedImageryProviderViewModel: img_tdt_sl, //当前地形图层的显示模型，仅baseLayerPicker设为true有意义

        // imageryProviderViewModels: arr,
        // selectedImageryProviderViewModel: arr[0],
        scene3DOnly: true, //如果设置为true，则所有几何图形以3D模式绘制以节约GPU资源
        navigationHelpButton: false, //是否显示右上角的帮助按钮
        homeButton: false, //是否显示Home按钮
        infoBox: true, //是否显示信息框
        showRenderLoopErrors: false //如果设为true，将在一个HTML面板中显示错误信息

        // animation: false, //是否显示动画控件
        // baseLayerPicker: false, //是否显示图层选择控件
        // geocoder: true, //是否显示地名查找控件
        // timeline: false, //是否显示时间线控件
        // sceneModePicker: true, //是否显示投影方式控件
        // navigationHelpButton: false, //是否显示帮助信息控件
        // infoBox: true, //是否显示点击要素之后显示的信息
        // imageryProviderViewModels: arr,
        // selectedImageryProviderViewModel: arr[0]
        // imageryProvider: new Cesium.WebMapTileServiceImageryProvider({
        //   url:
        //     "http://t0.tianditu.com/img_w/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=img&tileMatrixSet=w&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}&style=default&format=tiles&tk=ebf64362215c081f8317203220f133eb",
        //   layer: "tdtBasicLayer",
        //   style: "default",
        //   format: "image/jpeg",
        //   tileMatrixSetID: "GoogleMapsCompatible",
        //   show: false
        // })
      });

      //去除版权信息
      viewer._cesiumWidget._creditContainer.style.display = "none";

      //加载影像底图

      var layer = new Cesium.WebMapTileServiceImageryProvider({
        url:
          "http://t0.tianditu.gov.cn/img_w/wmts?tk=ebf64362215c081f8317203220f133eb",

        layer: "img",

        style: "default",

        tileMatrixSetID: "w",

        format: "tiles",

        maximumLevel: 18
      });

      viewer.imageryLayers.addImageryProvider(layer);

      [
        {
          id: 6,
          label: "天地街道",
          className: "vecType",
          type: 2,
          proxyUrl: "",
          Url:
            "http://t{l}.tianditu.cn/vec_c/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=vec&STYLE=default&TILEMATRIXSET=c&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&FORMAT=tiles",
          layer: "tdtVecBasicLayer",
          style: "default",
          format: "image/jpeg",
          tileMatrixSetID: "tdtMap"
        },
        {
          id: 7,
          label: "天地影像",
          className: "imgType",
          type: 2,
          proxyUrl: "",
          Url:
            "http://t{l}.tianditu.cn/img_c/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=img&STYLE=default&TILEMATRIXSET=c&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&FORMAT=tiles",
          layer: "tdtImgBasicLayer",
          style: "default",
          format: "image/jpeg",
          tileMatrixSetID: "tdtMap"
        }
      ];

      //加载影像注记

      var layer1 = new Cesium.WebMapTileServiceImageryProvider({
        url:
          "http://t0.tianditu.gov.cn/cia_w/wmts?tk=ebf64362215c081f8317203220f133eb",

        layer: "cia",

        style: "default",

        tileMatrixSetID: "w",

        format: "tiles",

        maximumLevel: 18
      });

      viewer.imageryLayers.addImageryProvider(layer1);

      viewer.camera.flyTo({
        destination: Cesium.Cartesian3.fromDegrees(117.240752, 31.819288, 5000)
      });

      viewer.terrainProvider = Cesium.createWorldTerrain();
      viewer.scene.screenSpaceCameraController.minimumZoomDistance = 100; //相机的高度的最小值
      viewer.scene.screenSpaceCameraController.maximumZoomDistance = 22000000; //相机高度的最大值
      // viewer.scene.screenSpaceCameraController._minimumZoomRate = 30000; // 设置相机缩小时的速率
      // viewer.scene.screenSpaceCameraController._maximumZoomRate = 5906376272000; //设置相机放大时的速率

      var entities = viewer.entities;

      entities.add({
        name: "polygon",
        htData: {
          id: 666,
          type: "polygon"
        },
        position: Cesium.Cartesian3.fromDegrees(117.240752, 31.819288),
        // polygon.hierarchy.getValue 获取当前点
        /*
          temp1.hierarchy.setValue(new Cesium.PolygonHierarchy(
            Cesium.Cartesian3.fromDegreesArray([
              117.240752,
              31.819288,
              117.250752,
              31.819288,
              117.250752,
              31.829288,
            ])
          ))
        */
        polygon: {
          hierarchy: new Cesium.PolygonHierarchy(
            Cesium.Cartesian3.fromDegreesArray([
              117.240752,
              31.819288,
              117.250752,
              31.819288,
              117.250752,
              31.829288,
              117.240752,
              31.829288
            ])
          ),
          // outline: true,
          // outlineColor: Cesium.Color.BLACK,
          // outlineWidth: 4,
          // material: Cesium.Color.WHITE.withAlpha(0.5)
          height: 0,
          material: Cesium.Color.RED.withAlpha(0.5),
          outline: true,
          outlineColor: Cesium.Color.BLACK
        },
        label: {
          //文字标签
          text: "Citizens Bank Park",
          font: "14pt monospace",
          style: Cesium.LabelStyle.FILL_AND_OUTLINE,
          outlineWidth: 2,
          eyeOffset: new Cesium.Cartesian3(0.0, 600.0, 0.0),
          verticalOrigin: Cesium.VerticalOrigin.CENTER, //垂直方向以底部来计算标签的位置
          pixelOffset: new Cesium.Cartesian2(0, 0) //偏移量
        }
        // id.label.text.setValue()
      });

      /*



      */

      function InitPolygon(viewer, lnglat) {
        this.startLngLat = lnglat;
        this.viewer = viewer;
        this.points = [];
        this.pointGroup = null;
        this.htData = {};
        this.polygon = null;
        this.handle = null;
        this.isMoving = false;
        this.pointMoved = false;
        this.activePointIndex = null;
        this._init();
      }
      InitPolygon.prototype = {
        constructor: InitPolygon,
        _init: function() {
          this._initPointGroup();
          this._formatPoints();
          this._createPoints();

          this._createPolygon();
          this._initHandler();
          this._addEventListener();
        },
        _initPointGroup: function() {
          this.pointGroup = this.viewer.scene.primitives.add(
            new Cesium.PointPrimitiveCollection()
          );
        },
        _initHandler: function() {
          this.handler = new Cesium.ScreenSpaceEventHandler(
            this.viewer.scene.canvas
          );
        },
        _formatPoints: function() {
          var lnglat = this.startLngLat;
          this.points = Cesium.Cartesian3.fromDegreesArray([
            lnglat.lng,
            lnglat.lat,
            lnglat.lng + 0.01,
            lnglat.lat,
            lnglat.lng,
            lnglat.lat + 0.01
          ]);
        },
        _deletePoints: function() {
          this.pointGroup.removeAll();
        },
        // 创建点
        _createPoint: function(position, index) {
          this.pointGroup.add({
            name: "point",
            position: position,
            userData: { index: index },
            point: {
              //点
              pixelSize: 10,
              color: Cesium.Color.WHITE,
              outlineColor: Cesium.Color.WHITE,
              heightReference: Cesium.HeightReference.CLAMP_TO_GROUND
            }
          });
        },
        // 创建多个点
        _createPoints: function() {
          var that = this;
          this._deletePoints();
          setTimeout(function() {
            that.points.forEach(function(v, k) {
              that._createPoint(v, k);
            });
          }, 20);
        },
        // 创建面
        _createPolygon: function() {
          var that = this;
          this.polygon = entities.add({
            name: "polygon",
            userData: that.userData,
            position: new Cesium.CallbackProperty(function(time, result) {
              var firstPoint = that.points[0];
              var lastPoint = that.points[that.points.length - 1];
              return new Cesium.Cartesian3(
                (firstPoint.x + lastPoint.x) / 2,
                (firstPoint.y + lastPoint.y) / 2,
                (firstPoint.z + lastPoint.z) / 2
              );
            }, false), //that.points[0], // Cesium.Cartesian3.fromDegrees(lnglat.lng, lnglat.lat),
            polygon: {
              hierarchy: new Cesium.CallbackProperty(function(time, result) {
                return new Cesium.PolygonHierarchy(that.points);
              }, false),

              // perPositionHeight: true,
              material: Cesium.Color.RED.withAlpha(0.5),
              outline: true,
              outlineColor: Cesium.Color.BLACK
              // heightReference: -1
            },
            label: {
              //文字标签
              showBackground: true,
              text: "test",
              font: "14pt monospace",
              // horizontalOrigin: Cesium.HorizontalOrigin.LEFT,
              // verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
              pixelOffset: new Cesium.Cartesian2(50, 15)
              // style: Cesium.LabelStyle.FILL_AND_OUTLINE
            }
          });
        },
        _addEventListener: function() {
          this.handler.setInputAction(
            this._onLeftMouseUp.bind(this),
            Cesium.ScreenSpaceEventType.LEFT_UP
          );
          document.addEventListener("mouseup", this._onLeftMouseUp.bind(this));

          this.handler.setInputAction(
            this._onLeftMouseDown.bind(this),
            Cesium.ScreenSpaceEventType.LEFT_DOWN
          );

          this.handler.setInputAction(
            this._onMouseMove.bind(this),
            Cesium.ScreenSpaceEventType.MOUSE_MOVE
          );
        },
        _onLeftMouseDown: function(event) {
          position = event.position;
          var pickedFeature = viewer.scene.pick(position);
          // console.log(pickedFeature);
          if (
            pickedFeature &&
            pickedFeature.primitive instanceof Cesium.PointPrimitive
          ) {
            // 禁止旋转
            this.viewer.scene.screenSpaceCameraController.enableRotate = false;

            this.isMoving = true;
            this.activePointIndex = pickedFeature.primitive._index;
            // console.log(this.pointGroup.get(pickedFeature.primitive._index));
            // this.activePoint = pickedFeature.id;
          }
        },
        _onMouseMove: function(event) {
          if (this.isMoving) {
            position = event.endPosition;
            var worldPosition = this.viewer.scene.globe.pick(
              this.viewer.camera.getPickRay(position),
              this.viewer.scene
            );
            var index = this.activePointIndex;
            var curPosition = this.points[index];
            if (
              Math.abs(curPosition.x - worldPosition.x) > 0.1 ||
              Math.abs(curPosition.y - worldPosition.y) > 0.1
            ) {
              this.pointMoved = true;
              this.pointGroup.get(index).position = worldPosition;
              this.points.splice(index, 1, worldPosition);
              // this._updatePolygon(index, worldPosition);
            } else {
              this.pointMoved = false;
            }
          }
        },
        _onLeftMouseUp: function() {
          if (this.isMoving) {
            viewer.scene.screenSpaceCameraController.enableRotate === false &&
              (viewer.scene.screenSpaceCameraController.enableRotate = true);
            this.isMoving = false;
            this.pointMoved && this._addPointsWithActivePoint();
          }
        },
        // _updatePolygon: function() {
        //   this.polygon.polygon.hierarchy.setValue(
        //     new Cesium.PolygonHierarchy(this.points)
        //   );
        // },
        _addPointsWithActivePoint() {
          var index = this.activePointIndex;
          var point = this.points[index];
          // 0 1 2
          // 3
          var prevPoint = this._isFirstPoint(index)
            ? this.points[this.points.length - 1]
            : this.points[index - 1];
          // 4
          var nextPoint = this._isLastPoint(index)
            ? this.points[0]
            : this.points[index + 1];
          // 0 3 1 4 2
          var prevAddPoint = new Cesium.Cartesian3(
            (point.x + prevPoint.x) / 2,
            (point.y + prevPoint.y) / 2,
            (point.z + prevPoint.z) / 2
          );
          var nextAddPoint = new Cesium.Cartesian3(
            (point.x + nextPoint.x) / 2,
            (point.y + nextPoint.y) / 2,
            (point.z + nextPoint.z) / 2
          );
          this.points.splice(index, 0, prevAddPoint);
          this.points.splice(index + 2, 0, nextAddPoint);
          this._createPoints();
        },
        _isLastPoint(index) {
          return index === this.points.length - 1;
        },
        _isFirstPoint(index) {
          return index === 0;
        }
      };

      /*

      */
      var handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);

      var $ul = document.querySelector("ul");
      var $add = document.querySelector("ul button.add");

      var isEdit = false;
      var curPolygon = null;
      var position = null;
      $add.onclick = function() {
        $ul.classList.add("hidden");
        document.body.style.cursor = "move";
        isEdit = true;
        new InitPolygon(viewer, xy2LngLat(position));
      };

      // function createPoint(lnglat) {
      //   viewer.entities.add({
      //     name: "point",
      //     position: lnglat,
      //     point: {
      //       //点
      //       pixelSize: 5,
      //       color: Cesium.Color.GREEN,
      //       outlineColor: Cesium.Color.WHITE
      //       // outlineWidth: 2
      //     }
      //   });
      // }

      // function createPolygon(lnglat) {
      //   var vectial = Cesium.Cartesian3.fromDegreesArray([
      //     lnglat.lng,
      //     lnglat.lat,
      //     lnglat.lng + 0.01,
      //     lnglat.lat,
      //     lnglat.lng,
      //     lnglat.lat + 0.01
      //   ]);
      //   var polygon = entities.add({
      //     name: "polygon",
      //     htData: {
      //       id: 6676,
      //       type: "polygon"
      //     },
      //     position: Cesium.Cartesian3.fromDegrees(lnglat.lng, lnglat.lat),

      //     polygon: {
      //       hierarchy: new Cesium.PolygonHierarchy(vectial),
      //       height: 0,
      //       material: Cesium.Color.RED.withAlpha(0.5),
      //       outline: true,
      //       outlineColor: Cesium.Color.BLACK
      //     },
      //     label: {
      //       //文字标签
      //       text: "test",
      //       font: "14pt monospace",
      //       style: Cesium.LabelStyle.FILL_AND_OUTLINE,
      //       outlineWidth: 2,
      //       verticalOrigin: Cesium.VerticalOrigin.CENTER, //垂直方向以底部来计算标签的位置
      //       pixelOffset: new Cesium.Cartesian2(0, 0) //偏移量
      //     }
      //   });

      //   curPolygon = polygon;

      //   vectial.forEach((v, k) => {
      //     createPoint(v);
      //   });
      // }

      // function updatePolygon(lnglat) {
      //   if (curPolygon) {
      //     const arr = curPolygon.polygon.hierarchy.getValue().positions;

      //     curPolygon.polygon.hierarchy.setValue(
      //       new Cesium.PolygonHierarchy(
      //         arr.concat(Cesium.Cartesian3.fromDegrees(lnglat.lng, lnglat.lat))
      //       )
      //     );

      //     console.log(curPolygon.polygon.hierarchy.getValue());
      //     // curPolygon.polygon.hierarchy.positions = arr.concat([
      //     //   Cesium.Cartesian3.fromDegrees(lnglat.lng, lnglat.lat)
      //     // ]);

      //     // curPolygon.polygon.hierarchy.setValue(
      //     //   arr.concat([Cesium.Cartesian3.fromDegrees(lnglat.lng, lnglat.lat)])
      //     // );
      //   }
      // }

      handler.setInputAction(function(click) {
        var pickedFeature = viewer.scene.pick(click.position);
        position = click.position;
        // console.log("左键单击事件：", click, pickedFeature);
        console.log(position);
        if (isEdit) {
          return;
        }
        // if (!pickedFeature) {
        //   createPolygon(lnglat);
        // } else if (pickedFeature) {
        // }
      }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

      // 点击

      var isMoving = false;
      // 阻止监听moving
      // handler.setInputAction(function(event) {
      //   if (isMoving) {
      //     viewer.scene.screenSpaceCameraController.enableRotate === false &&
      //       (viewer.scene.screenSpaceCameraController.enableRotate = true);

      //     isMoving = false;
      //   }
      // }, Cesium.ScreenSpaceEventType.LEFT_UP);
      // document.addEventListener("mouseup", function() {
      //   viewer.scene.screenSpaceCameraController.enableRotate === false &&
      //     (viewer.scene.screenSpaceCameraController.enableRotate = true);

      //   isMoving = false;
      // });

      // 点击拖拽点
      // var curPoint = null;
      // handler.setInputAction(function(event) {
      //   position = event.position;

      //   var pickedFeature = viewer.scene.pick(position);
      //   console.log("左键mousedown事件：", event, pickedFeature);
      //   // 点击mousedown 关闭

      //   if (pickedFeature && pickedFeature.id._name === "point") {
      //     // 禁止旋转
      //     viewer.scene.screenSpaceCameraController.enableRotate = false;

      //     isMoving = true;
      //     curPoint = pickedFeature.id;
      //   }
      // }, Cesium.ScreenSpaceEventType.LEFT_DOWN);

      // // 当移动的时候

      // handler.setInputAction(function(click) {
      //   if (isMoving) {
      //     position = click.endPosition;
      //     const worldPosition = viewer.scene.globe.pick(
      //       viewer.camera.getPickRay(position),
      //       viewer.scene
      //     );
      //     console.log(worldPosition);
      //     curPoint.position.setValue(worldPosition);
      //   }
      // }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

      handler.setInputAction(function(click) {
        position = click.position;
        var pickedFeature = viewer.scene.pick(click.position);
        // console.log("右键键单击事件：", click, pickedFeature);
        if (pickedFeature) {
        } else {
          $ul.classList.remove("hidden");
        }
      }, Cesium.ScreenSpaceEventType.RIGHT_DOWN);

      // xy坐标转
      function xy2LngLat(position) {
        const worldPosition = viewer.scene.globe.pick(
          viewer.camera.getPickRay(position),
          viewer.scene
        );
        const cartographic = viewer.scene.globe.ellipsoid.cartesianToCartographic(
          worldPosition
        );
        return {
          lng: Cesium.Math.toDegrees(cartographic.longitude),
          lat: Cesium.Math.toDegrees(cartographic.latitude),
          alt: cartographic.height
        };
      }

      // for (i = 0; i < 5; ++i) {
      //   height = 100000.0 + 200000.0 * i;
      //   entities.add({
      //     position: Cesium.Cartesian3.fromDegrees(-106.0, 45.0, height),
      // 正方体
      //     box: {
      //       dimensions: new Cesium.Cartesian3(90000.0, 90000.0, 90000.0),
      //       outline: true,
      //       outlineColor: Cesium.Color.WHITE,
      //       outlineWidth: 2,
      //       material: Cesium.Color.fromRandom({ alpha: 0.5 })
      //     }
      //   });

      //   entities.add({
      //     position: Cesium.Cartesian3.fromDegrees(-102.0, 45.0, height),
      // 圆球
      //     ellipsoid: {
      //       radii: new Cesium.Cartesian3(45000.0, 45000.0, 90000.0),
      //       outline: true,
      //       outlineColor: Cesium.Color.WHITE,
      //       outlineWidth: 2,
      //       material: Cesium.Color.fromRandom({ alpha: 0.5 })
      //     }
      //   });

      //   entities.add({
      //     position: Cesium.Cartesian3.fromDegrees(-98.0, 45.0, height),
      //     ellipsoid: {
      //       radii: new Cesium.Cartesian3(67500.0, 67500.0, 67500.0),
      //       outline: true,
      //       outlineColor: Cesium.Color.WHITE,
      //       outlineWidth: 2,
      //       material: Cesium.Color.fromRandom({ alpha: 0.5 })
      //     }
      //   });
      // }

      // for (i = 0; i < 5; ++i) {
      //   height = 200000.0 * i;

      //   // entities.add({
      //   //   position: Cesium.Cartesian3.fromDegrees(-65.0, 35.0),
      //   //   ellipse: {
      //   //     semiMinorAxis: 200000.0,
      //   //     semiMajorAxis: 200000.0,
      //   //     height: height,
      //   //     material: Cesium.Color.fromRandom({ alpha: 0.5 })
      //   //   }
      //   // });

      //   // 矩形
      //   entities.add({
      //     rectangle: {
      //       coordinates: Cesium.Rectangle.fromDegrees(-67.0, 27.0, -63.0, 32.0),
      //       height: height,
      //       material: Cesium.Color.fromRandom({ alpha: 0.5 })
      //     }
      //   });
      // }

      // var citizensBankPark = viewer.entities.add({
      //   name: "Citizens Bank Park",
      //   position: Cesium.Cartesian3.fromDegrees(-75.166493, 39.9060534),
      //   point: {
      //     //点
      //     pixelSize: 5,
      //     color: Cesium.Color.RED,
      //     outlineColor: Cesium.Color.WHITE,
      //     outlineWidth: 2
      //   },
      //   label: {
      //     //文字标签
      //     text: "Citizens Bank Park",
      //     font: "14pt monospace",
      //     style: Cesium.LabelStyle.FILL_AND_OUTLINE,
      //     outlineWidth: 2,
      //     verticalOrigin: Cesium.VerticalOrigin.BOTTOM, //垂直方向以底部来计算标签的位置
      //     pixelOffset: new Cesium.Cartesian2(0, -9) //偏移量
      //   },
      //   billboard: {
      //     //图标
      //     image:
      //       "http://localhost:81/images/2015/02-02/Philadelphia_Phillies.png",
      //     width: 64,
      //     height: 64
      //   }
      // });

      // var stripeMaterial = new Cesium.StripeMaterialProperty({
      //   evenColor: Cesium.Color.WHITE.withAlpha(0.5),
      //   oddColor: Cesium.Color.BLUE.withAlpha(0.5),
      //   repeat: 5.0
      // });

      // entities.add({
      //   polygon: {
      //     hierarchy: new Cesium.PolygonHierarchy(
      //       Cesium.Cartesian3.fromDegreesArray([
      //         -107.0,
      //         27.0,
      //         -107.0,
      //         22.0,
      //         -102.0,
      //         23.0,
      //         -97.0,
      //         21.0,
      //         -97.0,
      //         25.0
      //       ])
      //     ),
      //     outline: true,
      //     outlineColor: Cesium.Color.WHITE.withAlpha(0.5),
      //     outlineWidth: 4,
      //     material: Cesium.Color.WHITE.withAlpha(0.5)
      //   }
      // });
    </script>
  </body>
</html>
```

## 生成地块代码

```javascript
/**
 * cesium xy转经纬度
 * @param {*} viewer cesium实例
 * @param {*} Math cesium.Math
 * @param {*} position 当前{x,y}坐标
 */
export const xy2LngLat = (viewer, Math, position) => {
  const worldPosition = xy2WorldPosition(viewer, position);
  const cartographic = viewer.scene.globe.ellipsoid.cartesianToCartographic(
    worldPosition
  );
  return {
    lng: Math.toDegrees(cartographic.longitude),
    lat: Math.toDegrees(cartographic.latitude),
    alt: cartographic.height
  };
};

import {
  PointPrimitiveCollection,
  Cartesian3,
  Color,
  HeightReference,
  CallbackProperty,
  PolygonHierarchy,
  ScreenSpaceEventType,
  PointPrimitive,
  // createWorldTerrain,
  ScreenSpaceEventHandler,
  SceneTransforms
  // Math
  // ScreenSpaceEventType,
} from "cesium/Cesium";
import { Math as CesiumMath } from "cesium/Cesium";
import { xy2LngLat } from "@common/utils";

function getHalfArea(p0, p1, p2) {
  var area = 0.0;
  area =
    p0.longitude * p1.latitude +
    p1.longitude * p2.latitude +
    p2.longitude * p0.latitude -
    p1.longitude * p0.latitude -
    p2.longitude * p1.latitude -
    p0.longitude * p2.latitude;
  return area / 2;
}

function getPolygonAreaCenter(points) {
  let sum_x = 0;
  let sum_y = 0;
  let sum_area = 0;
  let p0 = points[0];
  let p1 = points[1];
  let length = points.length;
  for (let i = 2; i < length; i++) {
    let p2 = points[i];
    let area = getHalfArea(p0, p1, p2);
    sum_area += area;
    sum_x += (p0.longitude + p1.longitude + p2.longitude) * area;
    sum_y += (p0.latitude + p1.latitude + p2.latitude) * area;
    p1 = p2;
  }
  let xx = sum_x / sum_area / 3;
  let yy = sum_y / sum_area / 3;
  return { x: xx, y: yy };
}

// lnglat {lng:xx,lat:xx} [lng,lat,lng,lat]
function InitPolygon(viewer, lnglat, data) {
  this.startLngLat = lnglat;
  this.viewer = viewer;
  this.entities = viewer.entities;
  this.points = [];
  this.pointGroup = null;
  this.userData = data;
  this.polygon = null;
  this.handle = null;
  this.isMoving = false;
  this.pointMoved = false;
  this.activePointIndex = null;
  this.scenePosition = { x: 0, y: 0 };
  this.centerPosition = { x: 0, y: 0 };
  this._init();
}
InitPolygon.prototype = {
  constructor: InitPolygon,

  // _checkLngLat: function(){
  //   var lnglat = this.startLngLat;
  //   if(){}
  // },
  _init() {
    this._formatStartLngLat();
    this._setCenterPosition();
    this._initPointGroup();
    this._formatPoints();
    // this._createPoints();
    this._createPolygon();
    this._initHandler();
    // this._addEventListener();
  },

  _setCenterPosition(points = this.userData.areaCoordList) {
    !points && (points = this._array2ObjectArray(this.startLngLat));
    const center = getPolygonAreaCenter(points);
    this.centerPosition = new Cartesian3.fromDegrees(center.x, center.y);
  },
  _array2ObjectArray(arr) {
    let newArr = [];
    arr.forEach((v, k) => {
      k % 2 === 0 && newArr.push({ longitude: arr[k], latitude: arr[k + 1] });
    });
    return newArr;
  },
  _positionUpdated(position) {
    let scenePosition = SceneTransforms.wgs84ToWindowCoordinates(
      this.viewer.scene,
      position
    );
    scenePosition && (this.scenePosition = scenePosition);
  },
  _initPointGroup() {
    this.pointGroup = new PointPrimitiveCollection();
    this.viewer.scene.primitives.add(this.pointGroup);
  },
  _initHandler() {
    this.handler = new ScreenSpaceEventHandler(this.viewer.scene.canvas);
  },
  _formatStartLngLat() {
    let lnglat = this.startLngLat;
    // 如果是创建的时候
    if (!Array.isArray(lnglat)) {
      this.startLngLat = [
        lnglat.lng,
        lnglat.lat,
        lnglat.lng + 0.01,
        lnglat.lat,
        lnglat.lng,
        lnglat.lat + 0.01
      ];
    }
  },
  _formatPoints() {
    this.points = Cartesian3.fromDegreesArray(this.startLngLat);
  },
  // [{}] || [[]] => [1,2,3,4,56,78]
  // _formatArr(arr){
  //   var newArr = []
  //   newArr.forEach(v=>{

  //     if(Array.isArray(v)){

  //     }else if(){}
  //   })
  // },
  _deletePoints() {
    this.pointGroup.removeAll();
  },
  // 创建点
  _createPoint(position, index) {
    this.pointGroup.add({
      name: "point",
      position: position,
      userData: { index: index },
      point: {
        //点
        pixelSize: 10,
        color: Color.WHITE,
        outlineColor: Color.WHITE,
        heightReference: HeightReference.CLAMP_TO_GROUND
      }
    });
  },
  // 创建多个点
  _createPoints() {
    this._deletePoints();
    this.points.forEach((v, k) => {
      this._createPoint(v, k);
    });
  },
  // 创建面
  _createPolygon: function() {
    let that = this;
    this.polygon = this.entities.add({
      name: "polygon",
      userData: that.userData,
      position: new CallbackProperty(() => {
        // let firstPoint = this.points[0];
        // let lastPoint = that.points[that.points.length - 1];
        // let position = new Cartesian3(
        //   (firstPoint.x + lastPoint.x) / 2,
        //   (firstPoint.y + lastPoint.y) / 2,
        //   (firstPoint.z + lastPoint.z) / 2
        // );
        this._positionUpdated(this.centerPosition);
        // const obj = getCenterPoint(this.points);
        // let position = new Cartesian3(obj.x, obj.y, 0);
        return this.centerPosition;
      }, false), //that.points[0], // Cesium.Cartesian3.fromDegrees(lnglat.lng, lnglat.lat),
      polygon: {
        hierarchy: new CallbackProperty(function() {
          return new PolygonHierarchy(that.points);
        }, false),
        // perPositionHeight: 1000,
        // 不加height 没有outline  加height 就遮盖其他的了
        height: 0,
        // 先转成颜色对象 再加透明度
        material: Color.fromAlpha(
          Color.fromCssColorString(that.userData.color),
          0.4
        ),
        outline: true,
        outlineColor: new CallbackProperty(function() {
          return Color.fromAlpha(
            Color.fromCssColorString(that.userData.color),
            1
          ); //Color.RED.withAlpha(0.5)
        }, false)
      },
      label: {
        //文字标签
        showBackground: true,
        text: new CallbackProperty(function() {
          return that.userData.name; //Color.RED.withAlpha(0.5)
        }, false),
        font: "14px Microsoft YaHei",
        eyeOffset: new Cartesian3(0.0, 200.0, 0.0)
        // pixelOffset: new Cartesian2(50, 15)
        // horizontalOrigin: Cesium.HorizontalOrigin.LEFT,
        // verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
        // style: Cesium.LabelStyle.FILL_AND_OUTLINE
      }
    });
    // console.log(this.entities, this.polygon);
  },
  _removeEventListener() {
    document.removeEventListener("mouseup", this._onLeftMouseUp.bind(this));
    this.handler.removeInputAction(ScreenSpaceEventType.LEFT_UP);
    this.handler.removeInputAction(ScreenSpaceEventType.LEFT_DOWN);
    this.handler.removeInputAction(ScreenSpaceEventType.MOUSE_MOVE);
  },
  _addEventListener() {
    document.addEventListener("mouseup", this._onLeftMouseUp.bind(this));

    this.handler.setInputAction(
      this._onLeftMouseUp.bind(this),
      ScreenSpaceEventType.LEFT_UP
    );

    this.handler.setInputAction(
      this._onLeftMouseDown.bind(this),
      ScreenSpaceEventType.LEFT_DOWN
    );

    this.handler.setInputAction(
      this._onMouseMove.bind(this),
      ScreenSpaceEventType.MOUSE_MOVE
    );
  },
  _onLeftMouseDown(event) {
    const position = event.position;
    const pickedFeature = this.viewer.scene.pick(position);
    // console.log(pickedFeature);
    if (pickedFeature && pickedFeature.primitive instanceof PointPrimitive) {
      // 禁止旋转
      this.viewer.scene.screenSpaceCameraController.enableRotate = false;

      this.isMoving = true;
      this.activePointIndex = pickedFeature.primitive._index;
      // console.log(this.pointGroup.get(pickedFeature.primitive._index));
      // this.activePoint = pickedFeature.id;
    }
  },
  _onMouseMove(event) {
    if (this.isMoving) {
      const position = event.endPosition;
      const worldPosition = this.viewer.scene.globe.pick(
        this.viewer.camera.getPickRay(position),
        this.viewer.scene
      );
      const index = this.activePointIndex;
      const curPosition = this.points[index];
      // 移动多少范围
      if (
        Math.abs(curPosition.x - worldPosition.x) > 1 ||
        Math.abs(curPosition.y - worldPosition.y) > 1
      ) {
        this.pointMoved = true;
        this.pointGroup.get(index).position = worldPosition;
        this.points.splice(index, 1, worldPosition);
        // this._updatePolygon(index, worldPosition);
      } else {
        this.pointMoved = false;
      }
    }
  },
  _onLeftMouseUp() {
    if (this.isMoving) {
      this.viewer.scene.screenSpaceCameraController.enableRotate = true;
      this.isMoving = false;
      this.pointMoved && this._addPointsWithActivePoint();
      this._setCenterPosition(this.getPointsByLnglat(true));
    }
  },
  // _updatePolygon: function() {
  //   this.polygon.polygon.hierarchy.setValue(
  //     new Cesium.PolygonHierarchy(this.points)
  //   );
  // },
  _addPointsWithActivePoint() {
    let index = this.activePointIndex;
    let point = this.points[index];
    // 0 1 2
    // 3
    let prevPoint = this._isFirstPoint(index)
      ? this.points[this.points.length - 1]
      : this.points[index - 1];
    // 4
    let nextPoint = this._isLastPoint(index)
      ? this.points[0]
      : this.points[index + 1];
    // 0 3 1 4 2
    let prevAddPoint = new Cartesian3(
      (point.x + prevPoint.x) / 2,
      (point.y + prevPoint.y) / 2,
      (point.z + prevPoint.z) / 2
    );
    let nextAddPoint = new Cartesian3(
      (point.x + nextPoint.x) / 2,
      (point.y + nextPoint.y) / 2,
      (point.z + nextPoint.z) / 2
    );
    this.points.splice(index, 0, prevAddPoint);
    this.points.splice(index + 2, 0, nextAddPoint);
    this._createPoints();
  },
  _isLastPoint(index) {
    return index === this.points.length - 1;
  },
  _isFirstPoint(index) {
    return index === 0;
  },
  // fullName 是返回的是否是完整的坐标属性而不是简写的
  _catesian2Lnglat(catesian3, fullName = false) {
    const cartographic = this.viewer.scene.globe.ellipsoid.cartesianToCartographic(
      catesian3
    );
    return fullName
      ? {
          latitude: CesiumMath.toDegrees(cartographic.latitude),
          longitude: CesiumMath.toDegrees(cartographic.longitude),
          alt: cartographic.height
        }
      : {
          lat: CesiumMath.toDegrees(cartographic.latitude),
          lng: CesiumMath.toDegrees(cartographic.longitude),
          alt: cartographic.height
        };
  },
  destory() {
    this._deletePoints();
    this._removeEventListener();
    this.entities.remove(this.polygon);
    this.handler.destroy();
    this.points = [];
    this.data = {};
  },
  setEditStatus(status) {
    this._removeEventListener();
    if (status) {
      this._createPoints();
      this._addEventListener();
    } else {
      this._deletePoints();
    }
  },
  resetUserData(data) {
    this.userData = Object.assign(this.userData, data);
    this.polygon.polygon.material = Color.fromAlpha(
      Color.fromCssColorString(this.userData.color),
      0.4
    );
  },

  getPointsByLnglat(fullName = false) {
    return this.points.map(v => {
      return this._catesian2Lnglat(v, fullName);
    });
  }
};
```

## 生成模型位置代码

```javascript
function InitModel(opts = { viewer: null, data: {} }) {
  this.userData = opts.data || {};
  this.lnglatArr = [this.userData.longitude, this.userData.latitude];
  this.worldPosition = null;
  this.viewer = opts.viewer;
  this.entities = this.viewer.entities;
  this.model = null;
  this.scenePosition = { x: 0, y: 0 };
  this.isMoving = false;
  this.handler = null;
  this._init();
}
InitModel.prototype = {
  constructor: InitModel,
  _init() {
    this._setWorldPosition(Cartesian3.fromDegrees(...this.lnglatArr));
    this._initModel();
    this._initHandler();
    this._addEventListener();
  },
  _setWorldPosition(position) {
    this.worldPosition = position;
  },
  _initHandler() {
    this.handler = new ScreenSpaceEventHandler(this.viewer.scene.canvas);
  },
  _initModel() {
    let deg = 0;
    this.model = this.entities.add({
      name: "model",
      position: new CallbackProperty(() => {
        // this.userData.infoWindow.show &&
        this._positionUpdated(this.worldPosition);
        return this.worldPosition;
      }, false),
      // 自动旋转
      orientation: new CallbackProperty(() => {
        const heading = Math.toRadians(deg++);
        const pitch = 0;
        const roll = 0;
        const hpr = new HeadingPitchRoll(heading, pitch, roll);
        const orientation = Transforms.headingPitchRollQuaternion(
          this.worldPosition,
          hpr
        );
        deg >= 360 && (deg = 0);
        return orientation;
      }, false),
      userData: this.userData,
      model: {
        uri: "glTF/Duck.gltf",
        minimumPixelSize: 128,
        maximumScale: 20000
      }

      // label: {
      //   //文字标签
      //   showBackground: true,
      //   text: that.data.name,
      //   font: "14pt monospace",
      //   eyeOffset: new Cartesian3(0.0, 200.0, 0.0),
      //   pixelOffset: new Cartesian2(50, 15)
      // }
    });
  },
  // 实时计算弹窗位置
  _positionUpdated(position) {
    let scenePosition = SceneTransforms.wgs84ToWindowCoordinates(
      this.viewer.scene,
      position
    );
    scenePosition && (this.scenePosition = scenePosition);
  },
  _removeEventListener() {
    document.removeEventListener("mouseup", this._onLeftMouseUp.bind(this));
    this.handler.removeInputAction(ScreenSpaceEventType.LEFT_UP);
    this.handler.removeInputAction(ScreenSpaceEventType.LEFT_DOWN);
    this.handler.removeInputAction(ScreenSpaceEventType.MOUSE_MOVE);
  },
  _addEventListener() {
    document.addEventListener("mouseup", this._onLeftMouseUp.bind(this));

    this.handler.setInputAction(
      this._onLeftMouseUp.bind(this),
      ScreenSpaceEventType.LEFT_UP
    );

    this.handler.setInputAction(
      this._onLeftMouseDown.bind(this),
      ScreenSpaceEventType.LEFT_DOWN
    );

    this.handler.setInputAction(
      this._onMouseMove.bind(this),
      ScreenSpaceEventType.MOUSE_MOVE
    );
  },
  _onLeftMouseDown(event) {
    const position = event.position;
    const pickedFeature = this.viewer.scene.pick(position);
    // console.log(pickedFeature);
    if (
      pickedFeature &&
      pickedFeature.id &&
      pickedFeature.id._id === this.model._id
    ) {
      // 禁止旋转
      this.viewer.scene.screenSpaceCameraController.enableRotate = false;
      this.isMoving = true;
    }
  },
  _onMouseMove(event) {
    if (this.isMoving) {
      const position = event.endPosition;
      const worldPosition = this.viewer.scene.globe.pick(
        this.viewer.camera.getPickRay(position),
        this.viewer.scene
      );
      this._setWorldPosition(worldPosition);
    }
  },
  _onLeftMouseUp() {
    if (this.isMoving) {
      this.viewer.scene.screenSpaceCameraController.enableRotate = true;
      this.isMoving = false;
    }
  }
};
```
