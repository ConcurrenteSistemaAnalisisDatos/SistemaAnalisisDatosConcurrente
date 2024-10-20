// Variables comunes para el gráfico 1 (Fumadores y no fumadores)
const totalChunks = 50; // Total de intervalos para dividir la carga
const timePerChunk = 400; // Tiempo por intervalo en milisegundos
let processedChunks = 0;
let intervalId;

// Datos originales para el gráfico 1
const totalData = {
    "F-Non-smoker": 0,
    "F-Smoker": 0,
    "M-Non-smoker": 0,
    "M-Smoker": 0
};

const originalData = [
    { gender: 'F', smoking: 'Non-smoker', count: 360 },
    { gender: 'F', smoking: 'Smoker', count: 22 },
    { gender: 'M', smoking: 'Non-smoker', count: 260 },
    { gender: 'M', smoking: 'Smoker', count: 356 }
];

// Variables específicas para el gráfico 4 (Enzimas)
let processedChunksEnzymes = 0;
let intervalIdEnzymes;
let totalEnzymeData = {
    "AST-Smoker": 0,
    "AST-NonSmoker": 0,
    "ALT-Smoker": 0,
    "ALT-NonSmoker": 0,
    "Gtp-Smoker": 0,
    "Gtp-NonSmoker": 0
};

const originalEnzymeData = [
    { enzyme: 'AST', smoker: 27.6, non_smoker: 23.9 },
    { enzyme: 'ALT', smoker: 29.5, non_smoker: 22.7 },
    { enzyme: 'Gtp', smoker: 53.1, non_smoker: 27.3 }
];

// Función para actualizar el primer gráfico (Bar Chart Fumadores y no fumadores)
function updateBarChart() {
    // Progresivamente sumamos los datos
    originalData.forEach((entry) => {
        const increment = entry.count / totalChunks;
        totalData[`${entry.gender}-${entry.smoking}`] += increment;
    });

    // Limpiamos el gráfico anterior
    d3.select("#chart1").selectAll("*").remove();

    // Configuración de dimensiones y márgenes
    const margin = { top: 20, right: 30, bottom: 40, left: 60 },
        width = 400 - margin.left - margin.right,
        height = 400 - margin.top - margin.bottom;

    const svg = d3.select("#chart1")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    const data = [
        { gender: 'F', smoking: 'Non-smoker', count: totalData["F-Non-smoker"] },
        { gender: 'F', smoking: 'Smoker', count: totalData["F-Smoker"] },
        { gender: 'M', smoking: 'Non-smoker', count: totalData["M-Non-smoker"] },
        { gender: 'M', smoking: 'Smoker', count: totalData["M-Smoker"] }
    ];

    const x = d3.scaleBand()
        .domain(data.map(d => `${d.gender}-${d.smoking}`))
        .range([0, width])
        .padding(0.2);

    const y = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.count)])
        .nice()
        .range([height, 0]);

    svg.append("g")
        .attr("class", "x-axis")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(x))
        .selectAll("text")
        .attr("transform", "rotate(45)")
        .style("text-anchor", "start");

    svg.append("g")
        .attr("class", "y-axis")
        .call(d3.axisLeft(y).ticks(10));

    svg.selectAll(".bar")
        .data(data)
        .enter()
        .append("rect")
        .attr("class", "bar")
        .attr("x", d => x(`${d.gender}-${d.smoking}`))
        .attr("y", d => y(d.count))
        .attr("width", x.bandwidth())
        .attr("height", d => height - y(d.count))
        .attr("fill", "#69b3a2");

    // Verificación del progreso
    processedChunks++;
    if (processedChunks >= totalChunks) {
        clearInterval(intervalId); // Detenemos la actualización al completar
    }
}

// Función para el gráfico de enzimas en tiempo real
function updateBarChartEnzymes() {
    // Incremento progresivo de los datos
    originalEnzymeData.forEach((entry) => {
        const incrementSmoker = entry.smoker / totalChunks;
        const incrementNonSmoker = entry.non_smoker / totalChunks;

        totalEnzymeData[`${entry.enzyme}-Smoker`] += incrementSmoker;
        totalEnzymeData[`${entry.enzyme}-NonSmoker`] += incrementNonSmoker;
    });

    // Limpiar gráfico anterior
    d3.select("#chart4").selectAll("*").remove();

    const margin = { top: 20, right: 30, bottom: 40, left: 60 },
        width = 400 - margin.left - margin.right,
        height = 400 - margin.top - margin.bottom;

    const svg = d3.select("#chart4")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    const data = [
        { enzyme: 'AST', smoker: totalEnzymeData["AST-Smoker"], non_smoker: totalEnzymeData["AST-NonSmoker"] },
        { enzyme: 'ALT', smoker: totalEnzymeData["ALT-Smoker"], non_smoker: totalEnzymeData["ALT-NonSmoker"] },
        { enzyme: 'Gtp', smoker: totalEnzymeData["Gtp-Smoker"], non_smoker: totalEnzymeData["Gtp-NonSmoker"] }
    ];

    const x = d3.scaleBand()
        .domain(data.map(d => d.enzyme))
        .range([0, width])
        .padding(0.2);

    const y = d3.scaleLinear()
        .domain([0, d3.max(data, d => Math.max(d.smoker, d.non_smoker))])
        .nice()
        .range([height, 0]);

    svg.append("g")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(x));

    svg.append("g")
        .call(d3.axisLeft(y));

    // Barras para fumadores
    svg.selectAll(".bar.smoker")
        .data(data)
        .enter()
        .append("rect")
        .attr("class", "bar smoker")
        .attr("x", d => x(d.enzyme))
        .attr("y", d => y(d.smoker))
        .attr("width", x.bandwidth() / 2)
        .attr("height", d => height - y(d.smoker))
        .attr("fill", "#ff5733");

    // Barras para no fumadores
    svg.selectAll(".bar.non-smoker")
        .data(data)
        .enter()
        .append("rect")
        .attr("class", "bar non-smoker")
        .attr("x", d => x(d.enzyme) + x.bandwidth() / 2)
        .attr("y", d => y(d.non_smoker))
        .attr("width", x.bandwidth() / 2)
        .attr("height", d => height - y(d.non_smoker))
        .attr("fill", "#3498db");

    // Verificación del progreso
    processedChunksEnzymes++;
    if (processedChunksEnzymes >= totalChunks) {
        clearInterval(intervalIdEnzymes); // Detenemos la actualización una vez que alcanzamos el total
    }
}

// Ejecutar las funciones para generar los gráficos
intervalId = setInterval(updateBarChart, timePerChunk);  // Gráfico 1
intervalIdEnzymes = setInterval(updateBarChartEnzymes, timePerChunk);  // Gráfico 4 en tiempo real
updateBoxPlot();      // Gráfico 2
updateScatterPlot();  // Gráfico 3
