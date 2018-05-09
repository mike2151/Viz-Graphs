$('#target_vertex').hide();
$('#target_vertex_label').hide();
$('#directed_box').prop('checked', !0);
var starting_string = `
                    {
"nodes": [{ "data": { "id": "a" }, "position": { "x": 400, "y": 500}},{ "data": { "id": "b" }, "position": { "x": 900, "y": 500}}], 
"edges": [{ "data": { "id": "ab", "weight": 1, "source": "a", "target": "b" }}]
}`
var graph_json_string_first = `{
"nodes": [`;
var first_original_length = graph_json_string_first.length;
var graph_json_string_second = `], 
"edges": [`;
var second_original_length = graph_json_string_second.length;
var graph_json_string_third = `]
}`;
var graph_directed = !0;
$(window).on('load', function() {
    if (!$("#json").val()) {
        $('#json').val(starting_string.trim());
        var json_body = $("#json").val();
        graph_json_string_first = json_body.slice(0, json_body.indexOf("]"));
        graph_json_string_second = json_body.slice(json_body.indexOf("]"));
        graph_json_string_second = graph_json_string_second.slice(0, graph_json_string_second.length - 3)
    } else {
        var json_body = $("#json").val();
        graph_json_string_first = json_body.slice(0, json_body.indexOf("]"));
        graph_json_string_second = json_body.slice(json_body.indexOf("]"));
        graph_json_string_second = graph_json_string_second.slice(0, graph_json_string_second.length - 3)
    }
    $('#load_json').click()
});
var cy = cytoscape({
    container: document.getElementById('cy'),
    boxSelectionEnabled: !1,
    autounselectify: !0,
    style: cytoscape.stylesheet().selector('node').css({
        'content': 'data(id)'
    }).selector('edge').css({
        'curve-style': 'bezier',
        'target-arrow-shape': 'triangle',
        'content': 'data(weight)',
        'width': 4,
        'line-color': '#ddd',
        'target-arrow-color': '#ddd'
    }).selector('.highlighted').css({
        'background-color': '#61bffc',
        'line-color': '#61bffc',
        'target-arrow-color': '#61bffc',
        'transition-property': 'background-color, line-color, target-arrow-color',
        'transition-duration': '0.5s'
    }),
    elements: {
        nodes: [{
            data: {
                id: 'a'
            },
            position: {
                x: 400,
                y: 500
            }
        }, {
            data: {
                id: 'b'
            },
            position: {
                x: 900,
                y: 500
            }
        }],
        edges: [{
            data: {
                id: 'ab',
                weight: 1,
                source: 'a',
                target: 'b'
            }
        }]
    },
    layout: {
        directed: !0,
        roots: '#a',
        padding: 10
    }
});
var resetGraph = function() {
    graph_json_string_first = `{
"nodes": [`;
    graph_json_string_second = `], 
"edges": [`;
    graph_json_string_third = `]
}`;
    populateJSONArea();
    $('#load_json').click()
};
$("#reset_graph").click(function() {
    resetGraph()
});
$("#save_graph").click(function() {
    $.ajax(window.location.href, {
        type: 'POST',
        data: {
            body: $("#json").val()
        }
    }).done(function(data) {
        if (data == "Graph Saved") {
            var link = document.createElement("a");
            link.href = window.location.href;
            link.innerHTML = window.location.href;
            swal({
                title: "Graph Saved! URL:",
                content: link,
                icon: "success"
            })
        } else {
            swal("Error!", "An error has occured when saving your graph!", "error")
        }
    })
});
$("#reset_animation").click(function() {
    clear_animation()
});
$('#algo_selector').change(function() {
    if ($(this).val() === "Dijkstra's") {
        $('#target_vertex').show();
        $('#target_vertex_label').show();
        $('#source_vertex').show();
        $('#source_vertex_label').show();
    } 
    else if ($(this).val() === "Kruskal") {
        $('#source_vertex').hide();
        $('#source_vertex_label').hide();
        $('#target_vertex').hide();
        $('#target_vertex_label').hide();
    }
    else {
        $('#target_vertex').hide();
        $('#target_vertex_label').hide();
        $('#source_vertex').show();
        $('#source_vertex_label').show();
    }
});
$("#play_animation").click(function() {
    var algorithm = $("select#algo_selector option:checked").val();
    if (algorithm == "BFS") {
        var source = $('#source_vertex').val();
        runBFS(source)
    } else if (algorithm == "DFS") {
        var source = $('#source_vertex').val();
        runDFS(source)
    } else if (algorithm == "Dijkstra's") {
        var source = $('#source_vertex').val();
        var target = $('#target_vertex').val();
        runDijkstra(source, target)
    }
     else if (algorithm == "Kruskal") {
        runKruskal()
    }
    else if (algorithm == "Prim's") {
        var source = $('#source_vertex').val();
        runPrims(source)
    }
});

