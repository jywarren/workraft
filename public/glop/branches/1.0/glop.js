///////////////////////////////////
// glop.js
///////////////////////////////////

///////////////////////////////////
// Interface, global
///////////////////////////////////

//custom mouse pointer
function crosshairs() {
	beginPath()
	moveTo(pointerX,pointerY-10)
	lineTo(pointerX,pointerY+10)
	moveTo(pointerX-10,pointerY)
	lineTo(pointerX+10,pointerY)
	stroke()
}

//little label for organs
function pointer_label() {
	clearLog()
	//trace(pointerLabel)
	if (pointerLabel == "") {
		$('pointerLabel').update("")
		$('pointerLabel').hide()
	} else {
		$('pointerLabel').update("<span>"+pointerLabel+"</span>")
		$('pointerLabel').style.left = (pointerX+padding)+"px"
		$('pointerLabel').style.top = (pointerY+padding-30)+"px"
		$('pointerLabel').show()
	}
}

///////////////////////////////////
// Managing boxes
///////////////////////////////////

function highest_id() {
	var high = 0
	objects.each(function(object) {
		if (object.obj_id > high) high = object.obj_id
	})
	return high
}

function get_object(id) {
	var output
	objects.each(function(object) { 
		if (object.obj_id == id) {
			output = object
		}
	})
	return output
}

// Filters out more complex, 'infrastructural' methods from the ones users should be able to mess with. 
// This should be easy to turn off with some kind of 'expert' mode
function isBasicKey(key) {
	return (key != "editor" && key != "highlight" && key != "guts" && key != "initialize")
}

function end_editmode() {
	//editmode = false
	//unexplode_all()
}


function unexplode_all() {
	objects.each(function(object) { 
//		object.exploded = false
	})	
}

// If it's a function, add the new method to the object.draw() code
// so it gets executed each frame:
function insert_new_organ(object,organName) {
	if (!has_organ(object,organName)) {
		var old_draw = object.draw.toString().slice(0,object.draw.length-21)
		eval("object.draw = "+old_draw+"\nthis."+organName+"();\n }\n this.shape(); }")
	}
}

function has_organ(obj,organ) {
	has_it = false
	Object.keys(obj).each(function(key,index) {
		if (key == organ) {
			has_it = true
			return true
		}
	})
	return has_it
}

function show_dead_guy(object) {
	object.color = "grey"
	object.shape()
	canvas.save()
	lineWidth(2)
	strokeStyle("#444")
	translate(object.x,object.y)
	rotate(object.rotation)
		beginPath()
		moveTo(-15,10)
			lineTo(-10,5)
		moveTo(-15,5)
			lineTo(-10,10)
		moveTo(15,10)
			lineTo(10,5)
		moveTo(15,5)
			lineTo(10,10)
		moveTo(-10,-14)
		lineTo(10,-8)
		stroke()
	canvas.restore()
}

function jsonify(input,newlines) {
	if (newlines == null) var newline = ""
	else var newline = "\r"
	var json = ""
	if (input instanceof Array) {
		var string = ''
		input.each(function(item) {
			string += jsonify(item)+","+newline
		})
		string = string.truncate(string.length-1,'')
		json += "["+string+"]"
	} else if (Object.isString(input)) {
		json += "'"+String(input).escapeHTML()+"'"
	} else if (Object.isNumber(input)) {
		json += String(input)
	} else if (typeof input == 'object') {
		var string = ''
		Object.keys(input).each(function(key,index) {
			string += key+": "+jsonify(Object.values(input)[index])+", "+newline
		})
		string.truncate(string.length-1)
		json += "{"+string+"}"
	} else {
		json += String(input).escapeHTML()
	}
	return json
}

