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

const Paragraph = styled(Typography).attrs({ variant: "body1" })`
  color: ${COLOR_TEXT};
  line-height: 1.7 !important;
  margin: 8px 0 !important;
  white-space: pre-line;
`;

/* =========================
   Page
   ========================= */

export default function GDPR() {
  return (
    <Layout>
      <Box height="100%" sx={{ position: "relative", color: COLOR_TEXT_LIGHT }}>
        <Grid container justifyContent="center" p={{ xs: 3, md: 4 }}>
          <Grid item xs={12} md={10} lg={9}>
            <PageWrap>
              {/* HERO */}
              <Hero>
                <HeroTitle>Politica de confidentialitate</HeroTitle>
                <HeroDivider />
              </Hero>

              {/* INTRO */}
              <Section>
                <Paragraph>
                  SC IMO CASA SOLUTIONS SRL Politica privind prelucrarea datelor
                  cu caracter personal
                </Paragraph>

                <SubTitle>Cine suntem?</SubTitle>
                <Paragraph>
                  Acest site este proprietatea SC IMO CASA SOLUTIONS SRL. Concept
                  platformei www.eproprietar.ro - platforma nationala cu anunturi
                  imobiliare exclusiv de la proprietari si dezvoltatori
                  imobiliari, fara anunturi de la agentii imobiliare,agenti
                  imobiliari,terti intermediari. Birouri: Str Dorobantilor nr 65,
                  Cluj Napoca,Cluj Contact Email : Informatii/Sesizari:
                  contact@eproprietar.ro Marketing/Oferte publicitate :
                  marketing@eproprietar.ro GDPR : gdpr@eproprietar.ro
                </Paragraph>
              </Section>

              {/* CONDITII GENERALE */}
              <Section>
                <SubTitle>CONDIȚII GENERALE DE UTILIZARE</SubTitle>
                <Paragraph>
                  Acești Termeni de utilizare au scopul de a defini termenii de
                  furnizare a site-ului www.eproprietar.ro și condițiile de
                  utilizare a Serviciilor. Termenii de utilizare se aplică
                  oricărui acces și consultării site-ului de către un utilizator
                  de internet.
                </Paragraph>

                <SubTitle>Cont de utilizator:</SubTitle>
                <Paragraph>
                  înseamnă contul pentru uz personal deschis de către un
                  utilizator de Internet pe site, care îi oferă e-mailul și alege
                  o parolă. Alte informații care pot fi solicitate sunt opționale.
                  Conturile de utilizator personale necesită de asemenea
                  deschiderea acceptării acestor Termeni de utilizare.
                </Paragraph>

                <SubTitle>Zona de cont de utilizator personal:</SubTitle>
                <Paragraph>
                  este o zonă sigură accesibilă pe site, gratuită pentru toți
                  utilizatorii, care include toate informațiile care pot fi
                  stocate (inclusiv crearea de alerte, backup-uri favorite,
                  gestionarea contului, buletine informative pentru abonamente,
                  statistici în timp real ...).
                </Paragraph>

                <SubTitle>Utilizator de Internet:</SubTitle>
                <Paragraph>
                  înseamnă orice persoană fizică care accesează site-ul Web pentru
                  utilizare privată.
                </Paragraph>

                <SubTitle>Servicii:</SubTitle>
                <Paragraph>
                  înseamnă toate serviciile accesibile prin intermediul site-ului.
                </Paragraph>

                <SubTitle>Site Web sau Website:</SubTitle>
                <Paragraph>
                  înseamnă serviciul electronic interactiv publicat și operat de
                  www.eproprietar.ro, accesibil în special la www.eproprietar.ro,
                  care permite accesul la Servicii.
                </Paragraph>

                <SubTitle>Utilizator:</SubTitle>
                <Paragraph>
                  înseamnă orice utilizator de Internet care se înregistrează pe
                  site pentru a obține un cont de utilizator personal în zona
                  contului de utilizator în cauză.
                </Paragraph>
              </Section>

              {/* CARACTERISTICI */}
              <Section>
                <SubTitle>CARACTERISTICI, UTILIZARE ȘI ABONARE LA SERVICII</SubTitle>

                <SubTitle>Compania oferă o platformă online care permite:</SubTitle>
                <Paragraph>
                  <b>Pentru persoane fizice:</b> să caute sau sa publice oferte de
                  închiriere sau cumpărare de bunuri imobiliare (noi sau vechi) și
                  să beneficieze de diversele servicii asociate;
                  <br />
                  <b>Persoane juridice:</b> dezvoltator
                  imobiliar,constructor,developer,proprietar - pentru a-și
                  prezenta oferta de imobile sau proiecte prin pachete pe care le
                  acceseaza de la companie.
                </Paragraph>

                <SubTitle>Compania oferă o platformă online care NU permite:</SubTitle>
                <Paragraph>
                  Postarea anunturilor imobiliare de catre agenti
                  imobiliari,agentii imobiliare,terti intermediari!
                </Paragraph>

                <Paragraph>
                  Unele servicii sunt puse la dispoziția utilizatorilor de
                  internet fără a fi necesară crearea unui cont de utilizator
                  personal sau profesional. Astfel, serviciile de căutare pentru
                  oferte de închiriere sau cumpărare de bunuri imobiliare (noi sau
                  vechi) pentru persoane fizice sunt accesibile utilizatorilor de
                  Internet fără a continua la crearea unui Cont de utilizator
                  personal. Pe de altă parte, unele servicii sunt accesibile numai
                  dacă este creat un cont de utilizator.
                </Paragraph>

                <Paragraph>
                  În toate cazurile, utilizatorii de Internet au posibilitatea de
                  a solicita informații pe site prin intermediul formularelor de
                  contact. Cererile de informații se referă la:
                </Paragraph>

                <Paragraph>
                  listările imobiliare (închiriere sau vânzare, clădire veche sau
                  nouă): în acest caz, solicitarea este trimisa dezvoltatorului
                  imobiliar care este autorul reclamei respective sau persoanei
                  fizice care a publicat anuntul; informații generale despre Site:
                  în acest caz, solicitarea este trimisa direct de către Companie.
                  Ca parte a formularelor de contact, Utilizatorul trebuie să
                  introducă un anumit număr de informații obligatorii. Dacă
                  cererea de informații provine de la Utilizatori cu un Cont de
                  utilizator personal sau profesional, unele câmpuri sunt
                  completate în prealabil.
                </Paragraph>

                <Paragraph>
                  Când creați conturi de utilizator personale utilizatorul de
                  Internet:
                  <br />
                  garantează că informațiile pe care le transmite sunt corecte,
                  veridice și actualizate. trebuie să accepte acești Termeni de
                  utilizare. La crearea conturilor de utilizator personale,un
                  e-mail cu informații de creare a contului este trimis automat la
                  adresele de e-mail specificate.
                </Paragraph>

                <SubTitle>Cont de utilizator personal</SubTitle>
                <Paragraph>
                  Se poate realiza doar o singura data de persoane majore care au
                  implinit 18 ani.Serviciile noastre sunt destinate persoanelor
                  peste 18 ani,nu colectam intentionat date personale ale
                  minorilor.In cazul in care depistam sau primim sesizari pentru
                  un astfel de cont, acesta va fi sters imediat de pe platforma.
                  <br /> Utilizatorul își poate crea contul fie pe Site(furnizeaza
                  email si creaza parola), fie prin Facebook,Google+(folosind
                  autentificarea sa obișnuită pe aceste site-uri).
                </Paragraph>

                <Paragraph>
                  Contul de utilizator personal permite utilizatorului să acceseze
                  diverse servicii oferite de site, inclusiv:
                </Paragraph>

                <ul>
                  <li>
                    <b>crearea de alerte prin e-mail:</b> Utilizatorul poate crea
                    alerte la căutările sale direct din pagina de rezultate.
                    Pentru a crea o alertă, Utilizatorul trebuie identificat prin
                    intermediul Contului său personal de utilizator sau,
                    alternativ, crearea acesteia. Utilizatorul primește alertele
                    prin e-mail. El își poate configura alerta (alegând numele și
                    periodicitatea), sau poate gestiona după crearea sa (în
                    special prin ștergerea sau redenumirea acesteia).
                  </li>
                  <li>
                    <b>salvați favorite:</b> dacă utilizatorul nu este conectat,
                    favoritele sunt stocate într-un cookie, permițându-i să le
                    găsească la următoarea vizită, dacă nu a șters cookie-urile
                    (vezi clauza Cookie). Dacă utilizatorul este conectat,
                    favoritele sunt stocate în contul său personal de utilizator.
                  </li>
                  <li>
                    <b>partajarea anunțurilor</b> prin e-mail cu persoanele cărora
                    utilizatorul dorește să le comunice.
                  </li>
                  <li>
                    <b>gestionarea pachetelor sale:</b> Utilizatorul poate
                    modifica diversele pachete pe care le-a subscris în timpul
                    creării Contului sau ulterior. Acestea includ diverse
                    informații sau documente comerciale (exemple: oferte și
                    servicii ale Companiei, parteneri, anunțuri sau informații
                    corespunzătoare căutărilor anterioare, buletine informative),
                    pentru a căror primire a Utilizatorului a fost de acord în mod
                    expres în conformitate cu reglementările privind datele cu
                    caracter personal. Funcția de gestionare a pachetelor permite
                    utilizatorului să își modifice pachetele în orice moment, prin
                    ștergerea unora și / sau adăugarea altora.
                  </li>
                  <li>
                    <b>modificarea Contului său de utilizator personal:</b> această
                    caracteristică permite Utilizatorului să modifice datele pe
                    care le-a înregistrat la crearea Contului său de utilizator
                    personal (e-mail, parolă), dar și să-și modifice pachetele,
                    inclusiv în ceea ce privește primirea diferitelor informații
                    sau documente comerciale (exemple: oferte și servicii ale
                    Companiei, partenerilor, anunțuri sau informații
                    corespunzătoare căutărilor anterioare, buletinelor
                    informative). Modificați informațiile de contact și adăugați
                    elemente gen Skype dacă dorește ca potențialii săi să-l
                    contacteze prin acest mod,sau tip messenger.
                  </li>
                  <li>
                    <b>recuperarea parolei pierdute:</b> permite utilizatorului să
                    solicite o nouă parolă care i se va trimite pe adresa de
                    e-mail pe care a introdus-o.
                  </li>
                </ul>

                <SubTitle>Continut anunturi publicate utilizatori</SubTitle>
                <Paragraph>
                  Revine in sarcina fiecarui utilizator sa furnizeze date reale
                  (continutul tehnic,descriere,poze),exacte depre proprietatea
                  sa,sa furnizeze informatiile care crede ca sunt necesare ,sa nu
                  foloseasca un limbaj injurios sau nepotrivit ,toate acestea
                  fiind responsabilitatea utilizatorului.Compania nu este
                  responsabila de continutul tehnic,descriere,poze publicate de
                  utilizatori,dar isi rezerva dreptul de verificare si stergere a
                  anunturilor care incalca politica siteului.
                </Paragraph>

                <SubTitle>Sisteme protectie</SubTitle>
                <Paragraph>
                  Compania își rezervă dreptul să înființeze orice sistem de
                  protecție pe care îl consideră util pentru a preveni sau opri
                  orice sistem sau software automat sau neautomatizat și / sau
                  orice acțiune pentru extragerea sau colectarea datelor din
                  Servicii și Site și să introducă orice acțiune sau cerere
                  necesară pentru a preveni, opri și pedepsi orice încălcare a
                  drepturilor sale asupra Serviciilor și a Site-ului, inclusiv în
                  contextul procedurilor legale, fără notificare prealabilă
                </Paragraph>
              </Section>

              {/* ACCES / RESTRICTII */}
              <Section>
                <SubTitle>ACCESUL, DISPONIBILITATEA, RESTRICTII ale SITE-ului</SubTitle>
                <Paragraph>
                  Serviciile pentru useri/ vizitatori - sunt accesibile gratuit
                  online pe site-ul companiei,pentru vanzatori/proprietari au
                  posibilitatea sa aleaga din pachetele puse la dispozitie:
                  gratuit sau cu plata.
                </Paragraph>
                <Paragraph>
                  Serviciile pentru useri publicare - siteul este disponibil
                  pentru publicare anunturilor doar persoanelor fizice si juridice
                  care detin o proprietate si doresc sa foloseasca platforma
                  www.eproprietar.ro pentru a{" "}
                  <span style={{ textDecoration: "underline" }}>
                    vinde/inchiria/promova proprietatea
                  </span>
                  .
                </Paragraph>
                <Paragraph style={{ textDecoration: "underline" }}>
                  <b>Restrictii</b> - Conceptul platformei este de publicare
                  anunturi la vanzare/inchiriere direct de catre proprietari
                  persoane fizice sau juridice!{" "}
                  <b style={{ color: "red" }}>
                    Este interzisa publicarea de anunturi din partea Agentiilor
                    imobiliare,agentilor imobiliari,terti intemediari!
                  </b>{" "}
                  Compania detine mijloacele necesare depistarii anunturilor
                  postate de terti intermediari si va lua toate masurile ca aceste
                  anunturi sa nu poata fi publicate sau daca sunt publicate sa fie
                  scoase de pe platforma.
                </Paragraph>
                <Paragraph>
                  Compania depune toate eforturile pentru ca Site-ul să fie
                  disponibil 24 de ore pe zi, 7 zile pe săptămână, indiferent de
                  întreținerea Site-ului și / sau a Serverelor .
                </Paragraph>
                <Paragraph>
                  Compania își rezervă dreptul de a modifica, întrerupe, oricând,
                  temporar sau definitiv tot sau o parte a Site-ului, fără
                  informații prealabile de pe Internet și fără drept de
                  compensare, Compania nu poate fi făcută responsabilă pentru
                  consecințele care rezultă din astfel de întreruperi sau
                  modificări.
                </Paragraph>
                <Paragraph>
                  In general, Compania își rezervă dreptul de a efectua orice
                  modificări de orice fel la conținutul site-ului.
                </Paragraph>
              </Section>

              {/* UTILIZAREA SITE-ULUI */}
              <Section>
                <SubTitle>UTILIZAREA SITE-ului ȘI SERVICIILOR</SubTitle>
                <Paragraph>
                  Utilizatorii sunt de acord să utilizeze Site-ul și Serviciile în
                  conformitate cu prevederile acestor Termeni de utilizare.
                </Paragraph>
                <Paragraph>
                  Utilizatorii se angajează să nu utilizeze Site-ul și / sau
                  Serviciile:
                </Paragraph>
                <ul>
                  <li>în scopuri ilegale, contrar ordinii sau moralității publice,</li>
                  <li>
                    cu încălcarea dispozițiilor legilor sau reglementărilor
                    aplicabile sau a drepturilor unui terț,
                  </li>
                  <li>în scopuri care pot provoca pierderi sau daune de orice fel,</li>
                  <li>
                    în scopuri care nu sunt în conformitate cu regulile de
                    utilizare a Serviciilor, astfel cum sunt stabilite de companie
                    în
                  </li>
                  <li>
                    în acest sens, reclamele postate online trebuie să respecte
                    toate cerințele legale și de reglementare, să fie legale și în
                    concordanță cu moralitatea, să respecte ordinea publică și să
                    nu producă niciun prejudiciu. De asemenea, reclamele trebuie
                    să respecte criteriile de publicare a reclamelor, stabilite de
                    către companie în Termenii și condiții.
                  </li>
                </ul>

                <Paragraph>
                  Compania își rezervă dreptul de a suspenda accesul la Servicii
                  (utilizatorilor și utilizatorilor de internet), de a șterge fără
                  întârziere conținutul în cauză și de a încheia Conturile
                  personale sau profesionale, utilizatorii de internet și
                  utilizatorii (după caz) care au încălcat prevederile prezentelor
                  Condiții generale de utilizare și, în special, cele menționate
                  mai sus, în pofida compensării Companiei pentru toate pagubele
                  suferite.
                </Paragraph>
                <Paragraph>
                  Accesul și utilizarea site-ului www.eproprietar.ro de către
                  orice utilizator își asumă conștientă și acceptarea deplină a
                  modalităților, limitărilor, indicațiilor și a regulilor
                  enumerate in Termeni Conditii Politica de confidentialitate,
                  precum și angajamentul de a despăgubi și deține intact
                  www.eproprietar.ro ,inofensiv din orice cerere sau cerere a unei
                  terțe părți care poate apărea, direct sau indirect, de la de la
                  utilizarea necorespunzătoare sau ilegală a site-ului în sine.
                </Paragraph>
              </Section>

              {/* ACCEPTARE SI PLATI */}
              <Section>
                <SubTitle>ACCEPTAREA CONDIȚIILOR - AMENDAMENTE LA CONDIȚII</SubTitle>
                <Paragraph>
                  Publicarea anunturilor se poate face dupa crearea contului de
                  utilizator asa cum este descris mai sus.
                  <br /> Pachetele de publicare sunt :pachet listare gratuita si
                  pachet NELIMITAT - publicare/listare pana la
                  vanzare/incheiere,plata se face o singura data!
                  <br /> Exista posibilitatea de a accesa si extraoptiunile de
                  promovare care permit publicarea In top listing pentru o
                  perioada 7zile,15zile respectiv 30 zile.
                  <br /> Pentru dezvoltatori oferta de publicare este
                  personalizata.Pentru pachete de publicitate/marketing,se poate
                  cere oferta la marketing@eproprietar.ro
                </Paragraph>

                <SubTitle>Plata pachetelor</SubTitle>
                <Paragraph>
                  Plata pachetelor se poate face prin SMS si card bancar .In
                  momentul in care lansam si alte modalitati de plata acestea vor
                  fi vizibile si accesibile in sectiunea de plata.
                </Paragraph>

                <SubTitle>Ștergerea anunțurilor,conturilor, restricționare</SubTitle>
                <Paragraph>
                  Din dorinta de a pastra informatia cat mai reala catre
                  USERI/vizitatorii siteului, ne rezervam dreptul de a verifica
                  anunturile postate si unde exista suspiciuni de publicare care
                  nu respecta Termeni si Conditii sa cerem lamuriri suplimentare.
                  Pentru conturile inactive timp de 1 an ,ne rezervam dreptul de
                  stergere a acestora.
                </Paragraph>

                <SubTitle>Comunicare și marketing</SubTitle>
                <Paragraph>
                  Din dorinta de a va oferi informatii complete legate de piata
                  imobiliara si serviciilor conexe imobiliarelor,dorim sa va
                  transmitem comunicari comerciale despre ghiduri
                  imobiliare,vanzari,inchirieri,trenduri,home&deco si alte domenii
                  relevante,informatii privind serviciile
                  noastre,sondaje,chestionare, care pot fi de interes pentru
                  dumneavoastra.In orice moment de la primirea acestor
                  comunicari,aveti posibilitatea de a va dezabona de la orice
                  comunicare din partea noastra iar noi nu vom mai transmite nici
                  o informatie catre dumneavostra. In cadrul campaniilor de
                  marketing pe care Compania le deruleaza, cu scopul de a Informa
                  utilizatorii asupra ofertelor din piata,aceasta isi poate
                  rezerva dreptul de a posta anunturi verificate publicate din
                  surse publice sau cu acordul expres al proprietarului .
                </Paragraph>
              </Section>

              {/* PROPRIETATE INTELECTUALA */}
              <Section>
                <SubTitle>PROPRIETATE INTELECTUALĂ</SubTitle>
                <Paragraph>
                  Compania este proprietarul sau licențiatul drepturilor de
                  proprietate intelectuală a structurii generale a site-ului Web,
                  precum și a conținutului desemnat expres ca sursă eproprietar.ro.
                  
                  {"\n\n"}
                  Pe de altă parte, Compania nu este nici proprietar și nici
                  responsabil, indiferent de capacitate și chiar dacă este
                  concesionară a drepturilor de proprietate intelectuală, a
                  întregii celelalte conținuturi de pe Site (în special
                  anunțuri, texte, sloganuri , grafică, imagini, videoclipuri,
                  fotografii și alt conținut), care este responsabilitatea
                  exclusivă a proprietarilor acestora (personae fizice sau
                  dezvoltatori care sunt autori de oferte publicate sau diferiți
                  furnizori de date).
                  
                  {"\n\n"}
                  Orice reprezentare, reproducere, modificare, denaturare și /
                  sau exploatare, integral sau parțial, a site-ului Web și / sau
                  a conținutului acestuia (indiferent de autor) și / sau a
                  Serviciilor, prin orice mijloace și pe orice suport că este,
                  fără autorizarea expresă și preliminară a Companiei sau a
                  autorului conținutului, potrivit cazurilor, este interzis și
                  constituie acte de încălcare a drepturilor de autor.
                </Paragraph>
              </Section>

              {/* FORTA MAJORA */}
              <Section>
                <SubTitle>FORȚA MAJORA</SubTitle>
                <Paragraph>
                  Răspunderea companiei nu poate fi atrasa dacă executarea uneia
                  dintre obligațiile sale este împiedicată sau întârziată din
                  cauza unui caz de forță majoră, așa cum este definit de lege, în
                  special de calamități naturale, incendii, defecțiuni sau
                  întreruperea rețelei de telecomunicații sau a rețelei de
                  electricitate.
                </Paragraph>
              </Section>

              {/* CONTACT */}
              <Section>
                <SubTitle>Detalii de contact</SubTitle>
                <Paragraph>
                  SC IMO CASA SOLUTIONS SRL
                  <br /> Birouri: Str Dorobantilor nr 65, Cluj Napoca, Cluj
                  <br /> Contact Email:{" "}
                  <a href="mailto:support@buyencore.com">
                    contact@eproprietar.ro
                  </a>
                  <br /> Informatii/Sesizari:{" "}
                  <a href="mailto:support@buyencore.com">
                    contact@eproprietar.ro
                  </a>
                  <br /> Marketing:{" "}
                  <a href="mailto:support@buyencore.com">
                    marketing@eproprietar.ro
                  </a>
                  <br /> GDPR:{" "}
                  <a href="mailto:support@buyencore.com">
                    gdpr@eproprietar.ro
                  </a>
                </Paragraph>

                <SubTitle>Autoritatea pentru Protecția Datelor</SubTitle>
                <Paragraph>
                  Pentru orice sesizare legata de date personale va rugam sa ne
                  scrieti pe email: gdpr@eproprietar.ro
                  <br />
                  Pentru sesizari privind protecția datelor, puteți contacta
                  autoritatea nationala :
                  <br />
                  Autoritatea Națională pentru Protecția Datelor
                  <br />
                  Adresă: B-dul Magheru 28-30, Sector 1, BUCUREŞTI
                </Paragraph>
                <Paragraph>
                  Website:{" "}
                  <a href="http://www.dataprotection.ro/">
                    http://www.dataprotection.ro/
                  </a>
                </Paragraph>
              </Section>
            </PageWrap>
          </Grid>
        </Grid>
      </Box>
    </Layout>
  );
}
