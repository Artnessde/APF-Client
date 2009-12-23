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
 *
 * Fixed the element.getParent() is not a function bug by not
 * only checking for element but for the getParent() as a
 * function. Told to be fixed on newer builds of Moo-More
 *
 * Ment to work for Moo-More 1.2.4.1+2
 *
 * -------------------------------------------------------------
 */

	APF.Tips = new Class({

		Extends: Tips,

		fireForParent: function(event, element){
			if( element && typeof element.getParent() == 'function' )
			{
				parentNode = element.getParent();
				if (parentNode == document.body) return;
				if (parentNode.retrieve('tip:enter')) parentNode.fireEvent('mouseenter', event);
				else this.fireForParent(parentNode, event);
			}
			else return;
		}

	});
