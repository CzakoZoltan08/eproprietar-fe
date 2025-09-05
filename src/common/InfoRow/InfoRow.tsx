import React from "react";
import styled from "styled-components";

const InfoRowContainer = styled.div`
  display: flex;
  flex-direction: row;   /* ← changed from column */
  align-items: baseline;
  justify-content: space-between;
  padding: 2px 0;        /* tighter vertical spacing */
  gap: 8px;              /* optional space between label and value */
`;

const Label = styled.span`
  font-weight: 500;
  font-size: 13px;
  color: #222;
`;

const Value = styled.span`
  font-size: 13px;
  color: #555;
`;

const InfoRow = ({ title, value }: { title: string; value?: string }) => {
  return (
    <InfoRowContainer>
      <Label>{title}</Label>
      <Value>{value ?? "-"}</Value>
    </InfoRowContainer>
  );
};

export default InfoRow;
