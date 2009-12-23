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

var APF = APFCore = new Hash({

	'Version'	: '1.0.0 beta',

	'Options'	: new Hash({
		'APF'	: new Hash({
			'MouseCoordinates' : {}
		})
	}),

	'Objects'	: new Hash(),

	Navigation: function( navContainer, hasSub )
	{
		var T = APF.get_target(navContainer);
		if( T )
		{
			T.getElements('a').each( function( elm ){
				if( !elm.hasClass('active') && !elm.hasClass('sub') )
				{
					elm.addEvents({
						'mouseenter' : function(){
							elm.addClass('moveover');
						},
						'mouseleave' : function(){
							elm.removeClass('moveover');
						}
					});
				}
			});
			
			if( hasSub )
				APF.Navigation_Dropdown(navContainer);
			
		}
	},

	Navigation_Dropdown: function( navContainer )
	{
		var T = APF.get_target(navContainer);
		if( T )
		{
			T.getElements('li[class="subnavi"]').each( function( elm ){
				elm.addEvents({
					'mouseenter' : function(e){
						e.stop();
						elm.getFirst('a').addClass('activesub');
						elm.getFirst('ul').addClass('insight');
					},
					'mouseleave' : function(e){
						e.stop();
						elm.getFirst('a').removeClass('activesub');
						elm.getFirst('ul').removeClass('insight');
					}
				});
			});
		}
	},

	setCookie: function( n, v )
	{
		Cookie.write('APF_' + n, v, { duration: 25});
	},

	getCookie: function( n )
	{
		return Cookie.read('APF_' + n);
	},

	event_onMouseMove : function( e )
	{
		APF.Options.APF.MouseCoordinates = e.page;
	},

	get_rand: function(multi)
	{
		with( Math ) return (random()*(multi ? multi : 6));
	},

	get_target: function( t )
	{
		switch( $type(t) )
		{
			case 'string'	:
						return document.id(t) ? document.id(t) : false;
						break;
			case 'element' :
						return t;
						break;
			default :
						return false;
						break;
		}
	},

	set_Center: function( elm )
	{
		elm.setStyle('position', 'absolute');
		var parentSize = elm.getParent().getSize();
		var selfSize = elm.getSize();
		if (
			selfSize.y > 0
			&& selfSize.x > 0
			&& selfSize.y < parentSize.y
			&& selfSize.x < parentSize.x
			){
			elm.setStyles({
				'top': '50%',
				'left': '50%',
				'margin-left': (xCorrect = (selfSize.x / 2) * -1) + 'px',
				'margin-top': ((selfSize.y / 2) * -1) + 'px'
			});
		}
	},

	request_ajax: function( opts )
	{
		new Request.HTML({
			method: opts.typ ? opts.typ : 'get',
			url: opts.url,
			update: opts.update ? opts.update : false,
			evalScripts: opts.js ? true : false,
			headers: {
				'X-Requested-With': 'APF-Controller',
				'X-PAGE' : escape( window.location )
			},
			onRequest: function(){
				if(opts.info)
				{
					reqNoteContainer = APF.screenNotify( 'apf-ajax-screen-info' , opts.info );
					APF.set_center(reqNoteContainer);
				}
			},
			onSuccess: function(rt,rxml){
			},
			onComplete: function(){
				if(opts.info && reqNoteContainer) reqNoteContainer.dispose();
			}
		}).send(opts.query);
	},

	notify: function( classToUse, htmlcontent, myID  ){
		return new Element('div').setStyles({
			'z-index'		: 999999,
			'display'		: 'none',
			'position'	: 'absolute',
			'top'			: '0px',
			'left'			: '0px'
		})
		.addClass(classToUse)
		.set('html',htmlcontent)
		.inject(document.body,'top')
		.setStyles({'display' : 'block'})
		.set('id',myID ? myID : 'notify_'+APF.get_rand(8) );
	}

});

document.addEvents({
	'mousemove'	: function(e){	APF.event_onMouseMove(e) }
});
