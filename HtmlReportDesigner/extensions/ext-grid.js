/*globals rptEditor, svgedit, svgCanvas, $*/
/*jslint vars: true*/
/*
 * ext-grid.js
 *
 * Licensed under the Apache License, Version 2
 *
 * Copyright(c) 2010 Redou Mine
 * Copyright(c) 2010 Alexis Deveria
 *
 */

// Dependencies:
// 1) units.js
// 2) everything else

rptEditor.addExtension('view_grid', function () {
    'use strict';

    var NS = svgedit.NS,
        svgdoc = document.getElementById('svgcanvas').ownerDocument,
        showGrid = rptEditor.curConfig.showGrid || false,
        assignAttributes = svgCanvas.assignAttributes,
        hcanvas = document.createElement('canvas'),
        canvBG = $('#canvasBackground'),
        units = svgedit.units.getTypeMap(),
        intervals = [0.01, 0.1, 1, 10, 100, 1000];

    $(hcanvas).hide().appendTo('body');

    var canvasGrid = svgdoc.createElementNS(NS.SVG, 'svg');
    assignAttributes(canvasGrid, {
        'id': 'canvasGrid',
        'width': '100%',
        'height': '100%',
        'x': 0,
        'y': 0,
        'overflow': 'visible',
        'display': 'none'
    });
    canvBG.append(canvasGrid);

    // grid-pattern
    var gridPattern = svgdoc.createElementNS(NS.SVG, 'pattern');
    assignAttributes(gridPattern, {
        'id': 'gridpattern',
        'patternUnits': 'userSpaceOnUse',
        'x': 0, //-(value.strokeWidth / 2), // position for strokewidth
        'y': 0, //-(value.strokeWidth / 2), // position for strokewidth
        'width': 100,
        'height': 100
    });

    var gridimg = svgdoc.createElementNS(NS.SVG, 'image');
    assignAttributes(gridimg, {
        'x': 0,
        'y': 0,
        'width': 100,
        'height': 100
    });
    gridPattern.appendChild(gridimg);
    $('#svgroot defs').append(gridPattern);

    // grid-box
    var gridBox = svgdoc.createElementNS(NS.SVG, 'rect');
    assignAttributes(gridBox, {
        'width': '100%',
        'height': '100%',
        'x': 0,
        'y': 0,
        'stroke-width': 0,
        'stroke': 'none',
        'fill': 'url(#gridpattern)',
        'style': 'pointer-events: none; display:visible;'
    });
    $('#canvasGrid').append(gridBox);

    // grid-line-header
    d3.select("#canvasGrid").append('line').attr('id', 'lineh').attr('x1', 0).attr('y1', 200).attr('x2', 10000).attr('y2', 200)
        .attr('stroke-width', 4).attr('stroke', '#FFA500').attr('fill-opacity', 1).attr('stroke-opacity', 1)
        .attr('fill', 'none');

    d3.select('#lineh')
        .call(d3.drag()
            .on("start", dragstarted)
            .on("drag", dragged)
            .on("end", dragended));
    function dragstarted(d) {
        d3.select(this).raise().classed("active", true);
    }

    function dragged(d) {
        d3.select(this).attr("y1", d3.event.y).attr("y2", d3.event.y);
    }

    function dragended(d) {
        d3.select(this).classed("active", false);
    }

    // grid-line-Footer
    var gridLineFoot = svgdoc.createElementNS(NS.SVG, 'line');
    assignAttributes(gridLineFoot, {
        'id': 'linef',
        'x1': 0,
        'y1': 750,
        'x2': 10000,
        'y2': 750,
        'stroke-width': 4,
        'stroke': '#FFA500',
        'fill-opacity': 1,
        'stroke-opacity': 1,
        //'stroke-dasharray': '2,5,3',
        'fill': 'none'
        //'style': 'pointer-events:none'
    });
    $('#canvasGrid').append(gridLineFoot);

    d3.select('#linef')
        .call(d3.drag()
            .on("start", dragstarted)
            .on("drag", dragged)
            .on("end", dragended));

    var orgZoom = 1;
    function updateGrid(zoom) {
        var i;
        // TODO: Try this with <line> elements, then compare performance difference
        var unit = units[rptEditor.curConfig.baseUnit]; // 1 = 1px
        var u_multi = unit * zoom;
        // Calculate the main number interval
        var raw_m = 100 / u_multi;
        var multi = 1;
        for (i = 0; i < intervals.length; i++) {
            var num = intervals[i];
            multi = num;
            if (raw_m <= num) {
                break;
            }
        }
        var big_int = multi * u_multi;

        // Set the canvas size to the width of the container
        hcanvas.width = big_int;
        hcanvas.height = big_int;
        var ctx = hcanvas.getContext('2d');
        var cur_d = 0.5;
        var part = big_int / 20;

        ctx.globalAlpha = 0.2;
        ctx.strokeStyle = rptEditor.curConfig.gridColor;
        for (i = 1; i < 20; i++) {
            var sub_d = Math.round(part * i) + 0.5;
            // var line_num = (i % 2)?12:10;
            var line_num = 0;
            ctx.moveTo(sub_d, big_int);
            ctx.lineTo(sub_d, line_num);
            ctx.moveTo(big_int, sub_d);
            ctx.lineTo(line_num, sub_d);
        }
        ctx.stroke();
        ctx.beginPath();
        ctx.globalAlpha = 0.5;
        ctx.moveTo(cur_d, big_int);
        ctx.lineTo(cur_d, 0);

        ctx.moveTo(big_int, cur_d);
        ctx.lineTo(0, cur_d);
        ctx.stroke();

        var lineh = d3.select('#lineh');
        var linef = d3.select('#linef');
        var y1h = parseInt(lineh.attr("y1")) / orgZoom;
        var y1f = parseInt(linef.attr("y1")) / orgZoom;
        lineh.attr("y1", y1h * zoom).attr("y2", y1h * zoom);
        linef.attr("y1", y1f * zoom).attr("y2", y1f * zoom);
        orgZoom = zoom;

        var datauri = hcanvas.toDataURL('image/png');
        gridimg.setAttribute('width', big_int);
        gridimg.setAttribute('height', big_int);
        gridimg.parentNode.setAttribute('width', big_int);
        gridimg.parentNode.setAttribute('height', big_int);
        svgCanvas.setHref(gridimg, datauri);
    }

    function gridUpdate() {
        if (showGrid) {
            updateGrid(svgCanvas.getZoom());
        }
        $('#canvasGrid').toggle(showGrid);
        $('#view_grid').toggleClass('push_button_pressed tool_button');
    }
    return {
        name: 'view_grid',
        svgicons: rptEditor.curConfig.extPath + 'grid-icon.xml',

        zoomChanged: function (zoom) {
            if (showGrid) { updateGrid(zoom); }
        },
        callback: function () {
            if (showGrid) {
                gridUpdate();
            }
        },
        buttons: [{
            id: 'view_grid',
            type: 'context',
            panel: 'editor_panel',
            title: 'Show/Hide Grid',
            events: {
                click: function () {
                    rptEditor.curConfig.showGrid = showGrid = !showGrid;
                    gridUpdate();
                }
            }
        }]
    };
});
