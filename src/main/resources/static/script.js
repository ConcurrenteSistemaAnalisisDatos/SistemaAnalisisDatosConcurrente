// Configuración inicial de la gráfica
const margin = { top: 20, right: 30, bottom: 40, left: 50 };
const width = 960 - margin.left - margin.right;
const height = 500 - margin.top - margin.bottom;

// Crear un SVG dentro del div con id 'chart'
const svg = d3.select("#chart")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

// Crear escalas para el eje X (tiempo) y el eje Y (datos procesados por segundo)
const x = d3.scaleTime().range([0, width]);
const y = d3.scaleLinear().range([height, 0]);

// Crear los ejes
const xAxis = d3.axisBottom(x);
const yAxis = d3.axisLeft(y);

// Añadir los ejes al gráfico
svg.append("g")
    .attr("transform", `translate(0,${height})`)
    .attr("class", "x-axis");

svg.append("g")
    .attr("class", "y-axis");

// Datos iniciales de prueba
let data = [];

// Crear la línea que representará el rendimiento
const line = d3.line()
    .x(d => x(d.time))
    .y(d => y(d.rate));

// Función para actualizar la gráfica en tiempo real
function updateChart(newData) {
    // Añadir el nuevo dato al array
    data.push(newData);

    // Mantener solo los últimos 50 puntos en el array (para que la gráfica no crezca indefinidamente)
    if (data.length > 50) {
        data.shift();
    }

    // Actualizar las escalas
    x.domain(d3.extent(data, d => d.time));
    y.domain([0, d3.max(data, d => d.rate)]);

    // Seleccionar la línea y actualizarla con los nuevos datos
    const path = svg.selectAll(".line").data([data]);

    path.enter()
        .append("path")
        .attr("class", "line")
        .merge(path)
        .attr("d", line)
        .attr("fill", "none")
        .attr("stroke", "#007bff")
        .attr("stroke-width", 2);

    // Actualizar los ejes
    svg.select(".x-axis").call(xAxis);
    svg.select(".y-axis").call(yAxis);
}

// Simulación de datos que llegan en tiempo real
function generateRandomData() {
    const now = new Date();
    const rate = Math.round(Math.random() * 100); // Simular un procesamiento de datos aleatorio

    // Actualizar el valor en el DOM
    document.getElementById('data-rate').innerText = rate;

    // Llamar a la función de actualización con el nuevo dato
    updateChart({ time: now, rate: rate });
}

// Actualizar la gráfica cada 2 segundos
setInterval(generateRandomData, 2000);
