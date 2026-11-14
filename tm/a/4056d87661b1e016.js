// JavaScript Document<SCRIPT TYPE="text/javascript">

var currentLayer;

//function that opens and closes layers of Detailed Information
function showHideLayer(idLayer) {
	if(currentLayer != 0) {	
			document.getElementById(currentLayer).style.display = 'none';		
	}
	if(currentLayer != idLayer) {
		document.getElementById(idLayer).style.display = 'inline';
		currentLayer = idLayer;
	}else{
		currentLayer = '';
	}
}

function yesterday() {
	document.getElementById('today').style.display = 'none';
	document.getElementById('tomorrow').style.display = 'none';
	document.getElementById('yesterday').style.display = 'inline';
}

function today() {
	document.getElementById('today').style.display = 'inline';
	document.getElementById('tomorrow').style.display = 'none';
	document.getElementById('yesterday').style.display = 'none';
}

function tomorrow() {
	document.getElementById('today').style.display = 'none';
	document.getElementById('tomorrow').style.display = 'inline';
	document.getElementById('yesterday').style.display = 'none';
}

function toggleMe(a){
  var e=document.getElementById(a);
  if(!e)return true;
  if(e.style.display=="none"){
    e.style.display="block"
  } else {
    e.style.display="none"
  }
  return true;
}