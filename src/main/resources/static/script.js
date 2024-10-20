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
    originalData.forEach((entry) => {
        const increment = entry.count / totalChunks;
        totalData[`${entry.gender}-${entry.smoking}`] += increment;
    });

    d3.select("#chart1").selectAll("*").remove();

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

    processedChunks++;
    if (processedChunks >= totalChunks) {
        clearInterval(intervalId); // Detenemos la actualización al completar
    }
}

// Función para el gráfico de enzimas en tiempo real
function updateBarChartEnzymes() {
    originalEnzymeData.forEach((entry) => {
        const incrementSmoker = entry.smoker / totalChunks;
        const incrementNonSmoker = entry.non_smoker / totalChunks;

        totalEnzymeData[`${entry.enzyme}-Smoker`] += incrementSmoker;
        totalEnzymeData[`${entry.enzyme}-NonSmoker`] += incrementNonSmoker;
    });

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

    // Mover la leyenda más a la derecha
    const legendX = width - 56;  // Más a la derecha
    svg.append("rect").attr("x", legendX).attr("y", 10).attr("width", 15).attr("height", 15).style("fill", "#ff5733");
    svg.append("text").attr("x", legendX + 20).attr("y", 20).text("Smoker").style("font-size", "12px").attr("alignment-baseline", "middle");
    svg.append("rect").attr("x", legendX).attr("y", 30).attr("width", 15).attr("height", 15).style("fill", "#3498db");
    svg.append("text").attr("x", legendX + 20).attr("y", 40).text("Non-smoker").style("font-size", "12px").attr("alignment-baseline", "middle");

    processedChunksEnzymes++;
    if (processedChunksEnzymes >= totalChunks) {
        clearInterval(intervalIdEnzymes);
    }
}

// Gráfico 2: Box Plot con leyenda explicativa
function updateBoxPlot() {
    const data = [
        { group: 'Non-smoker', creatinine: [0.6, 0.7, 0.8, 0.6, 0.7] },
        { group: 'Smoker', creatinine: [1.0, 1.2, 1.1, 1.0, 1.3] }
    ];

    d3.select("#chart2").selectAll("*").remove();

    const margin = { top: 20, right: 30, bottom: 40, left: 60 },
        width = 400 - margin.left - margin.right,
        height = 400 - margin.top - margin.bottom;

    const svg = d3.select("#chart2")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    const x = d3.scaleBand()
        .domain(data.map(d => d.group))
        .range([0, width])
        .padding(0.2);

    const y = d3.scaleLinear()
        .domain([0, 2])
        .nice()
        .range([height, 0]);

    svg.append("g")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(x));

    svg.append("g")
        .call(d3.axisLeft(y));

    data.forEach(d => {
        const boxWidth = x.bandwidth() / 2;
        const q1 = d3.quantile(d.creatinine.sort(d3.ascending), 0.25);
        const median = d3.quantile(d.creatinine.sort(d3.ascending), 0.5);
        const q3 = d3.quantile(d.creatinine.sort(d3.ascending), 0.75);
        const iqr = q3 - q1;
        const min = Math.max(q1 - 1.5 * iqr, 0);
        const max = Math.min(q3 + 1.5 * iqr, 2);

        svg.append("rect")
            .attr("x", x(d.group) + boxWidth / 4)
            .attr("y", y(q3))
            .attr("width", boxWidth)
            .attr("height", y(q1) - y(q3))
            .attr("stroke", "black")
            .attr("fill", "#69b3a2");

        svg.append("line")
            .attr("x1", x(d.group) + boxWidth / 4)
            .attr("x2", x(d.group) + 3 * boxWidth / 4)
            .attr("y1", y(median))
            .attr("y2", y(median))
            .attr("stroke", "black");
    });

    // Añadir una descripción del gráfico
    svg.append("text")
        .attr("x", width / 2)
        .attr("y", height + margin.bottom - 10)
        .attr("text-anchor", "middle")
        .style("font-size", "12px")
        .style("font-family", "Arial")
        .text("Distribución de Creatinina en Fumadores y No Fumadores");
}

// Dejar el gráfico 3 en blanco
function updateScatterPlot() {
    d3.select("#chart3").selectAll("*").remove();  // Vaciar cualquier contenido
    // No añadimos nada ya que el gráfico 3 queda en blanco
}

// Ejecutar las funciones para generar los gráficos
intervalId = setInterval(updateBarChart, timePerChunk);  // Gráfico 1
intervalIdEnzymes = setInterval(updateBarChartEnzymes, timePerChunk);  // Gráfico 4 en tiempo real
updateBoxPlot();      // Gráfico 2
updateScatterPlot();  // Gráfico 3 en blanco
