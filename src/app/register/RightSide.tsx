import Image from "next/image";
import { Box } from "@mui/material";
import logo from "../../assets/logo.svg";
import { COLOR_PRIMARY, COLOR_WHITE } from "@/constants/colors";

export const RightSide = () => {
  return (
    <Box
      flex={0.3}
      bgcolor={COLOR_PRIMARY}
      display="flex"
      justifyContent="center"
      alignItems="center"
      padding={12}
    >
      <Image src={logo} alt="eproprietar" width={152} />
    </Box>
  );
};
