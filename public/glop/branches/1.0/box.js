////////////////////
//Box.js
////////////////////
var Box = Class.create({
  initialize: function() {
	this.obj_id = highest_id()+1
    this.travelVector = new Vector(Math.random(this.obj_id*frame)*5+5,Math.random(this.obj_id/frame)*5+5)
	mouseEventManager.addListener(this)
	this.travelV = new Vector(this.x, this.y)
	
	this.directionV = new Vector(3,1)
	
  },
  h: 50,
  w: 50,
  x: 80,
  y: 80,
  memory: [],
  // speed: Math.random()*10, //replaced by Vector
  // ydir: Math.random(),
  // xdir: Math.random(),
  over: false, //local mouseOver
  dragging: false,
  exploded: false,
  editMode: false, //local variable for editmode (text editor)
  rotation: 0,
  spin: 0,
  color: randomColor(),
  startPosX: 0,
  startPosY: 0,
  organs: [],
  playBackIndex: 0,
  playBack: false,
  playBackDirection: 1,
  drag_x: 0,
  drag_y: 0,	
  on_organ: false,
  travelV: 0,
  startPosV:0,
  recordingV:[],
  directionV:0,
  bounce: true,
  alpha: 0.8,

////////////////////
//the draw function. should not be changed as it is evaluated in glop.js > insert_new_organ 
////////////////////

  draw: function() {
		this.on_organ=false
		this.travelV.set(this.x, this.y)
		
		if (isNthFrame(1)) this.memory.push([this.x,this.y])
		if (this.memory.length > 50) this.memory.shift()
		
		if(this.playBack==true && !this.dragging){
			this.playingBack()
		}
		if(this.dragging && !this.editMode){
			this.drag()
			this.record()
			this.shapeHeading()
		}
		if(!this.exploded){
			this.tail()
			this.breathe()
		} else {
			this.showGuts()
			// this.travel()
			// if (this.bounce) {this.bounceoffwall()}
		}
		this.shape()
  },
  reset: function() {
		this.x = pointerX
		this.y = pointerY
		this.color = randomColor()
		this.travelVector.set(Math.random(this.obj_id*frame)*3+2,Math.random(this.obj_id/frame)*3+2)
		this.rotation = Math.random(frame)*2*Math.PI
  },
  tail: function() {
	canvas.save()
	var my_memory = this.memory
	this.memory.each(function(location,index) {
		if (index < my_memory.length-1) {
			strokeStyle("rgba(0,0,0,0.1)")
			lineWidth((index/my_memory.length)*6)
			beginPath()
			moveTo(location[0],location[1])
			lineTo(my_memory[index+1][0],my_memory[index+1][1])
			stroke()
		}
	})
	canvas.restore()
  },
  breathe: function() {  
	this.h = this.h + Math.sin(frame/8+this.obj_id)/8
	this.w = this.w + Math.cos(frame/8+this.obj_id)/8
  },
  shape: function() {
    canvas.save()
	canvas.globalAlpha = this.alpha
	fillStyle(this.color)
	translate(this.x,this.y)
	rotate(this.rotation)
	rect(this.w/-2,this.h/-2,this.w,this.h)
	canvas.restore()
  },

  shapeHeading: function(){
    canvas.save()
	fillStyle(this.color)
	translate(this.x,this.y)
	rotate(this.rotation)
	rect(this.w/-2,-5,this.w*1.5,5)
	canvas.restore()
 },

  tail: function() {
	canvas.save()
	var my_memory = this.memory
	this.memory.each(function(location,index) {
		if (index < my_memory.length-1) {
			strokeStyle("rgba(0,0,0,0.1)")
			lineWidth((index/my_memory.length)*6)
			beginPath()
			moveTo(location[0],location[1])
			lineTo(my_memory[index+1][0],my_memory[index+1][1])
			stroke()
		}
	})
	canvas.restore()
  },
  startRecording: function(){
	this.startPosV = new Vector(this.x, this.y)
	this.playBack =false
	this.recordingV.length =0
	this.playBackIndex =0
	this.playBackDirection = 1
  },

  stopRecording: function(){
	this.playBackIndex =this.recordingV.length-1
	this.playBackDirection = 1
	this.playBack = true
 },

  record: function(){
	this.playBack = false
	var _nowV = new Vector(this.x-this.startPosV.x, this.y-this.startPosV.y)
	this.recordingV.push(_nowV)
	if(this.recordingV[2] && this.recordingV[1].x!=0){
	var _rotation = heading2D(this.recordingV[this.recordingV.length-1].x-this.recordingV[this.recordingV.length-2].x,this.recordingV[this.recordingV.length-1].y-this.recordingV[this.recordingV.length-2].y)
	if(_rotation >=2*Math.PI){_rotation -=2*Math.PI}
		this.rotation = _rotation
	}
	this.shapeHeading()
  },

 playingBack: function(){
	if(this.recordingV[this.playBackIndex]){
		 this.x = this.recordingV[this.playBackIndex].x+this.startPosV.x
		 this.y = this.recordingV[this.playBackIndex].y+this.startPosV.y
	}
	
	 if(this.playBackIndex>=1){
	var _rotation = heading2D(this.recordingV[this.playBackIndex].x-this.recordingV[this.playBackIndex-1].x,this.recordingV[this.playBackIndex].y-this.recordingV[this.playBackIndex-1].y)
			if(_rotation >=2*Math.PI){_rotation -=2*Math.PI}
				this.rotation = _rotation
		}
	 this.playBackIndex+=this.playBackDirection

	if(this.playBackIndex >= this.recordingV.length-1){
		this.startPosV = new Vector(this.x, this.y)
		this.playBackIndex=0
	}
  },

  breathe: function() {
	this.h = 50 + Math.sin(frame/4+this.obj_id)*2
	this.w = 50 - Math.sin(frame/4+this.obj_id)*2
  },

/*  fall: function() {
=======
//----BEGIN SECTION FOR COLLISION TESTING----
  travel: function() {
>>>>>>> .r187
	if (!this.dragging && !dragging) {
		this.x = this.x + this.travelVector.x
		this.y = this.y + this.travelVector.y
	}
  },
  bounceoffwall: function() { //fix to use real corner collision
	//   	bottomhit = this.y > height - .55*this.h 
	//   	tophit = this.y < .55*this.h
	//   	righthit = this.x > width - .55*this.w 
	//   	lefthit = this.x < .55*this.w
	// if (bottomhit || tophit ) {
	// 	this.travelVector.y = -1*this.travelVector.y
	// }
	// if (righthit || lefthit) {
	// 	this.travelVector.x = -1*this.travelVector.x
	// }	
	this.collisionwall()
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
<<<<<<< .mine




=======
  collisionwall: function() {
	var _1x = Math.round(this.corner1().x)
	var _1y = Math.round(this.corner1().y)
	var _2x = Math.round(this.corner2().x)
	var _2y = Math.round(this.corner2().y)
	var _3x = Math.round(this.corner3().x)
	var _3y = Math.round(this.corner3().y)
	var _4x = Math.round(this.corner4().x)
	var _4y = Math.round(this.corner4().y)
	var smallest_x = Math.min(_1x, _2x, _3x, _4x)
	// trace (this.corner1().x+" , "+this.corner2().x+" , "+this.corner3().x+" , "+this.corner4().x)
	// trace (_1x+" , "+_2x+" , "+_3x+" , "+_4x)
	// trace(smallest_x)
	var biggest_x = Math.max(_1x, _2x, _3x, _4x)
	var smallest_y = Math.min(_1y, _2y, _3y, _4y)
	var biggest_y = Math.max(_1y, _2y, _3y, _4y)
	var leftright = smallest_x < 0 || biggest_x > width 
	var topdown = smallest_y < 0 || biggest_y > height 
	var limit = this.h/(Math.sqrt(2)*2)
	if (leftright) { // hitting left or right side
		if (smallest_x < -this.w/5){
			this.x = this.w + smallest_x
		} 
		else if(biggest_x > width + this.w/5) {
			this.x = 2*width - biggest_x-1
		}
		else {
			// if (!this.collision2()){
				this.travelVector.x *= -1				
			// }
			// else {
			// 	this.travelVector.y *= -1
			// }
		}
	}
	if (topdown) { // hitting the top or bottom side
		if (smallest_y < -this.w/5){
			this.y = this.h + smallest_y
		} 
		else if(biggest_y > height + this.w/5) {
			this.y = 2*height - biggest_y-1
		}
		 else {
			// if (!this.collision2()){
				this.travelVector.y *= -1				
			// }
			// else {
			// 	this.travelVector.x *= -1
			// }
		}
	}
	// trace (leftright)
	// trace (_1x+" , "+_1x+" , "+_1x+" , "+_1x)
	// trace (width + "," + height)
	// trace (topdown)
  },
  collision2: function() {
		var is_collision = false
		_me = this
		objects.each(function(that) {
			var diff = new Vector(that.x-_me.x, that.y-_me.y)
			var distance = diff.length()
			var distBtwnCenters = pointToPointDist(_me.x,_me.y,that.x,that.y)
			// trying to put in corner/side detection instead of circular detection
			// if ((_me.obj_id != that.obj_id) && (distBtwnCenters < _me.minReach()+that.minReach()) && is_collision == false) {
			// 	var corners = [_me.corner1(),_me.corner2(),_me.corner3(),_me.corner4()]
			// 	thatc1 = that.corner1()
			// 	thatc2 = that.corner2()
			// 	thatc3 = that.corner3()
			// 	thatc4 = that.corner4()
			// 	corners.each(function(c) {
			// 		if (pointToLineDist(c.x,c.y,thatc1.x,thatc1.y,thatc2.x,thatc2.y)<1 || pointToLineDist(c.x,c.y,thatc1.x,thatc1.y,thatc2.x,thatc2.y) > -1) {
			// 			is_collision = true
			// 		} else if (pointToLineDist(c.x,c.y,thatc2.x,thatc2.y,thatc3.x,thatc3.y)<1 || pointToLineDist(c.x,c.y,thatc2.x,thatc2.y,thatc3.x,thatc3.y)> -1) {
			// 			is_collision = true
			// 		} else if (pointToLineDist(c.x,c.y,thatc3.x,thatc3.y,thatc4.x,thatc4.y)<1 || pointToLineDist(c.x,c.y,thatc3.x,thatc3.y,thatc4.x,thatc4.y)>-1) {
			// 			is_collision = true
			// 		} else if (pointToLineDist(c.x,c.y,thatc4.x,thatc4.y,thatc1.x,thatc1.y)<1 || pointToLineDist(c.x,c.y,thatc4.x,thatc4.y,thatc1.x,thatc1.y)>-1) {
			// 			is_collision = true
			// 		}	
			// 	})	
			// }



			if ((_me.obj_id != that.obj_id) && (distBtwnCenters < _me.minReach()+that.minReach()) && is_collision == false) {
				var corners = [_me.corner1(),_me.corner2(),_me.corner3(),_me.corner4()]
				thatc1 = that.corner1()
				thatc2 = that.corner2()
				thatc3 = that.corner3()
				thatc4 = that.corner4()
				corners.each(function(c) {
					if (pointToLineDist(c.x,c.y,thatc1.x,thatc1.y,thatc2.x,thatc2.y)<2 && pointToLineDist(c.x,c.y,thatc1.x,thatc1.y,thatc2.x,thatc2.y)>-2) {
						is_collision = true
					} else if (pointToLineDist(c.x,c.y,thatc2.x,thatc2.y,thatc3.x,thatc3.y)<2 && pointToLineDist(c.x,c.y,thatc2.x,thatc2.y,thatc3.x,thatc3.y)>-2) {
						is_collision = true
					} else if (pointToLineDist(c.x,c.y,thatc3.x,thatc3.y,thatc4.x,thatc4.y)<2 && pointToLineDist(c.x,c.y,thatc3.x,thatc3.y,thatc4.x,thatc4.y)>-2) {
						is_collision = true
					} else if (pointToLineDist(c.x,c.y,thatc4.x,thatc4.y,thatc1.x,thatc1.y)<2 && pointToLineDist(c.x,c.y,thatc4.x,thatc4.y,thatc1.x,thatc1.y)>-2) {
						is_collision = true
					}	
				})
			}
			//original circular collison detection
			// if ((_me.obj_id != that.obj_id) && distance< _me.h/2 + that.h/2 && is_collision == false){
			// 	is_collision = true
			// }
			if (is_collision == true) {
				this.travelVector.x *= -1
				this.travelVector.y *= -1
			}
			// if (is_collision == true) {
			// 	is_collision = false
			// 	//this projection onto diff vector
			// 	var vec1 = _me.travelVector
			// 	trace("me before = "+_me.obj_id+","+_me.travelVector.x+","+_me.travelVector.y)
			// 	trace("that before = "+that.obj_id+","+that.travelVector.x+","+that.travelVector.y)
			// 	var vec2 = that.travelVector
			// 	var theta1 = vec1.angle() - diff.angle()
			// 	var theta2 = vec2.angle() - diff.angle()
			// 	var mass1 = _me.h*_me.h
			// 	var mass2 = that.h*that.h
			// 	//changing to the diff vector frame of reference
			// 	var projection1 = new Vector(vec1.length()*Math.cos(theta1), vec1.length()*Math.sin(theta1))
			// 	var projection2 = new Vector(vec2.length()*Math.cos(theta2), vec2.length()*Math.sin(theta2))
			// 	//1d collision in the diff vector frame of reference
			// 	var changed1 = (mass1-mass2)/(mass1+mass2)*projection1.x+(2*mass2/(mass1+mass2))*projection2.x
			// 	var changed2 = (2*mass1/(mass1+mass2))*projection1.x+((mass2-mass1)/(mass2+mass1))*projection2.x
			// 	//converting the changed vectors back to normal coordinates
			// 	var changed1vec1 = new Vector(changed1*Math.cos(diff.angle()), changed1*Math.sin(diff.angle()))
			// 	var changed2vec1 = new Vector(changed2*Math.cos(diff.angle()), changed2*Math.sin(diff.angle()))
			// 	//tangential direction from changed reference 
			// 	var changed1vec2 = new Vector(projection1.y*Math.cos(diff.angle()+Math.PI/2),projection1.y*Math.sin(diff.angle()+Math.PI/2))
			// 	var changed2vec2 = new Vector(projection2.y*Math.cos(diff.angle()+Math.PI/2),projection2.y*Math.sin(diff.angle()+Math.PI/2))
			// 	//adding changedvec1 to changedvec 2 for final vector
			// 	changed1vec1.add(changed1vec2)
			// 	changed2vec1.add(changed2vec2)
			// 	var finalchanged1 = changed1vec1
			// 	var finalchanged2 = changed2vec1
			// 	//resetting the vectors
			// 	_me.travelVector.set(finalchanged1.x, finalchanged1.y)
			// 	//_me.travel()
			// 	// _me.x = _me.x - _me.travelVector.x/2
			// 	// _me.y = _me.y - _me.travelVector.y/2
			// 	that.travelVector.set(finalchanged2.x, finalchanged2.y)
			// 	trace("me collided = "+_me.obj_id+","+_me.travelVector.x+","+_me.travelVector.y)
			// 	trace("that collided = "+that.obj_id+","+that.travelVector.x+","+that.travelVector.y)
			// 	trace("------------------------")
			// 	//this.move = false
			// 	//that.move = false
			// 	//that.travel()                                                                                                                                                                                                                                                                                                                                                                                                                                              
			// }
		})
	return is_collision
	},
>>>>>>> .r187
*/
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


	// ------ box functions ---------------------------------------------------------------------------
	maxReach: function() {
		//returns half of the length of the longest diagonal containable within the box
		return Math.sqrt(this.w*this.w + this.h*this.h)/2
	},
	minReach: function() {
		//returns half of the shorter of the width and height of the box
		return Math.min(this.h/2, this.w/2)
	},
	// corner1: function() {
	// 	//returns rotated coordinate of the top left vertice
	// 	x0 = this.x - this.w/2
	// 	y0 = this.y - this.h/2
	// 	x = Math.cos(this.rotation)*(x0 - this.x) - Math.sin(this.rotation)*(y0 - this.y) + this.x
	// 	y = Math.sin(this.rotation)*(x0 - this.x) + Math.cos(this.rotation)*(y0 - this.y) + this.y
	// 	return {x:x, y:y}
	// },
	// corner2: function() {
	// 	//returns rotated coordinate of the top right vertice
	// 	x0 = this.x + this.w/2
	// 	y0 = this.y - this.h/2
	// 	x = Math.cos(this.rotation)*(x0 - this.x) - Math.sin(this.rotation)*(y0 - this.y) + this.x
	// 	y = Math.sin(this.rotation)*(x0 - this.x) + Math.cos(this.rotation)*(y0 - this.y) + this.y
	// 	return {x:x, y:y}
	// },
	// corner3: function() {
	// 	//returns rotated coordinate of the bottom right vertice
	// 	x0 = this.x + this.w/2
	// 	y0 = this.y + this.h/2
	// 	x = Math.cos(this.rotation)*(x0 - this.x) - Math.sin(this.rotation)*(y0 - this.y) + this.x
	// 	y = Math.sin(this.rotation)*(x0 - this.x) + Math.cos(this.rotation)*(y0 - this.y) + this.y
	// 	return {x:x, y:y}
	// },
	// corner4: function() {
	// 	//returns rotated coordinate of the bottom left vertice
	// 	x0 = this.x - this.w/2
	// 	y0 = this.y + this.h/2
	// 	x = Math.cos(this.rotation)*(x0 - this.x) - Math.sin(this.rotation)*(y0 - this.y) + this.x
	// 	y = Math.sin(this.rotation)*(x0 - this.x) + Math.cos(this.rotation)*(y0 - this.y) + this.y
	// 	return {x:x, y:y}
	// },
//----END COLLISION TESTING SECTION---- good

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
			this.x = pointerX + this.drag_x
			this.y = pointerY + this.drag_y	
  },

  startEditMode: function() {
		Modalbox.show(template('edit_object',[jsonify(this),this.obj_id]), {title: "Editing object",transitions:false})
	if (this.exploded) {
		Modalbox.show(template('edit_object',[jsonify(this),this.obj_id]), {title: "Editing object",transitions:false})
		globalDragging = false
	} else {
		if (this.travelVector.x == 0 && this.travelVector.y == 0) {
			this.travelVector = new Vector(Math.random(this.obj_id*frame)*10,Math.random(this.obj_id/frame)*10)
		} else {
			this.travelVector.setZero()
		}
	}
  },
  rightclick: function() {
  },
  doubleclick: function() {
	if (editmode) {
	} else {
		this.exploded = true
	}
	switch_editmode()
  },
  highlight: function() {
    canvas.save()
	strokeStyle("rgba(40,40,40,0.2)")
	lineWidth(8)
	translate(this.x,this.y)
	rotate(this.rotation)
	strokeRect(this.w/-2,this.h/-2,this.w,this.h)
	canvas.restore()
//	on_object = true;
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

////////////////////
//Event management 
////////////////////

mouseUp: function(){
	this.dragging=false
	this.stopRecording()
//	if(this.dragging  && !this.editMode){
//		this.dragging = false
//		globalDragging = false
//		this.stopRecording()
		
	//unexplode
	if(!this.over && !this.on_organ && this.exploded && !this.editMode){
		// this.clearGuts()
		// this.exploded = false
		// this.editMode = false
		// globalEditMode = 0
		
	//from editmode to exploded	
	}else if(this.exploded && this.editMode){
			this.editMode = false
			this.exploded = true
			globalEditMode = 1
	}else if(this.over && this.exploded  && !this.editMode){
			trace("enter")
			this.startEditMode()
			this.editMode = true
			this.exploded = true
			globalEditMode = 2	
	}
},

mouseDown: function(){
	if(this.overlaps(pointerX, pointerY,0)) {
		this.dragging = true
//		globalDragging = true
		this.startRecording()
//		draggedObject = this
		this.drag_x = pointerX-this.x
		this.drag_y = pointerY-this.y
	}else{
		this.dragging = false
	}
},


mouseDrag: function(){
},

doubleClick: function(){
	//explode
	if(this.over && !this.exploded && globalEditMode==0 && !this.editMode){
		this.createGuts()
		this.exploded = true
		this.editMode = false
		globalEditMode = 1 //exploded
	//enter editmode
	}else if(this.over && this.exploded  && !this.editMode){
		trace("enter")
		this.startEditMode()
		this.editMode = true
		this.exploded = true
		globalEditMode = 2
	//exit exploded state
	}else if(!this.over && !this.on_organ && this.exploded && !this.editMode){
		this.clearGuts()
		this.exploded = false
		this.editMode = false
		globalEditMode = 0
	}
},

////////////////////
//organ management 
////////////////////

  newOrgan: function() {
	
  },

	
  clearGuts: function() {
	this.organs = []
	// unsubscribe organ event listeners:::
	// HERE
	//pointerLabel = ""
  },
  // displays the organs
  showGuts: function() {
	var me = this
	on_organ = false
	var property_count = 0
	var function_count = 0
	canvas.save()
	beginPath()
	strokeStyle("rgba(40,40,40,0.2)")
	lineWidth(5)
	moveTo(this.x,this.y)
	quadraticCurveTo(this.x-30, this.y, this.x-30, this.y-this.h-5)
	moveTo(this.x,this.y)
	quadraticCurveTo(me.x+30, this.y, this.x+30, this.y-this.h-5)
	stroke()
	canvas.restore()
	this.organs.each(function(organ) {
		if (Object.isFunction(organ[organ.organName])) {
			organ.x = me.x+30
			organ.y = me.y-(30*function_count)-me.h-10
			function_count += 1
		} else {
			organ.x = me.x-30
			organ.y = me.y-(30*property_count)-me.h-10
			property_count += 1
		}
		organ.draw()
	})
	// if (!on_organ) {
	// 	pointerLabel = ""
	// }
  },
  createGuts: function() {
	var me = this
	Object.keys(this).each(function(key,index) {
		if (isBasicKey(key) || supermode == true) {
			code = me[key]
			organ = new Organ
			//could make organs as tall as the amount of code they contain
			organ.h = 20
			organ.w = 30
			organ.organName = key
			organ.parent_id = me.obj_id
			organ.organParent = me
			organ.code = code
			organ.color = color_from_string(key)
			if (key == "newOrgan") {
				organ.shape = function() {
					canvas.save()
					fillStyle(this.color)
					translate(this.x,this.y)
					rotate(this.rotation)
					rect(this.w/-2,this.h/-2,this.w,this.h)
					strokeStyle("white")
					lineWidth(2)
					beginPath()
					moveTo(0,-4)
					lineTo(0,4)
					moveTo(-4,0)
					lineTo(+4,0)
					stroke()
					canvas.restore()
				}
			}
			me.organs.push(organ)
			mouseEventManager.addListener(organ)

		}
	})

  }
});


