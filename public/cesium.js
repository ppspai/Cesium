"use strict";

$(window).on('load', function () {
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

    let viewer = new Cesium.Viewer('cesiumContainer'
        // {
        //     timeline : true,
        //     animation: false,
        //     selectionIndicator : false,
        //     navigationHelpButton : false,
        //     infoBox : false,
        //     navigationInstructionsInitiallyVisible : false,
        //     baseLayerPicker : true,
        //     homeButton : false,
        // }
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

    $("#inputModel").click(() => {
        let longitude = 126.8730332224969;
        let latitude = 37.573589810697825;
        let height = 9.313225746154785e-10;
        // 위도 경도 높이를 Cartesian3로 바꿔줌
        let cartographic = Cesium.Cartographic.fromDegrees(longitude, latitude, height);
        let cartesian = Cesium.Ellipsoid.WGS84.cartographicToCartesian(cartographic);

        viewer.entities.add({
            name: "Box",
            position: cartesian,
            box: {
                dimensions: new Cesium.Cartesian3(50.0, 50.0, 50.0),
                material: Cesium.Color.WHITE,
                outline: true,
                outlineWidth: 3.0,
                outlineColor: Cesium.Color.RED,
            }
        });
        viewer.zoomTo(viewer.entities);
    })

    const handler = new Cesium.ScreenSpaceEventHandler(viewer.canvas);

    // 클릭한 캔버스에 좌표 찍는 함수
    const getPosition = () => {
        let clickHandler;
        if ($("#getPosition").hasClass('active')) {
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

    $("#getPosition").click(function () {
        if ($(this).hasClass('active')) {
            $(this).removeClass('active');
        } else {
            $(this).addClass('active');
        }
        getPosition();
    })


    // 비행기
    // 비행기 비행구역 생성

    viewer.scene.globe.enableLighting = true;
    viewer.scene.globe.depthTestAgainstTerrain = true;
    Cesium.Math.setRandomNumberSeed(3);

    let start = Cesium.JulianDate.fromDate(new Date(2023, 5, 23, 0));
    let stop = Cesium.JulianDate.addSeconds(start, 360, new Cesium.JulianDate());

    viewer.clock.startTime = start.clone();
    viewer.clock.stopTime = stop.clone();
    viewer.clock.currentTime = start.clone();
    viewer.clock.clockRange = Cesium.ClockRange.LOOP_STOP;
    viewer.clock.multiplier = 10;


    let point;
    // 비행기 비행 구역 설정
    const computeCircularFlight = (lon, lat, radius) => {
        let property = new Cesium.SampledPositionProperty();

        for (let i = 0; i <= 360; i += 10) {
            let radians = Cesium.Math.toRadians(i);
            let time = Cesium.JulianDate.addSeconds(start, i, new Cesium.JulianDate());
            // let position = Cesium.Cartesian3.fromDegrees(lon + (radius * 1.5 * Math.cos(radians)), lat + (radius * Math.sin(radians)), Cesium.Math.nextRandomNumber() * 500 + 1000);
            let position = Cesium.Cartesian3.fromDegrees(lon + (radius * 1.5 * Math.cos(radians)), lat + (radius * Math.sin(radians)), 1500);
            property.addSample(time, position);

            //비행기 구분점 표시
            viewer.entities.add({
                position: position,
                point: {
                    pixelSize: 3,
                    color: Cesium.Color.RED,
                    outlinecolor: Cesium.Color.RED,
                    outlineWidth: 3
                }
            });
        }
        return property;
    }

    let position = computeCircularFlight(126.924403, 37.524624, 0.03);
    let airplane;
    $("#airplane").click(() => {
        console.log(position);
        
        airplane = viewer.entities.add({
            name: "airplane",
            availability: new Cesium.TimeIntervalCollection([new Cesium.TimeInterval({
                start: start,
                stop: stop
            })]),
            position: position,
            orientation: new Cesium.VelocityOrientationProperty(position),
            model: {
                uri: "/js/Cesium-1.87.1/Apps/SampleData/models/CesiumAir/Cesium_Air.glb",

                minimumPixelSize: 64,
            },
            path: {
                resolution: 1,
                material: new Cesium.PolylineGlowMaterialProperty({
                    glowPower: 0.1,
                    color: Cesium.Color.YELLOW
                }),
                width: 10
            }
        });
        viewer.zoomTo(viewer.entities);
    })

    // 비행기 제거
    $("#deleteAirplane").click(() => {
        viewer.entities.remove(airplane);
        viewer.entities.remove(point);
    })
});