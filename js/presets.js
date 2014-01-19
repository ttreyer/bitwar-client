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
	}
];

var PIXMAPS = [],
		ps = null;

for (var i = 0, l = PRESETS.length; i < l; i++) {
	ps = PRESETS[i];

	PIXMAPS.push(new Pixmap(ps.type, ps.size, ps.pixels));
}

console.log(PIXMAPS);

var CONF = {
	teamColors: [
		'WhiteSmoke',
		'LimeGreen',
		'Tomato',
		'Gold',
		'SteelBlue'
	],
	pixmaps: PIXMAPS
};
