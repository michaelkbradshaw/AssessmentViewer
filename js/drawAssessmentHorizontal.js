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
    
    const nav = header.append("div")
    .classed("nav",true);

    nav.append("a")
    .attr("href","about.html")    
    .append("img")
    .attr("src","./imgs/info.svg")

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
    slos.on("mouseenter",function()
    {
        d3.select(this)
        .style("transform","scale(1.05)")
    })
    slos.on("mouseleave",function()
    {
        d3.select(this)
        .style("transform",null)
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
    .on("mouseenter",function(eventData,vent)
    {
        const xPosition = eventData.pageX+15;
        const yPosition = eventData.pageY-50;

        const target = d3.select("#tooltip");

        target.classed("hidden",false)
        .style("left",xPosition+"px")
        .style("top",yPosition+"px")

        target.select(".title")
        .text(vent.title);
    })
    .on("mouseleave",function(eventData,character)
        {
            var target = d3.select("#tooltip");
            target.classed("hidden",true);
        });

    


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
