import { Title, TitleCard } from "@/style/announcementDetailStyledComponents";

import InfoRow from "@/common/InfoRow/InfoRow";
import React from "react";
import { observer } from "mobx-react";
import styled from "styled-components";
import { useStore } from "@/hooks/useStore";

const TwoColumnFlex = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  width: 100%; /* 🔥 ensures it stretches to fill the card */
  flex-wrap: wrap;
  gap: clamp(24px, 5vw, 80px);

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 12px;
  }
`;

const Column = styled.div`
  flex: 1;                            /* 👈 forces both columns to fill half */
  display: flex;
  flex-direction: column;
  gap: 6px;
  width: 100%;                  /* 👈 ensures full width in flex */
`;

const CharacteristicsCard: React.FC = () => {
  const {
    announcementStore: { currentAnnouncement },
  } = useStore();

  const announcement = currentAnnouncement;

  return (
    <TitleCard style={{ padding: "16px 24px" }}>
      <Title $marginBottom="16px">Specificații</Title>

      <TwoColumnFlex>
        <Column>
          <InfoRow title="Județ" value={announcement?.county} />
          <InfoRow title="Adresă" value={announcement?.street} />
          <InfoRow
            title="Suprafață teren"
            value={
              announcement?.landSurface
                ? `${announcement.landSurface} m²`
                : undefined
            }
          />
        </Column>

        <Column>
          <InfoRow title="Oraș" value={announcement?.city} />
          <InfoRow title="Tip tranzacție" value={announcement?.transactionType} />
        </Column>
      </TwoColumnFlex>
    </TitleCard>
  );
};

export default observer(CharacteristicsCard);
