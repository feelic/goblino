/******/ (function(modules) { // webpackBootstrap
/******/ 	function hotDisposeChunk(chunkId) {
/******/ 		delete installedChunks[chunkId];
/******/ 	}
/******/ 	var parentHotUpdateCallback = window["webpackHotUpdate"];
/******/ 	window["webpackHotUpdate"] = // eslint-disable-next-line no-unused-vars
/******/ 	function webpackHotUpdateCallback(chunkId, moreModules) {
/******/ 		hotAddUpdateChunk(chunkId, moreModules);
/******/ 		if (parentHotUpdateCallback) parentHotUpdateCallback(chunkId, moreModules);
/******/ 	} ;
/******/
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	function hotDownloadUpdateChunk(chunkId) {
/******/ 		var head = document.getElementsByTagName("head")[0];
/******/ 		var script = document.createElement("script");
/******/ 		script.charset = "utf-8";
/******/ 		script.src = __webpack_require__.p + "" + chunkId + "." + hotCurrentHash + ".hot-update.js";
/******/ 		;
/******/ 		head.appendChild(script);
/******/ 	}
/******/
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	function hotDownloadManifest(requestTimeout) {
/******/ 		requestTimeout = requestTimeout || 10000;
/******/ 		return new Promise(function(resolve, reject) {
/******/ 			if (typeof XMLHttpRequest === "undefined")
/******/ 				return reject(new Error("No browser support"));
/******/ 			try {
/******/ 				var request = new XMLHttpRequest();
/******/ 				var requestPath = __webpack_require__.p + "" + hotCurrentHash + ".hot-update.json";
/******/ 				request.open("GET", requestPath, true);
/******/ 				request.timeout = requestTimeout;
/******/ 				request.send(null);
/******/ 			} catch (err) {
/******/ 				return reject(err);
/******/ 			}
/******/ 			request.onreadystatechange = function() {
/******/ 				if (request.readyState !== 4) return;
/******/ 				if (request.status === 0) {
/******/ 					// timeout
/******/ 					reject(
/******/ 						new Error("Manifest request to " + requestPath + " timed out.")
/******/ 					);
/******/ 				} else if (request.status === 404) {
/******/ 					// no update available
/******/ 					resolve();
/******/ 				} else if (request.status !== 200 && request.status !== 304) {
/******/ 					// other failure
/******/ 					reject(new Error("Manifest request to " + requestPath + " failed."));
/******/ 				} else {
/******/ 					// success
/******/ 					try {
/******/ 						var update = JSON.parse(request.responseText);
/******/ 					} catch (e) {
/******/ 						reject(e);
/******/ 						return;
/******/ 					}
/******/ 					resolve(update);
/******/ 				}
/******/ 			};
/******/ 		});
/******/ 	}
/******/
/******/ 	var hotApplyOnUpdate = true;
/******/ 	var hotCurrentHash = "d4fe0f39c9018cf8c3a8"; // eslint-disable-line no-unused-vars
/******/ 	var hotRequestTimeout = 10000;
/******/ 	var hotCurrentModuleData = {};
/******/ 	var hotCurrentChildModule; // eslint-disable-line no-unused-vars
/******/ 	var hotCurrentParents = []; // eslint-disable-line no-unused-vars
/******/ 	var hotCurrentParentsTemp = []; // eslint-disable-line no-unused-vars
/******/
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	function hotCreateRequire(moduleId) {
/******/ 		var me = installedModules[moduleId];
/******/ 		if (!me) return __webpack_require__;
/******/ 		var fn = function(request) {
/******/ 			if (me.hot.active) {
/******/ 				if (installedModules[request]) {
/******/ 					if (!installedModules[request].parents.includes(moduleId))
/******/ 						installedModules[request].parents.push(moduleId);
/******/ 				} else {
/******/ 					hotCurrentParents = [moduleId];
/******/ 					hotCurrentChildModule = request;
/******/ 				}
/******/ 				if (!me.children.includes(request)) me.children.push(request);
/******/ 			} else {
/******/ 				console.warn(
/******/ 					"[HMR] unexpected require(" +
/******/ 						request +
/******/ 						") from disposed module " +
/******/ 						moduleId
/******/ 				);
/******/ 				hotCurrentParents = [];
/******/ 			}
/******/ 			return __webpack_require__(request);
/******/ 		};
/******/ 		var ObjectFactory = function ObjectFactory(name) {
/******/ 			return {
/******/ 				configurable: true,
/******/ 				enumerable: true,
/******/ 				get: function() {
/******/ 					return __webpack_require__[name];
/******/ 				},
/******/ 				set: function(value) {
/******/ 					__webpack_require__[name] = value;
/******/ 				}
/******/ 			};
/******/ 		};
/******/ 		for (var name in __webpack_require__) {
/******/ 			if (
/******/ 				Object.prototype.hasOwnProperty.call(__webpack_require__, name) &&
/******/ 				name !== "e"
/******/ 			) {
/******/ 				Object.defineProperty(fn, name, ObjectFactory(name));
/******/ 			}
/******/ 		}
/******/ 		fn.e = function(chunkId) {
/******/ 			if (hotStatus === "ready") hotSetStatus("prepare");
/******/ 			hotChunksLoading++;
/******/ 			return __webpack_require__.e(chunkId).then(finishChunkLoading, function(err) {
/******/ 				finishChunkLoading();
/******/ 				throw err;
/******/ 			});
/******/
/******/ 			function finishChunkLoading() {
/******/ 				hotChunksLoading--;
/******/ 				if (hotStatus === "prepare") {
/******/ 					if (!hotWaitingFilesMap[chunkId]) {
/******/ 						hotEnsureUpdateChunk(chunkId);
/******/ 					}
/******/ 					if (hotChunksLoading === 0 && hotWaitingFiles === 0) {
/******/ 						hotUpdateDownloaded();
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 		return fn;
/******/ 	}
/******/
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	function hotCreateModule(moduleId) {
/******/ 		var hot = {
/******/ 			// private stuff
/******/ 			_acceptedDependencies: {},
/******/ 			_declinedDependencies: {},
/******/ 			_selfAccepted: false,
/******/ 			_selfDeclined: false,
/******/ 			_disposeHandlers: [],
/******/ 			_main: hotCurrentChildModule !== moduleId,
/******/
/******/ 			// Module API
/******/ 			active: true,
/******/ 			accept: function(dep, callback) {
/******/ 				if (typeof dep === "undefined") hot._selfAccepted = true;
/******/ 				else if (typeof dep === "function") hot._selfAccepted = dep;
/******/ 				else if (typeof dep === "object")
/******/ 					for (var i = 0; i < dep.length; i++)
/******/ 						hot._acceptedDependencies[dep[i]] = callback || function() {};
/******/ 				else hot._acceptedDependencies[dep] = callback || function() {};
/******/ 			},
/******/ 			decline: function(dep) {
/******/ 				if (typeof dep === "undefined") hot._selfDeclined = true;
/******/ 				else if (typeof dep === "object")
/******/ 					for (var i = 0; i < dep.length; i++)
/******/ 						hot._declinedDependencies[dep[i]] = true;
/******/ 				else hot._declinedDependencies[dep] = true;
/******/ 			},
/******/ 			dispose: function(callback) {
/******/ 				hot._disposeHandlers.push(callback);
/******/ 			},
/******/ 			addDisposeHandler: function(callback) {
/******/ 				hot._disposeHandlers.push(callback);
/******/ 			},
/******/ 			removeDisposeHandler: function(callback) {
/******/ 				var idx = hot._disposeHandlers.indexOf(callback);
/******/ 				if (idx >= 0) hot._disposeHandlers.splice(idx, 1);
/******/ 			},
/******/
/******/ 			// Management API
/******/ 			check: hotCheck,
/******/ 			apply: hotApply,
/******/ 			status: function(l) {
/******/ 				if (!l) return hotStatus;
/******/ 				hotStatusHandlers.push(l);
/******/ 			},
/******/ 			addStatusHandler: function(l) {
/******/ 				hotStatusHandlers.push(l);
/******/ 			},
/******/ 			removeStatusHandler: function(l) {
/******/ 				var idx = hotStatusHandlers.indexOf(l);
/******/ 				if (idx >= 0) hotStatusHandlers.splice(idx, 1);
/******/ 			},
/******/
/******/ 			//inherit from previous dispose call
/******/ 			data: hotCurrentModuleData[moduleId]
/******/ 		};
/******/ 		hotCurrentChildModule = undefined;
/******/ 		return hot;
/******/ 	}
/******/
/******/ 	var hotStatusHandlers = [];
/******/ 	var hotStatus = "idle";
/******/
/******/ 	function hotSetStatus(newStatus) {
/******/ 		hotStatus = newStatus;
/******/ 		for (var i = 0; i < hotStatusHandlers.length; i++)
/******/ 			hotStatusHandlers[i].call(null, newStatus);
/******/ 	}
/******/
/******/ 	// while downloading
/******/ 	var hotWaitingFiles = 0;
/******/ 	var hotChunksLoading = 0;
/******/ 	var hotWaitingFilesMap = {};
/******/ 	var hotRequestedFilesMap = {};
/******/ 	var hotAvailableFilesMap = {};
/******/ 	var hotDeferred;
/******/
/******/ 	// The update info
/******/ 	var hotUpdate, hotUpdateNewHash;
/******/
/******/ 	function toModuleId(id) {
/******/ 		var isNumber = +id + "" === id;
/******/ 		return isNumber ? +id : id;
/******/ 	}
/******/
/******/ 	function hotCheck(apply) {
/******/ 		if (hotStatus !== "idle")
/******/ 			throw new Error("check() is only allowed in idle status");
/******/ 		hotApplyOnUpdate = apply;
/******/ 		hotSetStatus("check");
/******/ 		return hotDownloadManifest(hotRequestTimeout).then(function(update) {
/******/ 			if (!update) {
/******/ 				hotSetStatus("idle");
/******/ 				return null;
/******/ 			}
/******/ 			hotRequestedFilesMap = {};
/******/ 			hotWaitingFilesMap = {};
/******/ 			hotAvailableFilesMap = update.c;
/******/ 			hotUpdateNewHash = update.h;
/******/
/******/ 			hotSetStatus("prepare");
/******/ 			var promise = new Promise(function(resolve, reject) {
/******/ 				hotDeferred = {
/******/ 					resolve: resolve,
/******/ 					reject: reject
/******/ 				};
/******/ 			});
/******/ 			hotUpdate = {};
/******/ 			var chunkId = "main";
/******/ 			{
/******/ 				// eslint-disable-line no-lone-blocks
/******/ 				/*globals chunkId */
/******/ 				hotEnsureUpdateChunk(chunkId);
/******/ 			}
/******/ 			if (
/******/ 				hotStatus === "prepare" &&
/******/ 				hotChunksLoading === 0 &&
/******/ 				hotWaitingFiles === 0
/******/ 			) {
/******/ 				hotUpdateDownloaded();
/******/ 			}
/******/ 			return promise;
/******/ 		});
/******/ 	}
/******/
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	function hotAddUpdateChunk(chunkId, moreModules) {
/******/ 		if (!hotAvailableFilesMap[chunkId] || !hotRequestedFilesMap[chunkId])
/******/ 			return;
/******/ 		hotRequestedFilesMap[chunkId] = false;
/******/ 		for (var moduleId in moreModules) {
/******/ 			if (Object.prototype.hasOwnProperty.call(moreModules, moduleId)) {
/******/ 				hotUpdate[moduleId] = moreModules[moduleId];
/******/ 			}
/******/ 		}
/******/ 		if (--hotWaitingFiles === 0 && hotChunksLoading === 0) {
/******/ 			hotUpdateDownloaded();
/******/ 		}
/******/ 	}
/******/
/******/ 	function hotEnsureUpdateChunk(chunkId) {
/******/ 		if (!hotAvailableFilesMap[chunkId]) {
/******/ 			hotWaitingFilesMap[chunkId] = true;
/******/ 		} else {
/******/ 			hotRequestedFilesMap[chunkId] = true;
/******/ 			hotWaitingFiles++;
/******/ 			hotDownloadUpdateChunk(chunkId);
/******/ 		}
/******/ 	}
/******/
/******/ 	function hotUpdateDownloaded() {
/******/ 		hotSetStatus("ready");
/******/ 		var deferred = hotDeferred;
/******/ 		hotDeferred = null;
/******/ 		if (!deferred) return;
/******/ 		if (hotApplyOnUpdate) {
/******/ 			// Wrap deferred object in Promise to mark it as a well-handled Promise to
/******/ 			// avoid triggering uncaught exception warning in Chrome.
/******/ 			// See https://bugs.chromium.org/p/chromium/issues/detail?id=465666
/******/ 			Promise.resolve()
/******/ 				.then(function() {
/******/ 					return hotApply(hotApplyOnUpdate);
/******/ 				})
/******/ 				.then(
/******/ 					function(result) {
/******/ 						deferred.resolve(result);
/******/ 					},
/******/ 					function(err) {
/******/ 						deferred.reject(err);
/******/ 					}
/******/ 				);
/******/ 		} else {
/******/ 			var outdatedModules = [];
/******/ 			for (var id in hotUpdate) {
/******/ 				if (Object.prototype.hasOwnProperty.call(hotUpdate, id)) {
/******/ 					outdatedModules.push(toModuleId(id));
/******/ 				}
/******/ 			}
/******/ 			deferred.resolve(outdatedModules);
/******/ 		}
/******/ 	}
/******/
/******/ 	function hotApply(options) {
/******/ 		if (hotStatus !== "ready")
/******/ 			throw new Error("apply() is only allowed in ready status");
/******/ 		options = options || {};
/******/
/******/ 		var cb;
/******/ 		var i;
/******/ 		var j;
/******/ 		var module;
/******/ 		var moduleId;
/******/
/******/ 		function getAffectedStuff(updateModuleId) {
/******/ 			var outdatedModules = [updateModuleId];
/******/ 			var outdatedDependencies = {};
/******/
/******/ 			var queue = outdatedModules.slice().map(function(id) {
/******/ 				return {
/******/ 					chain: [id],
/******/ 					id: id
/******/ 				};
/******/ 			});
/******/ 			while (queue.length > 0) {
/******/ 				var queueItem = queue.pop();
/******/ 				var moduleId = queueItem.id;
/******/ 				var chain = queueItem.chain;
/******/ 				module = installedModules[moduleId];
/******/ 				if (!module || module.hot._selfAccepted) continue;
/******/ 				if (module.hot._selfDeclined) {
/******/ 					return {
/******/ 						type: "self-declined",
/******/ 						chain: chain,
/******/ 						moduleId: moduleId
/******/ 					};
/******/ 				}
/******/ 				if (module.hot._main) {
/******/ 					return {
/******/ 						type: "unaccepted",
/******/ 						chain: chain,
/******/ 						moduleId: moduleId
/******/ 					};
/******/ 				}
/******/ 				for (var i = 0; i < module.parents.length; i++) {
/******/ 					var parentId = module.parents[i];
/******/ 					var parent = installedModules[parentId];
/******/ 					if (!parent) continue;
/******/ 					if (parent.hot._declinedDependencies[moduleId]) {
/******/ 						return {
/******/ 							type: "declined",
/******/ 							chain: chain.concat([parentId]),
/******/ 							moduleId: moduleId,
/******/ 							parentId: parentId
/******/ 						};
/******/ 					}
/******/ 					if (outdatedModules.includes(parentId)) continue;
/******/ 					if (parent.hot._acceptedDependencies[moduleId]) {
/******/ 						if (!outdatedDependencies[parentId])
/******/ 							outdatedDependencies[parentId] = [];
/******/ 						addAllToSet(outdatedDependencies[parentId], [moduleId]);
/******/ 						continue;
/******/ 					}
/******/ 					delete outdatedDependencies[parentId];
/******/ 					outdatedModules.push(parentId);
/******/ 					queue.push({
/******/ 						chain: chain.concat([parentId]),
/******/ 						id: parentId
/******/ 					});
/******/ 				}
/******/ 			}
/******/
/******/ 			return {
/******/ 				type: "accepted",
/******/ 				moduleId: updateModuleId,
/******/ 				outdatedModules: outdatedModules,
/******/ 				outdatedDependencies: outdatedDependencies
/******/ 			};
/******/ 		}
/******/
/******/ 		function addAllToSet(a, b) {
/******/ 			for (var i = 0; i < b.length; i++) {
/******/ 				var item = b[i];
/******/ 				if (!a.includes(item)) a.push(item);
/******/ 			}
/******/ 		}
/******/
/******/ 		// at begin all updates modules are outdated
/******/ 		// the "outdated" status can propagate to parents if they don't accept the children
/******/ 		var outdatedDependencies = {};
/******/ 		var outdatedModules = [];
/******/ 		var appliedUpdate = {};
/******/
/******/ 		var warnUnexpectedRequire = function warnUnexpectedRequire() {
/******/ 			console.warn(
/******/ 				"[HMR] unexpected require(" + result.moduleId + ") to disposed module"
/******/ 			);
/******/ 		};
/******/
/******/ 		for (var id in hotUpdate) {
/******/ 			if (Object.prototype.hasOwnProperty.call(hotUpdate, id)) {
/******/ 				moduleId = toModuleId(id);
/******/ 				var result;
/******/ 				if (hotUpdate[id]) {
/******/ 					result = getAffectedStuff(moduleId);
/******/ 				} else {
/******/ 					result = {
/******/ 						type: "disposed",
/******/ 						moduleId: id
/******/ 					};
/******/ 				}
/******/ 				var abortError = false;
/******/ 				var doApply = false;
/******/ 				var doDispose = false;
/******/ 				var chainInfo = "";
/******/ 				if (result.chain) {
/******/ 					chainInfo = "\nUpdate propagation: " + result.chain.join(" -> ");
/******/ 				}
/******/ 				switch (result.type) {
/******/ 					case "self-declined":
/******/ 						if (options.onDeclined) options.onDeclined(result);
/******/ 						if (!options.ignoreDeclined)
/******/ 							abortError = new Error(
/******/ 								"Aborted because of self decline: " +
/******/ 									result.moduleId +
/******/ 									chainInfo
/******/ 							);
/******/ 						break;
/******/ 					case "declined":
/******/ 						if (options.onDeclined) options.onDeclined(result);
/******/ 						if (!options.ignoreDeclined)
/******/ 							abortError = new Error(
/******/ 								"Aborted because of declined dependency: " +
/******/ 									result.moduleId +
/******/ 									" in " +
/******/ 									result.parentId +
/******/ 									chainInfo
/******/ 							);
/******/ 						break;
/******/ 					case "unaccepted":
/******/ 						if (options.onUnaccepted) options.onUnaccepted(result);
/******/ 						if (!options.ignoreUnaccepted)
/******/ 							abortError = new Error(
/******/ 								"Aborted because " + moduleId + " is not accepted" + chainInfo
/******/ 							);
/******/ 						break;
/******/ 					case "accepted":
/******/ 						if (options.onAccepted) options.onAccepted(result);
/******/ 						doApply = true;
/******/ 						break;
/******/ 					case "disposed":
/******/ 						if (options.onDisposed) options.onDisposed(result);
/******/ 						doDispose = true;
/******/ 						break;
/******/ 					default:
/******/ 						throw new Error("Unexception type " + result.type);
/******/ 				}
/******/ 				if (abortError) {
/******/ 					hotSetStatus("abort");
/******/ 					return Promise.reject(abortError);
/******/ 				}
/******/ 				if (doApply) {
/******/ 					appliedUpdate[moduleId] = hotUpdate[moduleId];
/******/ 					addAllToSet(outdatedModules, result.outdatedModules);
/******/ 					for (moduleId in result.outdatedDependencies) {
/******/ 						if (
/******/ 							Object.prototype.hasOwnProperty.call(
/******/ 								result.outdatedDependencies,
/******/ 								moduleId
/******/ 							)
/******/ 						) {
/******/ 							if (!outdatedDependencies[moduleId])
/******/ 								outdatedDependencies[moduleId] = [];
/******/ 							addAllToSet(
/******/ 								outdatedDependencies[moduleId],
/******/ 								result.outdatedDependencies[moduleId]
/******/ 							);
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 				if (doDispose) {
/******/ 					addAllToSet(outdatedModules, [result.moduleId]);
/******/ 					appliedUpdate[moduleId] = warnUnexpectedRequire;
/******/ 				}
/******/ 			}
/******/ 		}
/******/
/******/ 		// Store self accepted outdated modules to require them later by the module system
/******/ 		var outdatedSelfAcceptedModules = [];
/******/ 		for (i = 0; i < outdatedModules.length; i++) {
/******/ 			moduleId = outdatedModules[i];
/******/ 			if (
/******/ 				installedModules[moduleId] &&
/******/ 				installedModules[moduleId].hot._selfAccepted
/******/ 			)
/******/ 				outdatedSelfAcceptedModules.push({
/******/ 					module: moduleId,
/******/ 					errorHandler: installedModules[moduleId].hot._selfAccepted
/******/ 				});
/******/ 		}
/******/
/******/ 		// Now in "dispose" phase
/******/ 		hotSetStatus("dispose");
/******/ 		Object.keys(hotAvailableFilesMap).forEach(function(chunkId) {
/******/ 			if (hotAvailableFilesMap[chunkId] === false) {
/******/ 				hotDisposeChunk(chunkId);
/******/ 			}
/******/ 		});
/******/
/******/ 		var idx;
/******/ 		var queue = outdatedModules.slice();
/******/ 		while (queue.length > 0) {
/******/ 			moduleId = queue.pop();
/******/ 			module = installedModules[moduleId];
/******/ 			if (!module) continue;
/******/
/******/ 			var data = {};
/******/
/******/ 			// Call dispose handlers
/******/ 			var disposeHandlers = module.hot._disposeHandlers;
/******/ 			for (j = 0; j < disposeHandlers.length; j++) {
/******/ 				cb = disposeHandlers[j];
/******/ 				cb(data);
/******/ 			}
/******/ 			hotCurrentModuleData[moduleId] = data;
/******/
/******/ 			// disable module (this disables requires from this module)
/******/ 			module.hot.active = false;
/******/
/******/ 			// remove module from cache
/******/ 			delete installedModules[moduleId];
/******/
/******/ 			// when disposing there is no need to call dispose handler
/******/ 			delete outdatedDependencies[moduleId];
/******/
/******/ 			// remove "parents" references from all children
/******/ 			for (j = 0; j < module.children.length; j++) {
/******/ 				var child = installedModules[module.children[j]];
/******/ 				if (!child) continue;
/******/ 				idx = child.parents.indexOf(moduleId);
/******/ 				if (idx >= 0) {
/******/ 					child.parents.splice(idx, 1);
/******/ 				}
/******/ 			}
/******/ 		}
/******/
/******/ 		// remove outdated dependency from module children
/******/ 		var dependency;
/******/ 		var moduleOutdatedDependencies;
/******/ 		for (moduleId in outdatedDependencies) {
/******/ 			if (
/******/ 				Object.prototype.hasOwnProperty.call(outdatedDependencies, moduleId)
/******/ 			) {
/******/ 				module = installedModules[moduleId];
/******/ 				if (module) {
/******/ 					moduleOutdatedDependencies = outdatedDependencies[moduleId];
/******/ 					for (j = 0; j < moduleOutdatedDependencies.length; j++) {
/******/ 						dependency = moduleOutdatedDependencies[j];
/******/ 						idx = module.children.indexOf(dependency);
/******/ 						if (idx >= 0) module.children.splice(idx, 1);
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/
/******/ 		// Not in "apply" phase
/******/ 		hotSetStatus("apply");
/******/
/******/ 		hotCurrentHash = hotUpdateNewHash;
/******/
/******/ 		// insert new code
/******/ 		for (moduleId in appliedUpdate) {
/******/ 			if (Object.prototype.hasOwnProperty.call(appliedUpdate, moduleId)) {
/******/ 				modules[moduleId] = appliedUpdate[moduleId];
/******/ 			}
/******/ 		}
/******/
/******/ 		// call accept handlers
/******/ 		var error = null;
/******/ 		for (moduleId in outdatedDependencies) {
/******/ 			if (
/******/ 				Object.prototype.hasOwnProperty.call(outdatedDependencies, moduleId)
/******/ 			) {
/******/ 				module = installedModules[moduleId];
/******/ 				if (module) {
/******/ 					moduleOutdatedDependencies = outdatedDependencies[moduleId];
/******/ 					var callbacks = [];
/******/ 					for (i = 0; i < moduleOutdatedDependencies.length; i++) {
/******/ 						dependency = moduleOutdatedDependencies[i];
/******/ 						cb = module.hot._acceptedDependencies[dependency];
/******/ 						if (cb) {
/******/ 							if (callbacks.includes(cb)) continue;
/******/ 							callbacks.push(cb);
/******/ 						}
/******/ 					}
/******/ 					for (i = 0; i < callbacks.length; i++) {
/******/ 						cb = callbacks[i];
/******/ 						try {
/******/ 							cb(moduleOutdatedDependencies);
/******/ 						} catch (err) {
/******/ 							if (options.onErrored) {
/******/ 								options.onErrored({
/******/ 									type: "accept-errored",
/******/ 									moduleId: moduleId,
/******/ 									dependencyId: moduleOutdatedDependencies[i],
/******/ 									error: err
/******/ 								});
/******/ 							}
/******/ 							if (!options.ignoreErrored) {
/******/ 								if (!error) error = err;
/******/ 							}
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/
/******/ 		// Load self accepted modules
/******/ 		for (i = 0; i < outdatedSelfAcceptedModules.length; i++) {
/******/ 			var item = outdatedSelfAcceptedModules[i];
/******/ 			moduleId = item.module;
/******/ 			hotCurrentParents = [moduleId];
/******/ 			try {
/******/ 				__webpack_require__(moduleId);
/******/ 			} catch (err) {
/******/ 				if (typeof item.errorHandler === "function") {
/******/ 					try {
/******/ 						item.errorHandler(err);
/******/ 					} catch (err2) {
/******/ 						if (options.onErrored) {
/******/ 							options.onErrored({
/******/ 								type: "self-accept-error-handler-errored",
/******/ 								moduleId: moduleId,
/******/ 								error: err2,
/******/ 								originalError: err
/******/ 							});
/******/ 						}
/******/ 						if (!options.ignoreErrored) {
/******/ 							if (!error) error = err2;
/******/ 						}
/******/ 						if (!error) error = err;
/******/ 					}
/******/ 				} else {
/******/ 					if (options.onErrored) {
/******/ 						options.onErrored({
/******/ 							type: "self-accept-errored",
/******/ 							moduleId: moduleId,
/******/ 							error: err
/******/ 						});
/******/ 					}
/******/ 					if (!options.ignoreErrored) {
/******/ 						if (!error) error = err;
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/
/******/ 		// handle errors in accept handlers and self accepted module load
/******/ 		if (error) {
/******/ 			hotSetStatus("fail");
/******/ 			return Promise.reject(error);
/******/ 		}
/******/
/******/ 		hotSetStatus("idle");
/******/ 		return new Promise(function(resolve) {
/******/ 			resolve(outdatedModules);
/******/ 		});
/******/ 	}
/******/
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {},
/******/ 			hot: hotCreateModule(moduleId),
/******/ 			parents: (hotCurrentParentsTemp = hotCurrentParents, hotCurrentParents = [], hotCurrentParentsTemp),
/******/ 			children: []
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, hotCreateRequire(moduleId));
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// __webpack_hash__
/******/ 	__webpack_require__.h = function() { return hotCurrentHash; };
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return hotCreateRequire("./src/index.js")(__webpack_require__.s = "./src/index.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/assets/chest-sprite.png":
/*!*************************************!*\
  !*** ./src/assets/chest-sprite.png ***!
  \*************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "af190a7f6b70a5d1f5779da89aff2b8f.png";

/***/ }),

/***/ "./src/assets/goblin-sprite.png":
/*!**************************************!*\
  !*** ./src/assets/goblin-sprite.png ***!
  \**************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "b4867ae7bba01ef0dd0669025976b471.png";

/***/ }),

/***/ "./src/assets/goblino-tiles.png":
/*!**************************************!*\
  !*** ./src/assets/goblino-tiles.png ***!
  \**************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "c6e8d3846bc8f5004174df0813c7d77d.png";

/***/ }),

/***/ "./src/assets/map.png":
/*!****************************!*\
  !*** ./src/assets/map.png ***!
  \****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "d4ed7990c5e15a06879061f136f5c89a.png";

/***/ }),

/***/ "./src/constants/directions.js":
/*!*************************************!*\
  !*** ./src/constants/directions.js ***!
  \*************************************/
/*! exports provided: NORTH, WEST, SOUTH, EAST, DIRECTION_KEY_BINDINGS, DIRECTION_VECTORS */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "NORTH", function() { return NORTH; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "WEST", function() { return WEST; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SOUTH", function() { return SOUTH; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "EAST", function() { return EAST; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "DIRECTION_KEY_BINDINGS", function() { return DIRECTION_KEY_BINDINGS; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "DIRECTION_VECTORS", function() { return DIRECTION_VECTORS; });
/* harmony import */ var _user_settings__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./user-settings */ "./src/constants/user-settings.js");


const NORTH = 'NORTH';
const WEST = 'WEST';
const SOUTH = 'SOUTH';
const EAST = 'EAST';
const DIRECTION_KEY_BINDINGS = {
  [_user_settings__WEBPACK_IMPORTED_MODULE_0__["KEY_UP"]]: NORTH,
  [_user_settings__WEBPACK_IMPORTED_MODULE_0__["KEY_RIGHT"]]: EAST,
  [_user_settings__WEBPACK_IMPORTED_MODULE_0__["KEY_DOWN"]]: SOUTH,
  [_user_settings__WEBPACK_IMPORTED_MODULE_0__["KEY_LEFT"]]: WEST
};
const DIRECTION_VECTORS = {
  NORTH: ({ x, y }, distance) => ({ x, y: y - distance }),
  EAST: ({ x, y }, distance) => ({ x: x + distance, y }),
  SOUTH: ({ x, y }, distance) => ({ x, y: y + distance }),
  WEST: ({ x, y }, distance) => ({ x: x - distance, y })
};


/***/ }),

/***/ "./src/constants/entities.js":
/*!***********************************!*\
  !*** ./src/constants/entities.js ***!
  \***********************************/
/*! exports provided: INANIMATE, DEBUG_ENTITIES, OPEN, CLOSED, default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "INANIMATE", function() { return INANIMATE; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "DEBUG_ENTITIES", function() { return DEBUG_ENTITIES; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "OPEN", function() { return OPEN; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CLOSED", function() { return CLOSED; });
/* harmony import */ var _index__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./index */ "./src/constants/index.js");
/* harmony import */ var _assets_chest_sprite_png__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../assets/chest-sprite.png */ "./src/assets/chest-sprite.png");
/* harmony import */ var _assets_chest_sprite_png__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_assets_chest_sprite_png__WEBPACK_IMPORTED_MODULE_1__);
/* globals Image */


const INANIMATE = 'INANIMATE';
const DEBUG_ENTITIES = 'DEBUG';

const OPEN = 'OPEN';
const CLOSED = 'CLOSED';


const chestImage = new Image();
chestImage.src = _assets_chest_sprite_png__WEBPACK_IMPORTED_MODULE_1___default.a;

const types = {
  chest: {
    loot: { gold: 10 },
    type: INANIMATE,
    status: CLOSED,
    dx: 1 * _index__WEBPACK_IMPORTED_MODULE_0__["TILE_SIZE"] - 1,
    dy: 1 * _index__WEBPACK_IMPORTED_MODULE_0__["TILE_SIZE"] - 1,
    sprite: {
      asset: chestImage,
      images: {
        [OPEN]: { x: 32, y: 0 },
        [CLOSED]: { x: 0, y: 0 }
      }
    },
    activate: function() {
      const loot = this.loot;

      this.status = this.status === OPEN ? CLOSED : OPEN;
      this.loot = {};

      return { loot };
    }
  }
};

/* harmony default export */ __webpack_exports__["default"] = (Object.keys(types).reduce((prev, curr) => {
  return {
    ...prev,
    [curr]: properties => {
      return {
        ...types[curr],
        ...properties
      };
    }
  };
}, {}));


/***/ }),

/***/ "./src/constants/index.js":
/*!********************************!*\
  !*** ./src/constants/index.js ***!
  \********************************/
/*! exports provided: PLAYER_MOVE_SPEED, CANVAS_WIDTH, CANVAS_HEIGHT, TILE_SIZE, HALF_TILE */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "PLAYER_MOVE_SPEED", function() { return PLAYER_MOVE_SPEED; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CANVAS_WIDTH", function() { return CANVAS_WIDTH; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CANVAS_HEIGHT", function() { return CANVAS_HEIGHT; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "TILE_SIZE", function() { return TILE_SIZE; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "HALF_TILE", function() { return HALF_TILE; });
const PLAYER_MOVE_SPEED = 2;
const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 600;
const TILE_SIZE = 32;
const HALF_TILE = TILE_SIZE / 2;


/***/ }),

/***/ "./src/constants/user-settings.js":
/*!****************************************!*\
  !*** ./src/constants/user-settings.js ***!
  \****************************************/
/*! exports provided: KEY_UP, KEY_RIGHT, KEY_DOWN, KEY_LEFT, KEY_ACTION, DEBUG */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "KEY_UP", function() { return KEY_UP; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "KEY_RIGHT", function() { return KEY_RIGHT; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "KEY_DOWN", function() { return KEY_DOWN; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "KEY_LEFT", function() { return KEY_LEFT; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "KEY_ACTION", function() { return KEY_ACTION; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "DEBUG", function() { return DEBUG; });
const KEY_UP = 'z';
const KEY_RIGHT = 'd';
const KEY_DOWN = 's';
const KEY_LEFT = 'q';
const KEY_ACTION = 'e';
const DEBUG = false;


/***/ }),

/***/ "./src/debug-tools.js":
/*!****************************!*\
  !*** ./src/debug-tools.js ***!
  \****************************/
/*! exports provided: renderDebugInfo */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "renderDebugInfo", function() { return renderDebugInfo; });
/* globals document */
const playerInfoPanel = document.getElementById('player-info');

function renderDebugInfo(state) {
  playerInfoPanel.innerHTML = JSON.stringify(state.player, null, 2);
}


/***/ }),

/***/ "./src/entity.js":
/*!***********************!*\
  !*** ./src/entity.js ***!
  \***********************/
/*! exports provided: drawEntity, moveEntity, spawnEntity */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "drawEntity", function() { return drawEntity; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "moveEntity", function() { return moveEntity; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "spawnEntity", function() { return spawnEntity; });
/* harmony import */ var _constants_directions__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./constants/directions */ "./src/constants/directions.js");
/* harmony import */ var _constants_entities__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./constants/entities */ "./src/constants/entities.js");
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./constants */ "./src/constants/index.js");
/* harmony import */ var _map__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./map */ "./src/map/index.js");






function drawEntity(ctx, entity) {
  if (!entity.sprite) {
    ctx.fillStyle = 'rgb(200, 0, 0)';
    return ctx.fillRect(entity.x, entity.y, entity.dx, entity.dy);
  }
  const { sprite, type, status, direction, x, y, dx, dy } = entity;
  const variantDeterminer = (type === _constants_entities__WEBPACK_IMPORTED_MODULE_1__["INANIMATE"] && status) || direction;
  const { x: sx, y: sy } = sprite.images[variantDeterminer];
  ctx.drawImage(sprite.asset, sx, sy, dx, dy, x, y, dx, dy);
}

function moveEntity(entity, direction, distance) {
  const { x, y } = _constants_directions__WEBPACK_IMPORTED_MODULE_0__["DIRECTION_VECTORS"][direction](entity, distance);
  const newEntity = {
    ...entity,
    x: clamp(x, 0, _constants__WEBPACK_IMPORTED_MODULE_2__["CANVAS_WIDTH"] - entity.dx),
    y: clamp(y, 0, _constants__WEBPACK_IMPORTED_MODULE_2__["CANVAS_HEIGHT"] - entity.dy),
    direction
  };

  if (!Object(_map__WEBPACK_IMPORTED_MODULE_3__["detectWallCollision"])(newEntity)) {
    return newEntity;
  }

  return { ...entity, direction };
}

function clamp(number, min, max) {
  return Math.min(Math.max(number, min), max);
}

function spawnEntity(identifier, tileCoordinates, direction = _constants_directions__WEBPACK_IMPORTED_MODULE_0__["SOUTH"]) {
  const coordinates = Object(_map__WEBPACK_IMPORTED_MODULE_3__["getTileOriginCoordinates"])(tileCoordinates);
  const entity = _constants_entities__WEBPACK_IMPORTED_MODULE_1__["default"][identifier]({
    direction,
    ...coordinates
  });

  return entity;
}


/***/ }),

/***/ "./src/gui.js":
/*!********************!*\
  !*** ./src/gui.js ***!
  \********************/
/*! exports provided: drawGui */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "drawGui", function() { return drawGui; });
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./constants */ "./src/constants/index.js");


