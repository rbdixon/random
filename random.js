if (Meteor.isClient) {
  Numbers = new Meteor.Collection("numbers");
  Meteor.autosubscribe(function () {
    Meteor.subscribe("random-numbers", null);
  });

  Template.hello.random = function () {
    return Numbers.findOne() ? Numbers.findOne().number : -1;
  };

  Template.hello.clients = function () {
    return Numbers.findOne() ? Numbers.findOne().clients : -1;
  }

  Template.status.connected = function () {
    return Meteor.status().connected ? "connected" : "not connected";
  }

  Template.status.status = function () {
    return Meteor.status().status;
  }

  Template.status.retryCount = function () {
    return Meteor.status().retryCount;
  }

  Template.status.retryTime = function () {
    return Meteor.status().connected ? 0: Meteor.status().retryTime - (new Date()).getTime();
  }
}

if (Meteor.isServer) {
  var r = -2;
  var clients = 0;

  Meteor.setInterval(function () {
    r = Math.random();
  }, 250);

  Meteor.startup(function () {
    // code to run on server at startup
  });

  Meteor.publish("random-numbers", function() {
    var self = this;
    var uuid = Meteor.uuid();

    clients = clients+1;

    var timerId = Meteor.setInterval(function () {
      // var r = Math.random();
      console.log(uuid + ": " + r);
      self.set("numbers", 1, {number: r, clients: clients});
      self.flush();
    }, 1000);
    self.set("numbers", 1, {number: 1})
    self.complete();
    self.flush();

    self.onStop(function (){
      clients = clients - 1;
      Meteor.clearInterval(timerId);
    });
  });
}
