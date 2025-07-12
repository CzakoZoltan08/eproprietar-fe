"use client";

import { Box, Typography, useMediaQuery, useTheme } from "@mui/material";
import React, { ChangeEvent, useEffect, useRef, useState } from "react";

import UploadInfoBox from "@/app/create-announcement/UploadInfoBox";
import styled from "styled-components";

const MAX_VIDEOS = 3;
const MAX_VIDEO_SIZE = 100 * 1024 * 1024; // 100MB
const MAX_IMAGES = 20;
const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

type MediaUploaderProps = {
  logo?: File | null;
  setLogo?: (file: File | null) => void;
  images: File[];
  setImages: (files: File[]) => void;
  videos: File[];
  setVideos: (files: File[]) => void;
  error?: string;
  setError: (msg: string) => void;
};

const DropArea = styled.div<{ $isDragging: boolean }>`
  border: 2px dashed ${({ $isDragging }) => ($isDragging ? "#007BFF" : "#ccc")};
  background-color: ${({ $isDragging }) => ($isDragging ? "#f0f8ff" : "transparent")};
  padding: 16px;
  text-align: center;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s, border-color 0.3s;

  @media (max-width: 360px) {
    padding: 12px;
  }
`;

const PreviewContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(90px, 1fr));
  gap: 8px;
  margin-top: 16px;
`;

const PreviewImage = styled.img`
  width: 90px;
  height: 90px;
  object-fit: cover;
  border-radius: 8px;
  border: 1px solid #ccc;
  cursor: pointer;

  &:hover {
    opacity: 0.7;
  }
`;

const PreviewVideo = styled.video`
  width: 100%;
  height: auto;
  object-fit: cover;
  border-radius: 8px;
  border: 1px solid #ccc;
  cursor: pointer;
  &:hover {
    opacity: 0.7;
  }
`;

const ThumbnailWrapper = styled.div`
  margin-top: 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  width: 100%;
`;

const ThumbnailBox = styled.div`
  width: 100%;
  max-width: 200px;
  aspect-ratio: 1;
  border: 2px dashed #ccc;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
  background-color: #fafafa;
  transition: border-color 0.3s;

  &:hover {
    border-color: #007bff;
  }

  @media (max-width: 360px) {
    max-width: 150px;
    border-radius: 8px;
  }
