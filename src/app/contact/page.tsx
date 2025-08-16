"use client";

import * as palette from "@/constants/colors";

import { Layout } from "@/common/layout/Layout";
import React from "react";
import styled from "styled-components";

/* -------- styled -------- */

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  border-radius: 8px;
  border: 1px solid ${palette.COLOR_BORDER_PRIMARY};
  background: #fff;
  padding: 24px;
  margin: 8px 32px;
`;

const PageWrap = styled.main`
  max-width: 800px;
  margin: 0 auto;
  padding: 32px 20px;
  margin-bottom: 48px; /* space above footer */
  color: ${palette.COLOR_TEXT ?? "#1f2937"};
`;

const Title = styled.h1`
  font-size: clamp(24px, 4vw, 32px);
  margin-bottom: 20px;
  font-weight: 800;
  color: ${palette.COLOR_TEXT ?? "#0f172a"};
`;

const Card = styled.div`
  background: #fff;
  border: 1px solid ${palette.COLOR_BORDER_PRIMARY ?? "#e5e7eb"};
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 6px rgba(15, 23, 42, 0.06);
`;

const Line = styled.p`
  margin: 8px 0;
  font-size: 15px;
  color: ${palette.COLOR_TEXT ?? "#1f2937"};

  a {
    color: ${palette.COLOR_PRIMARY};
    text-decoration: none;
    font-weight: 700;
    &:hover {
      text-decoration: underline;
    }
  }
`;

/* -------- page -------- */

export default function ContactPage() {
  return (
    <Layout>
      <Container>
        <PageWrap>
          <Title>Detalii de contact</Title>
          <Card>
            <Line>
              <strong>SC IMO CASA SOLUTIONS SRL</strong>
            </Line>
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
              GDPR: <a href="mailto:gdpr@eproprietar.ro">gdpr@eproprietar.ro</a>
            </Line>
          </Card>
        </PageWrap>
      </Container>
    </Layout>
  );
}