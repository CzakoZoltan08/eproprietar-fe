import * as React from "react";

import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import Button from "@mui/material/Button";
import Fade from "@mui/material/Fade";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { StorageKeys } from "@/constants/storageKeys";
import styled from "styled-components";
import { useRouter } from "next/navigation";
import { useStore } from "@/hooks/useStore";

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
  } = useStore();
  const router = useRouter();
  const [isAuth, setIsAuth] = React.useState<boolean | null>(null);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  React.useEffect(() => {
    // Runs only on the client
    const token = localStorage.getItem(StorageKeys.token);
    setIsAuth(!!token);
  }, []);

  const onLogout = async () => {
    await logout();
    setIsAuth(false);
    goToHome();
  };

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    if (isAuth) {
      setAnchorEl(event.currentTarget);
    } else {
      goToLogin();
    }
  };

  const goToLogin = () => {
    router.push("/login");
  };

  const goToHome = () => {
    router.push("/");
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const openPage = (url: string) => {
    router.push(url);
  };

  // Avoid rendering until `isAuth` is determined
  if (isAuth === null) return null;

  return (
    <div>
      <StyledButton
        id="fade-button"
        aria-controls="fade-menu"
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        disableElevation
        onClick={handleClick}
        endIcon={
          !isAuth ? null : !open ? <ArrowDropDownIcon /> : <ArrowDropUpIcon />
        }
      >
        {!isAuth ? "Login" : "Contul meu"}
      </StyledButton>
      <StyledMenu
        id="fade-menu"
        MenuListProps={{
          "aria-labelledby": "fade-button",
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        TransitionComponent={Fade}
      >
        <MenuItem
          onClick={() => openPage("/my-account")}
          sx={{ padding: "2px" }}
        >
          Profilul meu / Setari
        </MenuItem>
        <MenuItem
          onClick={() => openPage("/my-announcements")}
          sx={{ padding: "2px" }}
        >
          Anunturile mele
        </MenuItem>
        <MenuItem
          onClick={() => openPage("/saved-announcements")}
          sx={{ padding: "2px" }}
        >
          Anunturi salvate
        </MenuItem>
        <MenuItem onClick={onLogout} sx={{ padding: "2px" }}>
          Logout
        </MenuItem>
      </StyledMenu>
    </div>
  );
};

export default AuthButton;
