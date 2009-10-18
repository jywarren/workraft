///////////////////////////////////
// config.js
///////////////////////////////////

//global variables

var frame = 0, width = 800, height = 600, padding = 0, editmode = false, dragging = false, supermode = false, currentObject = "", pointerLabel = "", on_object = false, mouseDown = false, mouseUp = false, draggedObject = "", lastObject = "", clickFrame = 0, releaseFrame, mode = "layout", modifier = false, arrow_drawing_box = "", clickX, clickY, globalDragging = false, selectedObjects = [], glyphs = [], drag_x, drag_y, single_key, startTime = new Date(), time, fps_frames = 0

globalMouseMoving = false,
globalMouseOver = false, // If the mouse is Over any object
globalDragging = false,	
globalEditMode = 0 // 			0 = normal, 1 = one glop exploded, 2 = a glop in editingmode , 3 dragging organs



//canvas variables for wrapper
$('canvas').width = width
$('canvas').height = height
canvas = document.getElementById('canvas').getContext('2d')

$('pointerLabel').absolutize()

canvas.globalAlpha = 0.8

//resizes window, is called from html body
function resizeCanvas(){
	$('canvas').width = document.viewport.getWidth()-padding*2
	$('canvas').height = document.viewport.getHeight()-padding*2-100
	$$('body')[0].style.width = (document.viewport.getWidth()-padding*2-2)+"px"
	width = document.viewport.getWidth()-padding*2
	height = document.viewport.getHeight()-padding*2-100
}

// run & stop // does not work right now
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

//tracing
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

//clones a complete object
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

function object_clone(obj){
	obj = deep_clone(obj)
	obj.color = randomColor()
	obj.rotation = randomRotation()
	obj.travelVector = new Vector(Math.floor(Math.random()-0.5)*Math.random(obj.obj_id*frame)*10+5,Math.floor(Math.random()-0.5)*Math.random(obj.obj_id/frame)*10+5)
	obj.obj_id = highest_id() + 1
	return obj
}


function scene_code() {
	Modalbox.show(template('scene_code',[objects.toJSON()]), {title: "Editing object"})
}

function template(template,values) {
	var modalHeight = height-40
	if (template == "edit_object") {
		code = values[0]
		obj_id = values[1]
		var code_copy = "eval('try { Object.extend(get_object('+obj_id+'), '+$('editor_code').value+');} catch(e) {alert(e)}')"
		// var code_copy = "try {$('editor_code').value.evalJSON();} catch(e) {alert('object: '+e)}"
		return '<p><b>Code for object:</b><br /><textarea id="editor_code" style="width:100%;height:'+modalHeight+'px;">'+code+'</textarea><br /><br /><a href="javascript:void(0)" onClick="Object.extend(get_object('+obj_id+'),'+code_copy+');get_object('+obj_id+').exploded = false;end_editmode();Modalbox.hide();" class="button">Save</a></p>'
	} else if (template == "edit_organ") {
		var code = values[0], key = values[2], nameField = "",insert_code = ""
		obj_id = values[1]
		if (key == "newOrgan") {
			modalHeight -= 60
			nameField = "<p><b>Name your new organ: </b></p><input id='newOrganName' value='' />"
			key = "'+newOrganRef+'"
			var insert_code = "newOrganRef = $('newOrganName').value;insert_new_organ(get_object('+obj_id+'),newOrganRef);"
		}
		var code_copy = "eval('try { get_object('+obj_id+')."+key+" = '+$('editor_code').value+';} catch(e) {alert(e)}')"
		return nameField+'<p><b>Code for organ:</b><br /><textarea id="editor_code" style="width:100%;height:'+modalHeight+'px;">'+code+'</textarea><br /><br /><a href="javascript:void(0)" onClick="'+insert_code+code_copy+';get_object('+obj_id+').exploded = false;end_editmode();Modalbox.hide();" class="button">Save</a></p>'
	}	
}

function color_from_string(string) {
	return "#"+(parseInt((string),36).toString(16)+"ab2828").truncate(6,"")
}

function randomColor() {
	return "rgb("+Math.round(Math.random(frame)*255)+","+Math.round(Math.random(frame)*255)+","+Math.round(Math.random(frame)*255)+")"
}

function randomRotation() {
	return Math.random(frame)*Math.PI*2
}