/*globals jQuery*/
/*jslint vars: true, eqeq: true, forin: true*/
/*
 * Localizing script for SVG-edit UI
 *
 * Licensed under the MIT License
 *
 * Copyright(c) 2010 Narendra Sisodya
 * Copyright(c) 2010 Alexis Deveria
 *
 */

// Dependencies
// 1) jQuery
// 2) svgcanvas.js
// 3) svg-editor.js

var rptEditor = (function($, editor) {'use strict';

	var lang_param;
	
	function setStrings(type, obj, ids) {
		// Root element to look for element from
		var i, sel, val, $elem, elem, node, parent = $('#svg_editor').parent();
		for (sel in obj) {
			val = obj[sel];
			if (!val) {console.log(sel);}
			
			if (ids) {sel = '#' + sel;}
			$elem = parent.find(sel);
			if ($elem.length) {
				elem = parent.find(sel)[0];
				
				switch ( type ) {
					case 'content':
						for (i = 0; i < elem.childNodes.length; i++) {
							node = elem.childNodes[i];
							if (node.nodeType === 3 && node.textContent.replace(/\s/g,'')) {
								node.textContent = val;
								break;
							}
						}
						break;
					
					case 'title':
						elem.title = val;
						break;
				}
				
				
			} else {
				console.log('Missing: ' + sel);
			}
		}
	}

	editor.readLang = function(langData) {
		var more = editor.canvas.runExtensions('addlangData', lang_param, true);
		$.each(more, function(i, m) {
			if (m.data) {
				langData = $.merge(langData, m.data);
			}
		});
		
		// Old locale file, do nothing for now.
		if (!langData.tools) {return;}

        var tools = langData.tools,
            misc = langData.misc,
            properties = langData.properties,
            config = langData.config,
            layers = langData.layers,
            common = langData.common,
            ui = langData.ui,
            field = langData.field;
		
		setStrings('content', {
			// copyrightLabel: misc.powered_by, // Currently commented out in svg-editor.html
			curve_segments: properties.curve_segments,
			fitToContent: tools.fitToContent,
			fit_to_all: tools.fit_to_all,
			fit_to_canvas: tools.fit_to_canvas,
			fit_to_layer_content: tools.fit_to_layer_content,
			fit_to_sel: tools.fit_to_sel,
			
			icon_large: config.icon_large,
			icon_medium: config.icon_medium,
			icon_small: config.icon_small,
			icon_xlarge: config.icon_xlarge,
			image_opt_embed: config.image_opt_embed,
			image_opt_ref: config.image_opt_ref,
			includedImages: config.included_images,
			
		
			
			layersLabel: layers.layers,
			
			
			selLayerLabel: layers.move_elems_to,
			selectedPredefined: config.select_predefined,
			
		
		
			straight_segments: properties.straight_segments,
			
			svginfo_bg_url: config.editor_img_url + ":",
			svginfo_bg_note: config.editor_bg_note,
			svginfo_change_background: config.background,
			svginfo_dim: config.doc_dims,
			svginfo_editor_prefs: config.editor_prefs,
			svginfo_height: common.height,
			svginfo_icons: config.icon_size,
			svginfo_image_props: config.image_props,
			svginfo_lang: config.language,
			svginfo_title: config.doc_title,
			svginfo_width: common.width,
			
			tool_docprops_cancel: common.cancel,
			tool_docprops_save: common.ok,

			tool_source_cancel: common.cancel,
			tool_source_save: common.ok,
			
			tool_prefs_cancel: common.cancel,
			tool_prefs_save: common.ok,

			sidepanel_handle: layers.layers.split('').join(' '),

			tool_clear: tools.new_doc,
			tool_docprops: tools.docprops,
			tool_export: tools.export_img,
			tool_import: tools.import_doc,
			//tool_imagelib: tools.imagelib,
			tool_open: tools.open_doc,
			tool_save: tools.save_doc,
			
			svginfo_units_rulers: config.units_and_rulers,
			svginfo_rulers_onoff: config.show_rulers,
			svginfo_unit: config.base_unit,
			
			svginfo_grid_settings: config.grid,
			svginfo_snap_onoff: config.snapping_onoff,
			svginfo_snap_step: config.snapping_stepsize,
			svginfo_grid_color: config.grid_color
		}, true);
		
		// Shape categories
		var o, cats = {};
		//for (o in langData.shape_cats) {
		//	cats['#shape_cats [data-cat="' + o + '"]'] = langData.shape_cats[o];
		//}
		
		// TODO: Find way to make this run after shapelib ext has loaded
		setTimeout(function() {
			setStrings('content', cats);
		}, 2000);
		
		// Context menus
		var opts = {};
		$.each(['cut','copy','paste', 'paste_in_place', 'delete', 'group', 'ungroup', 'move_front', 'move_up', 'move_down', 'move_back'], function() {
			opts['#cmenu_canvas a[href="#' + this + '"]'] = tools[this];
		});

		$.each(['dupe','merge_down', 'merge_all'], function() {
			opts['#cmenu_layers a[href="#' + this + '"]'] = layers[this];
		});

		opts['#cmenu_layers a[href="#delete"]'] = layers.del;
		
		setStrings('content', opts);
		
		setStrings('title', {
			
			
			fill_color: properties.fill_color,
			font_family: properties.font_family,
			idLabel: properties.id,
			image_height: properties.image_height,
			image_url: properties.image_url,
			image_width: properties.image_width,
			layer_delete: layers.del,
			layer_down: layers.move_down,
			layer_new: layers['new'],
			layer_rename: layers.rename,
			layer_moreopts: common.more_opts,
			layer_up: layers.move_up,
			
			linecap_butt: properties.linecap_butt,
			linecap_round: properties.linecap_round,
			linecap_square: properties.linecap_square,
			linejoin_bevel: properties.linejoin_bevel,
			linejoin_miter: properties.linejoin_miter,
			linejoin_round: properties.linejoin_round,
			main_icon: tools.main_menu,
			
			//tools_shapelib_show: tools.mode_shapelib,
			palette: ui.palette_info,
			zoom_panel: ui.zoom_level,
			path_node_x: properties.node_x,
			path_node_y: properties.node_y,
			rect_height_tool: properties.rect_height,
            rect_width_tool: properties.rect_width,
            filed_name_tool: field.fieldName,
			seg_type: properties.seg_type,
			selLayerNames: layers.move_selected,
			selected_x: properties.pos_x,
			selected_y: properties.pos_y,
			stroke_color: properties.stroke_color,
			stroke_style: properties.stroke_style,
			stroke_width: properties.stroke_width,
			svginfo_title: config.doc_title,
			text: properties.text_contents,
			toggle_stroke_tools: ui.toggle_stroke_tools,
			tool_add_subpath: tools.add_subpath,
			
			
		
			tool_bold: properties.bold,
			
			tool_clone: tools.clone,
		
			tool_delete: tools.del,
			
		
			
			tool_font_size: properties.font_size,
		
			tool_link_url: tools.set_link_url,
			tool_image: tools.mode_image,
			tool_italic: properties.italic,
			tool_line: tools.mode_line,
			tool_move_bottom: tools.move_bottom,
			tool_move_top: tools.move_top,
			tool_node_clone: tools.node_clone,
			tool_node_delete: tools.node_delete,
			tool_node_link: tools.node_link,
			tool_opacity: properties.opacity,
			tool_openclose_path: tools.openclose_path,
			
		
            tool_rect: tools.mode_rect,
            tool_field: tools.mode_field,
			tool_redo: tools.redo,
			
			tool_select: tools.mode_select,
			tool_source: tools.source_save,
			tool_square: tools.mode_square,
			tool_text: tools.mode_text,
			tool_undo: tools.undo,
			tool_ungroup: tools.ungroup,
			tool_wireframe: tools.wireframe_mode,
			view_grid: tools.toggle_grid,
			url_notice: tools.no_embed

        }, true);
		editor.setLang(lang_param, langData);
	};

	editor.putLocale = function (given_param, good_langs) {
	
		if (given_param) {
			lang_param = given_param;
		}
		else {
			lang_param = $.pref('lang');
			if (!lang_param) {
				if (navigator.userLanguage) { // Explorer
					lang_param = navigator.userLanguage;
				}
				else if (navigator.language) { // FF, Opera, ...
					lang_param = navigator.language;
				}
				if (lang_param == null) { // Todo: Would cause problems if uiStrings removed; remove this?
					return;
				}
			}
			
			console.log('Lang: ' + lang_param);
			
			// Set to English if language is not in list of good langs
			if ($.inArray(lang_param, good_langs) === -1 && lang_param !== 'test') {
				lang_param = "en";
			}
	
			// don't bother on first run if language is English		
			// The following line prevents setLang from running
			//    extensions which depend on updated uiStrings,
			//    so commenting it out.
			// if (lang_param.indexOf("en") === 0) {return;}

		}
		
		var conf = editor.curConfig;
		
		var url = conf.langPath + "lang." + lang_param + ".js";
		
		$.getScript(url, function(d) {
			// Fails locally in Chrome 5+
			if (!d) {
				var s = document.createElement('script');
				s.src = url;
				document.querySelector('head').appendChild(s);
			}
		});
		
	};
	
	return editor;
}(jQuery, rptEditor));
