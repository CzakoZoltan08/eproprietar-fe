import {
  TextGrayLabel,
  Title,
  TitleCard,
} from "@/style/announcementDetailStyledComponents";

import { ButtonIcon } from "@/constants/button-icons.enum";
import PersonIcon from "@mui/icons-material/Person";
import { PrimaryButton } from "@/common/button/PrimaryButton";
import { ProviderType } from "@/constants/provider-types.enum";
import React from "react";
import { observer } from "mobx-react";
import styled from "styled-components";
import { useStore } from "@/hooks/useStore";

const StyledPersonIcon = styled(PersonIcon)`
  font-size: 64px;
  color: #fff;
  background: #e4e4e4;
  border-radius: 50%;
`;

const StyledPrimaryButton = styled(PrimaryButton)`
  margin-top: 16px;
`;

const ContactCardComponent: React.FC = () => {
  const {
    announcementStore: { currentAnnouncement },
  } = useStore();

  if (!currentAnnouncement) return null;

  const contactName =
    currentAnnouncement.phoneContactName ||
    // fallback (rare) – show user's name if contact name missing
    `${currentAnnouncement.user?.firstName ?? ""} ${currentAnnouncement.user?.lastName ?? ""}`.trim() ||
    "Contact";

  const contactPhone = currentAnnouncement.phoneContact || currentAnnouncement.user?.phoneNumber || "";

  const providerLabel =
    currentAnnouncement.providerType === "owner"
      ? ProviderType.OWNER
      : currentAnnouncement.providerType === "agency"
      ? ProviderType.AGENCY
      : ProviderType.ENSEMBLE;

  const handleCall = () => {
    if (contactPhone) {
      // strip spaces just in case
      const tel = contactPhone.toString().replace(/\s+/g, "");
      window.location.href = `tel:${tel}`;
    }
  };

  return (
    <TitleCard $alignItems="center">
      <StyledPersonIcon />
      <TextGrayLabel>{providerLabel}</TextGrayLabel>
      <Title>{contactName}</Title>
      <StyledPrimaryButton
        icon={ButtonIcon.PHONE}
        text={contactPhone ? contactPhone.toString() : "N/A"}
        onClick={handleCall}
        disabled={!contactPhone}
      />
    </TitleCard>
  );
};

export default observer(ContactCardComponent);