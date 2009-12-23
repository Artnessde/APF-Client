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

APF.Objects.MiniTree = new Hash({});

APF.Options.MiniTree = {
	'container'		: 'MyTree',
	'selector'		: '.apf-tree li a.folder',
	'hiddenClass'	: 'hidden',
	'openClass'		: 'open',
	'closeClass'	: 'close',
	'overClass'		: 'over',
	'elementParent'	: 'ul',
	'elementOuter'	: 'li',
	'elementInner'	: 'span',
	'nodeClick'		: $empty,
	'setActive'		: false,
	'useCookie'		: true
};

	APF.MiniTree = new Class({

		Implements: [Events, Options],

		options : APF.Options.MiniTree,

		initialize: function( options )
		{
			this.setOptions( options );
			this.container = APF.get_target(this.options.container);
			if( !this.container ) return;
			
			this.container.getElements(this.options.selector).each( function( myTree )
			{
				var UL = myTree.getParent(this.options.elementOuter).getElement(this.options.elementParent) || false;
				if( UL )
				{
					myTree.addClass(UL.hasClass(this.options.hiddenClass) ? this.options.closeClass : this.options.openClass );
					myTree.addEvent('click', function(e){ this.onParenNodeClick(e,myTree,UL); }.bind(this));
				}
				else
				{
					myTree.addEvent('click', function(e){ this.onEndfolderClick(e,myTree); }.bind(this));
				}
				if( myTree.get('rel') )
				{
					myTree.store('NodeConfig', myTree.get('rel').split('::'));

					if( this.options.useCookie && this.options.setActive && myTree.retrieve('NodeConfig')[1] == this.options.setActive )
					{
						this.markSelected(myTree);
						this.options.nodeClick(myTree);
					}
				}

				myTree.addEvent('mouseenter', function(e){ this.onEnter(e,myTree); }.bind(this));
				myTree.addEvent('mouseleave', function(e){ this.onLeave(e,myTree); }.bind(this));
			}.bind(this));
		},

		onParenNodeClick: function(e, elm, UL)
		{
			e.preventDefault();
			e.stop();

			UL.toggleClass(this.options.hiddenClass);

			if(UL.hasClass(this.options.hiddenClass))
				elm.removeClass(this.options.openClass).addClass(this.options.closeClass);
			else
				elm.removeClass(this.options.closeClass).addClass(this.options.openClass);

			this.markSelected(elm);

		},
		
		onEndfolderClick: function(e, elm)
		{
			e.preventDefault();
			e.stop();

			this.markSelected(elm);
			this.options.nodeClick(elm);
		},

		markSelected: function( elm )
		{
			if(this.options.useCookie )
				APF.setCookie( this.container.get('id') + '_ActiveNode', elm.retrieve('NodeConfig')[1] );
				
			this.container.getElements('.selected').removeClass('selected');
			elm.addClass('selected');
			elm.getParent(this.options.elementOuter).addClass('selected');
			elm.getElement(this.options.elementInner).addClass('selected');
		},

		onEnter: function(e, elm)
		{
			e.stop();
			elm.addClass(this.options.overClass);
			elm.getParent(this.options.elementOuter).addClass(this.options.overClass);
			elm.getElement(this.options.elementInner).addClass(this.options.overClass);
		},
		
		onLeave: function(e, elm)
		{
			e.stop();
			elm.removeClass(this.options.overClass);
			elm.getParent(this.options.elementOuter).removeClass(this.options.overClass);
			elm.getElement(this.options.elementInner).removeClass(this.options.overClass);
		}

	});
