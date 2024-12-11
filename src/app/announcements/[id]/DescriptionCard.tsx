import React from "react";
import { observer } from "mobx-react";

import { Title, TitleCard } from "@/style/announcementDetailStyledComponents";
import { useStore } from "@/hooks/useStore";

const DescriptionCardComponent = () => {
  const {
    announcementStore: { currentAnnouncement },
  } = useStore();

  return (
    <TitleCard>
      <Title marginBottom={"16px"}>Descriere</Title>
      <div>{currentAnnouncement?.description}</div>
    </TitleCard>
  );
};

export default observer(DescriptionCardComponent);
