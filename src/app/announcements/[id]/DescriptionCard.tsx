import { Title, TitleCard } from "@/style/announcementDetailStyledComponents";

import React from "react";
import { observer } from "mobx-react";
import styled from "styled-components";
import { useStore } from "@/hooks/useStore";

const StyledTitle = styled(Title)`
  margin-bottom: 16px;
`;

const DescriptionCardComponent: React.FC = () => {
  const {
    announcementStore: { currentAnnouncement },
  } = useStore();

  if (!currentAnnouncement?.description) return null;

  return (
    <TitleCard>
      <StyledTitle>Descriere</StyledTitle>
      <div>{currentAnnouncement.description}</div>
    </TitleCard>
  );
};

export default observer(DescriptionCardComponent);