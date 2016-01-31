var body = d3.select("body");

function sortList(listId) {
    body.select(listId).selectAll("li").sort(scoreCompare).transition().style({
        top: function(d, i) {
            return 48 + (44 * i) + "px";
        }
    });
}

function insertData(listId, data) {
    body.select(listId).selectAll("li").data(data).enter().append("li").html(formatPlayerInfo).attr({
        name: function(d) {
            return d.name;
        }
    });
}

function updateData(listId, data) {
    var lis = body.select(listId).selectAll("li").data(data);
    lis.exit().remove();
    lis.enter().append("li");
    lis.html(formatPlayerInfo).attr({
        name: function(d) {
            return d.name;
        }
    });
    sortList(listId);
}

function scoreCompare(d1, d2) {
    return d3.ascending(d1.score, d2.score);
}

function formatPlayerInfo (d) {
    return "<span class='name'>"+d.name+"</span>" + "<span class='score'>"+d.score+"</span>";
}
