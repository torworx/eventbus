var uuid = require('node-uuid'),
    _ = require('underscore');

function wrap(ename, payload) {
    return {
        id:uuid.v4(),
        timestamp:new Date(),
        ename:ename,
        payload:payload
    };
};

function EventBus() {
    this.subscriptions = {};
}

EventBus.prototype.on = EventBus.prototype.subscribe = function (ename, handler, scope) {
    var me = this;
    if (typeof me.subscriptions[ename] != "undefined") {
        me.subscriptions[ename].push({scope:scope, handler:handler});
    } else {
        me.subscriptions[ename] = [
            {scope:scope, handler:handler}
        ];
    }
};

EventBus.prototype.un = EventBus.prototype.unsubscribe = function (ename, handler, scope) {
    if (typeof this.subscriptions[ename] != "undefined") {
        this.subscriptions[ename] = _.filter(this.subscriptions[ename], function(item) {
            return (item.scope !== scope || item.handler !== handler)
        });
    }
};

EventBus.prototype.dispatch = function (ename, data, callback) {
    var event = wrap(ename, data),
        numOfSubs;
    if (typeof this.subscriptions[ename] != "undefined") {
        numOfSubs = this.subscriptions[ename].length;
        for (var i = 0; i < numOfSubs; i++) {
            var listener = this.subscriptions[ename][i];
            if (listener && listener.handler) {
                listener.handler.call(listener.scope, event, callback);
            }
        }
    }
};

EventBus.prototype.dump = function () {
    var str = "",
        ename,
        numOfSubs,
        subscription;

    for (ename in this.subscriptions) {
        numOfSubs = this.subscriptions[ename].length;
        for (var i = 0; i < numOfSubs; i++) {
            subscription = this.subscriptions[ename][i];
            str += subscription.scope && subscription.scope.className ? subscription.scope.className : "anonymous";
            str += " listen for '" + ename + "'\n";
        }
    }
    return str;
};

exports = module.exports = EventBus;