function drawGui(ctx, state) {
  ctx.fillStyle = 'rgb(156, 144, 135)';
  ctx.fillRect(_constants__WEBPACK_IMPORTED_MODULE_0__["CANVAS_WIDTH"] - 40, _constants__WEBPACK_IMPORTED_MODULE_0__["CANVAS_HEIGHT"] - 40, 30, 30);
  ctx.fillStyle = 'rgb(56, 44, 35)';
  ctx.font = '24px serif';
  ctx.fillText(state.gold, _constants__WEBPACK_IMPORTED_MODULE_0__["CANVAS_WIDTH"] - 36, _constants__WEBPACK_IMPORTED_MODULE_0__["CANVAS_HEIGHT"] - 16);
}


/***/ }),

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _entity__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./entity */ "./src/entity.js");
/* harmony import */ var _constants_entities__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./constants/entities */ "./src/constants/entities.js");
/* harmony import */ var _map__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./map */ "./src/map/index.js");
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./constants */ "./src/constants/index.js");
/* harmony import */ var _keyboard_controller__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./keyboard-controller */ "./src/keyboard-controller.js");
/* harmony import */ var _player__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./player */ "./src/player.js");
/* harmony import */ var _player_controls__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./player-controls */ "./src/player-controls.js");
/* harmony import */ var _debug_tools__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./debug-tools */ "./src/debug-tools.js");
/* harmony import */ var _constants_user_settings__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./constants/user-settings */ "./src/constants/user-settings.js");
/* harmony import */ var _map_map_loader__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./map/map-loader */ "./src/map/map-loader.js");
/* harmony import */ var _gui__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./gui */ "./src/gui.js");
/* globals document, window */












const state = {
  gold: 0,
  player: _player__WEBPACK_IMPORTED_MODULE_5__["default"],
  entities: {
    [_constants_entities__WEBPACK_IMPORTED_MODULE_1__["INANIMATE"]]: [],
    [_constants_entities__WEBPACK_IMPORTED_MODULE_1__["DEBUG_ENTITIES"]]: []
  }
};
const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');

async function startGame() {
  Object(_keyboard_controller__WEBPACK_IMPORTED_MODULE_4__["startKeyboardController"])(_player_controls__WEBPACK_IMPORTED_MODULE_6__["default"]);
  await Object(_map_map_loader__WEBPACK_IMPORTED_MODULE_9__["loadMapData"])();
  state.entities[_constants_entities__WEBPACK_IMPORTED_MODULE_1__["INANIMATE"]].push(Object(_entity__WEBPACK_IMPORTED_MODULE_0__["spawnEntity"])('chest', { x: 4, y: 4 }));
  gameLoop();
}

function gameLoop() {
  Object(_keyboard_controller__WEBPACK_IMPORTED_MODULE_4__["registerKeyboardEvents"])(state);
  _constants_user_settings__WEBPACK_IMPORTED_MODULE_8__["DEBUG"] && Object(_debug_tools__WEBPACK_IMPORTED_MODULE_7__["renderDebugInfo"])(state);

  ctx.clearRect(0, 0, _constants__WEBPACK_IMPORTED_MODULE_3__["CANVAS_WIDTH"], _constants__WEBPACK_IMPORTED_MODULE_3__["CANVAS_HEIGHT"]);

  Object(_map__WEBPACK_IMPORTED_MODULE_2__["drawMap"])(ctx, state.player);

  state.entities[_constants_entities__WEBPACK_IMPORTED_MODULE_1__["INANIMATE"]].forEach(entity => {
    Object(_entity__WEBPACK_IMPORTED_MODULE_0__["drawEntity"])(ctx, entity);
  });
  state.entities[_constants_entities__WEBPACK_IMPORTED_MODULE_1__["DEBUG_ENTITIES"]].forEach(entity => {
    Object(_entity__WEBPACK_IMPORTED_MODULE_0__["drawEntity"])(ctx, entity);
  });

  Object(_entity__WEBPACK_IMPORTED_MODULE_0__["drawEntity"])(ctx, state.player);
  Object(_gui__WEBPACK_IMPORTED_MODULE_10__["drawGui"])(ctx, state);

  window.requestAnimationFrame(gameLoop);
}

startGame();


/***/ }),

/***/ "./src/keyboard-controller.js":
/*!************************************!*\
  !*** ./src/keyboard-controller.js ***!
  \************************************/
/*! exports provided: startKeyboardController, registerKeyboardEvents, clearKey */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "startKeyboardController", function() { return startKeyboardController; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "registerKeyboardEvents", function() { return registerKeyboardEvents; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "clearKey", function() { return clearKey; });
/* globals document */
const keyState = {};
let listeners = {};

function startKeyboardController(controls) {
  listeners = controls;

  document.addEventListener('keypress', evt => {
    keyState[evt.key] = true;
  });
  document.addEventListener('keyup', evt => {
    clearKey(evt.key);
  });
}

function registerKeyboardEvents(state) {
  Object.keys(keyState).forEach(key => {
    listeners[key] && listeners[key](state);
  });
}

function clearKey(key) {
  delete keyState[key];
}


/***/ }),

/***/ "./src/map/index.js":
/*!**************************!*\
  !*** ./src/map/index.js ***!
  \**************************/
/*! exports provided: drawMap, detectWallCollision, detectEntityCollision, getTileOriginCoordinates, getTileCenterCoordinates */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "drawMap", function() { return drawMap; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "detectWallCollision", function() { return detectWallCollision; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "detectEntityCollision", function() { return detectEntityCollision; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getTileOriginCoordinates", function() { return getTileOriginCoordinates; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getTileCenterCoordinates", function() { return getTileCenterCoordinates; });
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../constants */ "./src/constants/index.js");
/* harmony import */ var _tileset__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./tileset */ "./src/map/tileset.js");
/* harmony import */ var _map_loader__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./map-loader */ "./src/map/map-loader.js");




const TILE_COUNT_X = _constants__WEBPACK_IMPORTED_MODULE_0__["CANVAS_WIDTH"] / _constants__WEBPACK_IMPORTED_MODULE_0__["TILE_SIZE"];
const TILE_COUNT_Y = _constants__WEBPACK_IMPORTED_MODULE_0__["CANVAS_HEIGHT"] / _constants__WEBPACK_IMPORTED_MODULE_0__["TILE_SIZE"];

function drawMap(ctx /*, player*/) {
  const mapData = Object(_map_loader__WEBPACK_IMPORTED_MODULE_2__["getMapData"])();

  for (let x = 0; x < TILE_COUNT_X; x += 1) {
    for (let y = 0; y < TILE_COUNT_Y; y += 1) {
      const { image, imageVariant } = mapData[x][y];
      const { x: sx, y: sy } = _tileset__WEBPACK_IMPORTED_MODULE_1__["default"].images[image][imageVariant];

      ctx.drawImage(
        _tileset__WEBPACK_IMPORTED_MODULE_1__["default"].asset,
        sx,
        sy,
        _constants__WEBPACK_IMPORTED_MODULE_0__["TILE_SIZE"],
        _constants__WEBPACK_IMPORTED_MODULE_0__["TILE_SIZE"],
        x * _constants__WEBPACK_IMPORTED_MODULE_0__["TILE_SIZE"],
        y * _constants__WEBPACK_IMPORTED_MODULE_0__["TILE_SIZE"],
        _constants__WEBPACK_IMPORTED_MODULE_0__["TILE_SIZE"],
        _constants__WEBPACK_IMPORTED_MODULE_0__["TILE_SIZE"]
      );
    }
  }
}

function detectWallCollision(entity) {
  const mapData = Object(_map_loader__WEBPACK_IMPORTED_MODULE_2__["getMapData"])();
  const leftTile = Math.floor(entity.x / _constants__WEBPACK_IMPORTED_MODULE_0__["TILE_SIZE"]);
  const rightTile = Math.floor((entity.x + entity.dx) / _constants__WEBPACK_IMPORTED_MODULE_0__["TILE_SIZE"]);
  const topTile = Math.floor(entity.y / _constants__WEBPACK_IMPORTED_MODULE_0__["TILE_SIZE"]);
  const bottomTile = Math.floor((entity.y + entity.dy) / _constants__WEBPACK_IMPORTED_MODULE_0__["TILE_SIZE"]);

  for (let x = leftTile; x <= rightTile; x += 1) {
    for (let y = topTile; y <= bottomTile; y += 1) {
      if (mapData[x][y].blocking) {
        return true;
      }
    }
  }

  return false;
}

function detectEntityCollision(entities, entity) {
  for (let i = 0; i < entities.length; i += 1) {
    const e = entities[i];

    if (
      e.x < entity.x + entity.dx &&
      e.x + e.dx > entity.x &&
      e.y < entity.y + entity.dy &&
      e.dy + e.y > entity.y
    ) {
      return e;
    }
  }
}

