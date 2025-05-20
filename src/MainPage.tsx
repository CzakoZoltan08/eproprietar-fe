import * as breakpoints from "./constants/breakpoints";

import {
  Container,
  Divider,
  SearchContainer,
  SelectDropdownContainer,
  Subtitle,
} from "./style/mainPageStyledComponents";
import React, { useEffect, useState } from "react";
import { roomOptions, transactionTypeOptions, typeOptions } from "./constants/annountementConstants";
import { useRouter, useSearchParams } from "next/navigation";

import AutocompleteCities from "./common/autocomplete/AutocompleteCities";
import AutocompleteCounties from "./common/autocomplete/AutocompleteCounties";
import { DEFAULT_FILTERS } from "./constants/filters";
import { DROPDOWN_RANGES } from "./constants/dropdown";
import { Endpoints } from "./constants/endpoints";
import FloatingCardWrapper from "./common/floatingCard/FloatingCardWrapper";
import Image from "next/image";
import { MESSAGES } from "./constants/messages";
import { PrimaryButton } from "./common/button/PrimaryButton";
import { ResponsiveLogoContainer } from "./style/ResponsiveLogoContainer";
import SelectDropdown from "./common/dropdown/SelectDropdown";
import logo from "./assets/logo-white.svg";
import { useMediaQuery } from "react-responsive";
import { useStore } from "@/hooks/useStore";

function getDropdownValuesNumberRange(start: number, end: number, step: number) {
  return Array.from({ length: (end - start) / step + 1 }, (_, i) => ({
    id: start + i * step,
    value: start + i * step,
  }));
}