function generate_json(vertices_edges_input, directed, arrow_shape) {
    var graph_json = {
        container: document.getElementById('cy'),
        boxSelectionEnabled: !1,
        autounselectify: !0,
        style: cytoscape.stylesheet().selector('node').css({
            'content': 'data(id)'
        }).selector('edge').css({
            'curve-style': 'bezier',
            'target-arrow-shape': arrow_shape,
            'content': 'data(weight)',
            'width': 4,
            'line-color': '#ddd',
            'target-arrow-color': '#ddd'
        }).selector('.highlighted').css({
            'background-color': '#61bffc',
            'line-color': '#61bffc',
            'target-arrow-color': '#61bffc',
            'transition-property': 'background-color, line-color, target-arrow-color',
            'transition-duration': '0.5s'
        }),
        elements: {
            nodes: vertices_edges_input.nodes,
            edges: vertices_edges_input.edges
        },
        layout: {
            directed: directed,
            roots: '#a',
            padding: 10
        }
    };
    cy.json(graph_json)
}

function populateJSONArea() {
    var totalString = graph_json_string_first + graph_json_string_second + graph_json_string_third;
    $('textarea#json').val(totalString)
}
$("#add_vertex").click(function() {
    var vertex_id = $("#vertex_field").val().replace(/\s/g, '');
    if (vertex_id && (graph_json_string_first.indexOf('"' + vertex_id + '"') === -1)) {
        if (graph_json_string_first.length == first_original_length) {
            var x_pos = Math.floor(Math.random() * $("#cy").width() / 2).toString();
            var y_pos = Math.floor(Math.random() * $("#cy").height() / 2).toString();
            var json_string = '{ "data": { "id": "' + vertex_id + '" }, "position": { "x": ' + x_pos + ', "y": ' + y_pos + '}}';
            graph_json_string_first = graph_json_string_first + json_string;
            populateJSONArea();
            $("#vertex_field").val('')
        } else {
            var x_pos = Math.floor(Math.random() * $("#cy").width()).toString();
            var y_pos = Math.floor(Math.random() * $("#cy").height()).toString();
            var json_string = ',{ "data": { "id": "' + vertex_id + '" }, "position": { "x": ' + x_pos + ', "y": ' + y_pos + '}}';
            graph_json_string_first = graph_json_string_first + json_string;
            populateJSONArea();
            $("#vertex_field").val('')
        }
        $('#load_json').click()
    }
});
$("#add_edge").click(function() {
    var starting_vertex = $("#starting_vertex").val().replace(/\s/g, '');
    var ending_vertex = $("#ending_vertex").val().replace(/\s/g, '');
    var edge_weight = $("#edge_weight").val();
    var edge_id = starting_vertex + ending_vertex;
    if (edge_id && (graph_json_string_second.indexOf('"' + edge_id + '"') === -1)) {
        if (graph_json_string_second.length == second_original_length) {
            var json_string = '{ "data": { "id": "' + edge_id + '", "weight": ' + edge_weight.toString() + ', "source": "' + starting_vertex + '", "target": "' + ending_vertex + '" }}';
            graph_json_string_second = graph_json_string_second + json_string;
            populateJSONArea();
            $("#starting_vertex").val('');
            $("#ending_vertex").val('');
            $("#edge_weight").val('')
        } else {
            var json_string = ',{ "data": { "id": "' + edge_id + '", "weight": ' + edge_weight.toString() + ', "source": "' + starting_vertex + '", "target": "' + ending_vertex + '" }}';
            graph_json_string_second = graph_json_string_second + json_string;
            populateJSONArea();
            $("#starting_vertex").val('');
            $("#ending_vertex").val('');
            $("#edge_weight").val('')
        }
        $('#load_json').click()
    }
});
$("#directed_box").click(function() {
    $('#load_json').click();
});
$('#load_json').click(function() {
    var json = JSON.parse($('textarea#json').val());
    graph_directed = $('#directed_box').is(':checked');
    var arrow_shape = 'none';
    if (graph_directed) {
        arrow_shape = 'triangle'
    }
    generate_json(json, graph_directed, arrow_shape)
});

