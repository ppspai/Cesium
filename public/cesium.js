$(window).on('load', function() {
    let baseMap, mapViewer;

    let extent = Cesium.Rectangle.fromDegrees(117.896284, 31.499028, 139.597380, 43.311528);

    Cesium.Camera.DEFAULT_VIEW_RECTANGLE = extent;
    Cesium.Camera.DEFAULT_VIEW_FACTOR = 0.7;

    Cesium.Ion.defaultAccessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJhMDY3MmY5MC04Nzk3LTQwNWMtOGMxZS1kMDVjMTgyN2Y5YzQiLCJpZCI6MTQwNjUzLCJpYXQiOjE2ODQ4MDE2Nzh9.NPZBe7fAW01hgaXDEeETLxCukiPgqc4GU6_T8IeVlUE";

    mapViewer = new Cesium.Viewer('cesiumContainer',
        {
            timeline : false,
            animation: false,
            selectionIndicator : false,
            navigationHelpButton : false,
            infoBox : false,
            navigationInstructionsInitiallyVisible : false,
            baseLayerPicker : true,
        }
    );
});