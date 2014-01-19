function EventManager (elementId) {
	var self = this;

	this.element = document.getElementById(elementId);

	this.events = {
		left: 0,
		right: 0,
		up: 0,
		down: 0,

		shoot: null
	};

	this.keyPreset = [
		{
			name: 'bépo',
			keys: {
				left: 65,
				right: 73,
				up: 87,
				down: 85
			}
		},
		{
			name: 'qwertz',
			keys: {
				left: 65,
				right: 68,
				up: 87,
				down: 83
			}
		}
	];

	this.currentPreset = this.keyPreset[1];

	this.processEvent = function (e) {
		if (e.type == 'mousedown') {
			self.element.addEventListener('mousemove', self.processEvent, false);
		}
		if (e.type == 'mouseup') {
			self.element.removeEventListener('mousemove', self.processEvent, false);
		}

		switch (e.type) {
			case 'keydown':
			case 'keyup':
				self.processKeyboard(e);
				break;
			case 'mousedown':
			case 'mousemove':
			case 'mouseup':
				self.processMouse(e);
				break;
			default:
				break;
		}

		e.preventDefault();
	};
}

EventManager.prototype.processKeyboard = function (e) {
	switch (e.keyCode) {
		case this.currentPreset.keys.left:
			this.events.left = (e.type == 'keydown');
			break;
		case this.currentPreset.keys.right:
			this.events.right = (e.type == 'keydown');
			break;
		case this.currentPreset.keys.up:
			this.events.up = (e.type == 'keydown');
			break;
		case this.currentPreset.keys.down:
			this.events.down = (e.type == 'keydown');
			break;
	}
};

EventManager.prototype.processMouse = function (e) {
	if (e.type == 'mousedown' || e.type == 'mousemove') {
		this.events.shoot = this.simplifyMouseEvents(e);
	} else {
		this.events.shoot = null;
	}
};

EventManager.prototype.initEvent = function () {
	this.element.addEventListener('mousedown', this.processEvent, false);
	this.element.addEventListener('mouseup', this.processEvent, false);
	window.addEventListener('keydown', this.processEvent, false);
	window.addEventListener('keyup', this.processEvent, false);
};

EventManager.prototype.simplifyMouseEvents = function (e) {
	var simplifiedMouseEvent = {
		x: e.offsetX || e.layerX,
		y: e.offsetY || e.layerY
	};

	return simplifiedMouseEvent;
};

