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
  width: 100%;
  flex-wrap: wrap;
  gap: clamp(24px, 5vw, 80px);

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 12px;
  }
`;

const Column = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 6px;
  width: 100%;
`;

const CharacteristicsCard: React.FC = () => {
  const {
    announcementStore: { currentAnnouncement },
  } = useStore();

  const a = currentAnnouncement;

  const isValidString = (val?: string | null) => val && val.trim() !== "";
  const isValidNumber = (val?: number | null) => val !== undefined && val !== null && val !== 0;

  return (
    <TitleCard style={{ padding: "16px 24px" }}>
      <Title $marginBottom="16px">Specificații</Title>

      <TwoColumnFlex>
        <Column>
          {isValidString(a?.county) && <InfoRow title="Județ" value={a?.county} />}
          {isValidString(a?.city) && <InfoRow title="Oraș" value={a?.city} />}
          {isValidString(a?.street) && <InfoRow title="Adresă" value={a?.street} />}
          {isValidNumber(a?.landSurface) && (
            <InfoRow title="Suprafață teren" value={`${a?.landSurface} m²`} />
          )}
          {isValidNumber(a?.surface) && (
            <InfoRow title="Suprafață utilă" value={`${a?.surface} m²`} />
          )}
          {isValidString(a?.partitioning) && (
            <InfoRow title="Compartimentare" value={a?.partitioning} />
          )}
        </Column>

        <Column>
          {isValidNumber(a?.rooms) && <InfoRow title="Camere" value={a?.rooms?.toString()} />}
          {isValidNumber(a?.baths) && <InfoRow title="Băi" value={a?.baths?.toString()} />}
          {isValidNumber(a?.numberOfKitchens) && (
            <InfoRow title="Bucătării" value={a?.numberOfKitchens?.toString()} />
          )}
          {isValidNumber(a?.floor) && <InfoRow title="Etaj" value={a?.floor?.toString()} />}
          {isValidNumber(a?.comfortLevel) && (
            <InfoRow title="Confort" value={`Confort ${a?.comfortLevel}`} />
          )}
          {isValidString(a?.parking) && <InfoRow title="Parcare" value={a?.parking} />}
          {isValidString(a?.balcony) && <InfoRow title="Balcon" value={a?.balcony} />}
        </Column>
      </TwoColumnFlex>
    </TitleCard>
  );
};

export default observer(CharacteristicsCard);
