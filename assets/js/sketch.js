// URL restrictions
const key =
  "pk.eyJ1IjoieXV0YTAiLCJhIjoiY2xkeDdxMGNnMGVwazNzcGtmNWxsYnpqbyJ9.qXOupweX0QQDrH27B02S9g";

const options = {
  lat: 35,
  lng: 135,
  zoom: 4.5,
  pitch: 40,
  style: "mapbox://styles/yuta0/cldybz2qd000e01nswag5hy9y",
};

const mappa = new Mappa("MapboxGL", key);
let myMap;
let canvas;
let meteorites;

function preload() {
  meteorites = loadTable("assets/data/2023.csv", "csv", "header");
}
function setup() {
  canvas = createCanvas(windowWidth, windowHeight).parent("canvasContainer");
  myMap = mappa.tileMap(options);
  myMap.overlay(canvas);
  myMap.onChange(drawMeteorites);
}

function draw() {}

function drawMeteorites() {
  clear();
  for (let i = 0; i < meteorites.getRowCount(); i += 1) {
    const club = String(meteorites.getString(i, "club"));
    const contract = String(meteorites.getString(i, "contract"));
    const latitude_in = Number(meteorites.getString(i, "reclat_in"));
    const longitude_in = Number(meteorites.getString(i, "reclog_in"));
    const latitude_out = Number(meteorites.getString(i, "reclat_out"));
    const longitude_out = Number(meteorites.getString(i, "reclog_out"));
    const pos_in = myMap.latLngToPixel(latitude_in, longitude_in);
    const pos_out = myMap.latLngToPixel(latitude_out, longitude_out);

    if (contract == "トップ昇格") {
      topcontract(pos_in.x, pos_in.y, count(club, contract));
    } else {
      bezierline(pos_in.x, pos_in.y, pos_out.x, pos_out.y, contract);
    }
  }
}

function bezierline(x, y, x2, y2, contract) {
  noFill();
  var sw = 0.3;
  // drawingContext.shadowBlur = 3;
  if (contract == "新加入") {
    // drawingContext.shadowColor = color('#fa6e57');
    stroke("#fa6e57");
  } else if (contract == "完全移籍") {
    // drawingContext.shadowColor = color('#f69e53');
    stroke("#f69e53");
  } else if (contract == "期限付き") {
    // drawingContext.shadowColor = color('#4695d6');
    stroke("#4695d6");
  } else if (contract == "復帰") {
    // drawingContext.shadowColor = color('#fed95c');
    stroke("#fed95c");
  } else {
    // drawingContext.shadowColor = color('#fa6e57');
    stroke("#fa6e57");
  }
  strokeWeight(sw);
  var z = myMap.getZoom();
  bezier(x, y, x - z * 3, y - z * 3, x2 - z * 3, y2 - z * 3, x2, y2);

  noStroke();
  fill("#ddd");
  ellipse(x, y, z / 2);
  ellipse(x2, y2, z / 2);
}

// トップ昇格描写
function topcontract(x, y, count) {
  var z = myMap.getZoom() * 2;
  stroke("#ddd");
  strokeWeight(2);
  line(x, y, x, y - z * count);
}

// 人数カウント
var c = [];
function count(cc, cont) {
  for (let i = 0; i < meteorites.getRowCount(); i += 1) {
    const club = String(meteorites.getString(i, "club"));
    const contract = String(meteorites.getString(i, "contract"));
    c[i] = [club, contract];
    if (!(c[i][0] === cc) || !(c[i][1] == cont)) {
      delete c[i];
    }
  }
  const r = c.filter((v) => !!v);
  return r.length;
}

/* -----------------toggle------------------- */

$(".toggle").click(function () {
  $(".info__content").slideToggle(400, "linear");
  $(this).toggleClass("is-hit");
});
