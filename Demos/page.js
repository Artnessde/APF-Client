	
page = {

	mouseCoords : {},
	domReady: function()
	{

	//	--------------------------------------
	//	Do the APF ...
	//	--------------------------------------

		APF.Objects.Areas.LeftNav = new APF.Areas( document.id('myArea'),{
			'show' : APF.getCookie( 'myArea_LastActive' )
		});
		APF.Objects.ContentBox = new APF.ContentBox();

		APF.Objects.MiniTree.Mailbox = new APF.MiniTree({
			'container'	: 'MailBox',
			'selector'	: 'li a.folder',
			'setActive'	: APF.getCookie( 'MailBox_ActiveNode'),
			'useCookie' : true, // false,
			'nodeClick'	: function(elm){
				
				var C = elm.retrieve('NodeConfig');
				var T = C[0], V = C[1];
				if(document.id(T))
				{
					APF.setCookie('Webmail_Folder',V);
					document.id(T).set('html','Opening Folder: ' + V);
					(function(){
						document.id('APF_Content_Right_Bottom').set('html','Loading Content of 1st Mail in ' + V);
					})();
				}
			}
		});

		APF.Navigation('APF_PageNav', true);
		APF.Objects.Progress.Loading = new APF.Progress();

	//	--------------------------------------
	//	Add Dragbars
	//	--------------------------------------
	
		APF.Objects.Resizeables = new Hash();

		APF.Objects.Resizeables.LeftH = new Resizable('APF_PageColumnDrag_handle',{
			limit: { x: [128,480], y: false },
			cookie: 'APF_AreasLeft',
			toHide : 'div',
			addToResizableLimits: true
		});

		APF.Objects.Resizeables.RightV = new Resizable('APF_PageRowDrag_handle',{
			limit: { x: false, y: [64,256] },
			mode : 'vertical',
			cookie: 'APFMail_ResizeRightSplit',
			addToResizableLimits: true
		});

		ResizableLimits.attach();

	//	--------------------------------------
	//	Add No-Focus to all Links
	//	--------------------------------------

		document.getElements('a').setStyle('outline',0);

	},

	pageLoaded: function()
	{
	},

	pageScrolled: function()
	{
	},

	pageResize: function()
	{
	}
}

window.addEvents({
	'domready'	: function(){ page.domReady() },
	'load'		: function(){ page.pageLoaded() },
	'resize'	: function(){ page.pageResize() },
	'scroll'	: function(){ page.pageScrolled() }
});
