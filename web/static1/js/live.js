function sensor1(caso) {
  console.log(caso);
  if (caso == 1) {
    document.getElementById("sensor1").style.background = "Lime"; //1 verde
  } else {
    document.getElementById("sensor1").style.background = "red";
  }
}
async function asincrono() {
  const options = {
    method: "GET",
  };
  const response = await fetch("/live1", options);
  const response = await response.json();
  return response;
}

async function color() {
  const caso = await asincrono();
  sensor1(caso);
}
setInterval(function () {
  color();
}, 5000);
