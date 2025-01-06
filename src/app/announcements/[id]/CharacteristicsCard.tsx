import { Title, TitleCard } from "@/style/announcementDetailStyledComponents";

import InfoRow from "@/common/InfoRow/InfoRow";
import React from "react";
import formatRooms from "@/utils/formatRooms";
import { observer } from "mobx-react";
import { useStore } from "@/hooks/useStore";

const CharacteristicsCard: React.FC = () => {
  const {
    announcementStore: { currentAnnouncement },
  } = useStore();

  return (
    <TitleCard>
      <Title $marginBottom="16px">Caracteristici</Title>
      <InfoRow title="Număr camere" value={formatRooms(currentAnnouncement?.rooms)} />
      <InfoRow
        title="Suprafață utilă"
        value={currentAnnouncement?.surface ? `${currentAnnouncement.surface} mp` : null}
      />
      <InfoRow title="Compartimentare" value={currentAnnouncement?.partitioning} />
      <InfoRow title="Etaj" value={currentAnnouncement?.floor} />
    </TitleCard>
  );
};

export default observer(CharacteristicsCard);