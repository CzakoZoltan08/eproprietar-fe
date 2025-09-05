import * as breakpoints from "./constants/breakpoints";

import {
  Container,
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
import SelectDropdown from "./common/dropdown/SelectDropdown";
import bannerEproprietar from "./assets/banner_eproprietar.png";
import { useMediaQuery } from "react-responsive";
import { useStore } from "@/hooks/useStore";

function getDropdownValuesNumberRange(start: number, end: number, step: number) {
  return Array.from({ length: (end - start) / step + 1 }, (_, i) => ({
    id: start + i * step,
    value: start + i * step,
  }));
}

const TRANSACTION_TABS = [
  { id: "vanzare", label: "Vânzare", value: "Vânzare" },
  { id: "inchiriere", label: "Închiriere", value: "Închiriere" },
];

export const Main = () => {
  const {
    userStore: { getCurrentUser, user },
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
    const smallSteps = getDropdownValuesNumberRange(5000, 50000, 5000);      // 5k → 50k
    const mediumSteps = getDropdownValuesNumberRange(60000, 500000, 10000);  // 60k → 500k
    const bigSteps = getDropdownValuesNumberRange(600000, 900000, 100000);   // 600k → 900k
    const millionSteps = Array.from({ length: 10 }, (_, i) => ({
      id: (i + 1) * 1_000_000,
      value: (i + 1) * 1_000_000,
    })); // 1M → 10M

    setPriceOptions([
      ...smallSteps,
      ...mediumSteps,
      ...bigSteps,
      ...millionSteps
    ]);
    
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

  const onSearch = () => {
    const selectedType = typeOptions.find((it) => it.value === filters.TYPE);
    const selectedTransactionType = transactionTypeOptions.find(
      (it) => it.value === filters.TRANSACTION_TYPE
    );

    const queryParams = new URLSearchParams(searchParams.toString());

    const isCabaneType = filters.TYPE === "Cabane/Case la tara";
    const isApartmentType = filters.TYPE === "Apartamente";

    [
      ["page", "1"],
      ["minPrice", filters.MIN_PRICE],
      ["maxPrice", filters.MAX_PRICE],
      ["minSurface", filters.MIN_SURFACE],
      ["maxSurface", filters.MAX_SURFACE],
      isCabaneType
        ? ["county", filters.COUNTY]
        : ["city", filters.CITY],
      ...(!isApartmentType ? [] : [["rooms", filters.ROOMS]]),
      ["transactionType", selectedTransactionType?.id],
      ["type", selectedType?.id],
      ["status", filters.STATUS],
    ].forEach(([key, value]) =>
      handleQueryParams(queryParams, key!.toString(), value)
    );

    if (["Case/Vile", "Cabane/Case la tara"].includes(filters.TYPE)) {
      handleQueryParams(queryParams, "minLandSurface", filters.LAND_SURFACE_MIN);
      handleQueryParams(queryParams, "maxLandSurface", filters.LAND_SURFACE_MAX);
    }

    router.push(`${Endpoints.ANNOUNCEMENTS}?${queryParams.toString()}`);
  };

  if (!isClient) {
    return null;
  }

  const renderTransactionTabs = () => (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-start", // ← ensures left alignment
        gap: "16px",
        marginBottom: "16px",
        flexWrap: "wrap",
        fontWeight: 800,
        fontSize: "0.875rem",
        fontFamily: '"Roboto", sans-serif',
        lineHeight: "1.75",
        width: "100%", // ← makes sure it spans full width of parent
      }}
    >
      {TRANSACTION_TABS.map((tab) => (
        <button
          key={tab.id}
          onClick={() =>
            setFilters((prev) => ({
              ...prev,
              TRANSACTION_TYPE: tab.value,
            }))
          }
          style={{
            padding: "10px 20px",
            borderRadius: "24px",
            border: "1px solid #ccc",
            backgroundColor:
              filters.TRANSACTION_TYPE === tab.value ? "#1976d2" : "#fff",
            color:
              filters.TRANSACTION_TYPE === tab.value ? "#fff" : "#333",
            fontWeight: 500,
            cursor: "pointer",
            transition: "background-color 0.3s",
          }}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );

  const renderFilters = () => (
    <div
      style={{
        display: "flex",
        flexDirection: isDesktop ? "row" : "column",
        flexWrap: "nowrap",
        gap: "16px",
        alignItems: isDesktop ? "center" : "stretch",
        justifyContent: "space-between",
        width: isDesktop ? "100%" : "90%",
      }}
    >
      {["Cabane/Case la tara", "Terenuri"].includes(filters.TYPE) ? (
        <AutocompleteCounties
          onChange={(event, value) =>
            setFilters({ ...filters, COUNTY: value?.toString() ?? "" })
          }
          label={MESSAGES.SEARCH_COUNTY_LABEL}
          customWidth={isDesktop ? undefined : "100%"}
        />
      ) : (
        <AutocompleteCities
          onChange={(event, value) =>
            setFilters({ ...filters, CITY: value?.toString() ?? "" })
          }
          label={MESSAGES.SEARCH_CITY_LABEL}
          customWidth={isDesktop ? undefined : "100%"}
        />
      )}

      {filters.TYPE === "Terenuri" && (
          <AutocompleteCities
          onChange={(event, value) =>
            setFilters({ ...filters, CITY: value?.toString() ?? "" })
          }
          label={MESSAGES.SEARCH_CITY_LABEL}
          customWidth={isDesktop ? undefined : "100%"}
        />
        )}

      <SelectDropdownContainer $isWide={!isDesktop} style={{ width: "100%" }}>
        <SelectDropdown
          name="type"
          label={MESSAGES.SEARCH_TYPE_LABEL}
          options={typeOptions}
          value={filters.TYPE}
          handleChange={(event) =>
            setFilters({ ...filters, TYPE: event.target.value.toString() })
          }
        />
      </SelectDropdownContainer>

      {filters.TYPE === "Apartamente" && (
        <SelectDropdown
          name="rooms"
          label={MESSAGES.SEARCH_ROOMS_LABEL}
          options={roomOptions}
          value={filters.ROOMS}
          handleChange={(event) =>
            setFilters({ ...filters, ROOMS: Number(event.target.value) })
          }
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

      {["Case/Vile", "Cabane/Case la tara"].includes(filters.TYPE) && (
        <>
          <SelectDropdown
            name="minLandSurface"
            label="Suprafață teren minimă"
            options={minSurfaceOptions}
            value={filters.LAND_SURFACE_MIN}
            handleChange={(event) =>
              setFilters({ ...filters, LAND_SURFACE_MIN: Number(event.target.value) })
            }
            sx={{ flex: "1 1 30%" }}
          />

          <SelectDropdown
            name="maxLandSurface"
            label="Suprafață teren maximă"
            options={maxSurfaceOptions}
            value={filters.LAND_SURFACE_MAX}
            handleChange={(event) =>
              setFilters({ ...filters, LAND_SURFACE_MAX: Number(event.target.value) })
            }
            sx={{ flex: "1 1 30%" }}
          />
        </>
      )}

      <SelectDropdown
        name="minPrice"
        label="Preț minim"
        options={priceOptions}
        value={filters.MIN_PRICE}
        handleChange={(event) =>
          setFilters({ ...filters, MIN_PRICE: Number(event.target.value) })
        }
        sx={{ flex: "1 1 30%" }}
      />

      <SelectDropdown
        name="maxPrice"
        label="Preț maxim"
        options={priceOptions}
        value={filters.MAX_PRICE}
        handleChange={(event) =>
          setFilters({ ...filters, MAX_PRICE: Number(event.target.value) })
        }
        sx={{ flex: "1 1 30%" }}
      />

      <PrimaryButton
        icon="search"
        text="Caută"
        onClick={onSearch}
        fullWidth={!isDesktop}
        size="large"
        sx={{
          flex: "1 1 30%",
        }}
      />
    </div>
  );

  return (
    <Container>
      {isDesktop ? (
        <>
          <SearchContainer
            style={{
              width: "80%",
              margin: "0 auto",
              display: "flex",
              flexDirection: "column",
              gap: "16px",
            }}
          >
            {renderTransactionTabs()}
            {renderFilters()}
          </SearchContainer>

          <Subtitle>Direct.Proprietar.Fara comision</Subtitle>

          <div
            style={{
              width: "100%",
              display: "flex",
              justifyContent: "center",
              marginTop: isDesktop ? "24px" : "16px",
              marginBottom: isDesktop ? "24px" : "32px",
            }}
          >
            <Image
              src={bannerEproprietar}
              alt="Beneficii eproprietar"
              // Helps with LCP (it’s above the fold)
              priority
              placeholder="blur" // works with static imports
              // Let the image keep its intrinsic ratio and scale to container
              style={{
                width: isDesktop ? "60%" : "100%",
                height: "auto",
                display: "block",
                borderRadius: isDesktop ? "12px" : "0",
              }}
              // Tell the browser how wide the image appears at different viewports
              sizes={isDesktop ? "60vw" : "100vw"}
            />
          </div>
        </>
      ) : (
        <>
          <FloatingCardWrapper>
            <div style={{ padding: "16px", width: "100%" }}>
              {renderTransactionTabs()}
              {renderFilters()}
            </div>
          </FloatingCardWrapper>

          <Subtitle>Direct.Proprietar.Fara comision</Subtitle>

          <div
            style={{
              width: "100%",
              marginTop: "16px",
              marginBottom: "32px",
            }}
          >
            <Image
              src={bannerEproprietar}
              alt="Beneficii eproprietar"
              style={{
                width: "100%",
                height: "auto",
                display: "block",
                borderRadius: "0", // dacă vrei fără colțuri rotunjite
              }}
            />
          </div>
        </>
      )}
    </Container>
  );
};

export default Main;