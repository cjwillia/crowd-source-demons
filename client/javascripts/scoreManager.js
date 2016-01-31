var body = d3.select("body");
var socket = new WebSocket("ws://"+window.location.host);

socket.addEventListener('message', function(event) {
    var exp = /(\w+):(.*)/;
    var matches = event.data.match(exp);
    if(matches) {
        var type = matches[1];
        try {
            var body = JSON.parse(matches[2]);
            switch (type) {
                case "teaminfo":
                    loadPlayerInfo(body);
                    break;
            }
        } catch (e) {
            console.log('error reading ' + type);
        }
    }
});


function sortList(listId) {
    body.select(listId).selectAll("li").sort(scoreCompare).transition().style({
        top: function(d, i) {
            return 48 + (44 * i) + "px";
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

function loadPlayerInfo(gameinfo) {
    var leftData = gameinfo.left.summoners;
    var rightData = gameinfo.right.summoners;

    updateData("#leftTeamList", leftData);
    updateData("#rightTeamList", rightData);
}
