"use client";

import { Box, Typography } from "@mui/material";
import React, { useCallback, useMemo, useRef, useState } from "react";

import styled from "styled-components";

/* -------------------- Limits & Types -------------------- */
const MAX_IMAGES = 20;
const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_IMAGE_MIME = ["image/jpeg", "image/png", "image/webp"];

const MAX_VIDEOS = 3;
const MAX_VIDEO_SIZE = 100 * 1024 * 1024; // 100MB
const ALLOWED_VIDEO_MIME = ["video/mp4", "video/webm", "video/quicktime"]; // mp4, webm, mov

const MAX_LOGO_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_LOGO_MIME = ALLOWED_IMAGE_MIME;

type Props = {
  logo: File | null;
  setLogo: (file: File | null) => void;

  images: File[];
  setImages: (files: File[]) => void;

  videos: File[];
  setVideos: (files: File[]) => void;

  error?: string | null;
  setError?: (msg: string | null) => void;

  /** When false, hide internal thumbnails; still render counters + dropzones */
  showPreview?: boolean; // default true

  /** Custom UI to render immediately after the images dropzone (e.g., sortable previews) */
  imagesSlot?: React.ReactNode;

  /** Custom UI to render immediately after the videos dropzone */
  videosSlot?: React.ReactNode;
};

/* -------------------- Styled -------------------- */
const Section = styled.div`
  width: 100%;
  margin-top: 8px;
`;

const InfoRow = styled.div`
  font-size: 12px;
  opacity: 0.8;
  margin-bottom: 8px;
`;

const DropArea = styled.div<{ $drag?: boolean; $error?: boolean }>`
  border: 2px dashed ${({ $error }) => ($error ? "#f44336" : "#c7c7c7")};
  background-color: ${({ $drag }) => ($drag ? "#f0f8ff" : "transparent")};
  padding: 16px;
  text-align: center;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.2s, border-color 0.2s;
`;

const PreviewGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 10px;
`;

const Thumb = styled.img`
  width: 120px;
  height: 90px;
  object-fit: cover;
  border-radius: 8px;
  border: 1px solid #ccc;
  cursor: pointer;
`;

const ThumbVideo = styled.video`
  width: 180px;
  height: 120px;
  object-fit: cover;
  border-radius: 8px;
  border: 1px solid #ccc;
  cursor: pointer;
`;

const LogoThumb = styled.img`
  width: 120px;
  height: 120px;
  object-fit: contain;
  border-radius: 8px;
  border: 1px solid #ccc;
  background: #fff;
  cursor: pointer;
