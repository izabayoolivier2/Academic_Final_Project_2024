import { FC, CSSProperties } from "react";
import ClipLoader from "react-spinners/ClipLoader";

interface LoaderProps {
  loading: boolean;
  color?: string;
  size?: number;
  speedMultiplier?: number;
  override?: CSSProperties;
  id?: string;
}

const Loader: FC<LoaderProps> = ({
  loading,
  color,
  size = 60, // Default size if not provided
  speedMultiplier,
  override,
  id,
}: LoaderProps) => {
  const loaderContainerStyle: CSSProperties = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh", // Adjust to your container's height
    width: "100%", // Adjust to your container's width
  };
  return (
    <div style={loaderContainerStyle}>
      <ClipLoader
        color={color}
        loading={loading}
        cssOverride={override}
        size={size}
        speedMultiplier={speedMultiplier}
        aria-label="Loading Spinner"
        data-testid="loader"
        id={id}
      />
    </div>
  );
};

export default Loader;
