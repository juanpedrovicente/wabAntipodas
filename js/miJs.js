
require(["esri/map",
"esri/geometry/Point",
"esri/geometry/webMercatorUtils",
"dojo/domReady!"],
function(Map,
  Point,
  webMercatorUtils) {
    map1 = new Map("mapIzquierda", {
      basemap:"topo",
      center: [-3.62, 40.42],
      zoom: 6
    });
    map2 = new Map("mapDerecha", {
      basemap: "dark-gray",
      zoom: 6
    });
    //listener de LOAD al mapa 1 para insertar la mira
    map1.on("load", function(evt){
      //se captura el elemento del dom map_root para insertar ahí la imagen
      elem = document.getElementById("mapIzquierda_root");
      //se crea una imágen de manéra dinámica (desde JavaScript)
      var imagen= document.createElement("img");
      //se meten los atributos para que la imagen se situe en el centro del mapa
      imagen.setAttribute("src", "https://upload.wikimedia.org/wikipedia/commons/d/d7/Red_Point.gif");
      imagen.setAttribute("style","z-index : 100; position : absolute; top : 230px; left : 230px; height: 40px; width: 40px;");
      //se añade la imagen al elemento del dom "map_root"
      elem.appendChild(imagen);
    });
    //este evento sirve para insertar la mira en el segundo mapa y para sincronizar el segundo mapa en el primero cuando el segundo mapa esté cargado
    map2.on("load", function(evt){
      //recogemos el extent y el zoom del primer mapa para sincronizarlo con el segundo mapa
      var extent = map1.extent;
      var zoom = map1.getZoom();
      //le pasamos a la función el mapa2 ya que es el que queremos que se sincronize en este caso
      sinconizar(map2,extent, zoom);
      //al igual que en el primer mapa, añadimos la mira de la misma manera pero al segundo mapa
      elem = document.getElementById("mapDerecha_root");
      var imagen= document.createElement("img");
      imagen.setAttribute("src", "https://upload.wikimedia.org/wikipedia/commons/d/d7/Red_Point.gif");
      imagen.setAttribute("style","z-index : 100");
      imagen.setAttribute("style","position : absolute; top : 230px; left : 230px; height: 40px; width: 40px;");
      elem.appendChild(imagen);
    });

    //recogemos el evento "mouse-down" del mapa 1 para sincronizar el segundo
    map1.on("mouse-down", function(){
      var extent = map1.extent;
      var zoom = map1.getZoom();
      sinconizar(map2,extent, zoom);
    });
    //recogemos el evento "mouse-down" del mapa 2 para sincronizar el primero
    map2.on("mouse-down", function(){
      var extent = map2.extent;
      var zoom = map2.getZoom();
      sinconizar(map1, extent, zoom);
    });
    //recogemos el evento "zoom-end" para sincronizar el zoom con el mapa 2
    map1.on("zoom-end", function(evt){
      var zoom = evt.level;
      sinc_zoom(map2, zoom);
    });
    //recogemos el evento "zoom-end" para sincronizar el zoom con el mapa 1
    map2.on("zoom-end", function(evt){
      var zoom = evt.level;
      sinc_zoom(map1, zoom);
    });
    //función que sincroniza el zoom con el mapa que le pasamos
    function sinc_zoom(mapa, zoom){
      mapa.setZoom(zoom);
    }
    //función que sincroniza el mapa con el punto de las antípodas y también los niveles de zoom al mapa que le pasamos como parámetro a esta función
    function sinconizar(mapa_dest, extent, zoom){
      //obtención del centro del extent
      var center = extent.getCenter();
      //transformación del centro a coordenadas longitud/latitud
      var centerLatLong = webMercatorUtils.xyToLngLat(center.x, center.y);
      //la latitud en la antípoda es la coordenada inversa
      var latitud = -centerLatLong[1];
      //la longitud de la antípoda la obtenemos sumando o restando 180 en función del signo de la longitud
      var longitud;
      if (centerLatLong[0] < 0){
        longitud = centerLatLong[0] + 180;
      }
      else{
        longitud = centerLatLong[0] - 180;
      }
      //transformamos las coordenadas long y lat a X Y
      var center2WebMercator = webMercatorUtils.lngLatToXY(longitud, latitud);
      //creamos el punto con estas coordenadas X e Y
      var center2 = new Point(center2WebMercator[0], center2WebMercator[1], mapa_dest.spatialReference);
      //centramos el mapa en el punto de las antípodas y sincronizamos el zoom
      if(mapa_dest.loaded){
        mapa_dest.centerAndZoom(center2, zoom);
      }
    }
  });
