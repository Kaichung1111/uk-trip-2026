let userLat = null;
let userLng = null;
let isRaining = false;

const places = [
  {name:"倫敦塔",lat:51.5081,lng:-0.0759,indoor:false,duration:120,popularity:5},
  {name:"塔橋",lat:51.5055,lng:-0.0754,indoor:false,duration:60,popularity:5},
  {name:"Tate Modern",lat:51.5076,lng:-0.0994,indoor:true,duration:90,popularity:4}
];

function init(){
  getLocation();
}

function render(){
  const container = document.getElementById("places");
  container.innerHTML = "";
  places.forEach(p=>{
    const div = document.createElement("div");
    div.className = "place";
    div.innerHTML = `
      <b>${p.name}</b><br>
      <button onclick="openMap(${p.lat},${p.lng})">導航</button>
      <button onclick="openReview('${p.name}')">評價</button>
    `;
    container.appendChild(div);
  });
}

function getLocation(){
  navigator.geolocation.getCurrentPosition(pos=>{
    userLat = pos.coords.latitude;
    userLng = pos.coords.longitude;
    document.getElementById("locationStatus").innerText="已定位";
    updateAI();
    render();
  });
}

function distance(lat1,lng1,lat2,lng2){
  const R=6371;
  const dLat=(lat2-lat1)*Math.PI/180;
  const dLng=(lng2-lng1)*Math.PI/180;
  const a=Math.sin(dLat/2)**2+
    Math.cos(lat1*Math.PI/180)*Math.cos(lat2*Math.PI/180)*
    Math.sin(dLng/2)**2;
  return R*2*Math.atan2(Math.sqrt(a),Math.sqrt(1-a));
}

function decide(){
  let best=null,score=-999;
  places.forEach(p=>{
    let s=0;
    const d=distance(userLat,userLng,p.lat,p.lng);
    s-=d;
    if(isRaining && p.indoor) s+=5;
    if(s>score){score=s;best=p;}
  });
  return best;
}

function updateAI(){
  const p=decide();
  document.getElementById("aiBox").innerText=
    "👉 建議前往："+p.name;
}

function openMap(lat,lng){
  window.open(`https://www.google.com/maps?q=${lat},${lng}`);
}

function openReview(name){
  window.open(`https://www.google.com/search?q=${name}+reviews`);
}

init();