`;

/* -------------------- Component -------------------- */
const MediaUploader: React.FC<Props> = ({
  logo,
  setLogo,
  images,
  setImages,
  videos,
  setVideos,
  error,
  setError,
  showPreview = true,
  imagesSlot,
  videosSlot,
}) => {
  const [dragImg, setDragImg] = useState(false);
  const [dragVid, setDragVid] = useState(false);
  const [dragLogo, setDragLogo] = useState(false);

  const imgInputRef = useRef<HTMLInputElement>(null);
  const vidInputRef = useRef<HTMLInputElement>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);

  const pushError = useCallback(
    (msg: string | null) => {
      if (setError) setError(msg);
      if (msg) console.warn("[MediaUploader]", msg);
    },
    [setError]
  );

  /* ----------- Validation helpers ----------- */
  const validateImages = (files: FileList | File[]) => {
    const arr = Array.from(files);
    const leftSlots = Math.max(0, MAX_IMAGES - images.length);
    const sliced = arr.slice(0, leftSlots);

    const valid: File[] = [];
    for (const f of sliced) {
      if (!ALLOWED_IMAGE_MIME.includes(f.type)) {
        pushError("Sunt permise doar imagini JPG, PNG sau WEBP.");
        continue;
      }
      if (f.size > MAX_IMAGE_SIZE) {
        pushError(`Imaginea ${f.name} depășește 5MB.`);
        continue;
      }
      valid.push(f);
    }
    return valid;
  };

  const validateVideos = (files: FileList | File[]) => {
    const arr = Array.from(files);
    const leftSlots = Math.max(0, MAX_VIDEOS - videos.length);
    const sliced = arr.slice(0, leftSlots);

    const valid: File[] = [];
    for (const f of sliced) {
      if (!ALLOWED_VIDEO_MIME.includes(f.type)) {
        pushError("Sunt permise doar videoclipuri MP4, WEBM sau MOV.");
        continue;
      }
      if (f.size > MAX_VIDEO_SIZE) {
        pushError(`Fișierul video ${f.name} depășește 100MB.`);
        continue;
      }
      valid.push(f);
    }
    return valid;
  };

  const validateLogo = (file: File) => {
    if (!ALLOWED_LOGO_MIME.includes(file.type)) {
      pushError("Logo-ul trebuie să fie imagine (JPG, PNG, WEBP).");
      return null;
    }
    if (file.size > MAX_LOGO_SIZE) {
      pushError("Logo-ul depășește 5MB.");
      return null;
    }
    return file;
  };

  /* ----------- Image handlers ----------- */
  const onImgClick = () => imgInputRef.current?.click();
  const onImgChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const files = e.target.files;
    if (!files) return;
    const valid = validateImages(files);
    if (valid.length) setImages([...images, ...valid]);
    e.currentTarget.value = "";
  };
  const onImgDrop: React.DragEventHandler<HTMLDivElement> = (e) => {
    e.preventDefault();
    setDragImg(false);
    const valid = validateImages(e.dataTransfer.files);
    if (valid.length) setImages([...images, ...valid]);
  };

  /* ----------- Video handlers ----------- */
  const onVidClick = () => vidInputRef.current?.click();
  const onVidChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const files = e.target.files;
    if (!files) return;
    const valid = validateVideos(files);
    if (valid.length) setVideos([...videos, ...valid]);
    e.currentTarget.value = "";
  };
  const onVidDrop: React.DragEventHandler<HTMLDivElement> = (e) => {
    e.preventDefault();
    setDragVid(false);
    const valid = validateVideos(e.dataTransfer.files);
    if (valid.length) setVideos([...videos, ...valid]);
  };

  /* ----------- Logo handlers ----------- */
  const onLogoClick = () => logoInputRef.current?.click();
  const onLogoChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const valid = validateLogo(file);
    if (valid) setLogo(valid);
    e.currentTarget.value = "";
  };
  const onLogoDrop: React.DragEventHandler<HTMLDivElement> = (e) => {
    e.preventDefault();
    setDragLogo(false);
    const file = e.dataTransfer.files?.[0];
    if (!file) return;
    const valid = validateLogo(file);
    if (valid) setLogo(valid);
  };

  /* ----------- Object URLs for previews ----------- */
  const imgURLs = useMemo(() => images.map((f) => URL.createObjectURL(f)), [images]);
  const vidURLs = useMemo(() => videos.map((f) => URL.createObjectURL(f)), [videos]);
  const logoURL = useMemo(() => (logo ? URL.createObjectURL(logo) : ""), [logo]);

  React.useEffect(() => {
    return () => {
      imgURLs.forEach((u) => URL.revokeObjectURL(u));
      vidURLs.forEach((u) => URL.revokeObjectURL(u));
      if (logoURL) URL.revokeObjectURL(logoURL);
    };
  }, [imgURLs, vidURLs, logoURL]);

  return (
    <Box width="100%">
      {/* ---------------- LOGO ---------------- */}
      <Section>
        <Typography variant="h6">Logo</Typography>
        <InfoRow>
          {logo ? "1 / 1 fișier" : "0 / 1 fișier"} • Dimensiune maximă: 5MB • Formate permise: JPG, PNG, WEBP
        </InfoRow>

        <DropArea
          $drag={dragLogo}
          onClick={onLogoClick}
          onDragOver={(e) => {
            e.preventDefault();
            setDragLogo(true);
          }}
          onDragLeave={() => setDragLogo(false)}
          onDrop={onLogoDrop}
        >
          Trage logo-ul aici sau apasă pentru a selecta
        </DropArea>
        <input
          ref={logoInputRef}
          type="file"
          accept={ALLOWED_LOGO_MIME.join(",")}
          style={{ display: "none" }}
          onChange={onLogoChange}
        />

        {showPreview && logoURL && (
          <PreviewGrid>
            <LogoThumb
              src={logoURL}
              alt="logo"
              title="Click pentru a elimina"
              onClick={() => setLogo(null)}
            />
          </PreviewGrid>
        )}
      </Section>

      {/* ---------------- IMAGES ---------------- */}
      <Section>
        <Typography variant="h6" mt={2}>
          Imagini
        </Typography>
        <InfoRow>
          Încărcate {images.length} / {MAX_IMAGES} fișiere • Dimensiune maximă: 5MB • Formate permise: JPG, PNG, WEBP
        </InfoRow>

        <DropArea
          $drag={dragImg}
          onClick={onImgClick}
          onDragOver={(e) => {
            e.preventDefault();
            setDragImg(true);
          }}
          onDragLeave={() => setDragImg(false)}
          onDrop={onImgDrop}
        >
          Trage imaginile aici sau apasă pentru a selecta
        </DropArea>
        <input
          ref={imgInputRef}
          type="file"
          accept={ALLOWED_IMAGE_MIME.join(",")}
          multiple
          style={{ display: "none" }}
          onChange={onImgChange}
        />

        {/* Internal previews (optional) */}
        {showPreview && images.length > 0 && (
          <PreviewGrid>
            {imgURLs.map((src, i) => (
              <Thumb
                key={i}
                src={src}
                alt={`img-${i}`}
                title="Click pentru a elimina"
                onClick={() => setImages(images.filter((_, idx) => idx !== i))}
              />
            ))}
          </PreviewGrid>
        )}

        {/* Custom slot just below the images area */}
        {imagesSlot}
      </Section>

      {/* ---------------- VIDEOS ---------------- */}
      <Section>
        <Typography variant="h6" mt={3}>
          Videoclipuri
        </Typography>
        <InfoRow>
          Încărcate {videos.length} / {MAX_VIDEOS} fișiere • Dimensiune maximă: 100MB • Formate permise: MP4, WEBM, MOV
        </InfoRow>

        <DropArea
          $drag={dragVid}
          onClick={onVidClick}
          onDragOver={(e) => {
            e.preventDefault();
            setDragVid(true);
          }}
          onDragLeave={() => setDragVid(false)}
          onDrop={onVidDrop}
        >
          Trage videoclipurile aici sau apasă pentru a selecta
        </DropArea>
        <input
          ref={vidInputRef}
          type="file"
          accept={ALLOWED_VIDEO_MIME.join(",")}
          multiple
          style={{ display: "none" }}
          onChange={onVidChange}
        />

        {/* Internal previews (optional) */}
        {showPreview && videos.length > 0 && (
          <PreviewGrid>
            {vidURLs.map((src, i) => (
              <ThumbVideo
                key={i}
                src={src}
                controls
                title="Click pentru a elimina"
                onClick={() => setVideos(videos.filter((_, idx) => idx !== i))}
              />
            ))}
          </PreviewGrid>
        )}

        {/* Custom slot just below the videos area */}
        {videosSlot}
      </Section>

      {/* Error line (optional) */}
      {error ? (
        <Typography color="error" mt={1}>
          {error}
        </Typography>
      ) : null}
    </Box>
  );
};

export default MediaUploader;
