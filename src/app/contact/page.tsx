"use client";

import * as palette from "@/constants/colors";

import React from "react";
import styled from "styled-components";

const Page = styled.main`
  max-width: 800px;
  margin: 0 auto;
  padding: 32px 20px;
  color: #1f2937;
`;

const Title = styled.h1`
  font-size: 28px;
  margin-bottom: 20px;
  color: #0f172a;
`;

const Card = styled.div`
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 6px rgba(15, 23, 42, 0.06);
`;

const Line = styled.p`
  margin: 8px 0;
  font-size: 15px;

  a {
    color: ${palette.COLOR_PRIMARY};
    text-decoration: none;
    &:hover {
      text-decoration: underline;
    }
  }
`;

export default function ContactPage() {
  return (
    <Page>
      <Title>Detalii de contact</Title>
      <Card>
        <Line><strong>SC IMO CASA SOLUTIONS SRL</strong></Line>
        <Line>Birou: Str. Dorobanților nr. 65, Cluj-Napoca, Cluj</Line>
        <Line>
          General / Informații / Sesizări:{" "}
          <a href="mailto:contact@eproprietar.ro">contact@eproprietar.ro</a>
        </Line>
        <Line>
          Servicii Publicitate / Marketing:{" "}
          <a href="mailto:marketing@eproprietar.ro">marketing@eproprietar.ro</a>
        </Line>
        <Line>
          GDPR:{" "}
          <a href="mailto:gdpr@eproprietar.ro">gdpr@eproprietar.ro</a>
        </Line>
      </Card>
    </Page>
  );
}