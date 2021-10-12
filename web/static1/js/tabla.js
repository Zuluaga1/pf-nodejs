var caso1, num, myChartP;


async function asyncOcupaciónMensual() {
  const options = {
    method: "GET",
  };
  const response1 = await fetch("/da", options);
  const respuesta1 = await response1.json();
  return respuesta1;
}

async function ocupaciónMensual() {
  try {
    const labels = [
      "Primer trimestre",
      "Segundo trimestre",
      "tercer trimestre",
      "Cuarto trimestre",
    ];

    const data = {
      labels: labels,
      datasets: [
        {
          label: "Ocupación mensual",
          xAxisID: "hola",

          backgroundColor: "#111b54",
          borderColor: "rgb(255, 99, 132)",
          data: [45, 89, 40, 30],
        },
      ],
    };
    const config = {
      type: "bar",
      data,
      options: {},
    };
    var myChart = new Chart(document.getElementById("myChart"), config);
  } catch (e) {
    console.log(e);
  }
}

async function asincrono() {
  const options = {
    method: "GET",
  };
  const response = await fetch("/da", options);
  const respuesta = await response.json();
  return respuesta;
}

//Diagrama pastel--------------------------------------------

async function update() {
  try {
    const caso = await asincrono();
    let caso1 = {
      visitante: caso[1].num,
      contratista: caso[0].num,
      trabajador: caso[3].num,
    };
    const dataP = {
      labels: ["Visitantes", "Contratistas", "Trabajadores"],
      datasets: [
        {
          label: "hola",
          data: [caso1.visitante, caso1.contratista, caso1.trabajador],
          backgroundColor: [
            "rgb(255, 99, 132)",
            "rgb(54, 162, 235)",
            "rgb(255, 205, 86)",
          ],
          hoverOffset: 4,
        },
      ],
    };
    const configP = {
      type: "pie",
      data: dataP,
      options: {
        responsive: true,
        maintainAspectRatio: false,
      },
    };

    myChartP = new Chart(document.getElementById("myChartP"), configP);
    var total =
      caso1.visitante + caso1.contratista + caso1.trabajador + caso[2].num;
    var park = 200 - total;
    document.getElementById("num_user").innerHTML = total;
    document.getElementById("num_park").innerHTML = park;
  } catch (e) {
    console.log(e);
  }
}
setInterval(function () {
  update(myChartP.destroy());
}, 10000);
ocupaciónMensual();
