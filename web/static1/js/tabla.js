var caso1, num, myChartP
const labels = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July'
];

const data = {
  labels: labels,
  datasets: [{
    label: 'Ocupación mensual',
    xAxisID: 'hola',

    backgroundColor: '#111b54',
    borderColor: 'rgb(255, 99, 132)',
    data: [0, 10, 5, 2, 20, 30, 45, 60],
  }]
};
const config = {
  type: 'bar',
  data,
  options: {}
};
var myChart = new Chart(
  document.getElementById('myChart'),
  config

);





async function asincrono() {
  const options = {
    method: "GET",
    //body: JSON.stringify(hola5),
    //headers: {
    // "Content-Type": "application/json"
    //}
  };
  const response = await fetch('/da', options);
  const hola = await response.json();

  return hola
};




//PASTEL--------------------------------------------


async function update() {
  try {

    const caso = await asincrono();
    console.log(caso)
    let caso1 = { visitante: caso[0].num, contratista: caso[2].num, trabajador: caso[1].num };
    console.log(caso1)
    const dataP = {
      labels: [
        'Visitantes',
        'Contratistas',
        'Trabajadores'
      ],
      datasets: [{
        label: 'hola',
        data: [caso1.visitante, caso1.contratista, caso1.trabajador],
        backgroundColor: [
          'rgb(255, 99, 132)',
          'rgb(54, 162, 235)',
          'rgb(255, 205, 86)'
        ],
        hoverOffset: 4
      }]
    };
    const configP = {
      type: 'pie',
      data: dataP,
      options: {
        responsive: true,
        maintainAspectRatio: false
      }
    };

    

     myChartP = new Chart(
 
      document.getElementById('myChartP'),
      configP
    );
    //setTimeout(function(){myChartP.destroy();}, 4900);
    var total = caso1.visitante+ caso1.contratista+ caso1.trabajador;
    var park = 200 - total;
    //var ing = (2000*caso1.visitante) + (1200*caso1.contratista) + (600*caso1.trabajador)
    document.getElementById("num_user").innerHTML = total;
    document.getElementById("num_park").innerHTML = park;
    //document.getElementById("ing_men").innerHTML = park;

  } catch (e) { console.log(e) }
  
}
setInterval(function () { update(myChartP.destroy()); }, 10000);