////////////////////
//the draw function. should not be changed as it is evaluated in glop.js > insert_new_organ 
////////////////////

var Organ = Class.create(Box,{
  organName: "",
  code: "",
  editing: false,
  color: "red",
  parent_id: "",
  organParent:"", 
  over: false, //local mouseOver

  draw: function() {
	//if(this.dragging)trace("this")

	// onclick:
	// subscribe organ event listeners:::
	if (this.overlaps(pointerX,pointerY,0)) {
		this.highlight()
		this.organParent.on_organ = true
		this.editing = true
		/*if (mouseDown && !dragging) { // && clickLength() > 4
			dragging = true
			draggedObject = organ
		}*/
	}else{
//			pointerLabel = ''
	}
	
	if (this.dragging) { // being dragged
		// maybe do this in drag?:
		this.x = pointerX-this.drag_x
		this.y = pointerY-this.drag_y
		this.organParent.on_organ = true
//		var me = this
		// objects.apply(this,each,[args])
		/*objects.each(function(object) {
			if (object.overlaps(me.x,me.y,0)) {
				//we have a target to drop into
				object[me.organName] = me.code
			}
		})*/
	}
	this.shape ()
  },
	mouseUp: function(){
//		this.dragging = false

		if(this.overlaps(pointerX,pointerY,0)){
			this.organParent.on_organ = true
			if(this.dragging){
					var me=this
					objects.each(function(object) {
						if (object.overlaps(me.x,me.y,0)) {
							//we have a target to drop into
							object[me.organName] = me.code
						}
					})
			}
			
		}else{
//			this.organParent.on_organ = false
		}
		
		/*
		if(this.overlaps(pointerX,pointerY,0) && this.dragging){
					var me = this
			objects.each(function(object) {
				if (object.overlaps(me.x,me.y,0)) {
					//we have a target to drop into
					object[me.organName] = me.code
				}
			})			
// 			Modalbox.show(template('edit_organ',[this.code,this.parent_id,this.organName]), {title: "Editing "+this.organName,transitions:false})
 		}else{
//			this.organParent.on_organ = false
		}*/
		
		
		
		
		this.dragging= false
//		this.copying =false
	},
	
	doubleClick: function(){
		if(this.overlaps(pointerX,pointerY,0)){
			this.organParent.on_organ = true
			Modalbox.show(template('edit_organ',[this.code,this.parent_id,this.organName]), {title: "Editing "+this.organName,transitions:false})
		}
	},
	highlight: function($super) {
		pointerLabel = this.organName
		$super()
	  },
	  guts: ""
	});


