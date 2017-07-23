import d3 from '#lib/d3';

export function ding() {
    d3.select(document.body)
        .append('audio')
        .attr('src', '/ding.mp3')
        .on('ended', function (){
            d3.select(this)
                .remove();
        })
        .node()
        .play();
}
