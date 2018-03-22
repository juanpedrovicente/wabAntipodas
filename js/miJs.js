
require(["esri/map",
"esri/geometry/Point",
"esri/geometry/webMercatorUtils",
"dojo/domReady!"],
function(Map,
  Point,
  webMercatorUtils) {
    map1 = new Map("mapIzquierda", {
      basemap:"topo",
      center: [-3.7, 40.7],
      zoom: 5
    });
    map2 = new Map("mapDerecha", {
      basemap: "topo",
      zoom: 6
    });


    /* ------------------------------------

    E V E N T O S

    ----------------------------------*/

    map1.on("zoom-end", function(evento){
      var zoom = evento.level;
      igualarZoom(map2, zoom);
    });

    map2.on("zoom-end", function(evento){
      var zoom = evento.level;
      igualarZoom(map1, zoom);
    });



    map1.on("mouse-down", function(){
      var extent = map1.extent;
      var zoom = map1.getZoom();
      resuelveAntipodas(map2,extent, zoom);
    });

    map2.on("mouse-down", function(){
      var extent = map2.extent;
      var zoom = map2.getZoom();
      resuelveAntipodas(map1, extent, zoom);
    });

    map2.on("load", function(evento){
      var extent = map1.extent;
      var zoom = map1.getZoom();
      resuelveAntipodas(map2,extent, zoom);
    });

    function igualarZoom(cualquierMapa, zoom){
      cualquierMapa.setZoom(zoom);
    }

    /*   ---------------------------------

    F U N C I O N E S

    -------------------------------------*/

    function resuelveAntipodas(mapaQueTengoQueSincronizar, extent, zoom){

      var centroMapaOrigen = extent.getCenter();
      var puntoLatLon = webMercatorUtils.xyToLngLat(centroMapaOrigen.x, centroMapaOrigen.y);
      var latitud = -puntoLatLon[1];
      var longitud;
      if (puntoLatLon[0] < 0){
        longitud = puntoLatLon[0] + 180;
      }
      else{
        longitud = puntoLatLon[0] - 180;
      }
      var centroXY = webMercatorUtils.lngLatToXY(longitud, latitud);
      var puntoQueCorrespondeALasAntipodas = new Point(centroXY[0], centroXY[1], mapaQueTengoQueSincronizar.spatialReference);
      if(mapaQueTengoQueSincronizar.loaded){
        mapaQueTengoQueSincronizar.centerAndZoom(puntoQueCorrespondeALasAntipodas, zoom);
      }
    }
  });
