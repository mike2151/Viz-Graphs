var express = require("express");
var router = express.Router();
var Graph = require('../models/Graph');
var bodyParser = require("body-parser");

router.get("/", function(req, res) {
    res.render("home");
});

router.get("/new", function(req, res) {
    //get new session
    var session_token = getRandomInt(1, 10000000000).toString();
    res.redirect("/graph/" + session_token);
});

router.get("/graph/:graph_id", function(req, res) {
    var graph_id = req.params.graph_id;
    
    Graph.graphExists(graph_id, function(cb) {
        if (cb) {
            //exists
            Graph.getGraphByGraphId(graph_id, function(err, graph) {
            if (!err) {
                res.render("graph", {body: graph.body.trim()});
            }
            else {
                console.log(err);
            }
            });
        }
        else {
            res.render("graph", {body: ""});
        }
    });
    
});

router.post("/graph/:graph_id", function(req, res) {
    var graph_id = req.params.graph_id;
    var body_doc = req.body.body;
    
    
    var newGraph = new Graph({
            graph_id: graph_id,
            body: body_doc
    });
    
    Graph.graphExists(graph_id, function(cb) {
        if (cb) {
            //exists
            //update graph
            Graph.updateGraph(graph_id, body_doc, function(err, graph_callback) {
                if(err) {
                    res.send(JSON.stringify({ msg: err }));
                }
            });
            res.send("Graph Saved");
        }
        else {
            Graph.createGraph(newGraph, function(err, graph_callback) {
                if(err) {
                    res.send(JSON.stringify({ msg: err }));
                }
                else {
                    res.send("Graph Saved");
                }
            });
        }
    });
    
    
});



function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}


module.exports = router;