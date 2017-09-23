/*globals rptEditor, svgCanvas*/
/*jslint eqeq: true*/
/*
 * ext-panning.js
 *
 * Licensed under the MIT License
 *
 * Copyright(c) 2013 Luis Aguirre
 *
 */
 
/* 
	This is a very basic SVG-Edit extension to let tablet/mobile devices panning without problem
*/

rptEditor.addExtension('ext-panning', function() {'use strict';
	return {
		name: 'Extension Panning',
		svgicons: rptEditor.curConfig.extPath + 'ext-panning.xml',
		buttons: [{
			id: 'ext-panning',
			type: 'mode',
			title: 'Panning',
			events: {
				click: function() {
					svgCanvas.setMode('ext-panning');
				}
			}
		}],
		mouseDown: function() {
			if (svgCanvas.getMode() == 'ext-panning') {
				rptEditor.setPanning(true);
				return {started: true};
			}
		},
		mouseUp: function() {
			if (svgCanvas.getMode() == 'ext-panning') {
				rptEditor.setPanning(false);
				return {
					keep: false,
					element: null
				};
			}
		}
	};
});
