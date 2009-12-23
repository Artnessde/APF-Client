/**
 *  ___  ___ ___  ___  ___  ___  ___  _________________________
 *     ||       ||   ||   ||    |    |                         |
 *  ___||       ||   ||___||___ |___ |   A R T N E S S . D E   |
 * |   ||       ||   ||        |    ||  __  ______  __   ____  |
 * |___||       ||   ||___ ____|____||__\/__\    /__\/___\  /__|
 *                                     \/\/  \  /         \/
 * .------------------------------------------\/---------------.
 * |           PHP, MySQL and Javascript development           |
 * '-----------------------------------------------------------'
 *
 * description : ...
 * license     : MIT-style license
 * copyright   : Copyright (c) 2008-2010 Timo Henke
 * url         : http://www.artness.de/
 * authors     : Timo Henke
 *
 * -------------------------------------------------------------
 */

APF.Objects.Areas = new Hash({});

APF.Options.Areas = {
	'togglerTag'	: 'h3',
	'areaTag'		: 'div',
	'show'			: 0,
	'togglerClass'	: 'apf-area-toggler',
	'areaClass'		: 'apf-area',
	'useCookie'		: true
};

	APF.Areas = new Class({

		Implements: [Events, Options, Class.Occlude],

		options: APF.Options.Areas,
		property: 'MooAreas',
	
		initialize: function( container, options )
		{
			this.container = APF.get_target(container);
			if (this.occlude(this.property,this.container)) return this.occluded;
			this.setOptions( options );
			this.init();
			
			if( !this.togglers[this.options.show] )
				this.options.show = 0;
			
			this.showArea(this.options.show);
			window.addEvent('resize', this.reScale.bind(this));
		},
	
		init: function()
		{
			this.areas = this.togglers = {};
			this.togglers = this.container.getElements(this.options.togglerTag);
			this.calculateSize();
			for( var i = 0, l = this.togglers.length; i < l; i++ )
			{
				this.togglers[i].removeEvents('click'); // remove any events first
				this.togglers[i].addEvent('click', this.swapArea.bind(this, i));
				this.areas[i] = this.togglers[i].getNext(this.options.areaTag);
			}
		},
	
		swapArea: function( show )
		{
			if( show == this.options.show)
				return;
	
			for( var i = 0, l = this.togglers.length; i < l; i++ )
			{
				if( i == show )
					this.showArea(i);
				else
					this.hideArea(i);
			}
		},
		
		removeArea: function( i )
		{
			if( i == 0 && this.togglers.length == 1 )
				return;
	
			var td = this.container.getElements(this.options.togglerTag)[i];
			if( td )
			{
				td.getNext(this.options.areaTag).dispose();
				td.dispose();
				this.init();
	
				this.options.show = (this.options.show - 1) < 0 ? 0 : this.options.show-1;
				this.showArea(this.options.show);
			}
		},
		
		addArea: function(togText,conText)
		{
			new Element(this.options.togglerTag,{
				'html' : togText,
				'class' : this.options.togglerClass
			}).inject(this.container,'bottom');
	
			new Element(this.options.areaTag,{
				'html' : conText,
				'class' : this.options.areaClass
			}).inject(this.container,'bottom');
			this.init();
			this.swapArea( this.togglers.length -1 );
		},
	
		hideArea: function( i )
		{
			this.togglers[i].removeClass('active');
			this.areas[i].removeClass('active').setStyle('height',0);
		},
	
		showArea: function( i )
		{
			this.togglers[i].addClass('active');
			this.areas[i].addClass('active').setStyle('height',this.areaheight);
			this.options.show = i;
			if( this.options.useCookie )
				APF.setCookie( this.container.get('id') + '_LastActive', this.options.show );
		},
	
		reScale: function()
		{
			this.calculateSize();
			this.areas[this.options.show].setStyle('height',this.areaheight);
		},
	
		calculateSize: function()
		{
			this.areaheight = this.container.getSize().y;
			for( var i = 0, l = this.togglers.length; i < l; i++ )
				this.areaheight = this.areaheight - this.togglers[i].getSize().y;
		}

	});
