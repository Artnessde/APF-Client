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

	Element.implement ({
		subtractStyles: function()
		{
			var subX = subY = 0;
			['left','right'].each(function(value){
				subX += this.getStyle('border-'+value+'-width').toInt();
				subX += this.getStyle('padding-'+value).toInt();
				subX += this.getStyle('margin-'+value).toInt();
			}.bind(this));
			['top','bottom'].each(function(value){
				subY += this.getStyle('border-'+value+'-width').toInt();
				subY += this.getStyle('padding-'+value).toInt();
				subY += this.getStyle('margin-'+value).toInt();
			}.bind(this));
			return {
				x : subX,
				y : subY
			}
		}
	});
