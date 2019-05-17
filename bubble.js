// (function() {
    var width = 1024,
        height = 640;

    var svg = d3.select('#chart')
        .append('svg')
        .attr('class', 'background-grey')
        .attr('height', height)
        .attr('width', width)
        .append('g')
        .attr('transform', 'translate(0,0)');

    var defs = svg.append('defs');

    defs.append('pattern')
        .attr('id', 'jon-snow')
        .attr('height', '100%')
        .attr('width', '100%')
        .attr('patternContentUnits', 'objectBoundingBox');

    var forceX = d3.forceX(function (d) {
        if (d.stall === 'Stall A')
            return 230
        else if (d.stall === 'Stall B')
            return 340
        else if (d.stall === 'Stall C')
            return 600
        else
            return 800
    }).strength(0.05)

    var forceY = d3.forceY(function (d) {
        return height / 2
    }).strength(0.05)

    var radiusScale = d3.scaleSqrt().domain([80, 300]).range([10, 80]);
    var simulation = d3.forceSimulation()
        .force('x', forceX)
        .force('y', forceY)
        .force('collide', d3.forceCollide(function (d) {
            return radiusScale(d.price / 20) + 2;
        }));

    d3.queue()
        .defer(d3.csv, 'data.csv')
        .await(ready);

    function ready(error, data) {
        defs.selectAll('.art-pattern')
            .data(data)
            .enter()
            .append('pattern')
            .attr('class', 'art-pattern')
            .attr('id', function (d) {
                return d.name.toLowerCase()
            })
            .attr('height', '100%')
            .attr('width', '100%')
            .attr('patternContentUnits', 'objectBoundingBox')

        var circles = svg.selectAll('.artist')
            .data(data)
            .enter()
            .append('circle')
            .attr('class', 'artist')
            .attr('r', function (d) {
                return radiusScale(d.price / 20)
            })
            .attr('fill', function (d) {
                if (d.stall === 'Stall A')
                    return 'red'
                else if (d.stall === 'Stall B')
                    return 'green'
                else if (d.stall === 'Stall C')
                    return 'blue'
                else
                    return 'orange'
            })
            .text(function (d) {
                return d.name
            })
            .on('click', function (d) {
                return d.name;
            })

        d3.select('#bag').on('click', function () {
            simulation.force('x', forceX)
                .alphaTarget(0.5)
                .restart()
        })

        d3.select('#fun').on('click', function () {
            simulation.force('x', forceY)
                .alphaTarget(0.5)
                .restart()
        })

        d3.select('#combine').on('click', function () {
            simulation.force('x', d3.forceX(width / 2)
                .strength(0.05))
                .alphaTarget(0.5)
                .restart()
        })

        simulation.nodes(data)
            .on('tick', ticked);

        function ticked() {
            circles
                .attr('cx', function (d) {
                    return d.x;
                })
                .attr('cy', function (d) {
                    return d.y;
                })
        }
    }
// })