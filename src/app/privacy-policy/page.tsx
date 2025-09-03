"use client";

import * as palette from "@/constants/colors";

import { Box, Grid, Typography } from "@mui/material";
import {
  COLOR_BORDER_PRIMARY,
  COLOR_TEXT,
  COLOR_TEXT_LIGHT,
} from "@/constants/colors";

import { Layout } from "@/common/layout/Layout";
import React from "react";
import styled from "styled-components";

/* =========================
   Layout
   ========================= */

const PageWrap = styled(Box)`
  max-width: 960px;
  margin: 0 auto;
  padding: 32px 24px;
  margin-bottom: 48px; /* extra space above footer */
`;

/* HERO */
const Hero = styled.section`
  background: linear-gradient(180deg, #f8fbff 0%, #ffffff 100%);
  border: 1px solid #eef3f8;
  border-radius: 12px;
  padding: 28px 22px;
  margin-bottom: 24px;
  text-align: center;
`;

const HeroTitle = styled.h1`
  margin: 0 0 10px;
  font-size: clamp(26px, 4vw, 36px);
  line-height: 1.25;
  font-weight: 800;
  color: #0f172a;
`;

const HeroDivider = styled.hr`
  border: none;
  border-top: 1px solid #e6eaf2;
  margin: 20px auto;
  width: 100%;
`;

/* Sections */
const Section = styled(Box)`
  border: 1px solid ${COLOR_BORDER_PRIMARY};
  border-radius: 16px;
  padding: 24px;
  margin-bottom: 24px;
  background: #fff;
`;

const SubTitle = styled(Typography).attrs({ variant: "h5" })`
  font-weight: 700 !important;
  color: ${COLOR_TEXT};
  margin: 16px 0 8px !important;
`;

const MiniTitle = styled(Typography).attrs({ variant: "h6" })`
  font-weight: 600 !important;
  color: ${COLOR_TEXT};
  margin: 12px 0 6px !important;
`;

const Paragraph = styled(Typography).attrs({ variant: "body1" })`
  color: ${COLOR_TEXT};
  line-height: 1.7 !important;
  margin: 8px 0 !important;
  white-space: pre-line;
`;

const List = styled.ul`
  margin: 6px 0 12px 18px;
  padding: 0;
  line-height: 1.7;
`;

/* =========================
   Page
   ========================= */

