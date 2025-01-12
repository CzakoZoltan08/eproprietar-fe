import { Box, Divider } from "@mui/material";

import { CommonButton } from "@/common/button/CommonButton";
import FacebookIcon from "@mui/icons-material/Facebook";
import GoogleIcon from "@mui/icons-material/Google";
import { JSX } from "react";
import YahooIcon from "@mui/icons-material/Mail";

const buttonIcons: { [key: string]: JSX.Element } = {
  google: <GoogleIcon />,
  facebook: <FacebookIcon />,
  yahoo: <YahooIcon />,
};

const buttonStyles = {
  google: {
    backgroundColor: "rgb(234, 67, 53)",
    "&:hover": { backgroundColor: "rgb(219, 50, 40)" },
  },
  facebook: {
    backgroundColor: "rgb(59, 89, 152)",
    "&:hover": { backgroundColor: "rgb(45, 67, 115)" },
  },
  yahoo: {
    backgroundColor: "rgb(96, 1, 210)",
    "&:hover": { backgroundColor: "rgb(75, 0, 145)" },
  },
};

const SocialLoginButtons = ({
  socialAuthConfigs,
  onSocialLogin,
}: {
  socialAuthConfigs: {
    name: string;
    provider: any;
    styleKey: keyof typeof buttonStyles;
  }[];
  onSocialLogin: (provider: any, name: string) => void;
}) => {
  return (
    <Box>
      <Divider>or</Divider>
      <Box display="flex" flexDirection="column" gap={2} sx={{ marginTop: 2, marginBottom: 2 }}>
        {socialAuthConfigs.map((config) => (
          <CommonButton
            key={config.name}
            onClick={() => onSocialLogin(config.provider, config.name)}
            text={`Sign in with ${config.name}`}
            size="large"
            fullWidth
            startIcon={buttonIcons[config.styleKey]}
            sx={buttonStyles[config.styleKey]}
          />
        ))}
      </Box>
    </Box>
  );
};

export default SocialLoginButtons;