function sensor1(caso) {
  console.log(caso+ "holaa");
  
  if (caso == "1,0,0") {
    document.getElementById("sensor1").style.background = "Lime"; 
    document.getElementById("sensor2").style.background = "red";
    document.getElementById("sensor3").style.background = "red"; 
  } else if(caso == "1,0,1"){
    document.getElementById("sensor1").style.background = "Lime"; 
    document.getElementById("sensor2").style.background = "red"; 
    document.getElementById("sensor3").style.background = "Lime"; 
    
  } else if(caso =="0,0,1"){
    document.getElementById("sensor1").style.background = "red"; 
    document.getElementById("sensor2").style.background = "red"; 
    document.getElementById("sensor3").style.background = "Lime"; 
  } else if(caso == "0,1,0"){
    document.getElementById("sensor1").style.background = "red"; 
    document.getElementById("sensor2").style.background = "Lime"; 
    document.getElementById("sensor3").style.background = "red"; 
  } 
  else {
    document.getElementById("sensor1").style.background = "red"; 
    document.getElementById("sensor2").style.background = "red"; 
    document.getElementById("sensor3").style.background = "red"; 
  }
}
async function asincrono() {
  const options = {
    method: "GET",
  };
  const response = await fetch("/live1", options);
  const response1 = await response.json();
  return response1;
}

async function color() {
  const caso = await asincrono();
  sensor1(caso);
}
setInterval(function () {
  color();
}, 5000);
