"use client";

import {
  AnnouncementCard,
  Description,
  DescriptionContainer,
  ImageContainer,
  Price,
  PriceMP,
  Subtitle,
  Title,
} from "@/style/announcementsListStyledComponents";
import {
  COLOR_LIGHT_GREY,
  COLOR_RED_BUTTON,
  COLOR_TEXT_LIGHT,
} from "@/constants/colors";
import React, { useCallback, useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

import { Currency } from "@/constants/currencies.enum";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { Endpoints } from "@/constants/endpoints";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import Flex from "@/common/flex/Flex";
import Image from "next/image";
import { PrimaryButton } from "@/common/button/PrimaryButton";
import { PropertyAnnouncementModel } from "@/models/announcementModels";
import { Unit } from "@/constants/units.enum";
import calculatePricePerSquareMeter from "@/utils/calculatePricePerSquareMeter";
import formatRooms from "@/utils/formatRooms";
import { observer } from "mobx-react";
import styled from "styled-components";
import { useStore } from "@/hooks/useStore";

// Constants
const DEFAULT_IMAGE_URL =
  "https://eproprietar.ro/storage/2903/vand-camera-camin-1.jpg";
const IMAGE_WIDTH = 250;
const IMAGE_HEIGHT = 200;
const BUTTON_TEXT = "Vezi anunțul";

const IconButtonWrapper = styled.div`
  position: absolute;
  top: 12px;
  right: 12px;
  display: flex;
  gap: 12px;
  z-index: 2;
`;

const StyledFavoriteIcon = styled(FavoriteIcon)`
  cursor: pointer;
  color: ${COLOR_RED_BUTTON};
`;

const StyledFavoriteBorderIcon = styled(FavoriteBorderIcon)`
  cursor: pointer;
  color: ${COLOR_TEXT_LIGHT};
`;

const StyledEditIcon = styled(EditIcon)`
  cursor: pointer;
  color: ${COLOR_TEXT_LIGHT};
`;

const StyledDeleteIcon = styled(DeleteIcon)`
  cursor: pointer;
  color: ${COLOR_RED_BUTTON};
`;

const AnnouncementListItem = ({ item }: { item: PropertyAnnouncementModel }) => {
  const {
    userStore: { user, getCurrentUser, updateUser },
    announcementStore,
  } = useStore();

  const router = useRouter();
  const pathname = usePathname();

  const [isFavorized, setIsFavorized] = useState<boolean>(false);
  const [favsSet, setFavsSet] = useState<boolean>(false);

  // 🛡 Defensive guard: don't try to render or run effects without user
  if (!user) return null;

  useEffect(() => {
    if (Array.isArray(user.favourites) && item?.id) {
      setIsFavorized(user.favourites.includes(item.id));
    }
  }, [user.favourites, item?.id]);

  useEffect(() => {
    if (!user?.id) {
      getCurrentUser();
    }
  }, [user, getCurrentUser]);

  useEffect(() => {
    if (user && user.id && !favsSet && item?.id) {
      setIsFavorized(!!user?.favourites?.includes(item.id));
      setFavsSet(true);
    }
  }, [user, favsSet, item?.id]);

  const goToItem = useCallback(
    (id: string) => {
      router.push(`${Endpoints.ANNOUNCEMENTS}/${id}`);
    },
    [router]
  );

  const handleFavourite = async () => {
    if (!user?.id) return;

    let newFavsArray = user.favourites || [];
    if (isFavorized) {
      newFavsArray = newFavsArray.filter((fav) => fav !== item.id);
    } else {
      newFavsArray.push(item.id);
    }

    setIsFavorized(!isFavorized);
    await updateUser(user.id, { favourites: newFavsArray });
  };

  const goToEdit = useCallback(() => {
    router.push(`${Endpoints.EDIT_ANNOUNCEMENTS}/${item.id}`);
  }, [router, item.id]);

  const handleDelete = async () => {
    if (confirm("Ești sigur că vrei să ștergi acest anunț?")) {
      await announcementStore.deleteAnnouncement(item.id);
      await announcementStore.fetchPaginatedAnnouncements({
        page: 1,
        limit: 8,
        filter: { userId: user?.id ?? "" },
      });
    }
  };

  return (
    <AnnouncementCard display="flex" position="relative">
      <IconButtonWrapper>
        {user?.id !== item.user?.id ? (
          isFavorized ? (
            <StyledFavoriteIcon onClick={handleFavourite} />
          ) : (
            <StyledFavoriteBorderIcon onClick={handleFavourite} />
          )
        ) : (
          <>
            <StyledEditIcon onClick={goToEdit} />
            <StyledDeleteIcon onClick={handleDelete} />
          </>
        )}
      </IconButtonWrapper>

      <ImageContainer>
        <Image
          src={item.imageUrl || DEFAULT_IMAGE_URL}
          alt={item.imageUrl || "EProprietar"}
          width={IMAGE_WIDTH}
          height={IMAGE_HEIGHT}
        />
      </ImageContainer>

      <DescriptionContainer>
        <Title>{item.title}</Title>
        <Flex>
          <Subtitle>
            {item.rooms && (
              <>
                {item.rooms}
                <span>{formatRooms(item.rooms)}&nbsp;</span>
              </>
            )}
            {item.surface}
            <span>mp</span>
          </Subtitle>

          <Price>
            {item.price} EUR
            <br />
            <PriceMP>
              {calculatePricePerSquareMeter(item.price, item.surface)}{" "}
              {Currency.EUR}/{Unit.SQUARE_METER}
            </PriceMP>
          </Price>
        </Flex>
        <Description>{item.description}</Description>
        <PrimaryButton
          text={BUTTON_TEXT}
          onClick={() => goToItem(item.id)}
          sx={{ marginTop: "8px" }}
        />
      </DescriptionContainer>
    </AnnouncementCard>
  );
};

export default observer(AnnouncementListItem);