export const Main = () => {
  const {
    announcementStore: { fetchPaginatedAnnouncements },
    userStore : { getCurrentUser, user }
  } = useStore();

  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [priceOptions, setPriceOptions] = useState<{ id: number; value: number }[]>([]);
  const [minSurfaceOptions, setMinSurfaceOptions] = useState<{ id: number; value: number }[]>([]);
  const [maxSurfaceOptions, setMaxSurfaceOptions] = useState<{ id: number; value: number }[]>([]);

  const router = useRouter();
  const searchParams = useSearchParams();

  const isDesktop = useMediaQuery({
    minWidth: breakpoints.SIZES_NUMBER_SMALL_MEDIUM,
  });

  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!user?.id) {
      getCurrentUser();
    }
  }, [user?.id, getCurrentUser]);

  useEffect(() => {
    setPriceOptions(
      getDropdownValuesNumberRange(
        DROPDOWN_RANGES.PRICE.START,
        DROPDOWN_RANGES.PRICE.END,
        DROPDOWN_RANGES.PRICE.STEP
      )
    );
    setMinSurfaceOptions(
      getDropdownValuesNumberRange(
        DROPDOWN_RANGES.SURFACE.START,
        DROPDOWN_RANGES.SURFACE.END,
        DROPDOWN_RANGES.SURFACE.STEP
      )
    );
    setMaxSurfaceOptions(
      getDropdownValuesNumberRange(
        DROPDOWN_RANGES.SURFACE.START,
        DROPDOWN_RANGES.SURFACE.END,
        DROPDOWN_RANGES.SURFACE.STEP
      )
    );
  }, []);

  const handleQueryParams = (
    params: URLSearchParams,
    term: string,
    val: string | number | null | undefined
  ) => {
    if (val) {
      params.set(term, val.toString());
    } else {
      params.delete(term);
    }
    return params;
  };

  const onSearch = async () => {
    const selectedType = typeOptions.find((it) => it.value === filters.TYPE);
    const selectedTransactionType = transactionTypeOptions.find(
      (it) => it.value === filters.TRANSACTION_TYPE
    );

    const queryParams = new URLSearchParams(searchParams.toString());

    const isCabaneType = filters.TYPE === "Cabane/Case la tara";
    const isApartmentType = filters.TYPE === "Apartamente";

    const dynamicFilters: Record<string, any> = {
      rooms: filters.ROOMS,
      price: filters.PRICE,
      minSurface: filters.MIN_SURFACE,
      maxSurface: filters.MAX_SURFACE,
      transactionType: filters.TRANSACTION_TYPE,
      type: filters.TYPE,
      status: filters.STATUS,
      ...(isCabaneType
        ? { county: filters.COUNTY }
        : { city: filters.CITY }),
    };

    await fetchPaginatedAnnouncements({
      page: 1,
      limit: 8,
      filter: dynamicFilters,
    });

    [
      ["page", "1"],
      ["price", filters.PRICE],
      ["minSurface", filters.MIN_SURFACE],
      ["maxSurface", filters.MAX_SURFACE],
      isCabaneType
        ? ["county", filters.COUNTY]
        : ["city", filters.CITY],
      ...(isApartmentType ? [] : [["rooms", filters.ROOMS]]),
      ["transactionType", selectedTransactionType?.id],
      ["type", selectedType?.id],
      ["status", filters.STATUS],
    ].forEach(([key, value]) =>
      handleQueryParams(queryParams, key!.toString(), value)
    );

    router.push(`${Endpoints.ANNOUNCEMENTS}?${queryParams.toString()}`);
  };

  if (!isClient) {
    return null;
  }

  const citiesAutcompleteWidth = isDesktop ? "" : "100%";
  const renderFilters = () => (
    <div
      style={{
        display: "flex",
        flexDirection: isDesktop ? "row" : "column",
        flexWrap: isDesktop ? "nowrap" : "nowrap",
        gap: "16px",
        alignItems: "flex-start",
        justifyContent: "space-between",
        width: isDesktop ? "100%" : "90%",
      }}
    >
      {filters.TYPE === "Cabane/Case la tara" ? (
        <AutocompleteCounties
          onChange={(event, value) => setFilters({ ...filters, COUNTY: value?.toString() ?? "" })}
          label={MESSAGES.SEARCH_COUNTY_LABEL}
          customWidth={citiesAutcompleteWidth}
        />
      ) : (
        <AutocompleteCities
          onChange={(event, value) => setFilters({ ...filters, CITY: value?.toString() ?? "" })}
          label={MESSAGES.SEARCH_CITY_LABEL}
          customWidth={citiesAutcompleteWidth}
        />
      )}

      <SelectDropdownContainer $isWide={!isDesktop} style={{ width: "100%" }}>
        <SelectDropdown
          name="type"
          label={MESSAGES.SEARCH_TYPE_LABEL}
          options={typeOptions}
          value={filters.TYPE}
          handleChange={(event) => setFilters({ ...filters, TYPE: event.target.value.toString() })}
        />
      </SelectDropdownContainer>
      {filters.TYPE === "Apartamente" && (
        <SelectDropdown
          name="rooms"
          label={MESSAGES.SEARCH_ROOMS_LABEL}
          options={roomOptions}
          value={filters.ROOMS}
          handleChange={(event) => setFilters({ ...filters, ROOMS: Number(event.target.value) })}
          sx={{ flex: "1 1 30%" }}
        />
      )}
      <SelectDropdown
        name="minSurface"
        label={MESSAGES.SEARCH_MIN_SURFACE_LABEL}
        options={minSurfaceOptions}
        value={filters.MIN_SURFACE}
        handleChange={(event) =>
          setFilters({ ...filters, MIN_SURFACE: Number(event.target.value) })
        }
        sx={{ flex: "1 1 30%" }}
      />
      <SelectDropdown
        name="maxSurface"
        label={MESSAGES.SEARCH_MAX_SURFACE_LABEL}
        options={maxSurfaceOptions}
        value={filters.MAX_SURFACE}
        handleChange={(event) =>
          setFilters({ ...filters, MAX_SURFACE: Number(event.target.value) })
        }
        sx={{ flex: "1 1 30%" }}
      />
      <SelectDropdown
        name="price"
        label={MESSAGES.SEARCH_PRICE_LABEL}
        options={priceOptions}
        value={filters.PRICE}
        handleChange={(event) =>
          setFilters({ ...filters, PRICE: Number(event.target.value) })
        }
        sx={{ flex: "1 1 30%" }}
      />
      <PrimaryButton
        icon="search"
        text="Caută"
        onClick={onSearch}
        fullWidth={!isDesktop}
        sx={{
          flex: "1 1 30%",
          padding: isDesktop ? "15px 20px" : "6px 16px",
          alignSelf: isDesktop ? "flex-end" : "center",
        }}
      />
    </div>
  );

  return (
    <Container>
      <ResponsiveLogoContainer isDesktop={isDesktop}>
        <Image src={logo} alt="eproprietar" fill style={{ objectFit: "contain" }} />
      </ResponsiveLogoContainer>
      <Subtitle>Tu ce cauți azi?</Subtitle>

      {isDesktop ? (
        <SearchContainer
          style={{
            width: "80%",
            margin: "0 auto",
            display: "flex",
            flexDirection: "column",
            gap: "16px",
          }}
        >
          {renderFilters()}
        </SearchContainer>
      ) : (
        <FloatingCardWrapper>
          <div style={{ padding: "16px", width: "100%" }}>{renderFilters()}</div>
        </FloatingCardWrapper>
      )}
    </Container>
  );
};

export default Main;