function getTileOriginCoordinates(tileCoordinates) {
  const { x, y } = tileCoordinates;
  return {
    x: x * _constants__WEBPACK_IMPORTED_MODULE_0__["TILE_SIZE"],
    y: y * _constants__WEBPACK_IMPORTED_MODULE_0__["TILE_SIZE"]
  };
}
function getTileCenterCoordinates(tileCoordinates) {
  const { x, y } = tileCoordinates;
  return {
    x: x * _constants__WEBPACK_IMPORTED_MODULE_0__["TILE_SIZE"] + _constants__WEBPACK_IMPORTED_MODULE_0__["HALF_TILE"],
    y: y * _constants__WEBPACK_IMPORTED_MODULE_0__["TILE_SIZE"] + _constants__WEBPACK_IMPORTED_MODULE_0__["HALF_TILE"]
  };
}


/***/ }),

/***/ "./src/map/map-loader.js":
/*!*******************************!*\
  !*** ./src/map/map-loader.js ***!
  \*******************************/
/*! exports provided: loadMapData, decodeMapData, decodeTileInfo, getMapData */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "loadMapData", function() { return loadMapData; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "decodeMapData", function() { return decodeMapData; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "decodeTileInfo", function() { return decodeTileInfo; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getMapData", function() { return getMapData; });
/* harmony import */ var _assets_map_png__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../assets/map.png */ "./src/assets/map.png");
/* harmony import */ var _assets_map_png__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_assets_map_png__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _constants_directions__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../constants/directions */ "./src/constants/directions.js");
/* harmony import */ var _tileset__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./tileset */ "./src/map/tileset.js");
/* globals Image, document */




const mapData = [];

function loadMapData() {
  const img = new Image();
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  return new Promise(resolve => {
    img.src = _assets_map_png__WEBPACK_IMPORTED_MODULE_0___default.a;
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0, img.width, img.height);

      decodeMapData(ctx, img.width, img.height);
      resolve();
    };
  });
}

function decodeMapData(ctx, width, height) {
  const rawData = [];

  for (let x = 0; x < width; x += 1) {
    rawData.push([]);
    for (let y = 0; y < height; y += 1) {
      rawData[x].push(ctx.getImageData(x, y, 1, 1).data);
    }
  }

  for (let x = 0; x < width; x += 1) {
    mapData.push([]);
    for (let y = 0; y < height; y += 1) {
      const neighbours = {
        [_constants_directions__WEBPACK_IMPORTED_MODULE_1__["NORTH"]]: rawData[x][y - 1] || [0],
        [_constants_directions__WEBPACK_IMPORTED_MODULE_1__["NORTH"] + _constants_directions__WEBPACK_IMPORTED_MODULE_1__["EAST"]]: (rawData[x + 1] && rawData[x + 1][y - 1]) || [0],
        [_constants_directions__WEBPACK_IMPORTED_MODULE_1__["EAST"]]: (rawData[x + 1] && rawData[x + 1][y]) || [0],
        [_constants_directions__WEBPACK_IMPORTED_MODULE_1__["SOUTH"] + _constants_directions__WEBPACK_IMPORTED_MODULE_1__["EAST"]]: (rawData[x + 1] && rawData[x + 1][y + 1]) || [0],
        [_constants_directions__WEBPACK_IMPORTED_MODULE_1__["SOUTH"]]: rawData[x][y + 1] || [0],
        [_constants_directions__WEBPACK_IMPORTED_MODULE_1__["SOUTH"] + _constants_directions__WEBPACK_IMPORTED_MODULE_1__["WEST"]]: (rawData[x - 1] && rawData[x - 1][y + 1]) || [0],
        [_constants_directions__WEBPACK_IMPORTED_MODULE_1__["WEST"]]: (rawData[x - 1] && rawData[x - 1][y]) || [0],
        [_constants_directions__WEBPACK_IMPORTED_MODULE_1__["NORTH"] + _constants_directions__WEBPACK_IMPORTED_MODULE_1__["WEST"]]: (rawData[x - 1] && rawData[x - 1][y - 1]) || [0]
      };

      mapData[x].push(decodeTileInfo(rawData[x][y], neighbours));
    }
  }
}

function decodeTileInfo(tileInfo, neighbours) {
  const northBlocking = neighbours[_constants_directions__WEBPACK_IMPORTED_MODULE_1__["NORTH"]][0] === 0;
  const eastBlocking = neighbours[_constants_directions__WEBPACK_IMPORTED_MODULE_1__["EAST"]][0] === 0;
  const southBlocking = neighbours[_constants_directions__WEBPACK_IMPORTED_MODULE_1__["SOUTH"]][0] === 0;
  const westBlocking = neighbours[_constants_directions__WEBPACK_IMPORTED_MODULE_1__["WEST"]][0] === 0;
  const neighboursValue =
    northBlocking * 8 + eastBlocking * 4 + southBlocking * 2 + westBlocking * 1;

  if (tileInfo[0] === 0) {
    const imageId = `ceiling${neighboursValue}`;

    return { blocking: true, ...Object(_tileset__WEBPACK_IMPORTED_MODULE_2__["getTileVariant"])(imageId) };
  }

  if (northBlocking) {
    return { blocking: false, ...Object(_tileset__WEBPACK_IMPORTED_MODULE_2__["getTileVariant"])('wall') };
  }

  return { blocking: false, ...Object(_tileset__WEBPACK_IMPORTED_MODULE_2__["getTileVariant"])('floor') };
}

function getMapData() {
  return mapData;
}

function getNeighbourBlockMatrix() {}


/***/ }),

/***/ "./src/map/tileset.js":
/*!****************************!*\
  !*** ./src/map/tileset.js ***!
  \****************************/
/*! exports provided: default, getTileVariant */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getTileVariant", function() { return getTileVariant; });
/* harmony import */ var _assets_goblino_tiles_png__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../assets/goblino-tiles.png */ "./src/assets/goblino-tiles.png");
/* harmony import */ var _assets_goblino_tiles_png__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_assets_goblino_tiles_png__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../constants */ "./src/constants/index.js");
/* globals Image */



const tileImage = new Image();

tileImage.src = _assets_goblino_tiles_png__WEBPACK_IMPORTED_MODULE_0___default.a;

function tileXY(x, y) {
  return { x: x * _constants__WEBPACK_IMPORTED_MODULE_1__["TILE_SIZE"], y: y * _constants__WEBPACK_IMPORTED_MODULE_1__["TILE_SIZE"] };
}

const images = {
  floor: [
    tileXY(0, 0),
    tileXY(1, 0),
    tileXY(2, 0),
    tileXY(3, 0),
    tileXY(4, 0),
    tileXY(5, 0),
    tileXY(6, 0),
    tileXY(7, 0),
    tileXY(8, 0)
  ],
  ceiling0: [tileXY(0, 1), tileXY(0, 2)],
  ceiling1: [tileXY(1, 1)],
  ceiling2: [tileXY(2, 1)],
  ceiling3: [tileXY(3, 1)],
  ceiling4: [tileXY(4, 1)],
  ceiling5: [tileXY(5, 1), tileXY(5, 2), tileXY(5, 3), tileXY(5, 4)],
  ceiling6: [tileXY(6, 1)],
  ceiling7: [tileXY(7, 1), tileXY(7, 2), tileXY(7, 3), tileXY(7, 4)],
  ceiling8: [tileXY(8, 1)],
  ceiling9: [tileXY(9, 1)],
  ceiling10: [tileXY(10, 1), tileXY(10, 2), tileXY(10, 3), tileXY(10, 4)],
  ceiling11: [tileXY(11, 1), tileXY(11, 2), tileXY(11, 3), tileXY(11, 4)],
  ceiling12: [tileXY(12, 1)],
  ceiling13: [tileXY(13, 1), tileXY(13, 2), tileXY(13, 3), tileXY(13, 4)],
  ceiling14: [tileXY(14, 1), tileXY(14, 2), tileXY(14, 3), tileXY(14, 4)],
  ceiling15: [tileXY(15, 1)],
  ceiling16: [tileXY(16, 1)],
  wall: [
    tileXY(3, 5),
    tileXY(4, 5),
    tileXY(5, 5),
    tileXY(6, 5),
    tileXY(3, 6),
    tileXY(4, 6),
    tileXY(5, 6),
    tileXY(6, 6)
  ],
  wallLeftCorner: [tileXY(0, 5), tileXY(0, 6)],
  wallRightCorner: [tileXY(1, 5), tileXY(1, 6)],
  wallBothCorners: [tileXY(2, 5), tileXY(2, 6)]
};
/* harmony default export */ __webpack_exports__["default"] = ({
  asset: tileImage,
  images
});

function getTileVariant(image) {
  if (images[image].length === 1) {
    return { image, imageVariant: 0 };
  }

  const variants = images[image];
  const imageVariant = Math.floor(Math.random() * variants.length);

  return { image, imageVariant };
}


/***/ }),

/***/ "./src/player-controls.js":
/*!********************************!*\
  !*** ./src/player-controls.js ***!
  \********************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _constants_user_settings__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./constants/user-settings */ "./src/constants/user-settings.js");
/* harmony import */ var _constants_directions__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./constants/directions */ "./src/constants/directions.js");
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./constants */ "./src/constants/index.js");
/* harmony import */ var _constants_entities__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./constants/entities */ "./src/constants/entities.js");
/* harmony import */ var _entity__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./entity */ "./src/entity.js");
/* harmony import */ var _keyboard_controller__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./keyboard-controller */ "./src/keyboard-controller.js");
/* harmony import */ var _map__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./map */ "./src/map/index.js");
/* globals console */








/* harmony default export */ __webpack_exports__["default"] = ({
  [_constants_user_settings__WEBPACK_IMPORTED_MODULE_0__["KEY_UP"]]: state => movePlayer(state, _constants_user_settings__WEBPACK_IMPORTED_MODULE_0__["KEY_UP"]),
  [_constants_user_settings__WEBPACK_IMPORTED_MODULE_0__["KEY_RIGHT"]]: state => movePlayer(state, _constants_user_settings__WEBPACK_IMPORTED_MODULE_0__["KEY_RIGHT"]),
  [_constants_user_settings__WEBPACK_IMPORTED_MODULE_0__["KEY_DOWN"]]: state => movePlayer(state, _constants_user_settings__WEBPACK_IMPORTED_MODULE_0__["KEY_DOWN"]),
  [_constants_user_settings__WEBPACK_IMPORTED_MODULE_0__["KEY_LEFT"]]: state => movePlayer(state, _constants_user_settings__WEBPACK_IMPORTED_MODULE_0__["KEY_LEFT"]),
  [_constants_user_settings__WEBPACK_IMPORTED_MODULE_0__["KEY_ACTION"]]: state => playerAct(state, _constants_user_settings__WEBPACK_IMPORTED_MODULE_0__["KEY_ACTION"])
});

function movePlayer(state, key) {
  const direction = _constants_directions__WEBPACK_IMPORTED_MODULE_1__["DIRECTION_KEY_BINDINGS"][key];

  state.player = Object(_entity__WEBPACK_IMPORTED_MODULE_4__["moveEntity"])(state.player, direction, _constants__WEBPACK_IMPORTED_MODULE_2__["PLAYER_MOVE_SPEED"]);
}

function playerAct(state, key) {
  Object(_keyboard_controller__WEBPACK_IMPORTED_MODULE_5__["clearKey"])(key);

  const target = findActionTarget(state);

  if (!target || !target.activate) {
    return;
  }
  const event = target.activate();

  if (event.loot && event.loot.gold) {
    state.gold += event.loot.gold;
  }
}
function findActionTarget(state) {
  const { x, y, dx, dy, direction } = state.player;
  const entities = state.entities[_constants_entities__WEBPACK_IMPORTED_MODULE_3__["INANIMATE"]];
  const search = defineSearchBox({ x, y, dx, dy }, direction);

  return Object(_map__WEBPACK_IMPORTED_MODULE_6__["detectEntityCollision"])(entities, search);
}
function defineSearchBox(origin, direction) {
  const { x, y } = origin;

  const search = {
    x,
    y,
    dx: _constants__WEBPACK_IMPORTED_MODULE_2__["TILE_SIZE"],
    dy: _constants__WEBPACK_IMPORTED_MODULE_2__["TILE_SIZE"]
  };
  if (direction === _constants_directions__WEBPACK_IMPORTED_MODULE_1__["NORTH"]) {
    search.y -= _constants__WEBPACK_IMPORTED_MODULE_2__["HALF_TILE"];
    search.dy = _constants__WEBPACK_IMPORTED_MODULE_2__["HALF_TILE"];
  }
  if (direction === _constants_directions__WEBPACK_IMPORTED_MODULE_1__["WEST"]) {
    search.x -= _constants__WEBPACK_IMPORTED_MODULE_2__["HALF_TILE"];
    search.dx = _constants__WEBPACK_IMPORTED_MODULE_2__["HALF_TILE"];
  }
  if (direction === _constants_directions__WEBPACK_IMPORTED_MODULE_1__["SOUTH"]) {
    search.y += _constants__WEBPACK_IMPORTED_MODULE_2__["TILE_SIZE"];
    search.dy = _constants__WEBPACK_IMPORTED_MODULE_2__["HALF_TILE"];
  }
  if (direction === _constants_directions__WEBPACK_IMPORTED_MODULE_1__["EAST"]) {
    search.x += _constants__WEBPACK_IMPORTED_MODULE_2__["TILE_SIZE"];
    search.dx = _constants__WEBPACK_IMPORTED_MODULE_2__["HALF_TILE"];
  }
  return search;
}


/***/ }),

/***/ "./src/player.js":
/*!***********************!*\
  !*** ./src/player.js ***!
  \***********************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./constants */ "./src/constants/index.js");
/* harmony import */ var _constants_directions__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./constants/directions */ "./src/constants/directions.js");
/* harmony import */ var _assets_goblin_sprite_png__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./assets/goblin-sprite.png */ "./src/assets/goblin-sprite.png");
/* harmony import */ var _assets_goblin_sprite_png__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_assets_goblin_sprite_png__WEBPACK_IMPORTED_MODULE_2__);
/* globals Image */




const playerImage = new Image();
playerImage.src = _assets_goblin_sprite_png__WEBPACK_IMPORTED_MODULE_2___default.a;

/* harmony default export */ __webpack_exports__["default"] = ({
  x: _constants__WEBPACK_IMPORTED_MODULE_0__["TILE_SIZE"],
  y: _constants__WEBPACK_IMPORTED_MODULE_0__["TILE_SIZE"],
  direction: _constants_directions__WEBPACK_IMPORTED_MODULE_1__["SOUTH"],
  dx: 1 * _constants__WEBPACK_IMPORTED_MODULE_0__["TILE_SIZE"] - 1,
  dy: 1 * _constants__WEBPACK_IMPORTED_MODULE_0__["TILE_SIZE"] - 1,
  hitbox: 'circle',
  sprite: {
    asset: playerImage,
    images: {
      [_constants_directions__WEBPACK_IMPORTED_MODULE_1__["NORTH"]]: { x: 0, y: 0 },
      [_constants_directions__WEBPACK_IMPORTED_MODULE_1__["EAST"]]: { x: 30, y: 0 },
      [_constants_directions__WEBPACK_IMPORTED_MODULE_1__["SOUTH"]]: { x: 60, y: 0 },
      [_constants_directions__WEBPACK_IMPORTED_MODULE_1__["WEST"]]: { x: 90, y: 0 }
    }
  }
});


/***/ })

