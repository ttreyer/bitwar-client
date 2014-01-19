const TYPE_INT8_SIZE = 1,
			TYPE_INT16_SIZE = 2,
			TYPE_INT32_SIZE = 4;

const MSG_TYPE_ENTITIES = 3,
			MSG_TYPE_ID = 1,
			MSG_TYPE_MAP = 2,
			MSG_TYPE_PLAYERS_INFO = 4,
			MSG_TYPE_SCORES = 5,
			MSG_TYPE_SHIPS = 6;

const MSG_HEADER_SIZE = 4,
			MSG_HEADER_OFFSET = 0;

const MSG_ENTITIES_SIZE = 8,
			MSG_ENTITIES_PLAYER_OFFSET = 0,
			MSG_ENTITIES_TEAM_OFFSET = 1,
			MSG_ENTITIES_TYPE_OFFSET = 2,
			MSG_ENTITIES_X_OFFSET = 4,
			MSG_ENTITIES_Y_OFFSET = 6;

const MSG_MAP_HEADER_SIZE = 8,
			MSG_MAP_HEADER_OFFSET = 0,
			MSG_MAP_DISPLAY_WIDTH_OFFSET = 0,
			MSG_MAP_DISPLAY_HEIGHT_OFFSET = 2,
			MSG_MAP_WIDTH_OFFSET = 4,
			MSG_MAP_HEIGHT_OFFSET = 6,
			MSG_MAP_DATA_OFFSET = 8;

const PLAYERS_INFO_HEADER_SIZE = 4,
			PLAYERS_INFO_HEADER_OFFSET_LENGTH = 0,
			PLAYERS_INFO_PLAYER_HEADER_SIZE = 2,
			PLAYERS_INFO_PLAYER_HEADER_OFFSET_ID = 0,
			PLAYERS_INFO_PLAYER_HEADER_OFFSET_TEAM = 1,
			PLAYERS_INFO_OFFSET_NICK = 2,
			PLAYERS_INFO_NICK_EOS = 0;

const SCORE_SIZE = 8,
			SCORE_OFFSET_PLAYER = 0,
			SCORE_OFFSET_TEAM = 1,
			SCORE_OFFSET_KILL = 2,
			SCORE_OFFSET_DEATH = 4,
			SCORE_OFFSET_SCORE = 6;  

const SHIPS_SIZE = 2,
			SHIPS_OFFSET_TYPE = 0;

function Net (host, port) {
	var self = this;

	this.host = host || window.location.hostname || 'localhost';
	this.port = port || 55455;
	this.secure = false;

	this.observer = null;
	this.observerFunc = null;

	this.id = null;
	this.map = {};
	this.entities = {
		length: 0,
		player: [],
		team: [],
		type: [],
		x: [],
		y: []
	};
	this.players = [];
	this.scores = {
		length: 0,
		player: [],
		team: [],
		kill: [],
		death: [],
		score: []
	};

	this.onOpen = function (e) {
		console.log('Connected to %s:%s', self.host, self.port);
	};

	this.onClose = function (e) {
		console.log('Connection closed');
	};

	this.onError = function (e) {
		console.error('Something went wrong: %s', e);
	};

	this.onMessage = function (e) {
		//console.log('Incoming data');

		var data = e.data,
				header = self.parseHeader(data);

		//console.log(header);

		switch (header.type) {
			case MSG_TYPE_ENTITIES:
				self.setEntities(data, header);
				break;
			case MSG_TYPE_ID:
				self.setId(data, header);
				break;
			case MSG_TYPE_MAP:
				self.setMap(data, header);
				break;
			case MSG_TYPE_PLAYERS_INFO:
				self.setPlayersInfo(data, header);
				break;
			case MSG_TYPE_SCORES:
				self.setScores(data, header);
				break;
			case MSG_TYPE_SHIPS:
				self.setShips(data, header);
				break;
			default:
				console.warn('Unknown header type');
				break;
		};
	};
}

