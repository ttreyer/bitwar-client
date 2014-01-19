function ScoreBoard (scoreId, conf) {
	this.conf = conf;

	this.canvas = document.getElementById(scoreId);
	this.canvas.width = 360;

	this.strokeStyle = 'WhiteSmoke';
	this.fillStyle = 'black';

	this.border = 10;
	this.fontSize = 18;
	this.lineHeight = this.fontSize + 4;

	this.ctx = this.canvas.getContext('2d');

	this.data = [];
}

ScoreBoard.prototype.compareScore = function (a, b) {
	var retval = b.score - a.score;

	if (retval == 0)
		retval = b.kill - a.kill;

	if (retval == 0)
		retval = b.death - a.death;

	return retval;
}

ScoreBoard.prototype.setData = function (newData) {
	this.data = newData;
	this.data.sort(this.compareScore);

	this.redraw();
};

ScoreBoard.prototype.redraw = function () {
	var x = 0, y = 0;

	this.ctx.fillStyle = this.fillStyle;
	this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

	this.ctx.fillStyle = 'WhiteSmoke';
	this.ctx.font = this.fontSize + 'px Arial';

	this.ctx.textAlign = 'left';

	x = this.border;
	y = this.border + this.fontSize;
	this.ctx.fillText('Nickname', x, y);
	
	this.ctx.textAlign = 'right';

	x = this.canvas.width - this.border - (this.canvas.width / 3);
	this.ctx.fillText('Kill', x, y);
	x = this.canvas.width - this.border - (this.canvas.width / 6);
	this.ctx.fillText('Death', x, y);
	x = this.canvas.width - this.border;
	this.ctx.fillText('Score', x, y);

	for (var i = 0, l = this.data.length; i < l; i++) {
		y = i * this.lineHeight + this.fontSize + this.border + this.fontSize * 1.5;
		this.ctx.fillStyle = this.conf.teamColors[this.data[i].team];

		x = this.border;
		this.ctx.textAlign = 'left';
		this.ctx.fillText(this.data[i].nick, x, y);

		x = this.canvas.width - this.border - this.canvas.width / 3;
		this.ctx.textAlign = 'right';
		this.ctx.fillText(this.data[i].kill, x, y);

		x = this.canvas.width - this.border - this.canvas.width / 6;
		this.ctx.fillText(this.data[i].death, x, y);

		x = this.canvas.width - this.border;
		this.ctx.fillText(this.data[i].score, x, y);
	}
};
