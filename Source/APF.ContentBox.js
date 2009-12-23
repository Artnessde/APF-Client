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

APF.Options.ContentBox = {
	'template'		:	"<div id='CB_Window_Inner'>" +
							"<div id='CB_Headline'>{caption}</div>" +
							"<div id='CB_Close'>{close}</div>" +
							"<div id='CB_Window_Content'>" +
								"<div id='CB_Content'>{content}</div>" +
							"</div>" +
						"</div>",
	'shadow'		: true,
	'shadowBase'	: './web/Shadow/',
	'shadowBGColor'	: 'alpha',
	'shadowFGColor'	: '204e77',
	'shadowBlur'	: '35',
	'shadowAlpha'	: '1.0',
	'attachAuto'	: true
};

	APF.ContentBox = new Class({
		
		Implements: [Events, Options],

		options : APF.Options.ContentBox,

		initialize: function( options )
		{
			this.template = new APF.Template();
			this.setOptions( options );
			this.prepareScreen();
			
			if( this.options.attachAuto )
				this.attach();
		},
		
		attach: function()
		{
			$$('*[rel^="CB::"]').each(function(elm){
				var C = elm.get('rel').split('::');
				
				C[6] = '&nbsp;';

				if( elm.get('href') )
				{
					if( !C[4] ) C[4] = elm.get('href');
					elm.set('href','javascript: void(0);');
				}

				if( elm.get('title') )
				{
					C[5] = elm.get('title');
					elm.erase('title');
				}

				elm.store('CB_Conf',
				{
					'width'				: C[1].toInt(),
					'height'			: C[2].toInt(),
					'typ'				: C[3],
					'target'			: C[4],
					'caption'			: C[5] 
				});
				elm.erase('rel');
				evt = this['showBoxAuto'].bindWithEvent(this, elm);
				elm.store('showBoxAuto', evt).addEvent('click', evt);
			}, this);
		},
		
		showBoxAuto: function( evt, elm )
		{
			evt.stop();
			elm.blur();

			var Config = elm.retrieve('CB_Conf');

			this.prepareScreen();

			if( !$('CB_Window') )
			{
        		new Element('div').setProperty('id', 'CB_Window').injectInside(document.body);
				$('CB_Window').setStyles({'opacity':0,'height':'0px', 'width':'0px'});

				this.template.addMulti({
					'close' : 'X',
					'content' : '<center>please wait</center>'
				});

            	$('CB_Window').innerHTML =	this.template.output(this.options.template,{
            									'caption' : Config.caption
            								});
				evt = this['removeOverlay'].bindWithEvent(this, $('CB_Close'));
				$('CB_Close').store('removeOverlay', evt).addEvent('click', evt);

			}

			if( $('CB_Window') )
			{
				$('CB_Window').setStyles({
					'width' : Config.width+'px',
					'height' : Config.height+'px',
					'opacity' : 1.0,
					'top' : '50%',
					'left' : '50%',
					'margin-top' : ((Config.height / 2)*-1).toInt() + 'px',
					'margin-left' : ((Config.width / 2)*-1).toInt() + 'px'
				});

				if( this.options.shadow )
				{
					$('CB_Window').setStyle(
					'background',	'transparent url(\''+
										(this.options.shadowBase)+'images/'+
										(this.options.shadowBGColor)+'/'+
										(this.options.shadowFGColor)+'/'+
										(this.options.shadowBlur)+'/'+
										(this.options.shadowAlpha)+'/'+
										(Config.width)+'/'+
										(Config.height)+
									'/shadow.png\') no-repeat top left'
					);
				}

				switch( Config.typ )
				{
					case 'inline' :
						$('CB_Content').set('html',$(Config.target).get('html'));
						break;
				}
	
				$('CB_Overlay').setStyle('opacity', 0.75);
			}
			else
			{
				this.removeOverlay();
			}
		},
		
		prepareScreen: function()
		{
			if( !$('CB_OverlayIframe') )
			{
        		new Element('iframe').setProperty('id', 'CB_OverlayIframe').injectInside(document.body);
        		$('CB_OverlayIframe').setStyles({'opacity':0});
        	}

			if( !$('CB_Overlay') )
			{
        		new Element('div').setProperty('id', 'CB_Overlay').injectInside(document.body);
        		$('CB_Overlay').setStyles({'opacity':0});
				evt = this['removeOverlay'].bindWithEvent(this, $('CB_Overlay'));
				$('CB_Overlay').store('removeOverlay', evt).addEvent('click', evt);
			}
		},

		removeOverlay: function()
		{
			if($('CB_Window'))
				$('CB_Window').dispose();
			(function(){
				if($('CB_Overlay'))
					$('CB_Overlay').setStyle('opacity',0);
				if($('CB_OverlayIframe'))	
					$('CB_OverlayIframe').setStyle('opacity',0);
			}).delay(150);
		}

	});