Net.prototype.getURL = function () {
	var url;

	if (!this.secure)
		url = 'ws://';
	else
		url = 'wss://';

	url += this.host + ':' + this.port;

	return url;
};

Net.prototype.connect = function () {
	this.ws = new WebSocket(this.getURL());

	this.ws.binaryType = 'arraybuffer';

	this.ws.onopen = this.onOpen;
	this.ws.onclose = this.onClose;
	this.ws.onmessage = this.onMessage;
	this.ws.onerror = this.onError;
};

Net.prototype.parseHeader = function (message) {
	var headerBuffer = new Uint16Array(message, MSG_HEADER_OFFSET, 2);

	return {
		type: headerBuffer[0],
		length: headerBuffer[1]
	};
};

Net.prototype.setId = function (message, header) {
	var idBuffer = new Uint8Array(message, MSG_HEADER_SIZE, 1);

	this.id = idBuffer[0];

	this.notifyObserver(MSG_TYPE_ID);

	console.log(this.id);
};

Net.prototype.setMap = function (message, header) {
	var mapBuffer = new Uint16Array(message,
				MSG_HEADER_SIZE + MSG_MAP_HEADER_OFFSET,
				MSG_MAP_HEADER_SIZE / TYPE_INT16_SIZE);

	var mapW = mapBuffer[2],
			mapH = mapBuffer[3],
			mapData = new Uint8Array(message,
				MSG_HEADER_SIZE + MSG_MAP_DATA_OFFSET,
				mapW * mapH);

	this.map.w = mapBuffer[0];
	this.map.h = mapBuffer[1];
	this.map.data = [];

	for (var i = 0, w = mapW; i < w; i++) {
		this.map.data[i] = [];

		for (var j = 0, h = mapH; j < h; j++) {
			this.map.data[i][j] = mapData[i * mapW + j];
		}
	}

	this.notifyObserver(MSG_TYPE_MAP);
};

Net.prototype.setEntities = function (message, header) {
	this.entities.length = header.length / MSG_ENTITIES_SIZE;

	if (this.entities.length > 0) {
		this.entities.player = new Uint8Array(message, MSG_HEADER_SIZE + MSG_ENTITIES_PLAYER_OFFSET);
		this.entities.team = new Int8Array(message, MSG_HEADER_SIZE + MSG_ENTITIES_TEAM_OFFSET);
		this.entities.type = new Uint16Array(message, MSG_HEADER_SIZE + MSG_ENTITIES_TYPE_OFFSET);
		this.entities.x = new Int16Array(message, MSG_HEADER_SIZE + MSG_ENTITIES_X_OFFSET);
		this.entities.y = new Int16Array(message, MSG_HEADER_SIZE + MSG_ENTITIES_Y_OFFSET);
	}

	this.notifyObserver(MSG_TYPE_ENTITIES);
};

Net.prototype.getEntity = function (index, ptr) {
	if (index < this.entities.length) {
		ptr.player = this.entities.player[(index * MSG_ENTITIES_SIZE) / TYPE_INT8_SIZE];
		ptr.team = this.entities.team[(index * MSG_ENTITIES_SIZE) / TYPE_INT8_SIZE];
		ptr.type = this.entities.type[(index * MSG_ENTITIES_SIZE) / TYPE_INT16_SIZE];
		ptr.x = this.entities.x[(index * MSG_ENTITIES_SIZE) / TYPE_INT16_SIZE];
		ptr.y = this.entities.y[(index * MSG_ENTITIES_SIZE) / TYPE_INT16_SIZE];
	} else
		console.error('Trying to get an entity beyond the limits');
};

Net.prototype.notifyObserver = function (type) {
	if (this.observer != null && this.observerFunc != null)
		this.observerFunc.call(this.observer, type);
};

