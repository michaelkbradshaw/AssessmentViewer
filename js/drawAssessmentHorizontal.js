import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

function drawHeader(target,jsonData)
{
    let header = target.append("div")
    .classed("tier1",true)
    .classed("mission",true)

    header.append("div")
    .classed("title",true)
    .text(jsonData.mission.title)

    header.append("div")
    .classed("description",true)
    .text(jsonData.mission.short)
    
    return header;
}

function drawSlos(goals,jsonData)
{

    let slos = goals.append("div")
    .classed("tier3Container",true)
    .selectAll("div.tier3")
    .data( (goal)=>goal.slos)
    .enter()
    .append("div")
    .classed("slo",true)
    .classed("tier3",true)  ;

    slos.append("div")
    .classed("title","true")
    .text((slo)=>slo.title);

    slos.on("click",function(eventData,slo)
    {   
        let goal = d3.select(this.parentNode.parentNode).datum();


        window.location.href = "drawSlo.html?goal="+goal.id+"&"+"slo="+slo.id;
    })




    let svgs = slos.append("div")
    .classed("icons",true)
    .selectAll("div.intervention-icon")
    .data(jsonData.interventions)
    .enter()
    .append("div")
    .classed("intervention-icon",true);

    svgs.append("img")
    .attr("src",function(vent)
    {
        let slo = d3.select(this.parentNode.parentNode).datum();

        let match = vent.slos.find((sid)=> sid.id ===slo.id )
        if(match)
        { return vent.icon;}
        return null;
    })

    


}

function drawGoals(target,jsonData)
{

    

    let goals = target.selectAll("div.goal")
    .data(jsonData.mission.goals)
    .enter()
    .append("div")
    .classed("tier2",true)
    .classed("goal",true);

    let goalHeader = goals.append("div")
        .classed("header",true)


    goalHeader.append("div")
    .classed("title","true")
    .text((goal)=>goal.title);

    goalHeader.append("div")
    .classed("description",true)
    .text((goal)=>goal.short);

    drawSlos(goals,jsonData)
}


export default function(targetSelector,jsonData)
{
    let target = d3.select(targetSelector);
 
    let header = drawHeader(target,jsonData);

    //let container = header.append("div").classed("container",true);

    drawGoals(header,jsonData);


}