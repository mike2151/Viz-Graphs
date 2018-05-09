var mongoose = require("mongoose");

//create scheme
var GraphSchema = mongoose.Schema({
    graph_id: {
        type: String,
        index: true,
        unique: true,
        dropDups: true
    },
    body: {
        type: String
    }
    
});

//global var
var Graph = module.exports = mongoose.model('Graph', GraphSchema);

//global function
module.exports.createGraph = function(newGraph, callback) {
    newGraph.save(callback);
}

module.exports.getGraphByGraphId = function(graph_id, callback) {
    var query = {graph_id: graph_id};
    Graph.findOne(query, callback);
}

module.exports.updateGraph = function(graph_id, newBody, callback) {
    var query = {graph_id: graph_id};
    Graph.findOneAndUpdate(query, { body: newBody }, {upsert: true}, function(err, doc){
        if (err) {return err;}
        else {
            return "success";
        }
    });
}

module.exports.graphExists = function(graph_id, callback) {
    var query = {graph_id: graph_id};
    Graph.count(query, function (err, count){
    if(count > 0){
        callback(true);
    }
    else {
        callback(false);
    }
});
}


