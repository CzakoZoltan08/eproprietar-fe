import { Box } from "@mui/material";
import { COLOR_PRIMARY } from "@/constants/colors";
import Image from "next/image";
import logo from "../../assets/logo.svg";

const BOX_STYLES = {
  flex: 0.3,
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  padding: 12,
};

const LOGO_ALT_TEXT = "eproprietar";
const LOGO_DIMENSIONS = { width: 152 };

export const RightSide = () => {
  return (
    <div
      style={{
        flex: 1, // Occupy remaining space
        display: "flex",
        flexDirection: "column",
        justifyContent: "center", // Center content vertically
        alignItems: "center", // Center content horizontally
        height: "100%", // Stretch to full height of parent
        backgroundColor: "var(--color-primary)", // Add background color
        color: "white",
        fontSize: "24px",
        fontWeight: "bold",
        padding: "32px",
      }}
    >
      <Image src={logo} alt={LOGO_ALT_TEXT} width={LOGO_DIMENSIONS.width} />
    </div>
  );
};