import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";



export default function(targetSelector,aboutData)
{
    const rows = d3.select(targetSelector)
    .selectAll("tr")
    .data(aboutData)
    .enter()
    .append("tr");

    rows.append("td")
    .append("img")
    .attr("src",(credit)=>credit.icon)

    rows.append("td")
    .append("a")
    .attr("href",(credit)=>credit.author_link)
    .text((credit)=>credit.author);

    rows.append("td")
    .append("a")
    .attr("href",(credit)=>credit.license_link)
    .text((credit)=>credit.license);
}