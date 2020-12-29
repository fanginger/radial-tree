// https://observablehq.com/@gingerfan/radial-tidy-tree@208
export default function define(runtime, observer) {
    const main = runtime.module();
    const fileAttachments = new Map([
        ["flare-2 2@5.json", new URL("./files/09c60f17245afb4f10689c2505b711119752d693d6746e3d46629ff49bc867dce2e0ebd5d0f5ce82b63f10d0c5578d4f8d9b414c5cd9bdfa0fdf52adc6da9366",
            import.meta.url)]
    ]);
    main.builtin("FileAttachment", runtime.fileAttachments(name => fileAttachments.get(name)));
    main.variable(observer()).define(["md"], function(md) {
        return (
            md `# SEO 
            find what special in Google`)
    });
    main.variable(observer("chart")).define("chart", ["tree", "data", "d3", "autoBox"], function(tree, data, d3, autoBox) {
        const root = tree(data);

        const svg = d3.create("svg");

        svg.append("g")
            .attr("fill", "none")
            .attr("stroke", "#555")
            .attr("stroke-opacity", 0.4)
            .attr("stroke-width", 1.5)
            .selectAll("path")
            .data(root.links())
            .join("path")
            .attr("d", d3.linkRadial()
                .angle(d => d.x)
                .radius(d => d.y));

        svg.append("g")
            .selectAll("circle")
            .data(root.descendants())
            .join("circle")
            .attr("transform", d => `
        rotate(${d.x * 180 / Math.PI - 90})
        translate(${d.y},0)
      `)
            .attr("fill", d => d.children ? "#555" : "#999")
            .attr("r", 2.5);

        svg.append("g")
            .attr("font-family", "sans-serif")
            .attr("font-size", 5)
            .attr("stroke-linejoin", "round")
            .attr("stroke-width", 3)
            .selectAll("text")
            .data(root.descendants())
            .join("text")
            .attr("transform", d => `
        rotate(${d.x * 180 / Math.PI - 90}) 
        translate(${d.y},0) 
        rotate(${d.x >= Math.PI ? 180 : 0})
      `)
            .attr("dy", "0.31em")
            .attr("x", d => d.x < Math.PI === !d.children ? 6 : -6)
            .attr("text-anchor", d => d.x < Math.PI === !d.children ? "start" : "end")
            .text(d => d.data.name)
            .clone(true).lower()
            .attr("stroke", "white");

        return svg.attr("viewBox", autoBox).node();
    });
    main.variable(observer("autoBox")).define("autoBox", function() {
        return (
            function autoBox() {
                document.body.appendChild(this);
                const { x, y, width, height } = this.getBBox();
                document.body.removeChild(this);
                return [x, y, width, height];
            }
        )
    });
    main.variable(observer("data")).define("data", ["d3", "FileAttachment"], async function(d3, FileAttachment) {
        return (
            d3.hierarchy(await FileAttachment("flare-2 2@5.json").json())
            .sort((a, b) => d3.ascending(a.data.name, b.data.name))
        )
    });
    main.variable(observer("tree")).define("tree", ["d3", "radius"], function(d3, radius) {
        return (
            d3.tree()
            .size([2 * Math.PI, radius])
            .separation((a, b) => (a.parent == b.parent ? 1 : 2) / a.depth)
        )
    });
    main.variable(observer("width")).define("width", function() {
        return (
            204
        )
    });
    main.variable(observer("radius")).define("radius", ["width"], function(width) {
        return (
            width / 2
        )
    });
    main.variable(observer("d3")).define("d3", ["require"], function(require) {
        return (
            require("d3@6")
        )
    });
    return main;
}