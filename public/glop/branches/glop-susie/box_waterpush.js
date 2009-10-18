//working version of box. no flashy organs, short tail, with motion functions

var Box = Class.create({
  initialize: function(name) {
	if (objects.length == 0) {
		this.obj_id = 0
	} else {
		this.obj_id = objects[objects.length-1].obj_id+1
	}
  },
  h: 50,
  w: 50,
  x: Math.random()*$('canvas').width,
  y: 0,
  xdir: 1,
  ydir: 1,
  memory: [],
  exploded: false,
  speed: 0,
  obj_id: "",
  dragging: false,
  rotation: 0,
  spin: Math.random()-0.5,
  color: randomColor(),
  shiverclock: 0,
  shivering: false,
  bounce: false,
  roll: false,
  gravity: true,
  water: false,
  wave: false,
  amplitude: 15*Math.random(),
  drift: false,
  draw: function() {
	if (this.y < height-this.h && this.speed != 0) {
		this.rotation += this.spin
	}
	if (isNthFrame(1)) this.memory.push([this.x,this.y])
	if (this.memory.length > 10) this.memory.shift()
	this.motion()
	if (this.shiverclock <10)
	this.shiver()
	if (this.bounce)
	this.reversedir()
	if (this.roll)
	this.rolling()
	if (this.exploded) {
		this.guts()
	}
	this.tail()
	this.shape()
  },
  tail: function() {
	canvas.save()
	var my_memory = this.memory
	this.memory.each(function(location,index) {
		if (index < my_memory.length-1) {
			strokeStyle("rgba(0,0,0,0.1)")
			lineWidth(index)
			beginPath()
			moveTo(location[0],location[1])
			lineTo(my_memory[index+1][0],my_memory[index+1][1])
			stroke()
		}
	})
	canvas.restore()
  },
  shape: function() {
    canvas.save()
	fillStyle(this.color)
	translate(this.x,this.y)
	rotate(this.rotation)
	rect(this.w/-2,this.h/-2,this.w,this.h)
	canvas.restore()
	// Attempt to use glyph/layering system... 
	// problem with passing reference to original object for relative position:
		
	// var parent_box = this
	// var glyph = new Glyph()
	// glyph.draw = function() {
		// 	    canvas.save()
		// fillStyle(this.color)
		// translate(this.x,this.y)
		// rotate(this.rotation)
		// rect(this.x+this.w/-2,this.y+this.h/-2,this.w,this.h)
		// canvas.restore()
	// }
	// glyphs.push(glyph)
  },
  motion: function() {
	if (!this.gravity){
		this.antigravity()
	}
	if (this.water) {
		this.underwater()
	}
	if (this.wave) {
		this.wavemotion()
	}
	else {
		this.fall()
	}
  },
  fall: function() {
	if (!this.dragging && !dragging) {
		collision = this.collision()
		if (collision) {
			this.speed = 0
		} else if (this.speed == 0) {
			this.speed = 1
		}
		// on the 'ground'
		if (this.y > height-.55*this.h && !collision) {
			this.y = height-this.h/2
		}
		// still falling
		if (this.y < height-.55*this.h && !collision) {
			this.speed+=1
			this.y = this.y+this.speed*this.ydir
		}
	}
  },
//copying, mirroring, find property/behavior that it doesn't have itself, 
//setup documentation 
  antigravity: function() {
	
	
  },
  underwater: function() {
	this.speed*=0.9
	this.spin*=0.5
	this.waterpush()
	if (frame % 4 == 0){
		this.color="rgb("+Math.round(Math.random()*100)+","+Math.round(Math.random()*100)+","+ 255 +")"
	}
	if (frame % (Math.round(Math.random()*50)+100) == 0){ //random drifting
		//this.drift = true
	}
	if (this.drift){
		if ((frame-10) % (Math.round(Math.random()*50)+100) == 0){
			this.drift = false
		}
		this.amplitude *= 0.2
		this.wavemotion()
	}
  },
  waterpush: function() { // make motion more smooth, too jerky
  	this.xdifference = pointerX - this.x 
  	this.ydifference = pointerY - this.y
  	this.distancefrom = Math.sqrt(this.xdifference*this.xdifference+this.ydifference*this.ydifference)
  	if (50 < this.distancefrom && this.distancefrom < 150) {
  		this.speed = 1
		trace(this.obj_id+" "+this.distancefrom)
		if (this.xdifference == 0 || this.ydifference == 0 ){
			this.x += -400*this.speed*this.xdir/(this.xdifference+1)
  			this.y += -400*this.speed*this.ydir/(this.ydifference+1)
		} else {
			this.x += -400*this.speed*this.xdir/(this.xdifference)
  			this.y += -400*this.speed*this.ydir/(this.ydifference)
		}
  	} else {
  		this.speed = 0  		
  	}
  },
  //explode 
  wavemotion: function() {
	var collision = this.collision360()
	if (!collision){
		this.speed = 4
		this.x+=this.speed*this.xdir
		this.y+=this.amplitude*Math.sin(this.x/30)
	}
	else if (collision && this.y < height - .55*this.h){
		this.xdir *= -1
		this.speed = 4
		this.x+=this.speed*this.xdir
		this.y+=this.amplitude*Math.sin(this.x/30)
	}
	this.reverse()
  },
  reversedir: function() {
  	if (this.x > width - .55*this.w || this.x < .55*this.w){
  		this.xdir*=-1
  	}
	if (this.y > height - .55*this.h || this.y < .55*this.h){
		this.ydir*=-1
  	}
  },
  rolling: function(){
  	collision = this.collision()
	if (collision){
		this.rotation *= this.xdir/2
		this.speed = 4
		this.x = this.x + this.speed*this.xdir
		this.y = this.y - this.speed*this.ydir
	}   	
  	if (this.y > height - .55*this.h && !collision){
	  	this.rotation += -3*this.xdir
	  	this.speed = 4
	  	this.x += this.speed*this.xdir
  	}
  	if (this.x > width - .55*this.w || this.x < .55*this.w){
  		this.xdir*=-1
  	}
  },
  shiver: function() {
	if (!this.dragging && !dragging) {
		collision = this.collision()
		if (collision) {
			if (this.shivering == true) {
				this.rotation += .05
				this.shivering = false	
			} else {
				this.rotation -= .05	
				this.shivering = true			
			}	
	  		this.shiverclock += 1 		
			
		} else if (this.speed == 0) {
			this.speed = 1
		}
	}
  },
  bounceoffwall: function() {
  	bottomhit = this.y > height - .55*this.h 
  	tophit = this.y < .55*this.h && this.hit
  	righthit = this.x > width - .55*this.w 
  	lefthit = this.x < .55*this.w
	if (bottomhit ) {
		this.ydir*=-1
		this.hit = true
	}
	if (righthit || lefthit) {
		this.xdir*=-1
	}	
	if (this.collision) {
		this.speed-=10
	}
  }, 
  collision: function() {
    var is_collision = false
	_x = this.x
	_y = this.y
	_obj_id = this.obj_id
  	objects.each(function(object) {
		if (object.y > _y && object.obj_id != _obj_id && object.overlaps(_x,_y,20)) {
			is_collision = true
		}
	})
	return is_collision
  },
  collision360: function() {
    var is_collision = false
	_x = this.x
	_y = this.y
	_obj_id = this.obj_id
  	objects.each(function(object) {
		if (object.y > _y && object.obj_id != _obj_id && object.overlaps(_x,_y,20)) {
			is_collision = true
		}
    })
	return is_collision
  },
  overlaps: function(target_x,target_y,fudge) {
  	if (target_x > this.x-(this.w/2)-fudge && target_x < this.x+(this.w/2)+fudge) {
  		if (target_y > this.y-(this.h/2)-fudge && target_y < this.y+(this.h/2)+fudge) {
		  	return true
  		} else {
  			return false
  		}
  	} else {
  		return false
  	}
  },
  within: function(start_x,start_y,end_x,end_y) {
	var dragLeft = Math.min(start_x,end_x)
	var dragRight = Math.max(start_x,end_x)
	var dragTop = Math.min(start_y,end_y)
	var dragBottom = Math.max(start_y,end_y)
	
	var sideLeft = this.x-(this.w/2)
	var sideRight = this.x+(this.w/2)
	var sideTop = this.y-(this.h/2)
	var sideBottom = this.y+(this.h/2)
	
	if (sideLeft > dragRight || sideRight < dragLeft || sideTop > dragBottom || sideBottom < dragTop) {
		return false
	} else {
		return true
	}
  },
  drag: function() {
	if (this.is_selected) {
		if (this.old_x == null || this.old_y == null) {
			// initialize the point of the beginning of the group drag:
			this.old_x = this.x
			this.old_y = this.y
		}
		if (this.dragging) {
			// the group is being dragged:
			this.x = this.old_x + drag_x
			this.y = this.old_y + drag_y
		}
	} else if (this.dragging) {
		this.x = pointerX
		this.y = pointerY
	}
	
  },
  click: function() {
  },
  rightclick: function() {
	this.doubleclick()
  },
  doubleclick: function() {
	if (editmode) {
		Modalbox.show(template('edit_object',[this.editor(),this.obj_id]), {title: "Editing object"})
	} else {
		this.exploded = true
	}
	editmode = toggle(editmode)
  },
  highlight: function() {
    canvas.save()
	strokeStyle("rgba(40,40,40,0.2)")
	lineWidth(8)
	translate(this.x,this.y)
	rotate(this.rotation)
	strokeRect(this.w/-2,this.h/-2,this.w,this.h)
	canvas.restore()
  },
  purpleHighlight: function() {
    canvas.save()
	strokeStyle("rgba(120,0,120,0.2)")
	lineWidth(8)
	translate(this.x,this.y)
	rotate(this.rotation)
	strokeRect(this.w/-2,this.h/-2,this.w,this.h)
	canvas.restore()
  },
  editor: function() {
	var html
	//trace(Object.keys(this))
	json = "{"
	obj_id = this.obj_id
	Object.keys(this).each(function(key,index) {
		jsonKey = Object.values(objects[obj_id])[index]
		if (isBasicKey(key) || supermode == true) {
			if (Object.isString(jsonKey)) {
				json += key+": '"+String(jsonKey).escapeHTML()+"',\r"
			} else if (Object.isNumber(jsonKey)) {
				json += key+": "+String(jsonKey)+",\r"			
			} else {
				json += key+": "+String(jsonKey).escapeHTML()+",\r"			
			}
		}
	})
	json.truncate(json.length-1)
	json += "}"
	return json
	// return Object.toJSON(this).gsub(',',',\r')
  },
  guts: function() {
	_x = this.x
	_y = this.y
	_h = this.h
	obj_id = this.obj_id
		canvas.save()
		beginPath()
		strokeStyle("rgba(40,40,40,0.2)")
		lineWidth(5)
		moveTo(_x,_y)
		quadraticCurveTo(_x-30, _y, _x-30, _y-_h-5)
		moveTo(_x,_y)
		quadraticCurveTo(_x+30, _y, _x+30, _y-_h-5)
		stroke()
		canvas.restore()
	var property_count = 0
	var function_count = 0
	var on_organ = false
	Object.keys(this).each(function(key,index) {
		if (isBasicKey(key) || supermode == true) {
			jsonKey = Object.values(objects[obj_id])[index]
			organ = new Organ
			//could make organs as tall as the amount of code they contain
			organ.h = 10
			organ.w = 20
			organ.organName = key
			organ.parent_id = obj_id
			organ.code = jsonKey
			organ.color = "#"+(parseInt((key),36).toString(16)+"ab2828").truncate(6,"")
			if (Object.isFunction(jsonKey)) {
				organ.x = _x+30
				organ.y = _y-(14*function_count)-_h-20
				function_count += 1
			} else {
				organ.x = _x-30
				organ.y = _y-(14*property_count)-_h-20
				property_count += 1
			}
			canvas.save()
			organ.shape()
			if (organ.overlaps(pointerX,pointerY,0)) {
				organ.highlight()
				on_organ = true
				organ.editing = true
				if (mouseDown && !dragging) { // && clickLength() > 4
					dragging = true
					draggedObject = organ
				}
			}
			canvas.restore()
		}
	})
	if (!on_organ) {
		pointerLabel = ""
	}
  }
});

var Organ = Class.create(Box,{
  className: "Organ",
  organName: "",
  code: "",
  editing: false,
  parent_id: "",
  highlight: function($super) {
	pointerLabel = this.organName
	$super()
  },
  guts: "",
  edit: function() {
	Modalbox.show(template('edit_organ',[this.code,this.organName]), {title: "Editing "+this.organName})
  }
});

var box = new Box
//Load any preloaded object into the scene
if ($('dropject').value != '') {
	Object.extend(box,$('dropject').value.evalJSON())
}
objects.push(box)