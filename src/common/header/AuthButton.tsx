import * as React from "react";

import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import Button from "@mui/material/Button";
import Fade from "@mui/material/Fade";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { observer } from "mobx-react-lite";
import styled from "styled-components";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useRouter } from "next/navigation";
import { useStore } from "@/hooks/useStore";
import { useTheme } from "@mui/material/styles";

const StyledButton = styled(Button)`
  color: #fff !important;
  text-transform: inherit !important;
  cursor: pointer !important;
`;

const StyledMenu = styled(Menu)`
  ul {
    display: flex !important;
    flex-direction: column !important;
    padding: 16px;
  }
`;

const AuthButton = () => {
  const {
    authStore: { logout },
    userStore: { isLoggedIn, user },
  } = useStore();

  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const isLoading = user === undefined; // <-- add this

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    if (isLoading) return; // wait until loaded
    if (isLoggedIn) {
      setAnchorEl(event.currentTarget);
    } else {
      router.push("/login");
    }
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const onLogout = async () => {
    handleClose();
    await logout();
    router.push("/");
  };

  const openPage = (url: string) => {
    router.push(url);
    handleClose();
  };

  return (
    <div>
      <StyledButton
        id="fade-button"
        aria-controls="fade-menu"
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        disableElevation
        onClick={handleClick}
        startIcon={isMobile && isLoggedIn ? <AccountCircleIcon /> : undefined}
        endIcon={
          !isMobile && isLoggedIn
            ? open
              ? <ArrowDropUpIcon />
              : <ArrowDropDownIcon />
            : undefined
        }
      >
        {isLoading
          ? "..." // or spinner if desired
          : isMobile
          ? !isLoggedIn
            ? "Login"
            : "" // icon-only
          : !isLoggedIn
          ? "Login"
          : "Contul meu"}
      </StyledButton>

      {!isLoading && isLoggedIn && (
        <StyledMenu
          id="fade-menu"
          MenuListProps={{ "aria-labelledby": "fade-button" }}
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          TransitionComponent={Fade}
        >
          <MenuItem onClick={() => openPage("/my-account")} sx={{ padding: "2px" }}>
            Profilul meu / Setări
          </MenuItem>
          <MenuItem onClick={() => openPage("/my-announcements")} sx={{ padding: "2px" }}>
            Anunțurile mele
          </MenuItem>
          <MenuItem onClick={() => openPage("/saved-announcements")} sx={{ padding: "2px" }}>
            Anunțuri salvate
          </MenuItem>
          <MenuItem onClick={onLogout} sx={{ padding: "2px" }}>
            Logout
          </MenuItem>
        </StyledMenu>
      )}
    </div>
  );
};


export default observer(AuthButton);