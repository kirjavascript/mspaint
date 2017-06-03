import { h, render, Component } from 'preact';

export default class CanvasFragment extends Component {
    loadImgData = (node) => {
        if (node) {
            node.imageSmoothingEnabled = true;
            requestAnimationFrame(() => {
                let { target, element } = this.props;
                let { width, height, imgData } = element;

                if (imgData == 'USE_PNG') {
                    let ctx = node.getContext('2d');
                    let img = new Image();
                    img.onload = function() {
                        ctx.drawImage(this, 0, 0);
                        // mutating props is dangerous! but we don't need a rerender...
                        element.imgData = ctx.getImageData(0, 0, width, height);
                    };
                    img.src = '/vdom/' + target;
                }
                else {
                    let ctx = node.getContext('2d');
                    ctx.putImageData(imgData, 0, 0, 0, 0, width, height);
                }
            });
        }
    };

    render({element: {width, height}}) {
        return <canvas
            ref={this.loadImgData}
            width={width}
            height={height}
        />;
    }
}

