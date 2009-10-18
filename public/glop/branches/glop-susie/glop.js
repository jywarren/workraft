var frame = 0, width = 800, height = 600, padding = 8, editmode = false, dragging = false, supermode = false, currentObject = "", pointerLabel = "", on_object = false, mouseDown = false, mouseUp = false, draggedObject = "", lastObject = "", clickFrame = 0, releaseFrame, mode = "layout", modifier = false, arrow_drawing_box = "", clickX, clickY, globalDragging = false, selectedObjects = [], glyphs = [], drag_x, drag_y, single_key

// This contains all stage objects:
var objects = []
var log = []

$('canvas').width = width
$('canvas').height = height
canvas = document.getElementById('canvas').getContext('2d')
canvas.globalAlpha = 0.8
$('pointerLabel').absolutize()

function drag() {
	if (dragging) {
		on_object = false
		objects.each(function(object) {
			if (object.is_selected) {
				// send drag to whole group
				// alert('groupdrag!')
				selectedObjects.each(function(object) {
					object.offset_x = pointerX-object.x
					object.offset_y = pointerY-object.y
					object.dragging = true
					object.drag()
				})
			} else {
				object.drag()
				if (object.dragging) {
					lastObject = object
				}				
			}
		})		
	}
}

function toggle_mode() {
	if (mode == 'run') {
		mode = 'layout'
		$('run_button').addClassName('green')
		$('run_button').innerHTML = "Run"
	} else {
		mode = 'run'
		$('run_button').removeClassName('green')
		$('run_button').innerHTML = "Stop"
	}
}

function highest_id() {
	var high = 0
	objects.each(function(object) {
		if (object.obj_id > high) high = object.obj_id
	})
	return high
}

function trace(msg) {
	log.push(msg)
}
function clearLog() {
	log = []
}

function switch_editmode() {
	if (editmode) {
		editmode = false
		$('editmode_button').update('PLAY MODE')
		$('editmode_button').addClassName('green')
	} else {
		editmode = true
		$('editmode_button').update('EDIT MODE')
		$('editmode_button').removeClassName('green')
	}
}
function switch_console() {
	if ($('console_button').innerHTML == "Larger") {
		$('console_button').update('Smaller')
	} else {
		$('console_button').update('Larger')
	}
	$('shell_form').toggle();$('script_form').toggle()
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

function crosshairs() {
	beginPath()
	moveTo(pointerX,pointerY-10)
	lineTo(pointerX,pointerY+10)
	moveTo(pointerX-10,pointerY)
	lineTo(pointerX+10,pointerY)
	stroke()
}

// Filters out more complex, 'infrastructural' methods from the ones users should be able to mess with. 
// This should be easy to turn off with some kind of 'expert' mode
function isBasicKey(key) {
	return (key != "editor" && key != "highlight" && key != "guts" && key != "initialize")
}

function isNthFrame(num) {
	return ((frame % num) == 0);
}

function toggle(object) {
	if (object == true) {
		object = false
	} else if (object == false) {
		object = true
	}
	return object
}

function clickLength() {
	return releaseFrame-clickFrame
}

function end_editmode() {
	editmode = false
	unexplode_all()
}

function unexplode_all() {
	objects.each(function(object) { 
		object.exploded = false
	})	
}

function randomColor() {
	return "rgb("+Math.round(Math.random()*255)+","+Math.round(Math.random()*255)+","+Math.round(Math.random()*255)+")"
}

function randomColor2() {
	return [Math.round(Math.random()*255),Math.round(Math.random()*255),Math.round(Math.random()*255)]
}

function pointer_label() {
	clearLog()
	trace(pointerLabel)
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

function draw() {
	clear()
	$('canvas').width = document.viewport.getWidth()-padding*2-2
	$('canvas').height = document.viewport.getHeight()-padding*2-90
	$$('body')[0].style.width = (document.viewport.getWidth()-padding*2-2)+"px"
	width = document.viewport.getWidth()-padding*2-2
	height = document.viewport.getHeight()-padding*2-90
	canvas.globalAlpha = 0.8
	crosshairs()
	frame += 1
	drag()
	$('info').update("f:<b>"+frame+"</b> x:<b>"+pointerX+"</b> y:<b>"+pointerY+"</b><br /><b>"+draggedObject.organName+"</b>")
	objects.each(function(object) { 
		object.draw()
		if (object.overlaps(pointerX,pointerY,0)) {
			object.highlight()
		}
		//check for drag selecting
		if (globalDragging && object.within(clickX,clickY,pointerX,pointerY)) {
			if (!object.is_selected) {
				object.is_selected = true
				selectedObjects.push(object)
			}
		}
	})
	glyphs.sort(function(a,b){return a.z_index - b.z_index}).each(function(glyph) {
		glyph.draw()
		if (glyph.lifetime > 0) {
			glyph.lifetime -= 1
		}
		if (glyph.lifetime == 0) {
			glyphs.splice(glyphs.indexOf(glyph),1)
		}
	})
	selectedObjects.each(function(object) {
		object.purpleHighlight()
	})
	if (draggedObject != "") {
		draggedObject.shape()
		draggedObject.x = pointerX+padding
		draggedObject.y = pointerY+padding
	}
	if (globalDragging) {
		canvas.globalAlpha = 0.2
		strokeRect(clickX,clickY,pointerX-clickX,pointerY-clickY)
		fillStyle("#ccc")
		rect(clickX,clickY,pointerX-clickX,pointerY-clickY)
		canvas.globalAlpha = 0.8
	}
	$('trace').update('')
	log.each(function(name, index) { 
		$('trace').insert(name+"<br />")
		// $('trace').scrollTop = $('trace').scrollHeight
	})
	pointer_label()
	trace(mouseUp)
	if (mouseDown) {
		mouseDown = false
	}
	if (mouseUp) {
		mouseUp = false
	}
}

function deep_clone(obj) {
    var c = {};
 
    for (var i in obj) {
        var prop = obj[i];
 
        if (prop instanceof Array) {
			c[i] = prop.slice();
        } else if (typeof prop == 'object') {
           c[i] = deep_clone(prop);
		} else {
           c[i] = prop;
        }
    }
 
    return c;
}

function scene_code() {
	Modalbox.show(template('scene_code',[objects.toJSON()]), {title: "Editing object"})
}

function template(template,values) {
	if (template == "edit_object") {
		code = values[0]
		obj_id = values[1]
		var code_copy = "try {$('editor_code').value.evalJSON();} catch(e) {alert('object: '+e)}"
		return '<p><b>Code for object:</b><br /><textarea id="editor_code" style="width:100%;height:'+(height-40)+'px;">'+code+'</textarea><br /><br /><a href="javascript:void(0)" onClick="Object.extend(objects['+obj_id+'],'+code_copy+');objects['+obj_id+'].exploded = false;end_editmode();Modalbox.hide();" class="button">Save</a></p>'
	} else if (template == "edit_organ") {
		code = values[0]
		key = values[1]
		var code_copy = "eval('try { objects["+obj_id+"]."+key+" = '+$('editor_code').value+';} catch(e) {alert(e)}')"
		return '<p><b>Code for organ:</b><br /><textarea id="editor_code" style="width:100%;height:'+(height-40)+'px;">'+code+'</textarea><br /><br /><a href="javascript:void(0)" onClick="objects['+obj_id+'].'+key+' = '+code_copy+';objects['+obj_id+'].exploded = false;end_editmode();Modalbox.hide();" class="button">Save</a></p>'
	}
}

// milliseconds between redraws:
setInterval(draw,1)