/* global Metro */
(function(Metro, $) {
    'use strict';
    var Utils = Metro.utils;
    var TouchConst = {
        LEFT : "left",
        RIGHT : "right",
        UP : "up",
        DOWN : "down",
        IN : "in",
        OUT : "out",
        NONE : "none",
        AUTO : "auto",
        SWIPE : "swipe",
        PINCH : "pinch",
        TAP : "tap",
        DOUBLE_TAP : "doubletap",
        LONG_TAP : "longtap",
        HOLD : "hold",
        HORIZONTAL : "horizontal",
        VERTICAL : "vertical",
        ALL_FINGERS : "all",
        DOUBLE_TAP_THRESHOLD : 10,
        PHASE_START : "start",
        PHASE_MOVE : "move",
        PHASE_END : "end",
        PHASE_CANCEL : "cancel",
        SUPPORTS_TOUCH : 'ontouchstart' in window,
        SUPPORTS_POINTER_IE10 : globalThis.navigator.msPointerEnabled && !globalThis.navigator.pointerEnabled && !('ontouchstart' in globalThis),
        SUPPORTS_POINTER : (globalThis.navigator.pointerEnabled || globalThis.navigator.msPointerEnabled) && !('ontouchstart' in globalThis),
        IN_TOUCH: "intouch"
    };

    var TouchDefaultConfig = {
        touchDeferred: 0,
        fingers: 1,
        threshold: 75,
        cancelThreshold: null,
        pinchThreshold: 20,
        maxTimeThreshold: null,
        fingerReleaseThreshold: 250,
        longTapThreshold: 500,
        doubleTapThreshold: 200,
        triggerOnTouchEnd: true,
        triggerOnTouchLeave: false,
        allowPageScroll: "auto",
        fallbackToMouseEvents: true,
        excludedElements: ".no-swipe",
        preventDefaultEvents: true,

        onSwipe: Metro.noop,
        onSwipeLeft: Metro.noop,
        onSwipeRight: Metro.noop,
        onSwipeUp: Metro.noop,
        onSwipeDown: Metro.noop,
        onSwipeStatus: Metro.noop_true, // params: phase, direction, distance, duration, fingerCount, fingerData, currentDirection
        onPinchIn: Metro.noop,
        onPinchOut: Metro.noop,
        onPinchStatus: Metro.noop_true,
        onTap: Metro.noop,
        onDoubleTap: Metro.noop,
        onLongTap: Metro.noop,
        onHold: Metro.noop,

        onTouchCreate: Metro.noop
    };

    Metro.touchSetup = function (options) {
        TouchDefaultConfig = $.extend({}, TouchDefaultConfig, options);
    };

    if (typeof globalThis["metroTouchSetup"] !== undefined) {
        Metro.touchSetup(globalThis["metroTouchSetup"]);
    }

    Metro.Component('touch', {
        init: function( options, elem ) {
            this._super(elem, options, TouchDefaultConfig, {
                useTouchEvents: null,
                START_EV: null,
                MOVE_EV: null,
                END_EV: null,
                LEAVE_EV: null,
                CANCEL_EV: null,

                distance: 0,
                direction: null,
                currentDirection: null,
                duration: 0,
                startTouchesDistance: 0,
                endTouchesDistance: 0,
                pinchZoom: 1,
                pinchDistance: 0,
                pinchDirection: 0,
                maximumsMap: null,

                phase: "start",

                fingerCount: 0,

                fingerData: {},

                startTime: 0,
                endTime: 0,
                previousTouchEndTime: 0,
                fingerCountAtRelease: 0,
                doubleTapStartTime: 0,

                singleTapTimeout: null,
                holdTimeout: null
            });

            return this;
        },

        _create: function(){
            var that = this, element = this.element, o = this.options;

            this.useTouchEvents = (TouchConst.SUPPORTS_TOUCH || TouchConst.SUPPORTS_POINTER || !this.options.fallbackToMouseEvents);
            this.START_EV = this.useTouchEvents ? (TouchConst.SUPPORTS_POINTER ? (TouchConst.SUPPORTS_POINTER_IE10 ? 'MSPointerDown' : 'pointerdown') : 'touchstart') : 'mousedown';
            this.MOVE_EV = this.useTouchEvents ? (TouchConst.SUPPORTS_POINTER ? (TouchConst.SUPPORTS_POINTER_IE10 ? 'MSPointerMove' : 'pointermove') : 'touchmove') : 'mousemove';
            this.END_EV = this.useTouchEvents ? (TouchConst.SUPPORTS_POINTER ? (TouchConst.SUPPORTS_POINTER_IE10 ? 'MSPointerUp' : 'pointerup') : 'touchend') : 'mouseup';
            this.LEAVE_EV = this.useTouchEvents ? (TouchConst.SUPPORTS_POINTER ? 'mouseleave' : null) : 'mouseleave'; //we manually detect leave on touch devices, so null event here
            this.CANCEL_EV = (TouchConst.SUPPORTS_POINTER ? (TouchConst.SUPPORTS_POINTER_IE10 ? 'MSPointerCancel' : 'pointercancel') : 'touchcancel');

            if (o.allowPageScroll === undefined && (o.onSwipe !== Metro.noop || o.onSwipeStatus !== Metro.noop)) {
                o.allowPageScroll = TouchConst.NONE;
            }

            try {
                element.on(this.START_EV, $.bind(this.touchStart, that));
                element.on(this.CANCEL_EV, $.bind(this.touchCancel, that));
            } catch (e) {
                throw new Error('Events not supported ' + this.START_EV + ',' + this.CANCEL_EV + ' on Swipe');
            }

            this._fireEvent("touch-create", {
                element: element
            });
        },

        touchStart: function(e) {
            var element = this.element, options = this.options;

            //If we already in a touch event (a finger already in use) then ignore subsequent ones..
            if (this.getTouchInProgress()) {
                return;
            }

            //Check if this element matches any in the excluded elements selectors,  or its parent is excluded, if so, DON'T swipe
            if ($(e.target).closest(options.excludedElements).length > 0) {
                return;
            }

            //As we use Jquery bind for events, we need to target the original event object
            //If these events are being programmatically triggered, we don't have an original event object, so use the Jq one.
            var event = e;

            var ret,
                touches = event.touches,
                evt = touches ? touches[0] : event;

            this.phase = TouchConst.PHASE_START;

            //If we support touches, get the finger count
            if (touches) {
                // get the total number of fingers touching the screen
                this.fingerCount = touches.length;
            }
            //Else this is the desktop, so stop the browser from dragging content
            else if (options.preventDefaultEvents !== false) {
                e.preventDefault(); //call this on jq event so we are cross browser
            }

            //clear vars..
            this.distance = 0;
            this.direction = null;
            this.currentDirection=null;
            this.pinchDirection = null;
            this.duration = 0;
            this.startTouchesDistance = 0;
            this.endTouchesDistance = 0;
            this.pinchZoom = 1;
            this.pinchDistance = 0;
            this.maximumsMap = this.createMaximumsData();
            this.cancelMultiFingerRelease();

            //Create the default finger data
            this.createFingerData(0, evt);

            // check the number of fingers is what we are looking for, or we are capturing pinches
            if (!touches || (this.fingerCount === options.fingers || options.fingers === TouchConst.ALL_FINGERS) || this.hasPinches()) {
                // get the coordinates of the touch
                this.startTime = this.getTimeStamp();

                if (this.fingerCount === 2) {
                    //Keep track of the initial pinch distance, so we can calculate the diff later
                    //Store second finger data as start
                    this.createFingerData(1, touches[1]);
                    this.startTouchesDistance = this.endTouchesDistance = this.calculateTouchesDistance(this.fingerData[0].start, this.fingerData[1].start);
                }

                if (options.onSwipeStatus !== Metro.noop || options.onPinchStatus !== Metro.noop) {
                    ret = this.triggerHandler(event, this.phase);
                }
            } else {
                //A touch with more or less than the fingers we are looking for, so cancel
                ret = false;
            }

            //If we have a return value from the users handler, then return and cancel
            if (ret === false) {
                this.phase = TouchConst.PHASE_CANCEL;
                this.triggerHandler(event, this.phase);
                return ret;
            } else {
                if (options.onHold !== Metro.noop) {
                    this.holdTimeout = setTimeout($.bind(function() {
                        //Trigger the event
                        element.trigger('hold', [event.target]);
                        //Fire the callback
                        if (options.onHold !== Metro.noop) { // TODO Remove this if
                            ret = Utils.exec(options.onHold, [event, event.target], element[0]);
                            element.fire("hold", {
                                event: event,
                                target: event.target
                            });
                        }
                    }, this), options.longTapThreshold);
                }

                this.setTouchInProgress(true);
            }

            return null;
        },

        touchMove: function(e) {
            //As we use Jquery bind for events, we need to target the original event object
            //If these events are being programmatically triggered, we don't have an original event object, so use the Jq one.
            var event = e;

            //If we are ending, cancelling, or within the threshold of 2 fingers being released, don't track anything..
            if (this.phase === TouchConst.PHASE_END || this.phase === TouchConst.PHASE_CANCEL || this.inMultiFingerRelease())
                return;

            var ret,
                touches = event.touches,
                evt = touches ? touches[0] : event;

            //Update the  finger data
            var currentFinger = this.updateFingerData(evt);
            this.endTime = this.getTimeStamp();

            if (touches) {
                this.fingerCount = touches.length;
            }

            if (this.options.onHold !== Metro.noop) {
                clearTimeout(this.holdTimeout);
            }

            this.phase = TouchConst.PHASE_MOVE;

            //If we have 2 fingers get Touches distance as well
            if (this.fingerCount === 2) {

                //Keep track of the initial pinch distance, so we can calculate the diff later
                //We do this here as well as the start event, in case they start with 1 finger, and the press 2 fingers
                if (this.startTouchesDistance === 0) {
                    //Create second finger if this is the first time...
                    this.createFingerData(1, touches[1]);

                    this.startTouchesDistance = this.endTouchesDistance = this.calculateTouchesDistance(this.fingerData[0].start, this.fingerData[1].start);
                } else {
                    //Else just update the second finger
                    this.updateFingerData(touches[1]);

                    this.endTouchesDistance = this.calculateTouchesDistance(this.fingerData[0].end, this.fingerData[1].end);
                    this.pinchDirection = this.calculatePinchDirection(this.fingerData[0].end, this.fingerData[1].end);
                }

                this.pinchZoom = this.calculatePinchZoom(this.startTouchesDistance, this.endTouchesDistance);
                this.pinchDistance = Math.abs(this.startTouchesDistance - this.endTouchesDistance);
            }

            if ((this.fingerCount === this.options.fingers || this.options.fingers === TouchConst.ALL_FINGERS) || !touches || this.hasPinches()) {

                //The overall direction of the swipe. From start to now.
                this.direction = this.calculateDirection(currentFinger.start, currentFinger.end);

                //The immediate direction of the swipe, direction between the last movement and this one.
                this.currentDirection = this.calculateDirection(currentFinger.last, currentFinger.end);

                //Check if we need to prevent default event (page scroll / pinch zoom) or not
                this.validateDefaultEvent(e, this.currentDirection);

                //Distance and duration are all off the main finger
                this.distance = this.calculateDistance(currentFinger.start, currentFinger.end);
                this.duration = this.calculateDuration();

                //Cache the maximum distance we made in this direction
                this.setMaxDistance(this.direction, this.distance);

                //Trigger status handler
                ret = this.triggerHandler(event, this.phase);


                //If we trigger end events when threshold are met, or trigger events when touch leaves element
                if (!this.options.triggerOnTouchEnd || this.options.triggerOnTouchLeave) {

                    var inBounds = true;

                    //If checking if we leave the element, run the bounds check (we can use touchleave as its not supported on webkit)
                    if (this.options.triggerOnTouchLeave) {
                        var bounds = this.getBounds(this);
                        inBounds = this.isInBounds(currentFinger.end, bounds);
                    }

                    //Trigger end handles as we swipe if thresholds met or if we have left the element if the user has asked to check these..
                    if (!this.options.triggerOnTouchEnd && inBounds) {
                        this.phase = this.getNextPhase(TouchConst.PHASE_MOVE);
                    }
                    //We end if out of bounds here, so set current phase to END, and check if its modified
                    else if (this.options.triggerOnTouchLeave && !inBounds) {
                        this.phase = this.getNextPhase(TouchConst.PHASE_END);
                    }

                    if (this.phase === TouchConst.PHASE_CANCEL || this.phase === TouchConst.PHASE_END) {
                        this.triggerHandler(event, this.phase);
                    }
                }
            } else {
                this.phase = TouchConst.PHASE_CANCEL;
                this.triggerHandler(event, this.phase);
            }

            if (ret === false) {
                this.phase = TouchConst.PHASE_CANCEL;
                this.triggerHandler(event, this.phase);
            }
        },

        touchEnd: function(e) {
            //As we use Jquery bind for events, we need to target the original event object
            //If these events are being programmatically triggered, we don't have an original event object, so use the Jq one.
            var event = e,
                touches = event.touches;

            //If we are still in a touch with the device wait a fraction and see if the other finger comes up
            //if it does within the threshold, then we treat it as a multi release, not a single release and end the touch / swipe
            if (touches) {
                if (touches.length && !this.inMultiFingerRelease()) {
                    this.startMultiFingerRelease(event);
                    return true;
                } else if (touches.length && this.inMultiFingerRelease()) {
                    return true;
                }
            }

            //If a previous finger has been released, check how long ago, if within the threshold, then assume it was a multifinger release.
            //This is used to allow 2 fingers to release fractionally after each other, whilst maintaining the event as containing 2 fingers, not 1
            if (this.inMultiFingerRelease()) {
                this.fingerCount = this.fingerCountAtRelease;
            }

            //Set end of swipe
            this.endTime = this.getTimeStamp();

            //Get duration incase move was never fired
            this.duration = this.calculateDuration();

            //If we trigger handlers at end of swipe OR, we trigger during, but they didnt trigger and we are still in the move phase
            if (this.didSwipeBackToCancel() || !this.validateSwipeDistance()) {
                this.phase = TouchConst.PHASE_CANCEL;
                this.triggerHandler(event, this.phase);
            } else if (this.options.triggerOnTouchEnd || (this.options.triggerOnTouchEnd === false && this.phase === TouchConst.PHASE_MOVE)) {
                //call this on jq event so we are cross browser
                if (this.options.preventDefaultEvents !== false) {
                    e.preventDefault();
                }
                this.phase = TouchConst.PHASE_END;
                this.triggerHandler(event, this.phase);
            }
            //Special cases - A tap should always fire on touch end regardless,
            //So here we manually trigger the tap end handler by itself
            //We dont run trigger handler as it will re-trigger events that may have fired already
            else if (!this.options.triggerOnTouchEnd && this.hasTap()) {
                //Trigger the pinch events...
                this.phase = TouchConst.PHASE_END;
                this.triggerHandlerForGesture(event, this.phase, TouchConst.TAP);
            } else if (this.phase === TouchConst.PHASE_MOVE) {
                this.phase = TouchConst.PHASE_CANCEL;
                this.triggerHandler(event, this.phase);
            }

            this.setTouchInProgress(false);

            return null;
        },

        touchCancel: function() {
            // reset the variables back to default values
            this.fingerCount = 0;
            this.endTime = 0;
            this.startTime = 0;
            this.startTouchesDistance = 0;
            this.endTouchesDistance = 0;
            this.pinchZoom = 1;

            //If we were in progress of tracking a possible multi touch end, then re set it.
            this.cancelMultiFingerRelease();

            this.setTouchInProgress(false);
        },

        touchLeave: function(e) {
            if (this.options.triggerOnTouchLeave) {
                this.phase = this.getNextPhase(TouchConst.PHASE_END);
                this.triggerHandler(e, this.phase);
            }
        },

        getNextPhase: function(currentPhase) {
            var options  = this.options;
            var nextPhase = currentPhase;

            // Ensure we have valid swipe (under time and over distance  and check if we are out of bound...)
            var validTime = this.validateSwipeTime();
            var validDistance = this.validateSwipeDistance();
            var didCancel = this.didSwipeBackToCancel();

            //If we have exceeded our time, then cancel
            if (!validTime || didCancel) {
                nextPhase = TouchConst.PHASE_CANCEL;
            }
            //Else if we are moving, and have reached distance then end
            else if (validDistance && currentPhase === TouchConst.PHASE_MOVE && (!options.triggerOnTouchEnd || options.triggerOnTouchLeave)) {
                nextPhase = TouchConst.PHASE_END;
            }
            //Else if we have ended by leaving and didn't reach distance, then cancel
            else if (!validDistance && currentPhase === TouchConst.PHASE_END && options.triggerOnTouchLeave) {
                nextPhase = TouchConst.PHASE_CANCEL;
            }

            return nextPhase;
        },

        triggerHandler: function(event, phase) {
            var ret,
                touches = event.touches;

            // SWIPE GESTURES
            if (this.didSwipe() || this.hasSwipes()) {
                ret = this.triggerHandlerForGesture(event, phase, TouchConst.SWIPE);
            }

            // PINCH GESTURES (if the above didn't cancel)
            if ((this.didPinch() || this.hasPinches()) && ret !== false) {
                ret = this.triggerHandlerForGesture(event, phase, TouchConst.PINCH);
            }

            // CLICK / TAP (if the above didn't cancel)
            if (this.didDoubleTap() && ret !== false) {
                //Trigger the tap events...
                ret = this.triggerHandlerForGesture(event, phase, TouchConst.DOUBLE_TAP);
            }

            // CLICK / TAP (if the above didn't cancel)
            else if (this.didLongTap() && ret !== false) {
                //Trigger the tap events...
                ret = this.triggerHandlerForGesture(event, phase, TouchConst.LONG_TAP);
            }

            // CLICK / TAP (if the above didn't cancel)
            else if (this.didTap() && ret !== false) {
                //Trigger the tap event..
                ret = this.triggerHandlerForGesture(event, phase, TouchConst.TAP);
            }

            // If we are cancelling the gesture, then manually trigger the reset handler
            if (phase === TouchConst.PHASE_CANCEL) {
                this.touchCancel(event);
            }

            // If we are ending the gesture, then manually trigger the reset handler IF all fingers are off
            if (phase === TouchConst.PHASE_END) {
                //If we support touch, then check that all fingers are off before we cancel
                if (touches) {
                    if (!touches.length) {
                        this.touchCancel(event);
                    }
                } else {
                    this.touchCancel(event);
                }
            }

            return ret;
        },

        triggerHandlerForGesture: function(event, phase, gesture) {

            var ret, element = this.element, options = this.options;

            //SWIPES....
            if (gesture === TouchConst.SWIPE) {
                //Trigger status every time..
                element.trigger('swipeStatus', [phase, this.direction || null, this.distance || 0, this.duration || 0, this.fingerCount, this.fingerData, this.currentDirection]);

                ret = Utils.exec(options.onSwipeStatus, [event, phase, this.direction || null, this.distance || 0, this.duration || 0, this.fingerCount, this.fingerData, this.currentDirection], element[0]);
                element.fire("swipestatus", {
                    event: event,
                    phase: phase,
                    direction: this.direction,
                    distance: this.distance,
                    duration: this.duration,
                    fingerCount: this.fingerCount,
                    fingerData: this.fingerData,
                    currentDirection: this.currentDirection
                });
                if (ret === false) return false;

                if (phase === TouchConst.PHASE_END && this.validateSwipe()) {

                    //Cancel any taps that were in progress...
                    clearTimeout(this.singleTapTimeout);
                    clearTimeout(this.holdTimeout);

                    element.trigger('swipe', [this.direction, this.distance, this.duration, this.fingerCount, this.fingerData, this.currentDirection]);

                    ret = Utils.exec(options.onSwipe, [event, this.direction, this.distance, this.duration, this.fingerCount, this.fingerData, this.currentDirection], element[0]);
                    element.fire("swipe", {
                        event: event,
                        direction: this.direction,
                        distance: this.distance,
                        duration: this.duration,
                        fingerCount: this.fingerCount,
                        fingerData: this.fingerData,
                        currentDirection: this.currentDirection
                    });

                    if (ret === false) return false;

                    //trigger direction specific event handlers
                    switch (this.direction) {
                        case TouchConst.LEFT:
                            element.trigger('swipeLeft', [this.direction, this.distance, this.duration, this.fingerCount, this.fingerData, this.currentDirection]);
                            ret = Utils.exec(options.onSwipeLeft, [event, this.direction, this.distance, this.duration, this.fingerCount, this.fingerData, this.currentDirection], element[0]);
                            element.fire("swipeleft", {
                                event: event,
                                direction: this.direction,
                                distance: this.distance,
                                duration: this.duration,
                                fingerCount: this.fingerCount,
                                fingerData: this.fingerData,
                                currentDirection: this.currentDirection
                            });
                            break;

                        case TouchConst.RIGHT:
                            element.trigger('swipeRight', [this.direction, this.distance, this.duration, this.fingerCount, this.fingerData, this.currentDirection]);
                            ret = Utils.exec(options.onSwipeRight, [event, this.direction, this.distance, this.duration, this.fingerCount, this.fingerData, this.currentDirection], element[0]);
                            element.fire("swiperight", {
                                event: event,
                                direction: this.direction,
                                distance: this.distance,
                                duration: this.duration,
                                fingerCount: this.fingerCount,
                                fingerData: this.fingerData,
                                currentDirection: this.currentDirection
                            });
                            break;

                        case TouchConst.UP:
                            element.trigger('swipeUp', [this.direction, this.distance, this.duration, this.fingerCount, this.fingerData, this.currentDirection]);
                            ret = Utils.exec(options.onSwipeUp, [event, this.direction, this.distance, this.duration, this.fingerCount, this.fingerData, this.currentDirection], element[0]);
                            element.fire("swipeup", {
                                event: event,
                                direction: this.direction,
                                distance: this.distance,
                                duration: this.duration,
                                fingerCount: this.fingerCount,
                                fingerData: this.fingerData,
                                currentDirection: this.currentDirection
                            });
                            break;

                        case TouchConst.DOWN:
                            element.trigger('swipeDown', [this.direction, this.distance, this.duration, this.fingerCount, this.fingerData, this.currentDirection]);
                            ret = Utils.exec(options.onSwipeDown, [event, this.direction, this.distance, this.duration, this.fingerCount, this.fingerData, this.currentDirection], element[0]);
                            element.fire("swipedown", {
                                event: event,
                                direction: this.direction,
                                distance: this.distance,
                                duration: this.duration,
                                fingerCount: this.fingerCount,
                                fingerData: this.fingerData,
                                currentDirection: this.currentDirection
                            });
                            break;
                    }
                }
            }


            //PINCHES....
            if (gesture === TouchConst.PINCH) {
                element.trigger('pinchStatus', [phase, this.pinchDirection || null, this.pinchDistance || 0, this.duration || 0, this.fingerCount, this.fingerData, this.pinchZoom]);

                ret = Utils.exec(options.onPinchStatus, [event, phase, this.pinchDirection || null, this.pinchDistance || 0, this.duration || 0, this.fingerCount, this.fingerData, this.pinchZoom], element[0]);
                element.fire("pinchstatus", {
                    event: event,
                    phase: phase,
                    direction: this.pinchDirection,
                    distance: this.pinchDistance,
                    duration: this.duration,
                    fingerCount: this.fingerCount,
                    fingerData: this.fingerData,
                    zoom: this.pinchZoom
                });
                if (ret === false) return false;

                if (phase === TouchConst.PHASE_END && this.validatePinch()) {

                    switch (this.pinchDirection) {
                        case TouchConst.IN:
                            element.trigger('pinchIn', [this.pinchDirection || null, this.pinchDistance || 0, this.duration || 0, this.fingerCount, this.fingerData, this.pinchZoom]);
                            ret = Utils.exec(options.onPinchIn, [event, this.pinchDirection || null, this.pinchDistance || 0, this.duration || 0, this.fingerCount, this.fingerData, this.pinchZoom], element[0]);
                            element.fire("pinchin", {
                                event: event,
                                direction: this.pinchDirection,
                                distance: this.pinchDistance,
                                duration: this.duration,
                                fingerCount: this.fingerCount,
                                fingerData: this.fingerData,
                                zoom: this.pinchZoom
                            });
                            break;

                        case TouchConst.OUT:
                            element.trigger('pinchOut', [this.pinchDirection || null, this.pinchDistance || 0, this.duration || 0, this.fingerCount, this.fingerData, this.pinchZoom]);
                            ret = Utils.exec(options.onPinchOut, [event, this.pinchDirection || null, this.pinchDistance || 0, this.duration || 0, this.fingerCount, this.fingerData, this.pinchZoom], element[0]);
                            element.fire("pinchout", {
                                event: event,
                                direction: this.pinchDirection,
                                distance: this.pinchDistance,
                                duration: this.duration,
                                fingerCount: this.fingerCount,
                                fingerData: this.fingerData,
                                zoom: this.pinchZoom
                            });
                            break;
                    }
                }
            }

            if (gesture === TouchConst.TAP) {
                if (phase === TouchConst.PHASE_CANCEL || phase === TouchConst.PHASE_END) {

                    clearTimeout(this.singleTapTimeout);
                    clearTimeout(this.holdTimeout);

                    //If we are also looking for doubelTaps, wait incase this is one...
                    if (this.hasDoubleTap() && !this.inDoubleTap()) {
                        this.doubleTapStartTime = this.getTimeStamp();

                        //Now wait for the double tap timeout, and trigger this single tap
                        //if its not cancelled by a double tap
                        this.singleTapTimeout = setTimeout($.bind(function() {
                            this.doubleTapStartTime = null;
                            ret = Utils.exec(options.onTap, [event, event.target], element[0]);
                            element.fire("tap", {
                                event: event,
                                target: event.target
                            });
                        }, this), options.doubleTapThreshold);

                    } else {
                        this.doubleTapStartTime = null;
                        ret = Utils.exec(options.onTap, [event, event.target], element[0]);
                        element.fire("tap", {
                            event: event,
                            target: event.target
                        });
                    }
                }
            } else if (gesture === TouchConst.DOUBLE_TAP) {
                if (phase === TouchConst.PHASE_CANCEL || phase === TouchConst.PHASE_END) {
                    clearTimeout(this.singleTapTimeout);
                    clearTimeout(this.holdTimeout);
                    this.doubleTapStartTime = null;

                    ret = Utils.exec(options.onDoubleTap, [event, event.target], element[0]);
                    element.fire("doubletap", {
                        event: event,
                        target: event.target
                    });
                }
            } else if (gesture === TouchConst.LONG_TAP) {
                if (phase === TouchConst.PHASE_CANCEL || phase === TouchConst.PHASE_END) {
                    clearTimeout(this.singleTapTimeout);
                    this.doubleTapStartTime = null;

                    ret = Utils.exec(options.onLongTap, [event, event.target], element[0]);
                    element.fire("longtap", {
                        event: event,
                        target: event.target
                    });
                }
            }

            return ret;
        },

        validateSwipeDistance: function() {
            var valid = true;
            //If we made it past the min swipe distance..
            if (this.options.threshold !== null) {
                valid = this.distance >= this.options.threshold;
            }

            return valid;
        },

        didSwipeBackToCancel: function() {
            var options = this.options;
            var cancelled = false;
            if (options.cancelThreshold !== null && this.direction !== null) {
                cancelled = (this.getMaxDistance(this.direction) - this.distance) >= options.cancelThreshold;
            }

            return cancelled;
        },

        validatePinchDistance: function() {
            if (this.options.pinchThreshold !== null) {
                return this.pinchDistance >= this.options.pinchThreshold;
            }
            return true;
        },

        validateSwipeTime: function() {
            var result, options = this.options;

            if (options.maxTimeThreshold) {
                result = this.duration < options.maxTimeThreshold;
            } else {
                result = true;
            }

            return result;
        },

        validateDefaultEvent: function(e, direction) {
            var options = this.options;

            //If the option is set, allways allow the event to bubble up (let user handle weirdness)
            if (options.preventDefaultEvents === false) {
                return;
            }

            if (options.allowPageScroll === TouchConst.NONE) {
                e.preventDefault();
            } else {
                var auto = options.allowPageScroll === TouchConst.AUTO;

                switch (direction) {
                    case TouchConst.LEFT:
                        if ((options.onSwipeLeft !== Metro.noop && auto) || (!auto && options.allowPageScroll.toLowerCase() !== TouchConst.HORIZONTAL)) {
                            e.preventDefault();
                        }
                        break;

                    case TouchConst.RIGHT:
                        if ((options.onSwipeRight !== Metro.noop && auto) || (!auto && options.allowPageScroll.toLowerCase() !== TouchConst.HORIZONTAL)) {
                            e.preventDefault();
                        }
                        break;

                    case TouchConst.UP:
                        if ((options.onSwipeUp !== Metro.noop && auto) || (!auto && options.allowPageScroll.toLowerCase() !== TouchConst.VERTICAL)) {
                            e.preventDefault();
                        }
                        break;

                    case TouchConst.DOWN:
                        if ((options.onSwipeDown !== Metro.noop && auto) || (!auto && options.allowPageScroll.toLowerCase() !== TouchConst.VERTICAL)) {
                            e.preventDefault();
                        }
                        break;

                    case TouchConst.NONE:

                        break;
                }
            }
        },

        validatePinch: function() {
            var hasCorrectFingerCount = this.validateFingers();
            var hasEndPoint = this.validateEndPoint();
            var hasCorrectDistance = this.validatePinchDistance();
            return hasCorrectFingerCount && hasEndPoint && hasCorrectDistance;
        },

        hasPinches: function() {
            //Enure we dont return 0 or null for false values
            return !!(this.options.onPinchStatus || this.options.onPinchIn || this.options.onPinchOut);
        },

        didPinch: function() {
            //Enure we dont return 0 or null for false values
            return !!(this.validatePinch() && this.hasPinches());
        },

        validateSwipe: function() {
            //Check validity of swipe
            var hasValidTime = this.validateSwipeTime();
            var hasValidDistance = this.validateSwipeDistance();
            var hasCorrectFingerCount = this.validateFingers();
            var hasEndPoint = this.validateEndPoint();
            var didCancel = this.didSwipeBackToCancel();

            // if the user swiped more than the minimum length, perform the appropriate action
            // hasValidDistance is null when no distance is set
            return !didCancel && hasEndPoint && hasCorrectFingerCount && hasValidDistance && hasValidTime;
        },

        hasSwipes: function() {
            var o = this.options;
            //Enure we dont return 0 or null for false values
            return !!(
                o.onSwipe !== Metro.noop
                || o.onSwipeStatus  !== Metro.noop
                || o.onSwipeLeft  !== Metro.noop
                || o.onSwipeRight  !== Metro.noop
                || o.onSwipeUp  !== Metro.noop
                || o.onSwipeDown !== Metro.noop
            );
        },

        didSwipe: function() {
            //Enure we dont return 0 or null for false values
            return !!(this.validateSwipe() && this.hasSwipes());
        },

        validateFingers: function() {
            //The number of fingers we want were matched, or on desktop we ignore
            return ((this.fingerCount === this.options.fingers || this.options.fingers === TouchConst.ALL_FINGERS) || !TouchConst.SUPPORTS_TOUCH);
        },

        validateEndPoint: function() {
            //We have an end value for the finger
            return this.fingerData[0].end.x !== 0;
        },

        hasTap: function() {
            //Enure we dont return 0 or null for false values
            return this.options.onTap !== Metro.noop;
        },

        hasDoubleTap: function() {
            //Enure we dont return 0 or null for false values
            return this.options.onDoubleTap !== Metro.noop;
        },

        hasLongTap: function() {
            //Enure we dont return 0 or null for false values
            return this.options.onLongTap !== Metro.noop;
        },

        validateDoubleTap: function() {
            if (this.doubleTapStartTime == null) {
                return false;
            }
            var now = this.getTimeStamp();
            return (this.hasDoubleTap() && ((now - this.doubleTapStartTime) <= this.options.doubleTapThreshold));
        },

        inDoubleTap: function() {
            return this.validateDoubleTap();
        },

        validateTap: function() {
            return ((this.fingerCount === 1 || !TouchConst.SUPPORTS_TOUCH) && (isNaN(this.distance) || this.distance < this.options.threshold));
        },

        validateLongTap: function() {
            var options = this.options;
            //slight threshold on moving finger
            return ((this.duration > options.longTapThreshold) && (this.distance < TouchConst.DOUBLE_TAP_THRESHOLD)); // check double_tab_threshold where from
        },

        didTap: function() {
            //Enure we dont return 0 or null for false values
            return !!(this.validateTap() && this.hasTap());
        },

        didDoubleTap: function() {
            //Enure we dont return 0 or null for false values
            return !!(this.validateDoubleTap() && this.hasDoubleTap());
        },

        didLongTap: function() {
            //Enure we dont return 0 or null for false values
            return !!(this.validateLongTap() && this.hasLongTap());
        },

        startMultiFingerRelease: function(event) {
            this.previousTouchEndTime = this.getTimeStamp();
            this.fingerCountAtRelease = event.touches.length + 1;
        },

        cancelMultiFingerRelease: function() {
            this.previousTouchEndTime = 0;
            this.fingerCountAtRelease = 0;
        },

        inMultiFingerRelease: function() {
            var withinThreshold = false;

            if (this.previousTouchEndTime) {
                var diff = this.getTimeStamp() - this.previousTouchEndTime;
                if (diff <= this.options.fingerReleaseThreshold) {
                    withinThreshold = true;
                }
            }

            return withinThreshold;
        },

        getTouchInProgress: function() {
            var element = this.element;
            //strict equality to ensure only true and false are returned
            return (element.data('intouch') === true);
        },

        setTouchInProgress: function(val) {
            var element = this.element;

            //If destroy is called in an event handler, we have no el, and we have already cleaned up, so return.
            if(!element) { return; }

            //Add or remove event listeners depending on touch status
            if (val === true) {
                element.on(this.MOVE_EV, $.bind(this.touchMove, this));
                element.on(this.END_EV, $.bind(this.touchEnd, this));

                //we only have leave events on desktop, we manually calcuate leave on touch as its not supported in webkit
                if (this.LEAVE_EV) {
                    element.on(this.LEAVE_EV, $.bind(this.touchLeave, this));
                }
            } else {

                element.off(this.MOVE_EV);
                element.off(this.END_EV);

                //we only have leave events on desktop, we manually calcuate leave on touch as its not supported in webkit
                if (this.LEAVE_EV) {
                    element.off(this.LEAVE_EV);
                }
            }

            //strict equality to ensure only true and false can update the value
            element.data('intouch', val === true);
        },

        createFingerData: function(id, evt) {
            var f = {
                start: {
                    x: 0,
                    y: 0
                },
                last: {
                    x: 0,
                    y: 0
                },
                end: {
                    x: 0,
                    y: 0
                }
            };
            f.start.x = f.last.x = f.end.x = evt.pageX || evt.clientX;
            f.start.y = f.last.y = f.end.y = evt.pageY || evt.clientY;
            this.fingerData[id] = f;
            return f;
        },

        updateFingerData: function(evt) {
            var id = evt.identifier !== undefined ? evt.identifier : 0;
            var f = this.getFingerData(id);

            if (f === null) {
                f = this.createFingerData(id, evt);
            }

            f.last.x = f.end.x;
            f.last.y = f.end.y;

            f.end.x = evt.pageX || evt.clientX;
            f.end.y = evt.pageY || evt.clientY;

            return f;
        },

        getFingerData: function(id) {
            return this.fingerData[id] || null;
        },

        setMaxDistance: function(direction, distance) {
            if (direction === TouchConst.NONE) return;
            distance = Math.max(distance, this.getMaxDistance(direction));
            this.maximumsMap[direction].distance = distance;
        },

        getMaxDistance: function(direction) {
            return (this.maximumsMap[direction]) ? this.maximumsMap[direction].distance : undefined;
        },

        createMaximumsData: function() {
            var maxData = {};
            maxData[TouchConst.LEFT] = this.createMaximumVO(TouchConst.LEFT);
            maxData[TouchConst.RIGHT] = this.createMaximumVO(TouchConst.RIGHT);
            maxData[TouchConst.UP] = this.createMaximumVO(TouchConst.UP);
            maxData[TouchConst.DOWN] = this.createMaximumVO(TouchConst.DOWN);

            return maxData;
        },

        createMaximumVO: function(dir) {
            return {
                direction: dir,
                distance: 0
            }
        },

        calculateDuration: function(){
            return this.endTime - this.startTime;
        },

        calculateTouchesDistance: function(startPoint, endPoint){
            var diffX = Math.abs(startPoint.x - endPoint.x);
            var diffY = Math.abs(startPoint.y - endPoint.y);

            return Math.round(Math.sqrt(diffX * diffX + diffY * diffY));
        },

        calculatePinchZoom: function(startDistance, endDistance){
            var percent = (endDistance / startDistance) * 100; // 1 ? 100
            return percent.toFixed(2);
        },

        calculatePinchDirection: function(){
            if (this.pinchZoom < 1) {
                return TouchConst.OUT;
            } else {
                return TouchConst.IN;
            }
        },

        calculateDistance: function(startPoint, endPoint){
            return Math.round(Math.sqrt(Math.pow(endPoint.x - startPoint.x, 2) + Math.pow(endPoint.y - startPoint.y, 2)));
        },

        calculateAngle: function(startPoint, endPoint){
            var x = startPoint.x - endPoint.x;
            var y = endPoint.y - startPoint.y;
            var r = Math.atan2(y, x); //radians
            var angle = Math.round(r * 180 / Math.PI); //degrees

            //ensure value is positive
            if (angle < 0) {
                angle = 360 - Math.abs(angle);
            }

            return angle;
        },

        calculateDirection: function(startPoint, endPoint){
            if( this.comparePoints(startPoint, endPoint) ) {
                return TouchConst.NONE;
            }

            var angle = this.calculateAngle(startPoint, endPoint);

            if ((angle <= 45) && (angle >= 0)) {
                return TouchConst.LEFT;
            } else if ((angle <= 360) && (angle >= 315)) {
                return TouchConst.LEFT;
            } else if ((angle >= 135) && (angle <= 225)) {
                return TouchConst.RIGHT;
            } else if ((angle > 45) && (angle < 135)) {
                return TouchConst.DOWN;
            } else {
                return TouchConst.UP;
            }
        },

        getTimeStamp: function(){
            return (new Date()).getTime();
        },

        getBounds: function (el) {
            el = $(el);
            var offset = el.offset();

            return {
                left: offset.left,
                right: offset.left + el.outerWidth(),
                top: offset.top,
                bottom: offset.top + el.outerHeight()
            };
        },

        isInBounds: function(point, bounds){
            return (point.x > bounds.left && point.x < bounds.right && point.y > bounds.top && point.y < bounds.bottom);
        },

        comparePoints: function(pointA, pointB) {
            return (pointA.x === pointB.x && pointA.y === pointB.y);
        },

        removeListeners: function() {
            var element = this.element;

            element.off(this.START_EV);
            element.off(this.CANCEL_EV);
            element.off(this.MOVE_EV);
            element.off(this.END_EV);

            //we only have leave events on desktop, we manually calculate leave on touch as its not supported in webkit
            if (this.LEAVE_EV) {
                element.off(this.LEAVE_EV);
            }

            this.setTouchInProgress(false);
        },

        enable: function(){
            this.disable();
            this.element.on(this.START_EV, this.touchStart);
            this.element.on(this.CANCEL_EV, this.touchCancel);
            return this.element;
        },

        disable: function(){
            this.removeListeners();
            return this.element;
        },

        changeAttribute: function(){
        },

        destroy: function(){
            this.removeListeners();
        }
    });

    Metro['touch'] = TouchConst;
}(Metro, Dom));