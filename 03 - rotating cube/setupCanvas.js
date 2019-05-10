const setupCanvas = () => {
  const canvas = document.getElementById("canvas");
  const gl = canvas.getContext("webgl");

  if (!gl) {
    console.error(
      "Tha webGlz doeznt workz... GET A PROPER BROWSER, you frig!!!"
    );
    return;
  }

  gl.viewport(0, 0, canvas.width, canvas.height);

  return gl;
};

export default setupCanvas();
