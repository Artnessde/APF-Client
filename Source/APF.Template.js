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

APF.Options.Template = {}

	APF.Template = new Class({
		
		Implements: [Options],

		options : APF.Options.Template,

		reset: function()
		{
			if( this.options )
				delete this.options;
			this.options = {};
		},

		add: function(k,v)
		{
			this.options[k] = v;
		},

		addMulti: function( options )
		{
			this.setOptions( options );
		},

		remove: function(k)
		{
			if( this.options[k] )
				delete this.options[k];
		},
		
		output: function( template, options )
		{
			this.setOptions( options );
			return template.substitute(this.options);
		}

	});
