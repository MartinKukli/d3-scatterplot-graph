import * as d3 from "d3";

const builder = jsonData => {
  const width = 800;
  const height = 500;

  const tooltip = d3
    .select(".scatterPlot")
    .append("div")
    .attr("id", "tooltip")
    .style("opacity", 0);

  const svg = d3
    .select("#dots")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

  const yearList = jsonData.map(item => item.Year);
  const changeTime = item => {
    const parseTime = item.split(":");
    return new Date(Date.UTC(1970, 0, 1, 0, parseTime[0], parseTime[1]));
  };

  const data = jsonData.map(item => {
    return {
      Doping: item.Doping,
      Name: item.Name,
      Nationality: item.Nationality,
      Time: changeTime(item.Time),
      Year: item.Year
    };
  });

  const timeList = data.map(item => item.Time);

  const xAxisScale = d3
    .scaleLinear()
    .domain([d3.min(yearList) - 1, d3.max(yearList) + 1])
    .range([0, width - 100]);
  const xAxis = d3.axisBottom(xAxisScale).tickFormat(d3.format("d"));
  svg
    .append("g")
    .call(xAxis)
    .attr("id", "x-axis")
    .attr("transform", "translate(40, 480)");

  const yAxisScale = d3
    .scaleTime()
    .domain(d3.extent(timeList))
    .range([height - 20, 5]);
  const yAxis = d3.axisLeft(yAxisScale).tickFormat(d3.timeFormat("%M:%S"));
  svg
    .append("g")
    .call(yAxis)
    .attr("id", "y-axis")
    .attr("transform", "translate(40, 0)");

  svg
    .selectAll("circle")
    .data(data)
    .enter()
    .append("circle")
    .attr("class", "dot")
    .attr("data-xvalue", (d, i) => d.Year)
    .attr("data-yvalue", (d, i) => d.Time.toISOString())
    .attr("cx", d => xAxisScale(d.Year))
    .attr("cy", d => yAxisScale(d.Time))
    .attr("r", 5)
    .attr("transform", "translate(40, 0)")
    .style("fill", d => (d.Doping !== "" ? "#1D59FE" : "#FDA41E"))
    .on("mouseover", (d, i) => {
      tooltip
        .transition()
        .duration(200)
        .style("opacity", 0.9);
      tooltip
        .html(
          `${data[i].Name}: ${data[i].Nationality} <br>
Year: ${data[i].Year} <br>
Time: ${data[i].Time.getMinutes()}:${data[i].Time.getSeconds()} <br>
${data[i].Doping}`
        )
        .attr("data-year", data[i].Year)
        .style("left", `${xAxisScale(d.Year)}px`)
        .style("top", `${yAxisScale(d.Time)}px`)
        .style("transform", "translateX(60px)");
    })
    .on("mouseout", (d, i) => {
      tooltip
        .transition()
        .duration(200)
        .style("opacity", 0);
    });

  svg
    .selectAll(".legend")
    .data(data)
    .enter()
    .append("text")
    .attr("id", "legend")
    .attr("transform", `translate(${width - 270}, ${height / 2})`)
    .attr("font-size", "18px")
    .text("Blue dots = used doping");

  svg
    .selectAll(".legend")
    .data(data)
    .enter()
    .append("text")
    .attr("id", "legend")
    .attr("transform", `translate(${width - 271}, ${height / 2 + 20})`)
    .attr("font-size", "18px")
    .text("Green dots = no doping");
};

d3.json(
  "https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/cyclist-data.json"
)
  .then(jsonData => builder(jsonData))
  .catch(() => console.log("Something is wrong..."));
