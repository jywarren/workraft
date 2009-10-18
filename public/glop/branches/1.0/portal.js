function import_objects(space_slug,last_get) {
	load_script('/object/space/'+space_slug+'.json?last_get='+portal.last_get.toTimeString())
}

function import_object(slug) {
	load_script('/object/get/'+slug+'.json')
}

function delete_object(target) {
	objects.each(function(object,index){
		if (object.obj_id == target.obj_id) {
			objects.splice(index,1)
			delete target
		}
	})
}

var Portal = Class.create(deep_clone(box), {
	initialize: function() {
		this.obj_id = highest_id()+1
		portal = this
		new PeriodicalExecuter(function() {
			if (space_slug == "home") {
				if (objects.length > 30) {
					var target = objects.splice(2,1)[0]
					delete target
					target = objects.splice(2,1)[0]
					delete target
				}
				import_objects("home",portal.last_get)
			}
		}, 1);
	},
	w: 50,
	h: 50,
	diameter: 50,
	color: "#333",
	y: 100,
	x: 100,
	space_slug: "home",
	busy: false,
	last_get: new Date(),
	breathe: function() {
		this.w = this.diameter + Math.sin(frame/4+this.obj_id)*2
	},
	draw: function() {
		if (this.exploded) {
			this.guts()
		}
		if (this.overlaps(pointerX,pointerY,100) && this.diameter < 80) {
			this.diameter += 5
		} else if (!this.overlaps(pointerX,pointerY,100) && this.diameter > 20) {
			this.diameter -= 5
		}
		this.shape()
		this.breathe()
		var portal = this
		this.delay += 1
		if (frame > 30 && !this.busy && dragging) {
			objects.each(function(object) {
				if (portal.overlaps(object.x,object.y,10) && !(object instanceof Portal) && object.dragging) {
					overlapped = true
					portal.color = "red"
					new Ajax.Request('/object/save',{
						  method: 'post',
						  onCreate: function(response) {
							//prevent other calls
							portal.busy = true
							portal.color = "red"
						  },
						  onSuccess: function(response) {
							delete_object(object)
							portal.color = "green"
							portal.busy = false
							portal.last_get = new Date()
						  },
						  parameters: { "json": object_code(object), "slug": object.obj_id+"_obj", "space_slug": portal.space_slug }
						})
				}
			})
		}
		portal.color = "#333"
  },
  shape: function() {
    canvas.save()
	fillStyle(this.color)
	translate(this.x,this.y)
	rotate(this.rotation)
	beginPath()
		arc(0,0,this.w/2,0,Math.PI*2,true)
	fill()
	canvas.restore()
  },
  highlight: function() {
	canvas.save()
		strokeStyle("rgba(40,40,40,0.2)")
		lineWidth(8)
		translate(this.x,this.y)
		rotate(this.rotation)
		beginPath()
			arc(0,0,this.w/2,0,Math.PI*2,true)
		stroke()
	canvas.restore()
  },
  rightclick: function() {
	this.space_slug = prompt("Link this to another space:", "Type the space name here")
  },
  click: function() {
  }
})

var portal = new Portal
objects.push(portal)

// var BlackHole = deep_clone(portal)
// objects.push(BlackHole)