function clear_animation() {
    var nodes = cy.nodes();
    for (var i = 0; i < nodes.length; i++) {
        nodes[i].removeClass('highlighted')
    }
    var edges = cy.edges();
    for (var i = 0; i < edges.length; i++) {
        edges[i].removeClass('highlighted')
    }
};

function highlightNextEle(i, algo) {
    if (i < algo.path.length) {
        algo.path[i].addClass('highlighted');
        setTimeout(function() {
            highlightNextEle(i + 1, algo)
        }, 1000)
    }
};

function highlightNextEleKruskal(i, algo) {
    if (i < algo.length) {
        algo[i].addClass('highlighted');
        setTimeout(function() {
            highlightNextEleKruskal(i + 1, algo)
        }, 1000)
    }
};

function highlightElementDijkstra(i, algo_path) {
    if (i < algo_path.length) {
        algo_path[i].addClass('highlighted');
        setTimeout(function() {
            highlightElementDijkstra(i + 1, algo_path)
        }, 1000)
    }
};

function runBFS(source) {
    var bfs = cy.elements().bfs("#" + source, function() {}, graph_directed);
    setTimeout(function() {
        highlightNextEle(0, bfs)
    }, 0)
}

function runDFS(source) {
    var dfs = cy.elements().dfs("#" + source, function() {}, graph_directed);
    setTimeout(function() {
        highlightNextEle(0, dfs)
    }, 0)
}

function runKruskal() {
    var kruskal = cy.elements().kruskal();
    console.log(kruskal);
    setTimeout(function() {
        highlightNextEleKruskal(0, kruskal)
    }, 0)
}

function runPrims(source) {
    var dijkstra = cy.elements().dijkstra("#" + source, "", true, function(edge) {
        return edge.data('weight')
    }, graph_directed);
    var d_path = dijkstra.pathTo((""));
    setTimeout(function() {
        highlightElementDijkstra(0, d_path)
    }, 0)
}

function runDijkstra(source, target) {
    var dijkstra = cy.elements().dijkstra("#" + source, "#" + target, false, function(edge) {
        return edge.data('weight')
    }, graph_directed);
    var d_path = dijkstra.pathTo(("#" + target));
    setTimeout(function() {
        highlightElementDijkstra(0, d_path)
    }, 0)
}
cy.on('drag', 'node', function(evt) {
    var vertexId = evt.target.id();
    var newX = parseInt(cy.$('#' + evt.target.id().toString()).position().x);
    var newY = parseInt(cy.$('#' + evt.target.id().toString()).position().y);
    var startIndex = graph_json_string_first.indexOf('{ "data": { "id": "' + vertexId + '" }');
    var tempString = graph_json_string_first.substring(startIndex, graph_json_string_first.length);
    var endIndex = tempString.indexOf("}}");
    var string_to_replace = (graph_json_string_first.substring(startIndex, startIndex + endIndex + 2));
    graph_json_string_first = graph_json_string_first.replace(string_to_replace, '{ "data": { "id": "' + vertexId + '" },  "position": { "x": ' + newX.toString() + ', "y": ' + newY.toString() + '}}');
    populateJSONArea()
})