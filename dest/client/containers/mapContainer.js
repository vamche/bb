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

				if (this.props.donorEditable && this.props.donorEditable._id) {
					document.formDonor.bloodGroup.value = this.props.donorEditable.bloodGroup;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNvbnRhaW5lcnNcXG1hcENvbnRhaW5lci5qc3giXSwibmFtZXMiOlsiYXBwQ29uc3RhbnRzIiwic29ja2V0IiwiY29ubmVjdCIsIm1hcFN0YXRlVG9Qcm9wcyIsInN0YXRlIiwiZG9ub3JzIiwiZG9ub3JzUmVkdWNlciIsImZpbHRlcnMiLCJkb25vckVkaXRhYmxlIiwibWFwRGlzcGF0Y2hUb1Byb3BzIiwiZGlzcGF0Y2giLCJhZGREb25vclRvTGlzdCIsImRvbm9yIiwidXBkYXRlRG9ub3JJbkxpc3QiLCJkZWxldGVEb25vckZyb21MaXN0IiwiZG9ub3JJZCIsIk1hcFVJIiwicHJvcHMiLCJncmFwaGljc0xheWVyIiwidmlldyIsInBhdGhOYW1lIiwid2luZG93IiwibG9jYXRpb24iLCJwYXRobmFtZSIsInNwbGl0IiwibWFwVmlld0FuZEdyYXBoaWNzTGF5ZXIiLCJyZWZzIiwibWFwVmlldyIsInNldFN0YXRlIiwib24iLCJsZW5ndGgiLCJzZWxlY3RlZEZpbHRlcnMiLCJmb3JFYWNoIiwiZmlsdGVySXRlbSIsInNlbGVjdGVkIiwicHVzaCIsImlkIiwiZ3JhcGhpY3MiLCJyZW1vdmVBbGwiLCJpbmRleE9mIiwiYmxvb2RHcm91cCIsImFkZCIsIl9pZCIsImRvY3VtZW50IiwiZm9ybURvbm9yIiwidmFsdWUiLCJuZXh0UHJvcHMiLCJjdXJyZW50RWRpdERvbm9ySUQiLCJkZWxldGVEb25vckRldGFpbHMiLCJ0aXRsZSIsImNsYXNzTmFtZSIsImVkaXREb25vckRldGFpbHMiLCJsYXRpdHVkZSIsImxvbmdpdHVkZSIsImRvbm9yTG9jYXRpb24iLCJnb1RvIiwiREVGQVVMVF9aT09NX0xFVkVMIiwicG9wdXAiLCJkb2NrRW5hYmxlZCIsImFjdGlvbnMiLCJvcGVuIiwiY2VudGVyIiwiY29udGVudCIsImV2dCIsImFjdGlvbiIsIm1hcFN0eWxlIiwid2lkdGgiLCJoZWlnaHQiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7O0tBV1lBLFk7Ozs7Ozs7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VXRDLGFBQVYsQ0FBd0JnQyxVQUE3RDtBQUNBLFlBQUtwQyxLQUFMLENBQVdlLElBQVgsQ0FBZ0JzQyxLQUFoQixDQUFzQjVCLEVBQXRCLENBQXlCLGdCQUF6QixFQUEyQyxVQUFDa0MsR0FBRCxFQUFTO0FBQ2xELFlBQUlBLElBQUlDLE1BQUosQ0FBVzVCLEVBQVgsS0FBa0IsV0FBdEIsRUFBbUM7QUFDbEMsNENBQWdCVSxVQUFVdEMsYUFBMUIsRUFBeUMsT0FBS0osS0FBTCxDQUFXZSxJQUFwRDtBQUNBLFNBRkQsTUFFTyxJQUFJNEMsSUFBSUMsTUFBSixDQUFXNUIsRUFBWCxLQUFrQixhQUF0QixFQUFxQztBQUMzQyw4Q0FBa0JVLFVBQVV0QyxhQUFWLENBQXdCa0MsR0FBMUMsRUFBK0MsT0FBS3RDLEtBQUwsQ0FBV2UsSUFBMUQ7QUFDQTtBQUNELFFBTkY7QUFPQTtBQUNGO0FBQ0o7QUFFRjs7OzRCQUVRO0FBQ0YsUUFBTThDLFdBQVc7QUFDYkMsWUFBTyxNQURNO0FBRWJDLGFBQVE7QUFGSyxLQUFqQjtBQUlBLFdBQ0k7QUFBQTtBQUFBLE9BQUssT0FBT0YsUUFBWixFQUFzQixLQUFJLFNBQTFCO0FBQ0U7QUFERixLQURKO0FBS0g7Ozs7OzttQkFHVSx5QkFBUTlELGVBQVIsRUFBeUJNLGtCQUF6QixFQUE2Q08sS0FBN0MsQyIsImZpbGUiOiJjb250YWluZXJzXFxtYXBDb250YWluZXIuanN4Iiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFJlYWN0LCB7IENvbXBvbmVudCB9IGZyb20gJ3JlYWN0J1xyXG5pbXBvcnQgUmVhY3RET00gZnJvbSAncmVhY3QtZG9tJ1xyXG5pbXBvcnQgeyBjb25uZWN0IH0gZnJvbSAncmVhY3QtcmVkdXgnXHJcbmltcG9ydCBpbyBmcm9tICdzb2NrZXQuaW8nXHJcblxyXG5pbXBvcnQgeyBnZXREb25vcnMsIGFkZERvbm9yLCBnZXREb25vckRldGFpbHMgfSBmcm9tICdhcHAvYXBpL2Rvbm9yc0FQSSdcclxuaW1wb3J0IEluZm8gZnJvbSAnYXBwL2NvbnRhaW5lcnMvaW5mb0NvbnRhaW5lcidcclxuaW1wb3J0IHsgY3JlYXRlR3JhcGhpY0ZvckRvbm9yLCBzZXRJbml0aWFsTWFwVmlldywgZ2V0UG9wdXBUZW1wbGF0ZUZvckFkZERvbm9yLCBlZGl0RG9ub3JBY3Rpb24sIGRlbGV0ZURvbm9yQWN0aW9uIH0gZnJvbSAnYXBwL3V0aWxpdGllcy9NYXBVdGlsaXRpZXMnXHJcbmltcG9ydCB7IGFkZERvbm9yVG9MaXN0LCB1cGRhdGVEb25vckluTGlzdCwgZGVsZXRlRG9ub3JGcm9tTGlzdCB9IGZyb20gJ2FwcC9hY3Rpb25zL2Rvbm9yQWN0aW9ucydcclxuXHJcbmltcG9ydCBQb2ludCBmcm9tICdlc3JpL2dlb21ldHJ5L1BvaW50JztcclxuaW1wb3J0ICogYXMgYXBwQ29uc3RhbnRzIGZyb20gJ2FwcC91dGlsaXRpZXMvY29uc3RhbnRzJ1xyXG5cclxuY29uc3Qgc29ja2V0ID0gaW8uY29ubmVjdCgpO1xyXG5cclxuXHJcbmNvbnN0IG1hcFN0YXRlVG9Qcm9wcyA9IChzdGF0ZSkgPT4ge1xyXG5cdHJldHVybiB7XHJcblx0XHRkb25vcnMgOiBzdGF0ZS5kb25vcnNSZWR1Y2VyLmRvbm9ycyxcclxuXHRcdGZpbHRlcnMgOiBzdGF0ZS5kb25vcnNSZWR1Y2VyLmZpbHRlcnMsXHJcblx0XHRkb25vckVkaXRhYmxlIDogc3RhdGUuZG9ub3JzUmVkdWNlci5kb25vckVkaXRhYmxlXHJcblx0fVxyXG59XHJcblxyXG5jb25zdCBtYXBEaXNwYXRjaFRvUHJvcHMgPSAoZGlzcGF0Y2gpID0+IHtcclxuXHRyZXR1cm4ge1xyXG5cdFx0YWRkRG9ub3JUb0xpc3QgOiAoZG9ub3IpID0+IHtcclxuXHRcdFx0ZGlzcGF0Y2goYWRkRG9ub3JUb0xpc3QoZG9ub3IpKVxyXG5cdFx0fSxcclxuXHRcdHVwZGF0ZURvbm9ySW5MaXN0IDogKGRvbm9yKSA9PiB7XHJcblx0XHRcdGRpc3BhdGNoKHVwZGF0ZURvbm9ySW5MaXN0KGRvbm9yKSlcclxuXHRcdH0sXHJcblx0XHRkZWxldGVEb25vckZyb21MaXN0IDogKGRvbm9ySWQpID0+IHtcclxuXHRcdFx0ZGlzcGF0Y2goZGVsZXRlRG9ub3JGcm9tTGlzdChkb25vcklkKSlcclxuXHRcdH1cclxuXHR9XHJcbn1cclxuXHJcbmNsYXNzIE1hcFVJIGV4dGVuZHMgQ29tcG9uZW50IHtcclxuXHJcblx0Y29uc3RydWN0b3IocHJvcHMpIHtcclxuXHRcdHN1cGVyKHByb3BzKTtcclxuXHJcblx0XHR0aGlzLnN0YXRlID0ge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGdyYXBoaWNzTGF5ZXIgOiB7fSxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHR2aWV3IDoge30sXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0ZG9ub3JzIDogW10sXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0ZmlsdGVycyA6IFtdLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGRvbm9yRWRpdGFibGUgOiB7fVxyXG5cclxuXHRcdFx0XHRcdFx0XHRcdFx0fTtcclxuXHR9XHJcblxyXG5cdGNvbXBvbmVudFdpbGxNb3VudCgpIHtcclxuXHJcblx0XHQvL0dFVCBUSEUgRE9OT1IgREVUQUlMU1xyXG5cdFx0Ly9JRiBUSEUgVVJMIENPTlRBSU5TIERPTk9SIElEXHJcblx0XHRsZXQgcGF0aE5hbWUgPSB3aW5kb3cubG9jYXRpb24ucGF0aG5hbWU7XHJcblx0XHRsZXQgZG9ub3JJZCA9IHBhdGhOYW1lLnNwbGl0KCcvJylbMV07XHJcblx0XHRpZiAoZG9ub3JJZCAmJiBkb25vcklkICE9IFwiXCIpIHtcclxuXHRcdFx0Z2V0RG9ub3JEZXRhaWxzKGRvbm9ySWQpO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0Y29tcG9uZW50RGlkTW91bnQoKSB7XHJcblxyXG5cdFx0Y29uc3QgbWFwVmlld0FuZEdyYXBoaWNzTGF5ZXIgPSBzZXRJbml0aWFsTWFwVmlldyh0aGlzLnJlZnMubWFwVmlldywgdGhpcy5wcm9wcy5kb25vckVkaXRhYmxlKTtcclxuXHJcblx0XHR0aGlzLnNldFN0YXRlKHt2aWV3IDogbWFwVmlld0FuZEdyYXBoaWNzTGF5ZXIudmlldywgZ3JhcGhpY3NMYXllcjogbWFwVmlld0FuZEdyYXBoaWNzTGF5ZXIuZ3JhcGhpY3NMYXllciB9KTtcclxuXHJcblx0XHQvLyBTb2NrZXQgT3BlcmF0aW9uc1xyXG5cdFx0c29ja2V0Lm9uKCdET05PUl9BRERFRCcsIGRvbm9yID0+IHRoaXMucHJvcHMuYWRkRG9ub3JUb0xpc3QoZG9ub3IpKTtcclxuXHRcdHNvY2tldC5vbignRE9OT1JfVVBEQVRFRCcsIGRvbm9yID0+IHRoaXMucHJvcHMudXBkYXRlRG9ub3JJbkxpc3QoZG9ub3IpKTtcclxuXHRcdHNvY2tldC5vbignRE9OT1JfUkVNT1ZFRCcsIGRvbm9ySWQgPT4gdGhpcy5wcm9wcy5kZWxldGVEb25vckZyb21MaXN0KGRvbm9ySWQpKTtcclxuXHJcblx0fVxyXG5cclxuXHRjb21wb25lbnREaWRVcGRhdGUoKSB7XHJcbiAgICAvLyBVcGRhdGUgdGhlIGdyYXBoaWNzIHdoZW4gdGhlcmUgaXMgYSBkb25vcnMnIHN0YXRlIGNoYW5nZVxyXG5cdFx0aWYgKHRoaXMucHJvcHMuZG9ub3JzLmxlbmd0aCA+IDApIHtcclxuXHRcdFx0bGV0IHNlbGVjdGVkRmlsdGVycyA9IFtdO1xyXG5cdFx0XHR0aGlzLnByb3BzLmZpbHRlcnMuZm9yRWFjaChmaWx0ZXJJdGVtID0+IHtpZihmaWx0ZXJJdGVtLnNlbGVjdGVkKXtzZWxlY3RlZEZpbHRlcnMucHVzaChmaWx0ZXJJdGVtLmlkKX19KTtcclxuXHRcdFx0dGhpcy5zdGF0ZS5ncmFwaGljc0xheWVyICYmIHRoaXMuc3RhdGUuZ3JhcGhpY3NMYXllci5ncmFwaGljcyAmJiB0aGlzLnN0YXRlLmdyYXBoaWNzTGF5ZXIuZ3JhcGhpY3MucmVtb3ZlQWxsKCk7XHJcblx0XHRcdHRoaXMucHJvcHMuZG9ub3JzLmZvckVhY2goZG9ub3IgPT4ge1xyXG5cdFx0XHRcdCAgLy8gRmlsdGVyIGRvbm9yc1xyXG5cdFx0XHRcdFx0aWYoc2VsZWN0ZWRGaWx0ZXJzLmluZGV4T2YoZG9ub3IuYmxvb2RHcm91cCkgPiAtMSl7XHJcblx0XHRcdFx0XHRcdHRoaXMuc3RhdGUuZ3JhcGhpY3NMYXllci5ncmFwaGljcy5hZGQoY3JlYXRlR3JhcGhpY0ZvckRvbm9yKGRvbm9yKSk7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fSk7XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHR0aGlzLnN0YXRlLmdyYXBoaWNzTGF5ZXIgJiYgdGhpcy5zdGF0ZS5ncmFwaGljc0xheWVyLmdyYXBoaWNzICYmIHRoaXMuc3RhdGUuZ3JhcGhpY3NMYXllci5ncmFwaGljcy5yZW1vdmVBbGwoKTtcclxuXHRcdH1cclxuXHJcblx0XHRpZih0aGlzLnByb3BzLmRvbm9yRWRpdGFibGUgJiYgdGhpcy5wcm9wcy5kb25vckVkaXRhYmxlLl9pZCl7XHJcblx0XHRcdGRvY3VtZW50LmZvcm1Eb25vci5ibG9vZEdyb3VwLnZhbHVlPSB0aGlzLnByb3BzLmRvbm9yRWRpdGFibGUuYmxvb2RHcm91cCA7XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHRjb21wb25lbnRXaWxsUmVjZWl2ZVByb3BzKG5leHRQcm9wcyl7XHJcblx0XHQgaWYobmV4dFByb3BzLmRvbm9yRWRpdGFibGUgJiYgbmV4dFByb3BzLmRvbm9yRWRpdGFibGUuX2lkKXtcclxuXHRcdFx0IFx0XHQgY29uc3QgY3VycmVudEVkaXREb25vcklEID0gdGhpcy5wcm9wcy5kb25vckVkaXRhYmxlICYmIHRoaXMucHJvcHMuZG9ub3JFZGl0YWJsZS5faWQgPyB0aGlzLnByb3BzLmRvbm9yRWRpdGFibGUuX2lkIDogXCJcIjtcclxuXHRcdFx0XHRcdCBjb25zdCBkZWxldGVEb25vckRldGFpbHMgPSB7XHJcblx0XHRcdFx0XHRcdCB0aXRsZSA6IFwiRGVsZXRlXCIsXHJcblx0XHRcdFx0XHRcdCBpZCA6IFwiZGVsZXRlRG9ub3JcIixcclxuXHRcdFx0XHRcdFx0IGNsYXNzTmFtZSA6IFwiXCJcclxuXHRcdFx0XHRcdCB9O1xyXG5cdFx0XHRcdFx0IGNvbnN0IGVkaXREb25vckRldGFpbHMgPSB7XHJcblx0XHRcdFx0XHRcdCB0aXRsZSA6IFwiRWRpdFwiLFxyXG5cdFx0XHRcdFx0XHQgaWQgOiBcImVkaXREb25vclwiLFxyXG5cdFx0XHRcdFx0XHQgY2xhc3NOYW1lIDogXCJcIlxyXG5cdFx0XHRcdFx0IH07XHJcblxyXG5cdFx0XHRcdFx0IC8vIHNob3cgdGhlIGRvbm9yIGRldGFpbHMgaWYgdXNlciBpcyB0cnlpbmcgdG8gZWRpdFxyXG5cdFx0XHRcdFx0IGlmIChuZXh0UHJvcHMuZG9ub3JFZGl0YWJsZS5sYXRpdHVkZSAmJiBuZXh0UHJvcHMuZG9ub3JFZGl0YWJsZS5sb25naXR1ZGUpIHtcclxuXHRcdFx0XHRcdFx0XHRcdCBpZihjdXJyZW50RWRpdERvbm9ySUQgIT0gbmV4dFByb3BzLmRvbm9yRWRpdGFibGUuX2lkKXtcclxuXHRcdFx0XHRcdFx0XHRcdFx0IGxldCBkb25vckxvY2F0aW9uID0gbmV3IFBvaW50KHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdCBsb25naXR1ZGUgOiBuZXh0UHJvcHMuZG9ub3JFZGl0YWJsZS5sb25naXR1ZGUsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHQgbGF0aXR1ZGUgOiBuZXh0UHJvcHMuZG9ub3JFZGl0YWJsZS5sYXRpdHVkZVxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdCB9KTtcclxuXHRcdFx0XHRcdFx0XHRcdFx0IHRoaXMuc3RhdGUudmlldy5nb1RvKGRvbm9yTG9jYXRpb24sIGFwcENvbnN0YW50cy5ERUZBVUxUX1pPT01fTEVWRUwpO1xyXG5cdFx0XHRcdFx0XHRcdFx0XHQgdGhpcy5zdGF0ZS52aWV3LnBvcHVwLmRvY2tFbmFibGVkID0gdHJ1ZTtcclxuXHRcdFx0XHRcdFx0XHRcdFx0IHRoaXMuc3RhdGUudmlldy5wb3B1cC5hY3Rpb25zID0gW107XHJcblx0XHRcdFx0XHRcdFx0XHRcdCB0aGlzLnN0YXRlLnZpZXcucG9wdXAuYWN0aW9ucy5wdXNoKGRlbGV0ZURvbm9yRGV0YWlscyk7XHJcblx0XHRcdFx0XHRcdFx0XHRcdCB0aGlzLnN0YXRlLnZpZXcucG9wdXAuYWN0aW9ucy5wdXNoKGVkaXREb25vckRldGFpbHMpO1xyXG5cdFx0XHRcdFx0XHRcdFx0XHQgdGhpcy5zdGF0ZS52aWV3LnBvcHVwLm9wZW4oe1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdCBsb2NhdGlvbiA6IHRoaXMuc3RhdGUudmlldy5jZW50ZXIsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0IHRpdGxlIDogJ0VkaXQgRG9ub3IgRGV0YWlscycsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0IGNvbnRlbnQgOiBnZXRQb3B1cFRlbXBsYXRlRm9yQWRkRG9ub3IobmV4dFByb3BzLmRvbm9yRWRpdGFibGUpXHJcblx0XHRcdFx0XHRcdFx0XHRcdCB9KTtcclxuXHRcdFx0XHRcdFx0XHRcdFx0IGRvY3VtZW50LmZvcm1Eb25vci5ibG9vZEdyb3VwLnZhbHVlPSBuZXh0UHJvcHMuZG9ub3JFZGl0YWJsZS5ibG9vZEdyb3VwO1xyXG5cdFx0XHRcdFx0XHRcdFx0XHQgdGhpcy5zdGF0ZS52aWV3LnBvcHVwLm9uKCd0cmlnZ2VyLWFjdGlvbicsIChldnQpID0+IHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdCBpZiAoZXZ0LmFjdGlvbi5pZCA9PT0gXCJlZGl0RG9ub3JcIikge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHQgZWRpdERvbm9yQWN0aW9uKG5leHRQcm9wcy5kb25vckVkaXRhYmxlLCB0aGlzLnN0YXRlLnZpZXcpO1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0IH0gZWxzZSBpZiAoZXZ0LmFjdGlvbi5pZCA9PT0gXCJkZWxldGVEb25vclwiKSB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdCBkZWxldGVEb25vckFjdGlvbihuZXh0UHJvcHMuZG9ub3JFZGl0YWJsZS5faWQsIHRoaXMuc3RhdGUudmlldyk7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHQgfVxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdCB9KTtcclxuXHRcdFx0XHRcdFx0XHRcdCB9XHJcblx0XHRcdFx0XHRcdCB9XHJcblx0XHQgfVxyXG5cclxuXHR9XHJcblxyXG5cdHJlbmRlcigpIHtcclxuICAgICAgICBjb25zdCBtYXBTdHlsZSA9IHtcclxuICAgICAgICAgICAgd2lkdGg6ICcxMDAlJyxcclxuICAgICAgICAgICAgaGVpZ2h0OiAnMTAwJSdcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIChcclxuICAgICAgICAgICAgPGRpdiBzdHlsZT17bWFwU3R5bGV9IHJlZj0nbWFwVmlldyc+XHJcbiAgICAgICAgICAgICAgPEluZm8gLz5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgKVxyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBjb25uZWN0KG1hcFN0YXRlVG9Qcm9wcywgbWFwRGlzcGF0Y2hUb1Byb3BzKShNYXBVSSlcclxuIl19