export default function TermsAndConditions() {
  return (
    <Layout>
      <Box height="100%" sx={{ position: "relative", color: COLOR_TEXT_LIGHT }}>
        <Grid container justifyContent="center" p={{ xs: 3, md: 4 }}>
          <Grid item xs={12} md={10} lg={9}>
            <PageWrap>
              {/* HERO */}
              <Hero>
                <HeroTitle>Termeni și Condiții</HeroTitle>
                <Paragraph as="p" sx={{ marginTop: 1 }}>
                  www.eproprietar.ro
                </Paragraph>
                <HeroDivider />
              </Hero>

              {/* PREAMBUL */}
              <Section>
                <SubTitle>Preambul</SubTitle>
                <Paragraph>
                  Prezentul document reprezintă un contract între dumneavoastră („Utilizatorul") și SC IMO CASA SOLUTIONS SRL („Operatorul" sau „Compania"), care stabilește condițiile de utilizare a platformei www.eproprietar.ro și modul în care protejăm datele dumneavoastră cu caracter personal. Vă rugăm să citiți cu atenție acest document înainte de a utiliza serviciile noastre.
                </Paragraph>
              </Section>

              {/* 1. INFORMATII GENERALE */}
              <Section>
                <SubTitle>1. Informații Generale</SubTitle>
                <MiniTitle>1.1 Despre Operator</MiniTitle>
                <Paragraph>
                  SC IMO CASA SOLUTIONS SRL este o societate comercială românească, înființată și funcționând în conformitate cu legislația din România. Societatea își are sediul social în Cluj-Napoca, județul Cluj, fiind înregistrată la Registrul Comerțului sub numărul <b>J12/2530/2016</b> și având Codul Unic de Înregistrare <b>36270153</b>.
                </Paragraph>
                <MiniTitle>1.2 Despre Platformă</MiniTitle>
                <Paragraph>
                  www.eproprietar.ro reprezintă o platformă online specializată în anunțuri de vânzare sau închiriere din domeniul imobiliar, concepută și dezvoltată pentru a facilita legăturile directe între proprietari și potențiali cumpărători sau chiriași. Platforma se distinge prin trei caracteristici fundamentale:
                </Paragraph>
                <List>
                  <li>
                    <b>Exclusivitate pentru proprietari și dezvoltatori:</b> publicarea anunțurilor este permisă exclusiv proprietarilor direcți; dezvoltatorii imobiliari beneficiază de secțiuni dedicate. Intermediarii și agențiile imobiliare pot publica doar în secțiunea dedicată lor, cu <b>contract oficial de reprezentare directă</b> și în condițiile impuse de platformă.
                  </li>
                  <li>
                    <b>Transparență și siguranță:</b> verificare riguroasă a identității utilizatorilor, validare a anunțurilor, mecanisme de raportare a abuzurilor și protecție împotriva fraudelor.
                  </li>
                  <li>
                    <b>Funcționalități avansate:</b> căutare multi-criterii, statistici și analize de piață, instrumente pentru evaluarea imobiliară.
                  </li>
                </List>
                <MiniTitle>1.3 Date de Contact</MiniTitle>
                <Paragraph>
                  Pentru asistență generală și sugestii: <a href="mailto:contact@eproprietar.ro">contact@eproprietar.ro</a>
                  {"\n"}Pentru colaborări comerciale și publicitate: <a href="mailto:marketing@eproprietar.ro">marketing@eproprietar.ro</a>
                  {"\n"}Pentru GDPR și protecția datelor: <a href="mailto:datepersonale@eproprietar.ro">datepersonale@eproprietar.ro</a>
                </Paragraph>
              </Section>

              {/* 2. TERMENI GENERALI */}
              <Section>
                <SubTitle>2.1 Termeni Generali</SubTitle>
                <Paragraph>
                  Pentru asigurarea unei înțelegeri complete și uniforme a termenilor utilizați în prezentul document, următorii termeni vor avea înțelesurile definite mai jos:
                </Paragraph>
                <List>
                  <li><b>Platformă/Site:</b> website-ul www.eproprietar.ro, subdomenii, aplicații mobile și servicii electronice asociate.</li>
                  <li><b>Servicii:</b> totalitatea funcționalităților oferite, inclusiv intermediere electronică, promovare și publicitate.</li>
                  <li><b>Conținut:</b> texte, descrieri, anunțuri, fotografii, imagini, materiale grafice, video/audio, date.</li>
                  <li><b>Utilizator:</b> persoană fizică sau juridică ce accesează platforma (min. 18 ani), vizitator sau membru.</li>
                  <li><b>Proprietar:</b> persoană/firma cu drept legal de proprietate și de vânzare/închiriere asupra imobilului.</li>
                  <li><b>Dezvoltator Imobiliar:</b> persoană juridică ce dezvoltă proiecte imobiliare cu autorizațiile necesare.</li>
                  <li><b>Cont de Utilizator:</b> spațiu virtual personal, asociat unei adrese de email, protejat prin parolă.</li>
                  <li><b>Anunț Imobiliar:</b> ofertă de vânzare/închiriere publicată pe platformă cu informațiile obligatorii.</li>
                  <li><b>Date cu Caracter Personal:</b> informații despre o persoană fizică, protejate conform GDPR.</li>
                  <li><b>Cookies:</b> fișiere text pentru funcționalitatea site-ului, controlabile din browser.</li>
                  <li><b>Credențiale de Acces:</b> combinația email + parolă, confidențială și responsabilitatea utilizatorului.</li>
                </List>
              </Section>

              {/* 3. TERMENI ȘI CONDIȚII DE UTILIZARE */}
              <Section>
                <SubTitle>3. Termeni și Condiții de Utilizare</SubTitle>
                <MiniTitle>3.1 Acceptarea Termenilor</MiniTitle>
                <Paragraph>
                  Prin accesarea și utilizarea platformei www.eproprietar.ro, utilizatorul acceptă în mod expres și neechivoc prezentele condiții de utilizare. Dacă nu sunteți de acord, vă rugăm să încetați utilizarea platformei. Acceptarea creează un contract legal între utilizator și SC IMO CASA SOLUTIONS SRL. Termenii pot fi modificați, cu notificarea prealabilă a utilizatorilor înregistrați; continuarea utilizării după publicarea modificărilor constituie acceptarea acestora.
                </Paragraph>

                <MiniTitle>3.2 Eligibilitate și Înregistrare</MiniTitle>
                <Paragraph>
                  <b>3.2.1 Condiții de Eligibilitate.</b> Utilizatorul trebuie să aibă cel puțin 18 ani, capacitate deplină de exercițiu, să fie proprietarul legal al imobilului sau să aibă dreptul legal de a-l comercializa. Utilizarea platformei de către agenți imobiliari este permisă numai în secțiunea dedicată lor și în condițiile impuse de platformă. Acceptarea termenilor este obligatorie.
                </Paragraph>
                <Paragraph>
                  <b>3.2.2 Procesul de Înregistrare.</b> Crearea contului presupune: furnizarea unui email valid, alegerea unei parole, completarea profilului, verificarea emailului prin link și acceptarea termenilor. Informațiile trebuie să fie corecte și actualizate, verificabile la cererea Companiei.
                </Paragraph>

                <MiniTitle>3.3 Servicii și Funcționalități</MiniTitle>
                <Paragraph>
                  <b>3.3.1 Servicii Gratuite.</b> Căutarea și vizualizarea anunțurilor, crearea/gestionarea contului, salvarea căutărilor, alerte de căutare, contactarea proprietarilor prin formulare, alte servicii ale platformei.
                </Paragraph>
                <Paragraph>
                  <b>3.3.2 Servicii cu Plată.</b> Pentru proprietari, dezvoltatori și agenți cu exclusivitate: 
                </Paragraph>
                <List>
                  <li><b>Pachete de Listare:</b> promovare pe perioade determinate.</li>
                  <li><b>Servicii de Promovare:</b> evidențiere în listă, top listing, newsletter, secțiunea „Proprietăți Recomandate"; pachetele pot fi modificate în funcție de interesul platformei.</li>
                </List>

                <MiniTitle>3.4 Reguli de Publicare Anunțuri</MiniTitle>
                <Paragraph>
                  <b>3.4.1 Conținutul Anunțurilor.</b> Anunțul trebuie să includă: titlu clar, preț corect, suprafață și compartimentare, adresă/zona, minim 3 fotografii recente și relevante, date de contact valide. Fotografiile trebuie să fie reale, clare, bine luminate; nu sunt permise watermark-uri, text suprapus, colaje sau editări excesive. Rezoluție minimă: 800×600 px. Descrierea trebuie să conțină informații corecte despre finisaje/dotări, situație juridică, disponibilitate și condiții specifice.
                </Paragraph>
                <Paragraph>
                  <b>3.4.2 Restricții de Conținut.</b> Este interzisă publicarea informațiilor false/înșelătoare, promovarea serviciilor de intermediere în afara secțiunii dedicate, conținut discriminator/offensator, încălcarea drepturilor de proprietate intelectuală sau a legii.
                </Paragraph>

                <MiniTitle>3.5 Drepturi și Obligații</MiniTitle>
                <Paragraph>
                  Drepturile utilizatorului: acces la servicii conform termenilor, suport tehnic, rectificare/ștergere date personale, contestarea deciziilor administrative, notificări privind modificările importante.
                </Paragraph>
                <Paragraph>
                  Obligațiile utilizatorului: furnizare informații corecte și complete, actualizare promptă, păstrarea confidențialității credențialelor, respectarea drepturilor celorlalți, neutilizarea platformei în scopuri frauduloase.
                </Paragraph>
                <Paragraph>
                  Drepturile Companiei: modificare/suspendare servicii, ștergere conținut neconform, suspendare/închidere conturi, implementare măsuri suplimentare de securitate, colaborare cu autoritățile în caz de fraudă.
                </Paragraph>

                <MiniTitle>3.6 Răspundere</MiniTitle>
                <Paragraph>
                  Compania nu își asumă răspunderea pentru acuratețea informațiilor furnizate de utilizatori, conduita utilizatorilor în afara platformei, prejudicii rezultate din utilizarea serviciilor, pierderi de date cauzate de forță majoră sau imposibilitatea temporară de accesare a serviciilor.
                </Paragraph>

                <MiniTitle>3.7 Încetarea Serviciilor</MiniTitle>
                <Paragraph>
                  Utilizatorul poate solicita închiderea contului în orice moment, prin formularul dedicat, cu păstrarea obligațiilor anterioare și arhivarea datelor conform legii. Compania poate închide conturi în caz de încălcări repetate, activități frauduloase, inactivitate peste 12 luni, furnizare de informații false sau la cererea autorităților.
                </Paragraph>
              </Section>

              {/* 4. DISPOZITII FINALE */}
              <Section>
                <SubTitle>4. Dispoziții Finale</SubTitle>
                <MiniTitle>4.1 Modificări ale Documentului</MiniTitle>
                <Paragraph>
                  SC IMO CASA SOLUTIONS SRL își rezervă dreptul de a modifica și actualiza prezentul document pentru a reflecta modificările legislative, ale practicilor de prelucrare a datelor sau ale funcționalităților platformei. Orice modificare substanțială va fi comunicată utilizatorilor prin actualizarea datei ultimei modificări din document. Continuarea utilizării platformei după publicarea modificărilor constituie acceptarea acestora. Dacă nu sunteți de acord, puteți înceta utilizarea serviciilor noastre.
                </Paragraph>
                <MiniTitle>4.2 Legea Aplicabilă și Jurisdicție</MiniTitle>
                <Paragraph>
                  Prezentul document este guvernat de legislația din România. Orice dispută va fi soluționată pe cale amiabilă sau, în lipsa acesteia, de către instanțele competente din România.
                </Paragraph>
                <Paragraph>
                  <i>Prezentul document a fost actualizat la data de 15.09.2025.</i>
                </Paragraph>
              </Section>

              {/* Politica de Confidențialitate și Cookies (structurată, fără raw text) */}
              <Section>
                <SubTitle>Politica de Confidențialitate și Cookies</SubTitle>
                <Paragraph>www.eproprietar.ro</Paragraph>

                <MiniTitle>1. Angajamentul Nostru privind Protecția Datelor</MiniTitle>
                <Paragraph>
                  SC IMO CASA SOLUTIONS SRL acordă o importanță deosebită protejării vieții private a utilizatorilor platformei www.eproprietar.ro. Ne angajăm să prelucrăm datele dumneavoastră cu caracter personal în conformitate cu Regulamentul General privind Protecția Datelor (GDPR) și legislația națională aplicabilă în domeniul protecției datelor. Prezenta politică de confidențialitate descrie practicile noastre privind colectarea, utilizarea și protejarea datelor dumneavoastră personale.
                </Paragraph>

                <MiniTitle>2. Operatorul de Date</MiniTitle>
                <Paragraph>
                  În calitate de operator de date, SC IMO CASA SOLUTIONS SRL este responsabilă pentru prelucrarea datelor dumneavoastră cu caracter personal. Pentru orice întrebări legate de prelucrarea datelor personale ne puteți contacta la adresa datepersonale@eproprietar.ro.
                </Paragraph>

                <MiniTitle>3. Categorii de Date Prelucrate</MiniTitle>
                <MiniTitle>3.1 Date de Identificare și Contact</MiniTitle>
                <Paragraph>
                  Pentru crearea și gestionarea contului dumneavoastră, colectăm și prelucrăm date de identificare care includ numele și prenumele, adresa de email și numărul de telefon. În mod opțional, puteți furniza adresa de corespondență. În cazuri specifice, pentru verificarea identității, vom solicita o copie a documentului de identitate.
                </Paragraph>
                <MiniTitle>3.2 Date despre Proprietăți</MiniTitle>
                <Paragraph>
                  În cadrul anunțurilor imobiliare, procesăm informații complete despre proprietate, incluzând adresa completă, detaliile tehnice despre imobil, fotografiile proprietății, documentele care atestă dreptul de proprietate, precum și istoricul modificărilor anunțului.
                </Paragraph>
                <MiniTitle>3.3 Date de Utilizare</MiniTitle>
                <Paragraph>
                  Pe parcursul utilizării platformei, colectăm informații tehnice precum adresa IP și date de localizare, informații despre dispozitivul utilizat, date despre modul de utilizare a platformei, preferințele de căutare și navigare, precum și interacțiunile cu alte anunțuri.
                </Paragraph>
                <MiniTitle>3.4 Date de Tranzacționare</MiniTitle>
                <Paragraph>
                  Pentru serviciile cu plată, procesăm informații despre pachetele achiziționate, istoricul plăților efectuate, facturile și documentele fiscale aferente, precum și informațiile necesare despre metodele de plată utilizate.
                </Paragraph>

                <MiniTitle>4. Scopurile și Temeiurile Prelucrării</MiniTitle>
                <MiniTitle>4.1 Prelucrări bazate pe Executarea Contractului</MiniTitle>
                <Paragraph>
                  În baza relației contractuale, prelucrăm datele dumneavoastră pentru crearea și gestionarea contului de utilizator, publicarea și administrarea anunțurilor, facilitarea comunicării între utilizatori, procesarea plăților pentru serviciile premium și furnizarea suportului tehnic necesar.
                </Paragraph>
                <MiniTitle>4.2 Prelucrări bazate pe Obligații Legale</MiniTitle>
                <Paragraph>
                  În conformitate cu cerințele legale, prelucrăm date necesare pentru emiterea și păstrarea documentelor fiscale, răspunsul la solicitările autorităților competente, prevenirea fraudelor și a spălării banilor, precum și pentru arhivarea documentelor conform prevederilor legale.
                </Paragraph>
                <MiniTitle>4.3 Prelucrări bazate pe Interesul Legitim</MiniTitle>
                <Paragraph>
                  Pentru îmbunătățirea serviciilor noastre, prelucrăm date în scopul realizării de analize statistice și de piață, îmbunătățirii funcționalităților platformei, asigurării securității sistemelor și prevenirii utilizării abuzive a serviciilor.
                </Paragraph>
                <MiniTitle>4.4 Prelucrări bazate pe Consimțământ</MiniTitle>
                <Paragraph>
                  Cu acordul dumneavoastră explicit, prelucrăm date pentru transmiterea comunicărilor comerciale, personalizarea conținutului afișat, realizarea de sondaje și cercetări de piață, precum și pentru promovarea anunțurilor pe platformele partenere.
                </Paragraph>

                <MiniTitle>5. Perioada de Păstrare a Datelor</MiniTitle>
                <MiniTitle>5.1 Criterii de Stabilire a Duratei</MiniTitle>
                <Paragraph>
                  Perioada de păstrare a datelor personale este determinată de necesitatea îndeplinirii scopurilor pentru care au fost colectate, respectarea obligațiilor legale aplicabile, protejarea intereselor legitime ale părților implicate și soluționarea eventualelor dispute sau litigii.
                </Paragraph>
                <MiniTitle>5.2 Perioade Specifice de Păstrare</MiniTitle>
                <Paragraph>
                  Am stabilit perioade specifice de păstrare pentru diferitele categorii de date: datele contului de utilizator activ sunt păstrate pe durata existenței contului, datele conturilor inactive sunt păstrate pentru 12 luni de la ultima activitate, datele anunțurilor sunt păstrate pentru 3 ani de la expirarea anunțului, datele tranzacționale sunt păstrate pentru 10 ani conform legislației fiscale, iar datele de comunicare sunt păstrate pentru 3 ani de la ultima interacțiune.
                </Paragraph>

                <MiniTitle>6. Destinatarii Datelor</MiniTitle>
                <MiniTitle>6.1 Categorii de Destinatari</MiniTitle>
                <Paragraph>
                  Transmitem datele dumneavoastră doar către destinatari autorizați, precum furnizorii de servicii IT și hosting, procesatorii de plăți și instituțiile financiare necesare, furnizorii de servicii de marketing (doar cu consimțământul dumneavoastră), autoritățile publice în cazurile prevăzute de lege și consultanții profesionali în domeniul juridic și contabil.
                </Paragraph>
                <MiniTitle>6.2 Transferuri Internaționale</MiniTitle>
                <Paragraph>
                  În cazul transferurilor de date în afara Spațiului Economic European, asigurăm protecția adecvată prin transferuri către țări cu nivel adecvat de protecție, implementarea de garanții contractuale adecvate, utilizarea clauzelor contractuale standard aprobate de Comisia Europeană și obținerea autorizărilor necesare de la autoritățile competente.
                </Paragraph>

                <MiniTitle>7 Drepturile Persoanelor Vizate</MiniTitle>
                <Paragraph>
                  În relație cu datele dumneavoastră personale, beneficiați de dreptul de acces la date, dreptul la rectificarea datelor, dreptul la ștergerea datelor ("dreptul de a fi uitat"), dreptul la restricționarea prelucrării, dreptul la portabilitatea datelor, dreptul la opoziție și dreptul de a nu face obiectul unor decizii automatizate. Pentru exercitarea acestor drepturi, puteți transmite o solicitare la adresa datepersonale@eproprietar.ro. Ne angajăm să răspundem tuturor solicitărilor în termen de maximum 30 de zile calendaristice.
                </Paragraph>

                <MiniTitle>8 Contact și Suport</MiniTitle>
                <Paragraph>
                  {`Pentru orice întrebări, sugestii sau reclamații legate de acest document sau de practicile noastre privind protecția datelor, vă rugăm să ne contactați:
SC IMO CASA SOLUTIONS SRL 
Str. Dorobanților, Nr. 65 Cluj-Napoca, Cluj, România
Email General: contact@eproprietar.ro 
Email GDPR: datepersonale@eproprietar.ro`}
                </Paragraph>

                <MiniTitle>9 Autoritatea de Supraveghere</MiniTitle>
                <Paragraph>
                  {`Pentru plângeri legate de prelucrarea datelor personale, vă puteți adresa Autorității Naționale de Supraveghere a Prelucrării Datelor cu Caracter Personal:
Autoritatea Națională de Supraveghere a Prelucrării Datelor cu Caracter Personal B-dul G-ral. Gheorghe Magheru nr. 28-30, Sector 1, București www.dataprotection.ro`}
                </Paragraph>

                <SubTitle>Politica de Cookies</SubTitle>
                <MiniTitle>10.1 Despre Cookies și Tehnologii Similare</MiniTitle>
                <Paragraph>
                  În cadrul platformei www.eproprietar.ro, utilizăm cookies și alte tehnologii similare pentru a îmbunătăți experiența dumneavoastră de navigare și pentru a oferi servicii adaptate nevoilor și intereselor dumneavoastră. Un cookie este un fișier text de mici dimensiuni, format din litere și numere, care va fi stocat pe computerul, terminalul mobil sau alte echipamente ale unui utilizator de pe care se accesează platforma noastră.
                </Paragraph>

                <MiniTitle>10.2 Categorii de Cookies Utilizate</MiniTitle>
                <MiniTitle>10.2.1 Cookies Strict Necesare</MiniTitle>
                <Paragraph>
                  Aceste cookies sunt esențiale pentru funcționarea platformei și nu pot fi dezactivate în sistemele noastre. Ele sunt de obicei instalate doar ca răspuns la acțiunile efectuate de dumneavoastră care echivalează cu o solicitare de servicii, cum ar fi setarea preferințelor de confidențialitate, autentificarea sau completarea formularelor. Perioada de stocare este limitată la sesiunea de navigare sau extinsă până la maximum 24 de ore pentru datele de autentificare.
                </Paragraph>
                <MiniTitle>10.2.2 Cookies de Performanță</MiniTitle>
                <Paragraph>
                  Aceste cookies ne permit să contorizăm vizitele și sursele de trafic pentru a putea măsura și îmbunătăți performanța platformei noastre. Ele ne ajută să știm care pagini sunt cele mai populare sau mai puțin populare și să vedem cum navigează vizitatorii pe site. Toate informațiile colectate de aceste cookies sunt agregate și, prin urmare, anonime. Perioada de stocare este de maximum 2 ani.
                </Paragraph>
                <MiniTitle>10.2.3 Cookies de Funcționalitate</MiniTitle>
                <Paragraph>
                  Aceste cookies permit platformei să ofere funcționalități și personalizare îmbunătățită. Ele pot fi setate de noi sau de furnizori terți ale căror servicii le-am adăugat la paginile noastre. Perioada de stocare variază între 30 de zile și 1 an, în funcție de specificul funcționalității.
                </Paragraph>
                <MiniTitle>10.2.4 Cookies de Marketing</MiniTitle>
                <Paragraph>
                  Aceste cookies pot fi setate prin intermediul site-ului nostru de partenerii noștri de publicitate. Ele pot fi folosite de aceste companii pentru a construi un profil al intereselor dumneavoastră și pentru a vă arăta reclame relevante pe alte site-uri. Perioada de stocare este de maximum 13 luni.
                </Paragraph>

                <MiniTitle>10.3 Gestionarea Preferințelor pentru Cookies</MiniTitle>
                <MiniTitle>10.3.1 Panoul de Control al Cookies</MiniTitle>
                <List>
                  <li>Accepta toate cookies</li>
                  <li>Respinge toate cookies non-esențiale</li>
                  <li>Personaliza preferințele pentru fiecare categorie de cookies</li>
                  <li>Modifica ulterior preferințele prin intermediul Centrului de Preferințe pentru Cookies</li>
                </List>
                <MiniTitle>10.3.2 Setările Browser-ului</MiniTitle>
                <Paragraph>Suplimentar, puteți controla și șterge cookies direct din browser-ul dumneavoastră. Fiecare browser are setări specifice pentru gestionarea cookies:</Paragraph>
                <List>
                  <li>Google Chrome: Setări → Confidențialitate și securitate → Cookie-uri și alte date ale site-ului</li>
                  <li>Mozilla Firefox: Meniu → Opțiuni → Confidențialitate și Securitate</li>
                  <li>Safari: Preferințe → Confidențialitate</li>
                  <li>Microsoft Edge: Setări → Confidențialitate, căutare și servicii</li>
                </List>

                <Paragraph>
                  Prezentul document a fost actualizat la data de 15.09.2025.
                </Paragraph>
              </Section>
</PageWrap>
          </Grid>
        </Grid>
      </Box>
    </Layout>
  );
}