Net.prototype.sendEvents = function (events) {
	var message = {};

	message.type = 'events';
	message.events = events;

	this.ws.send(JSON.stringify(message));
};

Net.prototype.sendNick = function (newNick) {
	var message = {};

	message.type = 'nick';
	message.nick = newNick;

	this.ws.send(JSON.stringify(message));
};

Net.prototype.sendShip = function (ship) {
	var message = {};

	message.type = 'ship';
	message.ship = ship;

	this.ws.send(JSON.stringify(message));
};

Net.prototype.strlen = function (data, offset) {
	var length = 0;

	while (data[offset + length] != PLAYERS_INFO_NICK_EOS)
		length++;

	return length;
};

Net.prototype.setPlayersInfo = function (message, header) {
	var playersData = new Uint8Array(message, MSG_HEADER_SIZE),
			playersLength = playersData[0],
			offset = 0, po = 0, nickLength = 0,
			nickData = null, ns = 0;

	this.players.length = 0;

	for (var i = 0; i < playersLength; i++) {
		po = PLAYERS_INFO_HEADER_SIZE + offset;

		var player = {};

		player.id = playersData[po + PLAYERS_INFO_PLAYER_HEADER_OFFSET_ID];
		player.team = playersData[po + PLAYERS_INFO_PLAYER_HEADER_OFFSET_TEAM];

		ns = po + PLAYERS_INFO_OFFSET_NICK;
		nickLength = this.strlen(playersData, ns);
		nickData = playersData.subarray(ns, ns + nickLength);

		player.nick = String.fromCharCode.apply(String, nickData);

		offset += PLAYERS_INFO_PLAYER_HEADER_SIZE + nickLength + 1;

		this.players.push(player);
	}

	this.notifyObserver(MSG_TYPE_PLAYERS_INFO);
	console.log(this.players);
};

Net.prototype.setScores = function (message, header) {
	this.scores.length = header.length / SCORE_SIZE;

	if (this.scores.length > 0) {
		this.scores.player = new Uint8Array(message, MSG_HEADER_SIZE + SCORE_OFFSET_PLAYER);
		this.scores.team = new Int8Array(message, MSG_HEADER_SIZE + SCORE_OFFSET_TEAM);
		this.scores.kill = new Int16Array(message, MSG_HEADER_SIZE + SCORE_OFFSET_KILL);
		this.scores.death = new Int16Array(message, MSG_HEADER_SIZE + SCORE_OFFSET_DEATH);
		this.scores.score = new Int16Array(message, MSG_HEADER_SIZE + SCORE_OFFSET_SCORE);
	}

	this.notifyObserver(MSG_TYPE_SCORES);
};

Net.prototype.getScore = function (player, ptr) {
	var playerIndex = Infinity,
			playerId = -1;

	for (var i = 0, l = this.scores.length; i < l; i++) {
		playerId = this.scores.player[(i * SCORE_SIZE) / TYPE_INT8_SIZE];

		if (player == playerId) {
			playerIndex = i;
			break;
		}
	}

	if (playerIndex < this.scores.length) {
		ptr.player = this.scores.player[(playerIndex * SCORE_SIZE) / TYPE_INT8_SIZE];
		ptr.team = this.scores.team[(playerIndex * SCORE_SIZE) / TYPE_INT8_SIZE];
		ptr.kill = this.scores.kill[(playerIndex * SCORE_SIZE) / TYPE_INT16_SIZE];
		ptr.death = this.scores.death[(playerIndex * SCORE_SIZE) / TYPE_INT16_SIZE];
		ptr.score = this.scores.score[(playerIndex * SCORE_SIZE) / TYPE_INT16_SIZE];
	} else
		console.error('Trying to get a score beyond the limits');
};

Net.prototype.setShips = function (message, header) {
	this.ships = new Uint16Array(message, MSG_HEADER_SIZE);

	this.notifyObserver(MSG_TYPE_SHIPS);
};
