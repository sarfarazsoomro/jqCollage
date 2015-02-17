$("document").ready(
function()
{
  var width = 1100;
  var height = 600;
  var top = 0;
  var left = 0;

  var contents = new Array();
  $(".collage-main ul li>img").each(
  function()
  {
    contents.push( { "type":"img", "src":$(this).attr( "src" ), "title":$(this).attr("title") } );
  }
  );

  $(".collage-main").html("");
  
  var recArr = new Array(
    {"width": width, "height":height, "top":top, "left":left}
  );

  recArr = splitRect( recArr, 17 );
  recArr = arrayShuffle(recArr);
//  console.log("calling div markup proc");
//  console.log(recArr);
  var markupArr = getDivsMarkup(recArr);
  $(".collage-main").css({"width":width, "height":height});
  //animateMarkup( markupArr );
  for( i=0; i<markupArr.length;i++ )
  {
    $(".collage-main").append( markupArr[i] );
  }
  var i = -1;
  var arr = $(".collage-item");
  (function(){
  if(arr[++i])
  $(arr[i]).animate({width:recArr[i]["width"]+"px", height:recArr[i]["height"]+"px"}, 100, "linear", arguments.callee);
  })();

}
);

function splitRect( rectArr, itemCount )
{
  var newCount = rectArr.length;
  var newArr = new Array();

  var minWidth = 100;
  var minHeight = 100;

  if( rectArr.length < itemCount )
  {
    for( i=0;i<rectArr.length;i++ )
    {
      var pushDone = false;
      var direction = Math.floor(Math.random()* 2 );
      //1=X-axis i.e divide vertically
      if( ( direction == 1 && rectArr[i]["skip-x"] == null ) || ( rectArr[i]["skip-x"] == null && rectArr[i]["skip-y"] == true )  )
      {
        //console.log("dividing along X - Vertically");

        //we need to make sure that we don't create regions smaller that min width X min height defaults
        //first chk if the width of current rect can accomodate min 2 rects
        if( rectArr[i]["width"] >= (2*minWidth) )
        {
          var w1 = getRandInRange( minWidth+1, rectArr[i]["width"]-minWidth );
          //var w1 = getRandInRange( Math.floor( rectArr[i]["width"]/2 ), rectArr[i]["width"]-minWidth );
          var w2 = rectArr[i]["width"] - w1;
          
          var h1 = rectArr[i]["height"];
          var h2 = rectArr[i]["height"];

          var newRec1 = {"width":w1, "height":h1, "top":rectArr[i]["top"], "left":rectArr[i]["left"]};
          var newRec2 = {"width": w2, "height":h2, "top":rectArr[i]["top"], "left":rectArr[i]["left"]+w1};
          newCount++;
          newArr.push( newRec1, newRec2 );
          pushDone = true;
        }
        else
        {
          rectArr[i]["skip-x"] = true;
          direction = 0;
        }
      }
      //0=Y-axis i.e. divide horizantly
      if ( ( direction == 0 && rectArr[i]["skip-y"] == null ) || ( rectArr[i]["skip-y"] == null && rectArr[i]["skip-x"] == true ) )
      {
        //console.log("dividing along Y - Horizantally");
        if( rectArr[i]["height"] >= (2*minHeight) )
        {
          var h1 = getRandInRange( minHeight+1, rectArr[i]["height"]-minHeight );
          //var h1 = getRandInRange( Math.floor( rectArr[i]["height"]/2 ), rectArr[i]["height"]-minHeight );
          var h2 = rectArr[i]["height"] - h1;

          var w1 = rectArr[i]["width"];
          var w2 = rectArr[i]["width"];
          
          var newRec1 = {"width":w1, "height":h1, "top":rectArr[i]["top"], "left":rectArr[i]["left"]};
          var newRec2 = {"width":w2, "height":h2, "top":rectArr[i]["top"]+h1, "left":rectArr[i]["left"]};

          newCount++;
          newArr.push( newRec1, newRec2 );
          pushDone = true;
        }
        else
        {
          rectArr[i]["skip-y"] = true;
          if( rectArr[i]["skip-x"] == true || rectArr[i]["width"] < (2*minWidth))
          {
            rectArr[i]["skip-x"] = true;
            newArr.push(rectArr[i]);
            pushDone = true;
          }
        }
      }

      if( pushDone == false )
      {
        newArr.push(rectArr[i]);
      }

      //console.log( "Item count is now : "+newCount );
      if( newCount == itemCount )
      {
        newArr = newArr.concat( rectArr.slice( i+1 ) );
        //console.log( "Breaking out of loop" );
        break;
      }
    }
  }
//  console.log(newArr);
//  console.log( "Original Area:"+calcArea( rectArr ) );
//  console.log( "Covered Area So Far:"+calcArea( newArr ) );

  var skipped = false;
  for( i=0;i<newArr.length;i++ )
  {
    if( newArr[i]["skip-x"] == null || newArr[i]["skip-y"] == null )
    {
      skipped = skipped || true;
      break;
    }
  }

  if( newArr.length < itemCount && skipped == true )
  {
    newArr = splitRect( newArr, itemCount );
  }
  return newArr;
}

function calcArea( rectArr )
{
  area = 0;
  for( i=0;i<rectArr.length;i++ )
  {
    area+=rectArr[i]["width"]*rectArr[i]["height"];
  }
  return area;
}

function getDivsMarkup( rectArr )
{
  markup = new Array();
  for( i=0;i<rectArr.length;i++ )
  {
    markup.push( getDivMarkup(rectArr[i], i+1) );
  }
  return markup;
}

function getDivMarkup(rect, text)
{
  var n=Math.floor( 255 * Math.random() );
  var bg_color = "background-color:rgb("+Math.floor( 255 * Math.random() )+","+Math.floor( 255 * Math.random() )+","+Math.floor( 255 * Math.random() )+");";
  //var bg_color = "background-color:rgb("+n+","+n+","+n+");";
  //return '<div class="collage-item" style="margin-top:'+rect["top"]+'px;margin-left:'+rect["left"]+'px;width:'+rect["width"]+'px;height:'+rect["height"]+'px;'+bg_color+'display:none;" >'+text+'</div>'
  return '<div class="collage-item" style="margin-top:'+rect["top"]+'px;margin-left:'+rect["left"]+'px;'+bg_color+'display:none;" >'+text+'</div>'
}

function getRandInRange(Num1, Num2)
{
  return Num1+Math.floor((Num2-Num1)*Math.random());
}

function animateMarkup( markupArr )
{
  if( markupArr.length > 0 )
  {
    var singleDiv = markupArr.pop();
    //console.log( singleDiv );
    $(".collage-main").append( singleDiv );
    $(".collage-main div:last").show( "slow", animateMarkup(markupArr) );
  }
}

function arrayShuffle(oldArray) {
	var newArray = oldArray.slice();
 	var len = newArray.length;
	var i = len;
	 while (i--) {
	 	var p = parseInt(Math.random()*len);
		var t = newArray[i];
  		newArray[i] = newArray[p];
	  	newArray[p] = t;
 	}
	return newArray;
};

// Array Remove - By John Resig (MIT Licensed)
Array.prototype.remove = function(from, to) {
  var rest = this.slice((to || from) + 1 || this.length);
  this.length = from < 0 ? this.length + from : from;
  return this.push.apply(this, rest);
};