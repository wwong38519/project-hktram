var $ = require('jquery');
import React from 'react';
import ReactDOM from 'react-dom';
import { browserHistory, Router, Route } from 'react-router';
import config from './config';

class Stop extends React.Component {
	selectStop() {
		this.props.notify(this);
	}
	render() {
		return (
			<div className="stop" data-direction={this.props.direction} data-ordinal={this.props.ordinal} onClick={this.selectStop.bind(this)}>{this.props.name}</div>
		);
	}
}

class StopInfo extends React.Component {
	render() {
		if (this.props.content && this.props.content.root && this.props.content.root.metadata) {
			var list = this.props.content.root.metadata;
			return (
				<div>
				<div>{this.props.name} ({this.context.lang[this.props.direction]})</div>
				{list.map((value, idx) =>
					<div key={idx} className="row">
					<div className="col-xs-6">{value.$[this.context.idx.msg] === undefined ? value.$[this.context.idx.info] : value.$[this.context.idx.msg]}</div>
					<div className="col-xs-6">{value.$.is_arrived == 1 ? this.context.lang.arrived : value.$.arrive_in_minute + this.context.lang.unit}</div>
					</div>
				)}
				</div>
			);
		} else {
			return <div></div>;
		}
	}
}

class TramStops extends React.Component {
	constructor() {
		super();
		this.state = {data: [], info: [], stop: {code: '', name: '', direction: ''}};
		this.initialized = false;
	}
	loadStops() {
		$.ajax({
			url: this.props.url+'/list',
			dataType: 'json',
			success: (data) => {
				this.setState({data: data});
				this.initialized = true;
			},
			error: (xhr, status, err) => {
				console.error(this.props.url, status, err.toString());
			}
		});
	}
	loadInfo() {
		$.ajax({
			url: this.props.url+'/eta?stop='+this.state.stop.code,
			dataType: 'json',
			success: (data) => {
				this.setState({info: data});
			},
			error: (xhr, status, err) => {
				console.error(this.props.url, status, err.toString());
			}
		});
	}
	componentWillMount() {
		if (!this.initialized) this.loadStops();
	}
	render() {
		var list = this.state.data;
		return (
			<div className="row">
				<div className="col-xs-3 west">
					{(list && list[this.context.west]) && list[this.context.west].map((value, idx) =>
						<Stop key={idx} ordinal={idx} direction={this.context.west} code={value[this.context.idx.code]} name={value[this.context.idx.name]} notify={this.showInfo.bind(this)}/>
					)}
				</div>
				<div className="col-xs-3 east">
					{(list && list[this.context.east]) && list[this.context.east].map((value, idx) =>
						<Stop key={idx} ordinal={idx} direction={this.context.east} code={value[this.context.idx.code]} name={value[this.context.idx.name]} notify={this.showInfo.bind(this)}/>
					)}
				</div>
				<div className="col-xs-5 col-xs-offset-1 info">
					<StopInfo content={this.state.info} direction={this.state.stop.direction} name={this.state.stop.name} />
				</div>
			</div>
		);
	}
	showInfo(stop) {
		this.setState({stop: {code: stop.props.code, name: stop.props.name, direction: stop.props.direction}}, function() {
			if (this.state.stop.code) this.loadInfo();
		});
	}
}

class App extends React.Component {
	getChildContext() {
		var options = Object.assign({}, config.defaults, this.props.location.query);
		return {
			west: config.direction.west,
			east: config.direction.east,
			lang: config.lang[options.locale],
			idx: {
				code: config.settings.stop.idx.code, 
				name: config.settings.stop.idx[options.locale], 
				info: config.settings.info.idx[options.locale], 
				msg: config.settings.msg.idx[options.locale]
			}
		};
	}
	render() {
		return (<TramStops url={config.url} />);
	}
}

const routes = (
	<Router history={browserHistory}>
		<Route path="*" component={App} />
	</Router>
);

const context = { west: React.PropTypes.string, east: React.PropTypes.string, lang: React.PropTypes.object, idx: React.PropTypes.object };

App.childContextTypes = context;
TramStops.contextTypes = context;
StopInfo.contextTypes = context;

ReactDOM.render(routes, document.getElementById('content'));
