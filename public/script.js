const treeEl = document.getElementById('tree');
const width = treeEl.clientWidth;
const height = treeEl.clientHeight;
const svg = d3.select('#tree').append('svg')
    .attr('width', width)
    .attr('height', height);

const root = d3.stratify()
    .id(d => d.name)
    .parentId(d => d.parent)(genres);

const treeLayout = d3.tree().size([height - 40, width - 160]);
const rootNode = treeLayout(d3.hierarchy(root))
    .each(d => {
        d.name = d.data.id;
        d.spotify = genres.find(g => g.name === d.data.id).spotify;
    });

const g = svg.append('g').attr('transform', 'translate(80,20)');

svg.call(d3.zoom().on('zoom', (event) => {
    g.attr('transform', event.transform);
}));

const link = g.selectAll('.link')
    .data(rootNode.links())
    .enter()
    .append('path')
    .attr('class', 'link')
    .attr('fill', 'none')
    .attr('stroke', '#555')
    .attr('stroke-width', 1.5)
    .attr('d', d3.linkHorizontal()
        .x(d => d.y)
        .y(d => d.x));

const node = g.selectAll('.node')
    .data(rootNode.descendants())
    .enter()
    .append('g')
    .attr('class', 'node')
    .attr('transform', d => `translate(${d.y},${d.x})`)
    .on('click', (event, d) => {
        const url = d.data.spotify;
        if (url) {
            const src = url.includes('?') ? `${url}&autoplay=1` : `${url}?autoplay=1`;
            document.getElementById('player').src = src;
            document.getElementById('genre-title').textContent = d.data.id;
        }
    });

node.append('circle')
    .attr('r', 5);

node.append('text')
    .attr('dy', 3)
    .attr('x', d => d.children ? -10 : 10)
    .style('text-anchor', d => d.children ? 'end' : 'start')
    .text(d => d.data.id);
