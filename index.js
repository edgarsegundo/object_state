/*!
 * object_state
 * Copyright(c) 2021 Edgar R de Paula
 * MIT Licensed
 */

'use strict'

module.exports.create = create

function create() {
    return ObjectState();
}

function ObjectState() {
    var _statePrevious = undefined;
    var _stateCurrent = undefined;
    var _states = [];
    var _transitions = {};

    return {
        populateStates: function(states) {
            for (let key in states) {
                if (states.hasOwnProperty(key))
                    _states.push(states[key]);
                }
        },
        addState: function (state) {
            return _states.push(state);
        },
        addTransition : function (state, event, action) {
            if(state instanceof Array || event instanceof Array) {
                let listState;
                let listEvent;
    
                if (state instanceof Array) {
                    listState = state;
                } else { listState = [state];
                }
    
                if (event instanceof Array) {
                    listEvent = event;
                } else { listEvent = [event];
                }
    
                listState.forEach((stateElem) => {
                    listEvent.forEach((eventElem) => {
                        this.addTransition(stateElem, eventElem, action);
                    });
                });
            }
            else {
                let events = {};
                if (!_transitions.hasOwnProperty(state)) {
                    events[event] = action;
                    _transitions[state] = events;
                } else {
                    events = _transitions[state];
                    events[event] = action;
                }
            }
        },
        fire: async function (event, obj) {
            if (_transitions.hasOwnProperty(_stateCurrent)) {
                let events = _transitions[_stateCurrent];    
                if (events.hasOwnProperty(event)) {
                    // await list[i](obj, _stateCurrent, event);
                    await list[i].call(this, obj, _stateCurrent, event);
                    return true;
                }
            }
            return false;
        },
        setState: function (state, changeCallback) {
            _statePrevious = _stateCurrent;
            _stateCurrent = state;         
            if (changeCallback) {
                changeCallback(_stateCurrent, _statePrevious);
            }
        },    
        getStateCurrent: function() {
            return _stateCurrent;
        },
        getStatePrevious: function() {
            return _statePrevious;
        }    
    }
}