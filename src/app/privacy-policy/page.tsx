"use client";

import * as palette from "@/constants/colors";

import { Box, Grid } from "@mui/material";

import { COLOR_TEXT_LIGHT } from "@/constants/colors";
import { Layout } from "@/common/layout/Layout";
import React from "react";
import styled from "styled-components";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  border-radius: 8px;
  boder: 1px solid ${palette.COLOR_LIGHT_GREY};
  color: ${palette.COLOR_TEXT};
  background: ${palette.COLOR_WHITE};
  padding: 24px;
  margin: 0 32px;
`;

export default function Privacy() {
  return (
    <Layout>
      <Box height="100%" sx={{ position: "relative", color: COLOR_TEXT_LIGHT }}>
        <Container>
          <Grid container p={{ xs: 3, md: 4 }}>
            <Grid item xs={12} md={9}>
              <h1>Politica de confidentialitate</h1>
              <p>
                SC IMO CASA SOLUTIONS SRL Politica privind prelucrarea datelor
                cu caracter personal
              </p>

              <h3>Cine suntem?</h3>
              <p>
                Acest site este proprietatea SC IMO CASA SOLUTIONS SRL. Concept
                platformei www.eproprietar.ro - platforma nationala cu anunturi
                imobiliare exclusiv de la proprietari si dezvoltatori
                imobiliari, fara anunturi de la agentii imobiliare,agenti
                imobiliari,terti intermediari. Birouri: Str Dorobantilor nr 65,
                Cluj Napoca,Cluj Contact Email : Informatii/Sesizari:
                contact@eproprietar.ro Marketing/Oferte publicitate :
                marketing@eproprietar.ro GDPR : gdpr@eproprietar.ro
              </p>

              <h2>CONDIȚII GENERALE DE UTILIZARE</h2>

              <p>
                Acești Termeni de utilizare au scopul de a defini termenii de
                furnizare a site-ului www.eproprietar.ro și condițiile de
                utilizare a Serviciilor. Termenii de utilizare se aplică
                oricărui acces și consultării site-ului de către un utilizator
                de internet.
              </p>
              <h4>Cont de utilizator:</h4>
              <p>
                înseamnă contul pentru uz personal deschis de către un
                utilizator de Internet pe site, care îi oferă e-mailul și alege
                o parolă. Alte informații care pot fi solicitate sunt opționale.
                Conturile de utilizator personale necesită de asemenea
                deschiderea acceptării acestor Termeni de utilizare.
              </p>
              <h5>Zona de cont de utilizator personal:</h5>
              <p>
                este o zonă sigură accesibilă pe site, gratuită pentru toți
                utilizatorii, care include toate informațiile care pot fi
                stocate (inclusiv crearea de alerte, backup-uri favorite,
                gestionarea contului, buletine informative pentru abonamente,
                statistici în timp real ...).
              </p>
              <h5>Utilizator de Internet:</h5>
              <p>
                înseamnă orice persoană fizică care accesează site-ul Web pentru
                utilizare privată.{" "}
              </p>
              <h4>Servicii:</h4>
              <p>
                {" "}
                înseamnă toate serviciile accesibile prin intermediul site-ului.
              </p>
              <h4>Site Web sau Website: </h4>
              <p>
                înseamnă serviciul electronic interactiv publicat și operat de
                www.eproprietar.ro, accesibil în special la www.eproprietar.ro,
                care permite accesul la Servicii.
              </p>
              <h4>Utilizator: </h4>
              <p>
                înseamnă orice utilizator de Internet care se înregistrează pe
                site pentru a obține un cont de utilizator personal în zona
                contului de utilizator în cauză.
              </p>

              <h2>CARACTERISTICI, UTILIZARE ȘI ABONARE LA SERVICII</h2>

              <h3>Compania oferă o platformă online care permite:</h3>

              <p>
                <b>Pentru persoane fizice:</b> să caute sau sa publice oferte de
                închiriere sau cumpărare de bunuri imobiliare (noi sau vechi) și
                să beneficieze de diversele servicii asociate;
                <br />
                <b>Persoane juridice:</b> dezvoltator
                imobiliar,constructor,developer,proprietar - pentru a-și
                prezenta oferta de imobile sau proiecte prin pachete pe care le
                acceseaza de la companie.
              </p>

              <h3>Compania oferă o platformă online care NU permite: </h3>
              <p>
                Postarea anunturilor imobiliare de catre agenti
                imobiliari,agentii imobiliare,terti intermediari!
              </p>

              <p>
                Unele servicii sunt puse la dispoziția utilizatorilor de
                internet fără a fi necesară crearea unui cont de utilizator
                personal sau profesional. Astfel, serviciile de căutare pentru
                oferte de închiriere sau cumpărare de bunuri imobiliare (noi sau
                vechi) pentru persoane fizice sunt accesibile utilizatorilor de
                Internet fără a continua la crearea unui Cont de utilizator
                personal. Pe de altă parte, unele servicii sunt accesibile numai
                dacă este creat un cont de utilizator.
              </p>

              <p>
                În toate cazurile, utilizatorii de Internet au posibilitatea de
                a solicita informații pe site prin intermediul formularelor de
                contact. Cererile de informații se referă la:
              </p>

              <p>
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
              </p>

              <p>
                Când creați conturi de utilizator personale utilizatorul de
                Internet:
                <br />
                garantează că informațiile pe care le transmite sunt corecte,
                veridice și actualizate. trebuie să accepte acești Termeni de
                utilizare. La crearea conturilor de utilizator personale,un
                e-mail cu informații de creare a contului este trimis automat la
                adresele de e-mail specificate.
              </p>

              <h3>Cont de utilizator personal</h3>

              <p>
                Se poate realiza doar o singura data de persoane majore care au
                implinit 18 ani.Serviciile noastre sunt destinate persoanelor
                peste 18 ani,nu colectam intentionat date personale ale
                minorilor.In cazul in care depistam sau primim sesizari pentru
                un astfel de cont, acesta va fi sters imediat de pe platforma.
                <br /> Utilizatorul își poate crea contul fie pe Site(furnizeaza
                email si creaza parola), fie prin Facebook,Google+(folosind
                autentificarea sa obișnuită pe aceste site-uri).
              </p>

              <p>
                Contul de utilizator personal permite utilizatorului să acceseze
                diverse servicii oferite de site, inclusiv:
              </p>
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
                  <b>modificarea Contului său de utilizator personal:</b>{" "}
                  această caracteristică permite Utilizatorului să modifice
                  datele pe care le-a înregistrat la crearea Contului său de
                  utilizator personal (e-mail, parolă), dar și să-și modifice
                  pachetele, inclusiv în ceea ce privește primirea diferitelor
                  informații sau documente comerciale (exemple: oferte și
                  servicii ale Companiei, partenerilor, anunțuri sau informații
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

              <h3>Continut anunturi publicate utilizatori</h3>

              <p>
                Revine in sarcina fiecarui utilizator sa furnizeze date reale
                (continutul tehnic,descriere,poze),exacte depre proprietatea
                sa,sa furnizeze informatiile care crede ca sunt necesare ,sa nu
                foloseasca un limbaj injurios sau nepotrivit ,toate acestea
                fiind responsabilitatea utilizatorului.Compania nu este
                responsabila de continutul tehnic,descriere,poze publicate de
                utilizatori,dar isi rezerva dreptul de verificare si stergere a
                anunturilor care incalca politica siteului.
              </p>

              <h3>Sisteme protectie</h3>

              <p>
                Compania își rezervă dreptul să înființeze orice sistem de
                protecție pe care îl consideră util pentru a preveni sau opri
                orice sistem sau software automat sau neautomatizat și / sau
                orice acțiune pentru extragerea sau colectarea datelor din
                Servicii și Site și să introducă orice acțiune sau cerere
                necesară pentru a preveni, opri și pedepsi orice încălcare a
                drepturilor sale asupra Serviciilor și a Site-ului, inclusiv în
                contextul procedurilor legale, fără notificare prealabilă
              </p>

              <h2>ACCESUL, DISPONIBILITATEA, RESTRICTII ale SITE-ului</h2>

              <p>
                Serviciile pentru useri/ vizitatori - sunt accesibile gratuit
                online pe site-ul companiei,pentru vanzatori/proprietari au
                posibilitatea sa aleaga din pachetele puse la dispozitie:
                gratuit sau cu plata.
              </p>
              <p>
                Serviciile pentru useri publicare - siteul este disponibil
                pentru publicare anunturilor doar persoanelor fizice si juridice
                care detin o proprietate si doresc sa foloseasca platforma
                www.eproprietar.ro pentru a{" "}
                <span style={{ textDecoration: "underline" }}>
                  vinde/inchiria/promova proprietatea
                </span>
                .
              </p>
              <p style={{ textDecoration: "underline" }}>
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
              </p>
              <p>
                Compania depune toate eforturile pentru ca Site-ul să fie
                disponibil 24 de ore pe zi, 7 zile pe săptămână, indiferent de
                întreținerea Site-ului și / sau a Serverelor .
              </p>
              <p>
                Compania își rezervă dreptul de a modifica, întrerupe, oricând,
                temporar sau definitiv tot sau o parte a Site-ului, fără
                informații prealabile de pe Internet și fără drept de
                compensare, Compania nu poate fi făcută responsabilă pentru
                consecințele care rezultă din astfel de întreruperi sau
                modificări.
              </p>
              <p>
                In general, Compania își rezervă dreptul de a efectua orice
                modificări de orice fel la conținutul site-ului.
              </p>

              <h2>UTILIZAREA SITE-ului ȘI SERVICIILOR</h2>

              <p>
                Utilizatorii sunt de acord să utilizeze Site-ul și Serviciile în
                conformitate cu prevederile acestor Termeni de utilizare.
              </p>
              <p>
                Utilizatorii se angajează să nu utilizeze Site-ul și / sau
                Serviciile:
              </p>
              <ul>
                <li>
                  în scopuri ilegale, contrar ordinii sau moralității publice,
                </li>{" "}
                <li>
                  cu încălcarea dispozițiilor legilor sau reglementărilor
                  aplicabile sau a drepturilor unui terț,
                </li>
                <li>
                  în scopuri care pot provoca pierderi sau daune de orice fel,
                </li>{" "}
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

              <p>
                Compania își rezervă dreptul de a suspenda accesul la Servicii
                (utilizatorilor și utilizatorilor de internet), de a șterge fără
                întârziere conținutul în cauză și de a încheia Conturile
                personale sau profesionale, utilizatorii de internet și
                utilizatorii (după caz) care au încălcat prevederile prezentelor
                Condiții generale de utilizare și, în special, cele menționate
                mai sus, în pofida compensării Companiei pentru toate pagubele
                suferite.
              </p>
              <p>
                {" "}
                Accesul și utilizarea site-ului www.eproprietar.ro de către
                orice utilizator își asumă conștientă și acceptarea deplină a
                modalităților, limitărilor, indicațiilor și a regulilor
                enumerate in Termeni Conditii Politica de confidentialitate,
                precum și angajamentul de a despăgubi și deține intact
                www.eproprietar.ro ,inofensiv din orice cerere sau cerere a unei
                terțe părți care poate apărea, direct sau indirect, de la de la
                utilizarea necorespunzătoare sau ilegală a site-ului în sine.{" "}
              </p>

              <h2>ACCEPTAREA CONDIȚIILOR - AMENDAMENTE LA CONDIȚII</h2>

              <p>
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
              </p>

              <h3>Plata pachetelor</h3>
              <p>
                Plata pachetelor se poate face prin SMS si card bancar .In
                momentul in care lansam si alte modalitati de plata acestea vor
                fi vizibile si accesibile in sectiunea de plata.
              </p>

              <h3>Ștergerea anunțurilor,conturilor, restricționare</h3>
              <p>
                Din dorinta de a pastra informatia cat mai reala catre
                USERI/vizitatorii siteului, ne rezervam dreptul de a verifica
                anunturile postate si unde exista suspiciuni de publicare care
                nu respecta Termeni si Conditii sa cerem lamuriri suplimentare.
                Pentru conturile inactive timp de 1 an ,ne rezervam dreptul de
                stergere a acestora.
              </p>

              <h3>Comunicare și marketing</h3>
              <p>
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
              </p>

              <h2>PROPRIETATE INTELECTUALĂ</h2>

              <p>
                Compania este proprietarul sau licențiatul drepturilor de
                proprietate intelectuală a structurii generale a site-ului Web,
                precum și a conținutului desemnat expres ca sursă eproprietar.ro.
              </p>

              <p>
                  Pe de altă parte, Compania nu este nici proprietar și nici
                  responsabil, indiferent de capacitate și chiar dacă este
                  concesionară a drepturilor de proprietate intelectuală, a
                  întregii celelalte conținuturi de pe Site (în special
                  anunțuri, texte, sloganuri , grafică, imagini, videoclipuri,
                  fotografii și alt conținut), care este responsabilitatea
                  exclusivă a proprietarilor acestora (personae fizice sau
                  dezvoltatori care sunt autori de oferte publicate sau diferiți
                  furnizori de date).
              </p>
              <p>
                Orice reprezentare, reproducere, modificare, denaturare și /
                sau exploatare, integral sau parțial, a site-ului Web și / sau
                a conținutului acestuia (indiferent de autor) și / sau a
                Serviciilor, prin orice mijloace și pe orice suport că este,
                fără autorizarea expresă și preliminară a Companiei sau a
                autorului conținutului, potrivit cazurilor, este interzis și
                constituie acte de încălcare a drepturilor de autor.
              </p>

              <h2>FORȚA MAJORA</h2>
              <p>
                Răspunderea companiei nu poate fi atrasa dacă executarea uneia
                dintre obligațiile sale este împiedicată sau întârziată din
                cauza unui caz de forță majoră, așa cum este definit de lege, în
                special de calamități naturale, incendii, defecțiuni sau
                întreruperea rețelei de telecomunicații sau a rețelei de
                electricitate.
              </p>

              <h2>Detalii de contact</h2>
              <p>
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
              </p>

              <h2>Autoritatea pentru Protecția Datelor</h2>
              <p>
                Pentru orice sesizare legata de date personale va rugam sa ne
                scrieti pe email: gdpr@eproprietar.ro
                <br />
                Pentru sesizari privind protecția datelor, puteți contacta
                autoritatea nationala :
                <br />
                Autoritatea Națională pentru Protecția Datelor
                <br />
                Adresă: B-dul Magheru 28-30, Sector 1, BUCUREŞTI
              </p>
              <p>
                Website:{" "}
                <a href="http://www.dataprotection.ro/">
                  http://www.dataprotection.ro/
                </a>
              </p>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Layout>
  );
}
