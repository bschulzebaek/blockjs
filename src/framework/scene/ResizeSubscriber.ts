window.addEventListener('resize', () => {
    const canvas = BlockJS.canvas;
    const scene = BlockJS.container.Scene;

    if (!canvas || !scene) {
        return;
    }

    const { camera, renderer } = scene;

    canvas.style.width = `${window.innerWidth}px`;
    canvas.style.height = `${window.innerHeight}px`;

    camera.aspect = canvas.clientWidth / canvas.clientHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(canvas.clientWidth, canvas.clientHeight);
});