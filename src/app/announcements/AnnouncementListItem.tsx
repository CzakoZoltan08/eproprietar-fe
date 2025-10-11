"use client";

import {
  AnnouncementCard,
  Description,
  DescriptionContainer,
  FlexRowToColumn,
  ImageContainer,
  Price,
  PriceMP,
  Subtitle,
  Title,
} from "@/style/announcementsListStyledComponents";
import { Box, CircularProgress } from "@mui/material";
import {
  COLOR_RED_BUTTON,
  COLOR_TEXT_LIGHT,
  COLOR_WHITE,
} from "@/constants/colors";
import React, { useCallback, useEffect, useState } from "react";

import { Currency } from "@/constants/currencies.enum";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { Endpoints } from "@/constants/endpoints";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import Image from "next/image";
import { PrimaryButton } from "@/common/button/PrimaryButton";
import { PropertyAnnouncementModel } from "@/models/announcementModels";
import { Unit } from "@/constants/units.enum";
import calculatePricePerSquareMeter from "@/utils/calculatePricePerSquareMeter";
import formatRooms from "@/utils/formatRooms";
import { observer } from "mobx-react";
import styled from "styled-components";
import { useRouter } from "next/navigation";
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

const PromotedBadge = styled.div`
  position: absolute;
  top: 12px;
  left: 12px;
  background-color: ${COLOR_RED_BUTTON};
  color: ${COLOR_WHITE};
  font-weight: bold;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  z-index: 2;
  box-shadow: 0 0 6px rgba(0, 0, 0, 0.2);
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

interface AnnouncementListItemProps {
  item: PropertyAnnouncementModel;
  onSelect?: () => void;
}

const AnnouncementListItem = ({
  item,
  onSelect,
}: AnnouncementListItemProps) => {
  const {
    userStore: { user, getCurrentUser, updateUser },
    announcementStore,
  } = useStore();

  const router = useRouter();

  const [isFavorized, setIsFavorized] = useState<boolean>(false);
  const [favsSet, setFavsSet] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Initialize favorite state
  useEffect(() => {
    if (user && Array.isArray(user.favourites) && item?.id) {
      setIsFavorized(user.favourites.includes(item.id));
    }
  }, [user?.favourites, item?.id]);

  // If no user yet, fetch current user
  useEffect(() => {
    if (!user?.id) {
      getCurrentUser();
    }
  }, [user, getCurrentUser]);

  // Once user loads, set favorite flag once
  useEffect(() => {
    if (user && user.id && !favsSet && item?.id) {
      setIsFavorized(!!user.favourites?.includes(item.id));
      setFavsSet(true);
    }
  }, [user, favsSet, item?.id]);

  // Navigate to detail page
  const goToItem = useCallback(
    (id: string) => {
      router.push(`${Endpoints.ANNOUNCEMENTS}/${id}`);
    },
    [router]
  );

  // Optional: support a custom onSelect, else navigate
  const handleCardClick = useCallback(() => {
    if (onSelect) onSelect();
    else goToItem(item.id);
  }, [onSelect, goToItem, item.id]);

  // Favorite/unfavorite handler
  const handleFavourite = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user?.id) return;

    let newFavsArray = user.favourites || [];
    if (isFavorized) {
      newFavsArray = newFavsArray.filter((fav) => fav !== item.id);
    } else {
      newFavsArray.push(item.id);
    }

    setIsFavorized(!isFavorized);
    updateUser(user.id, { favourites: newFavsArray });
  };

  // Go to edit page
  const goToEdit = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      router.push(`${Endpoints.EDIT_ANNOUNCEMENTS}/${item.id}`);
    },
    [router, item.id]
  );

  // Delete handler
  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm("Ești sigur că vrei să ștergi acest anunț?")) {
      setIsDeleting(true);
      announcementStore.deleteAnnouncement(item.id).finally(() => {
        announcementStore.fetchPaginatedAnnouncements({
          page: 1,
          limit: 8,
          filter: { userId: user?.id ?? "" },
        });
        setIsDeleting(false);
      });
    }
  };

  return (
    <AnnouncementCard
      onClick={handleCardClick}
      style={{ position: "relative", cursor: "pointer" }}
    >
      {item.isPromoted && <PromotedBadge>Promovat</PromotedBadge>}
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
            {isDeleting ? (
              <CircularProgress size={24} color="error" />
            ) : (
              <StyledDeleteIcon onClick={handleDelete} />
            )}
          </>
        )}
      </IconButtonWrapper>

      <ImageContainer>
        <Image
          src={item.imageUrl || DEFAULT_IMAGE_URL}
          alt={item.imageUrl || "EProprietar"}
          fill
          style={{
            objectFit: "cover",
            borderRadius: "8px",
          }}
          sizes="(max-width: 768px) 100vw, 250px"
          priority={false}
        />
      </ImageContainer>

      <DescriptionContainer>
        <Title>{item.title}</Title>
        <FlexRowToColumn>
          <Subtitle>
            {item.rooms && <span>{formatRooms(item.rooms)}&nbsp;</span>}
            {item.surface}
            <span>mp</span>
            <br />
            <br />
            {item.price} <span>Euro</span>
          </Subtitle>

          <Price>
            <PriceMP>
              {calculatePricePerSquareMeter(item.price, item.surface)} {Currency.EUR}/{Unit.SQUARE_METER}
            </PriceMP>
          </Price>


        </FlexRowToColumn>

        <Description>{item.description}</Description>

        {/* Wrap the PrimaryButton in a Box to stop propagation */}
        <Box
          onClick={(e) => {
            e.stopPropagation();
            goToItem(item.id);
          }}
        >
          <PrimaryButton
            text={BUTTON_TEXT}
            onClick={() => {
              /* no-op, as navigation is handled by the Box wrapper */
            }}
            sx={{ marginTop: "8px" }}
          />
        </Box>
      </DescriptionContainer>
    </AnnouncementCard>
  );
};

export default observer(AnnouncementListItem);