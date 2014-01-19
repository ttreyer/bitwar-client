const SHIP_ICON_SIZE = { w: 60, h: 60 }
			SHIP_BORDER = 10;

function ShipSelection (shipsId, conf) {
	var self = this;

	this.conf = conf;

	this.canvas = document.getElementById(shipsId);
	this.canvas.height = 80;

	this.strokeStyle = 'WhiteSmoke';
	this.fillStyle = 'WhiteSmoke';

	this.ctx = this.canvas.getContext('2d');

	this.ships = [];
	this.currentHover = -1;
	this.currentSelection = -1;

	this.processMouse = function (e) {
		var need_redraw = false;
		var ship_index = Math.floor((e.offsetX - SHIP_BORDER / 2) / (SHIP_ICON_SIZE.w + SHIP_BORDER));

		if (ship_index < 0 || ship_index >= self.ships.length)
			ship_index = -1;
		else
			ship_index = self.ships[ship_index];
		
		need_redraw = this.currentHover != ship_index;
		switch (e.type) {
			case 'mouseout':
				self.currentHover = -1;
				break;
			case 'mousemove':
				self.currentHover = ship_index;
				break;
			case 'mouseup':
				if (self.currentSelection != ship_index) {
					self.currentSelection = ship_index;
					self.notifyObserver(self.currentSelection);
				}
				break;
			default:
				console.warn('Unknown mouse event on ShipSelection');
		}

		if (need_redraw)
			self.redraw();
	}

	this.canvas.addEventListener('mouseout', self.processMouse, false);
	this.canvas.addEventListener('mousemove', self.processMouse, false);
	this.canvas.addEventListener('mouseup', self.processMouse, false);
}

ShipSelection.prototype.notifyObserver = function (arg) {
	if (this.observer != null && this.observerFunc != null)
		this.observerFunc.call(this.observer, arg);
};

ShipSelection.prototype.initEvent = function () {
	this.canvas.addEventListener
};

ShipSelection.prototype.getPresetById = function (ship_id) {
	var preset = null;

	for (var i = 0, l = this.conf.pixmaps.length; i < l; i++) {
		if (this.conf.pixmaps[i].type == ship_id) {
			preset = this.conf.pixmaps[i];
			break;
		}
	}

	return preset;
};

ShipSelection.prototype.setShips = function (newShips) {
	this.ships = newShips;
	this.currentSelection = this.ships[0];

	this.canvas.width = SHIP_BORDER + (SHIP_ICON_SIZE.w + SHIP_BORDER) * this.ships.length;
	this.redraw();
};

ShipSelection.prototype.redraw = function () {
	this.fillStyle = 'black';
	this.strokStyle = 'black';

	this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

	for (var i = 0, l = this.ships.length; i < l; i++) {
		var preset_id = this.ships[i];
		if (this.currentHover == preset_id || this.currentSelection == preset_id)
			preset_id--;

		var preset = this.getPresetById(preset_id);
		this.drawShip(i, preset);
	}
};

ShipSelection.prototype.drawShip = function (offset, ship) {
	if (ship == null) {
		console.warn('Trying to draw an unknown ship');
	} else {
		var icon_buffer = ship.getIcon(SHIP_ICON_SIZE);
	
		this.ctx.drawImage(icon_buffer.canvas, SHIP_BORDER + (SHIP_ICON_SIZE.w + SHIP_BORDER) * offset, SHIP_BORDER);
	}
};
