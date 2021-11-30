var caso1, num, myChartP, myChart;

async function trimestre() {
  const options = {
    method: "GET",
  };
  const response = await fetch("/da1", options);
  const respuesta = await response.json();
  return respuesta;
}

async function ocupaciónMensual() {
  try {
    let caso = await trimestre();
    let caso1 = {
      primerTrimestre: caso[1].Trimestres,
      segundoTrimestre: caso[2].Trimestres,
      tercerTrimestre: caso[3].Trimestres,
      cuartoTrimestre: caso[0].Trimestres,
    };
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
          label: "Ocupación Trimestral",
          xAxisID: "grafica",

          backgroundColor: "#111b54",
          borderColor: "rgb(255, 99, 132)",
          data: [
            caso1.primerTrimestre,
            caso1.segundoTrimestre,
            caso1.tercerTrimestre,
            caso1.cuartoTrimestre,
          ],
        },
      ],
    };
    const config = {
      type: "bar",
      data,
      options: {},
    };
    myChart = new Chart(document.getElementById("myChart"), config);
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
      visitante: caso[0].num,
      contratista: caso[2].num,
      trabajador: caso[1].num,
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

    asyncOcupaciónMensual();
  } catch (e) {
    console.log(e);
  }
}

async function asyncOcupaciónMensual() {
  const options = {
    method: "GET",
  };
  const response1 = await fetch("/da2", options);
  const respuesta1 = await response1.json();
  //console.log(respuesta1);
  let total = respuesta1;
  let total1 = {
    casos: total[0].total,
  };
  //console.log(total1.casos);
  //let total
  //let total = respuesta1
  let park = 200 - total1.casos;
  document.getElementById("num_user").innerHTML = total1.casos;
  document.getElementById("num_park").innerHTML = park;
  return respuesta1;
}

setInterval(function () {
  update(myChartP.destroy());
}, 10000);

ocupaciónMensual();
