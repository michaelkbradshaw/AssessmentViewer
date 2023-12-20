import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

//https://stackoverflow.com/questions/24784302/wrapping-text-in-d3
function wrap(text, width) {
    text.each(function () {
        var text = d3.select(this),
            words = text.text().split(/\s+/).reverse(),
            word,
            line = [],
            lineNumber = 0,
            lineHeight = 1.1, // ems
            x = text.attr("x"),
            y = text.attr("y"),
            dy = 0, //parseFloat(text.attr("dy")),
            tspan = text.text(null)
                        .append("tspan")
                        .attr("x", x)
                        .attr("y", y)
                        .attr("dy", dy + "em");
        while (word = words.pop()) {
            line.push(word);
            tspan.text(line.join(" "));
            if (tspan.node().getComputedTextLength() > width) {
                line.pop();
                tspan.text(line.join(" "));
                line = [word];
                tspan = text.append("tspan")
                            .attr("x", x)
                            .attr("y", y)
                            .attr("dy", ++lineNumber * lineHeight + dy + "em")
                            .text(word);
            }
        }
    });
}

function drawHeader(target,jsonData)
{
    let header = target.append("div")
    .classed("header",true)

    header.append("div")
    .classed("header-title",true)
    .classed("center",true)
    .text(jsonData.mission.title)

    header.append("div")
    .classed("header-description",true)
    .text(jsonData.mission.short)
    
}

function drawInterventionBar(target,jsonData)
{
    let interventions = target.append("div").classed("interventions",true);

    interventions.append("div")
    .classed("top",true);

    interventions.selectAll("div.intervention")
    .data(jsonData.interventions)
    .enter()
    .append("div")
    .classed("intervention",true)
    .text((vent)=>vent.title);

    return interventions;

}

function drawSlos(goals,jsonData)
{
    let slos = goals.selectAll("div.slo")
    .data( (goal)=>goal.slos)
    .enter()
    .append("div")
    .classed("slo",true);

    slos.append("div")
    .classed("slo-title","true")
    .classed("center","true")
    .text((slo)=>slo.title);

    
    let svgs = slos.selectAll("svg")
    .data(jsonData.interventions)
    .enter()
    .append("svg")
    .classed("intervention-strength",true);

    svgs.append("circle")
    .attr("cx",50)
    .attr("cy",50)
    .attr("r",50)
    .attr("fill","none")
    .attr("stroke","black")

    let strengthScale = d3.scaleSqrt()
    .domain([0,100])
    .range([0,50]);

    svgs.append("circle")
    .attr("cx",50)
    .attr("cy",50)
    .attr("r",function(vent)
    {
        
        let slo = d3.select(this.parentNode.parentNode).datum();

        let match = vent.slos.find((sid)=> sid.id ===slo.id )
        if(match)
        { return strengthScale(match.strength);}
        return 0;
    })
}

function expandGoal(goal)
{
    let dur = 500;
    let id = goal.datum().id
    console.log("Grow!");

    let otherGoals = d3.selectAll(".goal")
    .filter((elem)=>
    {
        return elem.id!==id
    });

    //otherGoals = otherGoals.merge(d3.selectAll(otherGoals).selectAll("*"));

    otherGoals.selectAll(".slo")
    .transition()
    .duration(dur)
    .style("width","0px")
    .style("padding","0px")

    otherGoals
    .style("overflow","hidden")
    .transition()
    .duration(dur)
    .style("width","0px")
    .style("padding","0px")
    .style("border","none")
    .end()
    .then(()=>
    {
       // otherGoals.style("display","none")
    })


    goal.transition()
    .duration(dur)
    .style("width","1280px")

    

    console.log( d3.select(".interventions"));

    d3.select(".interventions")
    .style("overflow","hidden")
    .transition()
    .duration(dur)
    .style("width","0px")
    .end()
    .then(()=>
    {
        d3.selectAll("interventions")
        .style("display","none")
        console.log("away you fools");
        
    })


    


/*    goal.transition()
    .duration(3000)
    .style("width","1280px")
*/

}

function shrinkGoal(goal)
{
    console.log("Shrink!");

    let dur = 500;

    d3.selectAll(".goal")
    .style("display",null)
    .transition()
    .duration(dur)    
    .style("width",null)
    .style("padding",null)
    .style("border",null)

    d3.selectAll(".goal .slo")
    .style("display",null)
    .transition()
    .duration(dur)    
    .style("width",null)
    .style("padding",null)
    .style("border",null)


    d3.selectAll(".interventions")
    .style("display",null)
    .transition()
    .duration(dur)    
    .style("width",null)
    .style("padding",null)



}


function drawGoals(target,jsonData)
{

    

    let goals = target.selectAll("div.goal")
    .data(jsonData.mission.goals)
    .enter()
    .append("div")
    .classed("goal",true);

    goals.append("div")
    .classed("goal-title","true")
    .classed("center","true")
    .text((goal)=>goal.title);

    goals.append("div")
    .classed("goal-description",true)
    .classed("center","true")
    .text((goal)=>goal.short);

    drawSlos(goals,jsonData)


    goals.on("click",function(eventData,element)
    {
        let goal = d3.select(this);
        if(goal.classed("expanded"))
        {
           shrinkGoal(goal);
        }
        else
        {
            expandGoal(goal);
        }

        goal.classed("expanded",! goal.classed("expanded"));

    })
}


export default function(targetSelector,jsonData)
{
    let target = d3.select(targetSelector);
 
    drawHeader(target,jsonData);

    let container = target.append("div").classed("container",true);

    let interventions = drawInterventionBar(container,jsonData);

    let goalContainer = container.append("div").classed("goal-container",true);

    drawGoals(goalContainer,jsonData);


}