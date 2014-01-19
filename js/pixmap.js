function Pixmap (type, size, pixels) {
	this.type = type;

	this.size = {
		w: size.w,
		h: size.h
	};

	this.pixels = pixels;

	this.pixSize = {
		w: this.size.w / this.pixels[0].length,
		h: this.size.h / this.pixels.length
	};

	this.fillStyle = 'WhiteSmoke';
	this.strokeStyle = 'black';

	this.buffers = {};
	this.icon = null;
}

Pixmap.prototype.setSize = function (s) {
	this.size.w = s.w;
	this.size.h = s.h;

	this.pixSize.w = this.size.w / this.pixels[0].length;
	this.pixSize.h = this.size.h / this.pixels.length;
};

Pixmap.prototype.getIcon = function (size) {
	if (this.icon == null) {
		var oldSize = { w: this.size.w, h: this.size.h };
		this.setSize(size);

		this.icon = this.render('WhiteSmoke');
		this.setSize(oldSize);
	}

	return this.icon;
};

Pixmap.prototype.posForPix = function (row, col, ptr) {
	ptr.x = col * this.pixSize.w;
	ptr.y = row * this.pixSize.h;
};

Pixmap.prototype.createBuffer = function () {
	var canvas = document.createElement('canvas');

	canvas.width = this.size.w;
	canvas.height = this.size.h;

	return canvas.getContext('2d');
};

Pixmap.prototype.render = function (color) {
	console.log('Rendering...');
		
	var pospix = {},
			buffer = this.createBuffer();

	buffer.fillStyle = color;
	buffer.strokeStyle = this.strokeStyle;

	for (var i = 0, l = this.pixels.length; i < l; i++) {
		for (var j = 0, m = this.pixels[i].length; j < m; j++) {
			if (this.pixels[i][j] > 0) {
				this.posForPix(i, j, pospix);

				if (this.fillStyle != null)
					buffer.fillRect(pospix.x, pospix.y, this.pixSize.w, this.pixSize.h);

				if (this.strokeStyle != null)
					buffer.strokeRect(pospix.x, pospix.y, this.pixSize.w, this.pixSize.h);
			}
		}
	}

	console.log('Rendering... Done');

	return buffer;
};

Pixmap.prototype.getCanvas = function (color) {
	if (!color)
		color = this.fillStyle;

	if (!this.buffers[color])
		this.buffers[color] = this.render(color);

	return this.buffers[color].canvas;
};
