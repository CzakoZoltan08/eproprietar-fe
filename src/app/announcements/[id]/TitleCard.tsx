import {
  Divider,
  Price,
  PriceMP,
  Subtitle,
  Title,
  TitleCard,
} from "@/style/announcementDetailStyledComponents";

import { Flex } from "@/common/flex/Flex";
import React from "react";
import { observer } from "mobx-react";
import { useStore } from "@/hooks/useStore";

const TitleCardComponent = () => {
  const {
    announcementStore: { currentAnnouncement },
  } = useStore();

  return (
    <TitleCard>
      <Title>{currentAnnouncement?.title}</Title>
      <Divider />
      <Flex $justifyContent={"space-between"}>
        <Price>
          {currentAnnouncement?.price} EUR
          <PriceMP>
            (
            {currentAnnouncement?.price && currentAnnouncement?.surface
              ? Math.round(
                  currentAnnouncement?.price / currentAnnouncement?.surface,
                )
              : 0}{" "}
            EUR/mp)
          </PriceMP>
        </Price>
        <Subtitle>
          {currentAnnouncement?.rooms}
          <span>
            {Number(currentAnnouncement?.rooms) > 1 ? " camere |" : " camera |"}
            &nbsp;
          </span>
          {currentAnnouncement?.surface}
          <span>mp</span>
        </Subtitle>
      </Flex>
    </TitleCard>
  );
};

export default observer(TitleCardComponent);
