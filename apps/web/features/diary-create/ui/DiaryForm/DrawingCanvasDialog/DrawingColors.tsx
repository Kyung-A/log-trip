interface IDrawingColors {
  handleChangeColor: (color: string) => void;
  currentColor: string;
}

const COLORS = {
  red: "#ef4444",
  yellow: "#facc15",
  orange: "#fb923c",
  green: "#15803d",
  blue: "#3b82f6",
  purple: "#a855f7",
  pink: "#ec4899",
  gray: "#78716c",
  black: "#000",
};

export const DrawingColors = ({
  handleChangeColor,
  currentColor,
}: IDrawingColors) => {
  return Object.entries(COLORS).map(([key, color]) => (
    <button
      key={key}
      onClick={() => handleChangeColor(color)}
      className={`w-8 h-8 rounded-full transition duration-150 ${
        currentColor === color ? "scale-120" : ""
      }`}
      style={{ backgroundColor: color }}
    />
  ));
};
