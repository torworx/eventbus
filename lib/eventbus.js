var ovy = require('ovy');
    uuid = require('node-uuid'),
    _ = require('underscore');

function wrap(ename, payload) {
    return {
        id:uuid.v4(),
        timestamp:new Date(),
        ename:ename,
        payload:payload
    };
};

var EventBus = ovy.define('EventBus', {
    subscriptions: null,

    constructor: function() {
        this.subscriptions = {};
    },

    subscribe: function (ename, handler, scope) {
        var me = this;
        if (typeof me.subscriptions[ename] != "undefined") {
            me.subscriptions[ename].push({scope:scope, handler:handler});
        } else {
            me.subscriptions[ename] = [
                {scope:scope, handler:handler}
            ];
        }
    },

    unsubscribe: function (ename, handler, scope) {
        var me = this;
        if (typeof me.subscriptions[ename] != "undefined") {
            me.subscriptions[ename] = _.filter(me.subscriptions[ename], function(item) {
                return (item.scope !== scope || item.handler !== handler)
            });
        }
    },

    dispatch: function (ename, data, callback) {
        var me = this,
            event = wrap(ename, data),
            numOfSubs;
        if (typeof me.subscriptions[ename] != "undefined") {
            numOfSubs = me.subscriptions[ename].length;
            for (var i = 0; i < numOfSubs; i++) {
                var listener = me.subscriptions[ename][i];
                if (listener && listener.handler) {
                    listener.handler.call(listener.scope, event.payload, callback);
                }
            }
        }
    },

    events: function () {
        var str = "",
            ename,
            numOfSubs,
            subscription;

        for (ename in this.subscriptions) {
            numOfSubs = this.subscriptions[ename].length;
            for (var i = 0; i < numOfSubs; i++) {
                subscription = this.subscriptions[ename][i];
                str += subscription.scope && subscription.scope.className ? subscription.scope.className : "anonymous";
                str += " handler for '" + ename + "'\n";
            }
        }
        return str;
    }

});

var ebp = EventBus.prototype;
// Alias
ovy.apply(ebp, {
    on: ebp.subscribe,
    un: ebp.unsubscribe
});

exports = module.exports = EventBus;