var Vector = Class.create({
    x: 0,
    y: 0,
    initialize: function(x_, y_) {   //constructor
        this.x = x_
        this.y = y_
    },
    setZero: function() {  //reset this to zero vector
        this.x = 0
        this.y = 0
    },
    setNegative: function() {  //flip this vector along both horizontal and vertical axes
        this.x= 0-this.x
        this.y= 0-this.x
    },
    set: function(x_, y_) {  //set this to given x and y values
        this.x=x_
        this.y=y_
    },
    setToVec: function(v) {   //set this to given vector
        this.x=v.x
        this.y=v.y
    },
    setAbs: function()    {   //set this to its absolute values
        this.x = Math.abs(this.x)
        this.y = Math.abs(this.y)
    },

    negative: function(){ return new Vector(-this.x, -this.y) },  //returns a new vector object that is the negative of this vector
    length: function() { return Math.sqrt(this.x * this.x + this.y * this.y) },  //returns length of this vector

    add: function(v) {  //add another vector
        this.x += v.x
        this.y += v.y
    },
    subtract: function(v) { //subtract another vector
        this.x -= v.x
        this.y -= v.y
    },
    multiply: function(a) {  //multiply by a scalar
        this.x *= a
        this.y *= a
    },

    normalize: function()
    {
        var length = this.length()
        if (length < Number.MIN_VALUE)
        {
            return 0.0
        }
        var invLength = 1.0 / length
        this.x *= invLength
        this.y *= invLength

        return length
    },

	rotate: function(val) {
	   // Due to float not being precise enough, double is used for the calculations
	   var cosval=Math.cos(val);
	   var sinval=Math.sin(val);
	   var tmpx=this.x*cosval - this.y*sinval;
	   var tmpy=this.x*sinval + this.y*cosval;
	   this.x=tmpx;
	   this.y=tmpy;
   },

});

// ------ general math helper functions ---------------------------------------------------------------------------
function pointToLineDist(x, y, x0, y0, x1, y1) {
    //returns the shortest distance possible between a given point and a line defined by two endpoints
    dx = x1 - x0
    dy = y1 - y0
    if (dx == 0 && dy == 0) {return 0}
    length = pointToPointDist(x0,y0,x1,y1)
    norm_dx = dx / length
    norm_dy = dy / length
    return Math.abs(norm_dx*(y0-y) - norm_dy*(x0-x))
}

function pointToPointDist(x0, y0, x1, y1) {
    //returns the distance between two given points
    return Math.sqrt((x1-x0)*(x1-x0) + (y1-y0)*(y1-y0))
}


function heading2D(x,y){
	angle =Math.atan2(-y,x)
	return -1*angle
}
