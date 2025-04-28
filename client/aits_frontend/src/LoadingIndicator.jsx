// LoadingIndicator.jsx
import React from "react";

const LoadingIndicator = ({
  color = "#3498db",
  dotSize = 12,
  dotSpacing = 8,
  speed = 1.2,
}) => (
  <div
    className="dots-loader"
    style={{
      "--dot-size": `${dotSize}px`,
      "--dot-spacing": `${dotSpacing}px`,
      "--dot-color": color,
      "--speed": `${speed}s`,
    }}
  >
    <span />
    <span />
    <span />
  </div>
);

export default LoadingIndicator;
