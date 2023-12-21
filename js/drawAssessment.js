import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";


let duration = 1000;


//https://stackoverflow.com/questions/24784302/wrapping-text-in-d3
function wrap(text, width, maxlines) {
    text.each(function () {
        if(! maxlines) { maxlines = Infinity;}

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
                if(lineNumber >= maxlines - 1 )
                {
                    break
                }
               
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

function translateTag(xStr,yStr)
{
    return "translate("+columnScaleBounds(xStr)+","+rowScale(yStr)+")";
}

function goalTagXPos(goal)
{
    let xmin = columnScaleBounds(goal.slos[0].id)
    let xmax = columnScaleBounds(goal.slos[goal.slos.length-1].id)+columnScaleBounds.bandwidth();
    return (xmax+xmin)/2
}

function goalTagYPos(yStr,off)
{
    return rowScale(yStr)+off
}


function drawInterventionBar(target,jsonData)
{
    let interventions = target.append("g").classed("interventions",true);

    interventions.selectAll("div.intervention")
    .data(jsonData.interventions)
    .enter()
    .append("g")
    .classed("intervention",true)
    .attr("transform",(vent)=>translateTag("interventions",vent.id))
    .append("text")
    .text((vent)=>vent.title);

    return interventions;

}

function drawSlos(goals,jsonData)
{
    let slos = goals.selectAll("g.slo")
    .data( (goal)=>goal.slos)
    .enter()
    .append("g")
    .classed("slo",true);

    slos.append("text")
    .classed("slo-title","true")
    .attr("text-anchor","middle")
    .text((slo)=>slo.title)
    .attr("x",(slo)=>columnScaleCenters(slo.id))
    .attr("y",rowScale("sTitle"))
    .call(wrap,150);

    
    let svgs = slos.selectAll("g.intervention-strength")
    .data(jsonData.interventions)
    .enter()
    .append("g")
    .attr("transform",function(vent)
    {   //could bind the data to the circles directly, but I still need this trick for the circles anyway 
        let slo = d3.select(this.parentNode).datum();

        return "translate("+columnScaleCenters(slo.id)+",0)"
    })
    .classed("intervention-strength",true);

    svgs.append("circle")
    .attr("cx",0)
    .attr("cy",(vent)=>rowScale(vent.id)+50)
    .attr("r",50)
    .attr("fill","none")
    .attr("stroke","black")

    let strengthScale = d3.scaleSqrt()
    .domain([0,100])
    .range([0,50]);

    svgs.append("circle")
    .attr("cx",0)
    .attr("cy",(vent)=>rowScale(vent.id)+50)
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

function drawGoalBoundaries(goals)
{
    goals.append("rect")
    .classed("goal-bounds",true)
    .attr("rx",10)
    .attr("x",(goal)=>
    {
        return columnScaleBounds(goal.slos[0].id);
    })
    .attr("y",margin.top)
    .attr("width",(goal)=>
    {
        return columnScaleBounds.bandwidth()*goal.slos.length;
    })
    .attr("height",screen.height-margin.top-margin.bottom)
}

function drawGoals(target,jsonData)
{

    let goalContainer = target.append("g")
    .classed("goals",true)
 
    let goals = goalContainer.selectAll("g.goal")
    .data(jsonData.mission.goals)
    .enter()
    .append("g")
    .classed("goal",true);

    drawGoalBoundaries(goals)


    goals.append("text")
    .classed("goal-title","true")
    .attr("text-anchor","middle")
    .text((goal)=>goal.title)
    .attr("x",goalTagXPos) //will call the function for me :)
    .attr("y",(goal)=>goalTagYPos("gTitle",50));

    goals.append("text")
    .classed("goal-description",true)
    .attr("text-anchor","middle")
    .text((goal)=>goal.short)
    .attr("x",goalTagXPos) //will call the function for me :)
    .attr("y",(goal)=>goalTagYPos("gDesc",50))
    .call(wrap,150,2);


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

    return goalContainer
}


let screen;
let margin;
let columnScaleBounds;
let columnScaleCenters;
let rowScale;

function generateScales(jsonData)
{
    screen = {
        width:Math.min(1280,window.innerHeight),
        height:Math.min(800-70,window.innerWidth)
    }

    margin = {
        bottom:10,
        top:10,
        left:10,
        right:10
    }

    let slos = ["interventions"]
    jsonData.mission.goals.forEach((goal)=>{
        goal.slos.forEach((slo)=>
        {
            slos.push(slo.id);
        })
    })

    columnScaleBounds = d3.scaleBand(slos,[0,screen.width - margin.left - margin.right])
        .padding(.05)
    
    columnScaleCenters = d3.scalePoint(slos,[0,screen.width - margin.left - margin.right])
    .padding(.5)


    let rows = ["gTitle","gDesc","sTitle"].concat(
        jsonData.interventions.map((vent)=>vent.id));


    rowScale = d3.scaleBand(rows,[0,screen.height - margin.bottom - margin.top])
    

}


function testScales(container)
{
    container.selectAll("circle")
    .data(columnScaleCenters.domain())
    .enter()
    .append("circle")
    .attr("cx",(col)=>columnScaleCenters(col))
    .attr("cy",200)    
    .attr("fill","red")
    .attr("r","30")
}   


export default function(targetSelector,jsonData)
{
    let target = d3.select(targetSelector);
 
    drawHeader(target,jsonData);

    generateScales(jsonData)
    

    let container = target.append("svg")
        .classed("container",true)
        .attr("width",screen.width)
        .attr("height",screen.height);

    //testScales(container);


    let interventions = drawInterventionBar(container,jsonData);

    let goalContainers = drawGoals(container,jsonData);



}