const MSG_TYPE_ENTITIES = 1,
			MSG_TYPE_ID = 2,
			MSG_TYPE_MAP = 3,
			MSG_TYPE_PLAYERS_INFO = 4,
			MSG_TYPE_SCORES = 5,
			MSG_TYPE_SHIPS = 6;

const ENTITY_MAP_TYPE = 0;

function Bitwar (canvasId, conf) {
	var self = this;

	this.canvas = document.getElementById(canvasId);
	this.ctx = this.canvas.getContext('2d');

	this.conf = conf;

	this.fillStyle = 'black';
	this.strokeStyle = 'black';

	this.id = null;
	this.map = null;

	this.sb = new ScoreBoard('scores', this.conf);
	this.em = new EventManager(canvasId);

	this.ss = new ShipSelection('ships', this.conf);
	this.ss.observer = this;
	this.ss.observerFunc = function (new_ship) {
		console.log("New ship selected: %d", new_ship);
		this.net.sendShip(new_ship);
	};

	this.net = new Net();
	this.net.observer = this;
	this.net.observerFunc = function (message_type) {
		switch (message_type) {
			case MSG_TYPE_ENTITIES:
				self.redraw();
				self.sendEvents();
				break;
			case MSG_TYPE_ID:
				self.id = self.net.id;
				break;
			case MSG_TYPE_MAP:
				self.setMap(self.net.map);
				break;
			case MSG_TYPE_PLAYERS_INFO:
				self.setPlayersInfo(self.net.players);
				break;
			case MSG_TYPE_SCORES:
				self.setScores();
				break;
			case MSG_TYPE_SHIPS:
				self.setShips();
				break;
			default:
				console.warn('Unknown notification');
				break;
		}
	};
}

Bitwar.prototype.setMap = function (newMap) {
	this.canvas.width = newMap.w;
	this.canvas.height = newMap.h;

	this.sb.canvas.height = newMap.h;

	this.map = new Pixmap(ENTITY_MAP_TYPE, newMap, newMap.data);
};

Bitwar.prototype.redraw = function () {
	var entity = {},
			pixmap = null,
			canvas = null;

	this.ctx.fillStyle = this.fillStyle;
	this.ctx.strokeStyle = this.strokeStyle;

	this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

	if (this.map)
		this.ctx.drawImage(this.map.getCanvas(), 0, 0);

	for (var i = 0, l = this.net.entities.length; i < l; i++) {
		this.net.getEntity(i, entity);

		if (entity.player == this.id && (entity.type % 10) == 1)
			entity.type -= 1;

		pixmap = this.getPixmap(entity.type, entity.team);
		canvas = pixmap.getCanvas(this.conf.teamColors[entity.team]);

		this.ctx.drawImage(canvas, entity.x, entity.y);
	}
	fps++;
};

Bitwar.prototype.getPixmap = function (type) {
	for (var i = 0, l = this.conf.pixmaps.length; i < l; i++) {
		if (this.conf.pixmaps[i].type == type)
			return this.conf.pixmaps[i];
	}
};

Bitwar.prototype.sendEvents = function () {
	this.net.sendEvents(this.em.events);
};

Bitwar.prototype.pairScoresData = function () {
	var scores = [],
			player = null;

	for (var i = 0, l = this.net.players.length; i < l; i++) {
		player = {};

		this.net.getScore(this.net.players[i].id, player);

		player.nick = this.net.players[i].nick;

		scores.push(player);
	}

	return scores;
};

Bitwar.prototype.setPlayersInfo = function () {
};

Bitwar.prototype.setScores = function () {
	var scores = this.pairScoresData();

	this.sb.setData(this.pairScoresData());
};

Bitwar.prototype.setShips = function () {
	this.ss.setShips(this.net.ships);
};
