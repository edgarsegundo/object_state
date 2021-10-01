/*!
 * object_state
 * Copyright(c) 2021 Edgar R de Paula
 * MIT Licensed
 */

'use strict'

module.exports.create = create

function ObjectState() {
    var _statePrevious = undefined
    var _stateCurrent = undefined
    var _states = []
    var _transitions = {}

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
                    let list = [];
                    list.push(action);
                    events[event] = list;
                    _transitions[state] = events;
                } else {
                    events = _transitions[state];
                    if (!events.hasOwnProperty(event)) {
                        let list = [];
                        list.push(action);
                        events[event] = list;
                    } else {
                        let list = events[event];
                        list.push(action);
                    }
                }
            }
        },
        fire: async function (event, obj) {
            try {
                if (_transitions.hasOwnProperty(_stateCurrent)) {
                    let events = _transitions[_stateCurrent];    
                    if (events.hasOwnProperty(event)) {
                      let list = events[event];    
                      for (let i = 0; i < list.length; i += 1) {
                        await list[i](obj, _stateCurrent, event);
                      }
                      return true;
                    }
                  }
            } catch (error) {
                htmlLog(error)
            }
            return false;
        },
        setState: function (state, changeCallback) {
            try {
                _statePrevious = _stateCurrent;
                _stateCurrent = state;         
                if (changeCallback) {
                    changeCallback(_stateCurrent, _statePrevious)
                }
            } catch (error) {
                htmlLog(error)
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

function create() {
    return ObjectState()
}

function htmlLog(error) {
    console.log(error)
    // var elem = document.createElement('div');
    // elem.classList.add("fixed")
    // elem.innerHTML = `<strong>An error happened&nbsp:&nbsp</strong>${error}</div>`

    // // ee.on('log:error', (error) => {
    // //     htmlLog(error)
    // // });

    // // I need to remove the fixed 
    // // document.getElementsByClassName('fixed')

    // document.body.parentNode.removeChild(elem)
    // document.body.appendChild(elem)
}
