import { Box } from "@mui/material";
import { COLOR_PRIMARY } from "@/constants/colors";
import Image from "next/image";
import logo from "../../assets/logo.svg";

export const RightSide = () => {
  return (
    <Box
      flex={0.3}
      bgcolor={COLOR_PRIMARY}
      padding={12}
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Image src={logo} alt="eproprietar" width={152} />
    </Box>
  );
};
