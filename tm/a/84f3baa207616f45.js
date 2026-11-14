// JavaScript Document
var bann1 = new Image();
bann1.src = "/tm/missing.gif";
var bann2 = new Image();
bann2.src = "/tm/missing.gif";
var bann3 = new Image();
bann3.src = "/tm/missing.gif";
var bann4 = new Image();
bann4.src = "/tm/missing.gif";
var bann5 = new Image();
bann5.src = "/tm/missing.gif";

var cBanner = 0;
var opacity = 100;
var nInterval1, nInterval2, nTimeout;
var i = 0;
var banners = new Array();
	//banenr 1
	banners[0] = "CurrentArticleAssets/images/AdBanners/gabo.jpg";
	//banner 2
	banners[1] = "CurrentArticleAssets/images/AdBanners/islamicUni.jpg";
	//banner 3
	banners[2] = "CurrentArticleAssets/images/AdBanners/18Feb07/hebrewTheater.jpg";
	//banner 4
	banners[3] = "CurrentArticleAssets/images/AdBanners/13Feb07/hamadaSamir.jpg";
	//banner 5
	banners[4] = "CurrentArticleAssets/images/AdBanners/13Feb07/Flowers.jpg";
	
var links = new Array();
	//link 1
	links[0] = "http://www.20at.com/newArticle.php?sid=4792";
	//link 2
	links[1] = "http://www.20at.com/newArticle.php?sid=4844";
	//link 3
	links[2] = "http://www.20at.com/newArticle.php?sid=4702";
	//link 4
	links[3] = "http://www.20at.com/newArticle.php?sid=2075";
	//link 5
	links[4] = "http://www.20at.com/newArticle.php?sid=1704";
	
/*
The Slide function increase the i value by 1
after each second, when the i be greater than 5
it will stop working and call the Fade function
which will fade current banner and show next banner
*/

function Slide() {
	i++;
	nTimeout = window.setTimeout("Slide()", 1200);
	//To change time between each image, default is 5 seconds
	if (i > 7) {
		clearTimeout(nTimeout);
		i = 0;
		nInterval1 = window.setInterval("fadeOut()", 10);
	}
}

function fadeOut() {
	var obj = document.getElementById("Banner");
	var linkObj = document.getElementById("bHref");
	opacity -= 5;
	obj.style.filter = "alpha(opacity= " + opacity + ")";
	if (opacity < 0) {
		clearInterval(nInterval1);
		if (cBanner >= 4) {
			cBanner = 0;
			document.banner.src = banners[cBanner];
			linkObj.href = links[cBanner];
		}
		else {
			cBanner += 1;
			document.banner.src = banners[cBanner];
			linkObj.href = links[cBanner];
		}
		nInterval2 = window.setInterval("fadeIn()", 10);
	}
}

function fadeIn() {
	var obj = document.getElementById("Banner");
	opacity += 5;
	obj.style.filter = "alpha(opacity= " + opacity + ")";
	if (opacity > 100) {
		clearInterval(nInterval2);
		Slide();
	}
}

function toggleVoteToPetition() {
	document.getElementById('voteImage').src='/tm/missing.gif';
	document.getElementById('mainPageVote').style.display='none';
	document.getElementById('petitionImage').src='/tm/missing.gif';
	document.getElementById('mainPagePetition').style.display='inline';
}

function togglePetitionToVote() { 
	document.getElementById('voteImage').src='/tm/missing.gif';
	document.getElementById('mainPageVote').style.display='inline';
	document.getElementById('petitionImage').src='/tm/missing.gif';
	document.getElementById('mainPagePetition').style.display='none';
}


function toggleSiteToBlog() {
	document.getElementById('siteImage').src='/tm/missing.gif';
	document.getElementById('mainSite').style.display='none';
	document.getElementById('blogImage').src='/tm/missing.gif';
	document.getElementById('mainBlog').style.display='inline';
}

function toggleBlogToSite() { 
	document.getElementById('siteImage').src='/tm/missing.gif';
	document.getElementById('mainSite').style.display='inline';
	document.getElementById('blogImage').src='/tm/missing.gif';
	document.getElementById('mainBlog').style.display='none';
}

function toggleSceneToSound() {
	document.getElementById('see').src='/tm/missing.gif';
	document.getElementById('scene').style.display='none';
	document.getElementById('listen').src='/tm/missing.gif';
	document.getElementById('sound').style.display='inline';
}

function toggleSoundToScene() { 
	document.getElementById('see').src='/tm/missing.gif';
	document.getElementById('scene').style.display='inline';
	document.getElementById('listen').src='/tm/missing.gif';
	document.getElementById('sound').style.display='none';
}


function toggleWeatherToPraying() {
	document.getElementById('prayImage').src='/tm/missing.gif';
	document.getElementById('weth').style.display='none';
	document.getElementById('wethImage').src='/tm/missing.gif';
	document.getElementById('pray').style.display='inline';
}

function togglePrayingToWeather() { 
	document.getElementById('prayImage').src='/tm/missing.gif';
	document.getElementById('weth').style.display='inline';
	document.getElementById('wethImage').src='/tm/missing.gif';
	document.getElementById('pray').style.display='none';
}