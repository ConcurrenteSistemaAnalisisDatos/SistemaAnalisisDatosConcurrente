let totalData = {
    "F-Non-smoker": 0,
    "F-Smoker": 0,
    "M-Non-smoker": 0,
    "M-Smoker": 0
};

// Datos originales para sumar progresivamente
const originalData = [
    { gender: 'F', smoking: 'Non-smoker', count: 360 },
    { gender: 'F', smoking: 'Smoker', count: 22 },
    { gender: 'M', smoking: 'Non-smoker', count: 260 },
    { gender: 'M', smoking: 'Smoker', count: 356 }
];

let processedChunks = 0;
const totalChunks = 50; // Total de intervalos para dividir la carga
const timePerChunk = 400; // Tiempo por intervalo en milisegundos

function updateBarChart() {
    // En cada intervalo, sumamos progresivamente los datos
    originalData.forEach((entry) => {
        const increment = entry.count / totalChunks; // Incremento por cada intervalo
        totalData[`${entry.gender}-${entry.smoking}`] += increment;
    });

    // Limpiar el gráfico anterior
    d3.select("#chart1").selectAll("*").remove();

    // Configuración de la visualización
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

    // Escalas
    const x = d3.scaleBand()
        .domain(data.map(d => `${d.gender} - ${d.smoking}`))
        .range([0, width])
        .padding(0.2);

    const y = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.count)])
        .nice()
        .range([height, 0]);

    // Ejes
    svg.append("g")
        .attr("class", "x-axis")
        .attr("transform", `translate(0, ${height})`)
        .call(d3.axisBottom(x))
        .selectAll("text")
        .attr("transform", "rotate(45)")
        .style("text-anchor", "start");

    svg.append("g")
        .attr("class", "y-axis")
        .call(d3.axisLeft(y).ticks(10));

    // Barras
    svg.selectAll(".bar")
        .data(data)
        .enter()
        .append("rect")
        .attr("class", "bar")
        .attr("x", d => x(`${d.gender} - ${d.smoking}`))
        .attr("y", d => y(d.count))
        .attr("width", x.bandwidth())
        .attr("height", d => height - y(d.count));

    // Etiquetas de ejes
    svg.append("text")
        .attr("x", -(height / 2))
        .attr("y", -40)
        .attr("transform", "rotate(-90)")
        .attr("text-anchor", "middle")
        .attr("class", "axis-label")
        .text("Count");

    svg.append("text")
        .attr("x", width / 2)
        .attr("y", height + 35)
        .attr("text-anchor", "middle")
        .attr("class", "axis-label")
        .text("Gender - Smoking Status");

    // Verificamos si ya hemos procesado todos los intervalos
    processedChunks++;
    if (processedChunks >= totalChunks) {
        clearInterval(intervalId); // Detenemos la actualización una vez que alcanzamos el total
    }
}

// Actualizamos el gráfico cada 400ms para completar en 20 segundos
const intervalId = setInterval(updateBarChart, timePerChunk);
