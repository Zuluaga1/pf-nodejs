

function sensor1(caso) {
    //var  = 0;
    //console.log(typeof(caso))
    //caso = parseInt(caso)
    
    console.log(caso)
    if (caso == 1) {
        document.getElementById("sensor1").style.background = "Lime"; //1 verde
    }
    else {
        document.getElementById("sensor1").style.background = "red";
    }

}
async function asincrono() {
    const options = {
        method: "GET",
        //body: JSON.stringify(hola5),
        //headers: {
        // "Content-Type": "application/json"
        //}
    };
    const response = await fetch('/live1', options);
    const hola = await response.json();
    //console.log(hola);

    return hola
};

async function color() {
    const caso = await asincrono();
    sensor1(caso);
}
setInterval(function () { color(); }, 5000);


