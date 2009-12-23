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

APF.Objects.Progress = new Hash({});

APF.Options.Progress = {
	'container'		: 'ajax_progress',
	'startWidth'	: 0,
	'lastWidth'		: 0,
	'animation' : {
		'fps'			: 128,
		'transition'	: 'linear',
		'duration'		: 250
	}
};

	APF.Progress = new Class({

		Implements: [Options],

		options : APF.Options.Progress,

		initialize: function( options )
		{
			this.setOptions(options);
			this.setContainers();
		},
		
		setContainers: function()
		{
			this.container = APF.get_target( this.options.container )
			if( this.container )
			{
				this.barContainer = this.container.getElement('.bar');
				if( this.barContainer )
				{
					this.options.maxWidth = this.barContainer.getSize().x
					this.bar = this.container.getElement('.progress');
					if( this.bar && this.options.startWidth > 0 )
					{
						this.set(this.options.startWidth);
					}
				}
			}
		},

		set: function(to, usePercentFade)
		{
			var to = to.toFloat() > 100 ? 100 : to.toFloat();
			if( this.options.lastWidth != to )
				this.animate(to,usePercentFade);
		},
		
		setStep: function(step,maxSteps,usePercentFade)
		{
			var to = ((100 / maxSteps) * step).toFloat();
			if( this.options.lastWidth != to )
				this.animate(to,usePercentFade);
		},

		animate: function(to, usePercentFade)
		{
			this.options.lastWidth = to;
			this.bar.set('morph', this.options.animation).morph({
				width : (this.options.maxWidth * ( to / 100) ).toInt(),
				opacity : usePercentFade ? (to / 100).toFloat() : 1.0
			});
		}

	});
