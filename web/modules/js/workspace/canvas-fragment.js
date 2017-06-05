import { h, render, Component } from 'preact';

export default class CanvasFragment extends Component {

    componentDidUpdate() {
        let { dirty, imgData, width, height } = this.props.element;
        if (dirty && this.ctx) {
            delete this.props.element.dirty;
            // redraw from imageData

            this.drawFragment();
        }
    }

    drawFragment = () => {
        let { imgData, width, height } = this.props.element;
        this.ctx.putImageData(imgData, 0, 0, 0, 0, width, height);
    };

    loadImgData = (node) => {
        if (node) {
            node.imageSmoothingEnabled = true;
            let ctx = this.ctx = node.getContext('2d');

            requestAnimationFrame(() => {
                let { target, element } = this.props;
                let { width, height, imgData } = element;

                if (imgData == 'USE_PNG') {
                    let img = new Image();
                    img.onload = function() {
                        ctx.drawImage(this, 0, 0);
                        // awkward mutation to sync imgData...
                        element.imgData = ctx.getImageData(0, 0, width, height);
                    };
                    img.src = '/vdom/' + target;
                }
                else {
                    this.drawFragment();
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

