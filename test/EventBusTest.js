var expect = require('expect.js'),
    EventBus = require('../index').EventBus;

describe('EventBus', function(){
    describe('Base', function() {

        var Accounts = {
            handlers: {
                create_user: function(user, callback) {
                    console.log('Created user: ' + user);
                    callback(null, user);
                }
            }
        };

        it('#subscribe', function() {
            var bus = new EventBus();
            bus.subscribe('create_user', Accounts.handlers.create_user, Accounts);
            var subscriptionArray = bus.subscriptions['create_user'];
            expect(subscriptionArray).to.be.ok();
            expect(subscriptionArray.length).to.be(1);
            var subscription = subscriptionArray[0];
            expect(subscription.handler).to.eql(Accounts.handlers.create_user);
            expect(subscription.scope).to.eql(Accounts);
        });


        it('#on', function() {
            var bus = new EventBus();
            bus.on('create_user', Accounts.handlers.create_user, Accounts);
            var subscriptionArray = bus.subscriptions['create_user'];
            expect(subscriptionArray).to.be.ok();
            expect(subscriptionArray.length).to.be(1);
            var subscription = subscriptionArray[0];
            expect(subscription.handler).to.eql(Accounts.handlers.create_user);
            expect(subscription.scope).to.eql(Accounts);
        })

        it('#unsubscribe', function() {
            var bus = new EventBus();
            bus.subscribe('create_user', Accounts.handlers.create_user, Accounts);
            var subscriptionArray = bus.subscriptions['create_user'];
            expect(subscriptionArray).to.be.ok();
            expect(subscriptionArray.length).to.be(1);
            bus.unsubscribe('create_user', Accounts.handlers.create_user, Accounts);
            subscriptionArray = bus.subscriptions['create_user'];
            if (subscriptionArray) {
                expect(subscriptionArray.length).to.be(0);
            }
        });

        it('#un', function() {
            var bus = new EventBus();
            bus.subscribe('create_user', Accounts.handlers.create_user, Accounts);
            var subscriptionArray = bus.subscriptions['create_user'];
            expect(subscriptionArray).to.be.ok();
            expect(subscriptionArray.length).to.be(1);
            bus.un('create_user', Accounts.handlers.create_user, Accounts);
            subscriptionArray = bus.subscriptions['create_user'];
            if (subscriptionArray) {
                expect(subscriptionArray.length).to.be(0);
            }
        });

        it('#dispatch', function(done){
            var bus = new EventBus();
            var user = {name: 'taoyuan', email: 'torworx@gmail.com', password: '123456'};
            bus.subscribe('create_user', Accounts.handlers.create_user);
            bus.dispatch('create_user', user,
                function(err, user_created){
                    expect(err).to.be(null);
                    expect(user).to.eql(user_created);
                    done();
                }
            );
        });

    })
})