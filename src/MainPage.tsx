import * as breakpoints from "./constants/breakpoints";

import { Container, Divider, SearchContainer, SelectDropdownContainer, Subtitle } from "./style/mainPageStyledComponents";
import React, { useEffect, useState } from "react";
import { roomOptions, transactionTypeOptions, typeOptions } from "./constants/annountementConstants";
import { useRouter, useSearchParams } from "next/navigation";

import AutocompleteCities from "./common/autocomplete/AutocompleteCities";
import FloatingCardWrapper from "./common/floatingCard/FloatingCardWrapper";
import Image from "next/image";
import { PrimaryButton } from "./common/button/PrimaryButton";
import { ResponsiveLogoContainer } from "./style/ResponsiveLogoContainer";
import SelectDropdown from "./common/dropdown/SelectDropdown";
import logo from "./assets/logo-white.svg";
import { useMediaQuery } from "react-responsive";
import { useStore } from "@/hooks/useStore";

function getDropdownValuesNumberRange(
  start: number,
  end: number,
  range: number
): { id: number; value: number }[] {
  return Array.from({ length: (end - start) / range + 1 }, (_, i) => ({
    id: start + i * range,
    value: start + i * range,
  }));
}

export const Main = () => {
  const {
    announcementStore: { fetchPaginatedAnnouncements },
  } = useStore();

  const [filters, setFilters] = useState<{
    city: string | undefined;
    type: string;
    rooms: string;
    transactionType: string;
    price: number;
    minSurface: number;
    maxSurface: number;
  }>({
    city: undefined, // Allow undefined, not null
    type: typeOptions[0].value,
    rooms: roomOptions[1].value,
    transactionType: transactionTypeOptions[0].value,
    price: 50000,
    minSurface: 10,
    maxSurface: 100,
  });

  type DropdownOption = { id: number; value: number };

  const [priceOptions, setPriceOptions] = useState<DropdownOption[]>([]);
  const [minSurfaceOptions, setMinSurfaceOptions] = useState<DropdownOption[]>([]);
  const [maxSurfaceOptions, setMaxSurfaceOptions] = useState<DropdownOption[]>([]);

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
    setPriceOptions(getDropdownValuesNumberRange(5000, 500000, 5000));
    setMinSurfaceOptions(getDropdownValuesNumberRange(10, 500, 15));
    setMaxSurfaceOptions(getDropdownValuesNumberRange(10, 500, 15));
  }, []);

  const handleQueryParams = (
    params: URLSearchParams,
    term: string,
    val: string | number | null | undefined
  ): URLSearchParams => {
    if (val) {
      params.set(term, val.toString());
    } else {
      params.delete(term);
    }
    return params;
  };

  const onSearch = async () => {
    const selectedType = typeOptions.find((it) => it.value === filters.type);
    const selectedTransactionType = transactionTypeOptions.find(
      (it) => it.value === filters.transactionType
    );

    const queryParams = new URLSearchParams(searchParams.toString());

    await fetchPaginatedAnnouncements({
      page: 1,
      limit: 8,
      filter: {
        rooms: parseInt(filters.rooms, 10),
        price: filters.price,
        minSurface: filters.minSurface,
        maxSurface: filters.maxSurface,
      },
    });

    [
      ["page", "1"],
      ["price", filters.price],
      ["minSurface", filters.minSurface],
      ["maxSurface", filters.maxSurface],
      ["city", filters.city],
      ["rooms", filters.rooms],
      ["transactionType", selectedTransactionType?.id],
      ["type", selectedType?.id],
    ].forEach(([key, value]) =>
      handleQueryParams(queryParams, key!.toString(), value)
    );

    router.push(`/announcements?${queryParams.toString()}`);
  };

  if (!isClient) {
    // Prevent rendering of media query-dependent components on the server
    return null;
  }

  return (
    <Container>
      <ResponsiveLogoContainer isDesktop={isDesktop}>
        <Image src={logo} alt="eproprietar" fill style={{ objectFit: "contain" }} />
      </ResponsiveLogoContainer>
      <Subtitle>Tu ce cauți azi?</Subtitle>

      {isDesktop ? (
        <SearchContainer>
        <AutocompleteCities
          onChange={(event, value) =>
            setFilters({ ...filters, city: value?.toString() ?? "" })
          }
          label={"Caută după localitate"}
        />
        <Divider />
      
        <SelectDropdownContainer $isWide={true}>
          <SelectDropdown
            name="type"
            label={"Tipul cautarii"}
            options={typeOptions}
            value={filters.type}
            handleChange={(event) =>
              setFilters({ ...filters, type: event.target.value.toString() })
            }
          />
        </SelectDropdownContainer>
        <Divider />
      
        {filters.type === "Apartamente" && (
          <>
            <SelectDropdown
              name="rooms"
              label={"Nr. camere"}
              options={roomOptions}
              value={filters.rooms}
              handleChange={(event) =>
                setFilters({
                  ...filters,
                  rooms: event.target.value.toString(),
                })
              }
            />
            <Divider />
          </>
        )}
      
        <SelectDropdown
          name="minSurface"
          label={"Suprafata min"}
          options={minSurfaceOptions}
          value={filters.minSurface}
          handleChange={(event) =>
            setFilters({
              ...filters,
              minSurface: Number(event.target.value),
            })
          }
        />
        <SelectDropdown
          name="maxSurface"
          label={"Suprafata max"}
          options={maxSurfaceOptions}
          value={filters.maxSurface}
          handleChange={(event) =>
            setFilters({
              ...filters,
              maxSurface: Number(event.target.value),
            })
          }
        />
        <Divider />
      
        <SelectDropdown
          name="price"
          label={"Pret maxim"}
          options={priceOptions}
          value={filters.price}
          handleChange={(event) =>
            setFilters({
              ...filters,
              price: Number(event.target.value),
            })
          }
        />
        <Divider />
      
        <SelectDropdown
          name="transactionType"
          label={"Tip tranzactie"}
          options={transactionTypeOptions}
          value={filters.transactionType}
          handleChange={(event) =>
            setFilters({
              ...filters,
              transactionType: event.target.value.toString(),
            })
          }
        />
      
        {/* Button with full width and margin */}
        <PrimaryButton
          icon="search"
          text="Caută"
          onClick={onSearch}
          fullWidth
          sx={{ padding: '15px 0' }} // Adjust margin and padding
        />
      </SearchContainer>
      
      ) : (
        <FloatingCardWrapper>
          <p>Mobile layout simplified</p>
        </FloatingCardWrapper>
      )}
    </Container>
  );
};

export default Main;