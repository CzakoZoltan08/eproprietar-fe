import { Box } from "@mui/material";
import { COLOR_PRIMARY } from "@/constants/colors";
import Image from "next/image";
import logo from "../../assets/logo.svg";

export const RightSide = () => {
  return (
    <Box
      flex={0.3}
      bgcolor={COLOR_PRIMARY}
      display="flex"
      justifyContent="center"
      sx={{
        alignItems: "center",
      }}
      padding={12}
    >
      <Image src={logo} alt="eproprietar" width={152} />
    </Box>
  );
};
