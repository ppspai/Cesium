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
    handler.setInputAction((click) => {
        let cartesian = viewer.camera.pickEllipsoid(click.position, viewer.scene.globe.ellipsoid);
        if (cartesian) {
            let cartographic = Cesium.Cartographic.fromCartesian(cartesian);
            let longitude = Cesium.Math.toDegrees(cartographic.longitude);
            let latitude = Cesium.Math.toDegrees(cartographic.latitude);
            let height = cartographic.height;

            console.log("클릭한 위치의 경도 : ", longitude);
            console.log("클릭한 위치의 위도 : ", latitude);
            console.log("클릭한 위치의 고도 : ", height);
        }
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);


    $("#inputModel").click(() => {
        let box = viewer.entities.add({
            name : "Box",
            position : Cesium.Cartesian3.fromDegrees(-3038479.495072682, 4048033.3357115067, 3868207.5514546167),
            box : {
                dimensions :  new Cesium.Cartesian3(500.0, 500.0, 500.0),
                material : Cesium.Color.RED,
                outline : true,
                outlinecolor : Cesium.Color.WHITE,
            }
        });
        viewer.zoomTo(viewer.entities);
    })
});