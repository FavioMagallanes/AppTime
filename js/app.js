const container = document.querySelector('.container');
const resulatado = document.querySelector('#resultado');
const formulario = document.querySelector('#formulario');

window.addEventListener('load', () => {
  formulario.addEventListener('submit', buscarClima)
})


function buscarClima(e) {
  e.preventDefault();

  //Valido el formulario
  const ciudad = document.querySelector('#ciudad').value;
  const pais = document.querySelector('#pais').value;

  if (ciudad === '' || pais === '') {
    mostrarError('Ambos campos son obligatorios')

    return;
  }
  //Consulto la API
  consultarAPI(ciudad, pais);
}

function mostrarError(mensaje) {
  const alerta = document.querySelector('.bg-red-100');

  if (!alerta) {
    //Alerta de error
    const alerta = document.createElement('div');
    alerta.classList.add('bg-red-100', 'border-red-400', 'text-red-700', 'px-4', 'py-3', 'rounded', 'max-w-md', 'mx-auto', 'mt-6', 'text-center');


    alerta.innerHTML = `
    <strong class="font-bold">Error!</strong>
    <span class="block">${mensaje}</span>
    `;

    container.appendChild(alerta);

    setTimeout(() => {
      alerta.remove();
    }, 5000);
  }
}

function consultarAPI(ciudad, pais) {
  const appId = '1f1c7086cba61007a9c56ef5343f6836';
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${ciudad},${pais}&appid=${appId}`;

  spinner();
  
  fetch(url)
    .then(respuesta => respuesta.json())
    .then(datos => {
      
      limpiarHTML();//Limpia el HTML previo
      
      if (datos.cod === "404") {
        mostrarError('Ciudad no encontrada');
        return;
      }

      //Imprimo la respuesta en el HTML
      mostrarClima(datos);

    })
}

function mostrarClima(datos) {
  const { name, main: { temp, temp_max, temp_min, humidity } } = datos;

  const centigrados = kelvinACentigrados(temp);
  const max = kelvinACentigrados(temp_max);
  const min = kelvinACentigrados(temp_min);
  const hum = humedadDatos(humidity);

  const nombreCiudad = document.createElement('p');
  nombreCiudad.textContent = `Clima en ${name}`;
  nombreCiudad.classList.add('font-bold', 'text-2xl');

  const actual = document.createElement('p');
  actual.innerHTML = `${centigrados} &#8451;`;
  actual.classList.add('font-bold', 'text-6xl');

  const tempMaxima = document.createElement('p');
  tempMaxima.innerHTML = `Temp Max: ${max} &#8451;`;
  tempMaxima.classList.add('text-xl');

  const tempMinima = document.createElement('p');
  tempMinima.innerHTML = `Temp Min: ${min} &#8451;`;
  tempMinima.classList.add('text-xl');

  const humedad = document.createElement('p');
  humedad.innerHTML = `Humedad: ${hum} %`;
  humedad.classList.add('text-xl');

  const resultadoDiv = document.createElement('div');
  resultadoDiv.classList.add('text-center', 'text-white');
  
  resultadoDiv.appendChild(nombreCiudad);
  resultadoDiv.appendChild(actual);
  resultadoDiv.appendChild(tempMaxima);
  resultadoDiv.appendChild(tempMinima);
  resultadoDiv.appendChild(humedad);





  resultado.appendChild(resultadoDiv);
}

const humedadDatos = humedad => (humedad)
const kelvinACentigrados = grados => parseInt(grados - 273.15);

function limpiarHTML() {
  while(resultado.firstChild) {
    resultado.removeChild(resultado.firstChild);
  }
}

function spinner() {
  
  limpiarHTML();
  
  const divSpinner = document.createElement('div');
  divSpinner.classList.add('spinner');

  divSpinner.innerHTML = `
  <div class="bounce1"></div>
  <div class="bounce2"></div>
  <div class="bounce3"></div>
  `;

  resultado.appendChild(divSpinner);

  
}