/******/ });
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vc3JjL2Fzc2V0cy9jaGVzdC1zcHJpdGUucG5nIiwid2VicGFjazovLy8uL3NyYy9hc3NldHMvZ29ibGluLXNwcml0ZS5wbmciLCJ3ZWJwYWNrOi8vLy4vc3JjL2Fzc2V0cy9nb2JsaW5vLXRpbGVzLnBuZyIsIndlYnBhY2s6Ly8vLi9zcmMvYXNzZXRzL21hcC5wbmciLCJ3ZWJwYWNrOi8vLy4vc3JjL2NvbnN0YW50cy9kaXJlY3Rpb25zLmpzIiwid2VicGFjazovLy8uL3NyYy9jb25zdGFudHMvZW50aXRpZXMuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2NvbnN0YW50cy9pbmRleC5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvY29uc3RhbnRzL3VzZXItc2V0dGluZ3MuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2RlYnVnLXRvb2xzLmpzIiwid2VicGFjazovLy8uL3NyYy9lbnRpdHkuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2d1aS5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvaW5kZXguanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2tleWJvYXJkLWNvbnRyb2xsZXIuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL21hcC9pbmRleC5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvbWFwL21hcC1sb2FkZXIuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL21hcC90aWxlc2V0LmpzIiwid2VicGFjazovLy8uL3NyYy9wbGF5ZXItY29udHJvbHMuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3BsYXllci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQUc7O0FBRUg7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxjQUFNO0FBQ047QUFDQTtBQUNBLGNBQU07QUFDTjtBQUNBO0FBQ0EsY0FBTTtBQUNOO0FBQ0E7QUFDQTtBQUNBLGVBQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxZQUFJO0FBQ0o7O0FBRUE7QUFDQSxzREFBOEM7QUFDOUM7QUFDQTtBQUNBLG9DQUE0QjtBQUM1QixxQ0FBNkI7QUFDN0IseUNBQWlDOztBQUVqQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxjQUFNO0FBQ047QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxjQUFNO0FBQ047QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFLOztBQUVMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxxQ0FBNkI7QUFDN0IscUNBQTZCO0FBQzdCO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDZCQUFxQixnQkFBZ0I7QUFDckM7QUFDQTtBQUNBLGFBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQSw2QkFBcUIsZ0JBQWdCO0FBQ3JDO0FBQ0E7QUFDQSxhQUFLO0FBQ0w7QUFDQTtBQUNBLGFBQUs7QUFDTDtBQUNBO0FBQ0EsYUFBSztBQUNMO0FBQ0E7QUFDQTtBQUNBLGFBQUs7O0FBRUw7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBSztBQUNMO0FBQ0E7QUFDQSxhQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0EsYUFBSzs7QUFFTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsMEJBQWtCLDhCQUE4QjtBQUNoRDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsWUFBSTtBQUNKOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsWUFBSTtBQUNKO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsY0FBTTtBQUNOO0FBQ0E7QUFDQTtBQUNBLGVBQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBLFlBQUk7QUFDSjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsNEJBQW9CLDJCQUEyQjtBQUMvQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZUFBTztBQUNQO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSwyQkFBbUIsY0FBYztBQUNqQztBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsY0FBTTtBQUNOO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLHNCQUFjLDRCQUE0QjtBQUMxQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsY0FBTTtBQUNOOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFlBQUk7O0FBRUo7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQSx1QkFBZSw0QkFB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LHFFQUFlLGNBQWM7QUFDN0Isc0VBQWdCLGNBQWM7QUFDOUIscUVBQWU7QUFDZjtBQUNBO0FBQ0EiLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VzQ29udGVudCI6WyIgXHRmdW5jdGlvbiBob3REaXNwb3NlQ2h1bmsoY2h1bmtJZCkge1xuIFx0XHRkZWxldGUgaW5zdGFsbGVkQ2h1bmtzW2NodW5rSWRdO1xuIFx0fVxuIFx0dmFyIHBhcmVudEhvdFVwZGF0ZUNhbGxiYWNrID0gd2luZG93W1wid2VicGFja0hvdFVwZGF0ZVwiXTtcbiBcdHdpbmRvd1tcIndlYnBhY2tIb3RVcGRhdGVcIl0gPSAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tdW51c2VkLXZhcnNcbiBcdGZ1bmN0aW9uIHdlYnBhY2tIb3RVcGRhdGVDYWxsYmFjayhjaHVua0lkLCBtb3JlTW9kdWxlcykge1xuIFx0XHRob3RBZGRVcGRhdGVDaHVuayhjaHVua0lkLCBtb3JlTW9kdWxlcyk7XG4gXHRcdGlmIChwYXJlbnRIb3RVcGRhdGVDYWxsYmFjaykgcGFyZW50SG90VXBkYXRlQ2FsbGJhY2soY2h1bmtJZCwgbW9yZU1vZHVsZXMpO1xuIFx0fSA7XG5cbiBcdC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby11bnVzZWQtdmFyc1xuIFx0ZnVuY3Rpb24gaG90RG93bmxvYWRVcGRhdGVDaHVuayhjaHVua0lkKSB7XG4gXHRcdHZhciBoZWFkID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoXCJoZWFkXCIpWzBdO1xuIFx0XHR2YXIgc2NyaXB0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInNjcmlwdFwiKTtcbiBcdFx0c2NyaXB0LmNoYXJzZXQgPSBcInV0Zi04XCI7XG4gXHRcdHNjcmlwdC5zcmMgPSBfX3dlYnBhY2tfcmVxdWlyZV9fLnAgKyBcIlwiICsgY2h1bmtJZCArIFwiLlwiICsgaG90Q3VycmVudEhhc2ggKyBcIi5ob3QtdXBkYXRlLmpzXCI7XG4gXHRcdDtcbiBcdFx0aGVhZC5hcHBlbmRDaGlsZChzY3JpcHQpO1xuIFx0fVxuXG4gXHQvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tdW51c2VkLXZhcnNcbiBcdGZ1bmN0aW9uIGhvdERvd25sb2FkTWFuaWZlc3QocmVxdWVzdFRpbWVvdXQpIHtcbiBcdFx0cmVxdWVzdFRpbWVvdXQgPSByZXF1ZXN0VGltZW91dCB8fCAxMDAwMDtcbiBcdFx0cmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCkge1xuIFx0XHRcdGlmICh0eXBlb2YgWE1MSHR0cFJlcXVlc3QgPT09IFwidW5kZWZpbmVkXCIpXG4gXHRcdFx0XHRyZXR1cm4gcmVqZWN0KG5ldyBFcnJvcihcIk5vIGJyb3dzZXIgc3VwcG9ydFwiKSk7XG4gXHRcdFx0dHJ5IHtcbiBcdFx0XHRcdHZhciByZXF1ZXN0ID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XG4gXHRcdFx0XHR2YXIgcmVxdWVzdFBhdGggPSBfX3dlYnBhY2tfcmVxdWlyZV9fLnAgKyBcIlwiICsgaG90Q3VycmVudEhhc2ggKyBcIi5ob3QtdXBkYXRlLmpzb25cIjtcbiBcdFx0XHRcdHJlcXVlc3Qub3BlbihcIkdFVFwiLCByZXF1ZXN0UGF0aCwgdHJ1ZSk7XG4gXHRcdFx0XHRyZXF1ZXN0LnRpbWVvdXQgPSByZXF1ZXN0VGltZW91dDtcbiBcdFx0XHRcdHJlcXVlc3Quc2VuZChudWxsKTtcbiBcdFx0XHR9IGNhdGNoIChlcnIpIHtcbiBcdFx0XHRcdHJldHVybiByZWplY3QoZXJyKTtcbiBcdFx0XHR9XG4gXHRcdFx0cmVxdWVzdC5vbnJlYWR5c3RhdGVjaGFuZ2UgPSBmdW5jdGlvbigpIHtcbiBcdFx0XHRcdGlmIChyZXF1ZXN0LnJlYWR5U3RhdGUgIT09IDQpIHJldHVybjtcbiBcdFx0XHRcdGlmIChyZXF1ZXN0LnN0YXR1cyA9PT0gMCkge1xuIFx0XHRcdFx0XHQvLyB0aW1lb3V0XG4gXHRcdFx0XHRcdHJlamVjdChcbiBcdFx0XHRcdFx0XHRuZXcgRXJyb3IoXCJNYW5pZmVzdCByZXF1ZXN0IHRvIFwiICsgcmVxdWVzdFBhdGggKyBcIiB0aW1lZCBvdXQuXCIpXG4gXHRcdFx0XHRcdCk7XG4gXHRcdFx0XHR9IGVsc2UgaWYgKHJlcXVlc3Quc3RhdHVzID09PSA0MDQpIHtcbiBcdFx0XHRcdFx0Ly8gbm8gdXBkYXRlIGF2YWlsYWJsZVxuIFx0XHRcdFx0XHRyZXNvbHZlKCk7XG4gXHRcdFx0XHR9IGVsc2UgaWYgKHJlcXVlc3Quc3RhdHVzICE9PSAyMDAgJiYgcmVxdWVzdC5zdGF0dXMgIT09IDMwNCkge1xuIFx0XHRcdFx0XHQvLyBvdGhlciBmYWlsdXJlXG4gXHRcdFx0XHRcdHJlamVjdChuZXcgRXJyb3IoXCJNYW5pZmVzdCByZXF1ZXN0IHRvIFwiICsgcmVxdWVzdFBhdGggKyBcIiBmYWlsZWQuXCIpKTtcbiBcdFx0XHRcdH0gZWxzZSB7XG4gXHRcdFx0XHRcdC8vIHN1Y2Nlc3NcbiBcdFx0XHRcdFx0dHJ5IHtcbiBcdFx0XHRcdFx0XHR2YXIgdXBkYXRlID0gSlNPTi5wYXJzZShyZXF1ZXN0LnJlc3BvbnNlVGV4dCk7XG4gXHRcdFx0XHRcdH0gY2F0Y2ggKGUpIHtcbiBcdFx0XHRcdFx0XHRyZWplY3QoZSk7XG4gXHRcdFx0XHRcdFx0cmV0dXJuO1xuIFx0XHRcdFx0XHR9XG4gXHRcdFx0XHRcdHJlc29sdmUodXBkYXRlKTtcbiBcdFx0XHRcdH1cbiBcdFx0XHR9O1xuIFx0XHR9KTtcbiBcdH1cblxuIFx0dmFyIGhvdEFwcGx5T25VcGRhdGUgPSB0cnVlO1xuIFx0dmFyIGhvdEN1cnJlbnRIYXNoID0gXCJkNGZlMGYzOWM5MDE4Y2Y4YzNhOFwiOyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLXVudXNlZC12YXJzXG4gXHR2YXIgaG90UmVxdWVzdFRpbWVvdXQgPSAxMDAwMDtcbiBcdHZhciBob3RDdXJyZW50TW9kdWxlRGF0YSA9IHt9O1xuIFx0dmFyIGhvdEN1cnJlbnRDaGlsZE1vZHVsZTsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby11bnVzZWQtdmFyc1xuIFx0dmFyIGhvdEN1cnJlbnRQYXJlbnRzID0gW107IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tdW51c2VkLXZhcnNcbiBcdHZhciBob3RDdXJyZW50UGFyZW50c1RlbXAgPSBbXTsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby11bnVzZWQtdmFyc1xuXG4gXHQvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tdW51c2VkLXZhcnNcbiBcdGZ1bmN0aW9uIGhvdENyZWF0ZVJlcXVpcmUobW9kdWxlSWQpIHtcbiBcdFx0dmFyIG1lID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF07XG4gXHRcdGlmICghbWUpIHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fO1xuIFx0XHR2YXIgZm4gPSBmdW5jdGlvbihyZXF1ZXN0KSB7XG4gXHRcdFx0aWYgKG1lLmhvdC5hY3RpdmUpIHtcbiBcdFx0XHRcdGlmIChpbnN0YWxsZWRNb2R1bGVzW3JlcXVlc3RdKSB7XG4gXHRcdFx0XHRcdGlmICghaW5zdGFsbGVkTW9kdWxlc1tyZXF1ZXN0XS5wYXJlbnRzLmluY2x1ZGVzKG1vZHVsZUlkKSlcbiBcdFx0XHRcdFx0XHRpbnN0YWxsZWRNb2R1bGVzW3JlcXVlc3RdLnBhcmVudHMucHVzaChtb2R1bGVJZCk7XG4gXHRcdFx0XHR9IGVsc2Uge1xuIFx0XHRcdFx0XHRob3RDdXJyZW50UGFyZW50cyA9IFttb2R1bGVJZF07XG4gXHRcdFx0XHRcdGhvdEN1cnJlbnRDaGlsZE1vZHVsZSA9IHJlcXVlc3Q7XG4gXHRcdFx0XHR9XG4gXHRcdFx0XHRpZiAoIW1lLmNoaWxkcmVuLmluY2x1ZGVzKHJlcXVlc3QpKSBtZS5jaGlsZHJlbi5wdXNoKHJlcXVlc3QpO1xuIFx0XHRcdH0gZWxzZSB7XG4gXHRcdFx0XHRjb25zb2xlLndhcm4oXG4gXHRcdFx0XHRcdFwiW0hNUl0gdW5leHBlY3RlZCByZXF1aXJlKFwiICtcbiBcdFx0XHRcdFx0XHRyZXF1ZXN0ICtcbiBcdFx0XHRcdFx0XHRcIikgZnJvbSBkaXNwb3NlZCBtb2R1bGUgXCIgK1xuIFx0XHRcdFx0XHRcdG1vZHVsZUlkXG4gXHRcdFx0XHQpO1xuIFx0XHRcdFx0aG90Q3VycmVudFBhcmVudHMgPSBbXTtcbiBcdFx0XHR9XG4gXHRcdFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18ocmVxdWVzdCk7XG4gXHRcdH07XG4gXHRcdHZhciBPYmplY3RGYWN0b3J5ID0gZnVuY3Rpb24gT2JqZWN0RmFjdG9yeShuYW1lKSB7XG4gXHRcdFx0cmV0dXJuIHtcbiBcdFx0XHRcdGNvbmZpZ3VyYWJsZTogdHJ1ZSxcbiBcdFx0XHRcdGVudW1lcmFibGU6IHRydWUsXG4gXHRcdFx0XHRnZXQ6IGZ1bmN0aW9uKCkge1xuIFx0XHRcdFx0XHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfX1tuYW1lXTtcbiBcdFx0XHRcdH0sXG4gXHRcdFx0XHRzZXQ6IGZ1bmN0aW9uKHZhbHVlKSB7XG4gXHRcdFx0XHRcdF9fd2VicGFja19yZXF1aXJlX19bbmFtZV0gPSB2YWx1ZTtcbiBcdFx0XHRcdH1cbiBcdFx0XHR9O1xuIFx0XHR9O1xuIFx0XHRmb3IgKHZhciBuYW1lIGluIF9fd2VicGFja19yZXF1aXJlX18pIHtcbiBcdFx0XHRpZiAoXG4gXHRcdFx0XHRPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoX193ZWJwYWNrX3JlcXVpcmVfXywgbmFtZSkgJiZcbiBcdFx0XHRcdG5hbWUgIT09IFwiZVwiXG4gXHRcdFx0KSB7XG4gXHRcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZm4sIG5hbWUsIE9iamVjdEZhY3RvcnkobmFtZSkpO1xuIFx0XHRcdH1cbiBcdFx0fVxuIFx0XHRmbi5lID0gZnVuY3Rpb24oY2h1bmtJZCkge1xuIFx0XHRcdGlmIChob3RTdGF0dXMgPT09IFwicmVhZHlcIikgaG90U2V0U3RhdHVzKFwicHJlcGFyZVwiKTtcbiBcdFx0XHRob3RDaHVua3NMb2FkaW5nKys7XG4gXHRcdFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18uZShjaHVua0lkKS50aGVuKGZpbmlzaENodW5rTG9hZGluZywgZnVuY3Rpb24oZXJyKSB7XG4gXHRcdFx0XHRmaW5pc2hDaHVua0xvYWRpbmcoKTtcbiBcdFx0XHRcdHRocm93IGVycjtcbiBcdFx0XHR9KTtcblxuIFx0XHRcdGZ1bmN0aW9uIGZpbmlzaENodW5rTG9hZGluZygpIHtcbiBcdFx0XHRcdGhvdENodW5rc0xvYWRpbmctLTtcbiBcdFx0XHRcdGlmIChob3RTdGF0dXMgPT09IFwicHJlcGFyZVwiKSB7XG4gXHRcdFx0XHRcdGlmICghaG90V2FpdGluZ0ZpbGVzTWFwW2NodW5rSWRdKSB7XG4gXHRcdFx0XHRcdFx0aG90RW5zdXJlVXBkYXRlQ2h1bmsoY2h1bmtJZCk7XG4gXHRcdFx0XHRcdH1cbiBcdFx0XHRcdFx0aWYgKGhvdENodW5rc0xvYWRpbmcgPT09IDAgJiYgaG90V2FpdGluZ0ZpbGVzID09PSAwKSB7XG4gXHRcdFx0XHRcdFx0aG90VXBkYXRlRG93bmxvYWRlZCgpO1xuIFx0XHRcdFx0XHR9XG4gXHRcdFx0XHR9XG4gXHRcdFx0fVxuIFx0XHR9O1xuIFx0XHRyZXR1cm4gZm47XG4gXHR9XG5cbiBcdC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby11bnVzZWQtdmFyc1xuIFx0ZnVuY3Rpb24gaG90Q3JlYXRlTW9kdWxlKG1vZHVsZUlkKSB7XG4gXHRcdHZhciBob3QgPSB7XG4gXHRcdFx0Ly8gcHJpdmF0ZSBzdHVmZlxuIFx0XHRcdF9hY2NlcHRlZERlcGVuZGVuY2llczoge30sXG4gXHRcdFx0X2RlY2xpbmVkRGVwZW5kZW5jaWVzOiB7fSxcbiBcdFx0XHRfc2VsZkFjY2VwdGVkOiBmYWxzZSxcbiBcdFx0XHRfc2VsZkRlY2xpbmVkOiBmYWxzZSxcbiBcdFx0XHRfZGlzcG9zZUhhbmRsZXJzOiBbXSxcbiBcdFx0XHRfbWFpbjogaG90Q3VycmVudENoaWxkTW9kdWxlICE9PSBtb2R1bGVJZCxcblxuIFx0XHRcdC8vIE1vZHVsZSBBUElcbiBcdFx0XHRhY3RpdmU6IHRydWUsXG4gXHRcdFx0YWNjZXB0OiBmdW5jdGlvbihkZXAsIGNhbGxiYWNrKSB7XG4gXHRcdFx0XHRpZiAodHlwZW9mIGRlcCA9PT0gXCJ1bmRlZmluZWRcIikgaG90Ll9zZWxmQWNjZXB0ZWQgPSB0cnVlO1xuIFx0XHRcdFx0ZWxzZSBpZiAodHlwZW9mIGRlcCA9PT0gXCJmdW5jdGlvblwiKSBob3QuX3NlbGZBY2NlcHRlZCA9IGRlcDtcbiBcdFx0XHRcdGVsc2UgaWYgKHR5cGVvZiBkZXAgPT09IFwib2JqZWN0XCIpXG4gXHRcdFx0XHRcdGZvciAodmFyIGkgPSAwOyBpIDwgZGVwLmxlbmd0aDsgaSsrKVxuIFx0XHRcdFx0XHRcdGhvdC5fYWNjZXB0ZWREZXBlbmRlbmNpZXNbZGVwW2ldXSA9IGNhbGxiYWNrIHx8IGZ1bmN0aW9uKCkge307XG4gXHRcdFx0XHRlbHNlIGhvdC5fYWNjZXB0ZWREZXBlbmRlbmNpZXNbZGVwXSA9IGNhbGxiYWNrIHx8IGZ1bmN0aW9uKCkge307XG4gXHRcdFx0fSxcbiBcdFx0XHRkZWNsaW5lOiBmdW5jdGlvbihkZXApIHtcbiBcdFx0XHRcdGlmICh0eXBlb2YgZGVwID09PSBcInVuZGVmaW5lZFwiKSBob3QuX3NlbGZEZWNsaW5lZCA9IHRydWU7XG4gXHRcdFx0XHRlbHNlIGlmICh0eXBlb2YgZGVwID09PSBcIm9iamVjdFwiKVxuIFx0XHRcdFx0XHRmb3IgKHZhciBpID0gMDsgaSA8IGRlcC5sZW5ndGg7IGkrKylcbiBcdFx0XHRcdFx0XHRob3QuX2RlY2xpbmVkRGVwZW5kZW5jaWVzW2RlcFtpXV0gPSB0cnVlO1xuIFx0XHRcdFx0ZWxzZSBob3QuX2RlY2xpbmVkRGVwZW5kZW5jaWVzW2RlcF0gPSB0cnVlO1xuIFx0XHRcdH0sXG4gXHRcdFx0ZGlzcG9zZTogZnVuY3Rpb24oY2FsbGJhY2spIHtcbiBcdFx0XHRcdGhvdC5fZGlzcG9zZUhhbmRsZXJzLnB1c2goY2FsbGJhY2spO1xuIFx0XHRcdH0sXG4gXHRcdFx0YWRkRGlzcG9zZUhhbmRsZXI6IGZ1bmN0aW9uKGNhbGxiYWNrKSB7XG4gXHRcdFx0XHRob3QuX2Rpc3Bvc2VIYW5kbGVycy5wdXNoKGNhbGxiYWNrKTtcbiBcdFx0XHR9LFxuIFx0XHRcdHJlbW92ZURpc3Bvc2VIYW5kbGVyOiBmdW5jdGlvbihjYWxsYmFjaykge1xuIFx0XHRcdFx0dmFyIGlkeCA9IGhvdC5fZGlzcG9zZUhhbmRsZXJzLmluZGV4T2YoY2FsbGJhY2spO1xuIFx0XHRcdFx0aWYgKGlkeCA+PSAwKSBob3QuX2Rpc3Bvc2VIYW5kbGVycy5zcGxpY2UoaWR4LCAxKTtcbiBcdFx0XHR9LFxuXG4gXHRcdFx0Ly8gTWFuYWdlbWVudCBBUElcbiBcdFx0XHRjaGVjazogaG90Q2hlY2ssXG4gXHRcdFx0YXBwbHk6IGhvdEFwcGx5LFxuIFx0XHRcdHN0YXR1czogZnVuY3Rpb24obCkge1xuIFx0XHRcdFx0aWYgKCFsKSByZXR1cm4gaG90U3RhdHVzO1xuIFx0XHRcdFx0aG90U3RhdHVzSGFuZGxlcnMucHVzaChsKTtcbiBcdFx0XHR9LFxuIFx0XHRcdGFkZFN0YXR1c0hhbmRsZXI6IGZ1bmN0aW9uKGwpIHtcbiBcdFx0XHRcdGhvdFN0YXR1c0hhbmRsZXJzLnB1c2gobCk7XG4gXHRcdFx0fSxcbiBcdFx0XHRyZW1vdmVTdGF0dXNIYW5kbGVyOiBmdW5jdGlvbihsKSB7XG4gXHRcdFx0XHR2YXIgaWR4ID0gaG90U3RhdHVzSGFuZGxlcnMuaW5kZXhPZihsKTtcbiBcdFx0XHRcdGlmIChpZHggPj0gMCkgaG90U3RhdHVzSGFuZGxlcnMuc3BsaWNlKGlkeCwgMSk7XG4gXHRcdFx0fSxcblxuIFx0XHRcdC8vaW5oZXJpdCBmcm9tIHByZXZpb3VzIGRpc3Bvc2UgY2FsbFxuIFx0XHRcdGRhdGE6IGhvdEN1cnJlbnRNb2R1bGVEYXRhW21vZHVsZUlkXVxuIFx0XHR9O1xuIFx0XHRob3RDdXJyZW50Q2hpbGRNb2R1bGUgPSB1bmRlZmluZWQ7XG4gXHRcdHJldHVybiBob3Q7XG4gXHR9XG5cbiBcdHZhciBob3RTdGF0dXNIYW5kbGVycyA9IFtdO1xuIFx0dmFyIGhvdFN0YXR1cyA9IFwiaWRsZVwiO1xuXG4gXHRmdW5jdGlvbiBob3RTZXRTdGF0dXMobmV3U3RhdHVzKSB7XG4gXHRcdGhvdFN0YXR1cyA9IG5ld1N0YXR1cztcbiBcdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCBob3RTdGF0dXNIYW5kbGVycy5sZW5ndGg7IGkrKylcbiBcdFx0XHRob3RTdGF0dXNIYW5kbGVyc1tpXS5jYWxsKG51bGwsIG5ld1N0YXR1cyk7XG4gXHR9XG5cbiBcdC8vIHdoaWxlIGRvd25sb2FkaW5nXG4gXHR2YXIgaG90V2FpdGluZ0ZpbGVzID0gMDtcbiBcdHZhciBob3RDaHVua3NMb2FkaW5nID0gMDtcbiBcdHZhciBob3RXYWl0aW5nRmlsZXNNYXAgPSB7fTtcbiBcdHZhciBob3RSZXF1ZXN0ZWRGaWxlc01hcCA9IHt9O1xuIFx0dmFyIGhvdEF2YWlsYWJsZUZpbGVzTWFwID0ge307XG4gXHR2YXIgaG90RGVmZXJyZWQ7XG5cbiBcdC8vIFRoZSB1cGRhdGUgaW5mb1xuIFx0dmFyIGhvdFVwZGF0ZSwgaG90VXBkYXRlTmV3SGFzaDtcblxuIFx0ZnVuY3Rpb24gdG9Nb2R1bGVJZChpZCkge1xuIFx0XHR2YXIgaXNOdW1iZXIgPSAraWQgKyBcIlwiID09PSBpZDtcbiBcdFx0cmV0dXJuIGlzTnVtYmVyID8gK2lkIDogaWQ7XG4gXHR9XG5cbiBcdGZ1bmN0aW9uIGhvdENoZWNrKGFwcGx5KSB7XG4gXHRcdGlmIChob3RTdGF0dXMgIT09IFwiaWRsZVwiKVxuIFx0XHRcdHRocm93IG5ldyBFcnJvcihcImNoZWNrKCkgaXMgb25seSBhbGxvd2VkIGluIGlkbGUgc3RhdHVzXCIpO1xuIFx0XHRob3RBcHBseU9uVXBkYXRlID0gYXBwbHk7XG4gXHRcdGhvdFNldFN0YXR1cyhcImNoZWNrXCIpO1xuIFx0XHRyZXR1cm4gaG90RG93bmxvYWRNYW5pZmVzdChob3RSZXF1ZXN0VGltZW91dCkudGhlbihmdW5jdGlvbih1cGRhdGUpIHtcbiBcdFx0XHRpZiAoIXVwZGF0ZSkge1xuIFx0XHRcdFx0aG90U2V0U3RhdHVzKFwiaWRsZVwiKTtcbiBcdFx0XHRcdHJldHVybiBudWxsO1xuIFx0XHRcdH1cbiBcdFx0XHRob3RSZXF1ZXN0ZWRGaWxlc01hcCA9IHt9O1xuIFx0XHRcdGhvdFdhaXRpbmdGaWxlc01hcCA9IHt9O1xuIFx0XHRcdGhvdEF2YWlsYWJsZUZpbGVzTWFwID0gdXBkYXRlLmM7XG4gXHRcdFx0aG90VXBkYXRlTmV3SGFzaCA9IHVwZGF0ZS5oO1xuXG4gXHRcdFx0aG90U2V0U3RhdHVzKFwicHJlcGFyZVwiKTtcbiBcdFx0XHR2YXIgcHJvbWlzZSA9IG5ldyBQcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCkge1xuIFx0XHRcdFx0aG90RGVmZXJyZWQgPSB7XG4gXHRcdFx0XHRcdHJlc29sdmU6IHJlc29sdmUsXG4gXHRcdFx0XHRcdHJlamVjdDogcmVqZWN0XG4gXHRcdFx0XHR9O1xuIFx0XHRcdH0pO1xuIFx0XHRcdGhvdFVwZGF0ZSA9IHt9O1xuIFx0XHRcdHZhciBjaHVua0lkID0gXCJtYWluXCI7XG4gXHRcdFx0e1xuIFx0XHRcdFx0Ly8gZXNsaW50LWRpc2FibGUtbGluZSBuby1sb25lLWJsb2Nrc1xuIFx0XHRcdFx0LypnbG9iYWxzIGNodW5rSWQgKi9cbiBcdFx0XHRcdGhvdEVuc3VyZVVwZGF0ZUNodW5rKGNodW5rSWQpO1xuIFx0XHRcdH1cbiBcdFx0XHRpZiAoXG4gXHRcdFx0XHRob3RTdGF0dXMgPT09IFwicHJlcGFyZVwiICYmXG4gXHRcdFx0XHRob3RDaHVua3NMb2FkaW5nID09PSAwICYmXG4gXHRcdFx0XHRob3RXYWl0aW5nRmlsZXMgPT09IDBcbiBcdFx0XHQpIHtcbiBcdFx0XHRcdGhvdFVwZGF0ZURvd25sb2FkZWQoKTtcbiBcdFx0XHR9XG4gXHRcdFx0cmV0dXJuIHByb21pc2U7XG4gXHRcdH0pO1xuIFx0fVxuXG4gXHQvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tdW51c2VkLXZhcnNcbiBcdGZ1bmN0aW9uIGhvdEFkZFVwZGF0ZUNodW5rKGNodW5rSWQsIG1vcmVNb2R1bGVzKSB7XG4gXHRcdGlmICghaG90QXZhaWxhYmxlRmlsZXNNYXBbY2h1bmtJZF0gfHwgIWhvdFJlcXVlc3RlZEZpbGVzTWFwW2NodW5rSWRdKVxuIFx0XHRcdHJldHVybjtcbiBcdFx0aG90UmVxdWVzdGVkRmlsZXNNYXBbY2h1bmtJZF0gPSBmYWxzZTtcbiBcdFx0Zm9yICh2YXIgbW9kdWxlSWQgaW4gbW9yZU1vZHVsZXMpIHtcbiBcdFx0XHRpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG1vcmVNb2R1bGVzLCBtb2R1bGVJZCkpIHtcbiBcdFx0XHRcdGhvdFVwZGF0ZVttb2R1bGVJZF0gPSBtb3JlTW9kdWxlc1ttb2R1bGVJZF07XG4gXHRcdFx0fVxuIFx0XHR9XG4gXHRcdGlmICgtLWhvdFdhaXRpbmdGaWxlcyA9PT0gMCAmJiBob3RDaHVua3NMb2FkaW5nID09PSAwKSB7XG4gXHRcdFx0aG90VXBkYXRlRG93bmxvYWRlZCgpO1xuIFx0XHR9XG4gXHR9XG5cbiBcdGZ1bmN0aW9uIGhvdEVuc3VyZVVwZGF0ZUNodW5rKGNodW5rSWQpIHtcbiBcdFx0aWYgKCFob3RBdmFpbGFibGVGaWxlc01hcFtjaHVua0lkXSkge1xuIFx0XHRcdGhvdFdhaXRpbmdGaWxlc01hcFtjaHVua0lkXSA9IHRydWU7XG4gXHRcdH0gZWxzZSB7XG4gXHRcdFx0aG90UmVxdWVzdGVkRmlsZXNNYXBbY2h1bmtJZF0gPSB0cnVlO1xuIFx0XHRcdGhvdFdhaXRpbmdGaWxlcysrO1xuIFx0XHRcdGhvdERvd25sb2FkVXBkYXRlQ2h1bmsoY2h1bmtJZCk7XG4gXHRcdH1cbiBcdH1cblxuIFx0ZnVuY3Rpb24gaG90VXBkYXRlRG93bmxvYWRlZCgpIHtcbiBcdFx0aG90U2V0U3RhdHVzKFwicmVhZHlcIik7XG4gXHRcdHZhciBkZWZlcnJlZCA9IGhvdERlZmVycmVkO1xuIFx0XHRob3REZWZlcnJlZCA9IG51bGw7XG4gXHRcdGlmICghZGVmZXJyZWQpIHJldHVybjtcbiBcdFx0aWYgKGhvdEFwcGx5T25VcGRhdGUpIHtcbiBcdFx0XHQvLyBXcmFwIGRlZmVycmVkIG9iamVjdCBpbiBQcm9taXNlIHRvIG1hcmsgaXQgYXMgYSB3ZWxsLWhhbmRsZWQgUHJvbWlzZSB0b1xuIFx0XHRcdC8vIGF2b2lkIHRyaWdnZXJpbmcgdW5jYXVnaHQgZXhjZXB0aW9uIHdhcm5pbmcgaW4gQ2hyb21lLlxuIFx0XHRcdC8vIFNlZSBodHRwczovL2J1Z3MuY2hyb21pdW0ub3JnL3AvY2hyb21pdW0vaXNzdWVzL2RldGFpbD9pZD00NjU2NjZcbiBcdFx0XHRQcm9taXNlLnJlc29sdmUoKVxuIFx0XHRcdFx0LnRoZW4oZnVuY3Rpb24oKSB7XG4gXHRcdFx0XHRcdHJldHVybiBob3RBcHBseShob3RBcHBseU9uVXBkYXRlKTtcbiBcdFx0XHRcdH0pXG4gXHRcdFx0XHQudGhlbihcbiBcdFx0XHRcdFx0ZnVuY3Rpb24ocmVzdWx0KSB7XG4gXHRcdFx0XHRcdFx0ZGVmZXJyZWQucmVzb2x2ZShyZXN1bHQpO1xuIFx0XHRcdFx0XHR9LFxuIFx0XHRcdFx0XHRmdW5jdGlvbihlcnIpIHtcbiBcdFx0XHRcdFx0XHRkZWZlcnJlZC5yZWplY3QoZXJyKTtcbiBcdFx0XHRcdFx0fVxuIFx0XHRcdFx0KTtcbiBcdFx0fSBlbHNlIHtcbiBcdFx0XHR2YXIgb3V0ZGF0ZWRNb2R1bGVzID0gW107XG4gXHRcdFx0Zm9yICh2YXIgaWQgaW4gaG90VXBkYXRlKSB7XG4gXHRcdFx0XHRpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKGhvdFVwZGF0ZSwgaWQpKSB7XG4gXHRcdFx0XHRcdG91dGRhdGVkTW9kdWxlcy5wdXNoKHRvTW9kdWxlSWQoaWQpKTtcbiBcdFx0XHRcdH1cbiBcdFx0XHR9XG4gXHRcdFx0ZGVmZXJyZWQucmVzb2x2ZShvdXRkYXRlZE1vZHVsZXMpO1xuIFx0XHR9XG4gXHR9XG5cbiBcdGZ1bmN0aW9uIGhvdEFwcGx5KG9wdGlvbnMpIHtcbiBcdFx0aWYgKGhvdFN0YXR1cyAhPT0gXCJyZWFkeVwiKVxuIFx0XHRcdHRocm93IG5ldyBFcnJvcihcImFwcGx5KCkgaXMgb25seSBhbGxvd2VkIGluIHJlYWR5IHN0YXR1c1wiKTtcbiBcdFx0b3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG5cbiBcdFx0dmFyIGNiO1xuIFx0XHR2YXIgaTtcbiBcdFx0dmFyIGo7XG4gXHRcdHZhciBtb2R1bGU7XG4gXHRcdHZhciBtb2R1bGVJZDtcblxuIFx0XHRmdW5jdGlvbiBnZXRBZmZlY3RlZFN0dWZmKHVwZGF0ZU1vZHVsZUlkKSB7XG4gXHRcdFx0dmFyIG91dGRhdGVkTW9kdWxlcyA9IFt1cGRhdGVNb2R1bGVJZF07XG4gXHRcdFx0dmFyIG91dGRhdGVkRGVwZW5kZW5jaWVzID0ge307XG5cbiBcdFx0XHR2YXIgcXVldWUgPSBvdXRkYXRlZE1vZHVsZXMuc2xpY2UoKS5tYXAoZnVuY3Rpb24oaWQpIHtcbiBcdFx0XHRcdHJldHVybiB7XG4gXHRcdFx0XHRcdGNoYWluOiBbaWRdLFxuIFx0XHRcdFx0XHRpZDogaWRcbiBcdFx0XHRcdH07XG4gXHRcdFx0fSk7XG4gXHRcdFx0d2hpbGUgKHF1ZXVlLmxlbmd0aCA+IDApIHtcbiBcdFx0XHRcdHZhciBxdWV1ZUl0ZW0gPSBxdWV1ZS5wb3AoKTtcbiBcdFx0XHRcdHZhciBtb2R1bGVJZCA9IHF1ZXVlSXRlbS5pZDtcbiBcdFx0XHRcdHZhciBjaGFpbiA9IHF1ZXVlSXRlbS5jaGFpbjtcbiBcdFx0XHRcdG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdO1xuIFx0XHRcdFx0aWYgKCFtb2R1bGUgfHwgbW9kdWxlLmhvdC5fc2VsZkFjY2VwdGVkKSBjb250aW51ZTtcbiBcdFx0XHRcdGlmIChtb2R1bGUuaG90Ll9zZWxmRGVjbGluZWQpIHtcbiBcdFx0XHRcdFx0cmV0dXJuIHtcbiBcdFx0XHRcdFx0XHR0eXBlOiBcInNlbGYtZGVjbGluZWRcIixcbiBcdFx0XHRcdFx0XHRjaGFpbjogY2hhaW4sXG4gXHRcdFx0XHRcdFx0bW9kdWxlSWQ6IG1vZHVsZUlkXG4gXHRcdFx0XHRcdH07XG4gXHRcdFx0XHR9XG4gXHRcdFx0XHRpZiAobW9kdWxlLmhvdC5fbWFpbikge1xuIFx0XHRcdFx0XHRyZXR1cm4ge1xuIFx0XHRcdFx0XHRcdHR5cGU6IFwidW5hY2NlcHRlZFwiLFxuIFx0XHRcdFx0XHRcdGNoYWluOiBjaGFpbixcbiBcdFx0XHRcdFx0XHRtb2R1bGVJZDogbW9kdWxlSWRcbiBcdFx0XHRcdFx0fTtcbiBcdFx0XHRcdH1cbiBcdFx0XHRcdGZvciAodmFyIGkgPSAwOyBpIDwgbW9kdWxlLnBhcmVudHMubGVuZ3RoOyBpKyspIHtcbiBcdFx0XHRcdFx0dmFyIHBhcmVudElkID0gbW9kdWxlLnBhcmVudHNbaV07XG4gXHRcdFx0XHRcdHZhciBwYXJlbnQgPSBpbnN0YWxsZWRNb2R1bGVzW3BhcmVudElkXTtcbiBcdFx0XHRcdFx0aWYgKCFwYXJlbnQpIGNvbnRpbnVlO1xuIFx0XHRcdFx0XHRpZiAocGFyZW50LmhvdC5fZGVjbGluZWREZXBlbmRlbmNpZXNbbW9kdWxlSWRdKSB7XG4gXHRcdFx0XHRcdFx0cmV0dXJuIHtcbiBcdFx0XHRcdFx0XHRcdHR5cGU6IFwiZGVjbGluZWRcIixcbiBcdFx0XHRcdFx0XHRcdGNoYWluOiBjaGFpbi5jb25jYXQoW3BhcmVudElkXSksXG4gXHRcdFx0XHRcdFx0XHRtb2R1bGVJZDogbW9kdWxlSWQsXG4gXHRcdFx0XHRcdFx0XHRwYXJlbnRJZDogcGFyZW50SWRcbiBcdFx0XHRcdFx0XHR9O1xuIFx0XHRcdFx0XHR9XG4gXHRcdFx0XHRcdGlmIChvdXRkYXRlZE1vZHVsZXMuaW5jbHVkZXMocGFyZW50SWQpKSBjb250aW51ZTtcbiBcdFx0XHRcdFx0aWYgKHBhcmVudC5ob3QuX2FjY2VwdGVkRGVwZW5kZW5jaWVzW21vZHVsZUlkXSkge1xuIFx0XHRcdFx0XHRcdGlmICghb3V0ZGF0ZWREZXBlbmRlbmNpZXNbcGFyZW50SWRdKVxuIFx0XHRcdFx0XHRcdFx0b3V0ZGF0ZWREZXBlbmRlbmNpZXNbcGFyZW50SWRdID0gW107XG4gXHRcdFx0XHRcdFx0YWRkQWxsVG9TZXQob3V0ZGF0ZWREZXBlbmRlbmNpZXNbcGFyZW50SWRdLCBbbW9kdWxlSWRdKTtcbiBcdFx0XHRcdFx0XHRjb250aW51ZTtcbiBcdFx0XHRcdFx0fVxuIFx0XHRcdFx0XHRkZWxldGUgb3V0ZGF0ZWREZXBlbmRlbmNpZXNbcGFyZW50SWRdO1xuIFx0XHRcdFx0XHRvdXRkYXRlZE1vZHVsZXMucHVzaChwYXJlbnRJZCk7XG4gXHRcdFx0XHRcdHF1ZXVlLnB1c2goe1xuIFx0XHRcdFx0XHRcdGNoYWluOiBjaGFpbi5jb25jYXQoW3BhcmVudElkXSksXG4gXHRcdFx0XHRcdFx0aWQ6IHBhcmVudElkXG4gXHRcdFx0XHRcdH0pO1xuIFx0XHRcdFx0fVxuIFx0XHRcdH1cblxuIFx0XHRcdHJldHVybiB7XG4gXHRcdFx0XHR0eXBlOiBcImFjY2VwdGVkXCIsXG4gXHRcdFx0XHRtb2R1bGVJZDogdXBkYXRlTW9kdWxlSWQsXG4gXHRcdFx0XHRvdXRkYXRlZE1vZHVsZXM6IG91dGRhdGVkTW9kdWxlcyxcbiBcdFx0XHRcdG91dGRhdGVkRGVwZW5kZW5jaWVzOiBvdXRkYXRlZERlcGVuZGVuY2llc1xuIFx0XHRcdH07XG4gXHRcdH1cblxuIFx0XHRmdW5jdGlvbiBhZGRBbGxUb1NldChhLCBiKSB7XG4gXHRcdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCBiLmxlbmd0aDsgaSsrKSB7XG4gXHRcdFx0XHR2YXIgaXRlbSA9IGJbaV07XG4gXHRcdFx0XHRpZiAoIWEuaW5jbHVkZXMoaXRlbSkpIGEucHVzaChpdGVtKTtcbiBcdFx0XHR9XG4gXHRcdH1cblxuIFx0XHQvLyBhdCBiZWdpbiBhbGwgdXBkYXRlcyBtb2R1bGVzIGFyZSBvdXRkYXRlZFxuIFx0XHQvLyB0aGUgXCJvdXRkYXRlZFwiIHN0YXR1cyBjYW4gcHJvcGFnYXRlIHRvIHBhcmVudHMgaWYgdGhleSBkb24ndCBhY2NlcHQgdGhlIGNoaWxkcmVuXG4gXHRcdHZhciBvdXRkYXRlZERlcGVuZGVuY2llcyA9IHt9O1xuIFx0XHR2YXIgb3V0ZGF0ZWRNb2R1bGVzID0gW107XG4gXHRcdHZhciBhcHBsaWVkVXBkYXRlID0ge307XG5cbiBcdFx0dmFyIHdhcm5VbmV4cGVjdGVkUmVxdWlyZSA9IGZ1bmN0aW9uIHdhcm5VbmV4cGVjdGVkUmVxdWlyZSgpIHtcbiBcdFx0XHRjb25zb2xlLndhcm4oXG4gXHRcdFx0XHRcIltITVJdIHVuZXhwZWN0ZWQgcmVxdWlyZShcIiArIHJlc3VsdC5tb2R1bGVJZCArIFwiKSB0byBkaXNwb3NlZCBtb2R1bGVcIlxuIFx0XHRcdCk7XG4gXHRcdH07XG5cbiBcdFx0Zm9yICh2YXIgaWQgaW4gaG90VXBkYXRlKSB7XG4gXHRcdFx0aWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChob3RVcGRhdGUsIGlkKSkge1xuIFx0XHRcdFx0bW9kdWxlSWQgPSB0b01vZHVsZUlkKGlkKTtcbiBcdFx0XHRcdHZhciByZXN1bHQ7XG4gXHRcdFx0XHRpZiAoaG90VXBkYXRlW2lkXSkge1xuIFx0XHRcdFx0XHRyZXN1bHQgPSBnZXRBZmZlY3RlZFN0dWZmKG1vZHVsZUlkKTtcbiBcdFx0XHRcdH0gZWxzZSB7XG4gXHRcdFx0XHRcdHJlc3VsdCA9IHtcbiBcdFx0XHRcdFx0XHR0eXBlOiBcImRpc3Bvc2VkXCIsXG4gXHRcdFx0XHRcdFx0bW9kdWxlSWQ6IGlkXG4gXHRcdFx0XHRcdH07XG4gXHRcdFx0XHR9XG4gXHRcdFx0XHR2YXIgYWJvcnRFcnJvciA9IGZhbHNlO1xuIFx0XHRcdFx0dmFyIGRvQXBwbHkgPSBmYWxzZTtcbiBcdFx0XHRcdHZhciBkb0Rpc3Bvc2UgPSBmYWxzZTtcbiBcdFx0XHRcdHZhciBjaGFpbkluZm8gPSBcIlwiO1xuIFx0XHRcdFx0aWYgKHJlc3VsdC5jaGFpbikge1xuIFx0XHRcdFx0XHRjaGFpbkluZm8gPSBcIlxcblVwZGF0ZSBwcm9wYWdhdGlvbjogXCIgKyByZXN1bHQuY2hhaW4uam9pbihcIiAtPiBcIik7XG4gXHRcdFx0XHR9XG4gXHRcdFx0XHRzd2l0Y2ggKHJlc3VsdC50eXBlKSB7XG4gXHRcdFx0XHRcdGNhc2UgXCJzZWxmLWRlY2xpbmVkXCI6XG4gXHRcdFx0XHRcdFx0aWYgKG9wdGlvbnMub25EZWNsaW5lZCkgb3B0aW9ucy5vbkRlY2xpbmVkKHJlc3VsdCk7XG4gXHRcdFx0XHRcdFx0aWYgKCFvcHRpb25zLmlnbm9yZURlY2xpbmVkKVxuIFx0XHRcdFx0XHRcdFx0YWJvcnRFcnJvciA9IG5ldyBFcnJvcihcbiBcdFx0XHRcdFx0XHRcdFx0XCJBYm9ydGVkIGJlY2F1c2Ugb2Ygc2VsZiBkZWNsaW5lOiBcIiArXG4gXHRcdFx0XHRcdFx0XHRcdFx0cmVzdWx0Lm1vZHVsZUlkICtcbiBcdFx0XHRcdFx0XHRcdFx0XHRjaGFpbkluZm9cbiBcdFx0XHRcdFx0XHRcdCk7XG4gXHRcdFx0XHRcdFx0YnJlYWs7XG4gXHRcdFx0XHRcdGNhc2UgXCJkZWNsaW5lZFwiOlxuIFx0XHRcdFx0XHRcdGlmIChvcHRpb25zLm9uRGVjbGluZWQpIG9wdGlvbnMub25EZWNsaW5lZChyZXN1bHQpO1xuIFx0XHRcdFx0XHRcdGlmICghb3B0aW9ucy5pZ25vcmVEZWNsaW5lZClcbiBcdFx0XHRcdFx0XHRcdGFib3J0RXJyb3IgPSBuZXcgRXJyb3IoXG4gXHRcdFx0XHRcdFx0XHRcdFwiQWJvcnRlZCBiZWNhdXNlIG9mIGRlY2xpbmVkIGRlcGVuZGVuY3k6IFwiICtcbiBcdFx0XHRcdFx0XHRcdFx0XHRyZXN1bHQubW9kdWxlSWQgK1xuIFx0XHRcdFx0XHRcdFx0XHRcdFwiIGluIFwiICtcbiBcdFx0XHRcdFx0XHRcdFx0XHRyZXN1bHQucGFyZW50SWQgK1xuIFx0XHRcdFx0XHRcdFx0XHRcdGNoYWluSW5mb1xuIFx0XHRcdFx0XHRcdFx0KTtcbiBcdFx0XHRcdFx0XHRicmVhaztcbiBcdFx0XHRcdFx0Y2FzZSBcInVuYWNjZXB0ZWRcIjpcbiBcdFx0XHRcdFx0XHRpZiAob3B0aW9ucy5vblVuYWNjZXB0ZWQpIG9wdGlvbnMub25VbmFjY2VwdGVkKHJlc3VsdCk7XG4gXHRcdFx0XHRcdFx0aWYgKCFvcHRpb25zLmlnbm9yZVVuYWNjZXB0ZWQpXG4gXHRcdFx0XHRcdFx0XHRhYm9ydEVycm9yID0gbmV3IEVycm9yKFxuIFx0XHRcdFx0XHRcdFx0XHRcIkFib3J0ZWQgYmVjYXVzZSBcIiArIG1vZHVsZUlkICsgXCIgaXMgbm90IGFjY2VwdGVkXCIgKyBjaGFpbkluZm9cbiBcdFx0XHRcdFx0XHRcdCk7XG4gXHRcdFx0XHRcdFx0YnJlYWs7XG4gXHRcdFx0XHRcdGNhc2UgXCJhY2NlcHRlZFwiOlxuIFx0XHRcdFx0XHRcdGlmIChvcHRpb25zLm9uQWNjZXB0ZWQpIG9wdGlvbnMub25BY2NlcHRlZChyZXN1bHQpO1xuIFx0XHRcdFx0XHRcdGRvQXBwbHkgPSB0cnVlO1xuIFx0XHRcdFx0XHRcdGJyZWFrO1xuIFx0XHRcdFx0XHRjYXNlIFwiZGlzcG9zZWRcIjpcbiBcdFx0XHRcdFx0XHRpZiAob3B0aW9ucy5vbkRpc3Bvc2VkKSBvcHRpb25zLm9uRGlzcG9zZWQocmVzdWx0KTtcbiBcdFx0XHRcdFx0XHRkb0Rpc3Bvc2UgPSB0cnVlO1xuIFx0XHRcdFx0XHRcdGJyZWFrO1xuIFx0XHRcdFx0XHRkZWZhdWx0OlxuIFx0XHRcdFx0XHRcdHRocm93IG5ldyBFcnJvcihcIlVuZXhjZXB0aW9uIHR5cGUgXCIgKyByZXN1bHQudHlwZSk7XG4gXHRcdFx0XHR9XG4gXHRcdFx0XHRpZiAoYWJvcnRFcnJvcikge1xuIFx0XHRcdFx0XHRob3RTZXRTdGF0dXMoXCJhYm9ydFwiKTtcbiBcdFx0XHRcdFx0cmV0dXJuIFByb21pc2UucmVqZWN0KGFib3J0RXJyb3IpO1xuIFx0XHRcdFx0fVxuIFx0XHRcdFx0aWYgKGRvQXBwbHkpIHtcbiBcdFx0XHRcdFx0YXBwbGllZFVwZGF0ZVttb2R1bGVJZF0gPSBob3RVcGRhdGVbbW9kdWxlSWRdO1xuIFx0XHRcdFx0XHRhZGRBbGxUb1NldChvdXRkYXRlZE1vZHVsZXMsIHJlc3VsdC5vdXRkYXRlZE1vZHVsZXMpO1xuIFx0XHRcdFx0XHRmb3IgKG1vZHVsZUlkIGluIHJlc3VsdC5vdXRkYXRlZERlcGVuZGVuY2llcykge1xuIFx0XHRcdFx0XHRcdGlmIChcbiBcdFx0XHRcdFx0XHRcdE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChcbiBcdFx0XHRcdFx0XHRcdFx0cmVzdWx0Lm91dGRhdGVkRGVwZW5kZW5jaWVzLFxuIFx0XHRcdFx0XHRcdFx0XHRtb2R1bGVJZFxuIFx0XHRcdFx0XHRcdFx0KVxuIFx0XHRcdFx0XHRcdCkge1xuIFx0XHRcdFx0XHRcdFx0aWYgKCFvdXRkYXRlZERlcGVuZGVuY2llc1ttb2R1bGVJZF0pXG4gXHRcdFx0XHRcdFx0XHRcdG91dGRhdGVkRGVwZW5kZW5jaWVzW21vZHVsZUlkXSA9IFtdO1xuIFx0XHRcdFx0XHRcdFx0YWRkQWxsVG9TZXQoXG4gXHRcdFx0XHRcdFx0XHRcdG91dGRhdGVkRGVwZW5kZW5jaWVzW21vZHVsZUlkXSxcbiBcdFx0XHRcdFx0XHRcdFx0cmVzdWx0Lm91dGRhdGVkRGVwZW5kZW5jaWVzW21vZHVsZUlkXVxuIFx0XHRcdFx0XHRcdFx0KTtcbiBcdFx0XHRcdFx0XHR9XG4gXHRcdFx0XHRcdH1cbiBcdFx0XHRcdH1cbiBcdFx0XHRcdGlmIChkb0Rpc3Bvc2UpIHtcbiBcdFx0XHRcdFx0YWRkQWxsVG9TZXQob3V0ZGF0ZWRNb2R1bGVzLCBbcmVzdWx0Lm1vZHVsZUlkXSk7XG4gXHRcdFx0XHRcdGFwcGxpZWRVcGRhdGVbbW9kdWxlSWRdID0gd2FyblVuZXhwZWN0ZWRSZXF1aXJlO1xuIFx0XHRcdFx0fVxuIFx0XHRcdH1cbiBcdFx0fVxuXG4gXHRcdC8vIFN0b3JlIHNlbGYgYWNjZXB0ZWQgb3V0ZGF0ZWQgbW9kdWxlcyB0byByZXF1aXJlIHRoZW0gbGF0ZXIgYnkgdGhlIG1vZHVsZSBzeXN0ZW1cbiBcdFx0dmFyIG91dGRhdGVkU2VsZkFjY2VwdGVkTW9kdWxlcyA9IFtdO1xuIFx0XHRmb3IgKGkgPSAwOyBpIDwgb3V0ZGF0ZWRNb2R1bGVzLmxlbmd0aDsgaSsrKSB7XG4gXHRcdFx0bW9kdWxlSWQgPSBvdXRkYXRlZE1vZHVsZXNbaV07XG4gXHRcdFx0aWYgKFxuIFx0XHRcdFx0aW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gJiZcbiBcdFx0XHRcdGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmhvdC5fc2VsZkFjY2VwdGVkXG4gXHRcdFx0KVxuIFx0XHRcdFx0b3V0ZGF0ZWRTZWxmQWNjZXB0ZWRNb2R1bGVzLnB1c2goe1xuIFx0XHRcdFx0XHRtb2R1bGU6IG1vZHVsZUlkLFxuIFx0XHRcdFx0XHRlcnJvckhhbmRsZXI6IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmhvdC5fc2VsZkFjY2VwdGVkXG4gXHRcdFx0XHR9KTtcbiBcdFx0fVxuXG4gXHRcdC8vIE5vdyBpbiBcImRpc3Bvc2VcIiBwaGFzZVxuIFx0XHRob3RTZXRTdGF0dXMoXCJkaXNwb3NlXCIpO1xuIFx0XHRPYmplY3Qua2V5cyhob3RBdmFpbGFibGVGaWxlc01hcCkuZm9yRWFjaChmdW5jdGlvbihjaHVua0lkKSB7XG4gXHRcdFx0aWYgKGhvdEF2YWlsYWJsZUZpbGVzTWFwW2NodW5rSWRdID09PSBmYWxzZSkge1xuIFx0XHRcdFx0aG90RGlzcG9zZUNodW5rKGNodW5rSWQpO1xuIFx0XHRcdH1cbiBcdFx0fSk7XG5cbiBcdFx0dmFyIGlkeDtcbiBcdFx0dmFyIHF1ZXVlID0gb3V0ZGF0ZWRNb2R1bGVzLnNsaWNlKCk7XG4gXHRcdHdoaWxlIChxdWV1ZS5sZW5ndGggPiAwKSB7XG4gXHRcdFx0bW9kdWxlSWQgPSBxdWV1ZS5wb3AoKTtcbiBcdFx0XHRtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXTtcbiBcdFx0XHRpZiAoIW1vZHVsZSkgY29udGludWU7XG5cbiBcdFx0XHR2YXIgZGF0YSA9IHt9O1xuXG4gXHRcdFx0Ly8gQ2FsbCBkaXNwb3NlIGhhbmRsZXJzXG4gXHRcdFx0dmFyIGRpc3Bvc2VIYW5kbGVycyA9IG1vZHVsZS5ob3QuX2Rpc3Bvc2VIYW5kbGVycztcbiBcdFx0XHRmb3IgKGogPSAwOyBqIDwgZGlzcG9zZUhhbmRsZXJzLmxlbmd0aDsgaisrKSB7XG4gXHRcdFx0XHRjYiA9IGRpc3Bvc2VIYW5kbGVyc1tqXTtcbiBcdFx0XHRcdGNiKGRhdGEpO1xuIFx0XHRcdH1cbiBcdFx0XHRob3RDdXJyZW50TW9kdWxlRGF0YVttb2R1bGVJZF0gPSBkYXRhO1xuXG4gXHRcdFx0Ly8gZGlzYWJsZSBtb2R1bGUgKHRoaXMgZGlzYWJsZXMgcmVxdWlyZXMgZnJvbSB0aGlzIG1vZHVsZSlcbiBcdFx0XHRtb2R1bGUuaG90LmFjdGl2ZSA9IGZhbHNlO1xuXG4gXHRcdFx0Ly8gcmVtb3ZlIG1vZHVsZSBmcm9tIGNhY2hlXG4gXHRcdFx0ZGVsZXRlIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdO1xuXG4gXHRcdFx0Ly8gd2hlbiBkaXNwb3NpbmcgdGhlcmUgaXMgbm8gbmVlZCB0byBjYWxsIGRpc3Bvc2UgaGFuZGxlclxuIFx0XHRcdGRlbGV0ZSBvdXRkYXRlZERlcGVuZGVuY2llc1ttb2R1bGVJZF07XG5cbiBcdFx0XHQvLyByZW1vdmUgXCJwYXJlbnRzXCIgcmVmZXJlbmNlcyBmcm9tIGFsbCBjaGlsZHJlblxuIFx0XHRcdGZvciAoaiA9IDA7IGogPCBtb2R1bGUuY2hpbGRyZW4ubGVuZ3RoOyBqKyspIHtcbiBcdFx0XHRcdHZhciBjaGlsZCA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlLmNoaWxkcmVuW2pdXTtcbiBcdFx0XHRcdGlmICghY2hpbGQpIGNvbnRpbnVlO1xuIFx0XHRcdFx0aWR4ID0gY2hpbGQucGFyZW50cy5pbmRleE9mKG1vZHVsZUlkKTtcbiBcdFx0XHRcdGlmIChpZHggPj0gMCkge1xuIFx0XHRcdFx0XHRjaGlsZC5wYXJlbnRzLnNwbGljZShpZHgsIDEpO1xuIFx0XHRcdFx0fVxuIFx0XHRcdH1cbiBcdFx0fVxuXG4gXHRcdC8vIHJlbW92ZSBvdXRkYXRlZCBkZXBlbmRlbmN5IGZyb20gbW9kdWxlIGNoaWxkcmVuXG4gXHRcdHZhciBkZXBlbmRlbmN5O1xuIFx0XHR2YXIgbW9kdWxlT3V0ZGF0ZWREZXBlbmRlbmNpZXM7XG4gXHRcdGZvciAobW9kdWxlSWQgaW4gb3V0ZGF0ZWREZXBlbmRlbmNpZXMpIHtcbiBcdFx0XHRpZiAoXG4gXHRcdFx0XHRPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob3V0ZGF0ZWREZXBlbmRlbmNpZXMsIG1vZHVsZUlkKVxuIFx0XHRcdCkge1xuIFx0XHRcdFx0bW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF07XG4gXHRcdFx0XHRpZiAobW9kdWxlKSB7XG4gXHRcdFx0XHRcdG1vZHVsZU91dGRhdGVkRGVwZW5kZW5jaWVzID0gb3V0ZGF0ZWREZXBlbmRlbmNpZXNbbW9kdWxlSWRdO1xuIFx0XHRcdFx0XHRmb3IgKGogPSAwOyBqIDwgbW9kdWxlT3V0ZGF0ZWREZXBlbmRlbmNpZXMubGVuZ3RoOyBqKyspIHtcbiBcdFx0XHRcdFx0XHRkZXBlbmRlbmN5ID0gbW9kdWxlT3V0ZGF0ZWREZXBlbmRlbmNpZXNbal07XG4gXHRcdFx0XHRcdFx0aWR4ID0gbW9kdWxlLmNoaWxkcmVuLmluZGV4T2YoZGVwZW5kZW5jeSk7XG4gXHRcdFx0XHRcdFx0aWYgKGlkeCA+PSAwKSBtb2R1bGUuY2hpbGRyZW4uc3BsaWNlKGlkeCwgMSk7XG4gXHRcdFx0XHRcdH1cbiBcdFx0XHRcdH1cbiBcdFx0XHR9XG4gXHRcdH1cblxuIFx0XHQvLyBOb3QgaW4gXCJhcHBseVwiIHBoYXNlXG4gXHRcdGhvdFNldFN0YXR1cyhcImFwcGx5XCIpO1xuXG4gXHRcdGhvdEN1cnJlbnRIYXNoID0gaG90VXBkYXRlTmV3SGFzaDtcblxuIFx0XHQvLyBpbnNlcnQgbmV3IGNvZGVcbiBcdFx0Zm9yIChtb2R1bGVJZCBpbiBhcHBsaWVkVXBkYXRlKSB7XG4gXHRcdFx0aWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChhcHBsaWVkVXBkYXRlLCBtb2R1bGVJZCkpIHtcbiBcdFx0XHRcdG1vZHVsZXNbbW9kdWxlSWRdID0gYXBwbGllZFVwZGF0ZVttb2R1bGVJZF07XG4gXHRcdFx0fVxuIFx0XHR9XG5cbiBcdFx0Ly8gY2FsbCBhY2NlcHQgaGFuZGxlcnNcbiBcdFx0dmFyIGVycm9yID0gbnVsbDtcbiBcdFx0Zm9yIChtb2R1bGVJZCBpbiBvdXRkYXRlZERlcGVuZGVuY2llcykge1xuIFx0XHRcdGlmIChcbiBcdFx0XHRcdE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvdXRkYXRlZERlcGVuZGVuY2llcywgbW9kdWxlSWQpXG4gXHRcdFx0KSB7XG4gXHRcdFx0XHRtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXTtcbiBcdFx0XHRcdGlmIChtb2R1bGUpIHtcbiBcdFx0XHRcdFx0bW9kdWxlT3V0ZGF0ZWREZXBlbmRlbmNpZXMgPSBvdXRkYXRlZERlcGVuZGVuY2llc1ttb2R1bGVJZF07XG4gXHRcdFx0XHRcdHZhciBjYWxsYmFja3MgPSBbXTtcbiBcdFx0XHRcdFx0Zm9yIChpID0gMDsgaSA8IG1vZHVsZU91dGRhdGVkRGVwZW5kZW5jaWVzLmxlbmd0aDsgaSsrKSB7XG4gXHRcdFx0XHRcdFx0ZGVwZW5kZW5jeSA9IG1vZHVsZU91dGRhdGVkRGVwZW5kZW5jaWVzW2ldO1xuIFx0XHRcdFx0XHRcdGNiID0gbW9kdWxlLmhvdC5fYWNjZXB0ZWREZXBlbmRlbmNpZXNbZGVwZW5kZW5jeV07XG4gXHRcdFx0XHRcdFx0aWYgKGNiKSB7XG4gXHRcdFx0XHRcdFx0XHRpZiAoY2FsbGJhY2tzLmluY2x1ZGVzKGNiKSkgY29udGludWU7XG4gXHRcdFx0XHRcdFx0XHRjYWxsYmFja3MucHVzaChjYik7XG4gXHRcdFx0XHRcdFx0fVxuIFx0XHRcdFx0XHR9XG4gXHRcdFx0XHRcdGZvciAoaSA9IDA7IGkgPCBjYWxsYmFja3MubGVuZ3RoOyBpKyspIHtcbiBcdFx0XHRcdFx0XHRjYiA9IGNhbGxiYWNrc1tpXTtcbiBcdFx0XHRcdFx0XHR0cnkge1xuIFx0XHRcdFx0XHRcdFx0Y2IobW9kdWxlT3V0ZGF0ZWREZXBlbmRlbmNpZXMpO1xuIFx0XHRcdFx0XHRcdH0gY2F0Y2ggKGVycikge1xuIFx0XHRcdFx0XHRcdFx0aWYgKG9wdGlvbnMub25FcnJvcmVkKSB7XG4gXHRcdFx0XHRcdFx0XHRcdG9wdGlvbnMub25FcnJvcmVkKHtcbiBcdFx0XHRcdFx0XHRcdFx0XHR0eXBlOiBcImFjY2VwdC1lcnJvcmVkXCIsXG4gXHRcdFx0XHRcdFx0XHRcdFx0bW9kdWxlSWQ6IG1vZHVsZUlkLFxuIFx0XHRcdFx0XHRcdFx0XHRcdGRlcGVuZGVuY3lJZDogbW9kdWxlT3V0ZGF0ZWREZXBlbmRlbmNpZXNbaV0sXG4gXHRcdFx0XHRcdFx0XHRcdFx0ZXJyb3I6IGVyclxuIFx0XHRcdFx0XHRcdFx0XHR9KTtcbiBcdFx0XHRcdFx0XHRcdH1cbiBcdFx0XHRcdFx0XHRcdGlmICghb3B0aW9ucy5pZ25vcmVFcnJvcmVkKSB7XG4gXHRcdFx0XHRcdFx0XHRcdGlmICghZXJyb3IpIGVycm9yID0gZXJyO1xuIFx0XHRcdFx0XHRcdFx0fVxuIFx0XHRcdFx0XHRcdH1cbiBcdFx0XHRcdFx0fVxuIFx0XHRcdFx0fVxuIFx0XHRcdH1cbiBcdFx0fVxuXG4gXHRcdC8vIExvYWQgc2VsZiBhY2NlcHRlZCBtb2R1bGVzXG4gXHRcdGZvciAoaSA9IDA7IGkgPCBvdXRkYXRlZFNlbGZBY2NlcHRlZE1vZHVsZXMubGVuZ3RoOyBpKyspIHtcbiBcdFx0XHR2YXIgaXRlbSA9IG91dGRhdGVkU2VsZkFjY2VwdGVkTW9kdWxlc1tpXTtcbiBcdFx0XHRtb2R1bGVJZCA9IGl0ZW0ubW9kdWxlO1xuIFx0XHRcdGhvdEN1cnJlbnRQYXJlbnRzID0gW21vZHVsZUlkXTtcbiBcdFx0XHR0cnkge1xuIFx0XHRcdFx0X193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCk7XG4gXHRcdFx0fSBjYXRjaCAoZXJyKSB7XG4gXHRcdFx0XHRpZiAodHlwZW9mIGl0ZW0uZXJyb3JIYW5kbGVyID09PSBcImZ1bmN0aW9uXCIpIHtcbiBcdFx0XHRcdFx0dHJ5IHtcbiBcdFx0XHRcdFx0XHRpdGVtLmVycm9ySGFuZGxlcihlcnIpO1xuIFx0XHRcdFx0XHR9IGNhdGNoIChlcnIyKSB7XG4gXHRcdFx0XHRcdFx0aWYgKG9wdGlvbnMub25FcnJvcmVkKSB7XG4gXHRcdFx0XHRcdFx0XHRvcHRpb25zLm9uRXJyb3JlZCh7XG4gXHRcdFx0XHRcdFx0XHRcdHR5cGU6IFwic2VsZi1hY2NlcHQtZXJyb3ItaGFuZGxlci1lcnJvcmVkXCIsXG4gXHRcdFx0XHRcdFx0XHRcdG1vZHVsZUlkOiBtb2R1bGVJZCxcbiBcdFx0XHRcdFx0XHRcdFx0ZXJyb3I6IGVycjIsXG4gXHRcdFx0XHRcdFx0XHRcdG9yaWdpbmFsRXJyb3I6IGVyclxuIFx0XHRcdFx0XHRcdFx0fSk7XG4gXHRcdFx0XHRcdFx0fVxuIFx0XHRcdFx0XHRcdGlmICghb3B0aW9ucy5pZ25vcmVFcnJvcmVkKSB7XG4gXHRcdFx0XHRcdFx0XHRpZiAoIWVycm9yKSBlcnJvciA9IGVycjI7XG4gXHRcdFx0XHRcdFx0fVxuIFx0XHRcdFx0XHRcdGlmICghZXJyb3IpIGVycm9yID0gZXJyO1xuIFx0XHRcdFx0XHR9XG4gXHRcdFx0XHR9IGVsc2Uge1xuIFx0XHRcdFx0XHRpZiAob3B0aW9ucy5vbkVycm9yZWQpIHtcbiBcdFx0XHRcdFx0XHRvcHRpb25zLm9uRXJyb3JlZCh7XG4gXHRcdFx0XHRcdFx0XHR0eXBlOiBcInNlbGYtYWNjZXB0LWVycm9yZWRcIixcbiBcdFx0XHRcdFx0XHRcdG1vZHVsZUlkOiBtb2R1bGVJZCxcbiBcdFx0XHRcdFx0XHRcdGVycm9yOiBlcnJcbiBcdFx0XHRcdFx0XHR9KTtcbiBcdFx0XHRcdFx0fVxuIFx0XHRcdFx0XHRpZiAoIW9wdGlvbnMuaWdub3JlRXJyb3JlZCkge1xuIFx0XHRcdFx0XHRcdGlmICghZXJyb3IpIGVycm9yID0gZXJyO1xuIFx0XHRcdFx0XHR9XG4gXHRcdFx0XHR9XG4gXHRcdFx0fVxuIFx0XHR9XG5cbiBcdFx0Ly8gaGFuZGxlIGVycm9ycyBpbiBhY2NlcHQgaGFuZGxlcnMgYW5kIHNlbGYgYWNjZXB0ZWQgbW9kdWxlIGxvYWRcbiBcdFx0aWYgKGVycm9yKSB7XG4gXHRcdFx0aG90U2V0U3RhdHVzKFwiZmFpbFwiKTtcbiBcdFx0XHRyZXR1cm4gUHJvbWlzZS5yZWplY3QoZXJyb3IpO1xuIFx0XHR9XG5cbiBcdFx0aG90U2V0U3RhdHVzKFwiaWRsZVwiKTtcbiBcdFx0cmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUpIHtcbiBcdFx0XHRyZXNvbHZlKG91dGRhdGVkTW9kdWxlcyk7XG4gXHRcdH0pO1xuIFx0fVxuXG4gXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSkge1xuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuIFx0XHR9XG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRpOiBtb2R1bGVJZCxcbiBcdFx0XHRsOiBmYWxzZSxcbiBcdFx0XHRleHBvcnRzOiB7fSxcbiBcdFx0XHRob3Q6IGhvdENyZWF0ZU1vZHVsZShtb2R1bGVJZCksXG4gXHRcdFx0cGFyZW50czogKGhvdEN1cnJlbnRQYXJlbnRzVGVtcCA9IGhvdEN1cnJlbnRQYXJlbnRzLCBob3RDdXJyZW50UGFyZW50cyA9IFtdLCBob3RDdXJyZW50UGFyZW50c1RlbXApLFxuIFx0XHRcdGNoaWxkcmVuOiBbXVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBob3RDcmVhdGVSZXF1aXJlKG1vZHVsZUlkKSk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gZGVmaW5lIGdldHRlciBmdW5jdGlvbiBmb3IgaGFybW9ueSBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSBmdW5jdGlvbihleHBvcnRzLCBuYW1lLCBnZXR0ZXIpIHtcbiBcdFx0aWYoIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBuYW1lKSkge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBuYW1lLCB7XG4gXHRcdFx0XHRjb25maWd1cmFibGU6IGZhbHNlLFxuIFx0XHRcdFx0ZW51bWVyYWJsZTogdHJ1ZSxcbiBcdFx0XHRcdGdldDogZ2V0dGVyXG4gXHRcdFx0fSk7XG4gXHRcdH1cbiBcdH07XG5cbiBcdC8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uciA9IGZ1bmN0aW9uKGV4cG9ydHMpIHtcbiBcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbiBcdH07XG5cbiBcdC8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSBmdW5jdGlvbihtb2R1bGUpIHtcbiBcdFx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0RGVmYXVsdCgpIHsgcmV0dXJuIG1vZHVsZVsnZGVmYXVsdCddOyB9IDpcbiBcdFx0XHRmdW5jdGlvbiBnZXRNb2R1bGVFeHBvcnRzKCkgeyByZXR1cm4gbW9kdWxlOyB9O1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCAnYScsIGdldHRlcik7XG4gXHRcdHJldHVybiBnZXR0ZXI7XG4gXHR9O1xuXG4gXHQvLyBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGxcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubyA9IGZ1bmN0aW9uKG9iamVjdCwgcHJvcGVydHkpIHsgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIHByb3BlcnR5KTsgfTtcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7XG5cbiBcdC8vIF9fd2VicGFja19oYXNoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18uaCA9IGZ1bmN0aW9uKCkgeyByZXR1cm4gaG90Q3VycmVudEhhc2g7IH07XG5cblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gaG90Q3JlYXRlUmVxdWlyZShcIi4vc3JjL2luZGV4LmpzXCIpKF9fd2VicGFja19yZXF1aXJlX18ucyA9IFwiLi9zcmMvaW5kZXguanNcIik7XG4iLCJtb2R1bGUuZXhwb3J0cyA9IF9fd2VicGFja19wdWJsaWNfcGF0aF9fICsgXCJhZjE5MGE3ZjZiNzBhNWQxZjU3NzlkYTg5YWZmMmI4Zi5wbmdcIjsiLCJtb2R1bGUuZXhwb3J0cyA9IF9fd2VicGFja19wdWJsaWNfcGF0aF9fICsgXCJiNDg2N2FlN2JiYTAxZWYwZGQwNjY5MDI1OTc2YjQ3MS5wbmdcIjsiLCJtb2R1bGUuZXhwb3J0cyA9IF9fd2VicGFja19wdWJsaWNfcGF0aF9fICsgXCJjNmU4ZDM4NDZiYzhmNTAwNDE3NGRmMDgxM2M3ZDc3ZC5wbmdcIjsiLCJtb2R1bGUuZXhwb3J0cyA9IF9fd2VicGFja19wdWJsaWNfcGF0aF9fICsgXCJkNGVkNzk5MGM1ZTE1YTA2ODc5MDYxZjEzNmY1Yzg5YS5wbmdcIjsiLCJpbXBvcnQgeyBLRVlfVVAsIEtFWV9SSUdIVCwgS0VZX0RPV04sIEtFWV9MRUZUIH0gZnJvbSAnLi91c2VyLXNldHRpbmdzJztcblxuZXhwb3J0IGNvbnN0IE5PUlRIID0gJ05PUlRIJztcbmV4cG9ydCBjb25zdCBXRVNUID0gJ1dFU1QnO1xuZXhwb3J0IGNvbnN0IFNPVVRIID0gJ1NPVVRIJztcbmV4cG9ydCBjb25zdCBFQVNUID0gJ0VBU1QnO1xuZXhwb3J0IGNvbnN0IERJUkVDVElPTl9LRVlfQklORElOR1MgPSB7XG4gIFtLRVlfVVBdOiBOT1JUSCxcbiAgW0tFWV9SSUdIVF06IEVBU1QsXG4gIFtLRVlfRE9XTl06IFNPVVRILFxuICBbS0VZX0xFRlRdOiBXRVNUXG59O1xuZXhwb3J0IGNvbnN0IERJUkVDVElPTl9WRUNUT1JTID0ge1xuICBOT1JUSDogKHsgeCwgeSB9LCBkaXN0YW5jZSkgPT4gKHsgeCwgeTogeSAtIGRpc3RhbmNlIH0pLFxuICBFQVNUOiAoeyB4LCB5IH0sIGRpc3RhbmNlKSA9PiAoeyB4OiB4ICsgZGlzdGFuY2UsIHkgfSksXG4gIFNPVVRIOiAoeyB4LCB5IH0sIGRpc3RhbmNlKSA9PiAoeyB4LCB5OiB5ICsgZGlzdGFuY2UgfSksXG4gIFdFU1Q6ICh7IHgsIHkgfSwgZGlzdGFuY2UpID0+ICh7IHg6IHggLSBkaXN0YW5jZSwgeSB9KVxufTtcbiIsIi8qIGdsb2JhbHMgSW1hZ2UgKi9cclxuaW1wb3J0IHsgVElMRV9TSVpFIH0gZnJvbSAnLi9pbmRleCc7XHJcblxyXG5leHBvcnQgY29uc3QgSU5BTklNQVRFID0gJ0lOQU5JTUFURSc7XHJcbmV4cG9ydCBjb25zdCBERUJVR19FTlRJVElFUyA9ICdERUJVRyc7XHJcblxyXG5leHBvcnQgY29uc3QgT1BFTiA9ICdPUEVOJztcclxuZXhwb3J0IGNvbnN0IENMT1NFRCA9ICdDTE9TRUQnO1xyXG5cclxuaW1wb3J0IGNoZXN0U3ByaXRlIGZyb20gJy4uL2Fzc2V0cy9jaGVzdC1zcHJpdGUucG5nJztcclxuY29uc3QgY2hlc3RJbWFnZSA9IG5ldyBJbWFnZSgpO1xyXG5jaGVzdEltYWdlLnNyYyA9IGNoZXN0U3ByaXRlO1xyXG5cclxuY29uc3QgdHlwZXMgPSB7XHJcbiAgY2hlc3Q6IHtcclxuICAgIGxvb3Q6IHsgZ29sZDogMTAgfSxcclxuICAgIHR5cGU6IElOQU5JTUFURSxcclxuICAgIHN0YXR1czogQ0xPU0VELFxyXG4gICAgZHg6IDEgKiBUSUxFX1NJWkUgLSAxLFxyXG4gICAgZHk6IDEgKiBUSUxFX1NJWkUgLSAxLFxyXG4gICAgc3ByaXRlOiB7XHJcbiAgICAgIGFzc2V0OiBjaGVzdEltYWdlLFxyXG4gICAgICBpbWFnZXM6IHtcclxuICAgICAgICBbT1BFTl06IHsgeDogMzIsIHk6IDAgfSxcclxuICAgICAgICBbQ0xPU0VEXTogeyB4OiAwLCB5OiAwIH1cclxuICAgICAgfVxyXG4gICAgfSxcclxuICAgIGFjdGl2YXRlOiBmdW5jdGlvbigpIHtcclxuICAgICAgY29uc3QgbG9vdCA9IHRoaXMubG9vdDtcclxuXHJcbiAgICAgIHRoaXMuc3RhdHVzID0gdGhpcy5zdGF0dXMgPT09IE9QRU4gPyBDTE9TRUQgOiBPUEVOO1xyXG4gICAgICB0aGlzLmxvb3QgPSB7fTtcclxuXHJcbiAgICAgIHJldHVybiB7IGxvb3QgfTtcclxuICAgIH1cclxuICB9XHJcbn07XHJcblxyXG5leHBvcnQgZGVmYXVsdCBPYmplY3Qua2V5cyh0eXBlcykucmVkdWNlKChwcmV2LCBjdXJyKSA9PiB7XHJcbiAgcmV0dXJuIHtcclxuICAgIC4uLnByZXYsXHJcbiAgICBbY3Vycl06IHByb3BlcnRpZXMgPT4ge1xyXG4gICAgICByZXR1cm4ge1xyXG4gICAgICAgIC4uLnR5cGVzW2N1cnJdLFxyXG4gICAgICAgIC4uLnByb3BlcnRpZXNcclxuICAgICAgfTtcclxuICAgIH1cclxuICB9O1xyXG59LCB7fSk7XHJcbiIsImV4cG9ydCBjb25zdCBQTEFZRVJfTU9WRV9TUEVFRCA9IDI7XG5leHBvcnQgY29uc3QgQ0FOVkFTX1dJRFRIID0gODAwO1xuZXhwb3J0IGNvbnN0IENBTlZBU19IRUlHSFQgPSA2MDA7XG5leHBvcnQgY29uc3QgVElMRV9TSVpFID0gMzI7XG5leHBvcnQgY29uc3QgSEFMRl9USUxFID0gVElMRV9TSVpFIC8gMjtcbiIsImV4cG9ydCBjb25zdCBLRVlfVVAgPSAneic7XG5leHBvcnQgY29uc3QgS0VZX1JJR0hUID0gJ2QnO1xuZXhwb3J0IGNvbnN0IEtFWV9ET1dOID0gJ3MnO1xuZXhwb3J0IGNvbnN0IEtFWV9MRUZUID0gJ3EnO1xuZXhwb3J0IGNvbnN0IEtFWV9BQ1RJT04gPSAnZSc7XG5leHBvcnQgY29uc3QgREVCVUcgPSBmYWxzZTtcbiIsIi8qIGdsb2JhbHMgZG9jdW1lbnQgKi9cclxuY29uc3QgcGxheWVySW5mb1BhbmVsID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3BsYXllci1pbmZvJyk7XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gcmVuZGVyRGVidWdJbmZvKHN0YXRlKSB7XHJcbiAgcGxheWVySW5mb1BhbmVsLmlubmVySFRNTCA9IEpTT04uc3RyaW5naWZ5KHN0YXRlLnBsYXllciwgbnVsbCwgMik7XHJcbn1cclxuIiwiaW1wb3J0IHsgRElSRUNUSU9OX1ZFQ1RPUlMsIFNPVVRIIH0gZnJvbSAnLi9jb25zdGFudHMvZGlyZWN0aW9ucyc7XHJcbmltcG9ydCB7IElOQU5JTUFURSB9IGZyb20gJy4vY29uc3RhbnRzL2VudGl0aWVzJztcclxuaW1wb3J0IHsgQ0FOVkFTX1dJRFRILCBDQU5WQVNfSEVJR0hUIH0gZnJvbSAnLi9jb25zdGFudHMnO1xyXG5pbXBvcnQgeyBkZXRlY3RXYWxsQ29sbGlzaW9uLCBnZXRUaWxlT3JpZ2luQ29vcmRpbmF0ZXMgfSBmcm9tICcuL21hcCc7XHJcbmltcG9ydCBlbnRpdGllcyBmcm9tICcuL2NvbnN0YW50cy9lbnRpdGllcyc7XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gZHJhd0VudGl0eShjdHgsIGVudGl0eSkge1xyXG4gIGlmICghZW50aXR5LnNwcml0ZSkge1xyXG4gICAgY3R4LmZpbGxTdHlsZSA9ICdyZ2IoMjAwLCAwLCAwKSc7XHJcbiAgICByZXR1cm4gY3R4LmZpbGxSZWN0KGVudGl0eS54LCBlbnRpdHkueSwgZW50aXR5LmR4LCBlbnRpdHkuZHkpO1xyXG4gIH1cclxuICBjb25zdCB7IHNwcml0ZSwgdHlwZSwgc3RhdHVzLCBkaXJlY3Rpb24sIHgsIHksIGR4LCBkeSB9ID0gZW50aXR5O1xyXG4gIGNvbnN0IHZhcmlhbnREZXRlcm1pbmVyID0gKHR5cGUgPT09IElOQU5JTUFURSAmJiBzdGF0dXMpIHx8IGRpcmVjdGlvbjtcclxuICBjb25zdCB7IHg6IHN4LCB5OiBzeSB9ID0gc3ByaXRlLmltYWdlc1t2YXJpYW50RGV0ZXJtaW5lcl07XHJcbiAgY3R4LmRyYXdJbWFnZShzcHJpdGUuYXNzZXQsIHN4LCBzeSwgZHgsIGR5LCB4LCB5LCBkeCwgZHkpO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gbW92ZUVudGl0eShlbnRpdHksIGRpcmVjdGlvbiwgZGlzdGFuY2UpIHtcclxuICBjb25zdCB7IHgsIHkgfSA9IERJUkVDVElPTl9WRUNUT1JTW2RpcmVjdGlvbl0oZW50aXR5LCBkaXN0YW5jZSk7XHJcbiAgY29uc3QgbmV3RW50aXR5ID0ge1xyXG4gICAgLi4uZW50aXR5LFxyXG4gICAgeDogY2xhbXAoeCwgMCwgQ0FOVkFTX1dJRFRIIC0gZW50aXR5LmR4KSxcclxuICAgIHk6IGNsYW1wKHksIDAsIENBTlZBU19IRUlHSFQgLSBlbnRpdHkuZHkpLFxyXG4gICAgZGlyZWN0aW9uXHJcbiAgfTtcclxuXHJcbiAgaWYgKCFkZXRlY3RXYWxsQ29sbGlzaW9uKG5ld0VudGl0eSkpIHtcclxuICAgIHJldHVybiBuZXdFbnRpdHk7XHJcbiAgfVxyXG5cclxuICByZXR1cm4geyAuLi5lbnRpdHksIGRpcmVjdGlvbiB9O1xyXG59XHJcblxyXG5mdW5jdGlvbiBjbGFtcChudW1iZXIsIG1pbiwgbWF4KSB7XHJcbiAgcmV0dXJuIE1hdGgubWluKE1hdGgubWF4KG51bWJlciwgbWluKSwgbWF4KTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHNwYXduRW50aXR5KGlkZW50aWZpZXIsIHRpbGVDb29yZGluYXRlcywgZGlyZWN0aW9uID0gU09VVEgpIHtcclxuICBjb25zdCBjb29yZGluYXRlcyA9IGdldFRpbGVPcmlnaW5Db29yZGluYXRlcyh0aWxlQ29vcmRpbmF0ZXMpO1xyXG4gIGNvbnN0IGVudGl0eSA9IGVudGl0aWVzW2lkZW50aWZpZXJdKHtcclxuICAgIGRpcmVjdGlvbixcclxuICAgIC4uLmNvb3JkaW5hdGVzXHJcbiAgfSk7XHJcblxyXG4gIHJldHVybiBlbnRpdHk7XHJcbn1cclxuIiwiaW1wb3J0IHsgQ0FOVkFTX1dJRFRILCBDQU5WQVNfSEVJR0hUIH0gZnJvbSAnLi9jb25zdGFudHMnO1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGRyYXdHdWkoY3R4LCBzdGF0ZSkge1xyXG4gIGN0eC5maWxsU3R5bGUgPSAncmdiKDE1NiwgMTQ0LCAxMzUpJztcclxuICBjdHguZmlsbFJlY3QoQ0FOVkFTX1dJRFRIIC0gNDAsIENBTlZBU19IRUlHSFQgLSA0MCwgMzAsIDMwKTtcclxuICBjdHguZmlsbFN0eWxlID0gJ3JnYig1NiwgNDQsIDM1KSc7XHJcbiAgY3R4LmZvbnQgPSAnMjRweCBzZXJpZic7XHJcbiAgY3R4LmZpbGxUZXh0KHN0YXRlLmdvbGQsIENBTlZBU19XSURUSCAtIDM2LCBDQU5WQVNfSEVJR0hUIC0gMTYpO1xyXG59XHJcbiIsIi8qIGdsb2JhbHMgZG9jdW1lbnQsIHdpbmRvdyAqL1xuaW1wb3J0IHsgZHJhd0VudGl0eSwgc3Bhd25FbnRpdHkgfSBmcm9tICcuL2VudGl0eSc7XG5pbXBvcnQgeyBJTkFOSU1BVEUsIERFQlVHX0VOVElUSUVTIH0gZnJvbSAnLi9jb25zdGFudHMvZW50aXRpZXMnO1xuaW1wb3J0IHsgZHJhd01hcCB9IGZyb20gJy4vbWFwJztcbmltcG9ydCB7IENBTlZBU19XSURUSCwgQ0FOVkFTX0hFSUdIVCB9IGZyb20gJy4vY29uc3RhbnRzJztcbmltcG9ydCB7XG4gIHJlZ2lzdGVyS2V5Ym9hcmRFdmVudHMsXG4gIHN0YXJ0S2V5Ym9hcmRDb250cm9sbGVyXG59IGZyb20gJy4va2V5Ym9hcmQtY29udHJvbGxlcic7XG5pbXBvcnQgcGxheWVyIGZyb20gJy4vcGxheWVyJztcbmltcG9ydCBwbGF5ZXJDb250cm9scyBmcm9tICcuL3BsYXllci1jb250cm9scyc7XG5pbXBvcnQgeyByZW5kZXJEZWJ1Z0luZm8gfSBmcm9tICcuL2RlYnVnLXRvb2xzJztcbmltcG9ydCB7IERFQlVHIH0gZnJvbSAnLi9jb25zdGFudHMvdXNlci1zZXR0aW5ncyc7XG5pbXBvcnQgeyBsb2FkTWFwRGF0YSB9IGZyb20gJy4vbWFwL21hcC1sb2FkZXInO1xuaW1wb3J0IHsgZHJhd0d1aSB9IGZyb20gJy4vZ3VpJztcblxuY29uc3Qgc3RhdGUgPSB7XG4gIGdvbGQ6IDAsXG4gIHBsYXllcixcbiAgZW50aXRpZXM6IHtcbiAgICBbSU5BTklNQVRFXTogW10sXG4gICAgW0RFQlVHX0VOVElUSUVTXTogW11cbiAgfVxufTtcbmNvbnN0IGNhbnZhcyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdnYW1lLWNhbnZhcycpO1xuY29uc3QgY3R4ID0gY2FudmFzLmdldENvbnRleHQoJzJkJyk7XG5cbmFzeW5jIGZ1bmN0aW9uIHN0YXJ0R2FtZSgpIHtcbiAgc3RhcnRLZXlib2FyZENvbnRyb2xsZXIocGxheWVyQ29udHJvbHMpO1xuICBhd2FpdCBsb2FkTWFwRGF0YSgpO1xuICBzdGF0ZS5lbnRpdGllc1tJTkFOSU1BVEVdLnB1c2goc3Bhd25FbnRpdHkoJ2NoZXN0JywgeyB4OiA0LCB5OiA0IH0pKTtcbiAgZ2FtZUxvb3AoKTtcbn1cblxuZnVuY3Rpb24gZ2FtZUxvb3AoKSB7XG4gIHJlZ2lzdGVyS2V5Ym9hcmRFdmVudHMoc3RhdGUpO1xuICBERUJVRyAmJiByZW5kZXJEZWJ1Z0luZm8oc3RhdGUpO1xuXG4gIGN0eC5jbGVhclJlY3QoMCwgMCwgQ0FOVkFTX1dJRFRILCBDQU5WQVNfSEVJR0hUKTtcblxuICBkcmF3TWFwKGN0eCwgc3RhdGUucGxheWVyKTtcblxuICBzdGF0ZS5lbnRpdGllc1tJTkFOSU1BVEVdLmZvckVhY2goZW50aXR5ID0+IHtcbiAgICBkcmF3RW50aXR5KGN0eCwgZW50aXR5KTtcbiAgfSk7XG4gIHN0YXRlLmVudGl0aWVzW0RFQlVHX0VOVElUSUVTXS5mb3JFYWNoKGVudGl0eSA9PiB7XG4gICAgZHJhd0VudGl0eShjdHgsIGVudGl0eSk7XG4gIH0pO1xuXG4gIGRyYXdFbnRpdHkoY3R4LCBzdGF0ZS5wbGF5ZXIpO1xuICBkcmF3R3VpKGN0eCwgc3RhdGUpO1xuXG4gIHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUoZ2FtZUxvb3ApO1xufVxuXG5zdGFydEdhbWUoKTtcbiIsIi8qIGdsb2JhbHMgZG9jdW1lbnQgKi9cclxuY29uc3Qga2V5U3RhdGUgPSB7fTtcclxubGV0IGxpc3RlbmVycyA9IHt9O1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHN0YXJ0S2V5Ym9hcmRDb250cm9sbGVyKGNvbnRyb2xzKSB7XHJcbiAgbGlzdGVuZXJzID0gY29udHJvbHM7XHJcblxyXG4gIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2tleXByZXNzJywgZXZ0ID0+IHtcclxuICAgIGtleVN0YXRlW2V2dC5rZXldID0gdHJ1ZTtcclxuICB9KTtcclxuICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdrZXl1cCcsIGV2dCA9PiB7XHJcbiAgICBjbGVhcktleShldnQua2V5KTtcclxuICB9KTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHJlZ2lzdGVyS2V5Ym9hcmRFdmVudHMoc3RhdGUpIHtcclxuICBPYmplY3Qua2V5cyhrZXlTdGF0ZSkuZm9yRWFjaChrZXkgPT4ge1xyXG4gICAgbGlzdGVuZXJzW2tleV0gJiYgbGlzdGVuZXJzW2tleV0oc3RhdGUpO1xyXG4gIH0pO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gY2xlYXJLZXkoa2V5KSB7XHJcbiAgZGVsZXRlIGtleVN0YXRlW2tleV07XHJcbn1cclxuIiwiaW1wb3J0IHtcclxuICBDQU5WQVNfV0lEVEgsXHJcbiAgQ0FOVkFTX0hFSUdIVCxcclxuICBUSUxFX1NJWkUsXHJcbiAgSEFMRl9USUxFXHJcbn0gZnJvbSAnLi4vY29uc3RhbnRzJztcclxuaW1wb3J0IHRpbGVzZXQgZnJvbSAnLi90aWxlc2V0JztcclxuaW1wb3J0IHsgZ2V0TWFwRGF0YSB9IGZyb20gJy4vbWFwLWxvYWRlcic7XHJcblxyXG5jb25zdCBUSUxFX0NPVU5UX1ggPSBDQU5WQVNfV0lEVEggLyBUSUxFX1NJWkU7XHJcbmNvbnN0IFRJTEVfQ09VTlRfWSA9IENBTlZBU19IRUlHSFQgLyBUSUxFX1NJWkU7XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gZHJhd01hcChjdHggLyosIHBsYXllciovKSB7XHJcbiAgY29uc3QgbWFwRGF0YSA9IGdldE1hcERhdGEoKTtcclxuXHJcbiAgZm9yIChsZXQgeCA9IDA7IHggPCBUSUxFX0NPVU5UX1g7IHggKz0gMSkge1xyXG4gICAgZm9yIChsZXQgeSA9IDA7IHkgPCBUSUxFX0NPVU5UX1k7IHkgKz0gMSkge1xyXG4gICAgICBjb25zdCB7IGltYWdlLCBpbWFnZVZhcmlhbnQgfSA9IG1hcERhdGFbeF1beV07XHJcbiAgICAgIGNvbnN0IHsgeDogc3gsIHk6IHN5IH0gPSB0aWxlc2V0LmltYWdlc1tpbWFnZV1baW1hZ2VWYXJpYW50XTtcclxuXHJcbiAgICAgIGN0eC5kcmF3SW1hZ2UoXHJcbiAgICAgICAgdGlsZXNldC5hc3NldCxcclxuICAgICAgICBzeCxcclxuICAgICAgICBzeSxcclxuICAgICAgICBUSUxFX1NJWkUsXHJcbiAgICAgICAgVElMRV9TSVpFLFxyXG4gICAgICAgIHggKiBUSUxFX1NJWkUsXHJcbiAgICAgICAgeSAqIFRJTEVfU0laRSxcclxuICAgICAgICBUSUxFX1NJWkUsXHJcbiAgICAgICAgVElMRV9TSVpFXHJcbiAgICAgICk7XHJcbiAgICB9XHJcbiAgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gZGV0ZWN0V2FsbENvbGxpc2lvbihlbnRpdHkpIHtcclxuICBjb25zdCBtYXBEYXRhID0gZ2V0TWFwRGF0YSgpO1xyXG4gIGNvbnN0IGxlZnRUaWxlID0gTWF0aC5mbG9vcihlbnRpdHkueCAvIFRJTEVfU0laRSk7XHJcbiAgY29uc3QgcmlnaHRUaWxlID0gTWF0aC5mbG9vcigoZW50aXR5LnggKyBlbnRpdHkuZHgpIC8gVElMRV9TSVpFKTtcclxuICBjb25zdCB0b3BUaWxlID0gTWF0aC5mbG9vcihlbnRpdHkueSAvIFRJTEVfU0laRSk7XHJcbiAgY29uc3QgYm90dG9tVGlsZSA9IE1hdGguZmxvb3IoKGVudGl0eS55ICsgZW50aXR5LmR5KSAvIFRJTEVfU0laRSk7XHJcblxyXG4gIGZvciAobGV0IHggPSBsZWZ0VGlsZTsgeCA8PSByaWdodFRpbGU7IHggKz0gMSkge1xyXG4gICAgZm9yIChsZXQgeSA9IHRvcFRpbGU7IHkgPD0gYm90dG9tVGlsZTsgeSArPSAxKSB7XHJcbiAgICAgIGlmIChtYXBEYXRhW3hdW3ldLmJsb2NraW5nKSB7XHJcbiAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcblxyXG4gIHJldHVybiBmYWxzZTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGRldGVjdEVudGl0eUNvbGxpc2lvbihlbnRpdGllcywgZW50aXR5KSB7XHJcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBlbnRpdGllcy5sZW5ndGg7IGkgKz0gMSkge1xyXG4gICAgY29uc3QgZSA9IGVudGl0aWVzW2ldO1xyXG5cclxuICAgIGlmIChcclxuICAgICAgZS54IDwgZW50aXR5LnggKyBlbnRpdHkuZHggJiZcclxuICAgICAgZS54ICsgZS5keCA+IGVudGl0eS54ICYmXHJcbiAgICAgIGUueSA8IGVudGl0eS55ICsgZW50aXR5LmR5ICYmXHJcbiAgICAgIGUuZHkgKyBlLnkgPiBlbnRpdHkueVxyXG4gICAgKSB7XHJcbiAgICAgIHJldHVybiBlO1xyXG4gICAgfVxyXG4gIH1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGdldFRpbGVPcmlnaW5Db29yZGluYXRlcyh0aWxlQ29vcmRpbmF0ZXMpIHtcclxuICBjb25zdCB7IHgsIHkgfSA9IHRpbGVDb29yZGluYXRlcztcclxuICByZXR1cm4ge1xyXG4gICAgeDogeCAqIFRJTEVfU0laRSxcclxuICAgIHk6IHkgKiBUSUxFX1NJWkVcclxuICB9O1xyXG59XHJcbmV4cG9ydCBmdW5jdGlvbiBnZXRUaWxlQ2VudGVyQ29vcmRpbmF0ZXModGlsZUNvb3JkaW5hdGVzKSB7XHJcbiAgY29uc3QgeyB4LCB5IH0gPSB0aWxlQ29vcmRpbmF0ZXM7XHJcbiAgcmV0dXJuIHtcclxuICAgIHg6IHggKiBUSUxFX1NJWkUgKyBIQUxGX1RJTEUsXHJcbiAgICB5OiB5ICogVElMRV9TSVpFICsgSEFMRl9USUxFXHJcbiAgfTtcclxufVxyXG4iLCIvKiBnbG9iYWxzIEltYWdlLCBkb2N1bWVudCAqL1xyXG5pbXBvcnQgbWFwRmlsZSBmcm9tICcuLi9hc3NldHMvbWFwLnBuZyc7XHJcbmltcG9ydCB7IE5PUlRILCBFQVNULCBTT1VUSCwgV0VTVCB9IGZyb20gJy4uL2NvbnN0YW50cy9kaXJlY3Rpb25zJztcclxuaW1wb3J0IHsgZ2V0VGlsZVZhcmlhbnQgfSBmcm9tICcuL3RpbGVzZXQnO1xyXG5cclxuY29uc3QgbWFwRGF0YSA9IFtdO1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGxvYWRNYXBEYXRhKCkge1xyXG4gIGNvbnN0IGltZyA9IG5ldyBJbWFnZSgpO1xyXG4gIGNvbnN0IGNhbnZhcyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2NhbnZhcycpO1xyXG4gIGNvbnN0IGN0eCA9IGNhbnZhcy5nZXRDb250ZXh0KCcyZCcpO1xyXG5cclxuICByZXR1cm4gbmV3IFByb21pc2UocmVzb2x2ZSA9PiB7XHJcbiAgICBpbWcuc3JjID0gbWFwRmlsZTtcclxuICAgIGltZy5vbmxvYWQgPSAoKSA9PiB7XHJcbiAgICAgIGNhbnZhcy53aWR0aCA9IGltZy53aWR0aDtcclxuICAgICAgY2FudmFzLmhlaWdodCA9IGltZy5oZWlnaHQ7XHJcbiAgICAgIGN0eC5kcmF3SW1hZ2UoaW1nLCAwLCAwLCBpbWcud2lkdGgsIGltZy5oZWlnaHQpO1xyXG5cclxuICAgICAgZGVjb2RlTWFwRGF0YShjdHgsIGltZy53aWR0aCwgaW1nLmhlaWdodCk7XHJcbiAgICAgIHJlc29sdmUoKTtcclxuICAgIH07XHJcbiAgfSk7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBkZWNvZGVNYXBEYXRhKGN0eCwgd2lkdGgsIGhlaWdodCkge1xyXG4gIGNvbnN0IHJhd0RhdGEgPSBbXTtcclxuXHJcbiAgZm9yIChsZXQgeCA9IDA7IHggPCB3aWR0aDsgeCArPSAxKSB7XHJcbiAgICByYXdEYXRhLnB1c2goW10pO1xyXG4gICAgZm9yIChsZXQgeSA9IDA7IHkgPCBoZWlnaHQ7IHkgKz0gMSkge1xyXG4gICAgICByYXdEYXRhW3hdLnB1c2goY3R4LmdldEltYWdlRGF0YSh4LCB5LCAxLCAxKS5kYXRhKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIGZvciAobGV0IHggPSAwOyB4IDwgd2lkdGg7IHggKz0gMSkge1xyXG4gICAgbWFwRGF0YS5wdXNoKFtdKTtcclxuICAgIGZvciAobGV0IHkgPSAwOyB5IDwgaGVpZ2h0OyB5ICs9IDEpIHtcclxuICAgICAgY29uc3QgbmVpZ2hib3VycyA9IHtcclxuICAgICAgICBbTk9SVEhdOiByYXdEYXRhW3hdW3kgLSAxXSB8fCBbMF0sXHJcbiAgICAgICAgW05PUlRIICsgRUFTVF06IChyYXdEYXRhW3ggKyAxXSAmJiByYXdEYXRhW3ggKyAxXVt5IC0gMV0pIHx8IFswXSxcclxuICAgICAgICBbRUFTVF06IChyYXdEYXRhW3ggKyAxXSAmJiByYXdEYXRhW3ggKyAxXVt5XSkgfHwgWzBdLFxyXG4gICAgICAgIFtTT1VUSCArIEVBU1RdOiAocmF3RGF0YVt4ICsgMV0gJiYgcmF3RGF0YVt4ICsgMV1beSArIDFdKSB8fCBbMF0sXHJcbiAgICAgICAgW1NPVVRIXTogcmF3RGF0YVt4XVt5ICsgMV0gfHwgWzBdLFxyXG4gICAgICAgIFtTT1VUSCArIFdFU1RdOiAocmF3RGF0YVt4IC0gMV0gJiYgcmF3RGF0YVt4IC0gMV1beSArIDFdKSB8fCBbMF0sXHJcbiAgICAgICAgW1dFU1RdOiAocmF3RGF0YVt4IC0gMV0gJiYgcmF3RGF0YVt4IC0gMV1beV0pIHx8IFswXSxcclxuICAgICAgICBbTk9SVEggKyBXRVNUXTogKHJhd0RhdGFbeCAtIDFdICYmIHJhd0RhdGFbeCAtIDFdW3kgLSAxXSkgfHwgWzBdXHJcbiAgICAgIH07XHJcblxyXG4gICAgICBtYXBEYXRhW3hdLnB1c2goZGVjb2RlVGlsZUluZm8ocmF3RGF0YVt4XVt5XSwgbmVpZ2hib3VycykpO1xyXG4gICAgfVxyXG4gIH1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGRlY29kZVRpbGVJbmZvKHRpbGVJbmZvLCBuZWlnaGJvdXJzKSB7XHJcbiAgY29uc3Qgbm9ydGhCbG9ja2luZyA9IG5laWdoYm91cnNbTk9SVEhdWzBdID09PSAwO1xyXG4gIGNvbnN0IGVhc3RCbG9ja2luZyA9IG5laWdoYm91cnNbRUFTVF1bMF0gPT09IDA7XHJcbiAgY29uc3Qgc291dGhCbG9ja2luZyA9IG5laWdoYm91cnNbU09VVEhdWzBdID09PSAwO1xyXG4gIGNvbnN0IHdlc3RCbG9ja2luZyA9IG5laWdoYm91cnNbV0VTVF1bMF0gPT09IDA7XHJcbiAgY29uc3QgbmVpZ2hib3Vyc1ZhbHVlID1cclxuICAgIG5vcnRoQmxvY2tpbmcgKiA4ICsgZWFzdEJsb2NraW5nICogNCArIHNvdXRoQmxvY2tpbmcgKiAyICsgd2VzdEJsb2NraW5nICogMTtcclxuXHJcbiAgaWYgKHRpbGVJbmZvWzBdID09PSAwKSB7XHJcbiAgICBjb25zdCBpbWFnZUlkID0gYGNlaWxpbmcke25laWdoYm91cnNWYWx1ZX1gO1xyXG5cclxuICAgIHJldHVybiB7IGJsb2NraW5nOiB0cnVlLCAuLi5nZXRUaWxlVmFyaWFudChpbWFnZUlkKSB9O1xyXG4gIH1cclxuXHJcbiAgaWYgKG5vcnRoQmxvY2tpbmcpIHtcclxuICAgIHJldHVybiB7IGJsb2NraW5nOiBmYWxzZSwgLi4uZ2V0VGlsZVZhcmlhbnQoJ3dhbGwnKSB9O1xyXG4gIH1cclxuXHJcbiAgcmV0dXJuIHsgYmxvY2tpbmc6IGZhbHNlLCAuLi5nZXRUaWxlVmFyaWFudCgnZmxvb3InKSB9O1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gZ2V0TWFwRGF0YSgpIHtcclxuICByZXR1cm4gbWFwRGF0YTtcclxufVxyXG5cclxuZnVuY3Rpb24gZ2V0TmVpZ2hib3VyQmxvY2tNYXRyaXgoKSB7fVxyXG4iLCIvKiBnbG9iYWxzIEltYWdlICovXHJcbmltcG9ydCB0aWxlc2V0IGZyb20gJy4uL2Fzc2V0cy9nb2JsaW5vLXRpbGVzLnBuZyc7XHJcbmltcG9ydCB7IFRJTEVfU0laRSB9IGZyb20gJy4uL2NvbnN0YW50cyc7XHJcblxyXG5jb25zdCB0aWxlSW1hZ2UgPSBuZXcgSW1hZ2UoKTtcclxuXHJcbnRpbGVJbWFnZS5zcmMgPSB0aWxlc2V0O1xyXG5cclxuZnVuY3Rpb24gdGlsZVhZKHgsIHkpIHtcclxuICByZXR1cm4geyB4OiB4ICogVElMRV9TSVpFLCB5OiB5ICogVElMRV9TSVpFIH07XHJcbn1cclxuXHJcbmNvbnN0IGltYWdlcyA9IHtcclxuICBmbG9vcjogW1xyXG4gICAgdGlsZVhZKDAsIDApLFxyXG4gICAgdGlsZVhZKDEsIDApLFxyXG4gICAgdGlsZVhZKDIsIDApLFxyXG4gICAgdGlsZVhZKDMsIDApLFxyXG4gICAgdGlsZVhZKDQsIDApLFxyXG4gICAgdGlsZVhZKDUsIDApLFxyXG4gICAgdGlsZVhZKDYsIDApLFxyXG4gICAgdGlsZVhZKDcsIDApLFxyXG4gICAgdGlsZVhZKDgsIDApXHJcbiAgXSxcclxuICBjZWlsaW5nMDogW3RpbGVYWSgwLCAxKSwgdGlsZVhZKDAsIDIpXSxcclxuICBjZWlsaW5nMTogW3RpbGVYWSgxLCAxKV0sXHJcbiAgY2VpbGluZzI6IFt0aWxlWFkoMiwgMSldLFxyXG4gIGNlaWxpbmczOiBbdGlsZVhZKDMsIDEpXSxcclxuICBjZWlsaW5nNDogW3RpbGVYWSg0LCAxKV0sXHJcbiAgY2VpbGluZzU6IFt0aWxlWFkoNSwgMSksIHRpbGVYWSg1LCAyKSwgdGlsZVhZKDUsIDMpLCB0aWxlWFkoNSwgNCldLFxyXG4gIGNlaWxpbmc2OiBbdGlsZVhZKDYsIDEpXSxcclxuICBjZWlsaW5nNzogW3RpbGVYWSg3LCAxKSwgdGlsZVhZKDcsIDIpLCB0aWxlWFkoNywgMyksIHRpbGVYWSg3LCA0KV0sXHJcbiAgY2VpbGluZzg6IFt0aWxlWFkoOCwgMSldLFxyXG4gIGNlaWxpbmc5OiBbdGlsZVhZKDksIDEpXSxcclxuICBjZWlsaW5nMTA6IFt0aWxlWFkoMTAsIDEpLCB0aWxlWFkoMTAsIDIpLCB0aWxlWFkoMTAsIDMpLCB0aWxlWFkoMTAsIDQpXSxcclxuICBjZWlsaW5nMTE6IFt0aWxlWFkoMTEsIDEpLCB0aWxlWFkoMTEsIDIpLCB0aWxlWFkoMTEsIDMpLCB0aWxlWFkoMTEsIDQpXSxcclxuICBjZWlsaW5nMTI6IFt0aWxlWFkoMTIsIDEpXSxcclxuICBjZWlsaW5nMTM6IFt0aWxlWFkoMTMsIDEpLCB0aWxlWFkoMTMsIDIpLCB0aWxlWFkoMTMsIDMpLCB0aWxlWFkoMTMsIDQpXSxcclxuICBjZWlsaW5nMTQ6IFt0aWxlWFkoMTQsIDEpLCB0aWxlWFkoMTQsIDIpLCB0aWxlWFkoMTQsIDMpLCB0aWxlWFkoMTQsIDQpXSxcclxuICBjZWlsaW5nMTU6IFt0aWxlWFkoMTUsIDEpXSxcclxuICBjZWlsaW5nMTY6IFt0aWxlWFkoMTYsIDEpXSxcclxuICB3YWxsOiBbXHJcbiAgICB0aWxlWFkoMywgNSksXHJcbiAgICB0aWxlWFkoNCwgNSksXHJcbiAgICB0aWxlWFkoNSwgNSksXHJcbiAgICB0aWxlWFkoNiwgNSksXHJcbiAgICB0aWxlWFkoMywgNiksXHJcbiAgICB0aWxlWFkoNCwgNiksXHJcbiAgICB0aWxlWFkoNSwgNiksXHJcbiAgICB0aWxlWFkoNiwgNilcclxuICBdLFxyXG4gIHdhbGxMZWZ0Q29ybmVyOiBbdGlsZVhZKDAsIDUpLCB0aWxlWFkoMCwgNildLFxyXG4gIHdhbGxSaWdodENvcm5lcjogW3RpbGVYWSgxLCA1KSwgdGlsZVhZKDEsIDYpXSxcclxuICB3YWxsQm90aENvcm5lcnM6IFt0aWxlWFkoMiwgNSksIHRpbGVYWSgyLCA2KV1cclxufTtcclxuZXhwb3J0IGRlZmF1bHQge1xyXG4gIGFzc2V0OiB0aWxlSW1hZ2UsXHJcbiAgaW1hZ2VzXHJcbn07XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gZ2V0VGlsZVZhcmlhbnQoaW1hZ2UpIHtcclxuICBpZiAoaW1hZ2VzW2ltYWdlXS5sZW5ndGggPT09IDEpIHtcclxuICAgIHJldHVybiB7IGltYWdlLCBpbWFnZVZhcmlhbnQ6IDAgfTtcclxuICB9XHJcblxyXG4gIGNvbnN0IHZhcmlhbnRzID0gaW1hZ2VzW2ltYWdlXTtcclxuICBjb25zdCBpbWFnZVZhcmlhbnQgPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiB2YXJpYW50cy5sZW5ndGgpO1xyXG5cclxuICByZXR1cm4geyBpbWFnZSwgaW1hZ2VWYXJpYW50IH07XHJcbn1cclxuIiwiLyogZ2xvYmFscyBjb25zb2xlICovXHJcbmltcG9ydCB7XHJcbiAgS0VZX1VQLFxyXG4gIEtFWV9SSUdIVCxcclxuICBLRVlfRE9XTixcclxuICBLRVlfTEVGVCxcclxuICBLRVlfQUNUSU9OXHJcbn0gZnJvbSAnLi9jb25zdGFudHMvdXNlci1zZXR0aW5ncyc7XHJcbmltcG9ydCB7XHJcbiAgRElSRUNUSU9OX0tFWV9CSU5ESU5HUyxcclxuICBOT1JUSCxcclxuICBFQVNULFxyXG4gIFNPVVRILFxyXG4gIFdFU1RcclxufSBmcm9tICcuL2NvbnN0YW50cy9kaXJlY3Rpb25zJztcclxuaW1wb3J0IHsgUExBWUVSX01PVkVfU1BFRUQsIFRJTEVfU0laRSwgSEFMRl9USUxFIH0gZnJvbSAnLi9jb25zdGFudHMnO1xyXG5pbXBvcnQgeyBJTkFOSU1BVEUgfSBmcm9tICcuL2NvbnN0YW50cy9lbnRpdGllcyc7XHJcbmltcG9ydCB7IG1vdmVFbnRpdHkgfSBmcm9tICcuL2VudGl0eSc7XHJcbmltcG9ydCB7IGNsZWFyS2V5IH0gZnJvbSAnLi9rZXlib2FyZC1jb250cm9sbGVyJztcclxuaW1wb3J0IHsgZGV0ZWN0RW50aXR5Q29sbGlzaW9uIH0gZnJvbSAnLi9tYXAnO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQge1xyXG4gIFtLRVlfVVBdOiBzdGF0ZSA9PiBtb3ZlUGxheWVyKHN0YXRlLCBLRVlfVVApLFxyXG4gIFtLRVlfUklHSFRdOiBzdGF0ZSA9PiBtb3ZlUGxheWVyKHN0YXRlLCBLRVlfUklHSFQpLFxyXG4gIFtLRVlfRE9XTl06IHN0YXRlID0+IG1vdmVQbGF5ZXIoc3RhdGUsIEtFWV9ET1dOKSxcclxuICBbS0VZX0xFRlRdOiBzdGF0ZSA9PiBtb3ZlUGxheWVyKHN0YXRlLCBLRVlfTEVGVCksXHJcbiAgW0tFWV9BQ1RJT05dOiBzdGF0ZSA9PiBwbGF5ZXJBY3Qoc3RhdGUsIEtFWV9BQ1RJT04pXHJcbn07XHJcblxyXG5mdW5jdGlvbiBtb3ZlUGxheWVyKHN0YXRlLCBrZXkpIHtcclxuICBjb25zdCBkaXJlY3Rpb24gPSBESVJFQ1RJT05fS0VZX0JJTkRJTkdTW2tleV07XHJcblxyXG4gIHN0YXRlLnBsYXllciA9IG1vdmVFbnRpdHkoc3RhdGUucGxheWVyLCBkaXJlY3Rpb24sIFBMQVlFUl9NT1ZFX1NQRUVEKTtcclxufVxyXG5cclxuZnVuY3Rpb24gcGxheWVyQWN0KHN0YXRlLCBrZXkpIHtcclxuICBjbGVhcktleShrZXkpO1xyXG5cclxuICBjb25zdCB0YXJnZXQgPSBmaW5kQWN0aW9uVGFyZ2V0KHN0YXRlKTtcclxuXHJcbiAgaWYgKCF0YXJnZXQgfHwgIXRhcmdldC5hY3RpdmF0ZSkge1xyXG4gICAgcmV0dXJuO1xyXG4gIH1cclxuICBjb25zdCBldmVudCA9IHRhcmdldC5hY3RpdmF0ZSgpO1xyXG5cclxuICBpZiAoZXZlbnQubG9vdCAmJiBldmVudC5sb290LmdvbGQpIHtcclxuICAgIHN0YXRlLmdvbGQgKz0gZXZlbnQubG9vdC5nb2xkO1xyXG4gIH1cclxufVxyXG5mdW5jdGlvbiBmaW5kQWN0aW9uVGFyZ2V0KHN0YXRlKSB7XHJcbiAgY29uc3QgeyB4LCB5LCBkeCwgZHksIGRpcmVjdGlvbiB9ID0gc3RhdGUucGxheWVyO1xyXG4gIGNvbnN0IGVudGl0aWVzID0gc3RhdGUuZW50aXRpZXNbSU5BTklNQVRFXTtcclxuICBjb25zdCBzZWFyY2ggPSBkZWZpbmVTZWFyY2hCb3goeyB4LCB5LCBkeCwgZHkgfSwgZGlyZWN0aW9uKTtcclxuXHJcbiAgcmV0dXJuIGRldGVjdEVudGl0eUNvbGxpc2lvbihlbnRpdGllcywgc2VhcmNoKTtcclxufVxyXG5mdW5jdGlvbiBkZWZpbmVTZWFyY2hCb3gob3JpZ2luLCBkaXJlY3Rpb24pIHtcclxuICBjb25zdCB7IHgsIHkgfSA9IG9yaWdpbjtcclxuXHJcbiAgY29uc3Qgc2VhcmNoID0ge1xyXG4gICAgeCxcclxuICAgIHksXHJcbiAgICBkeDogVElMRV9TSVpFLFxyXG4gICAgZHk6IFRJTEVfU0laRVxyXG4gIH07XHJcbiAgaWYgKGRpcmVjdGlvbiA9PT0gTk9SVEgpIHtcclxuICAgIHNlYXJjaC55IC09IEhBTEZfVElMRTtcclxuICAgIHNlYXJjaC5keSA9IEhBTEZfVElMRTtcclxuICB9XHJcbiAgaWYgKGRpcmVjdGlvbiA9PT0gV0VTVCkge1xyXG4gICAgc2VhcmNoLnggLT0gSEFMRl9USUxFO1xyXG4gICAgc2VhcmNoLmR4ID0gSEFMRl9USUxFO1xyXG4gIH1cclxuICBpZiAoZGlyZWN0aW9uID09PSBTT1VUSCkge1xyXG4gICAgc2VhcmNoLnkgKz0gVElMRV9TSVpFO1xyXG4gICAgc2VhcmNoLmR5ID0gSEFMRl9USUxFO1xyXG4gIH1cclxuICBpZiAoZGlyZWN0aW9uID09PSBFQVNUKSB7XHJcbiAgICBzZWFyY2gueCArPSBUSUxFX1NJWkU7XHJcbiAgICBzZWFyY2guZHggPSBIQUxGX1RJTEU7XHJcbiAgfVxyXG4gIHJldHVybiBzZWFyY2g7XHJcbn1cclxuIiwiLyogZ2xvYmFscyBJbWFnZSAqL1xyXG5pbXBvcnQgeyBUSUxFX1NJWkUgfSBmcm9tICcuL2NvbnN0YW50cyc7XHJcbmltcG9ydCB7IE5PUlRILCBXRVNULCBTT1VUSCwgRUFTVCB9IGZyb20gJy4vY29uc3RhbnRzL2RpcmVjdGlvbnMnO1xyXG5pbXBvcnQgZ29ibGluIGZyb20gJy4vYXNzZXRzL2dvYmxpbi1zcHJpdGUucG5nJztcclxuXHJcbmNvbnN0IHBsYXllckltYWdlID0gbmV3IEltYWdlKCk7XHJcbnBsYXllckltYWdlLnNyYyA9IGdvYmxpbjtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IHtcclxuICB4OiBUSUxFX1NJWkUsXHJcbiAgeTogVElMRV9TSVpFLFxyXG4gIGRpcmVjdGlvbjogU09VVEgsXHJcbiAgZHg6IDEgKiBUSUxFX1NJWkUgLSAxLFxyXG4gIGR5OiAxICogVElMRV9TSVpFIC0gMSxcclxuICBoaXRib3g6ICdjaXJjbGUnLFxyXG4gIHNwcml0ZToge1xyXG4gICAgYXNzZXQ6IHBsYXllckltYWdlLFxyXG4gICAgaW1hZ2VzOiB7XHJcbiAgICAgIFtOT1JUSF06IHsgeDogMCwgeTogMCB9LFxyXG4gICAgICBbRUFTVF06IHsgeDogMzAsIHk6IDAgfSxcclxuICAgICAgW1NPVVRIXTogeyB4OiA2MCwgeTogMCB9LFxyXG4gICAgICBbV0VTVF06IHsgeDogOTAsIHk6IDAgfVxyXG4gICAgfVxyXG4gIH1cclxufTtcclxuIl0sInNvdXJjZVJvb3QiOiIifQ==