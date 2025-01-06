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
    <Box bgcolor={COLOR_PRIMARY} sx={BOX_STYLES}>
      <Image src={logo} alt={LOGO_ALT_TEXT} width={LOGO_DIMENSIONS.width} />
    </Box>
  );
};