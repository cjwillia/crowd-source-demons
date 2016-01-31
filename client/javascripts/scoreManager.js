var team1Data = [
    {name: "p2", score: 42},
    {name: "p4", score: 23},
    {name: "p3", score: 5},
    {name: "p1", score: 78}
];

var team2Data = [
    {name: "p5", score: 14},
    {name: "p6", score: 31},
    {name: "p7", score: 28}
];

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

insertData("#team1list", team1Data);
insertData("#team2list", team2Data);

sortList("#team1list");
sortList("#team2list");

team2Data = [
    {name: "p5", score: 14},
    {name: "p6", score: 31},
    {name: "p7", score: 0},
    {name: "p8", score: 600}
];

updateData("#team2list", team2Data);

team1Data = [
    {name: "p1", score: 55},
    {name: "p9", score: 5555}
];

updateData("#team1list", team1Data);
