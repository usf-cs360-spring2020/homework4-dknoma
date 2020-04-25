/*
 * a lot of this example is hard-coded to match our tableau prototype...
 * and this is a reasonable approach for your own visualizations.
 * however, there are ways to automatically calculate these hard-coded values
 * in our javascript/d3 code.
 */

// showing use of const
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/const

// if you need to change values, use let instead
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/let

// set svg size and plot margins
// const width = 960;
// const height = 500;
// const padding = 20;
// const size = 230;
//
// const columns = {
//   NAME: 'name',
//   COUNT: 'count',
//   K_MEAN: 'k_mean',
//   PAR_MEAN: 'par_mean',
//   FEMALE: 'female',
//   TYPE: 'type',
// };
//
// const types = [1, 2, 3];
//
// const margin = {
//   top: 30,
//   bottom: 35,
//   left: 100,
//   right: 15
// };
//
// const x = d3.scaleLinear()
//             .range([padding / 2, size - padding / 2]);
//
// const y = d3.scaleLinear()
//             .range([size - padding / 2, padding / 2]);
//
// const xAxis = d3.axisBottom()
//                 .scale(x)
//                 .ticks(4);
//
// const yAxis = d3.axisLeft()
//                 .scale(y)
//                 .ticks(4);
//
// const color = d3.scaleOrdinal()
//                 .domain(types)
//                 .range(d3.schemeCategory10);

// select svg
// const svg = d3.select('#scatter-plot');
// console.assert(svg.size() === 1);

// add plot region
// const plot = svg.append('g')
//                 .attr('id', 'plot');

// load data and trigger draw
// d3.csv('Fire_Department_Calls_for_Service_alarms.csv', convert)
//   .then(draw);

// var stratify = d3.stratify()
//                  .parentId(function (d) {
//                    return d.path.substring(0, d.path.lastIndexOf("\\"));
//                  })
//                  .id(function (d) {
//                    return d.path;
//                  });
//
// var data = d3.csvParse(`path,size
// root,0
// root\\child1,10
// root\\child2,20
// `);
//
// var root = stratify(data);
// console.log(root);


let json = d3.json('fdc_data.json')
             .then(draw);






// let data = d3.csvParse('Fire_Department_Calls_for_Service_alarms.csv');
//
// let stratify = d3.stratify()
//                  .id(d => d['Neighborhooods - Analysis Boundaries'])
//                  .parentId(d => d['Call Type Group']);
//
// let root = stratify(data);
//
// let hierarchy = d3.stratify(json);
// console.log(hierarchy);
//
// let data = d3.hierarchy(hierarchy, d => console.log(d));
// console.log(data);

// since we do not need the data for our domains, we can draw our axis/legends right away
// drawAxis();
// drawTitles();
// drawColorLegend();

/*
 * converts values as necessary
 */
function convert(row) {
  // let convert = {};
  //
  // let name = row[columns.NAME];
  // let count = row[columns.COUNT];
  // let kMean = row[columns.K_MEAN];
  // let pMean = row[columns.PAR_MEAN];
  // let female = row[columns.FEMALE];
  // let type = row[columns.TYPE];
  //
  // convert[columns.NAME] = name;
  // convert[columns.TYPE] = parseInt(type);
  // convert[columns.COUNT] = parseInt(count);
  // convert[columns.K_MEAN] = parseFloat(kMean);
  // convert[columns.PAR_MEAN] = parseFloat(pMean);
  // convert[columns.FEMALE] = parseFloat(female);
  //
  // return convert;
  return row;
}

function draw(data) {
  // var root = d3.stratify()
  //              .id(function(d) { return d.name; })
  //              .parentId(function(d) { return d.parent; })
  //              (data);

  // let hierarchy = d3.stratify(data);
  // console.log(hierarchy);

  let json = d3.hierarchy(data);
  console.log(json);

  // console.log(data);

  // console.log('loaded:', data.length, data[0]);
  //
  // drawCells(data);
}

/*
 * draw bars
 */
function drawCells(data) {
  let measures = d3.keys(data[0])
                   .filter(d => d !== columns.NAME && d !== columns.TYPE);
  let rev = [];
  for(let i = measures.length - 1; i >= 0; i--) {
    rev.push(measures[i]);
  }

  let cellN = measures.length;
  let domainByMeasures = {};

  measures.forEach(m => domainByMeasures[m] = d3.extent(data, d => d[m]));

  xAxis.tickSize(size * cellN);
  yAxis.tickSize(-size * cellN);

  console.log(domainByMeasures);
  console.log("measures");
  console.log(measures);
  console.log("rev");
  console.log(rev);


// set svg size
  svg.attr('width', size * cellN + padding + margin.left + margin.right)
     .attr('height', size * cellN + padding + margin.top + margin.bottom);

  plot.attr('transform', 'translate(' + (padding * 3) + ', ' + (padding / 2 + 10) + ')');

  const group = plot.append('g')
                    .attr('id', 'cells');

  group.append('g')
       .append('text')
       .attr('x', 0)
       .attr('y', 0)
       .attr('font-size', '24px')
       .text("Average Earnings of College Students and Their Parents for Each College in the Bay Area");

  group.selectAll('.x.axis')
       .data(rev)
       .enter()
       .append('g')
       .attr('class', 'x axis')
       .attr('transform', (d, i) => 'translate(' + (cellN - i - 1) * size + ', 0)')
       .each(function(d, i) {
         x.domain(domainByMeasures[d]);
         d3.select(this)
           .call(xAxis);

         console.log(i);
         plot.append('g')
             .append('text')
             .attr('x', (cellN - i - 1) * size + size / 2.5)
             .attr('y', size * 4 + padding * 1.2)
             .text(d);
       });

  group.selectAll('.y.axis')
       .data(measures)
       .enter()
       .append('g')
       .attr('class', 'y axis')
       .attr('transform', (d, i) => 'translate(0,' +  i * size + ')')
       .each(function(d, i) {
         y.domain(domainByMeasures[d]);
         d3.select(this)
           .call(yAxis);

         plot.append('g')
             .append('text')
             .attr('class', 'vtext')
             .attr('x', (i + 1) * -size + size / 2.5)
             .attr('y', -30)
             .attr('transform', 'rotate(270)')
             .text(d);
       });

  let cell = plot.selectAll('.cell')
                 .data(cross(rev, measures))
                 .enter()
                 .append('g')
                 .attr('class', 'cell')
                 .attr('transform', d => 'translate(' + (cellN - d.i - 1) * size + ',' + d.j * size + ')')
                 .each(doPlot);

  cell.filter(d => d.x === d.y)
      .append('text')
      .attr('x', padding)
      .attr('y', padding)
      .attr('dy', '.71em')
      .text(d => d.x);

  function doPlot(p) {
    let cell = d3.select(this);

    x.domain(domainByMeasures[p.x]);
    y.domain(domainByMeasures[p.y]);

    cell.append('rect')
        .attr('class', 'frame')
        .attr('x', padding / 2)
        .attr('y', padding / 2)
        .attr('width', size - padding)
        .attr('height', size - padding);

    cell.selectAll('circle')
        .data(data)
        .enter().append('circle')
        .attr('cx', d => x(d[p.x]))
        .attr('cy', d => y(d[p.y]))
        .attr('r', 4)
        .style('fill', d => color(d.type));
  }
}

function cross(a, b) {
  let c = [];
  let n = a.length;
  let m = b.length;

  for (let i = 0; i < n; i++) {
    for (let j = 0; j < m; j++) {
      c.push({
               x: a[i],
               i: i,
               y: b[j],
               j: j
             });
    }
  }

  return c;
}
