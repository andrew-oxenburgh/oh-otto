var Promise = require('bluebird');
var _ = require('lodash');
var assert = require('assert');

var store = require('../src/server/store');

$r = '';
oo_template = {
    uid: '',
    bid: '',
    cid: '',
    udoc: {},
    bdoc: {},
    cdoc: {}
};

oo = {};

function resetOo() {
    oo = _.cloneDeep(oo_template);
}
oo = _.cloneDeep(oo_template);

var userAdd = function(){
    return hitRepl(arguments[0], 'userAdd', store.user.add.bind(),
        function(opt, rs){
            opt.uid = rs;
        });
};

var userRead = function(){
    return hitRepl(arguments[0], 'userRead', store.user.read.bind(),
        function(opt, rs){
            resetOo();
            oo.udoc = rs;
            oo.uid = rs._id;
            oo.uname = rs.name;
        });
};

var userUpdate = function(){
    return store.user.update.apply(this, arguments)
        .error(function(err){
            console.log('read user err == ', err);
        })
        .done(function(r){
            $r = r;
            console.log(r);
        });
};

var userAbout = function(){
    return store.user.about.apply(this, arguments)
        .error(function(err){
            console.log('about user err == ', err);
        })
        .done(function(r){
            $r = r;
            oo.udoc = r;
            console.log(r);
        });
};

var userRemove = function(){
    return store.user.remove.apply(this, arguments)
        .error(function(err){
            console.log('remove user err == ', err);
        })
        .done(function(r){
            $r = r;
            resetOo();
            console.log(r);
        });
};

var userBoards = function(){
    return store.user.board.apply(this, arguments)
        .error(function(err){
            console.log('user boards err == ', err);
        })
        .done(function(r){
            $r = r;
            console.log(r);
        });
};

var userCount = function(){
    return store.user.count.apply(this)
        .error(function(err){
            console.log('count users err == ', err);
        })
        .done(function(r){
            $r = r;
            console.log(r);
        });
};

var boardAdd = function(){
    return store.board.add.apply(this, arguments)
        .error(function(err){
            console.log('board save err == ', err);
        })
        .done(function(r){
            $r = r;
            oo.bid = r;
            oo.cdoc = {};
            oo.cid = '';
            console.log(r);
        });
};

var boardUpdate = function(){
    return store.board.update.apply(this, arguments)
        .error(function(err){
            console.log('board save err == ', err);
        })
        .done(function(r){
            $r = r;
            console.log(r);
        });
};

var boardRemove = function(){
    return store.board.remove.apply(this, arguments)
        .error(function(err){
            console.log('board remove err == ', err);
        })
        .done(function(r){
            $r = r;
            var uid = oo.uid;
            var udoc = oo.udoc;
            var uname = oo.uname;
            resetOo();
            oo.uid = uid;
            oo.udoc = udoc;
            oo.uname = uname;
            console.log(r);
        });
};

var boardRead = function(){
    return store.board.read.apply(this, arguments)
        .error(function(err){
            console.log('board read err == ', err);
        })
        .done(function(r){
            $r = r;
            oo.bdoc = r;
            console.log(r);
        });
};

var cardAdd = function(){
    return store.card.add.apply(this, arguments)
        .error(function(err){
            console.log('card save err == ', err);
        })
        .done(function(r){
            $r = r;
            oo.cid = r;
            console.log(r);
        });
};

var updateCard = function(){
    return store.card.add.apply(this, arguments)
        .error(function(err){
            console.log('card save err == ', err);
        })
        .done(function(r){
            $r = r;
            console.log(r);
        });
};

var cardRead = function(){
    return store.card.read.apply(this, arguments)
        .error(function(err){
            console.log('card read err == ', err);
        })
        .done(function(r){
            $r = r;
            oo.cdoc = r;
            console.log(r);
        });
};

var cardUpdate = function(){
    return store.card.update.apply(this, arguments)
        .error(function(err){
            console.log('card update err == ', err);
        })
        .done(function(r){
            $r = r;
            console.log(r);
        });
};

var cardRemove = function(){
    return store.card.remove.apply(this, arguments)
        .error(function(err){
            console.log('card remove err == ', err);
        })
        .done(function(r){
            $r = r;
            oo.cid = '';
            oo.cdoc = {};
            console.log(r);
        });
};

var knockDown = function(){
    return store.test.knockdown.apply(this)
        .error(function(err){
            console.log('knockdown err == ', err);
        })
        .done(function(r){
            resetOo();
            console.log(r);
        });
};

var boardModel = store.test.board;
var userModel = store.test.user;
var cardModel = store.test.card;

var all = {
    board: function(){
        boardModel.find().then(console.log);
    },
    user: function(){
        userModel.find().then(console.log);
    },
    card: function(){
        cardModel.find().then(console.log);
    }
};

var hitRepl = function(args, msg, fn, fnl){
    return fn(args).catch(function(err){
            console.log(msg, 'err', err);
        })
        .error(function(err){
            console.log(msg, 'err', err);
        })
        .done(function(r){
            $r = r;

            fnl(oo, $r);
            console.log(msg, r);
        });
};

users = {
    add: userAdd,
    read: userRead,
    update: userUpdate,
    remove: userRemove,
    boards: userBoards,
    count: userCount,
    about: userAbout,
    model: userModel,
    all: all.user
};

boards = {
    add: boardAdd,
    read: boardRead,
    update: boardUpdate,
    remove: boardRemove,
    model: boardModel,
    all: all.board
};

cards = {
    add: cardAdd,
    read: cardRead,
    update: cardUpdate,
    remove: cardRemove,
    model: cardModel,
    all: all.card
};

tests = {
    knockdown: knockDown
};

//knockDown();
//
//addUser('andrew2');
//
//readUser('andrew2');
//
//aboutUser('56bbf0cb109973af6d9693ed');
//
//countUsers();
//
//userBoards('56bbf0cb109973af6d9693ed');
//
//boardSave('56bbf0cb109973af6d9693ed', {name:'hi', background:'blue'});
//
//boardRead('56bbf0cb109973af6d9693ed', '56bbfc75fba977c36eb4ac3f');
//
//
//
//var options = {
//    uid:'56bbf0cb109973af6d9693ed',
//    bid:'56bbfc75fba977c36eb4ac3f',
//    card:{
//        content:'some gunk'
//    },
//    cid:'56bbfd7ba77f37ef6ed4b672'
//};
//
//cardSave(options);
//
//cardRead(options);
//
//boardRead('56bbf0cb109973af6d9693ed', '56bbfc75fba977c36eb4ac3f');
