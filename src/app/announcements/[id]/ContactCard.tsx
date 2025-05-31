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

  if (!currentAnnouncement || !currentAnnouncement.user) return null;

  const { firstName, lastName, phoneNumber } = currentAnnouncement.user;

  return (
    <TitleCard $alignItems="center">
      <StyledPersonIcon />
      <TextGrayLabel>
        {currentAnnouncement.providerType === "owner"
          ? ProviderType.OWNER
          : currentAnnouncement.providerType === "agency"
          ? ProviderType.AGENCY
          : ProviderType.ENSEMBLE}
      </TextGrayLabel>
      <Title>{`${firstName} ${lastName}`}</Title>
      <StyledPrimaryButton
        icon={ButtonIcon.PHONE}
        text={phoneNumber ? phoneNumber.toString() : "N/A"}
        onClick={() => {}}
      />
    </TitleCard>
  );
};

export default observer(ContactCardComponent);