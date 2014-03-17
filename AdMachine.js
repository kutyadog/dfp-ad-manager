/*! adMachine v0.0.3 ~ (c) 2013-2014 ChrisJohnson ~ http://chrisjohnson.net/license.txt */

(function() {
	var useSSL = 'https:' == document.location.protocol;
	var src = (useSSL ? 'https:' : 'http:') + '//www.googletagservices.com/tag/js/gpt_mobile.js';
	document.write('<scr' + 'ipt src="' + src + '"></scr' + 'ipt>');
})();

var xAdMachine;

function AdMachine () {
	this.baseAdUnit = '';
	this.adCount = 1;
	this.ads	 = [];
	

	this.iScrollOn = 1;		// 0 = not using iscroll, 1 = using iscroll
							//		ads in iscroll require divs on top of their iframes to not mess up iscroll functionality
	this.xActiveTouch;		//keeps track of touches and moves


	//-----------the ads
	this.adArray = [];
	
	this.renderAdInDiv = function( xAdUnitEnd, xDiv ) {
		console.debug( 'AdMachine-----------ads array ad: '+ xAdUnitEnd+"-"+xDiv );
		
		if ( ! this.adArray[xDiv] ) {alert('can not find xDiv: '+ xDiv );return;}
		
		//------------------first clear out xDiv to prepare for building ad structure
		var div = document.getElementById(xDiv);
		if ( div ) {
			while(div.firstChild){
			    div.removeChild(div.firstChild);
			}
		} else {
			alert('error 1882733');
		}
		
		if ( ! this.ads[ xAdUnitEnd+"-"+xDiv] ) {
			//--------------------------------------------------------------------------------------
			//			ad does NOT exist yet
			//--------------------------------------------------------------------------------------
			//console.debug( 'AdMachine-----------ad does NOT exist yet' );
			//----------------------------------------build div that will contain the ad
			var xDivID = xDiv+'_container'+ this.adCount;	//'story_ad_top'+xCount;
			//console.debug( xDivID );
			var TargetDiv = document.getElementById(xDivID);
			if ( !TargetDiv ) {
				//console.debug( 'CREATE new!: ');
				TargetDiv = document.createElement("div");
				TargetDiv.id = xDivID;
				document.getElementById( xDiv ).appendChild(TargetDiv);
				
				if (xDivID == undefined) alert('error 28934882'); 
			} else {
				alert( 'it exists!: ');
			}


			//--------------------------------------------------------------build ad div script
			var script = document.createElement("script");
		    script.type = "text/javascript";
			var ad;
			var newAdUnit = this.baseAdUnit +'/'+ xAdUnitEnd;
			
			ad = "googletag.cmd.push(function(){";
			ad += "xAdMachine.ads[ '"+ xAdUnitEnd+"-"+ xDiv+"' ]  = googletag.defineSlot('"+ newAdUnit +"', "+ this.adArray[xDiv].size +",'"+ xDivID +"')";
			ad += ".addService(googletag.pubads())";
			ad += ".setTargeting("+ this.adArray[xDiv].targeting +");";
			ad += "googletag.pubads().enableAsyncRendering();";
			ad += "googletag.pubads().disableInitialLoad();";
			ad += "googletag.enableServices();";
			ad += "xAdMachine.ads[ '"+ xAdUnitEnd+"-"+ xDiv+"' ].divID  = '"+ xDivID +"';";
			ad += "setTimeout(function() { googletag.display('"+ xDivID +"'); }, 10);";
			ad += "setTimeout(function() { googletag.pubads().refresh([ xAdMachine.ads[ '"+ xAdUnitEnd+"-"+ xDiv+"' ] ]); }, 500);";
			ad += "	});";
			
			//console.debug( ad );
			script.text = ad;

			TargetDiv.appendChild(script);
			
			this.adCount += 1;
			
		} else {
			//--------------------------------------------------------------------------------------
			//			ad already exists, so lets rebuild div that contains it and refresh!
			//--------------------------------------------------------------------------------------
			
			console.debug( 'AdMachine-----------ad DOES exist - refresh it' );
			//console.debug( xAdUnitEnd+"-"+xDiv );
			
			//ok first we need to rebuild the correct div for that tag
			var xDivID = this.ads[ xAdUnitEnd+"-"+xDiv].divID;
			console.debug( "NEw ID Form = "+xDivID );
			var TargetDiv = document.getElementById(xDivID);
			if ( !TargetDiv ) {
				TargetDiv = document.createElement("div");
				TargetDiv.id = xDivID;
				
				document.getElementById( xDiv ).appendChild(TargetDiv);
				
				if (xDivID == undefined) alert('error 28934552'); 
			} else {
				alert( 'error 11933222');
			}
			
			//----now that div is there, refresh existing ad
			setTimeout(function() { 
				googletag.pubads().refresh([ xAdMachine.ads[ xAdUnitEnd+"-"+xDiv] ]);
			}, 100);
			//googletag.pubads().refresh([ this.ads[ xAdUnitEnd+"-"+xDiv] ]);
			
		}
	}
	
	this.addAdToDiv = function( xDiv, xContent ) {
		//this is temp code to try all of the top level taxonomy positions
		if ( !xContent ) {
			var topLevelArray = ['Business', 'Entertainment', 'Home', 'Lifestyle', 'Marketplace', 'News', 'Obituaries', 'Opinion', 'Sports', 'Tools'];
			xContent = topLevelArray[ Math.floor((Math.random()*10)) ];
		}
		//xContent = (xContent == '') ? 'News' : xContent;
		console.debug('xContent: '+ xContent);
		var xPreventMove = false;
		
		this.renderAdInDiv( xContent,xDiv);
		
		//-------------------prepare _cover div
		if ( this.iScrollOn ) {
			var xcover = document.getElementById( xDiv + '_cover' );
			if ( xcover ) {
				//alert( xDiv );
				xcover.ontouchstart = function(e) {
					//console.debug('ontouchstart');
					xAdMachine.xActiveTouch = 1;
			    };
				xcover.ontouchmove = function(e) {
					//console.debug('ontouchmove');
					xAdMachine.xActiveTouch = 0;
					if (xPreventMove) e.preventDefault();
			    };
				xcover.ontouchend = function(e) {
					if (xAdMachine.xActiveTouch) {
						//console.debug('its a click through!!!');
						if (e == null) { alert('ouch');e = window.event }	//this.style['pointer-events'] = "none";

						var rect = document.getElementById( xDiv ).getBoundingClientRect();		//console.log(rect.top, rect.right, rect.bottom, rect.left);
						var x = e.changedTouches[0].pageX - rect.left;
						var y = e.changedTouches[0].pageY - rect.top;							//
						//console.debug('its a click through!!! '+ x +', '+ y);

						var iframes = document.getElementById( xDiv ).getElementsByTagName('iframe');
						if ( iframes.length > 0 ) {
							//ad uses iframes
							for (var i=0; i<iframes.length;i++) {
								// Trigger click inside each iframe, if its not the right one, it will recognize this to avoid double click counts
								var iframe = iframes[i], iframeDoc = (iframe.contentDocument) ? iframe.contentDocument : iframe.contentWindow.document;
								var link = iframeDoc.elementFromPoint(x, y);
								if ( link ) {
									var newEvent = iframeDoc.createEvent('HTMLEvents');
									newEvent.initEvent('click', true, true);
									link.dispatchEvent(newEvent);
								} else {
									console.debug('click is null: ');
								}
							}
						} else {
							//there were no iframes in the ad so possibly its just images or something else, figure it out and add the code!!!
							alert( 'this ad uses something besides iframes so figure it out: '+ xDiv );
						}

					}
			    };
			}
		} else {
			//NATURAL scrolling does nto need a cover div for ads/iframes so remove them
			
			//var xcover = document.getElementById( xDiv + '_cover' );
			var myElem = document.getElementById(xDiv + '_cover');
			if (myElem != null) {
				myElem.parentNode.removeChild(myElem);
			}
			
		}
		//-------------------prepare _cover div (end)
	}

	return this;
}