import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";


function drawHeader(target,jsonData,goal)
{
    let header = target.append("div")
    .classed("tier1",true)
    .classed("goal",true)

    header.append("div")
    .classed("title",true)
    .text(goal.title)

    header.append("div")
    .classed("description",true)
    .text(goal.short)
    
    return header;
}


function drawAssessments(goals,slo)
{

    let slos = goals.append("div")
    .classed("tier3container",true)    
    .selectAll("div.tier3")
    .data(slo.assessments)
    .enter()
    .append("div")
    .classed("assessment",true)
    .classed("tier3",true);

    slos.append("div")
    .classed("title","true")
    .text((ment)=>ment.title);

    
    slos.append("div")
    .classed("description",true)
    .text((ment)=>ment.short)
}

function drawSlo(target,slo)
{

    let cont = target
    .append("div")
    .classed("tier2",true)
    .classed("slo",true);

    let goalHeader = cont.append("div")
        .classed("header",true)


    goalHeader.append("div")
    .classed("title","true")
    .text(slo.title);

    goalHeader.append("div")
    .classed("description",true)
    .text(slo.short);

    drawAssessments(cont,slo)
}

function drawInterventions(container,slo,interventions)
{
    const valid = interventions.filter( 
        (vent)=>vent.slos.some((vSlo)=>vSlo.id===slo.id)
    );

    const vents = container.selectAll("div.tier4")
    .data(valid)
    .enter()
    .append("div")
    .classed("tier4",true)
    .classed("intervention",true)

    vents.append("img")
    .attr("src",(vent)=>vent.icon)

    let desc = vents.append("div")
    .classed("colum2",true)

    desc.append("div")
    .classed("title",true)
    .text((vent)=>vent.title);

    desc.append("div")
    .classed("description",true)
    .text((vent)=>vent.short);



    vents.append("div")
    .classed("why",true)
    .text((vent)=>{
        const s = vent.slos.find((s)=>s.id===slo.id);
        return s.why;
    })

}


function getGoalSlo(jsonData)
{
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);

    let goalId = urlParams.get("goal")
    let sloId =  urlParams.get("slo")
    const goal = jsonData.mission.goals.find(
        (goal)=>goal.id===goalId );

    const slo = goal.slos.find(
            (slo)=>slo.id===sloId );
    
    
        
    return [goal,slo]
}


export default function(targetSelector,jsonData)
{
    const [goal,slo] = getGoalSlo(jsonData)

    let target = d3.select(targetSelector);
 
    let header = drawHeader(target,jsonData,goal);

    //let container = header.append("div").classed("container",true);

   

    //let goalContainer = container.append("div").classed("goal-container",true);

    drawSlo(header,slo);
    drawInterventions(header,slo,jsonData.interventions)

}