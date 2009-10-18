///////////////////////////////////
// Catch events from Prototype and other places
///////////////////////////////////

$('canvas').observe('mousedown', mousedown)
$('canvas').observe('mouseup', mouseup)
$('canvas').observe('dblclick', doubleclick)

// Track mouse movement:
$('canvas').observe('mousemove', mousemove)
var pointerX = 0, pointerY = 0
function mousemove(event) { 
	pointerX = Event.pointerX(event)-padding
	pointerY = Event.pointerY(event)-padding
	mouseEventManager.mouseMove()
}

///////////////////////////////////
// Pass events to MouseEventManager and others
///////////////////////////////////

function doubleclick(event) {
	mouseEventManager.doubleClick()
}
function clickLength() {
	return releaseFrame-clickFrame
}
function mousedown(event) {
	mouseEventManager.mouseDown()
}
function mouseup() {
	mouseEventManager.mouseUp()
}

////////////////////
// MouseEventManager
////////////////////

var MouseEventManager = Class.create({
	initialize: function(_name, _listeners, _mouseDownX, _mouseDownY, _dragging) {
	name = _name
	this.listeners = _listeners
	this.mouseDownX = _mouseDownX
	this.mouseDownY = _mouseDownY
	this.dragging = _dragging
	},
	listeners: [],	
	
	addListener: function(Object){
		listeners[listeners.length] = Object;
	},
	
	removeListener: function(){},	
	mouseMove: function(){},
	mouseDown: function(){
		this.mouseDownX = pointerX
		this.mouseDownY = pointerY
		listeners.each(function(object){
			object.mouseDown()
		})	
	},
	
	mouseDrag: function(){		
		listeners.each(function(object){
			object.mouseDrag()
		})	
	},
	
	mouseUp: function(){
		if (!globalMouseOver && globalEditMode==0) {
// Should we turn this back on?
//			end_editmode()
			makeNewBox()
		} else if (!globalMouseOver && globalEditMode==2) {
			globalEditMode = 1
		} 
		
		this.mouseDownX = ""
		this.mouseDownY = ""
		
		// tell all listeners to mouseUp 
		listeners.each(function(object) {
			object.mouseUp()
		})
		
	},
	doubleClick: function(){
		listeners.each(function(object) {
			object.doubleClick()
		})		
	},
});

////////////////////
// SusieEventHandler (collisions)
////////////////////



////////////////////
// Key events, not used right now
////////////////////

/*
Event.observe(document, 'keypress', function(e) {
	var code;
	if (!e) var e = window.event;
	if (e.keyCode) code = e.keyCode;
	else if (e.which) code = e.which;
	var character = String.fromCharCode(code);
	if (character = "c") {
		single_key = "c"
	}
});

Event.observe(document, 'keyup', function() {
	modifier = false
	token_mod = false
	switch (single_key) {
		case "c":
			// Copy all selected objects in-place
			var clonedObjects = []
			selectedObjects.each(function(object){
				var newbox = deep_clone(object)
				newbox.is_proto = false
				// Link child and parent in the clone:
				newbox.clone_parent = object
				object.clone_child = newbox
				newbox.obj_id = highest_id()+1
				newbox.is_selected = false
				// newbox.memory = object.memory.slice()
				objects.push(newbox)
				clonedObjects.push(newbox)
			})
			// Re-assign input obj_ids to new cloned versions
			clonedObjects.each(function(object){
				// var clonedObject = object
			})
			// Clear out all the clone_parent/clone_child references:
			clonedObjects.each(function(object){
				object.clone_parent = null
			})
			selectedObjects.each(function(object){
				object.clone_child = null				
			})
		break
	}
	single_key = null
});*/


