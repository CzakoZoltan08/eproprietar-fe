import {
  TextGrayLabel,
  Title,
  TitleCard,
} from "@/style/announcementDetailStyledComponents";

import PersonIcon from "@mui/icons-material/Person";
import { PrimaryButton } from "@/common/button/PrimaryButton";
import React from "react";
import { observer } from "mobx-react";
import { useStore } from "@/hooks/useStore";

const ContactCardComponent = () => {
  const {
    announcementStore: { currentAnnouncement },
  } = useStore();
  console.log("currentAnnouncement", currentAnnouncement);
  return (
    <TitleCard alignItems={"center"}>
      <PersonIcon
        sx={{
          fontSize: "64px",
          color: "#fff",
          background: "#e4e4e4",
          borderRadius: "50%",
        }}
      />
      <TextGrayLabel>
        {currentAnnouncement?.providerType === "owner"
          ? "Proprietar"
          : "Agentie"}
      </TextGrayLabel>
      <Title>{`${currentAnnouncement!.user!.firstName} ${currentAnnouncement!.user!.lastName}`}</Title>
      <PrimaryButton
        icon={"phone"}
        text={currentAnnouncement!.user!.phoneNumber!.toString()}
        onClick={() => {}}
        sx={{ marginTop: "16px" }}
      />
    </TitleCard>
  );
};

export default observer(ContactCardComponent);
