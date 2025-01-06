import {
  Divider,
  Price,
  PriceMP,
  Subtitle,
  Title,
  TitleCard,
} from "@/style/announcementDetailStyledComponents";

import { Currency } from "@/constants/currencies.enum";
import { Flex } from "@/common/flex/Flex";
import React from "react";
import { Unit } from "@/constants/units.enum";
import calculatePricePerSquareMeter from "@/utils/calculatePricePerSquareMeter";
import formatRooms from "@/utils/formatRooms";
import { observer } from "mobx-react";
import styled from "styled-components";
import { useStore } from "@/hooks/useStore";

// Styled Components
const StyledFlex = styled(Flex)`
  justify-content: space-between;
`;

const TitleCardComponent: React.FC = () => {
  const {
    announcementStore: { currentAnnouncement },
  } = useStore();

  if (!currentAnnouncement) return null;

  const { title, price, surface, rooms } = currentAnnouncement;

  return (
    <TitleCard>
      <Title>{title}</Title>
      <Divider />
      <StyledFlex>
        <Price>
          {price} {Currency.EUR}
          <PriceMP>
            ({calculatePricePerSquareMeter(price, surface)} {Currency.EUR}/{Unit.SQUARE_METER})
          </PriceMP>
        </Price>
        <Subtitle>
          {formatRooms(rooms)} | {surface}
          <span> {Unit.SQUARE_METER}</span>
        </Subtitle>
      </StyledFlex>
    </TitleCard>
  );
};

export default observer(TitleCardComponent);