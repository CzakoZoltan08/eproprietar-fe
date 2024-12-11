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
import { useEffect, useState } from "react";

import EditIcon from "@mui/icons-material/Edit";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import Flex from "@/common/flex/Flex";
import Image from "next/image";
import { PrimaryButton } from "@/common/button/PrimaryButton";
import { PropertyAnnouncementModel } from "@/models/announcementModels";
import { observer } from "mobx-react";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import { useStore } from "@/hooks/useStore";

const favIconStyle = {
  cursor: "pointer",
  position: "absolute",
  top: "12px",
  right: "12px",
};

const AnnouncementListItem = ({ item }: { item: PropertyAnnouncementModel }) => {
  const {
    userStore: { user, getCurrentUser, updateUser },
  } = useStore();
  const pathname = usePathname();
  const router = useRouter();
  const [isFavorized, setIsFavorized] = useState<boolean>(
    !!user?.favourites?.includes(item.id),
  );
  const [favsSet, setFavsSet] = useState<boolean>(false);

  useEffect(() => {
    if (!user?.id) {
      getCurrentUser();
    }
  }, []);

  useEffect(() => {
    if (user && user.id && !favsSet) {
      setIsFavorized(!!user?.favourites?.includes(item.id));
      setFavsSet(true);
    }
  }, [user]);

  const goToItem = (id: string) => {
    router.push(`/announcements/${id}`);
  };

  const handleFavourite = async () => {
    if (!user?.id) {
      console.log("User not found");
    } else {
      debugger;
      let newFavsArray = user?.favourites || [];
      if (isFavorized) {
        newFavsArray = newFavsArray.filter((fav) => fav !== item.id);
      } else {
        newFavsArray.push(item.id);
      }
      setIsFavorized(!isFavorized);
      await updateUser(user.id, { favourites: newFavsArray });
    }
  };

  const goToEdit = () => {
    router.push(`/edit-announcement/${item.id}`);
  };

  return (
    <AnnouncementCard display={"flex"}>
      {user?.id !== item!.user!.id ? (
        <>
          {isFavorized ? (
            <FavoriteIcon
              sx={{ ...favIconStyle, color: COLOR_RED_BUTTON }}
              onClick={handleFavourite}
            />
          ) : (
            <FavoriteBorderIcon
              sx={{
                ...favIconStyle,
                color: COLOR_TEXT_LIGHT,
              }}
              onClick={handleFavourite}
            />
          )}
        </>
      ) : (
        <EditIcon
          sx={{ ...favIconStyle, color: COLOR_TEXT_LIGHT }}
          onClick={goToEdit}
        />
      )}

      <ImageContainer>
        <Image
          src={
            item.imageUrl ||
            "https://eproprietar.ro/storage/2903/vand-camera-camin-1.jpg"
          }
          alt={item.imageUrl ?? ''}
          width={250}
          height={200}
        />
      </ImageContainer>
      <DescriptionContainer>
        <Title>{item.title}</Title>
        <Flex>
          <Subtitle>
            {item.rooms ? (
              <>
                {item.rooms}
                <span>{item.rooms > 1 ? " camere |" : " camera |"}&nbsp;</span>
              </>
            ) : null}
            {item.surface}
            <span>mp</span>
          </Subtitle>

          <Price>
            {item.price} EUR
            <br />
            <PriceMP>
              {item.price && item.surface
                ? Math.round(item.price / item.surface)
                : 0}{" "}
              EUR/mp
            </PriceMP>
          </Price>
        </Flex>
        <Description>{item.description}</Description>
        <PrimaryButton
          text={"Vezi anunțul"}
          onClick={() => goToItem(item.id)}
          sx={{ marginTop: "8px" }}
        />
      </DescriptionContainer>
    </AnnouncementCard>
  );
};

export default observer(AnnouncementListItem);
