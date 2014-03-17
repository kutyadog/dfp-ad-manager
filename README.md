dfp-ad-manager
==============

Keeps track of your Google DFP ads and manages how they are rendered on the screen. Fixes iScroll / iframe scrolling issues that are common for single page web applications.

<h2>To add to your project simply:</h2>
```
<script type="text/javascript" src="AdMachine.js"></script>
```

Then:
```
	xAdMachine = new AdMachine();

	//-------set ad variables for your property
	xAdMachine.baseAdUnit = '/8013/denverpost.com/Mobile-Web';
					
	//------------------------declare ads
	xAdMachine.adArray[ 'section_ad_1' ] = {
		size: '[[300, 50], [320, 50]]', 
		targeting: "'mobile',['mobile_section_top']"
	};
```

First we set a global called ``xAdMachine``, dont change this as it is referenced in the class.

We then declare the base unitName that will be used for all ads. Make sure to change this to your own.

After that we declare an ad. Just for reference, the code below is how we would declare the same ad if we were not using dfp-ad-manager:

```
googletag.cmd.push(function() {
	googletag.defineSlot('/8013/denverpost.com/Mobile-Web', [[300, 50], [320, 50]], 'section_ad_1').setTargeting('mobile',['mobile_section_top']).addService(googletag.pubads());
	googletag.enableServices();
});
```

<h2>HTML code:</h2>
```
<div id="section_ad_1_wrapper" class="inline_ad" style="">
	<div id="section_ad_1_cover" class="ad_cover"></div>
	<div id="section_ad_1" ></div>
</div>
```

The ad is going to go into div with <strong>id="section_ad_1"</strong>.
The other two div's help us deal with the iframe/iscroll scrolling issues (more on that below)
Please note the id naming conventions on the other two div's as they need to be consistent and represent the name of the primary div.


Once the page has rendered, you can refresh the adspot dynamically by calling:
```
xAdMachine.addAdToDiv( 'section_ad_1' );
```

Note that the 'section_ad_1' is the ID of the div that you want to put the ad into.

<h2>Solving the iScroll / iframe scrolling issue</h2>
I often build html5 single page web applications. If you have tried putting an iframe inside of a scrolling area you will know that it will 'break' the scrolling. This is a problem if you want to use DFP ad tags inside any of these scrolling areas. I fix this by inserting 'cover' divs in front of the ads. This 'ad_cover':
* Is invisible
* Matches the size of the ad
* Is on top of the ad (z-index)
* Blocks the users ability to scroll through the iframe that contains the ad
* Ignores all touchmove events on it
* passes clicks through to the ad below dynamically using 'dispatchEvent'


<h2>And finally</h2>

Note that this system tends to be hit and miss if you are not using it on the set domains that the ads are meant for. When i run it on localhost the ads render about 50% of the time. When i push to production, it works 100% of the time.

If you have any questions, let me know. Hopefully this saves someone the trouble I had in dealing with this issue.

Chris Johnson - kutyadog@gmail.com