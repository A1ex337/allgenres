function log(message) {
    console.log(`[GenreTree] ${message}`);
}

function buildTree() {
    log('Building tree');
    const treeEl = document.getElementById('tree');
    const width = treeEl.clientWidth || 800;
    const height = treeEl.clientHeight || 600;
    const svg = d3.select(treeEl).append('svg')
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
            const explicit = d.spotify || d.data.spotify;
            log(`Clicked ${d.data.id}`);
            const player = document.getElementById('player');
            const message = document.getElementById('status-message');

            let url;
            if (explicit) {
                url = explicit;
                message.textContent = '';
                message.classList.add('hidden');
            } else {
                url = `https://open.spotify.com/embed?uri=spotify:search:${encodeURIComponent(d.data.id)}`;
                message.textContent = `Searching Spotify for "${d.data.id}"...`;
                message.classList.remove('hidden');
            }

            const src = url.includes('?') ? `${url}&autoplay=1` : `${url}?autoplay=1`;

            let handled = false;
            player.addEventListener('load', () => {
                handled = true;
                message.textContent = '';
                message.classList.add('hidden');
                log(`Player loaded: ${src}`);
            }, { once: true });

            player.addEventListener('error', () => {
                handled = true;
                message.textContent = 'Failed to load music';
                message.classList.remove('hidden');
                log(`Player failed: ${src}`);
                log('The Spotify embed may be blocked or require login.');
            }, { once: true });

            setTimeout(() => {
                if (!handled && player.src === src) {
                    message.textContent = 'Music load timed out';
                    message.classList.remove('hidden');
                    log(`Player timeout for ${src}`);
                }
            }, 5000);

            player.src = src;
            document.getElementById('genre-title').textContent = d.data.id;
            log(`Loading "${d.data.id}" -> ${src}`);
        });

    node.append('circle')
        .attr('r', 9)
        .attr('class', 'play-circle');

    // draw a play icon triangle inside each node
    node.append('polygon')
        .attr('points', '-3,-5 5,0 -3,5')
        .attr('class', 'play-icon');

    node.append('text')
        .attr('dy', 3)
        .attr('x', d => d.children ? -10 : 10)
        .style('text-anchor', d => d.children ? 'end' : 'start')
        .text(d => d.data.id);

    log('Tree built');
}

window.addEventListener('DOMContentLoaded', () => {
    log('DOM loaded');
    buildTree();
});
