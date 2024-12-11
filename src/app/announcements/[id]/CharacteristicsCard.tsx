import {
  Divider,
  Title,
  TitleCard,
} from "@/style/announcementDetailStyledComponents";

import Flex from "@/common/flex/Flex";
import React from "react";
import { observer } from "mobx-react";
import { useStore } from "@/hooks/useStore";

const InfoRow = ({
  title,
  value,
}: {
  title: string;
  value?: string | number | null;
}) => {
  if (value === undefined || value === null || value === "") return null;

  return (
    <>
      <Flex>
        <div>{title}:</div>
        <div>{value}</div>
      </Flex>
      <Divider background={"#efefef"} margin={"8px 0"} />
    </>
  );
};


const CharacteristicsCard = () => {
  const {
    announcementStore: { currentAnnouncement },
  } = useStore();

  return (
    <TitleCard>
      <Title marginBottom={"16px"}>Caracteristici</Title>

      <InfoRow
        title={"Număr camere"}
        value={
          currentAnnouncement?.rooms
            ? `${currentAnnouncement?.rooms} ${
                Number(currentAnnouncement?.rooms) > 1 ? "camere" : "camera"
              }`
            : null
        }
      />
      <InfoRow
        title={"Suprafață utilă"}
        value={`${currentAnnouncement?.surface} mp`}
      />
      <InfoRow
        title={"Compartimentare"}
        value={currentAnnouncement?.partitioning}
      />
      <InfoRow title={"Etaj"} value={currentAnnouncement?.floor} />
    </TitleCard>
  );
};

export default observer(CharacteristicsCard);
