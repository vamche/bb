define(['exports', 'react', 'react-dom', 'react-redux', 'socket.io', 'app/api/donorsAPI', 'app/containers/infoContainer', 'app/utilities/MapUtilities', 'app/actions/donorActions', 'esri/geometry/Point', 'app/utilities/constants'], function (exports, _react, _reactDom, _reactRedux, _socket, _donorsAPI, _infoContainer, _MapUtilities, _donorActions, _Point, _constants) {
	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	var _react2 = _interopRequireDefault(_react);

	var _reactDom2 = _interopRequireDefault(_reactDom);

	var _socket2 = _interopRequireDefault(_socket);

	var _infoContainer2 = _interopRequireDefault(_infoContainer);

	var _Point2 = _interopRequireDefault(_Point);

	var appConstants = _interopRequireWildcard(_constants);

	function _interopRequireWildcard(obj) {
		if (obj && obj.__esModule) {
			return obj;
		} else {
			var newObj = {};

			if (obj != null) {
				for (var key in obj) {
					if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key];
				}
			}

			newObj.default = obj;
			return newObj;
		}
	}

	function _interopRequireDefault(obj) {
		return obj && obj.__esModule ? obj : {
			default: obj
		};
	}

	function _classCallCheck(instance, Constructor) {
		if (!(instance instanceof Constructor)) {
			throw new TypeError("Cannot call a class as a function");
		}
	}

	var _createClass = function () {
		function defineProperties(target, props) {
			for (var i = 0; i < props.length; i++) {
				var descriptor = props[i];
				descriptor.enumerable = descriptor.enumerable || false;
				descriptor.configurable = true;
				if ("value" in descriptor) descriptor.writable = true;
				Object.defineProperty(target, descriptor.key, descriptor);
			}
		}

		return function (Constructor, protoProps, staticProps) {
			if (protoProps) defineProperties(Constructor.prototype, protoProps);
			if (staticProps) defineProperties(Constructor, staticProps);
			return Constructor;
		};
	}();

	function _possibleConstructorReturn(self, call) {
		if (!self) {
			throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
		}

		return call && (typeof call === "object" || typeof call === "function") ? call : self;
	}

	function _inherits(subClass, superClass) {
		if (typeof superClass !== "function" && superClass !== null) {
			throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
		}

		subClass.prototype = Object.create(superClass && superClass.prototype, {
			constructor: {
				value: subClass,
				enumerable: false,
				writable: true,
				configurable: true
			}
		});
		if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
	}

	var socket = _socket2.default.connect();

	var mapStateToProps = function mapStateToProps(state) {
		return {
			donors: state.donorsReducer.donors,
			filters: state.donorsReducer.filters,
			donorEditable: state.donorsReducer.donorEditable
		};
	};

	var mapDispatchToProps = function mapDispatchToProps(dispatch) {
		return {
			addDonorToList: function addDonorToList(donor) {
				dispatch((0, _donorActions.addDonorToList)(donor));
			},
			updateDonorInList: function updateDonorInList(donor) {
				dispatch((0, _donorActions.updateDonorInList)(donor));
			},
			deleteDonorFromList: function deleteDonorFromList(donorId) {
				dispatch((0, _donorActions.deleteDonorFromList)(donorId));
			}
		};
	};

	var MapUI = function (_Component) {
		_inherits(MapUI, _Component);

		function MapUI(props) {
			_classCallCheck(this, MapUI);

			var _this = _possibleConstructorReturn(this, (MapUI.__proto__ || Object.getPrototypeOf(MapUI)).call(this, props));

			_this.state = {
				graphicsLayer: {},
				view: {},
				donors: [],
				filters: [],
				donorEditable: {}

			};
			return _this;
		}

		_createClass(MapUI, [{
			key: 'componentWillMount',
			value: function componentWillMount() {

				//GET THE DONOR DETAILS
				//IF THE URL CONTAINS DONOR ID
				var pathName = window.location.pathname;
				var donorId = pathName.split('/')[1];
				if (donorId && donorId != "") {
					(0, _donorsAPI.getDonorDetails)(donorId);
				}
			}
		}, {
			key: 'componentDidMount',
			value: function componentDidMount() {
				var _this2 = this;

				var mapViewAndGraphicsLayer = (0, _MapUtilities.setInitialMapView)(this.refs.mapView, this.props.donorEditable);

				this.setState({ view: mapViewAndGraphicsLayer.view, graphicsLayer: mapViewAndGraphicsLayer.graphicsLayer });

				// Socket Operations
				socket.on('DONOR_ADDED', function (donor) {
					return _this2.props.addDonorToList(donor);
				});
				socket.on('DONOR_UPDATED', function (donor) {
					return _this2.props.updateDonorInList(donor);
				});
				socket.on('DONOR_REMOVED', function (donorId) {
					return _this2.props.deleteDonorFromList(donorId);
				});
			}
		}, {
			key: 'componentDidUpdate',
			value: function componentDidUpdate() {
				var _this3 = this;

				// Update the graphics when there is a donors' state change
				if (this.props.donors.length > 0) {
					(function () {
						var selectedFilters = [];
						_this3.props.filters.forEach(function (filterItem) {
							if (filterItem.selected) {
								selectedFilters.push(filterItem.id);
							}
						});
						_this3.state.graphicsLayer && _this3.state.graphicsLayer.graphics && _this3.state.graphicsLayer.graphics.removeAll();
						_this3.props.donors.forEach(function (donor) {
							// Filter donors
							if (selectedFilters.indexOf(donor.bloodGroup) > -1) {
								_this3.state.graphicsLayer.graphics.add((0, _MapUtilities.createGraphicForDonor)(donor));
							}
						});
					})();
				} else {
					this.state.graphicsLayer && this.state.graphicsLayer.graphics && this.state.graphicsLayer.graphics.removeAll();
				}
			}
		}, {
			key: 'componentWillReceiveProps',
			value: function componentWillReceiveProps(nextProps) {
				var _this4 = this;

				if (nextProps.donorEditable && nextProps.donorEditable._id) {
					var currentEditDonorID = this.props.donorEditable && this.props.donorEditable._id ? this.props.donorEditable._id : "";
					var deleteDonorDetails = {
						title: "Delete",
						id: "deleteDonor",
						className: ""
					};
					var editDonorDetails = {
						title: "Edit",
						id: "editDonor",
						className: ""
					};

					// show the donor details if user is trying to edit
					if (nextProps.donorEditable.latitude && nextProps.donorEditable.longitude) {
						if (currentEditDonorID != nextProps.donorEditable._id) {
							var donorLocation = new _Point2.default({
								longitude: nextProps.donorEditable.longitude,
								latitude: nextProps.donorEditable.latitude
							});
							this.state.view.goTo(donorLocation, appConstants.DEFAULT_ZOOM_LEVEL);
							this.state.view.popup.dockEnabled = true;
							this.state.view.popup.actions = [];
							this.state.view.popup.actions.push(deleteDonorDetails);
							this.state.view.popup.actions.push(editDonorDetails);
							this.state.view.popup.open({
								location: this.state.view.center,
								title: 'Edit Donor Details',
								content: (0, _MapUtilities.getPopupTemplateForAddDonor)(nextProps.donorEditable)
							});
							document.formDonor.bloodGroup.value = nextProps.donorEditable.bloodGroup;
							this.state.view.popup.on('trigger-action', function (evt) {
								if (evt.action.id === "editDonor") {
									(0, _MapUtilities.editDonorAction)(nextProps.donorEditable, _this4.state.view);
								} else if (evt.action.id === "deleteDonor") {
									(0, _MapUtilities.deleteDonorAction)(nextProps.donorEditable._id, _this4.state.view);
								}
							});
						}
					}
				}
			}
		}, {
			key: 'render',
			value: function render() {
				var mapStyle = {
					width: '100%',
					height: '100%'
				};
				return _react2.default.createElement(
					'div',
					{ style: mapStyle, ref: 'mapView' },
					_react2.default.createElement(_infoContainer2.default, null)
				);
			}
		}]);

		return MapUI;
	}(_react.Component);

	exports.default = (0, _reactRedux.connect)(mapStateToProps, mapDispatchToProps)(MapUI);
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNvbnRhaW5lcnNcXG1hcENvbnRhaW5lci5qc3giXSwibmFtZXMiOlsiYXBwQ29uc3RhbnRzIiwic29ja2V0IiwiY29ubmVjdCIsIm1hcFN0YXRlVG9Qcm9wcyIsInN0YXRlIiwiZG9ub3JzIiwiZG9ub3JzUmVkdWNlciIsImZpbHRlcnMiLCJkb25vckVkaXRhYmxlIiwibWFwRGlzcGF0Y2hUb1Byb3BzIiwiZGlzcGF0Y2giLCJhZGREb25vclRvTGlzdCIsImRvbm9yIiwidXBkYXRlRG9ub3JJbkxpc3QiLCJkZWxldGVEb25vckZyb21MaXN0IiwiZG9ub3JJZCIsIk1hcFVJIiwicHJvcHMiLCJncmFwaGljc0xheWVyIiwidmlldyIsInBhdGhOYW1lIiwid2luZG93IiwibG9jYXRpb24iLCJwYXRobmFtZSIsInNwbGl0IiwibWFwVmlld0FuZEdyYXBoaWNzTGF5ZXIiLCJyZWZzIiwibWFwVmlldyIsInNldFN0YXRlIiwib24iLCJsZW5ndGgiLCJzZWxlY3RlZEZpbHRlcnMiLCJmb3JFYWNoIiwiZmlsdGVySXRlbSIsInNlbGVjdGVkIiwicHVzaCIsImlkIiwiZ3JhcGhpY3MiLCJyZW1vdmVBbGwiLCJpbmRleE9mIiwiYmxvb2RHcm91cCIsImFkZCIsIm5leHRQcm9wcyIsIl9pZCIsImN1cnJlbnRFZGl0RG9ub3JJRCIsImRlbGV0ZURvbm9yRGV0YWlscyIsInRpdGxlIiwiY2xhc3NOYW1lIiwiZWRpdERvbm9yRGV0YWlscyIsImxhdGl0dWRlIiwibG9uZ2l0dWRlIiwiZG9ub3JMb2NhdGlvbiIsImdvVG8iLCJERUZBVUxUX1pPT01fTEVWRUwiLCJwb3B1cCIsImRvY2tFbmFibGVkIiwiYWN0aW9ucyIsIm9wZW4iLCJjZW50ZXIiLCJjb250ZW50IiwiZG9jdW1lbnQiLCJmb3JtRG9ub3IiLCJ2YWx1ZSIsImV2dCIsImFjdGlvbiIsIm1hcFN0eWxlIiwid2lkdGgiLCJoZWlnaHQiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7O0tBV1lBLFk7Ozs7Ozs7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Qyw0Q0FBZ0JNLFVBQVVsQyxhQUExQixFQUF5QyxPQUFLSixLQUFMLENBQVdlLElBQXBEO0FBQ0EsU0FGRCxNQUVPLElBQUk0QyxJQUFJQyxNQUFKLENBQVc1QixFQUFYLEtBQWtCLGFBQXRCLEVBQXFDO0FBQzNDLDhDQUFrQk0sVUFBVWxDLGFBQVYsQ0FBd0JtQyxHQUExQyxFQUErQyxPQUFLdkMsS0FBTCxDQUFXZSxJQUExRDtBQUNBO0FBQ0QsUUFORjtBQU9BO0FBQ0Y7QUFDSjtBQUVGOzs7NEJBRVE7QUFDRixRQUFNOEMsV0FBVztBQUNiQyxZQUFPLE1BRE07QUFFYkMsYUFBUTtBQUZLLEtBQWpCO0FBSUEsV0FDSTtBQUFBO0FBQUEsT0FBSyxPQUFPRixRQUFaLEVBQXNCLEtBQUksU0FBMUI7QUFDRTtBQURGLEtBREo7QUFLSDs7Ozs7O21CQUdVLHlCQUFROUQsZUFBUixFQUF5Qk0sa0JBQXpCLEVBQTZDTyxLQUE3QyxDIiwiZmlsZSI6ImNvbnRhaW5lcnNcXG1hcENvbnRhaW5lci5qc3giLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUmVhY3QsIHsgQ29tcG9uZW50IH0gZnJvbSAncmVhY3QnXHJcbmltcG9ydCBSZWFjdERPTSBmcm9tICdyZWFjdC1kb20nXHJcbmltcG9ydCB7IGNvbm5lY3QgfSBmcm9tICdyZWFjdC1yZWR1eCdcclxuaW1wb3J0IGlvIGZyb20gJ3NvY2tldC5pbydcclxuXHJcbmltcG9ydCB7IGdldERvbm9ycywgYWRkRG9ub3IsIGdldERvbm9yRGV0YWlscyB9IGZyb20gJ2FwcC9hcGkvZG9ub3JzQVBJJ1xyXG5pbXBvcnQgSW5mbyBmcm9tICdhcHAvY29udGFpbmVycy9pbmZvQ29udGFpbmVyJ1xyXG5pbXBvcnQgeyBjcmVhdGVHcmFwaGljRm9yRG9ub3IsIHNldEluaXRpYWxNYXBWaWV3LCBnZXRQb3B1cFRlbXBsYXRlRm9yQWRkRG9ub3IsIGVkaXREb25vckFjdGlvbiwgZGVsZXRlRG9ub3JBY3Rpb24gfSBmcm9tICdhcHAvdXRpbGl0aWVzL01hcFV0aWxpdGllcydcclxuaW1wb3J0IHsgYWRkRG9ub3JUb0xpc3QsIHVwZGF0ZURvbm9ySW5MaXN0LCBkZWxldGVEb25vckZyb21MaXN0IH0gZnJvbSAnYXBwL2FjdGlvbnMvZG9ub3JBY3Rpb25zJ1xyXG5cclxuaW1wb3J0IFBvaW50IGZyb20gJ2VzcmkvZ2VvbWV0cnkvUG9pbnQnO1xyXG5pbXBvcnQgKiBhcyBhcHBDb25zdGFudHMgZnJvbSAnYXBwL3V0aWxpdGllcy9jb25zdGFudHMnXHJcblxyXG5jb25zdCBzb2NrZXQgPSBpby5jb25uZWN0KCk7XHJcblxyXG5cclxuY29uc3QgbWFwU3RhdGVUb1Byb3BzID0gKHN0YXRlKSA9PiB7XHJcblx0cmV0dXJuIHtcclxuXHRcdGRvbm9ycyA6IHN0YXRlLmRvbm9yc1JlZHVjZXIuZG9ub3JzLFxyXG5cdFx0ZmlsdGVycyA6IHN0YXRlLmRvbm9yc1JlZHVjZXIuZmlsdGVycyxcclxuXHRcdGRvbm9yRWRpdGFibGUgOiBzdGF0ZS5kb25vcnNSZWR1Y2VyLmRvbm9yRWRpdGFibGVcclxuXHR9XHJcbn1cclxuXHJcbmNvbnN0IG1hcERpc3BhdGNoVG9Qcm9wcyA9IChkaXNwYXRjaCkgPT4ge1xyXG5cdHJldHVybiB7XHJcblx0XHRhZGREb25vclRvTGlzdCA6IChkb25vcikgPT4ge1xyXG5cdFx0XHRkaXNwYXRjaChhZGREb25vclRvTGlzdChkb25vcikpXHJcblx0XHR9LFxyXG5cdFx0dXBkYXRlRG9ub3JJbkxpc3QgOiAoZG9ub3IpID0+IHtcclxuXHRcdFx0ZGlzcGF0Y2godXBkYXRlRG9ub3JJbkxpc3QoZG9ub3IpKVxyXG5cdFx0fSxcclxuXHRcdGRlbGV0ZURvbm9yRnJvbUxpc3QgOiAoZG9ub3JJZCkgPT4ge1xyXG5cdFx0XHRkaXNwYXRjaChkZWxldGVEb25vckZyb21MaXN0KGRvbm9ySWQpKVxyXG5cdFx0fVxyXG5cdH1cclxufVxyXG5cclxuY2xhc3MgTWFwVUkgZXh0ZW5kcyBDb21wb25lbnQge1xyXG5cclxuXHRjb25zdHJ1Y3Rvcihwcm9wcykge1xyXG5cdFx0c3VwZXIocHJvcHMpO1xyXG5cclxuXHRcdHRoaXMuc3RhdGUgPSB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0Z3JhcGhpY3NMYXllciA6IHt9LFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdHZpZXcgOiB7fSxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRkb25vcnMgOiBbXSxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRmaWx0ZXJzIDogW10sXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0ZG9ub3JFZGl0YWJsZSA6IHt9XHJcblxyXG5cdFx0XHRcdFx0XHRcdFx0XHR9O1xyXG5cdH1cclxuXHJcblx0Y29tcG9uZW50V2lsbE1vdW50KCkge1xyXG5cclxuXHRcdC8vR0VUIFRIRSBET05PUiBERVRBSUxTXHJcblx0XHQvL0lGIFRIRSBVUkwgQ09OVEFJTlMgRE9OT1IgSURcclxuXHRcdGxldCBwYXRoTmFtZSA9IHdpbmRvdy5sb2NhdGlvbi5wYXRobmFtZTtcclxuXHRcdGxldCBkb25vcklkID0gcGF0aE5hbWUuc3BsaXQoJy8nKVsxXTtcclxuXHRcdGlmIChkb25vcklkICYmIGRvbm9ySWQgIT0gXCJcIikge1xyXG5cdFx0XHRnZXREb25vckRldGFpbHMoZG9ub3JJZCk7XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHRjb21wb25lbnREaWRNb3VudCgpIHtcclxuXHJcblx0XHRjb25zdCBtYXBWaWV3QW5kR3JhcGhpY3NMYXllciA9IHNldEluaXRpYWxNYXBWaWV3KHRoaXMucmVmcy5tYXBWaWV3LCB0aGlzLnByb3BzLmRvbm9yRWRpdGFibGUpO1xyXG5cclxuXHRcdHRoaXMuc2V0U3RhdGUoe3ZpZXcgOiBtYXBWaWV3QW5kR3JhcGhpY3NMYXllci52aWV3LCBncmFwaGljc0xheWVyOiBtYXBWaWV3QW5kR3JhcGhpY3NMYXllci5ncmFwaGljc0xheWVyIH0pO1xyXG5cclxuXHRcdC8vIFNvY2tldCBPcGVyYXRpb25zXHJcblx0XHRzb2NrZXQub24oJ0RPTk9SX0FEREVEJywgZG9ub3IgPT4gdGhpcy5wcm9wcy5hZGREb25vclRvTGlzdChkb25vcikpO1xyXG5cdFx0c29ja2V0Lm9uKCdET05PUl9VUERBVEVEJywgZG9ub3IgPT4gdGhpcy5wcm9wcy51cGRhdGVEb25vckluTGlzdChkb25vcikpO1xyXG5cdFx0c29ja2V0Lm9uKCdET05PUl9SRU1PVkVEJywgZG9ub3JJZCA9PiB0aGlzLnByb3BzLmRlbGV0ZURvbm9yRnJvbUxpc3QoZG9ub3JJZCkpO1xyXG5cclxuXHR9XHJcblxyXG5cdGNvbXBvbmVudERpZFVwZGF0ZSgpIHtcclxuICAgIC8vIFVwZGF0ZSB0aGUgZ3JhcGhpY3Mgd2hlbiB0aGVyZSBpcyBhIGRvbm9ycycgc3RhdGUgY2hhbmdlXHJcblx0XHRpZiAodGhpcy5wcm9wcy5kb25vcnMubGVuZ3RoID4gMCkge1xyXG5cdFx0XHRsZXQgc2VsZWN0ZWRGaWx0ZXJzID0gW107XHJcblx0XHRcdHRoaXMucHJvcHMuZmlsdGVycy5mb3JFYWNoKGZpbHRlckl0ZW0gPT4ge2lmKGZpbHRlckl0ZW0uc2VsZWN0ZWQpe3NlbGVjdGVkRmlsdGVycy5wdXNoKGZpbHRlckl0ZW0uaWQpfX0pO1xyXG5cdFx0XHR0aGlzLnN0YXRlLmdyYXBoaWNzTGF5ZXIgJiYgdGhpcy5zdGF0ZS5ncmFwaGljc0xheWVyLmdyYXBoaWNzICYmIHRoaXMuc3RhdGUuZ3JhcGhpY3NMYXllci5ncmFwaGljcy5yZW1vdmVBbGwoKTtcclxuXHRcdFx0dGhpcy5wcm9wcy5kb25vcnMuZm9yRWFjaChkb25vciA9PiB7XHJcblx0XHRcdFx0ICAvLyBGaWx0ZXIgZG9ub3JzXHJcblx0XHRcdFx0XHRpZihzZWxlY3RlZEZpbHRlcnMuaW5kZXhPZihkb25vci5ibG9vZEdyb3VwKSA+IC0xKXtcclxuXHRcdFx0XHRcdFx0dGhpcy5zdGF0ZS5ncmFwaGljc0xheWVyLmdyYXBoaWNzLmFkZChjcmVhdGVHcmFwaGljRm9yRG9ub3IoZG9ub3IpKTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9KTtcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdHRoaXMuc3RhdGUuZ3JhcGhpY3NMYXllciAmJiB0aGlzLnN0YXRlLmdyYXBoaWNzTGF5ZXIuZ3JhcGhpY3MgJiYgdGhpcy5zdGF0ZS5ncmFwaGljc0xheWVyLmdyYXBoaWNzLnJlbW92ZUFsbCgpO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0Y29tcG9uZW50V2lsbFJlY2VpdmVQcm9wcyhuZXh0UHJvcHMpe1xyXG5cdFx0IGlmKG5leHRQcm9wcy5kb25vckVkaXRhYmxlICYmIG5leHRQcm9wcy5kb25vckVkaXRhYmxlLl9pZCl7XHJcblx0XHRcdCBcdFx0IGNvbnN0IGN1cnJlbnRFZGl0RG9ub3JJRCA9IHRoaXMucHJvcHMuZG9ub3JFZGl0YWJsZSAmJiB0aGlzLnByb3BzLmRvbm9yRWRpdGFibGUuX2lkID8gdGhpcy5wcm9wcy5kb25vckVkaXRhYmxlLl9pZCA6IFwiXCI7XHJcblx0XHRcdFx0XHQgY29uc3QgZGVsZXRlRG9ub3JEZXRhaWxzID0ge1xyXG5cdFx0XHRcdFx0XHQgdGl0bGUgOiBcIkRlbGV0ZVwiLFxyXG5cdFx0XHRcdFx0XHQgaWQgOiBcImRlbGV0ZURvbm9yXCIsXHJcblx0XHRcdFx0XHRcdCBjbGFzc05hbWUgOiBcIlwiXHJcblx0XHRcdFx0XHQgfTtcclxuXHRcdFx0XHRcdCBjb25zdCBlZGl0RG9ub3JEZXRhaWxzID0ge1xyXG5cdFx0XHRcdFx0XHQgdGl0bGUgOiBcIkVkaXRcIixcclxuXHRcdFx0XHRcdFx0IGlkIDogXCJlZGl0RG9ub3JcIixcclxuXHRcdFx0XHRcdFx0IGNsYXNzTmFtZSA6IFwiXCJcclxuXHRcdFx0XHRcdCB9O1xyXG5cclxuXHRcdFx0XHRcdCAvLyBzaG93IHRoZSBkb25vciBkZXRhaWxzIGlmIHVzZXIgaXMgdHJ5aW5nIHRvIGVkaXRcclxuXHRcdFx0XHRcdCBpZiAobmV4dFByb3BzLmRvbm9yRWRpdGFibGUubGF0aXR1ZGUgJiYgbmV4dFByb3BzLmRvbm9yRWRpdGFibGUubG9uZ2l0dWRlKSB7XHJcblx0XHRcdFx0XHRcdFx0XHQgaWYoY3VycmVudEVkaXREb25vcklEICE9IG5leHRQcm9wcy5kb25vckVkaXRhYmxlLl9pZCl7XHJcblx0XHRcdFx0XHRcdFx0XHRcdCBsZXQgZG9ub3JMb2NhdGlvbiA9IG5ldyBQb2ludCh7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHQgbG9uZ2l0dWRlIDogbmV4dFByb3BzLmRvbm9yRWRpdGFibGUubG9uZ2l0dWRlLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0IGxhdGl0dWRlIDogbmV4dFByb3BzLmRvbm9yRWRpdGFibGUubGF0aXR1ZGVcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHQgfSk7XHJcblx0XHRcdFx0XHRcdFx0XHRcdCB0aGlzLnN0YXRlLnZpZXcuZ29Ubyhkb25vckxvY2F0aW9uLCBhcHBDb25zdGFudHMuREVGQVVMVF9aT09NX0xFVkVMKTtcclxuXHRcdFx0XHRcdFx0XHRcdFx0IHRoaXMuc3RhdGUudmlldy5wb3B1cC5kb2NrRW5hYmxlZCA9IHRydWU7XHJcblx0XHRcdFx0XHRcdFx0XHRcdCB0aGlzLnN0YXRlLnZpZXcucG9wdXAuYWN0aW9ucyA9IFtdO1xyXG5cdFx0XHRcdFx0XHRcdFx0XHQgdGhpcy5zdGF0ZS52aWV3LnBvcHVwLmFjdGlvbnMucHVzaChkZWxldGVEb25vckRldGFpbHMpO1xyXG5cdFx0XHRcdFx0XHRcdFx0XHQgdGhpcy5zdGF0ZS52aWV3LnBvcHVwLmFjdGlvbnMucHVzaChlZGl0RG9ub3JEZXRhaWxzKTtcclxuXHRcdFx0XHRcdFx0XHRcdFx0IHRoaXMuc3RhdGUudmlldy5wb3B1cC5vcGVuKHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHQgbG9jYXRpb24gOiB0aGlzLnN0YXRlLnZpZXcuY2VudGVyLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdCB0aXRsZSA6ICdFZGl0IERvbm9yIERldGFpbHMnLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdCBjb250ZW50IDogZ2V0UG9wdXBUZW1wbGF0ZUZvckFkZERvbm9yKG5leHRQcm9wcy5kb25vckVkaXRhYmxlKVxyXG5cdFx0XHRcdFx0XHRcdFx0XHQgfSk7XHJcblx0XHRcdFx0XHRcdFx0XHRcdCBkb2N1bWVudC5mb3JtRG9ub3IuYmxvb2RHcm91cC52YWx1ZT0gbmV4dFByb3BzLmRvbm9yRWRpdGFibGUuYmxvb2RHcm91cDtcclxuXHRcdFx0XHRcdFx0XHRcdFx0IHRoaXMuc3RhdGUudmlldy5wb3B1cC5vbigndHJpZ2dlci1hY3Rpb24nLCAoZXZ0KSA9PiB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHQgaWYgKGV2dC5hY3Rpb24uaWQgPT09IFwiZWRpdERvbm9yXCIpIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0IGVkaXREb25vckFjdGlvbihuZXh0UHJvcHMuZG9ub3JFZGl0YWJsZSwgdGhpcy5zdGF0ZS52aWV3KTtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdCB9IGVsc2UgaWYgKGV2dC5hY3Rpb24uaWQgPT09IFwiZGVsZXRlRG9ub3JcIikge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHQgZGVsZXRlRG9ub3JBY3Rpb24obmV4dFByb3BzLmRvbm9yRWRpdGFibGUuX2lkLCB0aGlzLnN0YXRlLnZpZXcpO1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0IH1cclxuXHRcdFx0XHRcdFx0XHRcdFx0XHQgfSk7XHJcblx0XHRcdFx0XHRcdFx0XHQgfVxyXG5cdFx0XHRcdFx0XHQgfVxyXG5cdFx0IH1cclxuXHJcblx0fVxyXG5cclxuXHRyZW5kZXIoKSB7XHJcbiAgICAgICAgY29uc3QgbWFwU3R5bGUgPSB7XHJcbiAgICAgICAgICAgIHdpZHRoOiAnMTAwJScsXHJcbiAgICAgICAgICAgIGhlaWdodDogJzEwMCUnXHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiAoXHJcbiAgICAgICAgICAgIDxkaXYgc3R5bGU9e21hcFN0eWxlfSByZWY9J21hcFZpZXcnPlxyXG4gICAgICAgICAgICAgIDxJbmZvIC8+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgIClcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgY29ubmVjdChtYXBTdGF0ZVRvUHJvcHMsIG1hcERpc3BhdGNoVG9Qcm9wcykoTWFwVUkpXHJcbiJdfQ==