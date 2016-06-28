if (Meteor.isClient) {

    Accounts.ui.config({
      passwordSignupFields: 'USERNAME_ONLY'
    });

    Meteor.subscribe('userData');

    Template.hello.user = function(){
      return Meteor.user();
    };

    Template.hello.items=function(){
      return [{name:"Buy Online Courses",cost:1000,icon:"graduation-cap",kw:"courses",dps:2},
            {name:"Hire Junior Programmer",cost:2000,icon:"user-plus",kw:"jprog",dps:4},
            {name:"Hire Marketing Professional",cost:4000,icon:"shopping-cart",kw:"market",dps:8},
            {name:"Hire Lawyer",cost:8000,icon:"legal",kw:"law",dps:16},
            {name:"Hire Team",cost:25000,icon:"group",kw:"team",dps:50},
            {name:"your product",cost:30000,icon:"trademark",kw:"tm",dps:60},
            {name:"Invest in ads",cost:60000,icon:"tv",kw:"ad",dps:120},
            {name:"Rent an incubator",cost:100000, icon:"home",kw:"inc",dps:200},
            {name:"Create Reliable Servers",cost:300000,icon:"server",kw:"serv",dps:600},
            {name:"Buy HQ",cost:1000000,icon:"institution",kw:"hq",dps:2000},
            {name:"Buy Company",cost:5000000,icon:"money",kw:"comp",dps:10000}];
    };

    Template.hello.events({
      'click button.code' : function(){
        Meteor.call('click');

      }
    });

    Template.hello.events({
      'click button.buy' :function(event){
        Meteor.call('buy', event.target.id,event.target.name);
      }
    });

    Template.hello.events({
      'click #ldb' :function(event){
        $("table").toggle();
        return false;
      }
    });

    Template.hello.players = function () {
      return Meteor.users.find({},{sort:{'money' : -1}});
    };
    
    UI.registerHelper('formatCurrency',function(context,options){
        return numeral(context).format('0.0a');
    });

    Template.nav.events({
    'click #facebook-login': function(event) {
        Meteor.loginWithFacebook({}, function(err){
            if (err) {
                throw new Meteor.Error("Facebook login failed");
            }
        });
    },

    'click #logout': function(event) {
        Meteor.logout(function(err){
            if (err) {
                throw new Meteor.Error("Logout failed");
                    }
                  })
                }
              });

      Meteor.startup(function(){
        $('html').bind('keypress',function(e){
          if(e.keyCode == 13 || e.keyCode==32)
            {return false;}
        });
      });
}

if (Meteor.isServer) {

    Meteor.startup(function(){
      Meteor.setInterval(function(){
        Meteor.users.find({}).map(function(user){
          Meteor.users.update({_id:user._id}, {$inc:{'money' : user.rate}})
        });
      },1000);
    });

    Accounts.onCreateUser(function(options,user){
      user.money=0;
      user.rate=0;
      user.lines=0;
      user.jprog=0;
      user.courses=0;
      user.market=0;
      user.law=0;
      user.team=0;
      user.tm=0;
      user.ad=0;
      user.inc=0;
      user.serv=0;
      user.hq=0;
      user.comp=0;
      return user;
    });

    Meteor.publish("userData",function(){
      return Meteor.users.find({},{sort:{'money' : -1}});
    });
}

Meteor.methods({
  click : function() {
    Meteor.users.update({_id:this.userId}, {$inc: {'money' : 50 , 'lines' : 1}});
    var btn = $('.code');
    btn.prop('disabled',true);
    window.setTimeout(function(){
        btn.prop('disabled',false);
      },50);
    },
  buy : function(amount,qty) {
    if(Meteor.user().money >= amount && amount>0){
      Meteor.users.update({_id:this.userId}, {$inc:{'rate' : (Math.floor(amount/500)), 'money':(0-amount)}});
      var q=qty,doc={};
      doc[q]=1;
      Meteor.users.update({_id:this.userId}, {$inc:doc});
      var btn = $('.buy');
      btn.prop('disabled',true);
      window.setTimeout(function(){
          btn.prop('disabled',false);
        },100);
      }
  },
})
