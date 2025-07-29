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
  const isValidBoolean = (val?: boolean | null) => val === true || val === false;
  const isValidArray = (val?: string[] | null) => Array.isArray(val) && val.length > 0;

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

          {isValidString(a?.commercialSpaceType) && (
            <InfoRow title="Tip spațiu" value={a?.commercialSpaceType} />
          )}

          {isValidNumber(a?.usableSurface) && (
            <InfoRow title="Suprafață utilă" value={`${a?.usableSurface} mp`} />
          )}

          {isValidNumber(a?.builtSurface) && (
            <InfoRow title="Suprafață construită" value={`${a?.builtSurface} mp`} />
          )}

          {/* Front la stradă (length in ml) */}
          {isValidNumber(a?.streetFrontLength) && (
            <InfoRow title="Front la stradă (ml)" value={`${a?.streetFrontLength} ml`} />
          )}

          {a !== null && a.announcementType === "teren" && (
            <>
                            {/* Tip teren */}
              {isValidString(a?.landType) && (
                <InfoRow title="Tip teren" value={a?.landType} />
              )}
            </>
          )}

          {isValidString(a?.parking) && <InfoRow title="Parcare" value={a?.parking} />}
          {isValidString(a?.balcony) && <InfoRow title="Balcon" value={a?.balcony} />}
        </Column>

        <Column>
          {isValidNumber(a?.rooms) && <InfoRow title="Camere" value={a?.rooms?.toString()} />}
          {isValidNumber(a?.baths) && <InfoRow title="Băi" value={a?.baths?.toString()} />}
          {isValidNumber(a?.numberOfKitchens) && (
            <InfoRow title="Bucătării" value={a?.numberOfKitchens?.toString()} />
          )}
          {isValidNumber(a?.floor) && <InfoRow title="Etaj" value={a?.floor?.toString()} />}

          {a !== null && a.announcementType === "apartament" && (
            <>
              {isValidNumber(a?.comfortLevel) && (
                <InfoRow title="Confort" value={`Confort ${a?.comfortLevel}`} />
              )}
            </>
          )}

          {isValidNumber(a?.spaceHeight) && (
            <InfoRow title="Înălțime spațiu" value={`${a?.spaceHeight} m`} />
          )}

          {isValidBoolean(a?.streetFront) && (
            <InfoRow title="Front la stradă" value={a?.streetFront ? "Da" : "Nu"} />
          )}

          {isValidArray(a?.heightRegime) && (
            <InfoRow title="Regim înălțime" value={a?.heightRegime.join(", ")} />
          )}

          {/* Amplasare */}
          {isValidString(a?.landPlacement) && (
            <InfoRow title="Amplasare" value={a?.landPlacement} />
          )}

          {/* Urbanism */}
          {isValidArray(a?.urbanismDocuments) && (
            <InfoRow title="Urbanism" value={a?.urbanismDocuments?.join(', ')} />
          )}

          {a !== null && a.announcementType === "comercial" && (
            <>
              {isValidBoolean(a?.hasStreetWindow) && (
                <InfoRow title="Vitrină la stradă" value={a.hasStreetWindow ? 'Da' : 'Nu'} />
              )}

              {isValidNumber(a?.streetWindowLength) && (
                <InfoRow title="Front vitrină la stradă" value={`${a?.streetWindowLength} ml`} />
              )}

              {isValidBoolean(a?.hasStreetEntrance) && (
                <InfoRow title="Intrare din stradă" value={a.hasStreetEntrance ? 'Da' : 'Nu'} />
              )}

              {isValidBoolean(a?.hasLift) && (
                <InfoRow title="Lift" value={a.hasLift ? 'Da' : 'Nu'} />
              )}

              {isValidArray(a?.vehicleAccess) && (
                <InfoRow title="Acces auto" value={a?.vehicleAccess?.join(', ')} />
              )}
            </>
          )}

          {/* Utilități generale */}
          {a?.utilities && (
            <>
              {Object.entries(a.utilities).map(([key, val]) =>
                isValidBoolean(val) ? (
                  <InfoRow
                    key={key}
                    title={`Utilitate: ${key.charAt(0).toUpperCase() + key.slice(1)}`}
                    value={val ? "Da" : "Nu"}
                  />
                ) : null
              )}
            </>
          )}
        </Column>
      </TwoColumnFlex>
    </TitleCard>
  );
};

export default observer(CharacteristicsCard);
