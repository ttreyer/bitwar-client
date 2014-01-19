const PRESETS = [
	{
		type: 10,
		size: {
			w: 12,
			h: 12
		},
		pixels: [
			[1, 1, 1],
			[1, 1, 1],
			[1, 1, 1]
		]
	},
	{
		type: 11,
		size: {
			w: 12,
			h: 12
		},
		pixels: [
			[1, 1, 1],
			[1, 0, 1],
			[1, 1, 1]
		]
	},
	{
		type: 12,
		size: {
			w: 4,
			h: 4
		},
	pixels: [[1]]
	},
	{
		type: 20,
		size: {
			w: 12,
			h: 12
		},
		pixels: [
			[1, 0, 1],
			[0, 1, 0],
			[1, 0, 1]
		]
	},
	{
		type: 21,
		size: {
			w: 12,
			h: 12
		},
		pixels: [
			[1, 0, 1],
			[0, 0, 0],
			[1, 0, 1]
		]
	},
	{
		type: 30,
		size: {
			w: 12,
			h: 12,
		},
		pixels: [
			[0, 1, 0],
			[1, 1, 1],
			[0, 1, 0]
		]
	},
	{
		type: 31,
		size: {
			w: 12,
			h: 12,
		},
		pixels: [
			[0, 1, 0],
			[1, 0, 1],
			[0, 1, 0]
		]
	},
	{
		type: 32,
		size: {
			w: 6,
			h: 6,
		},
		pixels: [
			[1, 1],
			[1, 1]
		]
	},
	{
		type: 40,
		size: {
			w: 12,
			h: 12,
		},
		pixels: [
			[1, 1, 0],
			[1, 1, 1],
			[0, 1, 1]
		]
	},
	{
		type: 41,
		size: {
			w: 12,
			h: 12,
		},
		pixels: [
			[1, 1, 0],
			[1, 0, 1],
			[0, 1, 1]
		]
	},
	{
		type: 43,
		size: {
			w: 8,
			h: 8
		},
		pixels: [
			[1, 0],
			[1, 1]
		]
	},
	{
		type: 44,
		size: {
			w: 8,
			h: 8
		},
		pixels: [
			[1, 0],
			[0, 1]
		]
	},
	{
		type: 50,
		size: {
			w: 12,
			h: 12
		},
		pixels: [
			[1, 0, 1],
			[1, 1, 1],
			[0, 1, 0]
		]
	},
	{
		type: 51,
		size: {
			w: 12,
			h: 12
		},
		pixels: [
			[1, 0, 1],
			[1, 0, 1],
			[0, 1, 0]
		]
	}
];
var PIXMAPS = [],
		ps = null;

for (var i = 0, l = PRESETS.length; i < l; i++) {
	ps = PRESETS[i];

	PIXMAPS.push(new Pixmap(ps.type, ps.size, ps.pixels));
}

var CONF = {
	teamColors: [
		'WhiteSmoke',
		'LimeGreen',
		'Tomato',
		'Gold',
		'SteelBlue',
		'pink',
		'orange',
		'cyan',
		'purple',
		'green',
		'red'
	],
	pixmaps: PIXMAPS
};