`;

const ThumbnailPreviewImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const MediaUploader: React.FC<MediaUploaderProps> = ({
  logo,
  setLogo,
  images = [],
  setImages,
  videos = [],
  setVideos,
  error,
  setError,
}) => {
  const theme = useTheme();
  const isXs = useMediaQuery(theme.breakpoints.down("sm"));

  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [videoPreviews, setVideoPreviews] = useState<string[]>([]);
  const [isDraggingImages, setIsDraggingImages] = useState(false);
  const [isDraggingVideos, setIsDraggingVideos] = useState(false);

  const logoInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const urls = images.map((file) => URL.createObjectURL(file));
    setImagePreviews(urls);
    return () => urls.forEach((u) => URL.revokeObjectURL(u));
  }, [images]);

  useEffect(() => {
    const urls = videos.map((file) => URL.createObjectURL(file));
    setVideoPreviews(urls);
    return () => urls.forEach((u) => URL.revokeObjectURL(u));
  }, [videos]);

  useEffect(() => {
    if (logo) {
      const url = URL.createObjectURL(logo);
      setLogoPreview(url);
      return () => URL.revokeObjectURL(url);
    }
    setLogoPreview(null);
  }, [logo]);

  const validateImages = (files: FileList | File[]) => {
    return Array.from(files).filter((file) => {
      if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
        setError("Doar imagini JPEG, PNG sau WebP sunt permise.");
        return false;
      }
      if (file.size > MAX_IMAGE_SIZE) {
        setError(`Imaginea ${file.name} depășește limita de 5MB.`);
        return false;
      }
      return true;
    });
  };

  const validateVideos = (files: FileList | File[]) => {
    return Array.from(files).filter((file) => {
      if (!file.type.startsWith("video/")) {
        setError("Sunt permise doar fișiere video.");
        return false;
      }
      if (file.size > MAX_VIDEO_SIZE) {
        setError(`Videoclipul ${file.name} depășește limita de 100MB.`);
        return false;
      }
      return true;
    });
  };

  const handleLogoChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !setLogo) return;
    const img = new Image();
    img.src = URL.createObjectURL(file);
    img.onload = () => {
      if (img.width > 1920 || img.height > 1080) {
        setError("Rezoluția logo-ului nu poate depăși 1920x1080.");
        return;
      }
      setLogo(file);
      setError("");
    };
  };

  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    const valid = validateImages(files);
    if (images.length + valid.length > MAX_IMAGES) {
      setError(`Poți încărca maxim ${MAX_IMAGES} imagini.`);
      return;
    }
    setImages([...images, ...valid]);
    setError("");
  };

  const handleVideoUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    const valid = validateVideos(files);
    if (videos.length + valid.length > MAX_VIDEOS) {
      setError(`Poți încărca maxim ${MAX_VIDEOS} videoclipuri.`);
      return;
    }
    setVideos([...videos, ...valid]);
    setError("");
  };

  const removeImage = (index: number) => {
    const updated = images.filter((_, i) => i !== index);
    setImages(updated);
  };

  const removeVideo = (index: number) => {
    const updated = videos.filter((_, i) => i !== index);
    setVideos(updated);
  };

  const handleImageDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDraggingImages(false);
    const valid = validateImages(e.dataTransfer.files);
    if (images.length + valid.length > MAX_IMAGES) {
      setError(`Maxim ${MAX_IMAGES} imagini permise.`);
      return;
    }
    setImages([...images, ...valid]);
  };

  const handleVideoDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDraggingVideos(false);
    const valid = validateVideos(e.dataTransfer.files);
    if (videos.length + valid.length > MAX_VIDEOS) {
      setError(`Maxim ${MAX_VIDEOS} videoclipuri permise.`);
      return;
    }
    setVideos([...videos, ...valid]);
  };

  return (
    <Box width="100%" maxWidth={isXs ? "100%" : 600} mx="auto" mt={4} px={isXs ? 1 : 0}>
      {/* Logo */}
      <ThumbnailWrapper>
        <Typography variant="h6">Logo agenție/dezvoltator (opțional)</Typography>
        <ThumbnailBox onClick={() => logoInputRef.current?.click()}>
          {logoPreview ? (
            <ThumbnailPreviewImage src={logoPreview} />
          ) : (
            <Typography color="textSecondary">Apasă pentru a încărca</Typography>
          )}
        </ThumbnailBox>
        <input
          type="file"
          accept="image/*"
          ref={logoInputRef}
          style={{ display: "none" }}
          onChange={handleLogoChange}
        />
      </ThumbnailWrapper>

      {/* Imagini */}
      <Typography mt={4} variant="h6">
        Imagini
      </Typography>
      <UploadInfoBox
        maxFiles={MAX_IMAGES}
        maxSizeMB={MAX_IMAGE_SIZE / 1024 / 1024}
        allowedTypes={["JPG", "PNG", "WEBP"]}
        uploadedCount={images.length}
      />
      <DropArea
        $isDragging={isDraggingImages}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDraggingImages(true);
        }}
        onDragLeave={() => setIsDraggingImages(false)}
        onDrop={handleImageDrop}
        onClick={() => imageInputRef.current?.click()}
      >
        Trage imaginile aici sau apasă pentru a selecta
      </DropArea>
      <input
        type="file"
        accept="image/*"
        multiple
        ref={imageInputRef}
        style={{ display: "none" }}
        onChange={handleImageUpload}
      />
      <PreviewContainer>
        {imagePreviews.map((src, idx) => (
          <PreviewImage key={idx} src={src} alt="previzualizare" onClick={() => removeImage(idx)} />
        ))}
      </PreviewContainer>

      {/* Videoclipuri */}
      <Typography mt={4} variant="h6">
        Videoclipuri
      </Typography>
      <UploadInfoBox
        maxFiles={MAX_VIDEOS}
        maxSizeMB={MAX_VIDEO_SIZE / 1024 / 1024}
        allowedTypes={["MP4", "WEBM", "MOV"]}
        uploadedCount={videos.length}
      />
      <DropArea
        $isDragging={isDraggingVideos}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDraggingVideos(true);
        }}
        onDragLeave={() => setIsDraggingVideos(false)}
        onDrop={handleVideoDrop}
        onClick={() => videoInputRef.current?.click()}
      >
        Trage videoclipurile aici sau apasă pentru a selecta
      </DropArea>
      <input
        type="file"
        accept="video/*"
        multiple
        ref={videoInputRef}
        style={{ display: "none" }}
        onChange={handleVideoUpload}
      />
      <PreviewContainer>
        {videoPreviews.map((src, idx) => (
          <PreviewVideo key={idx} src={src} controls onClick={() => removeVideo(idx)} />
        ))}
      </PreviewContainer>

      {/* Eroare */}
      {error && (
        <Typography color="error" mt={2} align="center">
          {error}
        </Typography>
      )}
    </Box>
  );
};

export default MediaUploader;
