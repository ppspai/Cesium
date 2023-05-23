$(window).on('load', function() {
    // let baseMap;

    let extent = Cesium.Rectangle.fromDegrees(
        118.47210977735858,
        30.909944590789138,
        136.19768873771102,
        41.57339747769777
    );

    Cesium.Camera.DEFAULT_VIEW_RECTANGLE = extent;
    Cesium.Camera.DEFAULT_VIEW_FACTOR = 0;

    Cesium.Ion.defaultAccessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJhMDY3MmY5MC04Nzk3LTQwNWMtOGMxZS1kMDVjMTgyN2Y5YzQiLCJpZCI6MTQwNjUzLCJpYXQiOjE2ODQ4MDE2Nzh9.NPZBe7fAW01hgaXDEeETLxCukiPgqc4GU6_T8IeVlUE";

    let viewer = new Cesium.Viewer('cesiumContainer',
        {
            timeline : false,
            animation: false,
            selectionIndicator : false,
            navigationHelpButton : false,
            infoBox : false,
            navigationInstructionsInitiallyVisible : false,
            baseLayerPicker : true,
            homeButton : false,
        }
    );

    viewer.camera.setView({
        // destination : 카메라의 위치
        destination: new Cesium.Cartesian3(
            -3038479.495072682,
            4048033.3357115067,
            3868207.5514546167,
        ),
        // orientation : 카메라가 바라보는 각도 (heading, pitch, roll로 표현)
        orientation: {
            heading: 5.387203655989542,
            pitch: -0.47616045148868613,
            roll: 0.000010743337886864879,
        },
    });


    const handler = new Cesium.ScreenSpaceEventHandler(viewer.canvas);
    
    // 클릭한 캔버스에 좌표 찍는 함수
    const getPosition = () => {
        let clickHandler;
        if($("#getPosition").hasClass('active')) {
            clickHandler = handler.setInputAction((click) => {
                let cartesian = viewer.camera.pickEllipsoid(click.position, viewer.scene.globe.ellipsoid);
                if (cartesian) {
                    let cartographic = Cesium.Cartographic.fromCartesian(cartesian);
                    let longitude = Cesium.Math.toDegrees(cartographic.longitude);
                    let latitude = Cesium.Math.toDegrees(cartographic.latitude);
                    let height = cartographic.height;
        
                    console.log("클릭한 위치의 경도 : ", longitude);
                    console.log("클릭한 위치의 위도 : ", latitude);
                    console.log("클릭한 위치의 고도 : ", height);
                    console.log("=========================");
                    
                }
            }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
        } else {
            handler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK, clickHandler);
        }
    }

    $("#getPosition").click(function(){
        if($(this).hasClass('active')) {
            $(this).removeClass('active');
        } else {
            $(this).addClass('active');
        }
        getPosition();
    })

    $("#inputModel").click(() => {
        let longitude = 126.8730332224969;
        let latitude = 37.573589810697825;
        let height = 9.313225746154785e-10;
        // 위도 경도 높이를 Cartesian3로 바꿔줌
        let cartographic = Cesium.Cartographic.fromDegrees(longitude, latitude, height);
        let cartesian = Cesium.Ellipsoid.WGS84.cartographicToCartesian(cartographic);

        let box = viewer.entities.add({
            name : "Box",
            position : cartesian,
            box : {
                dimensions :  new Cesium.Cartesian3(50.0, 50.0, 50.0),
                material : Cesium.Color.RED,
                outline : true,
                outlinecolor : Cesium.Color.WHITE,
            }
        });
        viewer.zoomTo(viewer.entities);
    })
});