function makeNewBox(){
			// if (lastObject == "") {
			 	var new_box = deep_clone(box)
			// } else {
			//	var new_box = deep_clone(lastObject)
			// }
			new_box.x = pointerX
			new_box.y = pointerY
			new_box.obj_id = objects.length
			new_box.color = randomColor()
			new_box.playBack = false
			new_box.recordingX=[""],
		  	new_box.recordingY=[""],
			objects.push(new_box)
//			var _organs[]
		
			mouseEventManager.addListener(new_box)
//			new_box.initialize()	
}

// Returns a complete string of the object in JSON:
function object_code(object) {
	return jsonify(object)
}

///////////////////////////////////
// Draw function (every frame)
///////////////////////////////////

function draw() {
	
	//timing etc
	time = new Date()
	if (frame % 40 == 0) {
		startTime = time.getTime()
		fps_frames = 0
	}
	frame += 1
	fps_frames += 1
	$('info').update("fps:<b>"+parseInt(fps_frames/(0.1+(time.getTime()-startTime)/1000))+"</b> x:<b>"+pointerX+"</b> y:<b>"+pointerY+"</b>")
	
	pointerLabel =""
	//drawing
	clear()
	crosshairs()
//	drag()
	//on_object = false;
	
	var _mouseOver = false
	//draw all objects
	objects.each(function(object) { 
		// try {
			object.draw()
		// } catch (e) {
		// 	show_dead_guy(object)
		// 	alert(e)
		// }
		if (object.overlaps(pointerX,pointerY,0)) {
			object.highlight()
			object.over = true
			_mouseOver =true
		}else{
			object.over = false
			
		}
//		trace(_mouseOver)
		
		// if(!_mouseOver){
		// 		pointerLabel =""
		// 	}
		// 	
		//check for drag selecting
		/*if (globalDragging && object.within(clickX,clickY,pointerX,pointerY) && !(draggedObject instanceof Organ)) {
			if (!object.is_selected) {
				object.is_selected = true
				selectedObjects.push(object)
			}
		}*/
		
		
	})
	if(_mouseOver){
		globalMouseOver = true
	}else{
		globalMouseOver = false
	}
//	trace("globalMouseOver" + globalMouseOver)
//	trace(globalEditMode)

	// highlight everything in a group with purple:
	/*selectedObjects.each(function(object) {
		object.purpleHighlight()
	})*/
	// will be replaced by the better selected objects system:
	//if (draggedObject != "") {
	//	draggedObject.x = pointerX+padding
	//	draggedObject.y = pointerY+padding
//		draggedObject.shape()
//	}
/*	if (globalDragging && !(draggedObject instanceof Object) &&  !(draggedObject instanceof Organ)) {
		canvas.globalAlpha = 0.2
		strokeRect(clickX,clickY,pointerX-clickX,pointerY-clickY)
		fillStyle("#ccc")
		rect(clickX,clickY,pointerX-clickX,pointerY-clickY)
		canvas.globalAlpha = 0.8
	}*/

	// Let's split this into a log, which is persistent and not cleared, and a trace, which is updated every frame.
	$('trace').update('')
	log.each(function(name, index) { 
		$('trace').insert(name+"<br />")
		// $('trace').scrollTop = $('trace').scrollHeight
	})
	pointer_label()
		// 
		// if (mouseDown) {
		// 	mouseDown = false
		// }
		// if (mouseUp) {
		// 	mouseUp = false
		// }
	
}

///////////////////////////////////
//Fire it up!
///////////////////////////////////

//resizes canvas stage at startup after loading all .js files. later it is called from html
resizeCanvas()

var objects = []

var listeners = []
var dragging = false;
var mouseDownX=0
var mouseDownY=0

mouseEventManager = new MouseEventManager("hi", listeners, mouseDownX, mouseDownY, dragging)

var box = new Box
//Load any preloaded object into the scene
if ($('dropject').value != '') {
	Object.extend(box,$('dropject').value.evalJSON())
}
objects.push(box)


// milliseconds between redraws:
new PeriodicalExecuter(draw, 0.025);