var config = {
	url : '',
	direction: {east: 'EB', west: 'WB'},
	lang: {
		en: {WB: 'West', EB: 'East', unit: ' min', arrived: 'arrived'},
		tc: {WB: '西行', EB: '東行', unit: '分鐘', arrived: '到達'},
		sc: {WB: '西行', EB: '東行', unit: '分鐘', arrived: '到達'}
	},
	settings: {
		stop: {idx: {code: 0, en: 1, tc: 2, sc: 3, lat: 4, lng: 5}},
		info: {idx: {en: 'tram_dest_en', tc: 'tram_dest_tc', sc: 'tram_dest_tc'}},
		msg: {idx: {en: 'msg_en', tc: 'msg_tc', sc: 'msg_tc'}}
	},
	defaults: {
		locale: 'tc'
	}
};

export default config;